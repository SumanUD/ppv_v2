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
  // Once a visitor interacts, autoplay stays off so the card they are
  // reaching for never rotates away under the pointer.
  let userTookOver = false;

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
    if (prefersReducedMotion || timer || userTookOver) return;
    timer = window.setInterval(() => goTo(activeIndex + 1), 5200);
  };

  prev?.addEventListener('click', () => {
    userTookOver = true;
    stopAuto();
    goTo(activeIndex - 1);
    startAuto();
  });

  next?.addEventListener('click', () => {
    userTookOver = true;
    stopAuto();
    goTo(activeIndex + 1);
    startAuto();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      userTookOver = true;
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
      userTookOver = true;

      // ACTIVE card: links work normally, and a click anywhere else on the
      // card opens that solution's landing page.
      if (slot === 'active') {
        stopAuto();
        if (!target.closest('a')) {
          const href = card.querySelector<HTMLAnchorElement>('.solution-cta')?.href;
          if (href) window.location.assign(href);
        }
        return;
      }

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
      userTookOver = true;
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

// =================== Contact form (VPS mailer at /api/contact) ===================
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\d{10}$/;

type ContactField = 'name' | 'email' | 'phone' | 'message';

// Same rules as server/contact-mailer/server.js; returns an error message or ''.
function contactFieldError(field: ContactField, raw: string): string {
  const value = raw.trim();
  switch (field) {
    case 'name':
      return value.length < 2 ? 'Please enter your name.' : '';
    case 'email':
      if (!value) return 'Please enter your email address.';
      return EMAIL_RE.test(value) ? '' : 'Please enter a valid email address, e.g. name@company.com.';
    case 'phone':
      if (!value) return 'Please enter your phone number.';
      return PHONE_RE.test(value) ? '' : 'Please enter a valid 10-digit phone number.';
    case 'message':
      return value.length < 10 ? 'Please tell us a little more (at least 10 characters).' : '';
  }
}

function setupContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const fields: ContactField[] = ['name', 'email', 'phone', 'message'];
  const fallback = 'Please email us at <a href="mailto:contact@platformplayventure.com">contact@platformplayventure.com</a> instead.';

  const control = (field: ContactField) =>
    form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | null;

  const setError = (field: ContactField, message: string) => {
    const el = control(field);
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    el?.closest('.form-field')?.classList.toggle('has-error', !!message);
    el?.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (slot) slot.textContent = message;
  };

  const check = (field: ContactField) => {
    const message = contactFieldError(field, control(field)?.value ?? '');
    setError(field, message);
    return !message;
  };

  const show = (kind: 'success' | 'error', html: string) => {
    if (!status) return;
    status.hidden = false;
    status.className = `form-status is-${kind}`;
    status.innerHTML = html;
  };

  // Phone: digits only, at most 10. Typing stops at 10; a pasted or autofilled
  // number keeps its last 10 digits, dropping a +91 / 0 prefix.
  const phone = control('phone');
  phone?.addEventListener('input', (event) => {
    let digits = phone.value.replace(/\D/g, '');
    if (digits.length > 10) {
      digits = (event as InputEvent).inputType === 'insertText' ? digits.slice(0, 10) : digits.slice(-10);
    }
    if (phone.value !== digits) phone.value = digits;
  });

  // Validate on blur, then live once a field has shown an error.
  fields.forEach((field) => {
    const el = control(field);
    el?.addEventListener('blur', () => {
      if (el.value.trim()) check(field);
    });
    el?.addEventListener('input', () => {
      if (el.closest('.form-field')?.classList.contains('has-error')) check(field);
    });
  });

  if (new URLSearchParams(location.search).get('form') === 'error') {
    show('error', `Sorry, your message could not be sent. ${fallback}`);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) status.hidden = true;

    const invalid = fields.filter((field) => !check(field));
    if (invalid.length) {
      control(invalid[0])?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (submit) submit.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 422 && json.errors) {
        Object.entries(json.errors as Record<ContactField, string>).forEach(([f, msg]) => setError(f as ContactField, msg));
        throw new Error('invalid');
      }
      if (!res.ok || !json.success) throw new Error(json.message || res.statusText);
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'contact_form_submit' });
      window.location.assign(json.redirect || '/thank-you/');
    } catch (err) {
      const reason = err instanceof Error && err.message === 'invalid' ? 'Please check the highlighted fields.' : `Sorry, your message could not be sent. ${fallback}`;
      show('error', reason);
      if (submit) submit.disabled = false;
    }
  });
}

// =================== Engagement (which service the enquiry is about) ===================
// Service pages link to /contact/?engagement=...; homepage links can carry
// data-engagement. Both fill the contact form's hidden field and info panel.
function setupEngagement() {
  const input = document.querySelector<HTMLInputElement>('[data-engagement-input]');
  const display = document.querySelector<HTMLElement>('[data-engagement-display]');
  if (!input) return;
  const apply = (raw: string | null) => {
    const value = (raw || '').replace(/[<>]/g, '').trim().slice(0, 60);
    if (!value) return;
    input.value = value;
    if (display) display.textContent = value;
  };
  apply(new URLSearchParams(location.search).get('engagement'));
  document.querySelectorAll<HTMLAnchorElement>('a[data-engagement]').forEach((link) => {
    link.addEventListener('click', () => apply(link.dataset.engagement || null));
  });
}

// =================== Land on #anchors reliably ===================
// Arriving at /#section, the browser jumps before images and fonts finish
// laying out, and ends up short of the target. Re-align once things settle.
function setupHashLanding() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  let userScrolled = false;
  const stop = () => { userScrolled = true; };
  window.addEventListener('wheel', stop, { once: true, passive: true });
  window.addEventListener('touchstart', stop, { once: true, passive: true });
  window.addEventListener('keydown', stop, { once: true });
  const align = () => {
    if (!userScrolled) target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  requestAnimationFrame(align);
  document.fonts?.ready.then(align).catch(() => {});
  if (document.readyState === 'complete') setTimeout(align, 60);
  else window.addEventListener('load', () => setTimeout(align, 60), { once: true });
}

// =================== Lead forms (HRMS, DMS, brief subscription) ===================
type LeadControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function leadFieldError(el: LeadControl, form: HTMLFormElement): string {
  if (el instanceof HTMLInputElement && el.type === 'radio') {
    const checked = form.querySelector(`input[name="${el.name}"]:checked`);
    return el.required && !checked ? 'Please choose one option.' : '';
  }
  if (el instanceof HTMLInputElement && el.type === 'checkbox') {
    return el.required && !el.checked ? 'Please tick this box to continue.' : '';
  }
  const value = el.value.trim();
  if (el.required && !value) {
    return el instanceof HTMLSelectElement ? 'Please select an option.' : 'This field is required.';
  }
  if (!value) return '';
  if (el instanceof HTMLInputElement && el.type === 'email' && !EMAIL_RE.test(value)) {
    return 'Please enter a valid email address, e.g. name@company.com.';
  }
  if (el.hasAttribute('data-phone') && !PHONE_RE.test(value)) return 'Please enter a valid 10-digit phone number.';
  const min = Number(el.getAttribute('minlength') || 0);
  if (min && value.length < min) return `Please enter at least ${min} characters.`;
  return '';
}

function setupLeadForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    const type = form.dataset.leadForm || 'lead';
    const body = form.querySelector<HTMLElement>('.lead-form-body');
    const success = form.querySelector<HTMLElement>('[data-lead-success]');
    const status = form.querySelector<HTMLElement>('[data-lead-status]');
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const controls = Array.from(form.querySelectorAll<LeadControl>('input:not([type="hidden"]):not(.form-honeypot), select, textarea'));

    const slotFor = (name: string) => form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    const setError = (name: string, message: string) => {
      const slot = slotFor(name);
      if (slot) slot.textContent = message;
      form.querySelectorAll<LeadControl>(`[name="${name}"]`).forEach((el) => {
        el.setAttribute('aria-invalid', message ? 'true' : 'false');
        el.closest('.lead-field, .lead-check')?.classList.toggle('has-error', !!message);
      });
    };
    const check = (el: LeadControl) => {
      const message = leadFieldError(el, form);
      setError(el.name, message);
      return !message;
    };

    controls.forEach((el) => {
      if (el.hasAttribute('data-phone')) {
        el.addEventListener('input', () => {
          const digits = el.value.replace(/\D/g, '').slice(-10);
          if (el.value !== digits) el.value = digits;
        });
      }
      const event = el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox') ? 'change' : 'blur';
      el.addEventListener(event, () => {
        if (event === 'change' || el.value.trim()) check(el);
      });
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true') check(el);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) status.hidden = true;
      // One check per field name (radio groups share a name).
      const seen = new Set<string>();
      const invalid = controls.filter((el) => {
        if (!el.name || seen.has(el.name)) return false;
        seen.add(el.name);
        return !check(el);
      });
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const data: Record<string, string> = {};
      new FormData(form).forEach((v, k) => { data[k] = String(v); });
      if (submit) {
        submit.disabled = true;
        submit.classList.add('is-busy');
      }
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (res.status === 422 && json.errors) {
          Object.entries(json.errors as Record<string, string>).forEach(([name, msg]) => setError(name, msg));
          throw new Error('invalid');
        }
        if (!res.ok || !json.success) throw new Error(json.message || res.statusText);
        (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: `${type}_form_submit` });
        if (body) body.hidden = true;
        if (success) {
          success.hidden = false;
          success.focus({ preventScroll: true });
          success.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
        }
      } catch (err) {
        if (status) {
          status.hidden = false;
          status.innerHTML = err instanceof Error && err.message === 'invalid'
            ? 'Please check the highlighted fields.'
            : 'Sorry, we could not send this right now. Please try again, or email us at <a href="mailto:contact@platformplayventure.com">contact@platformplayventure.com</a>.';
        }
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.classList.remove('is-busy');
        }
      }
    });
  });
}

// =================== Brief subscription dialog ===================
function setupBriefDialog() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-brief-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  document.querySelectorAll<HTMLElement>('[data-brief-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialog.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
    });
  });
  dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  // Click on the backdrop closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
}

// =================== DMS modules carousel ===================
function setupModCarousel() {
  const root = document.querySelector<HTMLElement>('[data-mod-carousel]');
  if (!root) return;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-mod-card]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-mod-dot]'));
  const n = cards.length;
  let active = 0;

  const render = () => {
    cards.forEach((card, i) => {
      const offset = (i - active + n) % n;
      const slot = offset === 0 ? 'active' : offset === 1 ? 'next' : offset === n - 1 ? 'prev' : 'far';
      card.dataset.slot = slot;
      card.setAttribute('aria-hidden', String(slot !== 'active'));
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === active);
      d.setAttribute('aria-current', i === active ? 'true' : 'false');
    });
  };
  const go = (i: number) => {
    active = (i + n) % n;
    render();
  };

  root.querySelector('[data-mod-prev]')?.addEventListener('click', () => go(active - 1));
  root.querySelector('[data-mod-next]')?.addEventListener('click', () => go(active + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (card.dataset.slot !== 'active') go(i);
    });
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  });

  let startX = 0;
  let startY = 0;
  root.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1));
  }, { passive: true });

  render();
}

// =================== DMS role tabs (feature matrix) ===================
function setupRbac() {
  const root = document.querySelector<HTMLElement>('[data-rbac]');
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-rbac-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-rbac-panel]'));
  const select = (i: number, focus = false) => {
    tabs.forEach((t, ti) => {
      const on = ti === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p, pi) => { p.hidden = pi !== i; });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select((i + 1) % tabs.length, true); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
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
  setupContactForm();
  setupEngagement();
  setupLeadForms();
  setupBriefDialog();
  setupModCarousel();
  setupRbac();
  setupCursor();
  setupHashLanding();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};
