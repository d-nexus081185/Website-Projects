/* =========================================================
   Veridale Health: site interactions (no dependencies)
   ========================================================= */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const PRACTICE = {
    phoneDisplay: '(209) – 962 – 2081',
    phoneHref: 'tel:+12099622081',
    email: 'enquiries@veridalehealth.com',
    supportEmail: 'support@veridalehealth.com',
    zocdoc: 'https://www.zocdoc.com/booking-link/doctor/elizabeth-bristow-pmhnp-865870'
  };

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Footer: back to top ---------- */
  $$('.footer-top').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      // Return keyboard focus to the start of the page without a second jump.
      document.body.setAttribute('tabindex', '-1');
      document.body.focus({ preventScroll: true });
      document.body.addEventListener('blur', () => document.body.removeAttribute('tabindex'), { once: true });
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    });
  });

  /* ---------- Social icons: drop in like bouncing balls ---------- */
  const dropIn = (list) => {
    if (!list || prefersReducedMotion.matches) return;
    list.classList.remove('is-dropping');
    void list.offsetWidth; // restart the animation
    list.classList.add('is-dropping');
  };

  // Placeholder profiles (href="#") stay put instead of jumping to the top.
  $$('.social a[href="#"]').forEach((link) => link.addEventListener('click', (e) => e.preventDefault()));

  const headerSocial = $('.social--header');
  dropIn(headerSocial);
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // Replay in the header each time the visitor starts scrolling down from the top.
    if (lastScrollY <= 8 && y > 8) dropIn(headerSocial);
    lastScrollY = y;
  }, { passive: true });

  $('.nav-toggle')?.addEventListener('click', () => {
    if ($('#primary-nav')?.classList.contains('is-open')) dropIn($('.social--menu'));
  });

  if ('IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Drop when the footer icons come into view from below (scrolling down).
        const firstTime = !entry.target.classList.contains('is-dropping');
        if (entry.isIntersecting && (entry.boundingClientRect.top > 0 || firstTime)) dropIn(entry.target);
      });
    }, { threshold: 0.6 });
    $$('.social--footer').forEach((list) => {
      // Keep the icons hidden until their first drop so they don't flash in place.
      if (!prefersReducedMotion.matches) list.classList.add('is-armed');
      footerObserver.observe(list);
    });
  }

  /* ---------- Header: scrolled state ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const nav = $('#primary-nav');
  const navToggle = $('.nav-toggle');
  const navToggleLabel = $('.nav-toggle__label');
  const mobileNavQuery = window.matchMedia('(max-width: 1320px)');

  function setNavOpen(open, { returnFocus = true } = {}) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggleLabel.textContent = open ? 'Close menu' : 'Open menu';
    nav.classList.toggle('is-open', open);
    syncNavInert();
    document.body.classList.toggle('is-locked', open);
    document.documentElement.classList.remove('is-header-hidden');
    if (typeof requestScrollFrame === 'function') requestScrollFrame();
    if (open) {
      // Position the panel right under the header, wherever it currently sits.
      nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
      const firstLink = $('a', nav);
      if (firstLink) firstLink.focus();
    } else if (returnFocus) {
      navToggle.focus();
    }
  }

  navToggle.addEventListener('click', () => {
    setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a, button') && nav.classList.contains('is-open')) {
      setNavOpen(false, { returnFocus: false });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setNavOpen(false);
  });

  // Keep keyboard focus inside the open mobile menu (menu + toggle button).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
    const focusables = [navToggle, ...$$('a, button', nav)];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Hide the off-canvas menu from assistive tech when closed on small screens.
  function syncNavInert() {
    const hidden = mobileNavQuery.matches && !nav.classList.contains('is-open');
    nav.toggleAttribute('inert', hidden);
  }
  mobileNavQuery.addEventListener('change', () => {
    if (!mobileNavQuery.matches && nav.classList.contains('is-open')) setNavOpen(false, { returnFocus: false });
    syncNavInert();
  });
  syncNavInert();

  const root = document.documentElement;

  /* ---------- Theme (light / dark) ----------
     The <head> script sets data-theme before first paint, from the saved
     choice or the device setting. The toggle saves an explicit choice. */
  const themeButtons = $$('[data-theme-toggle]');
  const syncThemeButtons = () => {
    const dark = root.dataset.theme === 'dark';
    themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(dark)));
  };

  function applyTheme(theme, origin) {
    if (root.dataset.theme === theme) return;
    const swap = () => { root.dataset.theme = theme; syncThemeButtons(); };
    if (prefersReducedMotion.matches) { swap(); return; }

    // Circular reveal spreading out from the toggle button.
    if (document.startViewTransition && origin) {
      const r = origin.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.classList.add('is-theme-vt');
      const vt = document.startViewTransition(swap);
      vt.ready.then(() => {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 650, easing: 'cubic-bezier(.16, 1, .3, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
      vt.finished.finally(() => root.classList.remove('is-theme-vt'));
      return;
    }

    root.classList.add('is-theme-fading');
    swap();
    setTimeout(() => root.classList.remove('is-theme-fading'), 400);
  }

  themeButtons.forEach((btn) => btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('vh-theme', next); } catch (_) { /* storage blocked */ }
    applyTheme(next, btn);
  }));

  // Follow the device setting live, unless the visitor has picked a theme.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('vh-theme'); } catch (_) { /* storage blocked */ }
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });
  syncThemeButtons();

  /* ---------- Scroll-linked UI ----------
     One rAF-throttled pass per scroll frame drives: the reading progress line,
     the header hiding on scroll down, the mobile booking bar and the sticky
     jump links on the services page. */
  const progressLine = document.createElement('div');
  progressLine.className = 'scroll-progress';
  progressLine.setAttribute('aria-hidden', 'true');
  header.appendChild(progressLine);

  // Mobile booking bar
  const bookBar = document.createElement('div');
  bookBar.className = 'book-bar';
  bookBar.setAttribute('role', 'region');
  bookBar.setAttribute('aria-label', 'Book an appointment');
  bookBar.innerHTML =
    '<a class="btn btn--zocdoc book-bar__book" href="' + PRACTICE.zocdoc + '" target="_blank" rel="noopener" data-zocdoc>' +
      'Book on Zocdoc<span class="visually-hidden"> (opens in a new tab)</span></a>' +
    '<a class="book-bar__call" href="' + PRACTICE.phoneHref + '"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>Call' +
      '<span class="visually-hidden"> Veridale Health at ' + PRACTICE.phoneDisplay + '</span></a>';
  document.body.appendChild(bookBar);
  const bookBarQuery = window.matchMedia('(max-width: 720px)');
  const firstSection = $('.hero, .page-hero');
  const footer = $('.site-footer');

  // Services page jump links
  const jump = $('.jump-links');
  const jumpList = jump && $('ul', jump);
  const jumpLinks = jump ? $$('a[href^="#"]', jump) : [];
  const jumpTargets = jumpLinks.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
  let activeJump = null;

  let lastY = window.scrollY;
  let frameQueued = false;

  function scrollFrame() {
    frameQueued = false;
    const y = window.scrollY;
    const navOpen = nav.classList.contains('is-open');

    // Reading progress
    const max = root.scrollHeight - window.innerHeight;
    progressLine.style.setProperty('--progress', max > 0 ? Math.min(1, Math.max(0, y / max)).toFixed(4) : '0');

    // Hide the header after a deliberate scroll down; bring it back on the way up.
    const dy = y - lastY;
    if (navOpen || y < header.offsetHeight + 120) { root.classList.remove('is-header-hidden'); lastY = y; }
    else if (dy > 10) { root.classList.add('is-header-hidden'); lastY = y; }
    else if (dy < -10) { root.classList.remove('is-header-hidden'); lastY = y; }

    // Booking bar: after the first section, and out of the way of the footer.
    const pastIntro = firstSection ? firstSection.getBoundingClientRect().bottom < 80 : y > 400;
    const footerInView = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    const showBar = bookBarQuery.matches && pastIntro && !footerInView && !navOpen;
    if (showBar !== bookBar.classList.contains('is-visible')) {
      bookBar.classList.toggle('is-visible', showBar);
      root.classList.toggle('has-book-bar', showBar);
      if (showBar) root.style.setProperty('--book-bar-h', bookBar.offsetHeight + 'px');
    }

    if (jump) {
      const stickyTop = parseFloat(getComputedStyle(jump).top) || 0;
      jump.classList.toggle('is-stuck', jump.getBoundingClientRect().top <= stickyTop + 1 && y > 0);

      // Active group: the last card whose top has passed 40% of the viewport.
      const line = window.innerHeight * 0.4;
      let current = null;
      jumpTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) current = i; });
      const lastTarget = jumpTargets[jumpTargets.length - 1];
      if (lastTarget && lastTarget.getBoundingClientRect().bottom < 0) current = null;
      if (current !== activeJump) {
        activeJump = current;
        jumpLinks.forEach((a, i) => {
          a.classList.toggle('is-active', i === current);
          if (i === current) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
        const a = jumpLinks[current];
        if (a && jumpList.scrollWidth > jumpList.clientWidth) {
          jumpList.scrollTo({ left: a.offsetLeft - jumpList.offsetLeft - (jumpList.clientWidth - a.offsetWidth) / 2, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
        }
      }
    }
  }

  function requestScrollFrame() {
    if (frameQueued) return;
    frameQueued = true;
    requestAnimationFrame(scrollFrame);
  }
  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame, { passive: true });
  bookBarQuery.addEventListener('change', requestScrollFrame);
  // Keyboard users tabbing into a hidden header bring it back.
  header.addEventListener('focusin', () => root.classList.remove('is-header-hidden'));
  scrollFrame();

  /* ---------- Testimonials: dots for the phone carousel ---------- */
  const tGrid = $('.testimonial-grid');
  if (tGrid) {
    const items = $$(':scope > li', tGrid);
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    dotsWrap.setAttribute('role', 'group');
    dotsWrap.setAttribute('aria-label', 'Choose a testimonial');
    const dots = items.map((item, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1) + ' of ' + items.length);
      dot.addEventListener('click', () => {
        tGrid.scrollTo({
          left: item.offsetLeft - tGrid.offsetLeft - (tGrid.clientWidth - item.offsetWidth) / 2,
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
        });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
    tGrid.after(dotsWrap);

    let queued = false;
    const syncDots = () => {
      queued = false;
      const mid = tGrid.getBoundingClientRect().left + tGrid.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const r = item.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      dots.forEach((d, i) => {
        if (i === best) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
    };
    tGrid.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(syncDots); }
    }, { passive: true });
    syncDots();
  }

  /* ---------- Images fade in as they arrive ---------- */
  $$('img[loading="lazy"]').forEach((img) => {
    if (img.complete) return;
    img.classList.add('is-lazy');
    const done = () => img.classList.add('is-loaded');
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('[data-reveal]');
  if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
    // Stagger siblings that share a parent grid.
    revealEls.forEach((el) => {
      const siblings = $$(':scope > [data-reveal]', el.parentElement);
      const index = siblings.indexOf(el);
      if (siblings.length > 1) el.style.setProperty('--reveal-delay', Math.min(index, 6) * 70 + 'ms');
    });
    const revealer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Founder signature (about page) ---------- */
  // Signs once, when the signature is mostly in view. Waits for the script
  // font so the reveal never runs over the fallback font.
  const signature = $('[data-signature]');
  if (signature) {
    const sign = () => signature.classList.add('is-signed');
    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      sign();
    } else {
      const fontReady = document.fonts && document.fonts.load
        ? document.fonts.load('48px "Mrs Saint Delafield"').catch(() => {})
        : Promise.resolve();
      fontReady.then(() => {
        const signObserver = new IntersectionObserver((entries, obs) => {
          if (entries.some((e) => e.isIntersecting)) { sign(); obs.disconnect(); }
        }, { threshold: 0.6 });
        signObserver.observe(signature);
      });
    }
  }

  /* ---------- FAQ accordion ---------- */
  const accordion = $('#faq-accordion');
  if (accordion) {
    const triggers = $$('.accordion__trigger', accordion);
    const toggleAllBtn = $('[data-faq-toggle-all]');

    const setItem = (trigger, open) => {
      trigger.setAttribute('aria-expanded', String(open));
      trigger.closest('.accordion__item').classList.toggle('is-open', open);
    };
    const syncToggleAll = () => {
      const allOpen = triggers.every((t) => t.getAttribute('aria-expanded') === 'true');
      toggleAllBtn.textContent = allOpen ? 'Collapse all' : 'Expand all';
      toggleAllBtn.setAttribute('aria-expanded', String(allOpen));
    };

    triggers.forEach((trigger, i) => {
      trigger.addEventListener('click', () => {
        setItem(trigger, trigger.getAttribute('aria-expanded') !== 'true');
        syncToggleAll();
      });
      // Arrow / Home / End key navigation between questions.
      trigger.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
        else if (e.key === 'ArrowUp') next = triggers[(i - 1 + triggers.length) % triggers.length];
        else if (e.key === 'Home') next = triggers[0];
        else if (e.key === 'End') next = triggers[triggers.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });

    toggleAllBtn.addEventListener('click', () => {
      const open = toggleAllBtn.getAttribute('aria-expanded') !== 'true';
      triggers.forEach((t) => setItem(t, open));
      syncToggleAll();
    });
    syncToggleAll();
  }

  /* ---------- Preparation checklist ---------- */
  // The current page is marked with aria-current="page" in each page's HTML.

  const prepBoxes = $$('.prep-list input[type="checkbox"]');
  const prepCount = $('[data-prep-count]');
  const prepBar = $('.progress__bar');
  const updatePrep = () => {
    const done = prepBoxes.filter((b) => b.checked).length;
    prepCount.textContent = String(done);
    prepBar.style.width = (done / prepBoxes.length) * 100 + '%';
  };
  prepBoxes.forEach((b) => b.addEventListener('change', updatePrep));
  if (prepBoxes.length) updatePrep();

  /* ---------- Hero slider ---------- */
  const slider = $('[data-slider]');
  if (slider) {
    const DURATION = 6500;
    const track = $('#hero-slides', slider);
    const slides = $$('[data-slide]', slider);
    const dots = $$('[data-slider-dot]', slider);
    const lines = $$('[data-hero-line]');
    const pauseBtn = $('[data-slider-pause]', slider);
    const frame = $('.hero-slider__frame', slider);
    let index = 0;
    let timer = null;
    let startedAt = 0;
    let remaining = DURATION;
    // States: playing | held (hover/focus/hidden tab) | paused (by user) | static (reduced motion)
    let state = prefersReducedMotion.matches ? 'static' : 'playing';

    slider.style.setProperty('--slide-ms', DURATION + 'ms');

    function setState(next) {
      state = next;
      slider.dataset.state = next;
      const running = next === 'playing' || next === 'held';
      pauseBtn.setAttribute('aria-label', running ? 'Pause slideshow' : 'Play slideshow');
      // Announce slide changes only when the user is driving the carousel.
      track.setAttribute('aria-live', next === 'playing' ? 'off' : 'polite');
    }

    function schedule(ms) {
      clearTimeout(timer);
      remaining = ms;
      startedAt = Date.now();
      timer = setTimeout(() => goTo(index + 1), ms);
    }

    // Slides are stacked like a deck of cards. data-pos 0 is the front card;
    // 1 and 2 peek out behind it. Moving forward, the front card swings open
    // on its left edge and tucks in at the back; moving back, the rear card
    // swings closed onto the front of the deck.
    function goTo(i, dir = 1) {
      const prev = index;
      index = (i + slides.length) % slides.length;
      const changed = prev !== index;
      slides.forEach((s, n) => {
        const active = n === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
        s.dataset.pos = String((n - index + slides.length) % slides.length);
        if (changed && !prefersReducedMotion.matches) {
          s.classList.remove('is-leaving', 'is-returning');
          if (dir > 0 && n === prev) { void s.offsetWidth; s.classList.add('is-leaving'); }
          if (dir < 0 && active) { void s.offsetWidth; s.classList.add('is-returning'); }
        }
      });
      dots.forEach((d, n) => {
        if (n === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      lines.forEach((l) => l.classList.toggle('is-active', Number(l.dataset.heroLine) === index));
      if (state === 'playing') schedule(DURATION);
      else if (state === 'held') { clearTimeout(timer); remaining = DURATION; }
    }

    function hold() {
      if (state !== 'playing') return;
      clearTimeout(timer);
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
      setState('held');
    }

    function release() {
      if (state !== 'held') return;
      if (slider.matches(':hover') || slider.contains(document.activeElement) || document.hidden) return;
      setState('playing');
      schedule(remaining);
    }

    pauseBtn.addEventListener('click', () => {
      if (state === 'playing' || state === 'held') {
        clearTimeout(timer);
        setState('paused');
      } else {
        // An explicit "play" resumes right away, even while hovered or focused.
        setState('playing');
        const fill = $('[aria-current="true"] .hero-slider__dot-fill', slider);
        fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = '';
        schedule(DURATION);
      }
    });

    slides.forEach((s) => s.addEventListener('animationend', (e) => {
      if (e.target === s) s.classList.remove('is-leaving', 'is-returning');
    }));

    $('[data-slider-prev]', slider).addEventListener('click', () => goTo(index - 1, -1));
    $('[data-slider-next]', slider).addEventListener('click', () => goTo(index + 1, 1));
    dots.forEach((dot, n) => {
      dot.addEventListener('click', () => goTo(n, n < index ? -1 : 1));
      dot.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight') next = n + 1;
        else if (e.key === 'ArrowLeft') next = n - 1;
        if (next === null) return;
        e.preventDefault();
        goTo(next, next < n ? -1 : 1);
        dots[index].focus();
      });
    });

    // Pause while the visitor is looking at, or working with, the slider.
    slider.addEventListener('mouseenter', hold);
    slider.addEventListener('mouseleave', () => setTimeout(release, 0));
    slider.addEventListener('focusin', hold);
    slider.addEventListener('focusout', () => setTimeout(release, 0));
    document.addEventListener('visibilitychange', () => (document.hidden ? hold() : release()));

    // Touch swipe
    let startX = null;
    frame.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    frame.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    frame.addEventListener('pointercancel', () => { startX = null; });

    setState(state);
    goTo(0);

    // Hold autoplay until the preloader has finished, so every slide gets its full time.
    if (!window.__veridaleReady && document.documentElement.classList.contains('is-preloading')) {
      clearTimeout(timer);
      window.addEventListener('veridale:ready', () => {
        if (state === 'playing') schedule(DURATION);
      }, { once: true });
    }
  }

  /* ---------- WhatsApp widget ---------- */
  const wa = $('[data-wa]');
  if (wa) {
    const waToggle = $('[data-wa-toggle]', wa);
    const waPanel = $('#wa-panel', wa);

    const setWa = (open, { focus = true } = {}) => {
      waPanel.hidden = !open;
      waToggle.setAttribute('aria-expanded', String(open));
      waToggle.setAttribute('aria-label', open ? 'Close WhatsApp panel' : 'Chat with Veridale Health on WhatsApp');
      if (!focus) return;
      if (open) $('[data-wa-link]', wa).focus();
      else waToggle.focus();
    };
    setWa(false, { focus: false });

    waToggle.addEventListener('click', () => setWa(waPanel.hidden));
    $('[data-wa-close]', wa).addEventListener('click', () => setWa(false));
    $('[data-wa-link]', wa).addEventListener('click', () => setWa(false, { focus: false }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !waPanel.hidden && !$('dialog[open]')) setWa(false);
    });
    document.addEventListener('click', (e) => {
      if (!waPanel.hidden && !wa.contains(e.target)) setWa(false, { focus: false });
    });
  }

  /* ---------- Modals (native <dialog>) ---------- */
  let lastTrigger = null;

  function openModal(id, trigger) {
    const dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    if (nav.classList.contains('is-open')) setNavOpen(false, { returnFocus: false });
    lastTrigger = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add('is-locked');
    const body = $('.modal__body', dialog);
    if (body) body.scrollTop = 0;
    // Move focus to the title so screen readers announce the dialog's purpose.
    const title = $('.modal__title', dialog);
    (title || dialog).focus();
  }

  function closeModal(dialog, { restoreFocus = true } = {}) {
    if (!dialog || !dialog.open || dialog.classList.contains('is-closing')) return;
    const finish = () => {
      dialog.classList.remove('is-closing');
      dialog.close();
      if (!$('dialog[open]')) document.body.classList.remove('is-locked');
      if (restoreFocus && lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    };
    if (prefersReducedMotion.matches) { finish(); return; }
    dialog.classList.add('is-closing');
    setTimeout(finish, 200);
  }

  $$('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal, btn));
  });

  $$('dialog.modal').forEach((dialog) => {
    $$('[data-close-modal]', dialog).forEach((btn) => btn.addEventListener('click', () => closeModal(dialog)));

    // Escape: animate out instead of the instant native close.
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeModal(dialog); });

    // Click on the backdrop (the dialog element itself, outside the panel).
    dialog.addEventListener('mousedown', (e) => { dialog._downOnBackdrop = e.target === dialog; });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog && dialog._downOnBackdrop) closeModal(dialog);
    });

    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) document.body.classList.remove('is-locked');
    });

    // Close the modal when an in-page link inside it is followed.
    dialog.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) closeModal(dialog, { restoreFocus: false });
    });
  });

  // Following a Zocdoc link from inside a modal also closes that modal.
  $$('dialog [data-zocdoc]').forEach((link) => {
    link.addEventListener('click', () => closeModal(link.closest('dialog'), { restoreFocus: false }));
  });

  /* ---------- Form submission (FormSubmit → support@veridalehealth.com) ----------
     The site is static, so messages are relayed by FormSubmit (formsubmit.co),
     which emails each submission to the practice. No account or API key is needed.
     First use: FormSubmit emails an activation link to support@veridalehealth.com;
     messages are only delivered after that link is clicked. Until then the service
     reports a failure and visitors see the error message below.
     Resolves only when FormSubmit confirms success; otherwise it rejects. */
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + PRACTICE.supportEmail;
  const FORM_TIMEOUT_MS = 15000;

  function submitRequest(data) {
    return postToFormSubmit({
      _subject: 'New website message from ' + data.firstName + ' ' + data.lastName,
      _template: 'table',
      _honey: data._honey || '',
      Name: data.firstName + ' ' + data.lastName,
      email: data.email, // FormSubmit uses this as the reply-to address
      Phone: data.phone || 'Not provided',
      Message: data.message
    });
  }

  async function postToFormSubmit(payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      let body = {};
      try { body = await response.json(); } catch (_) { /* non-JSON error page */ }
      if (!response.ok || String(body.success) !== 'true') {
        throw new Error(body.message || 'Form service returned ' + response.status);
      }
      return { sent: true };
    } finally {
      clearTimeout(timeout);
    }
  }

  /* ---------- Request forms (validation + UI states) ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    firstName: (v) => (!v ? 'Please enter your first name.' : v.length > 60 ? 'Please keep this under 60 characters.' : ''),
    lastName: (v) => (!v ? 'Please enter your last name.' : v.length > 60 ? 'Please keep this under 60 characters.' : ''),
    email: (v) => (!v ? 'Please enter your email address.' : !EMAIL_RE.test(v) ? 'Please enter a valid email address, like name@example.com.' : ''),
    // Optional: only checked when something has been entered.
    phone: (v) => (!v ? '' : !/^[+()\d\s.–-]+$/.test(v) || v.replace(/\D/g, '').length < 10 || v.replace(/\D/g, '').length > 15
      ? 'Please enter a valid phone number, like (209) 555 0123, or leave this blank.' : ''),
    message: (v) => (!v ? 'Please add a short message.' : v.length < 10 ? 'Please add a little more detail (at least 10 characters).' : v.length > 1000 ? 'Please keep your message under 1000 characters.' : '')
  };

  const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  $$('[data-request-form]').forEach((form) => {
    const card = form.parentElement;
    const alertBox = $('[data-form-alert]', form);
    const success = $('[data-form-success]', card);
    const submitBtn = $('button[type="submit"]', form);
    const submitLabel = $('.btn__label', submitBtn);
    const counter = $('[data-count]', form);
    const honeypot = $('input[name="_honey"]', form);
    const fields = $$('input, textarea', form).filter((f) => f !== honeypot);
    const touched = new Set();

    function validateField(input, show) {
      const rule = rules[input.name];
      if (!rule) return true;
      const msg = rule(input.value.trim());
      const wrap = input.closest('.field');
      const err = $('.field__error', wrap);
      if (show) {
        wrap.classList.toggle('is-invalid', !!msg);
        wrap.classList.toggle('is-valid', !msg && input.value.trim() !== '');
        input.setAttribute('aria-invalid', String(!!msg));
        err.textContent = msg;
      }
      return !msg;
    }

    fields.forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim() !== '') touched.add(input.name);
        if (touched.has(input.name)) validateField(input, true);
      });
      input.addEventListener('input', () => {
        if (touched.has(input.name)) validateField(input, true);
        if (input.name === 'message' && counter) {
          const n = input.value.length;
          counter.textContent = n + ' / 1000';
          counter.classList.toggle('is-near', n > 900);
        }
        if (!alertBox.hidden && fields.every((f) => validateField(f, false))) alertBox.hidden = true;
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      fields.forEach((f) => touched.add(f.name));
      const invalid = fields.filter((f) => !validateField(f, true));

      if (invalid.length) {
        alertBox.innerHTML =
          '<svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg><span>' +
          (invalid.length === 1 ? 'Please check the highlighted field below.' : 'Please check the ' + invalid.length + ' highlighted fields below.') +
          '</span>';
        alertBox.hidden = false;
        invalid[0].focus();
        return;
      }

      alertBox.hidden = true;
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitLabel.textContent = 'Sending';

      const data = Object.fromEntries(fields.map((f) => [f.name, f.value.trim()]));
      if (honeypot) data._honey = honeypot.value;

      submitRequest(data)
        .then(() => showSuccess(data))
        .catch((err) => {
          // What the visitor typed is kept, so they can simply try again.
          const reason = !navigator.onLine
            ? 'You appear to be offline. Please check your connection and try again.'
            : err && err.name === 'AbortError'
              ? 'The request took too long. Please try again.'
              : 'Something went wrong on our side. Please try again in a moment.';
          alertBox.innerHTML =
            '<svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg><span>' +
            '<strong>Your message was not sent.</strong> ' + reason + ' You can also call ' +
            '<a href="' + PRACTICE.phoneHref + '">' + PRACTICE.phoneDisplay + '</a> or email ' +
            '<a href="mailto:' + PRACTICE.supportEmail + '">' + PRACTICE.supportEmail + '</a>.</span>';
          alertBox.hidden = false;
          alertBox.setAttribute('tabindex', '-1');
          alertBox.focus();
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          submitLabel.textContent = 'Send message';
        });
    });

    function showSuccess(data) {
      success.innerHTML =
        '<div class="form-success__icon" aria-hidden="true"><svg class="icon"><use href="#i-check"/></svg></div>' +
        '<h3>Thank you, ' + escapeHTML(data.firstName) + '. Your message has been sent.</h3>' +
        '<p>Our support team has received your message and will reply to <strong>' + escapeHTML(data.email) + '</strong>' +
        (data.phone ? ' or call you at <strong>' + escapeHTML(data.phone) + '</strong>' : '') + '.</p>' +
        '<div class="form-success__note" role="note">If this is an emergency, do not wait for a reply. Call ' +
        '<a href="tel:911">911</a> or go to the nearest emergency department.</div>' +
        '<div class="form-success__actions">' +
          '<a class="btn btn--zocdoc btn--block" href="' + PRACTICE.zocdoc + '" target="_blank" rel="noopener">' +
            'Book an appointment on Zocdoc<span class="visually-hidden"> (opens in a new tab)</span></a>' +
          '<button class="text-btn" type="button" data-form-reset>Send another message</button>' +
        '</div>';
      finishSuccess();
    }

    function finishSuccess() {
      form.hidden = true;
      success.hidden = false;
      success.focus();

      $('[data-form-reset]', success).addEventListener('click', () => {
        form.reset();
        touched.clear();
        fields.forEach((f) => {
          const wrap = f.closest('.field');
          wrap.classList.remove('is-invalid', 'is-valid');
          f.removeAttribute('aria-invalid');
        });
        if (counter) { counter.textContent = '0 / 1000'; counter.classList.remove('is-near'); }
        success.hidden = true;
        success.innerHTML = '';
        form.hidden = false;
        fields[0].focus();
      });
    }
  });

  /* ---------- Review form (home page modal) ----------
     Reviews are emailed to the practice through FormSubmit for moderation;
     nothing is published automatically. */
  const reviewForm = $('[data-review-form]');
  if (reviewForm) {
    const alertBox = $('[data-form-alert]', reviewForm);
    const success = $('[data-form-success]', reviewForm.parentElement);
    const submitBtn = $('button[type="submit"]', reviewForm);
    const submitLabel = $('.btn__label', submitBtn);
    const counter = $('[data-count]', reviewForm);
    const honeypot = $('input[name="_honey"]', reviewForm);
    const reviewRules = {
      rating: () => (!$('input[name="rating"]:checked', reviewForm) ? 'Please choose a star rating.' : ''),
      name: (v) => (!v ? 'Please enter your name or initials.' : ''),
      email: rules.email,
      title: (v) => (!v ? 'Please add a short headline.' : ''),
      review: (v) => (!v ? 'Please write your review.' : v.length < 20 ? 'Please add a little more detail (at least 20 characters).' : ''),
      consent: () => (!reviewForm.elements.consent.checked ? 'Please confirm we may publish your review.' : '')
    };
    const touched = new Set();

    const wrapOf = (name) => {
      const el = reviewForm.elements[name];
      return (el instanceof RadioNodeList ? el[0] : el).closest('.field');
    };

    function validate(name, show) {
      const el = reviewForm.elements[name];
      const msg = reviewRules[name](el instanceof RadioNodeList ? '' : el.value.trim());
      if (show) {
        const wrap = wrapOf(name);
        wrap.classList.toggle('is-invalid', !!msg);
        $('.field__error', wrap).textContent = msg;
        if (!(el instanceof RadioNodeList)) el.setAttribute('aria-invalid', String(!!msg));
      }
      return !msg;
    }

    Object.keys(reviewRules).forEach((name) => {
      const el = reviewForm.elements[name];
      const inputs = el instanceof RadioNodeList ? Array.from(el) : [el];
      inputs.forEach((input) => {
        input.addEventListener('change', () => { touched.add(name); validate(name, true); });
        input.addEventListener('blur', () => {
          if (input.value.trim() !== '' && input.type !== 'radio' && input.type !== 'checkbox') touched.add(name);
          if (touched.has(name)) validate(name, true);
        });
        input.addEventListener('input', () => {
          if (touched.has(name)) validate(name, true);
          if (name === 'review') counter.textContent = input.value.length + ' / 1000';
        });
      });
    });

    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const names = Object.keys(reviewRules);
      names.forEach((n) => touched.add(n));
      const invalid = names.filter((n) => !validate(n, true));
      if (invalid.length) {
        alertBox.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg><span>' +
          (invalid.length === 1 ? 'Please check the highlighted field.' : 'Please check the ' + invalid.length + ' highlighted fields.') + '</span>';
        alertBox.hidden = false;
        const first = reviewForm.elements[invalid[0]];
        (first instanceof RadioNodeList ? first[0] : first).focus();
        return;
      }

      alertBox.hidden = true;
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitLabel.textContent = 'Sending';

      const f = reviewForm.elements;
      const rating = Number($('input[name="rating"]:checked', reviewForm).value);
      postToFormSubmit({
        _subject: 'New patient review (' + rating + '/5) from ' + f.name.value.trim(),
        _template: 'table',
        _honey: honeypot ? honeypot.value : '',
        Rating: '★'.repeat(rating) + '☆'.repeat(5 - rating) + ' (' + rating + '/5)',
        Name: f.name.value.trim(),
        email: f.email.value.trim(),
        Headline: f.title.value.trim(),
        Review: f.review.value.trim(),
        'Permission to publish': 'Yes'
      })
        .then(() => {
          success.innerHTML =
            '<div class="form-success__icon" aria-hidden="true"><svg class="icon"><use href="#i-check"/></svg></div>' +
            '<h3>Thank you, ' + escapeHTML(f.name.value.trim()) + '.</h3>' +
            '<p>Your review has been sent to our team. We read every review and may share it on our website once it has been reviewed.</p>' +
            '<div class="form-success__actions"><button class="btn btn--primary btn--block" type="button" data-close-modal>Close</button></div>';
          $('[data-close-modal]', success).addEventListener('click', () => closeModal(reviewForm.closest('dialog')));
          reviewForm.hidden = true;
          success.hidden = false;
          success.focus();
          reviewForm.reset();
          touched.clear();
          counter.textContent = '0 / 1000';
        })
        .catch((err) => {
          const reason = !navigator.onLine
            ? 'You appear to be offline. Please check your connection and try again.'
            : err && err.name === 'AbortError'
              ? 'The request took too long. Please try again.'
              : 'Something went wrong on our side. Please try again in a moment.';
          alertBox.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg><span>' +
            '<strong>Your review was not sent.</strong> ' + reason + '</span>';
          alertBox.hidden = false;
          alertBox.setAttribute('tabindex', '-1');
          alertBox.focus();
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          submitLabel.textContent = 'Submit review';
        });
    });

    // Reopening the modal after a successful submission shows a fresh form.
    $$('[data-open-modal="review-modal"]').forEach((btn) => btn.addEventListener('click', () => {
      if (!success.hidden) { success.hidden = true; success.innerHTML = ''; reviewForm.hidden = false; }
    }));
  }
})();
