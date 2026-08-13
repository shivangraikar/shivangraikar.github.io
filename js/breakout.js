// ============================================
// BREAKOUT.EXE — destroy the desktop
// Paddle + ball on a canvas overlay; the real
// desktop icons and bio card are the bricks.
// ============================================

(function () {
  "use strict";

  var icon = document.getElementById("breakoutIcon");
  if (!icon) return;

  var TASKBAR_H = 36;
  var PADDLE_W = 110;
  var PADDLE_H = 14;
  var BALL_R = 8;
  var BASE_SPEED = 340; // px/sec
  var MAX_SPEED = 720;
  var BOSS_HP = 3;

  var canvas, ctx, hud;
  var state = "idle"; // idle | aiming | playing | finale
  var targets = [];
  var paddleX = 0;
  var ball = { x: 0, y: 0, vx: 0, vy: 0, speed: BASE_SPEED };
  var lives = 3;
  var destroyed = 0;
  var startTime = 0;
  var lastFrame = 0;
  var rafId = null;
  var aimMoved = 0;
  var lastMouseX = null;

  // ---------- Setup / teardown ----------

  function buildOverlay() {
    canvas = document.createElement("canvas");
    canvas.id = "breakoutCanvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - TASKBAR_H;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");

    hud = document.createElement("div");
    hud.id = "breakoutHud";
    document.body.appendChild(hud);
    updateHud("Move the paddle • Click or press Space to launch");
  }

  function removeOverlay() {
    if (canvas) canvas.remove();
    if (hud) hud.remove();
    canvas = ctx = hud = null;
  }

  function collectTargets() {
    targets = [];
    document.querySelectorAll(".desktop-icon").forEach(function (el) {
      targets.push({ el: el, hp: 1, alive: true, rect: null });
    });
    var bio = document.querySelector(".desktop-bio");
    if (bio) targets.push({ el: bio, hp: BOSS_HP, alive: true, rect: null });
    measureTargets();
  }

  function measureTargets() {
    targets.forEach(function (t) {
      if (t.alive) t.rect = t.el.getBoundingClientRect();
    });
  }

  function closeAllWindows() {
    document.querySelectorAll(".xp-window").forEach(function (w) {
      if (w.style.display !== "none") {
        var btn = w.querySelector(".btn-close");
        if (btn) btn.click();
      }
    });
    var sm = document.getElementById("startMenu");
    if (sm) sm.style.display = "none";
  }

  function restoreDesktop() {
    targets.forEach(function (t) {
      t.el.classList.remove("brick-poof", "boss-hit-1", "boss-hit-2", "brick-shake");
      t.el.style.visibility = "";
    });
    document.body.classList.remove("breakout-active");
  }

  // ---------- Game flow ----------

  function startGame() {
    if (state !== "idle") return;
    if (window.innerWidth < 768) {
      xpDialog(
        "Breakout.exe",
        "This game needs a mouse and a big screen — it's best played on a computer. Everything else here works great on your phone though!",
        [{ label: "OK", action: function () {} }]
      );
      return;
    }
    closeAllWindows();
    document.body.classList.add("breakout-active");
    collectTargets();
    buildOverlay();
    lives = 3;
    destroyed = 0;
    aimMoved = 0;
    lastMouseX = null;
    startTime = performance.now();
    paddleX = window.innerWidth / 2;
    resetBall();
    state = "aiming";
    lastFrame = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function resetBall() {
    ball.x = paddleX;
    ball.y = paddleY() - BALL_R - 2;
    ball.speed = BASE_SPEED;
    ball.vx = 0;
    ball.vy = 0;
  }

  function launchBall() {
    if (state !== "aiming") return;
    state = "playing";
    var angle = (Math.random() * 0.6 - 0.3) - Math.PI / 2; // mostly upward
    ball.vx = Math.cos(angle) * ball.speed;
    ball.vy = Math.sin(angle) * ball.speed;
    updateHud(null);
  }

  function endGame(won) {
    cancelAnimationFrame(rafId);
    rafId = null;
    var elapsed = Math.round((performance.now() - startTime) / 1000);
    removeOverlay();
    if (won) {
      state = "finale";
      runShutdownFinale(elapsed);
    } else {
      state = "idle";
      restoreDesktop();
      xpDialog(
        "Game over",
        "The ball fell 3 times — the desktop survives! You destroyed " +
          destroyed +
          " of " +
          targets.length +
          " targets.",
        [
          { label: "Play again", action: startGame },
          { label: "Close", action: function () {} },
        ]
      );
    }
  }

  function quitGame() {
    if (state === "idle" || state === "finale") return;
    cancelAnimationFrame(rafId);
    rafId = null;
    removeOverlay();
    restoreDesktop();
    state = "idle";
  }

  // ---------- Physics ----------

  function paddleY() {
    return window.innerHeight - TASKBAR_H - 28;
  }

  function loop(now) {
    var dt = Math.min((now - lastFrame) / 1000, 0.035);
    lastFrame = now;

    if (state === "aiming") {
      ball.x = paddleX;
      ball.y = paddleY() - BALL_R - 2;
    } else if (state === "playing") {
      stepBall(dt);
    }
    if (state === "aiming" || state === "playing") {
      draw();
      rafId = requestAnimationFrame(loop);
    }
  }

  function stepBall(dt) {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    var w = canvas.width;

    // Walls
    if (ball.x - BALL_R < 0) {
      ball.x = BALL_R;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x + BALL_R > w) {
      ball.x = w - BALL_R;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - BALL_R < 0) {
      ball.y = BALL_R;
      ball.vy = Math.abs(ball.vy);
    }

    // Paddle
    var py = paddleY();
    if (
      ball.vy > 0 &&
      ball.y + BALL_R >= py &&
      ball.y + BALL_R <= py + PADDLE_H + 10 &&
      ball.x >= paddleX - PADDLE_W / 2 - BALL_R &&
      ball.x <= paddleX + PADDLE_W / 2 + BALL_R
    ) {
      var offset = (ball.x - paddleX) / (PADDLE_W / 2);
      offset = Math.max(-1, Math.min(1, offset));
      var bounceAngle = offset * (Math.PI / 3) - Math.PI / 2; // up to 60deg
      ball.speed = Math.min(ball.speed * 1.04, MAX_SPEED);
      ball.vx = Math.cos(bounceAngle) * ball.speed;
      ball.vy = Math.sin(bounceAngle) * ball.speed;
      ball.y = py - BALL_R;
    }

    // Fell off the bottom
    if (ball.y - BALL_R > canvas.height + 10) {
      lives--;
      if (lives <= 0) {
        endGame(false);
        return;
      }
      state = "aiming";
      resetBall();
      updateHud("Ball lost! Click or press Space to relaunch");
      return;
    }

    // Bricks
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (!t.alive) continue;
      var r = t.rect;
      var cx = Math.max(r.left, Math.min(ball.x, r.right));
      var cy = Math.max(r.top, Math.min(ball.y, r.bottom));
      var dx = ball.x - cx;
      var dy = ball.y - cy;
      if (dx * dx + dy * dy <= BALL_R * BALL_R) {
        hitTarget(t);
        // Bounce along the axis of least penetration
        var overlapX = BALL_R - Math.abs(dx);
        var overlapY = BALL_R - Math.abs(dy);
        if (Math.abs(dx) > Math.abs(dy)) {
          ball.vx = dx >= 0 ? Math.abs(ball.vx) : -Math.abs(ball.vx);
          ball.x += dx >= 0 ? overlapX : -overlapX;
        } else {
          ball.vy = dy >= 0 ? Math.abs(ball.vy) : -Math.abs(ball.vy);
          ball.y += dy >= 0 ? overlapY : -overlapY;
        }
        break;
      }
    }
  }

  function hitTarget(t) {
    t.hp--;
    if (t.hp <= 0) {
      t.alive = false;
      destroyed++;
      t.el.classList.add("brick-poof");
      (function (el) {
        setTimeout(function () {
          if (state !== "idle") el.style.visibility = "hidden";
        }, 260);
      })(t.el);
      updateHud(null);
      var remaining = targets.filter(function (x) {
        return x.alive;
      }).length;
      if (remaining === 0) {
        setTimeout(function () {
          endGame(true);
        }, 400);
      }
    } else {
      // Boss damage states
      t.el.classList.remove("brick-shake");
      void t.el.offsetWidth; // restart animation
      t.el.classList.add("brick-shake");
      t.el.classList.add("boss-hit-" + (BOSS_HP - t.hp));
      t.rect = t.el.getBoundingClientRect();
    }
  }

  // ---------- Rendering ----------

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Paddle
    var py = paddleY();
    var grad = ctx.createLinearGradient(0, py, 0, py + PADDLE_H);
    grad.addColorStop(0, "#4d94f7");
    grad.addColorStop(0.5, "#2264d1");
    grad.addColorStop(1, "#1941a5");
    ctx.fillStyle = grad;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(paddleX - PADDLE_W / 2, py, PADDLE_W, PADDLE_H, 7);
    } else {
      ctx.rect(paddleX - PADDLE_W / 2, py, PADDLE_W, PADDLE_H);
    }
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ball
    var bg = ctx.createRadialGradient(
      ball.x - 3,
      ball.y - 3,
      1,
      ball.x,
      ball.y,
      BALL_R
    );
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(1, "#c0c0c0");
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.stroke();
  }

  function updateHud(msg) {
    if (!hud) return;
    var remaining = targets.filter(function (t) {
      return t.alive;
    }).length;
    var hearts = "";
    for (var i = 0; i < 3; i++) {
      hearts += i < lives ? "●" : "○";
    }
    hud.innerHTML =
      "<span class='bh-lives'>" +
      hearts +
      "</span> Targets left: " +
      remaining +
      " • ESC to quit" +
      (msg ? "<div class='bh-msg'>" + msg + "</div>" : "");
  }

  // ---------- XP dialog helper ----------

  function xpDialog(title, text, buttons) {
    var overlay = document.createElement("div");
    overlay.className = "xp-dialog-overlay";
    var box = document.createElement("div");
    box.className = "xp-dialog";
    var tb = document.createElement("div");
    tb.className = "title-bar xp-dialog-title";
    tb.innerHTML = "<span class='title-bar-text'>" + title + "</span>";
    var body = document.createElement("div");
    body.className = "xp-dialog-body";
    var p = document.createElement("p");
    p.textContent = text;
    body.appendChild(p);
    var btnRow = document.createElement("div");
    btnRow.className = "xp-dialog-btns";
    buttons.forEach(function (b) {
      var btn = document.createElement("button");
      btn.textContent = b.label;
      btn.addEventListener("click", function () {
        overlay.remove();
        b.action();
      });
      btnRow.appendChild(btn);
    });
    body.appendChild(btnRow);
    box.appendChild(tb);
    box.appendChild(body);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  // ---------- Win finale: shutdown + reboot ----------

  function runShutdownFinale(elapsedSec) {
    var fin = document.createElement("div");
    fin.id = "breakoutFinale";
    document.body.appendChild(fin);
    var skip = false;
    fin.addEventListener("click", function () {
      skip = true;
      next();
    });

    var steps = [
      function shuttingDown() {
        fin.className = "finale-shutdown";
        fin.innerHTML =
          "<div class='finale-center'><div class='finale-logo'></div>" +
          "<p>You destroyed the entire desktop.</p><p>Windows is shutting down…</p></div>";
        return 2200;
      },
      function safeToTurnOff() {
        fin.className = "finale-black";
        fin.innerHTML =
          "<div class='finale-center'><p class='finale-amber'>It is now safe to turn off<br/>your computer.</p>" +
          "<p class='finale-dim'>(just kidding — rebooting)</p></div>";
        return 2600;
      },
      function booting() {
        fin.className = "finale-boot";
        fin.innerHTML =
          "<div class='finale-center'><div class='finale-logo'></div>" +
          "<h2>Shivang<span>XP</span></h2>" +
          "<div class='boot-bar'><div class='boot-chunk'></div><div class='boot-chunk'></div><div class='boot-chunk'></div></div></div>";
        return 3000;
      },
      function done() {
        fin.remove();
        state = "idle";
        restoreDesktop();
        var mins = Math.floor(elapsedSec / 60);
        var secs = elapsedSec % 60;
        var timeStr = (mins ? mins + "m " : "") + secs + "s";
        xpDialog(
          "Desktop restored",
          "Nice arm! You cleared all " +
            targets.length +
            " targets in " +
            timeStr +
            ". The desktop has been rebuilt — no engineers were harmed.",
          [
            { label: "Play again", action: startGame },
            { label: "Back to browsing", action: function () {} },
          ]
        );
        return -1;
      },
    ];

    var idx = 0;
    var timer = null;
    function next() {
      if (timer) clearTimeout(timer);
      if (idx >= steps.length) return;
      var wait = steps[idx++]();
      if (wait >= 0 && idx < steps.length + 1) {
        timer = setTimeout(next, skip ? Math.min(wait, 400) : wait);
      }
    }
    next();
  }

  // ---------- Input ----------

  document.addEventListener("mousemove", function (e) {
    if (state !== "aiming" && state !== "playing") return;
    if (lastMouseX !== null && state === "aiming") {
      aimMoved += Math.abs(e.clientX - lastMouseX);
      if (aimMoved > 400) launchBall();
    }
    lastMouseX = e.clientX;
    paddleX = Math.max(
      PADDLE_W / 2,
      Math.min(e.clientX, window.innerWidth - PADDLE_W / 2)
    );
  });

  document.addEventListener("click", function () {
    if (state === "aiming") launchBall();
  });

  document.addEventListener("keydown", function (e) {
    if (state === "idle" || state === "finale") return;
    if (e.key === "Escape") {
      quitGame();
    } else if (e.key === " ") {
      e.preventDefault();
      if (state === "aiming") launchBall();
    } else if (e.key === "ArrowLeft") {
      paddleX = Math.max(PADDLE_W / 2, paddleX - 40);
    } else if (e.key === "ArrowRight") {
      paddleX = Math.min(window.innerWidth - PADDLE_W / 2, paddleX + 40);
    }
  });

  window.addEventListener("resize", function () {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - TASKBAR_H;
    measureTargets();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && state === "playing") {
      // Pause: park the ball on the paddle again
      state = "aiming";
      resetBall();
      updateHud("Paused — click or press Space to relaunch");
    }
  });

  // Launch from the icon (dblclick, Enter, or tap)
  icon.addEventListener("dblclick", startGame);
  icon.addEventListener("keydown", function (e) {
    if (e.key === "Enter") startGame();
  });
  if ("ontouchstart" in window) {
    icon.addEventListener("click", startGame);
  }
})();
