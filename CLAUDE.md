# shivangraikar.github.io — Windows XP Portfolio

Personal portfolio of Shivang Raikar, styled as a Windows XP desktop. Visitors
double-click desktop icons to open draggable XP windows. Deployed via GitHub
Pages from `main`. CLAUDE.md is intentionally committed so context survives
re-clones; keep it free of anything private (it's a public repo).

## Architecture — keep it simple

Pure static site. **No build step, no package.json, no framework** — and that's
deliberate. Do not introduce npm/bundlers unless Shivang explicitly asks.

- `index.html` — everything: desktop bio card, all XP windows, taskbar, start menu
- `css/styles.css` — all styling; XP chrome (folder/PDF icons, buttons) is CSS-drawn
- `js/script.js` — three IIFEs: animated "nerd wallpaper" canvas, XP window
  manager (drag/minimize/maximize/close/taskbar/z-order), Interview Me chatbot
- `js/games.js` — Minesweeper + Klondike Solitaire (click-to-move, draw-1)
- `js/breakout.js` — Breakout.exe (terminal-style icon): canvas paddle/balls,
  the real desktop icons and bio card are the bricks (bio = 3-hit boss; its
  damage classes are removed before `brick-poof` so the shrink animation wins).
  A ×5 power-up drops from the sky (~every 10-16s); catching it with the paddle
  splits into up to 5 balls, life lost only when ALL balls fall. Win → fake
  ShivangXP shutdown/reboot finale; 3 drops → game over. Desktop-only (mobile
  gets an XP dialog). Elements hide via `visibility` (keeps layout) and
  restore after.
- `js/analytics.js` — GA4 custom events (tag `G-8QSYZQE5W4` is in `<head>`).
  Pure event delegation + MutationObservers, so no `onclick` attrs in HTML and
  no changes to game files. Events: `window_open`, `start_menu_open`,
  `github_click` / `linkedin_click` / `medium_click` / `email_click` /
  `app_store_click` / `outbound_click` (with `link_location`), `project_click`
  (`project_name`, `project_org`), `blog_click` (`blog_title`),
  `resume_download`, `interview_question` (`question`, `source`),
  `minesweeper_win/lose`, `breakout_start/win/lose/blocked_mobile`.
  Append `?ga_debug` to the URL to see events in GA4 DebugView. New windows,
  cards, and dialogs are picked up automatically as long as they keep the
  existing class names (`.project-card h3`, `.blog-card h3`, `.xp-dialog` titles
  "Game over" / "Desktop restored").
- `ShivangRaikar_Resume.pdf` — linked from the Resume.pdf desktop icon and start menu
- `shivang.jpg` — profile photo

### Window system conventions
- A window is `<div class="xp-window" id="window-<name>">`; opened via any
  element with `data-window="<name>"` (desktop icons, start menu items)
- Desktop icons with `data-href` open a URL instead (used for Resume.pdf)
- Optional `data-width`/`data-height` on the window set its desktop size
  (default 700x500). Mobile (<768px) is always fullscreen.
- Windows auto-initialize: any `.xp-window` gets drag + title-bar buttons wired

## Content strategy (important — decided Aug 2026)

**No content duplication with the resume.** The division is:
- **Work Experience window** = short, punchy project *titles* per job (a few
  words each), tech tags, one-line blurb. NOT resume bullets.
- **Projects window** = the deep dives: practical work, architecture, features.
  Every card has a `project-org` badge tying it to its origin: OHM /
  Steam Works Studio / Hackathon / Personal / Research / CPI.
- The resume PDF itself carries the formal bullets.

Key facts: Shivang is a **Founding Software Engineer at OHM** (San Francisco,
Jan 2025–present; EV charger & HVAC field service). Main things built there:
Ohmie (multi-agent AI), OhmControl (ops platform, ohmcontrol.com), Ohm Field
(React Native app on both app stores), client integration APIs. Describe OHM
work only at the level of the public resume/site — no internal details.

Sources of truth: resume PDF in this repo; GitHub (github.com/shivangraikar)
for personal projects (Sous, thought-clusters, neetcode-gpt, FittedAI);
Medium (@shivangraikar, several posts in Towards AI) for the Blogs window.

## Interview Me chatbot

Static Q&A dictionary + keyword fuzzy matching in `js/script.js`. **Decision:
no LLM backend** — a real API would need keys/proxy infra and break the
static-site simplicity. Keep answers high-level, spanning broad SWE
responsibilities, in Shivang's voice (light humor, tabs-over-spaces jokes).
When updating: change the `answers` dict AND the regex fallbacks below it, and
keep suggestion buttons in index.html in sync.

## Theme guardrails

Windows XP aesthetic is the identity: Tahoma/Segoe fonts, XP blue title bars,
`#ece9d8` chrome, green start button, taskbar clock. New features should feel
like XP-era software (dialogs, folders, games), not modern web design. Shivang
explicitly wants simplicity over flashy — don't over-engineer.

## Update checklist (periodic refresh)

1. Blogs window ← new Medium posts (fetch medium.com/@shivangraikar)
2. Work experience / projects ← resume PDF changes
3. Interview Me answers ← keep consistent with the above
4. Replace `ShivangRaikar_Resume.pdf` when a new resume ships
