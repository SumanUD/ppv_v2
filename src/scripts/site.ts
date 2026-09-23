import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =================== Loader ===================
// Loader removed per user request — site is shown immediately.
function setupLoader() {
  const shell = document.querySelector<HTMLElement>('.site-shell');
  if (shell) shell.classList.add('is-ready');
  document.body.classList.remove('is-loading');
}

// =================== Nav + Scroll progress + Active link ===================
function setupNav() {
  const body = document.body;
  const nav = document.querySelector<HTMLElement>('.nav');
  const toggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
  const navLinks = document.querySelector<HTMLElement>('.nav-links');
  const progress = document.querySelector<HTMLElement>('.scroll-progress');
  const menuLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links a'));
  // Only track in-page hash links for active-section highlighting.
  const hashLinks = menuLinks.filter((l) => {
    const href = l.getAttribute('href') || '';
    return href.startsWith('#') || href.startsWith('/#');
  });
  const sections = hashLinks
    .map((link) => {
      const href = link.getAttribute('href') || '';
      const id = href.replace(/^\/?#/, '');
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean) as HTMLElement[];

  const updateScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 18);

    if (progress) {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = height > 0 ? y / height : 0;
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    }
  };

  const setActiveLink = () => {
    const marker = Math.max(140, window.innerHeight * 0.34);
    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= marker && rect.bottom >= marker;
    });

    hashLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const id = href.replace(/^\/?#/, '');
      link.classList.toggle('is-active', Boolean(current) && id === current?.id);
    });
  };

  if (toggle && navLinks && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      nav.classList.toggle('is-open', isOpen);
      body.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('a')) {
        navLinks.classList.remove('is-open');
        nav.classList.remove('is-open');
        body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Services dropdown — click-toggle (in addition to CSS :hover for desktop)
  const dropdowns = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-dropdown]'));
  dropdowns.forEach((dd) => {
    const trigger = dd.querySelector<HTMLButtonElement>('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dd.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      // Close other dropdowns
      dropdowns.forEach((other) => {
        if (other !== dd) {
          other.classList.remove('is-open');
          other.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-nav-dropdown]')) {
      dropdowns.forEach((dd) => {
        dd.classList.remove('is-open');
        dd.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  window.addEventListener('scroll', () => {
    updateScroll();
    setActiveLink();
  }, { passive: true });

  updateScroll();
  setActiveLink();
}

// =================== Scroll cue hide ===================
function setupScrollCue() {
  const cue = document.querySelector<HTMLElement>('.scroll-cue');
  if (!cue) return;
  const hide = () => {
    cue.classList.add('is-hidden');
    window.removeEventListener('scroll', hide);
  };
  window.addEventListener('scroll', hide, { once: true, passive: true });
}

// =================== Reveal on scroll ===================
function setupReveals() {
  const reveals = document.querySelectorAll<HTMLElement>('.reveal');

  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Stagger delays within sections (5-card max)
  reveals.forEach((el, index) => {
    el.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 80}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach((el) => observer.observe(el));
}

// =================== FAQ accordion (one-open-at-a-time) ===================
function setupFaq() {
  const items = Array.from(document.querySelectorAll<HTMLDetailsElement>('.faq-item'));
  items.forEach((item) => {
    const summary = item.querySelector('summary');
    if (!summary) return;
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.hasAttribute('open');

      // Close other items
      items.forEach((other) => {
        if (other !== item && other.hasAttribute('open')) {
          collapse(other);
        }
      });

      if (isOpen) {
        collapse(item);
      } else {
        expand(item);
      }
    });
  });

  function expand(item: HTMLDetailsElement) {
    item.setAttribute('open', '');
    const answer = item.querySelector<HTMLElement>('.faq-answer');
    if (!answer || prefersReducedMotion) return;
    gsap.fromTo(answer,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.42, ease: 'power2.out' }
    );
  }

  function collapse(item: HTMLDetailsElement) {
    const answer = item.querySelector<HTMLElement>('.faq-answer');
    if (!answer || prefersReducedMotion) {
      item.removeAttribute('open');
      return;
    }
    gsap.to(answer, {
      height: 0,
      opacity: 0,
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        item.removeAttribute('open');
        answer.style.height = '';
        answer.style.opacity = '';
      }
    });
  }
}

// =================== Solution card tilt ===================
function setupTilt() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');

  cards.forEach((card) => {
    let rect: DOMRect;
    let rafId: number | null = null;

    const updateRect = () => { rect = card.getBoundingClientRect(); };
    updateRect();
    window.addEventListener('resize', updateRect);

    card.addEventListener('pointerenter', () => {
      updateRect();
      card.style.transition = 'transform 220ms cubic-bezier(0.2, 0.82, 0.22, 1)';
    });

    card.addEventListener('pointermove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 6;
        const ry = (x - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        rafId = null;
      });
    });

    card.addEventListener('pointerleave', () => {
      card.style.transition = 'transform 450ms cubic-bezier(0.2, 0.82, 0.22, 1)';
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });
}

// =================== Solutions 3D carousel ===================
function setupSolutionsCarousel() {
  const carousel = document.querySelector<HTMLElement>('[data-solutions-carousel]');
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll<HTMLElement>('[data-carousel-card]'));
  const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]'));
  const prev = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
  if (cards.length < 2) return;

  let activeIndex = 0;
  let timer: number | undefined;

  const slotFor = (index: number) => {
    const offset = (index - activeIndex + cards.length) % cards.length;
    if (offset === 0) return 'active';
    if (offset === 1) return 'next';
    if (offset === cards.length - 1) return 'prev';
    return 'far';
  };

  const render = () => {
    cards.forEach((card, index) => {
      const slot = slotFor(index);
      const isActive = slot === 'active';
      card.dataset.slot = slot;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', String(!isActive));
      card.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
        link.tabIndex = isActive ? 0 : -1;
      });
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
      dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
  };

  const goTo = (index: number) => {
    activeIndex = (index + cards.length) % cards.length;
    render();
  };

  const stopAuto = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  const startAuto = () => {
    if (prefersReducedMotion || timer) return;
    timer = window.setInterval(() => goTo(activeIndex + 1), 5200);
  };

  prev?.addEventListener('click', () => {
    stopAuto();
    goTo(activeIndex - 1);
    startAuto();
  });

  next?.addEventListener('click', () => {
    stopAuto();
    goTo(activeIndex + 1);
    startAuto();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(index);
      startAuto();
    });
  });

  // Click on side cards to navigate
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      const slot = card.dataset.slot;
      const target = e.target as HTMLElement;

      // On the ACTIVE card: let links/buttons work normally
      if (slot === 'active') return;

      // On NON-active cards: always intercept (even on a link) and slide
      e.preventDefault();
      e.stopPropagation();
      // Stop the anchor from navigating
      if (target.closest('a')) {
        const link = target.closest('a') as HTMLAnchorElement;
        link.blur();
      }

      stopAuto();
      if (slot === 'next') {
        goTo(activeIndex + 1);
      } else if (slot === 'prev') {
        goTo(activeIndex - 1);
      } else if (slot === 'far') {
        goTo(index);
      }
      startAuto();
    });
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchActive = false;

  carousel.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
    stopAuto();
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!touchActive || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    // If clearly vertical, cancel swipe
    if (Math.abs(dy) > Math.abs(dx) * 1.2) {
      touchActive = false;
    }
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (!touchActive) {
      startAuto();
      return;
    }
    touchActive = false;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStartX;
    const dy = endY - touchStartY;
    const threshold = 40;
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        goTo(activeIndex + 1);
      } else {
        goTo(activeIndex - 1);
      }
    }
    startAuto();
  }, { passive: true });

  carousel.addEventListener('touchcancel', () => {
    touchActive = false;
    startAuto();
  }, { passive: true });

  carousel.addEventListener('pointerenter', stopAuto);
  carousel.addEventListener('pointerleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  render();
  startAuto();
}

// =================== Principles pillar scroll-scrub ===================
function setupPillars() {
  const pillars = Array.from(document.querySelectorAll<HTMLElement>('.pillar'));
  if (pillars.length !== 3) return;
  const section = document.getElementById('principles');
  if (!section) return;

  pillars.forEach((p) => p.classList.remove('is-pristine'));

  if (prefersReducedMotion) {
    pillars.forEach((p) => p.classList.add('is-active'));
    return;
  }

  let activeIndex = 0;
  const setActive = (i: number) => {
    if (i === activeIndex) return;
    activeIndex = i;
    pillars.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
  };

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'bottom 30%',
    onUpdate: (self) => {
      const p = self.progress;
      if (p < 0.33) setActive(0);
      else if (p < 0.66) setActive(1);
      else setActive(2);
    }
  });

  setActive(0);
}

// =================== Timeline spine scrub ===================
function setupTimelineSpine() {
  const spine = document.querySelector<HTMLElement>('.timeline-spine');
  const dot = document.querySelector<HTMLElement>('.spine-dot');
  const timeline = document.querySelector<HTMLElement>('.timeline');
  if (!spine || !dot || !timeline || prefersReducedMotion) return;

  ScrollTrigger.create({
    trigger: timeline,
    start: 'top 70%',
    end: 'bottom 30%',
    onUpdate: (self) => {
      const spineH = spine.offsetHeight;
      const dotH = 16;
      const y = Math.max(0, Math.min(spineH - dotH, self.progress * (spineH - dotH)));
      dot.style.transform = `translateY(${y}px)`;
    }
  });
}

// =================== Custom Cursor ===================
function setupCursor() {
  // Skip on coarse pointers (touch) or reduced motion
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (prefersReducedMotion) return;

  const body = document.body;

  // Build cursor DOM
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.className = 'cursor-ring-label';
  label.textContent = '';
  ring.appendChild(label);

  body.appendChild(dot);
  body.appendChild(ring);
  body.classList.add('has-custom-cursor');

  // Selectors that trigger hover states
  const LINK_SELECTOR = [
    'a',
    'button',
    '[role="button"]',
    'summary',
    '.button',
    '.solution-card',
    '.journey-node',
    '.timeline-card',
    '.faq-item',
    '.chip',
    '.wwh-card',
    '.pillar',
    '.footer-social a',
    '[data-cursor]'
  ].join(', ');

  const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"]';

  // State
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let ticking = false;
  let visible = false;

  const setVisible = (v: boolean) => {
    if (v === visible) return;
    visible = v;
    body.classList.toggle('cursor-active', v);
  };

  // Move handler — fast updates the dot, lerp loop handles the ring
  window.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
      dot.style.setProperty('--cx', `${mouseX}px`);
      dot.style.setProperty('--cy', `${mouseY}px`);
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(loop);
      }
    },
    { passive: true }
  );

  // Hide when leaving / re-entering window
  document.addEventListener('mouseenter', () => setVisible(true));
  document.addEventListener('mouseleave', () => setVisible(false));

  // Press state
  window.addEventListener('mousedown', () => body.classList.add('cursor-pressed'));
  window.addEventListener('mouseup', () => body.classList.remove('cursor-pressed'));

  // Hover detection — single delegated listener (mouseover bubbles)
  let currentTarget: HTMLElement | null = null;
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (!target || !target.closest) return;

    const textEl = target.closest(TEXT_SELECTOR) as HTMLElement | null;
    const linkEl = target.closest(LINK_SELECTOR) as HTMLElement | null;

    // Reset
    body.classList.remove('cursor-link', 'cursor-cta', 'cursor-text', 'cursor-label');
    currentTarget = null;

    if (textEl) {
      body.classList.add('cursor-text');
      currentTarget = textEl;
      return;
    }

    if (!linkEl) return;
    currentTarget = linkEl;

    // Check for explicit data-cursor label
    const customLabel = linkEl.getAttribute('data-cursor');
    if (customLabel) {
      label.textContent = customLabel;
      body.classList.add('cursor-label');
      return;
    }

    // CTA-style buttons get the arrow ring
    const isCta =
      linkEl.matches('.button, .button-primary, .nav-cta, .hero-link, .solution-cta') ||
      linkEl.classList.contains('button-primary');

    if (isCta) {
      label.textContent = '→';
      body.classList.add('cursor-cta');
      return;
    }

    body.classList.add('cursor-link');
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (!target || !target.closest) return;
    if (currentTarget && !e.relatedTarget) {
      // Mouse left the window — handled by mouseleave
      return;
    }
    const stillHovering = (e.relatedTarget as HTMLElement | null)?.closest?.(
      `${LINK_SELECTOR}, ${TEXT_SELECTOR}`
    );
    if (!stillHovering) {
      body.classList.remove('cursor-link', 'cursor-cta', 'cursor-text', 'cursor-label');
      currentTarget = null;
    }
  });

  // Lerp loop for the ring (smooth follow)
  function loop() {
    const lerp = 0.18;
    ringX += (mouseX - ringX) * lerp;
    ringY += (mouseY - ringY) * lerp;
    ring.style.setProperty('--rx', `${ringX}px`);
    ring.style.setProperty('--ry', `${ringY}px`);

    // Continue animating while there's meaningful distance to close
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      requestAnimationFrame(loop);
    } else {
      ticking = false;
    }
  }
}

// =================== Lab accordion (expanding image panels) ===================
function setupLabAccordion() {
  const accordions = Array.from(document.querySelectorAll<HTMLElement>('[data-lab-accordion]'));
  accordions.forEach((acc) => {
    const panels = Array.from(acc.querySelectorAll<HTMLElement>('[data-lab-panel]'));
    if (!panels.length) return;
    const activate = (panel: HTMLElement) => {
      panels.forEach((p) => p.classList.toggle('is-active', p === panel));
    };
    panels.forEach((panel) => {
      panel.addEventListener('mouseenter', () => activate(panel));
      panel.addEventListener('click', () => activate(panel));
      panel.addEventListener('focusin', () => activate(panel));
    });
  });
}

// =================== Init ===================
function init() {
  setupLoader();
  setupNav();
  setupScrollCue();
  setupReveals();
  setupFaq();
  setupTilt();
  setupSolutionsCarousel();
  setupPillars();
  setupTimelineSpine();
  setupLabAccordion();
  setupCursor();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};
