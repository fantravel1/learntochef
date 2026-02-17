/* ============================================================
   LEARN TO CHEF - Interactive JavaScript Engine
   Handles: Navigation, Animations, Counters, Filters,
            Carousels, Charts, Scroll Effects, Lazy Loading
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initCuisineTabs();
    initDashboardCharts();
    initProgressBars();
    initBackToTop();
    initLazyImages();
    initSmoothAnchors();
    initParallax();
  }

  /* ---------- HEADER SCROLL EFFECT ---------- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    var scrollThreshold = 80;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    window.addEventListener('scroll', throttle(onScroll, 50), { passive: true });
    onScroll();
  }

  /* ---------- MOBILE MENU ---------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.header__nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    var links = nav.querySelectorAll('.header__nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- SCROLL ANIMATIONS (Intersection Observer) ---------- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
    if (!elements.length) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) { observer.observe(counter); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ---------- CUISINE FILTER TABS ---------- */
  function initCuisineTabs() {
    var tabs = document.querySelectorAll('.cuisine__tab');
    var cards = document.querySelectorAll('.cuisine-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Update active tab
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var filter = tab.getAttribute('data-filter');

        cards.forEach(function (card) {
          var region = card.getAttribute('data-region');
          if (filter === 'all' || region === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            requestAnimationFrame(function () {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(function () { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* ---------- DASHBOARD BAR CHARTS ---------- */
  function initDashboardCharts() {
    var charts = document.querySelectorAll('.dashboard-card__chart');
    if (!charts.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bars = entry.target.querySelectorAll('.dashboard-card__bar');
          bars.forEach(function (bar) {
            var height = bar.getAttribute('data-height');
            if (height) {
              bar.style.height = height;
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    charts.forEach(function (chart) { observer.observe(chart); });

    // Ring charts
    var rings = document.querySelectorAll('.ring-chart__fill');
    if (!rings.length) return;

    var ringObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var offset = entry.target.getAttribute('data-offset');
          if (offset) {
            entry.target.style.strokeDashoffset = offset;
          }
          ringObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    rings.forEach(function (ring) { ringObserver.observe(ring); });
  }

  /* ---------- PROGRESS BARS ---------- */
  function initProgressBars() {
    var bars = document.querySelectorAll('.technique-card__progress-bar');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var width = entry.target.getAttribute('data-width');
          if (width) {
            entry.target.style.width = width;
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  /* ---------- BACK TO TOP ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', throttle(function () {
      if (window.scrollY > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, 100), { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- LAZY LOADING IMAGES ---------- */
  function initLazyImages() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            img.addEventListener('load', function () {
              img.classList.add('loaded');
            });
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      images.forEach(function (img) { imgObserver.observe(img); });
    } else {
      // Fallback for older browsers
      images.forEach(function (img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  }

  /* ---------- SMOOTH SCROLL ANCHORS ---------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- PARALLAX (subtle) ---------- */
  function initParallax() {
    var hero = document.querySelector('.hero__bg-image');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', throttle(function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        hero.style.transform = 'scale(1.05) translateY(' + (scrolled * 0.15) + 'px)';
      }
    }, 16), { passive: true });
  }

  /* ---------- UTILITY: Throttle ---------- */
  function throttle(fn, wait) {
    var lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

})();
