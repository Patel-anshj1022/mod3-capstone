// Mobile nav toggle
const navToggleButton = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
if (navToggleButton && navMenu) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Reveal on scroll using IntersectionObserver
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => io.observe(el));

// Parallax blobs
const parallaxEls = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  parallaxEls.forEach((el, idx) => {
    const speed = (idx + 1) * 0.06;
    el.style.transform = `translateY(${y * speed}px)`;
  });
});

// Animated counters
function animateCounter(counterEl) {
  const target = Number(counterEl.getAttribute('data-target')) || 0;
  const duration = 1400;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * ease);
    counterEl.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('.counter').forEach((el) => {
  const ioCounter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(el);
        ioCounter.disconnect();
      }
    });
  }, { threshold: 0.6 });
  ioCounter.observe(el);
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Fake form handling with inline validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert('Please provide a valid name and email.');
      return;
    }
    contactForm.reset();
    alert('Thanks! We will be in touch shortly.');
  });
}

