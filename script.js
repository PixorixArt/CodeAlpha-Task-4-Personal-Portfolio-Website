document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initNavbarScroll();
  initHamburgerMenu();
  initSmoothScroll();
  initActiveNavHighlight();
  initTypingAnimation();
  initScrollReveal();
  initProjectFilter();
  initContactForm();
  initBackToTop();
});

/* ---------- FOOTER YEAR ---------- */
function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------- NAVBAR SCROLL EFFECT ---------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleScrolled = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* ---------- MOBILE HAMBURGER MENU ---------- */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------- SMOOTH SCROLLING ---------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------- ACTIVE NAVIGATION HIGHLIGHT ---------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- TYPING ANIMATION ---------- */
function initTypingAnimation() {
  const el = document.getElementById('typedRole');
  if (!el) return;

  const roles = [
    'Front-End Developer',
    'Learning Full-Stack Development',
    'CodeAlpha Intern',
    'JavaScript Enthusiast'
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeSpeed = 65;
  const deleteSpeed = 35;
  const holdTime = 1400;

  function tick() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(tick, holdTime);
        return;
      }
    } else {
      charIndex--;
      el.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }

  tick();
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- PROJECT FILTERING ---------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const categories = card.dataset.category || '';
        const matches = filter === 'all' || categories.split(' ').includes(filter);
        card.classList.toggle('hidden', !matches);
      });
    });
  });
}

/* ---------- CONTACT FORM VALIDATION ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, errorEl, message) {
    input.classList.add('invalid');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('invalid');
    errorEl.textContent = '';
  }

  function validateField(input, errorEl, fieldName) {
    const value = input.value.trim();

    if (!value) {
      showError(input, errorEl, `${fieldName} is required.`);
      return false;
    }

    if (input === emailInput && !emailPattern.test(value)) {
      showError(input, errorEl, 'Please enter a valid email address.');
      return false;
    }

    clearError(input, errorEl);
    return true;
  }

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('blur', () => {
      const errorEl = input === nameInput ? nameError : input === emailInput ? emailError : messageError;
      const label = input === nameInput ? 'Name' : input === emailInput ? 'Email' : 'Message';
      validateField(input, errorEl, label);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.textContent = '';

    const isNameValid = validateField(nameInput, nameError, 'Name');
    const isEmailValid = validateField(emailInput, emailError, 'Email');
    const isMessageValid = validateField(messageInput, messageError, 'Message');

    if (isNameValid && isEmailValid && isMessageValid) {
      // NOTE: There is no backend connected to this form.
      // Real email delivery requires backend or email-service integration
      // (e.g. Formspree, EmailJS, or a custom server endpoint).
      formSuccess.textContent = "Thanks! Your message looks good — form submission isn't connected to a backend yet.";
      form.reset();
      [nameInput, emailInput, messageInput].forEach((input) => {
        input.classList.remove('invalid');
      });
    }
  });
}

/* ---------- BACK TO TOP BUTTON ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
