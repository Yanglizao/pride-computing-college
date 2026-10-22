
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const loginForm = document.getElementById('login-form');
  if (contactForm) initContactForm(contactForm);
  if (loginForm) initLoginForm(loginForm);
});

/* ---------- helpers ---------- */
function showError(input, message) {
  clearError(input);
  input.classList.add('invalid');
  const p = document.createElement('p');
  p.className = 'field-error';
  p.textContent = message; // textContent is safe from HTML injection
  input.insertAdjacentElement('afterend', p);
}

function clearError(input) {
  input.classList.remove('invalid');
  const next = input.nextElementSibling;
  if (next && next.classList.contains('field-error')) next.remove();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/* ---------- contact form ---------- */
function initContactForm(form) {
  const name = form.elements['name'];
  const email = form.elements['email'];
  const message = form.elements['message'];

  const rules = [
    [name,    v => v.length >= 2,   'Please enter your full name.'],
    [email,   isValidEmail,         'Please enter a valid email address.'],
    [message, v => v.length >= 10,  'Message must be at least 10 characters.'],
  ];

  function validateField(input, test, msg) {
    const ok = test(input.value.trim());
    ok ? clearError(input) : showError(input, msg);
    return ok;
  }

  // validate when the user leaves a field, clear as they fix it
  rules.forEach(([input, test, msg]) => {
    input.addEventListener('blur', () => validateField(input, test, msg));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input, test, msg);
    });
  });

  form.addEventListener('submit', e => {
    const results = rules.map(([i, t, m]) => validateField(i, t, m));
    if (results.includes(false)) {
      e.preventDefault();
      form.querySelector('.invalid').focus();
      return;
    }
    // stop double submissions
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
  });
}

/* ---------- login form ---------- */
function initLoginForm(form) {
  const id = form.elements['student-id'];
  const pw = form.elements['password'];

  // show/hide password button
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'toggle-pw';
  toggle.textContent = 'Show password';
  pw.insertAdjacentElement('afterend', toggle);

  toggle.addEventListener('click', () => {
    const hidden = pw.type === 'password';
    pw.type = hidden ? 'text' : 'password';
    toggle.textContent = hidden ? 'Hide password' : 'Show password';
  });

  form.addEventListener('submit', e => {
    let ok = true;
    clearError(id);
    clearError(pw);

    if (id.value.trim() === '') {
      showError(id, 'Please enter your student ID.');
      ok = false;
    }
    if (pw.value === '') {
      // error goes after the toggle button's position
      showError(pw, 'Please enter your password.');
      ok = false;
    }
    if (!ok) {
      e.preventDefault();
      form.querySelector('.invalid').focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();

  const contactForm = document.getElementById('contact-form');
  const loginForm = document.getElementById('login-form');
  if (contactForm) initContactForm(contactForm);
  if (loginForm) initLoginForm(loginForm);
});

/* ---------- mobile menu ---------- */
function initMobileNav() {
  const nav = document.querySelector('nav');
  const list = nav && nav.querySelector('ul');
  if (!list) return;

  list.id = list.id || 'nav-menu';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'menu-toggle';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.setAttribute('aria-controls', list.id);
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.insertBefore(btn, list);

  const setOpen = open => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));

  // close after tapping a link
  list.addEventListener('click', e => {
    if (e.target.closest('a')) setOpen(false);
  });

  // close with the Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false);
  });

  // reset if the screen grows to desktop size
  window.matchMedia('(min-width: 769px)').addEventListener('change', e => {
    if (e.matches) setOpen(false);
  });
}