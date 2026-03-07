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
            el.style.top = (60 + offset) + "px";
            el.style.left = (80 + offset) + "px";
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
            windowEl.style.left = (origX + e.clientX - startX) + "px";
            windowEl.style.top = (origY + e.clientY - startY) + "px";
        });

        document.addEventListener("mouseup", function () {
            if (isDragging) {
                isDragging = false;
                titleBar.style.cursor = "grab";
            }
        });

        // Touch support
        titleBar.addEventListener("touchstart", function (e) {
            if (e.target.tagName === "BUTTON") return;
            if (windowEl.classList.contains("maximized")) return;
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            origX = windowEl.offsetLeft;
            origY = windowEl.offsetTop;
        }, { passive: true });

        document.addEventListener("touchmove", function (e) {
            if (!isDragging) return;
            const touch = e.touches[0];
            windowEl.style.left = (origX + touch.clientX - startX) + "px";
            windowEl.style.top = (origY + touch.clientY - startY) + "px";
        }, { passive: true });

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
    document.querySelectorAll(".start-menu-item[data-window]").forEach(function (item) {
        item.addEventListener("click", function () {
            openWindow(item.dataset.window);
        });
    });

})();
