/* =============================================
   DUBAI PROPERTY HUB – Main Script
   ============================================= */

/* ===== PROFESSIONAL PRELOADER CONTROLLER (White Theme) ===== */
const preloader = document.getElementById('preloader');
if (preloader) {
  // Lock scrolling while preloader runs
  document.body.style.overflow = 'hidden';

  const startTime = Date.now();
  const minDisplayMs = 1900; // Luxury 1.9s duration to showcase the golden future animation

  const dismissPreloader = () => {
    if (preloader.classList.contains('fade-out')) return;
    preloader.classList.add('fade-out');
    document.body.style.overflow = '';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 650);
  };

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDisplayMs - elapsed);
    setTimeout(dismissPreloader, remaining);
  });

  // Safety fallback in case external resources delay window.load
  setTimeout(dismissPreloader, 2800);
}

/* Navbar scroll effect */
const navbar = document.getElementById('navbar');
const hero = document.getElementById('home');
const updateNavbar = () => {
  navbar.classList.toggle('scrolled', hero.getBoundingClientRect().bottom <= navbar.offsetHeight);
};
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* Mobile hamburger */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* =============================================
   ACHIEVE SECTION – Scroll Reveal Animations
   ============================================= */
const achieveSection = document.getElementById('achieve-dream');
if (achieveSection) {
  const animItems = achieveSection.querySelectorAll('.anim-item');

  // Apply custom delays from data-delay attribute
  animItems.forEach(item => {
    const delay = item.getAttribute('data-delay') || 0;
    item.style.transitionDelay = `${delay}ms`;
  });

  // IntersectionObserver to trigger animations smoothly on scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          achieveSection.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    observer.observe(achieveSection);
  } else {
    // Fallback for browsers without IntersectionObserver
    achieveSection.classList.add('is-visible');
  }
}

/* =============================================
   PROPERTIES SECTION – 3 Cards Per Row Slider & Modal Controller
   ============================================= */
const propertiesData = [
  {
    id: 0,
    title: "Shahrukhz Residences By DANUBE",
    developer: "DANUBE PROPERTIES",
    location: "Maritime City, Dubai",
    price: "AED 1,400,000",
    plan: "1% Monthly Plan",
    tag: "Waterfront Luxury",
    image: "assets/Shahrukhz By DANUBE.webp",
    desc: "An iconic luxury development at Dubai Maritime City offering breathtaking sea vistas, bespoke designer interiors, private pool options on expansive terraces, and 40+ world-class resort amenities.",
    amenities: [
      "Private Swimming Pool Option",
      "Panoramic Sea & Skyline Views",
      "Fully Equipped Health Club",
      "Sky Lounge & Sunset Deck",
      "Aquatic Gym & Jacuzzi",
      "24/7 Concierge & Valet",
      "Children's Splash Pad",
      "Outdoor Cinema & BBQ Area"
    ],
    whatsappMsg: "Hello! I am interested in Shahrukhz Residences By DANUBE. Please share available units and the 1% payment plan."
  },
  {
    id: 1,
    title: "Greenz By DANUBE",
    developer: "DANUBE PROPERTIES",
    location: "Academic City, Dubai",
    price: "AED 850,000",
    plan: "1% Monthly Plan",
    tag: "Eco-Living",
    image: "assets/Greenz By DANUBE.jpg",
    desc: "A visionary sanctuary combining green sustainable architecture with high-yield living in Dubai's premier academic corridor. Designed for modern professionals, investors, and families.",
    amenities: [
      "Smart Home Automation",
      "Lush Landscaped Zen Gardens",
      "Rooftop Infinity Pool",
      "Co-working Lounge & Library",
      "Wellness & Yoga Pavilions",
      "EV Charging Stations",
      "High Rental Yield Potential",
      "Retail & Dining Promenade"
    ],
    whatsappMsg: "Hello! I am interested in Greenz By DANUBE. Please share brochures and pricing details."
  },
  {
    id: 2,
    title: "Breez By DANUBE",
    developer: "DANUBE PROPERTIES",
    location: "Maritime City, Dubai",
    price: "AED 1,200,000",
    plan: "1% Monthly Plan",
    tag: "Coastal Living",
    image: "assets/Breez By DANUBE.png",
    desc: "Experience refreshing coastal breezes and uninterrupted Arabian Gulf vistas. Premium residences curated with seamless indoor-outdoor layouts and luxury waterfront promenade access.",
    amenities: [
      "Waterfront Promenade Access",
      "Sky Observation Deck",
      "Olympic-Length Lap Pool",
      "Exclusive Residents' Club",
      "State-of-the-Art Spa & Sauna",
      "Paddle Tennis Courts",
      "Fine Dining & Waterfront Cafes",
      "Covered Reserved Parking"
    ],
    whatsappMsg: "Hello! I am interested in Breez By DANUBE. Please provide available layouts and floor plans."
  }
];

/* ----- 3-Cards Per Row Slider Controller ----- */
const sliderTrack = document.getElementById('properties-slider-track');
const sliderViewport = document.getElementById('properties-slider-viewport');
const prevBtns = [
  document.getElementById('prop-slider-prev'),
  document.getElementById('prop-float-prev')
].filter(Boolean);
const nextBtns = [
  document.getElementById('prop-slider-next'),
  document.getElementById('prop-float-next')
].filter(Boolean);
const pageDotsContainer = document.getElementById('prop-pagination');

if (sliderTrack && sliderViewport) {
  const cards = sliderTrack.querySelectorAll('.prop-card');
  const totalCards = cards.length;
  let currentSlide = 0;

  const getVisibleCount = () => {
    const width = window.innerWidth;
    if (width > 1024) return 3;
    if (width > 700) return 2;
    return 1;
  };

  const getMaxSlideIndex = () => {
    return Math.max(0, totalCards - getVisibleCount());
  };

  const renderDots = () => {
    if (!pageDotsContainer) return;
    const maxIdx = getMaxSlideIndex();
    const dotsCount = maxIdx + 1;
    pageDotsContainer.innerHTML = '';

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('button');
      dot.className = `prop-page-dot ${i === currentSlide ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      pageDotsContainer.appendChild(dot);
    }
  };

  const updateSlidePosition = () => {
    const maxIdx = getMaxSlideIndex();
    if (currentSlide > maxIdx) currentSlide = maxIdx;
    if (currentSlide < 0) currentSlide = 0;

    const firstCard = cards[0];
    if (firstCard) {
      const cardRect = firstCard.getBoundingClientRect();
      const style = window.getComputedStyle(sliderTrack);
      const gap = parseFloat(style.gap) || 28;
      const stepWidth = cardRect.width + gap;
      const offset = currentSlide * stepWidth;
      sliderTrack.style.transform = `translateX(-${offset}px)`;
    }

    // Update button states
    prevBtns.forEach(btn => {
      btn.disabled = currentSlide === 0;
      btn.style.opacity = currentSlide === 0 ? '0.4' : '1';
    });
    nextBtns.forEach(btn => {
      btn.disabled = currentSlide >= maxIdx;
      btn.style.opacity = currentSlide >= maxIdx ? '0.4' : '1';
    });

    // Update dots
    if (pageDotsContainer) {
      const dots = pageDotsContainer.querySelectorAll('.prop-page-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }
  };

  const goToSlide = (idx) => {
    currentSlide = idx;
    updateSlidePosition();
  };

  const slidePrev = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const slideNext = () => {
    const maxIdx = getMaxSlideIndex();
    if (currentSlide < maxIdx) {
      goToSlide(currentSlide + 1);
    }
  };

  prevBtns.forEach(btn => btn.addEventListener('click', slidePrev));
  nextBtns.forEach(btn => btn.addEventListener('click', slideNext));

  // Touch Swipe for mobile & tablet
  let touchStartX = 0;
  let touchEndX = 0;

  sliderViewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderViewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        slideNext();
      } else {
        slidePrev();
      }
    }
  }, { passive: true });

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateSlidePosition();
    }, 150);
  });

  // Initial render
  renderDots();
  setTimeout(updateSlidePosition, 50);
}

/* ===== PROPERTY DETAILS MODAL CONTROLLER ===== */
const modalBackdrop = document.getElementById('prop-modal-backdrop');
const modalCloseBtn = document.getElementById('prop-modal-close');
const modalImg = document.getElementById('prop-modal-img');
const modalTag = document.getElementById('prop-modal-tag');
const modalTitle = document.getElementById('prop-modal-title');
const modalLocation = document.getElementById('prop-modal-location');
const modalPrice = document.getElementById('prop-modal-price');
const modalPlan = document.getElementById('prop-modal-plan');
const modalDesc = document.getElementById('prop-modal-desc');
const modalAmenities = document.getElementById('prop-modal-amenities');
const modalWhatsappLink = document.getElementById('prop-modal-whatsapp-link');

const openPropertyModal = (propIndex) => {
  const prop = propertiesData[propIndex];
  if (!prop || !modalBackdrop) return;

  if (modalImg) modalImg.src = prop.image;
  if (modalTag) modalTag.textContent = prop.tag;
  if (modalTitle) modalTitle.textContent = prop.title;
  if (modalLocation) {
    modalLocation.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      ${prop.location}
    `;
  }
  if (modalPrice) modalPrice.textContent = prop.price;
  if (modalPlan) modalPlan.textContent = prop.plan;
  if (modalDesc) modalDesc.textContent = prop.desc;

  if (modalAmenities) {
    modalAmenities.innerHTML = prop.amenities.map(amenity => `
      <div class="prop-modal-amenity-item">${amenity}</div>
    `).join('');
  }

  if (modalWhatsappLink) {
    const encoded = encodeURIComponent(prop.whatsappMsg);
    modalWhatsappLink.href = `https://wa.me/?text=${encoded}`;
  }

  modalBackdrop.classList.add('is-open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closePropertyModal = () => {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('is-open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// Bind View Details buttons
document.querySelectorAll('button.prop-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const propIdx = parseInt(btn.getAttribute('data-prop'), 10);
    if (!isNaN(propIdx)) {
      openPropertyModal(propIdx);
    }
  });
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closePropertyModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closePropertyModal();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
    closePropertyModal();
  }
});

/* =============================================
   WHY CHOOSE US – Scroll Reveal Observer
   ============================================= */
const whyChooseSection = document.getElementById('why-choose-us');
if (whyChooseSection) {
  if ('IntersectionObserver' in window) {
    const whyObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          whyChooseSection.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    whyObserver.observe(whyChooseSection);
  } else {
    whyChooseSection.classList.add('is-visible');
  }
}

/* =============================================
   OUR WAY OF WORK – Pinned Horizontal Scroll & Red Line Fill
   ============================================= */
const initWayOfWorkHorizontalJourney = () => {
  const pinSection = document.getElementById('way-of-work');
  const track = document.getElementById('way-horizontal-track');
  const redPath = document.getElementById('way-path-red');

  const steps = [
    document.getElementById('way-step-1'),
    document.getElementById('way-step-2'),
    document.getElementById('way-step-3'),
    document.getElementById('way-step-4')
  ].filter(Boolean);

  if (!pinSection || !track) return;

  let pathTotalLength = 0;
  if (redPath && typeof redPath.getTotalLength === 'function') {
    pathTotalLength = redPath.getTotalLength();
    redPath.style.strokeDasharray = `${pathTotalLength} ${pathTotalLength}`;
    redPath.style.strokeDashoffset = `${pathTotalLength}`;
  }

  // Thresholds along journey progress (0 to 1)
  const stepThresholds = [0.16, 0.40, 0.68, 0.88];

  let ticking = false;

  const updateHorizontalScroll = () => {
    ticking = false;

    if (window.innerWidth <= 768) {
      // Mobile fallback: clear transforms
      track.style.transform = '';
      return;
    }

    const rect = pinSection.getBoundingClientRect();
    const scrollableDistance = pinSection.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    let progress = scrollableDistance > 0 ? scrolled / scrollableDistance : 0;
    progress = Math.max(0, Math.min(1, progress));

    // 1. Horizontal camera pan across the track
    const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth);
    const currentTranslate = progress * maxTranslate;
    track.style.transform = `translate3d(${-currentTranslate}px, 0, 0)`;

    // 2. Red path fill in lockstep with the camera glide
    if (redPath && pathTotalLength > 0) {
      const fillOffset = pathTotalLength * (1 - progress);
      redPath.style.strokeDashoffset = `${fillOffset}`;
    }


    // 4. Activate step cards and text animations
    steps.forEach((step, index) => {
      const threshold = stepThresholds[index] !== undefined ? stepThresholds[index] : (index * 0.25);
      if (progress >= threshold) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }
    });
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHorizontalScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (redPath && typeof redPath.getTotalLength === 'function') {
      pathTotalLength = redPath.getTotalLength();
      redPath.style.strokeDasharray = `${pathTotalLength} ${pathTotalLength}`;
    }
    onScroll();
  }, { passive: true });

  // Initial calculation
  updateHorizontalScroll();
  setTimeout(updateHorizontalScroll, 600);
  setTimeout(updateHorizontalScroll, 1800);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWayOfWorkHorizontalJourney);
} else {
  initWayOfWorkHorizontalJourney();
}

