/* ==================== INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', function () {
  initializeNavigation();
  initializeModals();
  initializeContactForm();
  initializeLoveGiftForm();
  initializeScrollAnimations();
});

/* ==================== NAVIGATION ==================== */
function initializeNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
    });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

/* ==================== MODALS ==================== */
function initializeModals() {
  const loveGiftModal = document.getElementById('loveGiftModal');
  const loveGiftTriggers = document.querySelectorAll('[data-action="open-love-gift"]');
  const modalClose = document.querySelector('.modal-close');

  loveGiftTriggers.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      openLoveGiftModal();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeLoveGiftModal);
  }

  if (loveGiftModal) {
    loveGiftModal.addEventListener('click', function (event) {
      if (event.target === loveGiftModal) {
        closeLoveGiftModal();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeLoveGiftModal();
    }
  });
}

function openLoveGiftModal() {
  const modal = document.getElementById('loveGiftModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLoveGiftModal() {
  const modal = document.getElementById('loveGiftModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

/* ==================== CONTACT FORM ==================== */
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {
      fullName: formData.get('fullName')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      message: formData.get('message')?.toString().trim(),
      timestamp: new Date().toISOString(),
    };

    if (!validateContactForm(data)) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showFormStatus('success', "Message sent successfully! We'll be in touch soon.");
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      saveContactMessage(data);
    }, 1200);
  });
}

function validateContactForm(data) {
  if (!data.fullName) {
    showFormStatus('error', 'Please enter your full name.');
    return false;
  }
  if (!data.email || !isValidEmail(data.email)) {
    showFormStatus('error', 'Please enter a valid email address.');
    return false;
  }
  if (!data.message) {
    showFormStatus('error', 'Please enter your message.');
    return false;
  }
  return true;
}

function showFormStatus(type, message) {
  const status = document.getElementById('formStatus');
  if (!status) return;

  status.className = `form-status ${type}`;
  status.textContent = message;
  status.style.display = 'block';

  setTimeout(() => {
    status.style.display = 'none';
  }, 5000);
}

function saveContactMessage(data) {
  const existing = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  existing.push(data);
  localStorage.setItem('contactMessages', JSON.stringify(existing));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==================== LOVE GIFT FORM ==================== */
function initializeLoveGiftForm() {
  const form = document.getElementById('loveGiftForm');
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('customAmount');
  let selectedAmount = null;

  amountButtons.forEach((button) => {
    button.addEventListener('click', function () {
      amountButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');
      selectedAmount = Number(this.dataset.amount);
      if (customAmountInput) customAmountInput.value = '';
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', function () {
      amountButtons.forEach((btn) => btn.classList.remove('active'));
      selectedAmount = Number(this.value) || null;
    });
  }

  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const giftData = {
      name: formData.get('giftName')?.toString().trim(),
      email: formData.get('giftEmail')?.toString().trim(),
      amount: selectedAmount || Number(formData.get('customAmount')) || 0,
      message: formData.get('giftMessage')?.toString().trim(),
      timestamp: new Date().toISOString(),
    };

    if (!giftData.amount || giftData.amount <= 0) {
      showToast('Please select or enter a donation amount.');
      return;
    }
    if (!giftData.name) {
      showToast('Please enter your name.');
      return;
    }
    if (!giftData.email || !isValidEmail(giftData.email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      saveLoveGift(giftData);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      amountButtons.forEach((btn) => btn.classList.remove('active'));
      selectedAmount = null;
      closeLoveGiftModal();
      showToast(`Thank you for your Love Gift of $${giftData.amount.toFixed(2)}!`);
    }, 1200);
  });
}

function saveLoveGift(data) {
  const existing = JSON.parse(localStorage.getItem('loveGifts') || '[]');
  existing.push(data);
  localStorage.setItem('loveGifts', JSON.stringify(existing));
}

/* ==================== SCROLL ANIMATIONS ==================== */
function initializeScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.step-card, .product-card, .story-card, .contact-info, .contact-form-wrapper, .cta-banner, .mission-content').forEach((el) => {
    observer.observe(el);
  });
}

/* ==================== BUTTON INTERACTIONS ==================== */
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast.dismissTimer);
  toast.dismissTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
