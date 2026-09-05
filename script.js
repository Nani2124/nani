document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
});

/* ---------- Custom cursor (desktop only) ---------- */
const cursor = document.getElementById('cursor-dot');
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isCoarsePointer && !prefersReducedMotion && cursor) {
  window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll('a, button, .photo, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
} else if (cursor) {
  cursor.style.display = 'none';
}

/* ---------- Hero load sequence (single orchestrated reveal) ---------- */
window.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('.hero-eyebrow, .hero-line, .hero-copy, .hero-actions');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150 + i * 140);
  });
});

/* ---------- Scroll reveal for section heads ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

/* ---------- Gallery filter ---------- */
const tabs = document.querySelectorAll('.filter-tabs button');
const photos = document.querySelectorAll('#galleryGrid .photo');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    photos.forEach(p => {
      if (filter === 'all' || p.dataset.cat === filter) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    });
  });
});

/* ---------- Package select -> scroll to form and preselect ---------- */
document.querySelectorAll('.select-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pkg = btn.dataset.package;
    const select = document.getElementById('packageSelect');
    if (select) {
      [...select.options].forEach(opt => {
        if (opt.value === pkg) select.value = pkg;
      });
    }
    document.getElementById('signup').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- Enquiry form submit ---------- */
const form = document.getElementById('enquiry-form');
const formArea = document.getElementById('formArea');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const entry = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    eventDate: document.getElementById('eventDate').value,
    package: document.getElementById('packageSelect').value,
    city: document.getElementById('city').value,
    message: document.getElementById('message').value,
    submittedAt: new Date().toISOString()
  };

  try {
    if (window.storage && window.storage.set) {
      const key = 'enquiry:' + Date.now();
      await window.storage.set(key, JSON.stringify(entry), true);
    }
  } catch (err) {
    console.error('Could not save enquiry:', err);
  }

  formArea.innerHTML = `
    <div class="confirm-box">
      <div class="mark">&#10003;</div>
      <h3>Thank you, ${entry.name.split(' ')[0] || 'there'}</h3>
      <p>We've received your enquiry for the ${entry.package.split(' —')[0]} package.<br>We'll reach out on ${entry.phone || entry.email} within 24 hours.</p>
    </div>
  `;
});
