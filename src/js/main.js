function $(selector, root = document) { return root.querySelector(selector); }
function $all(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

function initYear() { // so the sliding in the carousel works
  const el = $('#year');
  if (el) el.textContent = String(new Date().getFullYear());
}

function initNavResize() {
  const nav = $('.navbar');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 50) nav.classList.add('shrink');
    else nav.classList.remove('shrink');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initNavToggle() {
  const toggle = $('.nav-toggle');
  const menu = $('#nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // close on link click (mobile)
  $all('.nav-link', menu).forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function initSmoothScroll() {
  const nav = $('.navbar');
  const navHeight = () => nav ? nav.getBoundingClientRect().height : 0;
  $all('a.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = Math.floor(window.scrollY + target.getBoundingClientRect().top - navHeight() + 1);
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });
}

function initScrollSpy() {
  const nav = $('.navbar');
  const links = $all('.nav-link');
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter((el) => el);
  if (!nav || sections.length === 0) return;

  const setActive = (idx) => {
    links.forEach(l => l.classList.remove('active'));
    if (links[idx]) links[idx].classList.add('active');
  };

  const compute = () => {
    const navBottom = (nav.getBoundingClientRect().bottom) + window.scrollY;
    // if scrolled to bottom, force last item active
    const nearBottom = Math.ceil(window.scrollY + window.innerHeight) >= Math.floor(document.documentElement.scrollHeight);
    if (nearBottom) { setActive(links.length - 1); return; }

    let activeIdx = 0;
    for (let i = 0; i < sections.length; i++) {
      const top = sections[i].offsetTop;
      if (top <= navBottom) activeIdx = i; else break;
    }
    setActive(activeIdx);
  };

  compute();
  window.addEventListener('scroll', compute, { passive: true });
  window.addEventListener('resize', compute);
}

function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const track = root.querySelector('[data-carousel-track]');
  const slides = $all('.carousel__slide', track);
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  if (!track || slides.length === 0 || !prev || !next) return;

  let index = 0;
  let busy = false;
  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
  };

  const clickPrev = () => { if (busy) return; busy = true; goTo(index - 1); setTimeout(() => busy = false, 420); };
  const clickNext = () => { if (busy) return; busy = true; goTo(index + 1); setTimeout(() => busy = false, 420); };

  prev.addEventListener('click', clickPrev);
  next.addEventListener('click', clickNext);

  // keyboard support when controls focused
  [prev, next].forEach(btn => btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') clickPrev();
    if (e.key === 'ArrowRight') clickNext();
  }));
}

function initModal() {
  const openBtn = document.querySelector('[data-open-modal]');
  const modal = document.querySelector('[data-modal]');
  if (!openBtn || !modal) return;
  const closers = $all('[data-close-modal]', modal);
  const open = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
  openBtn.addEventListener('click', open);
  closers.forEach(c => c.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

function init() {
  initYear();
  initNavResize();
  initNavToggle();
  initSmoothScroll();
  initScrollSpy();
  initCarousel();
  initModal();
}

document.addEventListener('DOMContentLoaded', init);
