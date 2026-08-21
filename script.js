/* itrust Pediatrics — Playful edition · shared behaviors */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* 1. Scroll reveal */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }

  /* 2. Active nav — only highlight after the user actually clicks a nav item
     (nothing is green on a fresh visit) */
  var here = (location.pathname.split("/").pop() || "index.html");
  function navClicked() { try { return sessionStorage.getItem("nav-clicked") === "1"; } catch (e) { return false; } }
  $$(".main-nav a").forEach(function (a) {
    a.addEventListener("click", function () { try { sessionStorage.setItem("nav-clicked", "1"); } catch (e) {} });
  });
  if (navClicked()) {
    $$(".main-nav a").forEach(function (a) {
      var h = a.getAttribute("href");
      if (h === here || (here === "" && h === "index.html")) a.setAttribute("aria-current", "page");
    });
  }

  /* 3. Mobile drawer */
  var drawer = $("#moreDrawer"), trigger = $(".more-trigger");
  function openD() { if (drawer) { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); if (trigger) trigger.setAttribute("aria-expanded", "true"); } }
  function closeD() { if (drawer) { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); if (trigger) trigger.setAttribute("aria-expanded", "false"); } }
  if (trigger) trigger.addEventListener("click", openD);
  if (drawer) $$("[data-close]", drawer).forEach(function (el) { el.addEventListener("click", closeD); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeD(); });

  /* 4. Accordions */
  function wire(barSel, qSel, cls) {
    $$(barSel).forEach(function (bar) {
      var q = $(qSel, bar); if (!q) return;
      q.addEventListener("click", function () {
        var open = bar.classList.toggle(cls);
        q.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }
  wire(".concern", ".concern-q", "open");
  wire(".faq-bar", ".faq-q", "open");

  /* 5. Team filter */
  var chips = $$(".team-chip");
  if (chips.length) {
    var tiles = $$(".team-tile, .provider-card"), empty = $(".team-empty");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("active"); chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter"), shown = 0;
        tiles.forEach(function (t) {
          var m = f === "all" || (t.getAttribute("data-spec") || "").indexOf(f) > -1;
          t.classList.toggle("hide", !m); if (m) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  /* 6. Video facade */
  var vp = $("#spotlightVideo");
  if (vp) {
    var playBtn = $(".video-play", vp);
    function play() {
      var embed = (vp.getAttribute("data-embed") || "").trim();
      if (!embed) { var n = $(".video-note", vp); if (n) n.hidden = false; if (playBtn) playBtn.style.display = "none"; return; }
      var f = document.createElement("iframe");
      f.src = embed + (embed.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      f.title = "Video message"; f.className = "video-embed";
      f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen"); f.setAttribute("allowfullscreen", "");
      vp.innerHTML = ""; vp.appendChild(f);
    }
    if (playBtn) playBtn.addEventListener("click", play);
    $$(".spotlight-watch").forEach(function (b) { b.addEventListener("click", play); });
  }

  /* 7. Clinic status */
  var statusEl = $("#clinicStatus"), hoursTable = $("#clinicHours");
  if (statusEl && hoursTable) {
    var now = new Date(), day = now.getDay(), hour = now.getHours() + now.getMinutes() / 60, open = false;
    $$("tr", hoursTable).forEach(function (tr) {
      var days = (tr.getAttribute("data-days") || "").split(","), o = parseFloat(tr.getAttribute("data-open")), c = parseFloat(tr.getAttribute("data-close"));
      if (days.indexOf(String(day)) > -1 && !isNaN(o) && !isNaN(c) && hour >= o && hour < c) open = true;
    });
    statusEl.textContent = open ? "Open now" : "Closed";
    statusEl.classList.add(open ? "open" : "closed");
  }

  /* 8. Gentle parallax on decorative arches */
  var arches = $$(".arch");
  if (arches.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      arches.forEach(function (a, i) { a.style.transform = "translateY(" + (y * (0.04 + i * 0.02)) + "px)"; });
    }, { passive: true });
  }

  /* 11. Talking mascot */
  (function () {
    var el = document.getElementById("mascotSpeech");
    if (!el) return;
    var span = el.querySelector("span") || el;
    var msgs = [
      "We care for kids & teens, ages 5 to 17",
      "Anxiety, ADHD, depression & mood",
      "Family-centered psychiatric care",
      "In-network with most major plans",
      "Virtual & in-person visits",
      "Have a question? Say hello! 👋"
    ];
    var i = 0, timer;
    function show(n) {
      el.classList.add("fade");
      setTimeout(function () {
        i = (n + msgs.length) % msgs.length;
        span.textContent = msgs[i];
        el.classList.remove("fade");
      }, 300);
    }
    function start() { timer = setInterval(function () { show(i + 1); }, 3400); }
    function reset() { clearInterval(timer); start(); }
    start();
    var svg = document.querySelector(".mascot2");
    if (svg) svg.addEventListener("click", function () { show(i + 1); reset(); });
  })();

  /* 12. Scroll-aware guide assistant (robot) */
  (function () {
    var sections = $$("[data-guide]");
    var ROBOT =
      '<g class="g-float">' +
      '<ellipse cx="76" cy="208" rx="15" ry="8" fill="#f2f5f7" stroke="#dbe3e8" stroke-width="2"/>' +
      '<ellipse cx="104" cy="208" rx="15" ry="8" fill="#f2f5f7" stroke="#dbe3e8" stroke-width="2"/>' +
      '<rect x="74" y="174" width="13" height="32" rx="6.5" fill="#fff" stroke="#e4ebf0" stroke-width="2"/>' +
      '<rect x="93" y="174" width="13" height="32" rx="6.5" fill="#fff" stroke="#e4ebf0" stroke-width="2"/>' +
      '<rect x="52" y="112" width="76" height="68" rx="32" fill="#ffffff" stroke="#e4ebf0" stroke-width="2"/>' +
      '<rect class="r-acc r-pulse" x="72" y="130" width="36" height="5" rx="2.5"/>' +
      '<rect class="r-acc r-pulse" x="78" y="140" width="24" height="4" rx="2" style="animation-delay:.3s"/>' +
      '<g class="g-arm2"><rect x="46" y="122" width="13" height="40" rx="6.5" fill="#fff" stroke="#e4ebf0" stroke-width="2"/><circle cx="52" cy="164" r="9.5" fill="#fff" stroke="#e4ebf0" stroke-width="2"/></g>' +
      '<g class="g-arm"><rect x="121" y="96" width="13" height="44" rx="6.5" fill="#fff" stroke="#e4ebf0" stroke-width="2"/><circle cx="127" cy="94" r="9.5" fill="#fff" stroke="#e4ebf0" stroke-width="2"/></g>' +
      '<rect x="80" y="100" width="20" height="18" rx="9" fill="#e9eef2" stroke="#dbe3e8" stroke-width="1.5"/>' +
      '<g class="g-head">' +
      '<path d="M90 20c27 0 43 19 43 45 0 22-16 39-38 43-2 .4-3 1.7-3 3.6 0 1.9-1.4 3.8-3 3.8s-3-1.9-3-3.8c0-1.9-1-3.2-3-3.6-22-4-38-21-38-43 0-26 16-45 43-45Z" fill="#ffffff" stroke="#e4ebf0" stroke-width="2"/>' +
      '<rect x="38" y="50" width="15" height="26" rx="7.5" fill="#e7edf1" stroke="#cfd9df"/><rect class="r-acc r-pulse" x="43" y="56" width="5" height="14" rx="2.5"/>' +
      '<rect x="127" y="50" width="15" height="26" rx="7.5" fill="#e7edf1" stroke="#cfd9df"/><rect class="r-acc r-pulse" x="132" y="56" width="5" height="14" rx="2.5" style="animation-delay:.4s"/>' +
      '<ellipse cx="74" cy="42" rx="17" ry="10" fill="#fdf7ea" opacity=".9"/>' +
      '<circle cx="90" cy="34" r="2.3" fill="#2a3340"/>' +
      '<g class="g-eye"><circle cx="75" cy="58" r="13" fill="#fff" stroke="#e4ebf0" stroke-width="1.5"/><circle class="r-ring" cx="75" cy="58" r="11.5" stroke-width="2.5" opacity=".85"/><circle cx="75" cy="58" r="8" fill="#14202e"/><circle cx="78" cy="54.5" r="2.8" fill="#fff"/></g>' +
      '<g class="g-eye"><circle cx="105" cy="58" r="13" fill="#fff" stroke="#e4ebf0" stroke-width="1.5"/><circle class="r-ring" cx="105" cy="58" r="11.5" stroke-width="2.5" opacity=".85"/><circle cx="105" cy="58" r="8" fill="#14202e"/><circle cx="108" cy="54.5" r="2.8" fill="#fff"/></g>' +
      '<path class="g-mouth" d="M82 76c3 4 13 4 16 0" stroke="#9fb0bd" stroke-width="3" stroke-linecap="round"/>' +
      '</g>' +
      '</g>';
    var guide = document.createElement("div");
    guide.className = "guide";
    guide.innerHTML =
      '<div class="guide-bubble" id="guideBubble"><button class="g-close" aria-label="Close">×</button><b id="guideTitle"></b><span id="guideText"></span></div>' +
      '<svg class="guide-bot" viewBox="0 0 180 240" fill="none" role="img" aria-label="Site guide">' + ROBOT + '</svg>';
    document.body.appendChild(guide);
    var bubble = $("#guideBubble", guide), tEl = $("#guideTitle", guide), xEl = $("#guideText", guide);
    var bot = $(".guide-bot", guide), closeBtn = $(".g-close", guide);
    var current = null, dismissed = false;
    var talkTimer, TVARS = ["talk-1", "talk-2", "talk-3", "talk-4"], lastTV = "";
    function pickTV() { var v; do { v = TVARS[Math.floor(Math.random() * TVARS.length)]; } while (v === lastTV); lastTV = v; return v; }
    function showBubble(title, text) {
      tEl.textContent = title || ""; xEl.textContent = text || "";
      bubble.classList.add("show");
      TVARS.forEach(function (v) { bot.classList.remove(v); });
      bot.classList.add(pickTV());
      bot.classList.add("talking");
      clearTimeout(talkTimer);
      talkTimer = setTimeout(function () { bot.classList.remove("talking"); }, 3600 + Math.floor(Math.random() * 1600));
    }
    function hideBubble() { bubble.classList.remove("show"); bot.classList.remove("talking"); clearTimeout(talkTimer); }
    function pick() {
      var mid = window.innerHeight * 0.42, best = null, bd = 1e9;
      sections.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.bottom > 70 && r.top < window.innerHeight - 40) {
          var c = r.top + r.height / 2;
          var d = (r.top <= mid && r.bottom >= mid) ? 0 : Math.abs(c - mid);
          if (d < bd) { bd = d; best = s; }
        }
      });
      return best;
    }
    function update() { if (dismissed) return; var s = pick(); if (!s || s === current) return; current = s; showBubble(s.getAttribute("data-guide-title"), s.getAttribute("data-guide")); }
    var t;
    window.addEventListener("scroll", function () { clearTimeout(t); t = setTimeout(update, 550); }, { passive: true });
    closeBtn.addEventListener("click", function () { hideBubble(); dismissed = true; });
    bot.addEventListener("click", function () {
      dismissed = false;
      if (bubble.classList.contains("show")) { hideBubble(); }
      else { current = null; update(); if (!current) showBubble("Hi! I’m your guide", "Scroll through the page and I’ll explain each part. Tap me anytime."); }
    });
    setTimeout(function () {
      showBubble("Hi! I’m your guide 👋", "Scroll down and I’ll explain each part as you go.");
      setTimeout(function () { if (!dismissed) { current = null; update(); } }, 3800);
    }, 900);
  })();
})();
