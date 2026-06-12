/* Rishab Mohandoss — portfolio animations
   Particle network, scroll progress, reveals, counters, parallax, nav. */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Navbar: scrolled state + mobile toggle ── */
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ── Scroll progress bar ── */
  var bar = document.getElementById('progressBar');
  if (bar) {
    var updateBar = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  /* ── Scroll reveals (threshold 0.15, stagger inside [data-stagger]) ── */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    group.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', (i * 0.12) + 's');
    });
  });

  var reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Animated counters ── */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1800;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = target * eased;
      el.textContent = value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-target]');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      el.textContent = parseFloat(el.dataset.target).toLocaleString('en-US', {
        minimumFractionDigits: parseInt(el.dataset.decimals || '0', 10),
        maximumFractionDigits: parseInt(el.dataset.decimals || '0', 10)
      }) + (el.dataset.suffix || '');
    });
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ── Parallax (elements drift at 0.3x scroll) ── */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reducedMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        parallaxEls.forEach(function (el) {
          var rate = parseFloat(el.dataset.parallax) || 0.3;
          var rect = el.getBoundingClientRect();
          var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * rate;
          el.style.transform = 'translateY(' + (-offset) + 'px)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── Particle network canvas ── */
  var canvas = document.getElementById('particles');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var isMobile = window.innerWidth < 768;
    var COUNT = isMobile ? 20 : 70;
    var LINK_DIST = isMobile ? 100 : 140;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < COUNT; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.55)';
        ctx.fill();

        for (var j = i + 1; j < COUNT; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.18 * (1 - dist / LINK_DIST)) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
})();
