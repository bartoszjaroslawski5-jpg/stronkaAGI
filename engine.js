/* ==========================================
   POCIĄG - istniejąca animacja (z poszanowaniem
   preferencji ograniczonego ruchu)
   ========================================== */
function animateTrain() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const trainContainer = document.createElement('div');
  const trainImage = document.createElement('img');
  trainContainer.style.position = 'fixed';
  trainContainer.style.left = '0';
  trainContainer.style.width = '100%';
  trainContainer.style.height = '200px';
  trainContainer.style.overflow = 'hidden';
  trainContainer.style.zIndex = '500';
  trainContainer.style.top = '50px';
  trainImage.src = 'resources/7.png';
  trainImage.alt = 'Train';
  trainImage.style.position = 'absolute';
  trainImage.style.height = '100%';
  trainImage.style.width = 'auto';
  trainImage.style.left = '-100%';
  trainContainer.appendChild(trainImage);
  document.body.prepend(trainContainer);

  let position = -trainImage.offsetWidth;
  const animationSpeed = 6;
  let passCount = 0;
  const maxPasses = 1;

  function moveTrain() {
    position += animationSpeed;
    trainImage.style.left = position + 'px';
    if (position > window.innerWidth) {
      position = -trainImage.offsetWidth;
      passCount++;
      if (passCount >= maxPasses) {
        trainContainer.remove();
        return;
      }
    }
    requestAnimationFrame(moveTrain);
  }
  moveTrain();
}
window.addEventListener('load', animateTrain);

/* ==========================================
   POP-UP TELEFONICZNY
   ========================================== */
const openBtn = document.getElementById('open-popup');
const closeBtn = document.getElementById('close-popup');
const popup = document.getElementById('phone-popup');

function closePopup() {
  popup.classList.remove('active');
}

openBtn.addEventListener('click', () => {
  popup.classList.add('active');
});

// Zamykanie przez kliknięcie w X (myszką lub klawiaturą)
closeBtn.addEventListener('click', closePopup);
closeBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    closePopup();
  }
});

// Zamykanie przez kliknięcie w szare tło poza okienkiem
window.addEventListener('click', (e) => {
  if (e.target === popup) closePopup();
});

// Zamykanie klawiszem Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
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
   SCROLL: NAVBAR "SCROLLED", SCROLL-SPY, BACK-TO-TOP
   ========================================== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
const spySections = document.querySelectorAll('#home, #urodziny, #bale, #kontakt');

function onScroll() {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 40);
  backToTop.classList.toggle('visible', scrollY > 500);

  let currentId = 'home';
  spySections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 130 && rect.bottom > 130) {
      currentId = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================
   KARUZELA - strzałki, kropki, autoplay, swipe
   ========================================== */
function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-slides]');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('[data-prev]');
  const nextBtn = carousel.querySelector('[data-next]');
  const dotsWrap = carousel.querySelector('[data-dots]');
  const AUTOPLAY_MS = 4500;

  let index = 0;
  let autoplayId = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Przejdź do zdjęcia ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goTo(i);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
    if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
  });

  // Obsługa przesunięcia palcem (swipe) na telefonie
  let touchStartX = null;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      diff < 0 ? next() : prev();
      restartAutoplay();
    }
    touchStartX = null;
  });

  function startAutoplay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAutoplay();
    autoplayId = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    clearInterval(autoplayId);
  }
  function restartAutoplay() {
    startAutoplay();
  }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  render();
  startAutoplay();
}
initCarousel();

/* ==========================================
   SCROLL REVEAL - karty i sekcje wjeżdżają płynnie
   ========================================== */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  // Stopniowe opóźnienie dla kart w siatkach (efekt "fali")
  document.querySelectorAll('.birthday-grid').forEach((grid) => {
    Array.from(grid.children).forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 80, 400)}ms`;
    });
  });
  document.querySelectorAll('.ball-cards').forEach((grid) => {
    Array.from(grid.children).forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 100, 300)}ms`;
    });
  });

  if (!('IntersectionObserver' in window)) {
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
  }, { threshold: 0.15 });

  reveals.forEach((el) => observer.observe(el));
}
initReveal();

/* ==========================================
   KONFETTI - mały "wow efekt" po kliknięciu w CTA
   ========================================== */
function burstConfetti(x, y) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#ff4a5a', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff'];
  const count = 24;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    piece.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    piece.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
    piece.style.setProperty('--rot', `${Math.random() * 360}deg`);

    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

document.querySelectorAll('.confetti-trigger').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    burstConfetti(e.clientX, e.clientY);
  });
});
/* ==========================================
   POWIĘKSZANIE PLAKATU (LIGHTBOX)
   ========================================== */
const posterImg = document.querySelector('.offer-poster img');
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.getElementById('close-lightbox');

function closeLightbox() {
  lightbox.classList.remove('active');
}

if (posterImg && lightbox) {
  posterImg.addEventListener('click', () => {
    lightboxImg.src = posterImg.src; 
    lightbox.classList.add('active');
  });

  // Zamykanie powiększonego zdjęcia (X)
  closeLightboxBtn.addEventListener('click', closeLightbox);
  
  // Zamykanie przez kliknięcie w tło
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Zamykanie klawiszem Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================
   POWIĘKSZANIE PLAKATU Z MIEJSCA (ZOOM IN-PLACE)
   ========================================== */
const posteroImg = document.querySelector('.offer-poster img');
let isZoomed = false;

const overlay = document.createElement('div');
overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); opacity:0; transition:opacity 0.4s; pointer-events:none; z-index:9998;';
document.body.appendChild(overlay);

function closeZoom() {
  if (!isZoomed) return;
  isZoomed = false;
  
  posterImg.classList.remove('zoomed-in');
  posterImg.style.transform = '';
  
  // Wymuszenie natychmiastowego odrysowania klatki przez przeglądarkę (tzw. reflow)
  void posterImg.offsetWidth; 
  
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
}

if (posterImg) {
  posterImg.addEventListener('click', (e) => {
    e.stopPropagation(); // Blokuje konflikty z innymi kliknięciami
    
    if (!isZoomed) {
      const rect = posterImg.getBoundingClientRect();
      const moveX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
      const moveY = (window.innerHeight / 2) - (rect.top + rect.height / 2);
      const scale = (window.innerHeight * 0.85) / rect.height;

      posterImg.classList.add('zoomed-in');
      // Dodane translateZ(0) przerzuca pracę na GPU
      posterImg.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale}) translateZ(0)`;
      
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      isZoomed = true;
    } else {
      closeZoom();
    }
  });

  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    closeZoom();
  });

  window.addEventListener('scroll', () => {
    closeZoom();
  }, { passive: true });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeZoom();
  });
}
/* ==========================================
   OPÓŹNIONY POP-UP "ZAREZERWUJ BAL"
   ========================================== */
const openBallBtn = document.getElementById('open-ball-popup');

if (openBallBtn) {
  openBallBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Zmienna popup jest już zdefiniowana w innej części Twojego pliku, więc to zadziała
    setTimeout(() => {
      popup.classList.add('active');
    }, 500);
  });
}