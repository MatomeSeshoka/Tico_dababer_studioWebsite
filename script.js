// ===================== HELPERS =====================
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ===================== HEADER SCROLL DETECTION =====================
(() => {
  const header = $('header');
  if (!header) return;

  const threshold = 60;
  let ticking = false;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > threshold);
    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  onScroll(); // Initial check
})();

// ===================== REVEAL ON SCROLL =====================
(() => {
  // Exclude #lookbook to prevent 3D carousel breakage
  const revealItems = $$('main section:not(#lookbook), .service-card, .price-box, .team-card, .teaser-card');
  if (!revealItems.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => io.observe(el));

  // Reduced motion fallback
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((el) => el.classList.add('reveal-visible'));
    io.disconnect();
  }
})();

// ===================== INLINE CSS FOR REVEAL ANIMATION =====================
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(18px); }
    .reveal-visible {
      opacity: 1;
      transform: none;
      transition: opacity 560ms ease, transform 560ms ease;
    }
    @media (prefers-reduced-motion: reduce) {
      .reveal, .reveal-visible {
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

// ===================== HERO PARALLAX EFFECT =====================
(() => {
  const heroImg = $('.hero-media img');
  if (!heroImg) return;

  const intensity = 6;
  let ticking = false;

  const parallax = () => {
    const rect = heroImg.getBoundingClientRect();
    const visible = Math.max(
      0,
      Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
    );
    heroImg.style.transform = `translateY(${(visible - 0.5) * -intensity}%) scale(1.02)`;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(parallax);
      ticking = true;
    }
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroImg.style.transform = 'none';
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  parallax();
})();

// ===================== GALLERY LIGHTBOX =====================
(() => {
  const galleryImgs = $$('.gallery-item img, .gallery-grid img, .carousel-item img');
  if (!galleryImgs.length) return;

  let lightbox = null;

  const createLightbox = () => {
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="close" aria-label="Close image">&times;</button>
        <img src="" alt="">
        <div class="caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.close');
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    return lightbox;
  };

  const openLightbox = (img) => {
    lightbox = createLightbox();
    const lightboxImg = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.caption');

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || 'Enlarged image';
    caption.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt || '';

    lightbox.classList.add('visible');
    lightbox.querySelector('.close').focus();
  };

  const closeLightbox = () => {
    if (lightbox) lightbox.classList.remove('visible');
  };

  galleryImgs.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img));
  });
})();
   

// ===================== CTA PULSE ANIMATION =====================
(() => {
  const ctas = $$('.cta-primary, .book-now');
  if (!ctas.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pulse = (el) => {
    el.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.04)' },
        { transform: 'scale(1)' }
      ],
      { duration: 900, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' }
    );
  };

  ctas.forEach((el) => {
    setInterval(() => pulse(el), 6000);
  });
})();

// ===================== HERO SCROLL EFFECTS =====================
(() => {
  const hero      = $('.hero');
  const heroInner = $('.hero-inner');
  if (!hero && !heroInner) return;

  const bgSpeed    = 0.4;
  const innerSpeed = -0.15;
  let ticking = false;

  const applyEffects = () => {
    const scrollY = window.scrollY;
    if (hero) hero.style.backgroundPositionY = `${scrollY * bgSpeed}px`;
    if (heroInner) heroInner.style.transform = `translateY(${scrollY * innerSpeed}px)`;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(applyEffects);
      ticking = true;
    }
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (hero) hero.style.backgroundPositionY = 'center';
    if (heroInner) heroInner.style.transform = 'none';
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  applyEffects();
  const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
})();

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});