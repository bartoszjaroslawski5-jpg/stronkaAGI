/* ════════════════════════════════════════════
   NIEZAPOMNIANE ANIMACJE — engine 2.0
   ════════════════════════════════════════════ */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================
   CIUCHCIA 🚂
   Animacja oparta na czasie (delta time):
   przejazd trwa tyle samo na każdym ekranie,
   więc na telefonie nie pędzi jak szalona.
   ========================================== */
function animateTrain() {
  if (prefersReducedMotion()) return;

  const hero = document.querySelector('.hero');
  const track = document.querySelector('.train-track');
  if (!hero || !track) return;

  const container = document.createElement('div');
  container.className = 'train-container';

  const img = document.createElement('img');
  img.src = 'resources/7.png';
  img.alt = '';
  container.appendChild(img);
  hero.appendChild(container);

  img.addEventListener('load', () => {
    // Rozmiar ciuchci dopasowany do ekranu
    const height = Math.max(70, Math.min(window.innerWidth * 0.16, 150));
    container.style.height = height + 'px';
    // Ciuchcia jedzie "po torze" — spód wagoników na linii toru
    container.style.top = (track.offsetTop - height + 3) + 'px';

    const trainWidth = img.offsetWidth || height * 2;
    const CROSSING_SECONDS = 11; // pełny przejazd — zawsze tyle samo
    const distance = window.innerWidth + trainWidth;
    const speed = distance / CROSSING_SECONDS; // px na sekundę

    let x = -trainWidth;
    let lastTime = null;

    function step(now) {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05); // zabezpieczenie przy zmianie karty
      lastTime = now;

      x += speed * dt;
      img.style.transform = `translateX(${x}px)`;

      if (x > window.innerWidth) {
        container.remove();
        return;
      }
      requestAnimationFrame(step);
    }

    setTimeout(() => requestAnimationFrame(step), 1600);
  });
}
window.addEventListener('load', animateTrain);

/* ==========================================
   POP-UP TELEFONICZNY
   ========================================== */
const popup = document.getElementById('phone-popup');
const closePopupBtn = document.getElementById('close-popup');

function openPopup() {
  popup.classList.add('active');
}
function closePopup() {
  popup.classList.remove('active');
}

document.querySelectorAll('[data-open-popup]').forEach((btn) => {
  btn.addEventListener('click', openPopup);
});
closePopupBtn.addEventListener('click', closePopup);
popup.addEventListener('click', (e) => {
  if (e.target === popup) closePopup();
});

/* ==========================================
   HAMBURGER / MENU MOBILNE
   ========================================== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ==========================================
   SCROLL: NAVBAR, SCROLL-SPY, BACK-TO-TOP
   ========================================== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
const spySections = document.querySelectorAll('#atrakcje, #urodziny, #bale, #galeria, #kontakt');

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 30);
  backToTop.classList.toggle('visible', y > 600);

  let currentId = null;
  spySections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom > 140) currentId = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
});

/* ==========================================
   SCROLL REVEAL
   ========================================== */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  // efekt "fali" w siatkach kart
  document.querySelectorAll('.attr-grid, .ball-cards').forEach((grid) => {
    Array.from(grid.children).forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
    });
  });

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => observer.observe(el));
}
initReveal();

/* ==========================================
   KONFETTI 🎊
   ========================================== */
function burstConfetti(x, y) {
  if (prefersReducedMotion()) return;

  const colors = ['#f0288f', '#ffc531', '#06d6a0', '#29a9e1', '#8b5cf6'];
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 130;
    piece.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    piece.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    piece.style.setProperty('--rot', `${Math.random() * 420}deg`);

    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

document.querySelectorAll('.confetti-trigger').forEach((btn) => {
  btn.addEventListener('click', (e) => burstConfetti(e.clientX, e.clientY));
});

/* ==========================================
   LIGHTBOX — plakat + galeria
   ========================================== */
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.getElementById('close-lightbox');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Powiększone zdjęcie';
  lightbox.classList.add('active');
}
function closeLightbox() {
  lightbox.classList.remove('active');
}

const posterEl = document.getElementById('offer-poster');
if (posterEl) {
  posterEl.addEventListener('click', () => {
    const img = posterEl.querySelector('img');
    openLightbox(img.src, img.alt);
  });
}

document.querySelectorAll('.gallery figure').forEach((fig) => {
  fig.addEventListener('click', () => {
    const img = fig.querySelector('img');
    openLightbox(img.src, img.alt);
  });
});

closeLightboxBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ==========================================
   ESCAPE — zamyka wszystko, co otwarte
   ========================================== */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (popup.classList.contains('active')) closePopup();
  if (lightbox.classList.contains('active')) closeLightbox();
  if (navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});
