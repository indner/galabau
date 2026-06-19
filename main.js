/* =============================================
   LADE STUCK & PUTZ GMBH – JavaScript
   (Mehrseiten-Version: jede Seite ist eine eigene
   HTML-Datei, kein SPA-Router mehr nötig)
   ============================================= */

// ---- Theme (Hell/Dunkel) ----
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'lade-theme';

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));
}

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ---- Navigation & Burger (mobiles Menü) ----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});

function closeMobileMenu() {
  burger?.classList.remove('open');
  mobileMenu?.classList.remove('open');
  document.body.style.overflow = '';
}

// Mobiles Menü schließen, sobald ein Link geklickt wird (normale Navigation,
// der Browser lädt die Zielseite ganz normal – kein SPA-Router mehr)
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// ---- FAQ Akkordeon ----
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ---- Scroll-Animationen ----
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ---- Kontaktformular ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();

    // Ausgewählte Leistungen sammeln
    const checked = [...form.querySelectorAll('input[name="leistung"]:checked')]
      .map(c => c.value).join(', ');

    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    btn.textContent = 'Wird gesendet…';
    btn.disabled = true;

    // Simulation des Versands
    setTimeout(() => {
      showToast('✅ Ihre Anfrage wurde gesendet! Wir melden uns bald.');
      form.reset();
      btn.textContent = 'Anfrage senden';
      btn.disabled = false;
    }, 1200);
  });
}

// ---- Toast ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ---- DomReady Init ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFAQ();
  initContactForm();
  initAnimations();

  // Navbar Scroll-Schatten
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
});
