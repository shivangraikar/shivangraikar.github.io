// ============================================
// PORTFOLIO — Shivang Raikar
// Script: Nav, Typewriter, Scroll, Chat
// ============================================

(function () {
    'use strict';

    // --- Typewriter Effect ---
    const phrases = [
        'I build products that matter.',
        'I lead with empathy and code.',
        'I ship fast and learn faster.',
        'I write about what I build.',
        'I turn ideas into reality.'
    ];

    const typewriterEl = document.getElementById('typewriter');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 60;
    const deleteSpeed = 35;
    const pauseEnd = 2000;
    const pauseStart = 500;

    function typewrite() {
        if (!typewriterEl) return;
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === current.length) {
            delay = pauseEnd;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = pauseStart;
        }

        setTimeout(typewrite, delay);
    }

    // Start after hero animation
    setTimeout(typewrite, 1200);

    // --- Navbar Scroll Spy & Sticky Shadow ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Navbar shadow on scroll
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // --- Smooth scroll for nav links ---
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile nav if open
                var navLinksContainer = document.getElementById('navLinks');
                var navToggle = document.getElementById('navToggle');
                if (navLinksContainer) navLinksContainer.classList.remove('open');
                if (navToggle) navToggle.classList.remove('open');
            }
        });
    });

    // Logo click -> scroll to top
    var logoLink = document.querySelector('.nav-logo');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mobile Nav Toggle ---
    var navToggle = document.getElementById('navToggle');
    var navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
                navToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
            }
        });
    }

    // --- Scroll Animations (IntersectionObserver) ---
    var animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all
        animatedElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // --- Video Thumbnail (seek to data-thumb-time and pause) ---
    document.querySelectorAll('video[data-thumb-time]').forEach(function (video) {
        var thumbTime = parseFloat(video.getAttribute('data-thumb-time')) || 2;
        var hasThumb = false;

        function seekToThumb() {
            if (hasThumb) return;
            hasThumb = true;
            video.currentTime = thumbTime;
            // Video is already paused, browser will render this frame as the preview
        }

        video.addEventListener('loadeddata', seekToThumb);

        // If already loaded (cached)
        if (video.readyState >= 2) {
            seekToThumb();
        }
    });

    // --- Video Play Buttons & Timeline ---
    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        var m = Math.floor(seconds / 60);
        var s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    document.querySelectorAll('.project-media').forEach(function (media) {
        var video = media.querySelector('video');
        var playBtn = media.querySelector('.video-play-btn');
        var timeline = media.querySelector('.video-timeline');
        var progress = media.querySelector('.video-progress');
        var timeDisplay = media.querySelector('.video-time');

        if (!video || !playBtn) return;

        var firstPlay = true;

        // Play/pause toggle
        function togglePlay() {
            if (video.paused) {
                // On first play, start from beginning (video may be seeked for thumbnail)
                if (firstPlay) {
                    video.currentTime = 0;
                    firstPlay = false;
                }
                video.play();
                playBtn.classList.add('playing');
                media.classList.add('playing');
            } else {
                video.pause();
                playBtn.classList.remove('playing');
                media.classList.remove('playing');
            }
        }

        playBtn.addEventListener('click', togglePlay);

        // Click on video to toggle play
        video.addEventListener('click', togglePlay);

        // Update progress bar
        if (progress && timeDisplay) {
            video.addEventListener('timeupdate', function () {
                if (!video.duration) return;
                var pct = (video.currentTime / video.duration) * 100;
                progress.style.setProperty('--progress', pct + '%');
                timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
            });

            video.addEventListener('loadedmetadata', function () {
                timeDisplay.textContent = '0:00 / ' + formatTime(video.duration);
            });
        }

        // Click on timeline to seek
        if (timeline && progress) {
            timeline.addEventListener('click', function (e) {
                e.stopPropagation();
                var rect = progress.getBoundingClientRect();
                var clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                var ratio = clickX / rect.width;
                if (video.duration) {
                    video.currentTime = ratio * video.duration;
                }
            });
        }

        // Show play button again when video ends (for non-loop)
        video.addEventListener('ended', function () {
            playBtn.classList.remove('playing');
            media.classList.remove('playing');
        });
    });

    // --- Interview Me Chat Widget ---
    var chatToggle = document.getElementById('chatToggle');
    var chatWindow = document.getElementById('chatWindow');
    var chatClose = document.getElementById('chatClose');
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');
    var chatMessages = document.getElementById('chatMessages');

    // Toggle chat
    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', function () {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open') && chatInput) {
                setTimeout(function () { chatInput.focus(); }, 350);
            }
        });
    }

    if (chatClose && chatWindow) {
        chatClose.addEventListener('click', function () {
            chatWindow.classList.remove('open');
        });
    }

    // Chat Q&A knowledge base
    var chatResponses = [
        {
            keywords: ['what do you do', 'what you do', 'your job', 'your role', 'what is your work'],
            response: "I'm a Software Engineer who loves building products that solve real problems. I work across the full stack — from designing systems to shipping user-facing features. I'm passionate about clean code, great UX, and leading teams that move fast."
        },
        {
            keywords: ['where', 'live', 'location', 'based', 'city'],
            response: "I'm currently based in the US. I'm open to both on-site and remote opportunities — great work can happen from anywhere!"
        },
        {
            keywords: ['experience', 'work history', 'career', 'years'],
            response: "I have experience across full-stack development, system design, and team leadership. I've worked at companies ranging from startups to larger orgs, building scalable products and mentoring engineers. Check out the Experience section above for details!"
        },
        {
            keywords: ['skill', 'tech', 'stack', 'language', 'framework', 'know about', 'tools'],
            response: "I work with a variety of technologies including Python, JavaScript/TypeScript, React, Node.js, AWS, and more. I'm a strong believer in picking the right tool for the job rather than being dogmatic about any single stack."
        },
        {
            keywords: ['project', 'built', 'build', 'portfolio', 'work on'],
            response: "I've built everything from real-time data platforms to developer tools to consumer-facing apps. Scroll up to the Projects section to see some highlights — each one taught me something different about building great software."
        },
        {
            keywords: ['education', 'degree', 'university', 'college', 'school', 'study'],
            response: "I have a strong academic background in Computer Science. Education gave me the foundations, but I believe the best learning happens by building and shipping real things. Check the Education section for specifics!"
        },
        {
            keywords: ['hobby', 'hobbies', 'free time', 'fun', 'outside work', 'interests'],
            response: "Outside of work, I enjoy music, traveling, reading, and staying active. I think having diverse interests makes you a better engineer — creativity comes from unexpected connections."
        },
        {
            keywords: ['blog', 'write', 'writing', 'medium', 'article', 'post'],
            response: "Yes! I write about software engineering, leadership, and lessons learned from building products. You can find my posts on Medium — there's a link in the Blog section above."
        },
        {
            keywords: ['hire', 'hiring', 'opportunity', 'job', 'open to', 'available', 'looking'],
            response: "I'm always open to interesting conversations about impactful work. If you think we'd be a great fit, feel free to reach out via LinkedIn or email — links are in the footer!"
        },
        {
            keywords: ['leadership', 'lead', 'manage', 'mentor', 'team'],
            response: "I believe great leadership is about enabling others to do their best work. I lead by example, prioritize clear communication, and create environments where people feel safe to take risks and grow. Mentoring junior engineers is one of the most rewarding parts of my career."
        },
        {
            keywords: ['passion', 'passionate', 'care about', 'drive', 'motivat'],
            response: "I'm driven by the intersection of technology and human impact. Building something that genuinely helps people — that's what gets me out of bed. I care deeply about craft, continuous learning, and leaving things better than I found them."
        },
        {
            keywords: ['contact', 'reach', 'email', 'linkedin', 'connect', 'touch'],
            response: "You can find me on LinkedIn, Instagram, or shoot me an email — all the links are in the footer below. I'd love to hear from you!"
        },
        {
            keywords: ['hello', 'hi', 'hey', 'sup', 'greet', 'good morning', 'good evening'],
            response: "Hey there! Great to meet you. Feel free to ask me anything — about my work, experience, projects, or just what makes me tick. I'm an open book!"
        },
        {
            keywords: ['who are you', 'tell me about yourself', 'about you', 'introduce', 'yourself'],
            response: "I'm Shivang Raikar — a software engineer who's passionate about building impactful products, leading teams, and constantly learning. I believe in shipping fast, writing clean code, and bringing people together to solve hard problems. What would you like to know more about?"
        },
        {
            keywords: ['achievement', 'accomplish', 'award', 'proud'],
            response: "I've had some great wins throughout my career — from hackathon victories to production launches that impacted thousands of users. Check out the Achievements section above for the highlights!"
        }
    ];

    var fallbackResponses = [
        "That's a great question! I might not have a perfect answer for that one yet. Try asking about my experience, skills, projects, or hobbies!",
        "Hmm, I'm not sure about that one. You can ask me things like 'What do you do?' or 'Tell me about your projects' — I'd love to share!",
        "Interesting question! I'm still learning. Try asking about my work, education, leadership style, or what drives me."
    ];

    function findResponse(input) {
        var lower = input.toLowerCase().trim();

        for (var i = 0; i < chatResponses.length; i++) {
            var entry = chatResponses[i];
            for (var j = 0; j < entry.keywords.length; j++) {
                if (lower.includes(entry.keywords[j])) {
                    return entry.response;
                }
            }
        }

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    function addMessage(text, isUser) {
        var msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ' + (isUser ? 'user-message' : 'bot-message');
        var p = document.createElement('p');
        p.textContent = text;
        msgDiv.appendChild(p);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        var indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        var indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    if (chatForm) {
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, true);
            chatInput.value = '';

            // Show typing indicator then respond
            showTypingIndicator();

            var delay = 600 + Math.random() * 800;
            setTimeout(function () {
                removeTypingIndicator();
                addMessage(findResponse(text), false);
            }, delay);
        });
    }

    // --- Hero CTA smooth scroll ---
    document.querySelectorAll('.hero-cta a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
