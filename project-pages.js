const navbar = document.getElementById('navbar');
const hero = document.getElementById('project-home');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (navbar && hero) {
  const updateNavbar = () => {
    navbar.classList.toggle('scrolled', hero.getBoundingClientRect().bottom <= navbar.offsetHeight);
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

const aboutReveal = document.querySelector('.about-reveal');
if (aboutReveal) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    aboutReveal.classList.add('is-visible');
  } else {
    const aboutObserver = new IntersectionObserver(([entry], observer) => {
      if (entry.isIntersecting) {
        aboutReveal.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    aboutObserver.observe(aboutReveal);
  }
}

const amenitiesTrack = document.querySelector('.shahrukhz-amenities-track');
const amenitiesRun = amenitiesTrack?.querySelector('.shahrukhz-amenities-run');
if (amenitiesTrack && amenitiesRun) {
  const duplicateRun = amenitiesRun.cloneNode(true);
  duplicateRun.setAttribute('aria-hidden', 'true');
  duplicateRun.querySelectorAll('img').forEach((image) => {
    image.alt = '';
    image.loading = 'lazy';
  });
  amenitiesTrack.append(duplicateRun);
}

const advisorDialog = document.getElementById('advisor-dialog');
const advisorForm = document.getElementById('advisor-contact-form');
if (advisorDialog && advisorForm) {
  document.querySelectorAll('[data-open-advisor-form]').forEach((trigger) => {
    trigger.addEventListener('click', () => advisorDialog.showModal());
  });

  advisorDialog.querySelector('.advisor-dialog-close')?.addEventListener('click', () => {
    advisorDialog.close();
  });

  advisorDialog.addEventListener('click', (event) => {
    if (event.target === advisorDialog) advisorDialog.close();
  });

}
