// ============================================
// NERDY WALLPAPER — Animated CS Background
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
// PORTFOLIO — Shivang Raikar
// Windows XP Desktop — Window Management
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
      el.style.width = "700px";
      el.style.height = "500px";
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
    icon.addEventListener("dblclick", function () {
      openWindow(icon.dataset.window);
    });

    // Also open on Enter key
    icon.addEventListener("keydown", function (e) {
      if (e.key === "Enter") openWindow(icon.dataset.window);
    });

    // Mobile: single tap
    if ("ontouchstart" in window) {
      icon.addEventListener("click", function () {
        openWindow(icon.dataset.window);
      });
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
// INTERVIEW ME — Interactive Q&A Chatbot
// ============================================

(function () {
  "use strict";

  var answers = {
    "tell me about yourself":
      "I'm Shivang, a software engineer based in San Francisco who genuinely gets excited about building things. I went from Mumbai to Boston to the Bay Area, picking up a CS degree and an unhealthy caffeine dependency along the way. I've shipped everything from mobile apps for field technicians to multi-agent AI systems. I think the best code is the code you never have to explain twice, and the best engineers are the ones who stay curious. When I'm not coding, you'll find me traveling, reading, or pretending I'll go to the gym more often this week.",

    "what's your tech stack?":
      "My go-to stack: React/Next.js on the frontend, Python (Django/FastAPI) on the backend, PostgreSQL for data, and AWS/GCP for cloud. For AI work, I use LangChain, OpenAI APIs, and vector databases like Pinecone. I'm also comfortable with TypeScript, Go, React Native, Redis, Docker, and whatever the project demands. I don't have religious wars about frameworks and I pick the right tool for the job. Except for tabs vs spaces. Tabs. Always tabs.",

    "what are you working on right now?":
      "At OHM, I'm building a multi-agent AI system that lets people query operational data in plain English including payments, invoices, service history, you name it. Think: 'Hey, show me all overdue invoices from last month' and the AI figures out which agents to call, what data to pull, and how to present it. I also built 'OhmControl,' an operations platform that gives real-time visibility into field service jobs for EV chargers and HVAC systems. Reduced lookup times by 40%, which means less time staring at dashboards and more time actually fixing things.",

    "what's your proudest project?":
      "The RAG document intelligence system I built at Steam Works Studio. We took a messy problem of thousands of pages of curriculum materials, assessments, insurance docs, legal files and made it all searchable with natural language. Built the full pipeline: PDF parsing, chunking, embedding generation with OpenAI, vector storage, and semantic retrieval. Started in education, then expanded to insurance, clinical, and legal. 200+ daily active users with sub-200ms response times. Going from 'this is impossible' to 'this just works' is the best feeling in engineering.",

    "why should we hire you?":
      "Three reasons: First, I ship. I don't just architect systems on whiteboards — I build them, deploy them, and make sure real humans can use them. From mobile apps to AI platforms, I've done it across the full stack. Second, I learn fast. I went from zero AI/ML to building production RAG systems and multi-agent architectures within months. Third, I actually care about the product, not just the code. The best engineers ask 'does this solve the user's problem?' before 'does this pass the linter?' Also, I write great commit messages. Mostly.",

    "what do you do outside of coding?":
      "I'm big on music — it's my go-to creative outlet when my brain needs a break from debugging. I love traveling and have gone from the streets of Mumbai to exploring the U.S. coast to coast. I read a lot — mostly tech blogs and non-fiction, but I'm always open to recs. Fitness keeps me sane: gym sessions, outdoor walks around SF, the occasional hike where I dramatically pretend I'm in a movie. I also enjoy hackathons because building something wild in 24 hours with zero sleep is somehow fun to me.",

    "what's a fun fact about you?":
      "I co-authored a research paper on Twitter data mining for targeted marketing while still in undergrad in Mumbai. It got published at an IEEE conference (ICIRCA 2020). So technically, I was doing 'AI and machine learning' before it was cool. Also, I once participated in over 10 hackathons — at some point you stop counting and just accept that your sleep schedule will never recover. And yes, my first instinct when something breaks is to add a console.log. I'm not ashamed.",

    "how do you approach debugging?":
      "Step 1: Don't panic. Step 2: Read the error message. (You'd be surprised how many people skip this.) Step 3: Reproduce it. If I can't reproduce it, it didn't happen. Step 4: Binary search the problem, comment out half the code, see if it still breaks, narrow down. Step 5: Rubber duck it. Explain the problem out loud. If the duck doesn't help, I explain it to a colleague. Step 6: If all else fails, take a walk. Some of my best fixes came to me while making coffee. The real secret? Most bugs are just wrong assumptions, so I question everything I 'know' about the code.",

    "what's your experience with ai?":
      "AI has been a huge focus for me over the past couple years. At OHM, I'm building multi-agent AI systems with LLM orchestration for querying operational data. At Steam Works Studio, I built a full RAG pipeline — document parsing, embeddings, vector storage, semantic search serving 200+ daily users. I'm certified as an AWS AI Practitioner and OCI Generative AI Professional. I work with LangChain, OpenAI APIs, vector databases, and I've been exploring agentic architectures and tool-use patterns. It's the most exciting space in tech right now and I'm all in.",

    "tell me about your education":
      "I've got a Master's in Computer Science from UMass Boston and a Bachelor's in Computer Engineering from University of Mumbai. The MS gave me a deep dive into systems, algorithms, and research, I even worked at the MPsych Lab building visualization tools for cancer treatment data. The undergrad in Mumbai is where I caught the engineering bug, published my first research paper, and realized that hackathons are basically extreme sports for nerds.",

    "what certifications do you have?":
      "I hold three: AWS AI Practitioner, HackerRank Software Engineer, and OCI Generative AI Professional. I'm a big believer in continuous learning — the tech landscape moves too fast to get comfortable. Certifications aren't everything, but they're a good way to validate that you actually know the things you claim to know on your resume.",

    "can you tell me about your research?":
      "I co-authored a paper called 'Twitter Data Mining for Targeted Marketing' published at IEEE's ICIRCA 2020 conference. We used machine learning and NLP to analyze Twitter data and extract patterns useful for targeted marketing campaigns. It was my first dive into ML/NLP and got me hooked on the intersection of data and intelligent systems. Also, at UMass Boston's MPsych Lab, I worked on cancer patient data analysis using University of Chicago datasets building visualization tools for treatment outcome leaderboards across 5,000+ patient records.",
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
    if (/stack|tech|language|framework|tool/i.test(q))
      return answers["what's your tech stack?"];
    if (/work|current|now|building|ohm/i.test(q))
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
