// Mobile nav toggle
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
if (nav && navToggle) {
  navToggle.addEventListener('click', () => nav.classList.toggle('show'));
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Reveal on scroll (IntersectionObserver fallback if GSAP not loaded)
const revealElements = document.querySelectorAll('.reveal');
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 }) : null;
revealElements.forEach(el => io ? io.observe(el) : el.classList.add('revealed'));

// Animated counters
function animateCount(el) {
  const target = Number(el.getAttribute('data-count')) || 0;
  const durationMs = 1400;
  const start = performance.now();
  const isPercent = el.textContent && el.textContent.includes('%');
  function tick(now) {
    const p = Math.min(1, (now - start) / durationMs);
    const val = Math.floor(p * target);
    el.textContent = isPercent ? `${val}%` : String(val);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('.stat-num').forEach((el) => {
  const onView = () => animateCount(el);
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { onView(); o.unobserve(el); } });
    }, { threshold: 0.6 });
    obs.observe(el);
  } else {
    onView();
  }
});

// GSAP animations if available
if (window.gsap) {
  gsap.registerPlugin(window.ScrollTrigger);
  gsap.from('.hero-title', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' });
  gsap.from('.hero-sub', { y: 14, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power2.out' });
  gsap.from('.hero-ctas .btn', { y: 10, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.2, ease: 'power2.out' });

  gsap.utils.toArray('.card, .product-card, .testimonial, .team-card').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  // Subtle floating for blobs
  gsap.to('.blob--one', { x: 20, y: -10, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.blob--two', { x: -16, y: 12, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

// Contact form demo handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const status = document.getElementById('form-status');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status) status.textContent = 'Sending...';
    await new Promise(r => setTimeout(r, 900));
    if (status) status.textContent = 'Thanks! Our team will reach out shortly.';
    contactForm.reset();
  });
}

