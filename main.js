/* =============================================
   LADE STUCK & PUTZ GMBH – JavaScript
   ============================================= */

// ---- Theme (Hell/Dunkel) ----
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'lade-theme';

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
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

// ---- Navigation & Burger ----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobileMenu() {
  burger?.classList.remove('open');
  mobileMenu?.classList.remove('open');
  document.body.style.overflow = '';
}

// ---- SPA Router ----
function navigate(pageId, pushState = true) {
  // Alle Seiten ausblenden
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Zielseite einblenden
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  } else {
    document.getElementById('page-home')?.classList.add('active');
  }

  // Nav-Link-Highlighting
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === pageId);
  });

  // URL updaten
  if (pushState) {
    history.pushState({ page: pageId }, '', '#' + pageId);
  }

  // Scroll nach oben
  window.scrollTo({ top: 0, behavior: 'smooth' });

  closeMobileMenu();
  initAnimations();
}

// Alle Navigations-Links
document.querySelectorAll('[data-nav]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.nav);
  });
});

// Browser zurück/vor
window.addEventListener('popstate', e => {
  const page = e.state?.page || 'home';
  navigate(page, false);
});

// Initial
function initRouter() {
  const hash = location.hash.replace('#', '') || 'home';
  navigate(hash, false);
}

// ---- FAQ Akkordeon ----
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
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
    el.classList.remove('visible');
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
    btn.textContent = 'Wird gesendet…';
    btn.disabled = true;

    // Simulation (In Produktion: echten API-Aufruf ersetzen)
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

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRouter();
  initFAQ();
  initContactForm();

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
