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

// ---- Navigation & Burger ----
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

// ---- SPA Router ----
function navigate(pageId, pushState = true) {
  if (!pageId) pageId = 'home';

  // Alle Seiten ausblenden
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Zielseite ermitteln (sucht nach page-home, page-leistungen, page-leistung-innenputz etc.)
  let target = document.getElementById('page-' + pageId);

  if (target) {
    target.classList.add('active');
  } else {
    // Falls die ID nicht existiert, Fallback auf Home
    const homeTarget = document.getElementById('page-home');
    if (homeTarget) homeTarget.classList.add('active');
    pageId = 'home';
  }

  // Nav-Link-Highlighting (Fehlertolerant gegen Unterseiten im Footer)
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav) {
      // Aktiviert den Haupt-Nav-Punkt "Leistungen", wenn man sich auf einer Leistungs-Unterseite befindet
      const isCurrent = a.dataset.nav === pageId || (pageId.startsWith('leistung-') && a.dataset.nav === 'leistungen');
      a.classList.toggle('active', isCurrent);
    }
  });

  // URL updaten
  if (pushState) {
    history.pushState({ page: pageId }, '', '#' + pageId);
  }

  // Scroll nach oben (auto verhindert sichtbares Ruckeln beim Rendern)
  window.scrollTo({ top: 0, behavior: 'auto' });

  closeMobileMenu();
  
  // Animationen leicht verzögert triggern, damit Elemente im neuen Sichtfenster korrekt einblenden
  setTimeout(() => {
    initAnimations();
  }, 50);
}

// Alle Navigations-Links sicher binden
document.querySelectorAll('[data-nav]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    if (link.dataset.nav) {
      navigate(link.dataset.nav);
    }
  });
});

// Browser zurück/vor Buttons abfangen
window.addEventListener('popstate', e => {
  const page = e.state?.page || 'home';
  navigate(page, false);
});

// Start-Initialisierung des Routers
function initRouter() {
  const hash = location.hash.replace('#', '') || 'home';
  navigate(hash, false);
}

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

// ---- Globale Zuweisung für inline onclick-Attribute (z.B. in den Service-Cards) ----
window.navigate = navigate;

// ---- DomReady Init ----
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
