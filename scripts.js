/* ===================== THEME TOGGLE ===================== */
(function () {
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (iconSun && iconMoon) {
      iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
      iconSun.style.display  = theme === 'dark' ? 'none'  : 'block';
    }
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
})();

/* ===================== FADE-UP ON SCROLL ===================== */
(function () {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();

/* ===================== CAROUSEL (index.html) ===================== */
(function () {
  const carousel = document.getElementById('carousel');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  if (!carousel || !prevBtn || !nextBtn) return;

  const cardWidth = 300 + 20;
  nextBtn.addEventListener('click', () => carousel.scrollBy({ left:  cardWidth, behavior: 'smooth' }));
  prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' }));
})();

/* ===================== WORKS FILTER (works.html) ===================== */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.grid-card');
  const emptyState = document.getElementById('emptyState');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible = 0;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
    });
  });
})();
/* ===================== MODAL (works.html) ===================== */
(function () {
  const openBtns = document.querySelectorAll('.open-modal');
  const overlays  = document.querySelectorAll('.modal-overlay');
  if (!openBtns.length) return;

  function buildDots(overlay) {
    const slides = overlay.querySelectorAll('.modal-slide');
    const dotsWrap = overlay.querySelector('.modal-dots');
    if (!dotsWrap || !slides.length) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'modal-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(overlay, i));
      dotsWrap.appendChild(d);
    });
  }

  function goTo(overlay, index) {
    const slides = overlay.querySelectorAll('.modal-slide');
    const dots   = overlay.querySelectorAll('.modal-dot');
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i)   => d.classList.toggle('active', i === index));
    overlay.dataset.current = index;
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    buildDots(el);
    goTo(el, 0);
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAll() {
    overlays.forEach(o => o.classList.remove('active'));
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.dataset.modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAll();
    });

    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeAll);

    const prevBtn = overlay.querySelector('.modal-arrow-prev');
    const nextBtn = overlay.querySelector('.modal-arrow-next');
    const total   = overlay.querySelectorAll('.modal-slide').length;

    if (prevBtn) prevBtn.addEventListener('click', () => {
      const cur = parseInt(overlay.dataset.current || 0);
      goTo(overlay, (cur - 1 + total) % total);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      const cur = parseInt(overlay.dataset.current || 0);
      goTo(overlay, (cur + 1) % total);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
    const active = document.querySelector('.modal-overlay.active');
    if (!active) return;
    const total = active.querySelectorAll('.modal-slide').length;
    const cur   = parseInt(active.dataset.current || 0);
    if (e.key === 'ArrowLeft')  goTo(active, (cur - 1 + total) % total);
    if (e.key === 'ArrowRight') goTo(active, (cur + 1) % total);
  });
})();

/* ===================== BURGER MENU ===================== */
(function () {
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  if (!burger || !mobileMenu) return;

  function toggleMenu(force) {
    const isOpen = force !== undefined ? force : !burger.classList.contains('open');
    burger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', () => toggleMenu());

  // Close when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on resize back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggleMenu(false);
  });
})();
/* ===================== BACK TO TOP ===================== */
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
/* ===================== SMOOTH SCROLL (cross-page anchor) ===================== */
(function () {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    // Briefly push back to top, then scroll smoothly to target
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
})();
/* ===================== COPY TO CLIPBOARD ===================== */
(function () {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const copyIcon  = btn.querySelector('.copy-icon');
        const checkIcon = btn.querySelector('.check-icon');
        const label     = btn.querySelector('.copy-label');

        copyIcon.style.display  = 'none';
        checkIcon.style.display = 'block';
        label.textContent       = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          copyIcon.style.display  = 'block';
          checkIcon.style.display = 'none';
          label.textContent       = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
})();