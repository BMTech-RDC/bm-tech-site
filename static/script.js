/* ============================================================
   BM TECH — Main Script v2.1 (Static — sans Flask)
   contact@bm-tech.online
   ============================================================ */

/* ─── Navbar scroll effect ──────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const handleNavbarScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();
}

/* ─── Mobile menu ───────────────────────────────────────────── */
function toggleMenu() {
  const navLinks  = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobile-overlay');
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle('active');
  if (hamburger) {
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }
  if (overlay) overlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks  = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    const overlay   = document.getElementById('mobile-overlay');
    if (navLinks?.classList.contains('active')) {
      navLinks.classList.remove('active');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

/* ─── Scroll Reveal — .reveal ───────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Scroll Reveal — [data-reveal] ─────────────────────────── */
const dataRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      dataRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => dataRevealObserver.observe(el));

/* ─── Progress bars animation ───────────────────────────────── */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.wv-progress, .sd-progress-fill, .pscm-bar-fill');
      if (bar) {
        const target = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
          setTimeout(() => { bar.style.width = target; }, 100);
        });
      }
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.wv-card, .school-dashboard, .psc-mockup').forEach(el => {
  progressObserver.observe(el);
});

/* ─── Active nav link ────────────────────────────────────────── */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('#')[0] === path) {
      link.classList.add('active');
    } else if (href !== 'index.html' && href !== '/') {
      link.classList.remove('active');
    }
  });
})();

/* ─── Smooth scroll ancres ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── Formulaire de contact — FormSubmit (sans backend) ───────
   FormSubmit envoie l'email puis redirige normalement vers la
   page indiquée dans _next. On laisse faire la redirection
   navigateur native (pas de fetch) car FormSubmit gère le
   captcha par email lors de la 1ère soumission. ─────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {

  // Ajoute dynamiquement la page de retour (avec succès)
  const nextInput = document.createElement('input');
  nextInput.type = 'hidden';
  nextInput.name = '_next';
  nextInput.value = window.location.origin + window.location.pathname.replace('contact.html', 'contact.html') + '?sent=true';
  contactForm.appendChild(nextInput);

  contactForm.addEventListener('submit', (e) => {
    // Validation simple avant envoi
    const name    = contactForm.querySelector('[name="name"]');
    const email   = contactForm.querySelector('[name="email"]');
    const message = contactForm.querySelector('[name="message"]');
    const service = contactForm.querySelector('[name="service"]');

    let valid = true;
    [name, email, message, service].forEach(f => f?.classList.remove('form-input--error'));

    if (!name?.value.trim() || name.value.trim().length < 2) { name.classList.add('form-input--error'); valid = false; }
    if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('form-input--error'); valid = false; }
    if (!message?.value.trim() || message.value.trim().length < 10) { message.classList.add('form-input--error'); valid = false; }
    if (!service?.value) { service.classList.add('form-input--error'); valid = false; }

    if (!valid) {
      e.preventDefault();
      showAlert('error', 'Merci de remplir correctement tous les champs obligatoires (*).');
      return;
    }

    // Affiche un état "envoi en cours" — le formulaire soumet normalement (redirection)
    const btn = contactForm.querySelector('[type="submit"]');
    const btnText = btn.querySelector('.btn-text') || btn;
    btn.disabled = true;
    btnText.textContent = 'Envoi en cours…';
  });
}

// Affiche le message de succès si on revient avec ?sent=true
if (window.location.search.includes('sent=true')) {
  window.addEventListener('DOMContentLoaded', () => {
    showAlert('success', 'Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 24h.');
    const form = document.getElementById('contact-form');
    form?.reset();
    // Nettoyer l'URL
    if (history.replaceState) {
      const cleanUrl = window.location.pathname;
      history.replaceState(null, '', cleanUrl);
    }
  });
}

function showAlert(type, message) {
  const form = document.getElementById('contact-form');
  if (!form) return;
  document.querySelector('.form-alert')?.remove();
  const alert = document.createElement('div');
  alert.className = `form-alert alert--${type}`;
  alert.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'} ${message}</span>`;
  form.insertAdjacentElement('afterend', alert);
  if (type === 'success') setTimeout(() => alert.remove(), 8000);
}

/* ─── i18n — Traductions ─────────────────────────────────────── */
const translations = {
  fr: {
    'badge-text':         'Entreprise technologique africaine · RDC & Cameroun',
    'hero-line1':         'Nous transformons',
    'hero-line2':         'vos idées',
    'hero-line3':         'en solutions digitales',
    'hero-sub':           "Développement web & mobile, intelligence artificielle, cybersécurité et logiciels métier — des solutions conçues pour les entreprises et entrepreneurs africains.",
    'hero-btn-primary':   'Démarrer un projet',
    'hero-btn-secondary': 'Découvrir nos services',
    'trust-1': 'Projets livrés',
    'trust-2': 'Clients satisfaits',
    'trust-3': 'Pays couverts',
    'svc-label': 'Nos Solutions',
    'svc-title': 'Des technologies au service de votre croissance',
    'svc-cta':   'Voir tous nos services',
    'why-label': 'Pourquoi BM Tech ?',
    'why-title': 'Une tech company africaine, pas une simple agence',
  },
  en: {
    'badge-text':         'African tech company · DRC & Cameroon',
    'hero-line1':         'We transform',
    'hero-line2':         'your ideas',
    'hero-line3':         'into digital solutions',
    'hero-sub':           'Web & mobile development, AI, cybersecurity and business software — solutions built for African businesses.',
    'hero-btn-primary':   'Start a project',
    'hero-btn-secondary': 'Discover our services',
    'trust-1': 'Projects delivered',
    'trust-2': 'Satisfied clients',
    'trust-3': 'Countries covered',
    'svc-label': 'Our Solutions',
    'svc-title': 'Technologies that drive your growth',
    'svc-cta':   'View all services',
    'why-label': 'Why BM Tech?',
    'why-title': 'An African tech company, not just an agency',
  }
};

function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  Object.keys(dict).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = dict[id];
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.textContent.trim().toLowerCase() === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  document.documentElement.lang = lang;
  localStorage.setItem('bmt-lang', lang);
}

const savedLang = localStorage.getItem('bmt-lang');
if (savedLang && savedLang !== 'fr') setLanguage(savedLang);
