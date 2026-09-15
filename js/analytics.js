// ============================================
// ANALYTICS — GA4 custom events
// One listener layer over the whole desktop.
// No markup changes needed: everything is
// event delegation + a couple of observers.
// Add ?ga_debug to the URL to see events in
// GA4 DebugView.
// ============================================

(function () {
  "use strict";

  var DEBUG = /[?&]ga_debug/.test(window.location.search);

  function track(name, params) {
    params = params || {};
    if (DEBUG) params.debug_mode = true;
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  }

  // Where on the desktop did the click happen?
  function locationOf(el) {
    if (el.closest(".desktop-bio")) return "bio";
    if (el.closest(".start-menu")) return "start_menu";
    if (el.closest(".desktop-icons")) return "desktop";
    var win = el.closest(".xp-window");
    if (win) return win.id.replace("window-", "");
    return "other";
  }

  function textOf(el, sel) {
    var node = el && el.querySelector(sel);
    return node ? node.textContent.replace(/\s+/g, " ").trim().slice(0, 100) : undefined;
  }

  var isTouch = "ontouchstart" in window;

  // ===== Window opens (desktop icons + start menu) =====
  function windowOpen(el) {
    track("window_open", {
      window_name: el.dataset.window,
      source: el.classList.contains("start-menu-item") ? "start_menu" : "desktop",
    });
  }

  document.addEventListener(isTouch ? "click" : "dblclick", function (e) {
    var icon = e.target.closest(".desktop-icon[data-window]");
    if (icon) windowOpen(icon);
    var resume = e.target.closest(".desktop-icon[data-href]");
    if (resume) track("resume_download", { link_location: "desktop" });
  });

  document.addEventListener("click", function (e) {
    var item = e.target.closest(".start-menu-item[data-window]");
    if (item) windowOpen(item);
    if (e.target.closest("#startBtn")) track("start_menu_open");
  });

  // ===== Outbound links =====
  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href");
      var where = locationOf(a);

      if (href.indexOf("mailto:") === 0) {
        track("email_click", { link_location: where });
        return;
      }
      if (/\.pdf$/i.test(href)) {
        track("resume_download", { link_location: where });
        return;
      }
      if (!/^https?:/i.test(href)) return;

      var host = "";
      try {
        host = new URL(href).hostname.replace(/^www\./, "");
      } catch (err) {
        return;
      }

      var card = a.closest(".project-card");
      var blog = a.closest(".blog-card");
      var base = { link_location: where, link_domain: host, link_url: href };

      if (card) {
        track("project_click", {
          project_name: textOf(card, "h3"),
          project_org: textOf(card, ".project-org"),
          link_domain: host,
        });
      }
      if (blog) {
        track("blog_click", { blog_title: textOf(blog, "h3") });
      }

      if (host === "github.com") track("github_click", base);
      else if (host === "linkedin.com") track("linkedin_click", base);
      else if (host === "medium.com") track("medium_click", base);
      else if (host === "apps.apple.com")
        track("app_store_click", { store: "apple", link_location: where });
      else if (host === "play.google.com")
        track("app_store_click", { store: "google", link_location: where });
      else track("outbound_click", base);
    },
    true // capture: runs before any handler that might stop propagation
  );

  // ===== Interview Me questions =====
  // Capture phase so we read the input before script.js clears it.
  document.addEventListener(
    "click",
    function (e) {
      var s = e.target.closest(".suggestion-btn");
      if (s) {
        track("interview_question", { question: s.dataset.q, source: "suggestion" });
        return;
      }
      if (e.target.closest("#interviewSend")) {
        var v = (document.getElementById("interviewInput") || {}).value;
        if (v && v.trim())
          track("interview_question", { question: v.trim().slice(0, 100), source: "typed" });
      }
    },
    true
  );

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key !== "Enter" || e.target.id !== "interviewInput") return;
      var v = e.target.value;
      if (v && v.trim())
        track("interview_question", { question: v.trim().slice(0, 100), source: "typed" });
    },
    true
  );

  // ===== Minesweeper outcome (watch the smiley face) =====
  var face = document.getElementById("mineFace");
  if (face && window.MutationObserver) {
    new MutationObserver(function () {
      var t = face.textContent;
      if (t === "\u{1F60E}") track("minesweeper_win");
      else if (t === "\u{1F635}") track("minesweeper_lose");
    }).observe(face, { childList: true, characterData: true, subtree: true });
  }

  // ===== Breakout (watch what the game adds to <body>) =====
  if (window.MutationObserver) {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, function (n) {
          if (n.nodeType !== 1) return;
          if (n.id === "breakoutCanvas") {
            track("breakout_start");
            return;
          }
          if (!n.classList || !n.classList.contains("xp-dialog-overlay")) return;
          var title = textOf(n, ".title-bar-text") || "";
          var body = textOf(n, ".xp-dialog-body p") || "";
          if (title === "Game over") {
            var d = body.match(/destroyed (\d+) of (\d+)/);
            track("breakout_lose", {
              targets_destroyed: d ? +d[1] : undefined,
              targets_total: d ? +d[2] : undefined,
            });
          } else if (title === "Desktop restored") {
            var mm = body.match(/(\d+)m/);
            var ss = body.match(/(\d+)s/);
            track("breakout_win", {
              time_seconds: (mm ? +mm[1] * 60 : 0) + (ss ? +ss[1] : 0),
            });
          } else if (title === "Breakout.exe") {
            track("breakout_blocked_mobile");
          }
        });
      });
    }).observe(document.body, { childList: true });
  }
})();
