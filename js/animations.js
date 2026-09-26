/* Rishab Mohandoss — portfolio
   Scroll reveals + counters. Functional motion only. */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Polaroids: swipe, arrows, and keyboard; no automatic rotation ── */
  var carousel = document.querySelector('.photo-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.photo-slide'));
    var stack = carousel.querySelector('.photo-stack');
    var count = carousel.querySelector('.photo-count');
    var current = 0;
    function showPhoto(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var position = (i - current + slides.length) % slides.length;
        slide.dataset.position = position;
        slide.setAttribute('aria-hidden', position === 0 ? 'false' : 'true');
        slide.inert = position !== 0;
      });
      count.textContent = (current + 1) + ' / ' + slides.length;
    }
    carousel.querySelector('[data-photo-prev]').addEventListener('click', function () { showPhoto(current - 1); });
    carousel.querySelector('[data-photo-next]').addEventListener('click', function () { showPhoto(current + 1); });
    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    var start = null;
    var suppressPhotoClick = false;
    stack.addEventListener('pointerdown', function (event) {
      if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;
      suppressPhotoClick = false;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
      if (!event.target.closest('a')) stack.setPointerCapture(event.pointerId);
    });
    stack.addEventListener('pointermove', function (event) {
      if (!start || event.pointerId !== start.id) return;
      var dx = Math.abs(event.clientX - start.x);
      var dy = Math.abs(event.clientY - start.y);
      if (dx > 45 && dx > dy) stack.setPointerCapture(event.pointerId);
    });
    stack.addEventListener('pointerup', function (event) {
      if (!start || event.pointerId !== start.id) return;
      var dx = event.clientX - start.x;
      var dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        suppressPhotoClick = true;
        showPhoto(current + (dx < 0 ? 1 : -1));
      }
    });
    stack.addEventListener('click', function (event) {
      if (suppressPhotoClick) {
        event.preventDefault();
        suppressPhotoClick = false;
      }
    }, true);
    stack.addEventListener('pointercancel', function () { start = null; });
    showPhoto(0);
  }

  /* ── Navbar: scrolled border + mobile toggle ── */
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ── Counters ── */
  function setFinal(el) {
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    el.textContent = parseFloat(el.dataset.target).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + (el.dataset.suffix || '');
  }

  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';

    var target = parseFloat(el.dataset.target);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1500;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      el.textContent = (target * eased).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setFinal(el);
      }
    }
    requestAnimationFrame(step);
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-target]'));

  if (reducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(setFinal);
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    counters.forEach(function (el) {
      // Already on screen at load: animate now, don't wait for a scroll event.
      if (inViewport(el)) {
        animateCounter(el);
      } else {
        counterObserver.observe(el);
      }
    });

    // Safety net: if anything slipped through, show final values on full load.
    window.addEventListener('load', function () {
      setTimeout(function () {
        counters.forEach(function (el) {
          if (!el.dataset.done && inViewport(el)) animateCounter(el);
        });
      }, 400);
    });
  }

  /* ── Scroll reveals (fade + 12px slide, 400ms, no stagger) ── */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) {
      // Content visible at load shouldn't wait to fade in.
      if (inViewport(el)) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  }
})();
