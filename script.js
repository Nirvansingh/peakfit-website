/**
 * PeakFit Studio - Interactive Engine
 * Crafted for Dhiti | Editorial & Modern Performance Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileNav();
  initStatsCounter();
  initProgramFilters();
  initBmiCalculator();
  initSchedule();
  initPricingToggle();
  initFaqAccordion();
  initModals();
  initFormsAndToasts();
  initScrollReveal();
  initBackToTop();
});

/* ==========================================================================
   1. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* ==========================================================================
   2. Sticky Navbar & Active Link Spy
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const closeDrawer = document.querySelector('.close-drawer');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const drawerLinks = document.querySelectorAll('.mobile-nav-drawer a');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawerNav() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerNav);
  if (overlay) overlay.addEventListener('click', closeDrawerNav);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawerNav);
  });
}

/* ==========================================================================
   4. Animated Metric Counter (Intersection Observer)
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const prefix = stat.getAttribute('data-prefix') || '';
          const suffix = stat.getAttribute('data-suffix') || '';
          const duration = 1800;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   5. Program Category Filter
   ========================================================================== */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.tab-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      programCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Health & Metabolic Baseline Calculator
   ========================================================================== */
function initBmiCalculator() {
  const unitBtns = document.querySelectorAll('.unit-btn');
  const heightInput = document.getElementById('calc-height');
  const weightInput = document.getElementById('calc-weight');
  const ageInput = document.getElementById('calc-age');
  const genderInput = document.getElementById('calc-gender');
  const activityInput = document.getElementById('calc-activity');

  const heightLabel = document.getElementById('height-label');
  const weightLabel = document.getElementById('weight-label');

  const bmiValueEl = document.getElementById('bmi-value');
  const bmiStatusEl = document.getElementById('bmi-status');
  const bmiPointer = document.getElementById('bmi-pointer');
  const calorieAdviceEl = document.getElementById('calorie-advice');

  let currentUnit = 'metric';

  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      unitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentUnit = btn.getAttribute('data-unit');

      if (currentUnit === 'metric') {
        heightLabel.textContent = 'Height (cm)';
        weightLabel.textContent = 'Weight (kg)';
        heightInput.value = '175';
        weightInput.value = '70';
        heightInput.min = '100';
        heightInput.max = '230';
      } else {
        heightLabel.textContent = 'Height (inches)';
        weightLabel.textContent = 'Weight (lbs)';
        heightInput.value = '69';
        weightInput.value = '154';
        heightInput.min = '40';
        heightInput.max = '90';
      }
      calculateBMI();
    });
  });

  function calculateBMI() {
    let height = parseFloat(heightInput.value);
    let weight = parseFloat(weightInput.value);
    const age = parseInt(ageInput?.value || 26, 10);
    const gender = genderInput?.value || 'male';
    const activity = parseFloat(activityInput?.value || 1.375);

    if (!height || !weight || height <= 0 || weight <= 0) return;

    let bmi = 0;
    let heightInCm = height;
    let weightInKg = weight;

    if (currentUnit === 'metric') {
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    } else {
      bmi = (weight * 703) / (height * height);
      heightInCm = height * 2.54;
      weightInKg = weight * 0.453592;
    }

    const roundedBMI = Math.min(Math.max(bmi, 12), 42).toFixed(1);
    bmiValueEl.textContent = roundedBMI;

    let statusText = 'Optimal Healthy Range';
    let pointerPercent = 50;

    if (bmi < 18.5) {
      statusText = 'Underweight Baseline';
      pointerPercent = Math.max(10, ((bmi - 12) / (18.5 - 12)) * 25);
    } else if (bmi >= 18.5 && bmi < 24.9) {
      statusText = 'Optimal Athletic Range';
      pointerPercent = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 35;
    } else if (bmi >= 25 && bmi < 29.9) {
      statusText = 'Elevated Body Mass';
      pointerPercent = 60 + ((bmi - 25) / (29.9 - 25)) * 25;
    } else {
      statusText = 'Obesity Risk Index';
      pointerPercent = Math.min(95, 85 + ((bmi - 30) / (40 - 30)) * 15);
    }

    bmiStatusEl.textContent = statusText;
    bmiPointer.style.left = `${pointerPercent}%`;

    // Mifflin-St Jeor Calculation
    let bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    const maintenanceCalories = Math.round(bmr * activity);
    const fatLossCalories = Math.round(maintenanceCalories - 450);
    const muscleGainCalories = Math.round(maintenanceCalories + 350);

    calorieAdviceEl.innerHTML = `
      <strong>Daily Maintenance Target:</strong> ~${maintenanceCalories.toLocaleString()} kcal/day<br>
      • <strong>Recomposition / Fat Loss:</strong> ~${fatLossCalories.toLocaleString()} kcal/day<br>
      • <strong>Hypertrophy / Lean Mass:</strong> ~${muscleGainCalories.toLocaleString()} kcal/day<br>
      <em>Discuss your customized macronutrient split directly with Coach Dhiti.</em>
    `;
  }

  [heightInput, weightInput, ageInput, genderInput, activityInput].forEach(el => {
    if (el) {
      el.addEventListener('input', calculateBMI);
      el.addEventListener('change', calculateBMI);
    }
  });

  calculateBMI();
}

/* ==========================================================================
   7. Weekly Timetable Schedule
   ========================================================================== */
const scheduleData = {
  monday: [
    { title: 'Functional Vinyasa Flow', time: '06:30 – 07:30', trainer: 'Dhiti Sharma', level: 'All Levels', spots: '3 spots left' },
    { title: 'Metabolic Conditioning Blitz', time: '08:30 – 09:30', trainer: 'Marcus Vance', level: 'Intermediate', spots: '2 spots left' },
    { title: 'Olympic Barbell Mechanics', time: '17:30 – 18:45', trainer: 'Alex Rivera', level: 'Advanced', spots: 'Full (Waitlist)' },
    { title: 'Athletic Strength & Core', time: '19:00 – 20:00', trainer: 'Dhiti Sharma', level: 'Intermediate', spots: '4 spots left' }
  ],
  tuesday: [
    { title: 'Combat Boxing & Footwork', time: '07:00 – 08:00', trainer: 'Marcus Vance', level: 'High Tempo', spots: '4 spots left' },
    { title: 'Clinical Joint Mobility', time: '10:00 – 11:00', trainer: 'Elena Rostova', level: 'Restorative', spots: '5 spots left' },
    { title: 'Upper Body Hypertrophy', time: '18:00 – 19:15', trainer: 'Alex Rivera', level: 'Intermediate', spots: '3 spots left' },
    { title: 'Pilates Core Alignment', time: '19:30 – 20:30', trainer: 'Elena Rostova', level: 'All Levels', spots: '6 spots left' }
  ],
  wednesday: [
    { title: 'Ashtanga Breath & Flow', time: '06:30 – 07:30', trainer: 'Dhiti Sharma', level: 'All Levels', spots: '4 spots left' },
    { title: 'Kettlebell Complex Conditioning', time: '09:00 – 10:00', trainer: 'Marcus Vance', level: 'Advanced', spots: '2 spots left' },
    { title: 'Deadlift Trajectory Clinic', time: '17:30 – 18:45', trainer: 'Alex Rivera', level: 'All Levels', spots: '1 spot left' },
    { title: 'Postural Decompression', time: '19:00 – 20:00', trainer: 'Elena Rostova', level: 'All Levels', spots: '8 spots left' }
  ],
  thursday: [
    { title: 'Boxing Conditioning Drills', time: '07:00 – 08:00', trainer: 'Marcus Vance', level: 'High Tempo', spots: '3 spots left' },
    { title: 'Pilates Reformer & Tone', time: '10:00 – 11:00', trainer: 'Dhiti Sharma', level: 'Intermediate', spots: '2 spots left' },
    { title: 'Posterior Chain & Glutes', time: '18:00 – 19:15', trainer: 'Elena Rostova', level: 'Intermediate', spots: '5 spots left' },
    { title: 'Calisthenics & Bodyweight', time: '19:30 – 20:30', trainer: 'Alex Rivera', level: 'Intermediate', spots: '4 spots left' }
  ],
  friday: [
    { title: 'Power Flow Sunrise', time: '06:30 – 07:30', trainer: 'Dhiti Sharma', level: 'All Levels', spots: '5 spots left' },
    { title: 'Full Body Tabata Circuit', time: '08:30 – 09:30', trainer: 'Marcus Vance', level: 'High Intensity', spots: '2 spots left' },
    { title: 'Heavy Barbell Power Hour', time: '17:30 – 18:45', trainer: 'Alex Rivera', level: 'All Levels', spots: '6 spots left' },
    { title: 'Contrast Bath & Breathwork', time: '19:00 – 20:00', trainer: 'Dhiti Sharma', level: 'Recovery', spots: '4 spots left' }
  ],
  saturday: [
    { title: 'Athletic Conditioning Workshop', time: '07:30 – 09:00', trainer: 'Dhiti & Marcus', level: 'All Levels', spots: '8 spots left' },
    { title: 'Olympic Lifting Form Review', time: '10:30 – 12:00', trainer: 'Alex Rivera', level: 'Advanced', spots: '3 spots left' },
    { title: 'Open Studio Practice', time: '16:00 – 20:00', trainer: 'Staff Mentors', level: 'All Members', spots: 'Open' }
  ],
  sunday: [
    { title: 'Outdoor Mobility Flow', time: '08:00 – 09:30', trainer: 'Dhiti Sharma', level: 'Open to All', spots: '12 spots left' },
    { title: 'Infrared Sauna & Recovery', time: '10:00 – 13:00', trainer: 'Elena Rostova', level: 'Recovery', spots: '5 spots left' },
    { title: 'Goal Review & Nutrition Q&A', time: '16:00 – 17:30', trainer: 'Dhiti Sharma', level: 'Interactive', spots: '7 spots left' }
  ]
};

function initSchedule() {
  const dayTabs = document.querySelectorAll('.day-tab');
  const scheduleContainer = document.getElementById('schedule-grid-container');
  if (!scheduleContainer) return;

  function renderDay(day) {
    const classes = scheduleData[day] || [];
    scheduleContainer.innerHTML = '';

    classes.forEach(c => {
      const card = document.createElement('div');
      card.className = 'timetable-card reveal active';
      card.innerHTML = `
        <div class="timetable-info">
          <h4>${c.title}</h4>
          <div class="timetable-time">${c.time}</div>
          <div class="timetable-coach">Coach: <strong>${c.trainer}</strong> • ${c.level}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size:0.75rem; color:var(--accent-ember); margin-bottom:8px; font-weight:700; text-transform:uppercase;">${c.spots}</div>
          <button class="btn btn-secondary btn-sm book-class-btn" data-class="${c.title}" data-time="${c.time}">Reserve</button>
        </div>
      `;
      scheduleContainer.appendChild(card);
    });

    document.querySelectorAll('.book-class-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const className = e.target.getAttribute('data-class');
        openModalWithPrefill(`Reserve Spot: ${className}`);
      });
    });
  }

  dayTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      dayTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const day = btn.getAttribute('data-day');
      renderDay(day);
    });
  });

  renderDay('monday');
}

/* ==========================================================================
   8. Pricing Switcher (Monthly vs Annual)
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.getElementById('billing-toggle');
  const basicPrice = document.getElementById('price-basic');
  const proPrice = document.getElementById('price-pro');
  const elitePrice = document.getElementById('price-elite');
  const periodLabels = document.querySelectorAll('.price-period');

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;

    if (isAnnual) {
      animatePrice(basicPrice, 749);
      animatePrice(proPrice, 1499);
      animatePrice(elitePrice, 2249);
      periodLabels.forEach(p => p.textContent = '/ month (billed annually)');
    } else {
      animatePrice(basicPrice, 999);
      animatePrice(proPrice, 1999);
      animatePrice(elitePrice, 2999);
      periodLabels.forEach(p => p.textContent = '/ month');
    }
  });

  function animatePrice(el, targetNumber) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      el.textContent = `${targetNumber.toLocaleString()}`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 140);
  }
}

/* ==========================================================================
   9. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   10. Modal System
   ========================================================================== */
function openModalWithPrefill(titleText) {
  const modal = document.getElementById('booking-modal');
  const modalHeader = document.getElementById('modal-title-text');
  if (modalHeader && titleText) {
    modalHeader.textContent = titleText;
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function initModals() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const openBtns = document.querySelectorAll('.open-modal-trigger');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Claim 3-Day VIP Guest Pass';
      openModalWithPrefill(plan);
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   11. Form Handling & Toast Notifications
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

function initFormsAndToasts() {
  const modalForm = document.getElementById('modal-booking-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name')?.value || 'Guest';
      const phone = document.getElementById('modal-phone')?.value || '';
      
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Reserving...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        document.getElementById('booking-modal').classList.remove('active');
        document.body.style.overflow = '';
        modalForm.reset();
        showToast(`Reservation confirmed for ${name}. Coach Dhiti's team will contact ${phone} shortly.`);
      }, 700);
    });
  }

  const contactForm = document.getElementById('contact-form-main');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || 'Friend';
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Transmitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showToast(`Thank you ${name}. Your message has been sent to PeakFit Studio Chandigarh.`);
      }, 700);
    });
  }

  const closeTopBar = document.querySelector('.top-bar-close');
  const topBar = document.querySelector('.top-bar');
  if (closeTopBar && topBar) {
    closeTopBar.addEventListener('click', () => {
      topBar.style.display = 'none';
    });
  }
}

/* ==========================================================================
   12. Scroll Reveal Effects
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   13. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
