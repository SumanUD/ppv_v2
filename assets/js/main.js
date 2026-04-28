    const body = document.body;
    const loader = document.querySelector(".loader");
    const shell = document.querySelector(".site-shell");
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");
    const progress = document.querySelector(".scroll-progress");
    const menuLinks = [...document.querySelectorAll(".nav-links a")];
    const sections = menuLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const updateScrollState = () => {
      const scrolled = window.scrollY > 18;
      nav.classList.toggle("is-scrolled", scrolled);

      const height = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = height > 0 ? window.scrollY / height : 0;
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    };

    const setActiveLink = () => {
      const marker = Math.max(130, window.innerHeight * 0.34);
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= marker && rect.bottom >= marker;
      });

      menuLinks.forEach((link) => {
        link.classList.toggle("is-active", Boolean(current) && link.getAttribute("href") === `#${current.id}`);
      });
    };

    window.addEventListener("load", () => {
      window.setTimeout(() => {
        loader.classList.add("is-hidden");
        shell.classList.add("is-ready");
        body.classList.remove("is-loading");
        updateScrollState();
        setActiveLink();
      }, 1550);
    });

    window.addEventListener("scroll", () => {
      updateScrollState();
      setActiveLink();
    }, { passive: true });

    toggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      nav.classList.toggle("is-open", isOpen);
      body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navLinks.classList.remove("is-open");
        nav.classList.remove("is-open");
        body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });

    document.querySelectorAll(".reveal").forEach((element, index) => {
      element.style.setProperty("--delay", `${Math.min(index % 5, 4) * 70}ms`);
      observer.observe(element);
    });

    document.querySelectorAll("main > section:not(.hero), .footer").forEach((section, index) => {
      section.classList.add("section-flow");
      section.style.setProperty("--section-delay", `${Math.min(index, 3) * 40}ms`);
      sectionObserver.observe(section);
    });

    updateScrollState();
    setActiveLink();
