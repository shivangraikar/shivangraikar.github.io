// ============================================
// NERDY WALLPAPER , Animated CS Background
// ============================================

(function () {
  "use strict";

  const canvas = document.getElementById("nerdBg");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 36;
  }
  resize();
  window.addEventListener("resize", resize);

  // --- Nerd content pools ---
  const codeSnippets = [
    "def twoSum(nums, t):",
    "  seen = {}",
    "  for i, n in enumerate(nums):",
    "    if t - n in seen:",
    "      return [seen[t-n], i]",
    "    seen[n] = i",
    "function fib(n) {",
    "  return n <= 1 ? n : fib(n-1) + fib(n-2);",
    "}",
    "while (lo <= hi) {",
    "  mid = (lo + hi) >> 1;",
    "  if (arr[mid] === target) return mid;",
    "}",
    "node.next = prev;",
    "prev = node;",
    "node = next;",
    "if (root === null) return 0;",
    "return 1 + Math.max(dfs(root.left), dfs(root.right));",
    "dp[i] = dp[i-1] + dp[i-2];",
    "for (let [k, v] of map) {",
    "  adj[u].push(v);",
    "SELECT * FROM engineers WHERE coffee > 3;",
    'git commit -m "fix: off by one"',
    "import numpy as np",
    "docker run -d -p 80:80 nginx",
    "curl -X POST /api/v1/deploy",
    "const memoize = (fn) => {",
    "  const cache = new Map();",
    "class TreeNode:",
    "  def __init__(self, val=0):",
    "    self.left = None",
    "    self.right = None",
    "while queue:",
    "  node = queue.popleft()",
    "  for nei in graph[node]:",
  ];

  const csNotations = [
    "O(n log n)",
    "O(1)",
    "O(n²)",
    "O(2ⁿ)",
    "O(n!)",
    "P ≠ NP ?",
    "∀x ∈ S",
    "λx.x",
    "∑(i=0..n)",
    "f: X → Y",
    "∃x : P(x)",
    "∅",
    "∞",
    "E = mc²",
    "∂f/∂x",
    "∫₀ⁿ f(x)dx",
    "NP-hard",
    "Θ(n)",
    "Ω(log n)",
    "a ⊕ b",
    "¬(A ∧ B)",
    "A ∨ B",
  ];

  const binaryFragments = [];
  for (let i = 0; i < 30; i++) {
    let s = "";
    const len = 8 + Math.floor(Math.random() * 16);
    for (let j = 0; j < len; j++) s += Math.random() > 0.5 ? "1" : "0";
    binaryFragments.push(s);
  }
  binaryFragments.push(
    "0xDEADBEEF",
    "0xCAFEBABE",
    "0xFF",
    "0x7F",
    "127.0.0.1",
    "::1",
    "404",
    "200 OK",
    "301",
    "sudo !!",
  );

  const asciiArt = [
    "[3]→[7]→[1]→∅",
    "{k: v}",
    "stack.push(42)",
    "queue.deq()",
    "<html/>",
    "/* TODO */",
    "// HACK",
    ">>>",
    "$ _",
    "~/.config",
    "chmod 755",
    "ssh root@",
    "ping -c 4",
    "|> pipe",
    "=> arrow",
  ];

  // --- Floating elements ---
  const elements = [];
  const ELEMENT_COUNT = 55;

  function randomPool() {
    const r = Math.random();
    if (r < 0.35)
      return {
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        type: "code",
      };
    if (r < 0.55)
      return {
        text: csNotations[Math.floor(Math.random() * csNotations.length)],
        type: "math",
      };
    if (r < 0.8)
      return {
        text: binaryFragments[
          Math.floor(Math.random() * binaryFragments.length)
        ],
        type: "binary",
      };
    return {
      text: asciiArt[Math.floor(Math.random() * asciiArt.length)],
      type: "ascii",
    };
  }

  function spawnElement(startOffscreen) {
    const pool = randomPool();
    const size =
      pool.type === "binary"
        ? 11 + Math.random() * 4
        : pool.type === "math"
          ? 14 + Math.random() * 8
          : pool.type === "code"
            ? 12 + Math.random() * 3
            : 11 + Math.random() * 5;

    const baseAlpha = 0.04 + Math.random() * 0.1;

    return {
      text: pool.text,
      type: pool.type,
      x: Math.random() * canvas.width,
      y: startOffscreen
        ? canvas.height + 20 + Math.random() * 200
        : Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.1 + Math.random() * 0.35),
      size: size,
      alpha: baseAlpha,
      maxAlpha: baseAlpha,
      rotation: (Math.random() - 0.5) * 0.15,
      life: 0,
      maxLife: 600 + Math.random() * 1200,
    };
  }

  for (let i = 0; i < ELEMENT_COUNT; i++) {
    elements.push(spawnElement(false));
  }

  // --- Binary rain columns (subtle matrix-style) ---
  const RAIN_COLS = Math.floor(canvas.width / 60);
  const rainDrops = [];
  for (let i = 0; i < RAIN_COLS; i++) {
    rainDrops.push({
      x: i * 60 + 30 + (Math.random() - 0.5) * 20,
      y: Math.random() * canvas.height,
      speed: 0.3 + Math.random() * 0.6,
      chars: [],
      length: 4 + Math.floor(Math.random() * 8),
      alpha: 0.03 + Math.random() * 0.06,
    });
  }

  // --- Grid pattern ---
  function drawGrid() {
    ctx.strokeStyle = "rgba(100, 200, 255, 0.015)";
    ctx.lineWidth = 0.5;
    const spacing = 40;
    for (let x = 0; x < canvas.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // --- Node graph decoration ---
  const graphNodes = [];
  const NODE_COUNT = 12;
  for (let i = 0; i < NODE_COUNT; i++) {
    graphNodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: 3 + Math.random() * 4,
    });
  }

  function drawGraph() {
    const maxDist = 180;
    ctx.lineWidth = 0.5;

    // Draw edges
    for (let i = 0; i < graphNodes.length; i++) {
      for (let j = i + 1; j < graphNodes.length; j++) {
        const dx = graphNodes[i].x - graphNodes[j].x;
        const dy = graphNodes[i].y - graphNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const a = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = "rgba(100, 200, 255, " + a + ")";
          ctx.beginPath();
          ctx.moveTo(graphNodes[i].x, graphNodes[i].y);
          ctx.lineTo(graphNodes[j].x, graphNodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of graphNodes) {
      ctx.fillStyle = "rgba(100, 200, 255, 0.12)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Move
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    }
  }

  // --- Render loop ---
  function getColor(type, alpha) {
    if (type === "code") return "rgba(0, 255, 136, " + alpha + ")";
    if (type === "math") return "rgba(180, 140, 255, " + alpha + ")";
    if (type === "binary") return "rgba(0, 200, 255, " + alpha + ")";
    return "rgba(255, 200, 80, " + alpha + ")";
  }

  function getFont(type, size) {
    if (type === "math") return size + "px 'Georgia', serif";
    return size + "px 'Courier New', monospace";
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawGraph();

    // Binary rain
    for (const drop of rainDrops) {
      for (let i = 0; i < drop.length; i++) {
        const charY = drop.y - i * 14;
        if (charY < -20 || charY > canvas.height + 20) continue;
        const fade = 1 - i / drop.length;
        const a = drop.alpha * fade;
        ctx.fillStyle = "rgba(0, 255, 136, " + a + ")";
        ctx.font = "11px 'Courier New', monospace";
        const ch = Math.random() > 0.5 ? "1" : "0";
        ctx.fillText(ch, drop.x, charY);
      }
      drop.y += drop.speed;
      if (drop.y - drop.length * 14 > canvas.height) {
        drop.y = -drop.length * 14;
        drop.x = drop.x + (Math.random() - 0.5) * 30;
      }
    }

    // Floating elements
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      el.life++;

      // Fade in / out
      const fadeIn = Math.min(el.life / 60, 1);
      const fadeOut = Math.max(1 - (el.life - el.maxLife + 120) / 120, 0);
      el.alpha =
        el.maxAlpha * fadeIn * (el.life > el.maxLife - 120 ? fadeOut : 1);

      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.rotate(el.rotation);
      ctx.font = getFont(el.type, el.size);
      ctx.fillStyle = getColor(el.type, el.alpha);
      ctx.fillText(el.text, 0, 0);
      ctx.restore();

      el.x += el.vx;
      el.y += el.vy;

      // Respawn when dead or off screen
      if (el.life > el.maxLife || el.y < -50) {
        elements[i] = spawnElement(true);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

// ============================================
// PORTFOLIO , Shivang Raikar
// Windows XP Desktop , Window Management
// ============================================

(function () {
  "use strict";

  let zCounter = 200;
  const openWindows = new Map(); // windowId -> { el, minimized, taskbarBtn }

  // ===== Clock =====
  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    document.getElementById("trayClock").textContent = h + ":" + m + " " + ampm;
  }
  updateClock();
  setInterval(updateClock, 30000);

  // ===== Open a window =====
  function openWindow(windowId) {
    const el = document.getElementById("window-" + windowId);
    if (!el) return;

    // If already open, just focus/restore
    if (openWindows.has(windowId)) {
      const state = openWindows.get(windowId);
      if (state.minimized) {
        el.style.display = "";
        state.minimized = false;
        state.taskbarBtn.classList.remove("minimized");
        state.taskbarBtn.classList.add("active");
      }
      focusWindow(windowId);
      return;
    }

    // Position window
    const offset = openWindows.size * 30;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      el.style.top = "0px";
      el.style.left = "0px";
      el.style.width = "100%";
      el.style.height = "calc(100% - 36px)";
    } else {
      el.style.top = 60 + offset + "px";
      el.style.left = 80 + offset + "px";
      el.style.width = el.dataset.width || "700px";
      el.style.height = el.dataset.height || "500px";
    }
    el.style.display = "";

    // Create taskbar button
    const btn = document.createElement("button");
    btn.className = "taskbar-btn active";
    btn.textContent = el.querySelector(".title-bar-text").textContent;
    btn.addEventListener("click", function () {
      toggleWindow(windowId);
    });
    document.getElementById("taskbarWindows").appendChild(btn);

    openWindows.set(windowId, { el: el, minimized: false, taskbarBtn: btn });
    focusWindow(windowId);

    // Close start menu
    document.getElementById("startMenu").style.display = "none";
  }

  // ===== Focus window =====
  function focusWindow(windowId) {
    zCounter++;
    openWindows.forEach(function (state, id) {
      state.el.classList.remove("focused");
      state.taskbarBtn.classList.remove("active");
    });
    const state = openWindows.get(windowId);
    if (state) {
      state.el.style.zIndex = zCounter;
      state.el.classList.add("focused");
      state.taskbarBtn.classList.add("active");
    }
  }

  // ===== Minimize =====
  function minimizeWindow(windowId) {
    const state = openWindows.get(windowId);
    if (!state) return;
    state.el.style.display = "none";
    state.minimized = true;
    state.taskbarBtn.classList.remove("active");
    state.taskbarBtn.classList.add("minimized");
  }

  // ===== Toggle (taskbar click) =====
  function toggleWindow(windowId) {
    const state = openWindows.get(windowId);
    if (!state) return;
    if (state.minimized) {
      state.el.style.display = "";
      state.minimized = false;
      state.taskbarBtn.classList.remove("minimized");
      focusWindow(windowId);
    } else if (state.el.classList.contains("focused")) {
      minimizeWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  }

  // ===== Maximize =====
  function maximizeWindow(windowId) {
    const state = openWindows.get(windowId);
    if (!state) return;
    state.el.classList.toggle("maximized");
  }

  // ===== Close =====
  function closeWindow(windowId) {
    const state = openWindows.get(windowId);
    if (!state) return;
    state.el.style.display = "none";
    state.el.classList.remove("focused", "maximized");
    state.taskbarBtn.remove();
    openWindows.delete(windowId);
  }

  // ===== Dragging =====
  function makeDraggable(windowEl) {
    const titleBar = windowEl.querySelector(".title-bar");
    let isDragging = false;
    let startX, startY, origX, origY;

    titleBar.addEventListener("mousedown", function (e) {
      if (e.target.tagName === "BUTTON") return;
      if (windowEl.classList.contains("maximized")) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = windowEl.offsetLeft;
      origY = windowEl.offsetTop;
      titleBar.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      windowEl.style.left = origX + e.clientX - startX + "px";
      windowEl.style.top = origY + e.clientY - startY + "px";
    });

    document.addEventListener("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        titleBar.style.cursor = "grab";
      }
    });

    // Touch support
    titleBar.addEventListener(
      "touchstart",
      function (e) {
        if (e.target.tagName === "BUTTON") return;
        if (windowEl.classList.contains("maximized")) return;
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        origX = windowEl.offsetLeft;
        origY = windowEl.offsetTop;
      },
      { passive: true },
    );

    document.addEventListener(
      "touchmove",
      function (e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        windowEl.style.left = origX + touch.clientX - startX + "px";
        windowEl.style.top = origY + touch.clientY - startY + "px";
      },
      { passive: true },
    );

    document.addEventListener("touchend", function () {
      isDragging = false;
    });
  }

  // ===== Init windows =====
  document.querySelectorAll(".xp-window").forEach(function (win) {
    const windowId = win.id.replace("window-", "");

    // Click to focus
    win.addEventListener("mousedown", function () {
      focusWindow(windowId);
    });

    // Title bar buttons
    win.querySelector(".btn-close").addEventListener("click", function () {
      closeWindow(windowId);
    });
    win.querySelector(".btn-minimize").addEventListener("click", function () {
      minimizeWindow(windowId);
    });
    win.querySelector(".btn-maximize").addEventListener("click", function () {
      maximizeWindow(windowId);
    });

    makeDraggable(win);
  });

  // ===== Desktop icons (double-click) =====
  document.querySelectorAll(".desktop-icon").forEach(function (icon) {
    // Icons with data-href open a link (e.g. Resume.pdf) instead of a window
    function activate() {
      if (icon.dataset.href) {
        window.open(icon.dataset.href, "_blank");
      } else {
        openWindow(icon.dataset.window);
      }
    }

    icon.addEventListener("dblclick", activate);

    // Also open on Enter key
    icon.addEventListener("keydown", function (e) {
      if (e.key === "Enter") activate();
    });

    // Mobile: single tap
    if ("ontouchstart" in window) {
      icon.addEventListener("click", activate);
    }
  });

  // ===== Start Menu =====
  var startBtn = document.getElementById("startBtn");
  var startMenu = document.getElementById("startMenu");

  startBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    startMenu.style.display = startMenu.style.display === "none" ? "" : "none";
  });

  document.addEventListener("click", function (e) {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
      startMenu.style.display = "none";
    }
  });

  // Start menu items that open windows
  document
    .querySelectorAll(".start-menu-item[data-window]")
    .forEach(function (item) {
      item.addEventListener("click", function () {
        openWindow(item.dataset.window);
      });
    });
})();

// ============================================
// INTERVIEW ME , Interactive Q&A Chatbot
// ============================================

(function () {
  "use strict";

  var answers = {
    "tell me about yourself":
      "I'm Shivang, a founding software engineer at OHM in San Francisco. I went from Mumbai to Boston to the Bay Area, picking up a CS master's and an unhealthy caffeine dependency along the way. I've shipped a mobile app to the App Store and Play Store, built multi-agent AI systems, designed client-facing APIs, and set up the CI/CD and deployment pipelines that keep it all running. I think the best code is the code you never have to explain twice, and the best engineers are the ones who stay curious. When I'm not coding, you'll find me playing whatever sport has room for one more, cooking, dancing, at the gym , or DJing at a party for fun.",

    "what is ohmie?":
      "Ohmie is OHM's AI agent , and honestly my favorite thing I've built. It started as a multi-agent system for querying operational data in plain English: payments, invoices, service history, client records. Ask 'show me overdue invoices from last month' and it orchestrates the right agents, calls the right tools, and pulls accurate answers with fuzzy knowledge extraction. Then we kept extending it: building worktypes, diagnosing service issues, scheduling next visits, parsing documents into service knowledge, summarizing logistics for clients. It's woven through the whole platform now , the web app, the APIs, the field workflows.",

    "what's your tech stack?":
      "My go-to stack: React/Next.js on the frontend, Python (Django/FastAPI) on the backend, React Native with Expo for mobile, PostgreSQL/Supabase for data, and GCP/AWS for cloud. For AI work: LLM orchestration, LangChain, OpenAI and Anthropic APIs, vector databases, RAG pipelines. Add TypeScript, Redis, Docker, TanStack Query, Zustand, and CI/CD tooling , plus Claude Code as a daily driver. I don't have religious wars about frameworks; I pick the right tool for the job. Except for tabs vs spaces. Tabs. Always tabs.",

    "what are you working on right now?":
      "I'm on the founding team at OHM, where I've built most of our product surface: Ohmie, our multi-agent AI for querying operational data in plain English; OhmControl, the operations platform that schedules, monitors, and tracks every field service job; the Ohm Field mobile app that technicians use on-site for EV charger and HVAC servicing , live on both app stores; and the integration APIs enterprise clients use to exchange work orders and inspection data with us. Being early at a startup means you own things end to end: architecture, code, deployment, monitoring, and the 2am 'is prod okay?' checks.",

    "what's your proudest project?":
      "Ohmie, OHM's AI agent. I got to architect a multi-agent system from scratch and watch it become the connective tissue of the whole product, answering operational questions, diagnosing service issues, scheduling visits, parsing documents into knowledge. Close second: the RAG document intelligence system at Steam Works Studio, which went from 'search thousands of PDF pages by hand' to natural-language answers for 200+ daily users at sub-200ms. Both had that same arc: messy real-world problem, skeptical users, and then the moment it just works. That arc is why I do this job.",

    "why should we hire you?":
      "Three reasons: First, I ship , as a founding engineer I've taken products from empty repo to app stores and production, not just whiteboards. Second, I cover the whole surface: frontend, backend, mobile, APIs, databases, CI/CD, cloud deployment, and the AI layer on top , and I've done it where there was no one else to hand things off to. Third, I actually care about the product, not just the code. The best engineers ask 'does this solve the user's problem?' before 'does this pass the linter?' Also, I write great commit messages. Mostly.",

    "what do you do outside of coding?":
      "I am a huge soccer fan and a multi-sport personality, if there's a game going, any field or court, I am always down to play. I'm committed to the gym (lifting keeps me disciplined), I cook , start with a recipe, trust the taste tests, ship the dish , and I dance. At parties I'll sometimes take over the decks and DJ, strictly for fun. I also write about AI and engineering on Medium, and I still do the occasional hackathon , most recently judging one at AWS Builder Loft.",

    "what's a fun fact about you?":
      "There's basically no sport I'll say no to. Besides that, I cook, dance, hit the gym, and at a party I might take over the decks and DJ for fun.",

    "how do you approach debugging?":
      "Step 1: Don't panic. Step 2: Read the error message. (You'd be surprised how many people skip this.) Step 3: Reproduce it. If I can't reproduce it, it didn't happen. Step 4: Binary search the problem, comment out half the code, see if it still breaks, narrow down. Step 5: Rubber duck it. Explain the problem out loud. If the duck doesn't help, I explain it to a colleague. Step 6: If all else fails, take a walk. Some of my best fixes came to me while making coffee. The real secret? Most bugs are just wrong assumptions, so I question everything I 'know' about the code.",

    "what's your experience with ai?":
      "It's my core focus. At OHM I architected Ohmie, a production multi-agent system , LLM orchestration, tool calling, knowledge extraction , that runs real operations, not demos. At Steam Works Studio I built a full RAG pipeline: document parsing with Reducto and LlamaParse, OpenAI embeddings, vector storage, semantic search for 200+ daily users. On the side I've built a GPT from scratch in PyTorch (tokenizer, attention, KV-cache, the works), analyzed AI conversations with in-browser models, and I write about agents and model evaluation on Medium. Certified AWS AI Practitioner and OCI Generative AI Professional. I also have a research background in ML and reinforcement learning , this space is exactly where I want to be.",

    "do you write?":
      "Yes! I write about AI and software engineering on Medium, and several of my pieces have been published in Towards AI. Recent ones: benchmarking Claude models on real-world tasks instead of leaderboards, pushing Supabase's free tier into a production AI system, what nobody tells you about building real AI agents, and why documentation is now how your AI actually works. Writing forces me to actually understand what I think I know , half my posts start as 'wait, why did that work?' moments on the job. Check the Blogs folder on the desktop for the full list.",

    "tell me about your education":
      "I've got a Master's in Computer Science from UMass Boston and a Bachelor's in Computer Engineering from University of Mumbai. The MS gave me a deep dive into systems, algorithms, and research , I worked at the MPsych Lab building visualization tools for cancer treatment data across 5,000+ patient records. The undergrad in Mumbai is where I caught the engineering bug, published my first research paper, and realized that hackathons are basically extreme sports for nerds.",

    "what certifications do you have?":
      "I hold three: AWS AI Practitioner, HackerRank Software Engineer, and Oracle Cloud Generative AI Professional. I'm a big believer in continuous learning , the tech landscape moves too fast to get comfortable. Certifications aren't everything, but they're a good way to validate that you actually know the things you claim to know on your resume.",

    "can you tell me about your research?":
      "I co-authored 'Twitter Data Mining for Targeted Marketing,' published at IEEE's ICIRCA 2020 conference , machine learning and NLP on Twitter data to find patterns for targeted campaigns. It was my first dive into ML and got me hooked on intelligent systems; I've since built on that with a background in reinforcement learning. At UMass Boston's MPsych Lab, I did research engineering on cancer patient data using University of Chicago datasets, building treatment outcome visualizations clinicians could actually use across 5,000+ patient records.",
  };

  // Fuzzy match
  function findAnswer(question) {
    var q = question
      .toLowerCase()
      .replace(/[?!.,]/g, "")
      .trim();

    // Direct match
    if (answers[q]) return answers[q];

    // Keyword matching
    var bestMatch = null;
    var bestScore = 0;
    var keywords = q.split(/\s+/);

    for (var key in answers) {
      var score = 0;
      for (var i = 0; i < keywords.length; i++) {
        if (key.indexOf(keywords[i]) !== -1) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    }

    if (bestScore >= 1 && bestMatch) return answers[bestMatch];

    // Topic detection fallback
    if (/ohmie/i.test(q)) return answers["what is ohmie?"];
    if (/write|writing|blog|medium|article|towards ai/i.test(q))
      return answers["do you write?"];
    if (/stack|tech|language|framework|tool/i.test(q))
      return answers["what's your tech stack?"];
    if (/work|current|now|building|ohm|founding|startup/i.test(q))
      return answers["what are you working on right now?"];
    if (/proud|best|favorite|project/i.test(q))
      return answers["what's your proudest project?"];
    if (/hire|why you|strength|stand out/i.test(q))
      return answers["why should we hire you?"];
    if (/hobby|hobbies|free time|outside|fun |relax/i.test(q))
      return answers["what do you do outside of coding?"];
    if (/fact|interesting|random|surprise/i.test(q))
      return answers["what's a fun fact about you?"];
    if (/debug|bug|fix|error|troubleshoot/i.test(q))
      return answers["how do you approach debugging?"];
    if (/ai|machine learning|llm|agent|rag/i.test(q))
      return answers["what's your experience with ai?"];
    if (/education|school|university|degree|study/i.test(q))
      return answers["tell me about your education"];
    if (/cert|certification|aws|hackerrank/i.test(q))
      return answers["what certifications do you have?"];
    if (/research|paper|publish|ieee/i.test(q))
      return answers["can you tell me about your research?"];
    if (/who|yourself|about you|intro/i.test(q))
      return answers["tell me about yourself"];

    return "Hmm, I don't have a pre-loaded answer for that one but the real Shivang would love to chat! Shoot him an email at shivangraikar@gmail.com or connect on LinkedIn. In the meantime, try asking about my tech stack, projects, experience with AI, or why you should hire me!";
  }

  var chatEl = document.getElementById("interviewChat");
  var inputEl = document.getElementById("interviewInput");
  var sendBtn = document.getElementById("interviewSend");
  var suggestionsEl = document.getElementById("interviewSuggestions");

  if (!chatEl) return;

  function addMessage(text, isUser) {
    var div = document.createElement("div");
    div.className = "chat-msg " + (isUser ? "user-msg" : "bot-msg");
    if (!isUser) {
      var sender = document.createElement("span");
      sender.className = "chat-sender";
      sender.textContent = "Shivang.exe";
      div.appendChild(sender);
    }
    var p = document.createElement("p");
    p.textContent = text;
    div.appendChild(p);
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "typing-indicator";
    div.id = "typingIndicator";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById("typingIndicator");
    if (el) el.remove();
  }

  function askQuestion(question) {
    addMessage(question, true);
    showTyping();
    var delay = 400 + Math.random() * 600;
    setTimeout(function () {
      removeTyping();
      addMessage(findAnswer(question), false);
    }, delay);
  }

  sendBtn.addEventListener("click", function () {
    var val = inputEl.value.trim();
    if (!val) return;
    inputEl.value = "";
    askQuestion(val);
  });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var val = inputEl.value.trim();
      if (!val) return;
      inputEl.value = "";
      askQuestion(val);
    }
  });

  suggestionsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".suggestion-btn");
    if (!btn) return;
    askQuestion(btn.dataset.q);
  });
})();
