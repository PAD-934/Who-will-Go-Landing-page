/* ==================== INITIALIZATION ==================== */
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeModals();
  initializeContactForm();
  initializeLoveGiftForm();
  initializeProductFilters();
  enhanceProductPricing();
  initializeProductModal();
  initializeProductHoverPreview();
  initializeBottomNav();
  applyLazyImageLoading();
  initializeScrollAnimations();
  initializeMessengerVisibilityForHero();
});

function applyLazyImageLoading() {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    img.decoding = "async";
  });
}

/* ==================== MESSENGER VISIBILITY (HIDE ON HERO) ==================== */
function initializeProductHoverPreview() {
  const preview = document.createElement("div");
  preview.className = "image-preview-overlay";
  preview.setAttribute("role", "dialog");
  preview.setAttribute("aria-modal", "true");
  preview.setAttribute("aria-hidden", "true");
  preview.innerHTML = `
    <div class="image-preview-overlay-backdrop" aria-hidden="true"></div>
    <div class="image-preview-overlay-content">
      <button class="image-preview-overlay-close" aria-label="Close image preview" title="Close">&times;</button>
      <img src="" alt="" />
    </div>
  `;
  document.body.appendChild(preview);

  const previewImage = preview.querySelector("img");
  const backdrop = preview.querySelector(".image-preview-overlay-backdrop");

  function showPreview(target) {
    previewImage.src = target.currentSrc || target.src;
    previewImage.alt = target.alt || "Product preview";
    preview.setAttribute("aria-hidden", "false");
    preview.classList.add("visible");
    preview.style.display = "flex";
  }

  function showPreviewBySrc(src, alt) {
    if (!src) return;
    previewImage.src = src;
    previewImage.alt = alt || "Size guide preview";
    preview.setAttribute("aria-hidden", "false");
    preview.classList.add("visible");
    preview.style.display = "flex";
  }

  function hidePreview() {
    preview.setAttribute("aria-hidden", "true");
    preview.classList.remove("visible");
    preview.style.display = "none";
  }

  preview.style.display = "none";

  document.querySelectorAll(".product-card").forEach((card) => {
    const previewButton = card.querySelector(".view-product");
    const image = card.querySelector(".product-image img");
    if (previewButton && image) {
      previewButton.classList.add("product-summary-preview");
      previewButton.dataset.previewSrc = image.src;
      previewButton.dataset.previewAlt = image.alt || "Product preview";
      previewButton.setAttribute("aria-label", "Preview product image");
    }
  });

  document.addEventListener("pointerup", (event) => {
    const target = event.target;
    const summaryButton = target.closest(".product-summary-preview");
    if (summaryButton) {
      event.preventDefault();
      event.stopPropagation();
      showPreviewBySrc(
        summaryButton.dataset.previewSrc,
        summaryButton.dataset.previewAlt,
      );
      return;
    }

    const closeButton = target.closest(".image-preview-overlay-close");
    if (closeButton || target === backdrop || target === preview) {
      event.preventDefault();
      event.stopImmediatePropagation();
      hidePreview();
    }
  });

  preview.addEventListener("click", (event) => {
    const target = event.target;
    const closeButton = target.closest(".image-preview-overlay-close");
    if (closeButton || target === backdrop || target === preview) {
      event.preventDefault();
      event.stopImmediatePropagation();
      hidePreview();
    }
  });

  const previewCloseButton = preview.querySelector(
    ".image-preview-overlay-close",
  );
  if (previewCloseButton) {
    previewCloseButton.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hidePreview();
    }
  });
}

function initializeBottomNav() {
  const nav = document.querySelector(".bottom-nav");
  if (!nav) return;

  nav.addEventListener("click", (event) => {
    const item = event.target.closest(".bottom-nav-item");
    if (!item) return;
    const action = item.dataset.action;
    event.preventDefault();

    document.querySelectorAll(".bottom-nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn === item);
    });

    switch (action) {
      case "home":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "shop":
        document.getElementById("shop")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "missions":
        document.getElementById("missions")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "token":
        document.getElementById("donation")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "contact":
        document.getElementById("contact")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "cart":
        toggleCart();
        break;
    }
  });
}

function initializeMessengerVisibilityForHero() {
  const fab = document.querySelector(".messenger-float-btn");
  const hero = document.querySelector(".hero");
  if (!fab || !hero || !("IntersectionObserver" in window)) return;

  // Start hidden when hero is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fab.classList.add("messenger-hidden");
        } else {
          fab.classList.remove("messenger-hidden");
        }
      });
    },
    { threshold: 0.05 },
  );

  observer.observe(hero);
}

/* ==================== PRODUCT FILTERS / TABS ==================== */
function initializeProductFilters() {
  const filterSelect = document.getElementById("productFilter");
  const tabs = document.querySelectorAll(".product-tabs .tab");
  const productsGrid = document.querySelector(".products-grid");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const shopSection = document.getElementById("shop");
  const noResults = document.createElement("div");
  noResults.className = "products-no-results";
  noResults.textContent = "No products match your selection.";
  if (productsGrid && !document.querySelector(".products-no-results")) {
    productsGrid.parentNode.insertBefore(noResults, productsGrid.nextSibling);
  }

  function applyFilters() {
    const activeTab = document.querySelector(".product-tabs .tab.active");
    const category = activeTab ? activeTab.dataset.category : "all";
    const tag = filterSelect ? filterSelect.value : "all";

    let visibleCount = 0;
    productCards.forEach((card) => {
      const cardCategory = card.dataset.category || "all";
      const cardTags = (card.dataset.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const categoryMatch = category === "all" || cardCategory === category;
      const tagMatch =
        tag === "all" ||
        (tag === "limited" &&
          (cardTags.includes("made") || cardTags.includes("onsite")));

      if (categoryMatch && tagMatch) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    const nr = document.querySelector(".products-no-results");
    if (nr) nr.style.display = visibleCount ? "none" : "block";
  }

  function scrollToShopTop() {
    if (!shopSection) return;
    shopSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      // reset tab to 'all' if selecting global filter makes sense
      applyFilters();
      scrollToShopTop();
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      applyFilters();
      scrollToShopTop();
    });
  });

  // initial filter application
  applyFilters();
}

function enhanceProductPricing() {
  document.querySelectorAll(".product-price").forEach((priceEl) => {
    if (priceEl.dataset.currencyEnhanced) return;
    const text = priceEl.textContent.trim();
    const match = text.match(/^PHP\s+(.+)$/i);
    if (!match) return;
    priceEl.innerHTML =
      '<span class="price-currency">PHP</span> <span class="price-value">' +
      match[1] +
      "</span>";
    priceEl.dataset.currencyEnhanced = "true";
  });
}

/* ==================== NAVIGATION ==================== */
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navbar = document.querySelector(".navbar");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      const active = this.classList.toggle("active");
      navMenu.classList.toggle("active", active);
      this.setAttribute("aria-expanded", active ? "true" : "false");
      if (active) {
        toggleCart(false);
      }
    });
  }

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      if (hamburger) {
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
      if (navMenu) navMenu.classList.remove("active");
    });
  });

  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  });
}

/* ==================== MODALS ==================== */
function initializeModals() {
  const loveGiftModal = document.getElementById("loveGiftModal");
  const loveGiftTriggers = document.querySelectorAll(
    '[data-action="open-love-gift"]',
  );
  const modalClose = document.querySelector(".modal-close");

  loveGiftTriggers.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      openLoveGiftModal();
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeLoveGiftModal);
  }

  if (loveGiftModal) {
    loveGiftModal.addEventListener("click", function (event) {
      if (event.target === loveGiftModal) {
        closeLoveGiftModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLoveGiftModal();
    }
  });
}

function openLoveGiftModal() {
  const modal = document.getElementById("loveGiftModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeLoveGiftModal() {
  const modal = document.getElementById("loveGiftModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

function initializeProductModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;

  const closeButtons = modal.querySelectorAll(".product-modal-close");
  closeButtons.forEach((button) => {
    const stopCloseEvent = function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    button.addEventListener("pointerdown", stopCloseEvent);
    button.addEventListener("pointerup", stopCloseEvent);
    button.addEventListener("click", function (event) {
      stopCloseEvent(event);
      closeProductModal();
    });
  });

  modal.addEventListener("pointerdown", function (event) {
    if (event.target === modal) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      closeProductModal();
    }
  });
}

/* ==================== CONTACT FORM ==================== */
function initializeContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {
      fullName: formData.get("fullName")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
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
      showFormStatus(
        "success",
        "Message sent successfully! We'll be in touch soon.",
      );
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      saveContactMessage(data);
    }, 1200);
  });
}

function validateContactForm(data) {
  if (!data.fullName) {
    showFormStatus("error", "Please enter your full name.");
    return false;
  }
  if (!data.email || !isValidEmail(data.email)) {
    showFormStatus("error", "Please enter a valid email address.");
    return false;
  }
  if (!data.message) {
    showFormStatus("error", "Please enter your message.");
    return false;
  }
  return true;
}

function showFormStatus(type, message) {
  const status = document.getElementById("formStatus");
  if (!status) return;

  status.className = `form-status ${type}`;
  status.textContent = message;
  status.style.display = "block";

  setTimeout(() => {
    status.style.display = "none";
  }, 5000);
}

function saveContactMessage(data) {
  const existing = JSON.parse(localStorage.getItem("contactMessages") || "[]");
  existing.push(data);
  localStorage.setItem("contactMessages", JSON.stringify(existing));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==================== LOVE GIFT FORM ==================== */
function initializeLoveGiftForm() {
  const form = document.getElementById("loveGiftForm");
  const amountButtons = document.querySelectorAll(".amount-btn");
  const customAmountInput = document.getElementById("customAmount");
  let selectedAmount = null;

  amountButtons.forEach((button) => {
    button.addEventListener("click", function () {
      amountButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      selectedAmount = Number(this.dataset.amount);
      if (customAmountInput) customAmountInput.value = "";
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener("input", function () {
      amountButtons.forEach((btn) => btn.classList.remove("active"));
      selectedAmount = Number(this.value) || null;
    });
  }

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const giftData = {
      name: formData.get("giftName")?.toString().trim(),
      email: formData.get("giftEmail")?.toString().trim(),
      amount: selectedAmount || Number(formData.get("customAmount")) || 0,
      message: formData.get("giftMessage")?.toString().trim(),
      timestamp: new Date().toISOString(),
    };

    if (!giftData.amount || giftData.amount <= 0) {
      showToast("Please select or enter a donation amount.");
      return;
    }
    if (!giftData.name) {
      showToast("Please enter your name.");
      return;
    }
    if (!giftData.email || !isValidEmail(giftData.email)) {
      showToast("Please enter a valid email address.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      saveLoveGift(giftData);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      amountButtons.forEach((btn) => btn.classList.remove("active"));
      selectedAmount = null;
      closeLoveGiftModal();
      showToast(
        `Thank you for your Love Gift of $${giftData.amount.toFixed(2)}!`,
      );
    }, 1200);
  });
}

function saveLoveGift(data) {
  const existing = JSON.parse(localStorage.getItem("loveGifts") || "[]");
  existing.push(data);
  localStorage.setItem("loveGifts", JSON.stringify(existing));
}

/* ==================== SCROLL ANIMATIONS ==================== */
function initializeScrollAnimations() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
  );

  document
    .querySelectorAll(
      ".step-card, .product-card, .story-card, .contact-info, .contact-form-wrapper, .cta-banner, .mission-content",
    )
    .forEach((el) => {
      observer.observe(el);
    });
}

/* ==================== BUTTON INTERACTIONS ==================== */
function showToast(message, duration = 3500) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast.dismissTimer);
  toast.dismissTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

/* ==================== SIMPLE CART ==================== */
const PRODUCTS = [
  {
    id: "1",
    title: "Who Will Go Mug",
    price: 120,
    img: "Who Will Go Products/Mugs/Mug.png",
    video: "Who Will Go Products/Mugs/MOCKUP Mug.mp4",
    description:
      "Ceramic mug with a statement design — perfect for morning coffee and mission-minded conversations.",
  },
  {
    id: "2",
    title: "Who Will Go Tote Bag",
    price: 130,
    img: "Who Will Go Products/Tote Bag/Tote Bag.png",
    optionLabel: "design",
    description:
      "A polished tote bag with mission-inspired designs and a premium everyday finish.",
    options: [
      {
        id: "faith-can-move-mountains",
        label: "Faith Can Move Mountains",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 2 - Faith Can Move Mountains.png",
      },
      {
        id: "faith-over-fear",
        label: "Faith Over Fear",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 1 - Faith Over Fear.png",
      },
      {
        id: "trust-in-the-lord",
        label: "Trust In The Lord",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 3 - Trust In The Lord.png",
      },
      {
        id: "reach-the-nations",
        label: "Reach The Nations",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 4 - Reach The Nations, Make Jesus Known.png",
      },
    ],
  },
  {
    id: "20",
    title: "CROSS T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/CROSS Design Main.png",
    optionLabel: "color",
    description:
      "Signature CROSS tee with premium print quality. Available in adult and kids sizes for mission squads of every age.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Blue.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Green.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "21",
    title: "HERE AM I T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/HERER AM I design Main.png",
    optionLabel: "color",
    description:
      "Bold HERE AM I statement tee with mission-minded style. Available in adult and kids sizes.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Blue.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Green.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "22",
    title: "NEVER FAILS T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/NEVER FAILS Design Main.png",
    optionLabel: "color",
    description:
      "A powerful NEVER FAILS tee with two standout color choices. Available in adult and kids sizes.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/NEVER FAILS different color options/NEVER FAILS - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/NEVER FAILS different color options/NEVER FAILS - Black.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "23",
    title: "REDEEMED T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/REDEEMED Design Main.png",
    optionLabel: "color",
    description:
      "REDEEMED themed tee with bold mission messaging. Available in adult and kids sizes.",
    options: [
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/REDEEMED different color options/REDEEMED - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/REDEEMED different color options/REDEEMED - Blue.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "24",
    title: "SHEEP T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/SHEEP Design Main.png",
    optionLabel: "color",
    description:
      "Sheep graphic tee with a faithful message and flexible sizing for kids and adults.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Blue.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Green.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "6",
    title: "Who Will Go Cap",
    price: 150,
    img: "Who Will Go Products/Caps/Caps.png",
    optionLabel: "color",
    description:
      "A refined cap with premium stitching and selectable color options for everyday mission-minded wear.",
    options: [
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Blue.png",
      },
      {
        id: "gray",
        label: "Gray",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Gray.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Green.png",
      },
    ],
  },
  {
    id: "10",
    title: "Who Will Go Pins",
    price: 25,
    img: "Who Will Go Products/Accessories/Pins.png",
    optionLabel: "design",
    description:
      "Premium enamel pin designs crafted for everyday wear, backpacks, and mission-inspired gifts.",
    options: [
      {
        id: "love-conquers-all",
        label: "Love Conquers All",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 1 - Love Conquers All.png",
      },
      {
        id: "loved-and-blessed",
        label: "Loved & Blessed",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins Design 2 - Loved and Blessed.png",
      },
      {
        id: "faith-over-fear",
        label: "Faith Over Fear",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 3 - Faith over Fear.png",
      },
      {
        id: "saved-by-grace-alone",
        label: "Saved by Grace Alone",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 4 - Saved By Grace Alone.png",
      },
      {
        id: "peace-love-joy",
        label: "Peace Love Joy",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 5 - Peace Love Joy.png",
      },
      {
        id: "its-gonna-be-ok",
        label: "It’s Gonna Be Ok",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 6 - It's Gonna Be Ok.png",
      },
      {
        id: "let-your-light-shine",
        label: "Let Your Light Shine",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 7 - Let Your Light Shine.png",
      },
      {
        id: "jesus-brings-purpose",
        label: "Jesus Brings Purpose",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 8 - Jesus Brings Purpose.png",
      },
    ],
  },
  {
    id: "11",
    title: "Who Will Go Bamboo Notebook",
    price: 100,
    img: "Who Will Go Products/Accessories/Bamboo Notebook.png",
    optionLabel: "design",
    description:
      "A premium bamboo notebook featuring mission-driven artwork and a refined, eco-friendly finish.",
    options: [
      {
        id: "gods-grace-is-sufficient",
        label: "God's Grace is Sufficient",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 1 - God's Grace is Sufficient.png",
      },
      {
        id: "here-am-i-send-me",
        label: "HERE AM I Send Me",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 2 - HERE AM I Send Me.png",
      },
      {
        id: "faith-can-move-mountains",
        label: "Faith Can Move Mountains",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 3 - Faith Can Move Mountains.png",
      },
      {
        id: "i-can-do-all-things",
        label: "I Can Do All Things",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 4 - I Can Do All Things Through Christ Who Strengtheneth Me.png",
      },
    ],
  },
  {
    id: "12",
    title: "Who Will Go Magnetic Bookmark",
    price: 30,
    img: "Who Will Go Products/Accessories/Magnetic Bookmark.png",
    description:
      "Stylish magnetic bookmark that keeps your place securely while showcasing mission-driven reading.",
  },
  {
    id: "13",
    title: "Crochet Desk Mat",
    price: 155,
    img: "Who Will Go Products/Crochet/Desk-Mat.jpg",
    description:
      "A premium crochet desk mat with a soft, textured surface that protects your workspace and adds a handmade touch.",
    options: [
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Blue.png",
      },
      {
        id: "brown",
        label: "Brown",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Brown.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Green.png",
      },
      {
        id: "pink",
        label: "Pink",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Pink.png",
      },
      {
        id: "purple",
        label: "Purple",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Purple.png",
      },
      {
        id: "red",
        label: "Red",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Red.png",
      },
      {
        id: "yellow",
        label: "Yellow",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Yellow.png",
      },
    ],
  },
  {
    id: "14",
    title: "Crochet Coaster",
    price: 60,
    img: "Who Will Go Products/Crochet/Coaster.jpg",
    description:
      "Handcrafted crochet coaster designed to keep tables dry while adding mission-inspired charm.",
    options: [
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Crochet/Coaster different color/Blue.png",
      },
      {
        id: "bud-green",
        label: "Bud Green",
        img: "Who Will Go Products/Crochet/Coaster different color/Bud Green.png",
      },
      {
        id: "deep-purple",
        label: "Deep Purple",
        img: "Who Will Go Products/Crochet/Coaster different color/Deep Purple.png",
      },
      {
        id: "honey-yellow",
        label: "Honey Yellow",
        img: "Who Will Go Products/Crochet/Coaster different color/Honey Yellow.png",
      },
      {
        id: "light-brown",
        label: "Light Brown",
        img: "Who Will Go Products/Crochet/Coaster different color/Light Brown.png",
      },
      {
        id: "light-pink",
        label: "Light Pink",
        img: "Who Will Go Products/Crochet/Coaster different color/Light Pink.png",
      },
      {
        id: "red",
        label: "Red",
        img: "Who Will Go Products/Crochet/Coaster different color/Red.png",
      },
    ],
  },
  {
    id: "15",
    title: "Flower Keychain in a pouch",
    price: 155,
    img: "Who Will Go Products/Crochet/Flower Keychain in a pouch.jpg",
    description:
      "A beautiful crochet flower keychain with a fabric pouch — perfect for gifting or keeping keys stylish.",
    options: [
      {
        id: "banana-yellow",
        label: "Banana Yellow",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/BANANA YELLOW.png",
      },
      {
        id: "blush-pink",
        label: "Blush Pink",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/BLUSH PINK.png",
      },
      {
        id: "lavender",
        label: "Lavender",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/LAVENDER.png",
      },
      {
        id: "light-brown",
        label: "Light Brown",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/LIGHT BROWN.png",
      },
      {
        id: "light-orange",
        label: "Light Orange",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/LIGHT ORANGE.png",
      },
      {
        id: "mint-green",
        label: "Mint Green",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/MINT GREEN.png",
      },
      {
        id: "sky-blue",
        label: "Sky Blue",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/SKY BLUE.png",
      },
      {
        id: "watermelon-red",
        label: "Watermelon Red",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/WATERMELON RED.png",
      },
    ],
  },
  {
    id: "16",
    title: "Flower Bouquet Keychain",
    price: 130,
    img: "Who Will Go Products/Crochet/Flower Bouquet Keychain.jpg",
    description:
      "Handmade crochet bouquet keychain with delicate detailing for everyday inspiration.",
    options: [
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/BLUE.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/GREEN.png",
      },
      {
        id: "pink",
        label: "Pink",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/PINK.png",
      },
      {
        id: "purple",
        label: "Purple",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/PURPLE.png",
      },
      {
        id: "red",
        label: "Red",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/RED.png",
      },
      {
        id: "yellow",
        label: "Yellow",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/YELLOW.png",
      },
    ],
  },
  {
    id: "17",
    title: "Cake Keychain",
    price: 45,
    img: "Who Will Go Products/Crochet/Cake Keychain.jpg",
    description:
      "A charming crochet cake keychain that adds a playful, handcrafted accent to any set of keys.",
    options: [
      {
        id: "blueberry",
        label: "Blueberry",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Blueberry.png",
      },
      {
        id: "chocolate",
        label: "Chocolate",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Chocolate.png",
      },
      {
        id: "mango",
        label: "Mango",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Mango.png",
      },
      {
        id: "matcha",
        label: "Matcha",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Matcha.png",
      },
      {
        id: "red-velvet",
        label: "Red Velvet",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Red Velvet.png",
      },
      {
        id: "strawberry",
        label: "Strawberry",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Strawberry.png",
      },
      {
        id: "ube",
        label: "Ube",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Ube.png",
      },
    ],
  },
];

let cart = JSON.parse(localStorage.getItem("wwg_cart") || "[]");

function saveCart() {
  localStorage.setItem("wwg_cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const el = document.getElementById("cartCount");
  const totalCount = cart.reduce((s, i) => s + i.qty, 0);
  if (el) el.textContent = totalCount;
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === String(id));
}

function formatCartKey(productId, variantId, sizeId) {
  if (variantId && sizeId) return `${productId}::${variantId}::${sizeId}`;
  if (variantId) return `${productId}::${variantId}`;
  if (sizeId) return `${productId}::${sizeId}`;
  return String(productId);
}

function getCartItemKey(item) {
  return item.key || formatCartKey(item.id, item.variantId, item.sizeId);
}

function getCartItemId(item) {
  return getCartItemKey(item).replace(/[^a-zA-Z0-9-_]/g, "-");
}

function getVariant(product, variantId) {
  if (!product?.options) return null;
  return product.options.find((option) => option.id === variantId) || null;
}

function getSize(product, sizeId) {
  if (!product?.sizes) return null;
  return product.sizes.find((size) => size.id === sizeId) || null;
}

function getProductPrice(product, sizeId) {
  const selectedSize = sizeId ? getSize(product, sizeId) : null;
  return selectedSize?.price ?? product.price;
}

function addToCart(id, variantId = null, sizeId = null, qty = 1) {
  const product = findProduct(id);
  if (!product) return showToast("Product not found");

  if (product.options?.length && !variantId) {
    openProductModal(id, null, sizeId);
    return;
  }

  if (product.sizes?.length && !sizeId) {
    openProductModal(id, variantId || null, null);
    return;
  }

  const selectedVariant = variantId ? getVariant(product, variantId) : null;
  const selectedSize = sizeId ? getSize(product, sizeId) : null;
  const productPrice = getProductPrice(product, selectedSize?.id);
  const cartKey = formatCartKey(
    product.id,
    selectedVariant?.id,
    selectedSize?.id,
  );
  const existing = cart.find((item) => getCartItemKey(item) === cartKey);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key: cartKey,
      id: product.id,
      title: product.title,
      price: productPrice,
      img: selectedVariant?.img || product.img,
      qty,
      variantId: selectedVariant?.id || null,
      variantLabel: selectedVariant?.label || null,
      sizeId: selectedSize?.id || null,
      sizeLabel: selectedSize?.label || null,
    });
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast(
    `${product.title}${selectedVariant ? ` — ${selectedVariant.label}` : ""} added to cart`,
  );
}

function changeQty(key, delta) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((item) => getCartItemKey(item) !== key);
  }
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function setQty(key, value) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  if (value <= 0 || Number.isNaN(value)) {
    return removeCartItem(key);
  }
  item.qty = value;
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function updateCartTotalsForInput(key, value) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item || value <= 0 || Number.isNaN(value)) return;
  const cartItem = document.querySelector(`.qty-input[data-key="${key}"]`);
  if (!cartItem) return;
  const cartRow = cartItem.closest(".cart-item");
  if (!cartRow) return;
  const linePrice = cartRow.querySelector(".cart-item-price");
  if (linePrice) {
    linePrice.textContent = `PHP ${(item.price * value).toFixed(2)}`;
  }
  const total = cart.reduce((sum, current) => {
    return (
      sum +
      (current.key === key
        ? current.price * value
        : current.price * current.qty)
    );
  }, 0);
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = `PHP ${total.toFixed(2)}`;
}

function removeCartItem(key) {
  cart = cart.filter((item) => getCartItemKey(item) !== key);
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function openConfirmDialog(options) {
  const modal = document.getElementById("confirmModal");
  const description = document.getElementById("confirmModalDescription");
  const yesButton = document.getElementById("confirmYes");
  const cancelButton = document.getElementById("confirmCancel");
  const closeButton = modal?.querySelector(".modal-close");

  if (!modal || !description || !yesButton || !cancelButton) return;

  description.textContent = options.message;
  yesButton.textContent = options.confirmText || "Yes";
  cancelButton.textContent = options.cancelText || "No";

  // Apply button styling based on action type
  yesButton.className = options.yesButtonClass || "cta-btn cta-primary";
  cancelButton.className = options.cancelButtonClass || "cta-btn cta-outline";

  const cleanup = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    yesButton.onclick = null;
    cancelButton.onclick = null;
    if (closeButton) closeButton.onclick = null;
  };

  yesButton.onclick = () => {
    cleanup();
    options.onConfirm?.();
  };

  cancelButton.onclick = () => {
    cleanup();
    options.onCancel?.();
  };

  if (closeButton) {
    closeButton.onclick = () => {
      cleanup();
      options.onCancel?.();
    };
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function promptRemoveItem(key, title) {
  // ensure user can see the Order Summary before confirming
  scrollCartToSummary();

  openConfirmDialog({
    message: `Are you sure you want to remove "${title}" from your cart?`,
    confirmText: "Yes, remove",
    cancelText: "No, keep it",
    // make the left-cancel button the emphasized primary action (matches design)
    yesButtonClass: "cta-btn cta-outline",
    cancelButtonClass: "cta-btn cta-primary",
    onConfirm: () => removeCartItem(key),
  });
}

function promptClearCart() {
  // scroll so the user sees the Order Summary while deciding
  scrollCartToSummary();

  openConfirmDialog({
    message: "Are you sure you want to clear all items from your cart?",
    confirmText: "Yes, clear cart",
    cancelText: "No, keep items",
    // emphasize the cancel (keep items) button on the left as primary
    yesButtonClass: "cta-btn cta-outline",
    cancelButtonClass: "cta-btn cta-primary",
    onConfirm: () => {
      clearCart();
      showToast("Cart cleared successfully.");
    },
  });
}

// Scroll the cart sidebar so the Order Summary is visible to the user.
function scrollCartToSummary() {
  try {
    const sidebar = document.getElementById("cartSidebar");
    if (!sidebar) return;
    const summary = sidebar.querySelector(".order-summary");
    if (!summary) return;

    // Calculate position of summary relative to the scroll container
    const sidebarRect = sidebar.getBoundingClientRect();
    const summaryRect = summary.getBoundingClientRect();
    const currentScroll = sidebar.scrollTop || 0;
    const offset = summaryRect.top - sidebarRect.top + currentScroll - 12; // small padding

    sidebar.scrollTo({ top: offset, behavior: "smooth" });
  } catch (e) {
    // silent fail
  }
}

function updateCartVariant(key, variantId) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  const product = findProduct(item.id);
  if (!product?.options?.length) return;
  const variant = getVariant(product, variantId);
  if (!variant) return;

  const targetKey = formatCartKey(item.id, variant.id, item.sizeId);
  const existingVariantItem = cart.find(
    (cartItem) => getCartItemKey(cartItem) === targetKey,
  );

  if (existingVariantItem && existingVariantItem !== item) {
    existingVariantItem.qty += item.qty;
    cart = cart.filter((cartItem) => cartItem !== item);
  } else {
    item.variantId = variant.id;
    item.variantLabel = variant.label;
    item.img = variant.img;
    item.key = targetKey;
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
}

function updateCartSize(key, sizeId) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  const product = findProduct(item.id);
  if (!product?.sizes?.length) return;
  const size = getSize(product, sizeId);
  if (!size) return;

  const targetKey = formatCartKey(item.id, item.variantId, size.id);
  const existingSizeItem = cart.find(
    (cartItem) => getCartItemKey(cartItem) === targetKey,
  );

  if (existingSizeItem && existingSizeItem !== item) {
    existingSizeItem.qty += item.qty;
    cart = cart.filter((cartItem) => cartItem !== item);
  } else {
    item.sizeId = size.id;
    item.sizeLabel = size.label;
    item.price = size.price;
    item.key = targetKey;
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const cartFooter = document.querySelector(".cart-footer");
  if (!container) return;
  container.innerHTML = "";
  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty-card">
        <div class="cart-empty-icon"><i class="fas fa-shopping-basket"></i></div>
        <div>
          <p class="cart-empty-title">Your cart is empty</p>
          <p class="cart-empty-text">
            Add a product to build your order and support missionaries in the field.
          </p>
        </div>
        <a href="#shop" class="cta-btn cta-primary cart-empty-cta">Shop Now</a>
      </div>
    `;
    document.getElementById("cartTotal").textContent = "PHP 0.00";
    const countEl = document.getElementById("cartItemCount");
    if (countEl) countEl.textContent = "(0 items)";
    if (cartFooter) cartFooter.classList.add("empty");
    const emptyCta = container.querySelector(".cart-empty-cta");
    if (emptyCta) {
      emptyCta.addEventListener("click", () => toggleCart(false));
    }
    return;
  }
  if (cartFooter) cartFooter.classList.remove("empty");
  let total = 0;
  cart.forEach((item) => {
    const itemKey = getCartItemKey(item);
    const itemId = getCartItemId(item);
    const product = findProduct(item.id);
    const variantOptions = product?.options || [];
    const variantSelect = variantOptions.length
      ? `
          <div class="cart-item-options">
            <div class="cart-item-option-label">Color</div>
            <select class="cart-variant-select" id="variant-${itemId}" data-key="${itemKey}" aria-label="Choose a color for ${item.title}">
              ${variantOptions
                .map(
                  (option) => `
                <option value="${option.id}" ${option.id === item.variantId ? "selected" : ""}>
                  ${option.label}
                </option>
              `,
                )
                .join("")}
            </select>
            <div class="cart-item-option-helper">Choose color variations</div>
          </div>
        `
      : "";

    const sizeOptions = product?.sizes || [];
    const sizeSelect = sizeOptions.length
      ? `
          <div class="cart-item-options">
            <div class="cart-item-option-label">Size</div>
            <select class="cart-size-select" id="size-${itemId}" data-key="${itemKey}" aria-label="Choose a size for ${item.title}">
              ${sizeOptions
                .map((size) => {
                  const sizeLabel = size.label.includes(`(${size.category})`)
                    ? size.label
                    : `${size.label} (${size.category})`;
                  return `
                <option value="${size.id}" ${size.id === item.sizeId ? "selected" : ""}>
                  ${sizeLabel}
                </option>
              `;
                })
                .join("")}
            </select>
            <div class="cart-item-option-helper">Kids sizes PHP 150, adult sizes PHP 250</div>
          </div>
        `
      : "";

    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="cart-item-main">
        <div class="cart-item-title">${item.title}</div>
        ${variantSelect}
        ${sizeSelect}
        <div class="qty-label">Quantity</div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-key="${itemKey}">-</button>
          <input
            type="number"
            class="qty-input"
            min="1"
            step="1"
            inputmode="numeric"
            pattern="[0-9]*"
            value="${item.qty}"
            data-key="${itemKey}"
            aria-label="Quantity for ${item.title}"
          />
          <button class="qty-btn" data-action="inc" data-key="${itemKey}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">PHP ${(item.price * item.qty).toFixed(2)}</div>
        <button
          class="remove-item-btn"
          type="button"
          data-action="remove"
          data-key="${itemKey}"
          aria-label="Remove ${item.title} from cart"
        >
          Remove
        </button>
      </div>
    `;
    container.appendChild(div);
  });
  const count = cart.reduce((s, i) => s + (i.qty || 0), 0);
  const countEl = document.getElementById("cartItemCount");
  if (countEl) countEl.textContent = `(${count} item${count === 1 ? "" : "s"})`;
  const subtotalEl = document.getElementById("cartSubtotal");
  if (subtotalEl) subtotalEl.textContent = `PHP ${total.toFixed(2)}`;
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = `PHP ${total.toFixed(2)}`;
}

function toggleCart(open) {
  const sb = document.getElementById("cartSidebar");
  const ov = document.getElementById("cartOverlay");
  const cartButton = document.getElementById("cartButton");
  if (!sb || !ov) return;
  const doOpen =
    typeof open === "boolean" ? open : !sb.classList.contains("open");
  if (doOpen) {
    sb.classList.add("open");
    ov.classList.add("open");
    sb.setAttribute("aria-hidden", "false");
    if (cartButton) cartButton.setAttribute("aria-expanded", "true");
    renderCartItems();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    document.body.dataset.scrollY = scrollY;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.querySelectorAll(".nav-menu.active").forEach((menu) => {
      menu.classList.remove("active");
    });
    const hamburgerBtn = document.querySelector(".hamburger");
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove("active");
    }
    document.documentElement.classList.add("cart-open");
    document.body.classList.add("cart-open");
  } else {
    sb.classList.remove("open");
    ov.classList.remove("open");
    sb.setAttribute("aria-hidden", "true");
    if (cartButton) cartButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    delete document.body.dataset.scrollY;
    document.documentElement.classList.remove("cart-open");
    document.body.classList.remove("cart-open");
  }
}

/* ==================== PRODUCT MODAL ==================== */
function setProductModalPreview(product, variantId = null, variantIndex = 0) {
  const imageContainer = document.getElementById("productModalImagePreview");
  const imageCount = document.getElementById("productModalImageCount");
  const selectedVariant = variantId ? getVariant(product, variantId) : null;
  const previewImg = selectedVariant?.img || product.img;
  const previewVideo = selectedVariant ? null : product.video;
  const altText = `${product.title}${selectedVariant ? ` — ${selectedVariant.label}` : ""}`;

  if (imageContainer) {
    imageContainer.innerHTML = previewVideo
      ? `
        <video
          autoplay
          muted
          loop
          playsinline
          poster="${previewImg}"
          aria-label="${altText} preview"
        >
          <source src="${previewVideo}" type="video/mp4" />
          <img src="${previewImg}" alt="${altText}" />
        </video>
      `
      : `
        <img src="${previewImg}" alt="${altText}" />
      `;
  }

  if (imageCount) {
    const total = product.options?.length || 1;
    const current = variantIndex + 1;
    imageCount.textContent =
      total > 1 ? `${current} of ${total} colors` : "1 photo";
  }
}

function renderProductModalOptions(
  product,
  selectedVariantId = null,
  selectedSizeId = null,
  qty = 1,
  selectedVariantIndex = 0,
) {
  const optionsContainer = document.getElementById("productModalOptions");
  if (!optionsContainer) return;

  const variantHtml = product?.options?.length
    ? (() => {
        const defaultVariant =
          getVariant(product, selectedVariantId) || product.options[0];
        const optionLabel = product.optionLabel || "option";
        const labelText = `Choose a ${optionLabel}`;
        const optionsHtml = product.options
          .map(
            (option) => `
              <option value="${option.id}" ${option.id === defaultVariant.id ? "selected" : ""}>
                ${option.label}
              </option>
            `,
          )
          .join("");

        return `
          <div class="product-option-group">
            <label for="productModalVariantSelect">${labelText}</label>
            <select id="productModalVariantSelect" class="variant-select" aria-label="${labelText} for ${product.title}">
              ${optionsHtml}
            </select>
          </div>
        `;
      })()
    : "";

  const sizeHtml = product?.sizes?.length
    ? (() => {
        const selectedSize =
          getSize(product, selectedSizeId) || product.sizes[0];
        const sizeOptionsHtml = product.sizes
          .map((size) => {
            const sizeLabel = size.label.includes(`(${size.category})`)
              ? size.label
              : `${size.label} (${size.category})`;
            return `
                <option value="${size.id}" ${size.id === selectedSize.id ? "selected" : ""}>
                  ${sizeLabel}
                </option>
              `;
          })
          .join("");

        return `
          <div class="product-option-group">
            <label for="productModalSizeSelect">Select size</label>
            <select id="productModalSizeSelect" class="variant-select" aria-label="Select size for ${product.title}">
              ${sizeOptionsHtml}
            </select>
          </div>
        `;
      })()
    : "";

  const quantityHtml = `
    <div class="product-option-group product-modal-quantity">
      <label for="productModalQty">Quantity</label>
      <div class="product-modal-qty-control">
        <button type="button" class="product-qty-btn" data-action="dec" aria-label="Decrease quantity">-</button>
        <input
          id="productModalQty"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          value="${qty || 1}"
          class="product-modal-qty-input"
          aria-label="Quantity for ${product.title}"
        />
        <button type="button" class="product-qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `;

  optionsContainer.innerHTML = `${variantHtml}${sizeHtml}${quantityHtml}`;

  const selectedVariant = selectedVariantId
    ? getVariant(product, selectedVariantId)
    : product?.options?.[0];
  const currentIndex = product?.options?.findIndex(
    (option) => option.id === selectedVariant?.id,
  );
  setProductModalPreview(
    product,
    selectedVariant?.id,
    currentIndex >= 0 ? currentIndex : 0,
  );
}

function openProductModal(
  id,
  selectedVariantId = null,
  selectedSizeId = null,
  qty = 1,
  scrollToAdd = false,
) {
  const product = findProduct(id);
  const modal = document.getElementById("productModal");
  if (!modal) return;
  const title = document.getElementById("productModalTitle");
  const desc = document.getElementById("productModalDescription");
  const price = document.getElementById("productModalPrice");
  const cat = document.getElementById("productModalCategory");
  const addBtn = document.getElementById("productModalAddToCart");
  const subtitle = document.getElementById("productModalSubtitle");

  if (product) {
    const selectedIndex = product?.options?.findIndex(
      (option) => option.id === selectedVariantId,
    );
    setProductModalPreview(
      product,
      selectedVariantId,
      selectedIndex >= 0 ? selectedIndex : 0,
    );
    title.textContent = product.title;
    desc.textContent =
      product.description ||
      document.querySelector(
        `.product-card[data-product-id="${id}"] .product-description`,
      )?.textContent ||
      "";
    price.textContent = `PHP ${getProductPrice(product, selectedSizeId)}`;
    cat.textContent =
      document.querySelector(
        `.product-card[data-product-id="${id}"] .product-category`,
      )?.textContent || "";
    addBtn.dataset.id = product.id;
    addBtn.dataset.variant = selectedVariantId || "";
    addBtn.dataset.size = selectedSizeId || "";
    modal.dataset.productId = product.id;
    modal.dataset.currentPhotoIndex = selectedIndex >= 0 ? selectedIndex : 0;
    modal.dataset.photoCount = product.options?.length || 1;
    renderProductModalOptions(
      product,
      selectedVariantId,
      selectedSizeId,
      qty,
      selectedIndex >= 0 ? selectedIndex : 0,
    );
    const modalElement = document.getElementById("productModal");
    if (modalElement) {
      modalElement.dataset.currentPhotoIndex =
        selectedIndex >= 0 ? selectedIndex : 0;
      modalElement.dataset.photoCount = product.options?.length || 1;
    }
    subtitle.textContent =
      product.options?.length && product.sizes?.length
        ? `Select your ${product.optionLabel || "option"} and size before checkout`
        : product.options?.length
          ? `Select your ${product.optionLabel || "option"} before checkout`
          : product.sizes?.length
            ? "Select your size before checkout"
            : "";

    const sizeGuideSection = document.getElementById("productModalSizeGuide");
    if (sizeGuideSection) {
      if (product.category === "t-shirts") {
        sizeGuideSection.hidden = false;
        sizeGuideSection.innerHTML = `
          <div class="size-guide-header">
            <div>
              <p class="size-guide-tag">T-Shirt Size Guide</p>
              <h3>Tap the image to view the full size chart.</h3>
            </div>
            <p class="size-guide-note">
              The exact measurement chart opens in a larger preview so you can confirm width and length before checkout.
            </p>
          </div>
          <div class="size-guide-content">
            <button
              type="button"
              class="size-guide-image-wrap product-summary-preview"
              data-preview-src="Who Will Go Products/T-Shirts/summary.png"
              data-preview-alt="Full-size T-shirt size guide"
              aria-label="Open full size guide"
            >
              <img
                src="Who Will Go Products/T-Shirts/summary.png"
                alt="Exact T-shirt size guide"
                loading="lazy"
              />
              <span class="size-guide-image-action">View full size guide</span>
            </button>
          </div>
        `;
      } else {
        sizeGuideSection.hidden = true;
        sizeGuideSection.innerHTML = "";
      }
    }
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // If caller requested, scroll the modal so the Add to Cart button is visible
  if (scrollToAdd) {
    setTimeout(() => {
      const addBtn = document.getElementById("productModalAddToCart");
      if (addBtn) {
        try {
          addBtn.scrollIntoView({ behavior: "smooth", block: "center" });
          addBtn.focus({ preventScroll: true });
        } catch (e) {
          // fallback for older browsers
          addBtn.focus();
        }
      }
    }, 140);
  }
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
}

/* product modal events */
document.addEventListener("click", function (e) {
  const t = e.target;
  if (t.id === "productModal" || t.closest("#productModal")) {
    // clicking inside should not close; click overlay only
    if (t.id === "productModal") {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeProductModal();
      return;
    }
  }
  if (t.matches(".product-modal-close") || t.closest(".product-modal-close")) {
    e.preventDefault();
    e.stopImmediatePropagation();
    closeProductModal();
    return;
  }

  const prevArrow = t.closest("#productModalPrev");
  const nextArrow = t.closest("#productModalNext");
  if (prevArrow || nextArrow) {
    const modalElement = document.getElementById("productModal");
    const productId = modalElement?.dataset?.productId;
    const product = findProduct(productId);
    if (product && product.options?.length > 1) {
      const total = product.options.length;
      const currentIndex = Number(modalElement.dataset.currentPhotoIndex) || 0;
      const step = prevArrow ? -1 : 1;
      const newIndex = Math.min(Math.max(currentIndex + step, 0), total - 1);
      const variantId = product.options[newIndex]?.id;
      const variantSelect = document.getElementById(
        "productModalVariantSelect",
      );
      if (variantSelect && variantId) {
        variantSelect.value = variantId;
      }
      setProductModalPreview(product, variantId, newIndex);
      modalElement.dataset.currentPhotoIndex = newIndex;
    }
    return;
  }

  if (t.matches(".product-qty-btn") || t.closest(".product-qty-btn")) {
    const btn = t.matches(".product-qty-btn")
      ? t
      : t.closest(".product-qty-btn");
    const action = btn.dataset.action;
    const qtyInput = document.getElementById("productModalQty");
    if (qtyInput) {
      let qty = parseInt(qtyInput.value, 10);
      if (!Number.isFinite(qty) || qty < 1) qty = 1;
      qty = action === "inc" ? qty + 1 : action === "dec" ? qty - 1 : qty;
      qtyInput.value = qty < 1 ? 1 : qty;
    }
    return;
  }
  if (t.id === "productModalAddToCart" || t.closest("#productModalAddToCart")) {
    const btn =
      t.id === "productModalAddToCart"
        ? t
        : t.closest("#productModalAddToCart");
    const id = btn.dataset.id;
    const variantSelect = document.getElementById("productModalVariantSelect");
    const sizeSelect = document.getElementById("productModalSizeSelect");
    const qtyInput = document.getElementById("productModalQty");
    const selectedVariant = variantSelect?.value || btn.dataset.variant || null;
    const selectedSize = sizeSelect?.value || btn.dataset.size || null;
    const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
    addToCart(
      id,
      selectedVariant,
      selectedSize,
      Number.isFinite(qty) && qty > 0 ? qty : 1,
    );
    closeProductModal();
    return;
  }
});

document.addEventListener("keydown", function (ev) {
  if (ev.key === "Escape") {
    closeProductModal();
  }
});

/* wire cart events */
document.addEventListener("click", function (e) {
  const t = e.target;
  // Quick preview button on product image
  if (t.matches(".view-product") || t.closest(".view-product")) {
    const btn = t.matches(".view-product") ? t : t.closest(".view-product");
    if (btn.classList.contains("product-summary-preview")) {
      return;
    }
    const id = btn.dataset.id;
    openProductModal(id, null, null, 1);
    return;
  }

  // Clicking a product image: on mobile/touch devices open the product
  // modal so users can choose options and add-to-cart. On desktop keep
  // the existing quick-image preview behaviour.
  const imageArea = t.closest(".product-image");
  if (imageArea) {
    const card = imageArea.closest(".product-card");
    const id = card?.dataset?.productId;
    if (id) {
      const isTouch =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      const smallViewport =
        typeof window !== "undefined" && window.innerWidth <= 768;
      if (!isTouch && !smallViewport) {
        // desktop non-touch: let preview overlay handle image clicks
        return;
      }

      // mobile or touch device: open full product modal and align the
      // Add to Cart button to the exact location of the clicked image.
      const imageEl = imageArea.querySelector("img");
      openProductModal(id, null, null, 1, false);

      setTimeout(() => {
        try {
          // Keep the modal image at the top (don't scroll the content)
          const modalBody = document.querySelector(
            ".product-modal .product-modal-body",
          );
          if (modalBody) modalBody.scrollTop = 0;

          // Focus the Add to Cart button without scrolling, and briefly
          // highlight it so the user sees the call-to-action at a glance.
          const addBtn = document.getElementById("productModalAddToCart");
          if (!addBtn) return;
          try {
            addBtn.focus({ preventScroll: true });
          } catch (e) {
            addBtn.focus();
          }
          addBtn.classList.add("product-add-highlight");
          setTimeout(
            () => addBtn.classList.remove("product-add-highlight"),
            1200,
          );
        } catch (e) {
          // silent fail — keep modal usable
        }
      }, 180);
      return;
    }
  }

  if (t.matches(".add-to-cart") || t.closest(".add-to-cart")) {
    const btn = t.matches(".add-to-cart") ? t : t.closest(".add-to-cart");
    const id = btn.dataset.id;
    // For products that benefit from a quick confirmation (mug, bookmark),
    // open the product modal and highlight the Add-to-Cart CTA instead
    // of adding immediately. This gives the user a chance to confirm.
    const idsToConfirm = ["1", "12"]; // Who Will Go Mug (1), Magnetic Bookmark (12)
    if (idsToConfirm.includes(String(id))) {
      openProductModal(id, null, null, 1, false);
      setTimeout(() => {
        try {
          const modalBody = document.querySelector(
            ".product-modal .product-modal-body",
          );
          if (modalBody) modalBody.scrollTop = 0;
          const addBtn = document.getElementById("productModalAddToCart");
          if (!addBtn) return;
          try {
            addBtn.focus({ preventScroll: true });
          } catch (e) {
            addBtn.focus();
          }
          addBtn.classList.add("product-add-highlight");
          setTimeout(
            () => addBtn.classList.remove("product-add-highlight"),
            1200,
          );
        } catch (e) {
          // silent fail
        }
      }, 160);
      return;
    }

    addToCart(id, null, null, 1);
    return;
  }

  if (
    t.id === "cartButton" ||
    t.closest("#cartButton") ||
    t.closest(".bottom-nav-cart")
  ) {
    toggleCart();
    const cartButton = document.getElementById("cartButton");
    if (cartButton) {
      const isOpen = document
        .getElementById("cartSidebar")
        .classList.contains("open");
      cartButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    return;
  }

  if (t.id === "closeCart" || t.closest("#closeCart")) {
    e.preventDefault();
    e.stopPropagation();
    toggleCart(false);
    return;
  }

  if (t.id === "clearCart" || t.closest("#clearCart")) {
    promptClearCart();
    return;
  }

  if (t.id === "checkoutBtn" || t.closest("#checkoutBtn")) {
    showToast("Checkout is not configured in this demo.");
    return;
  }

  if (t.matches(".remove-item-btn") || t.closest(".remove-item-btn")) {
    const btn = t.matches(".remove-item-btn")
      ? t
      : t.closest(".remove-item-btn");
    const key = btn.dataset.key;
    const item = cart.find((i) => getCartItemKey(i) === key);
    if (!item) return;
    promptRemoveItem(key, item.title);
    return;
  }

  if (t.matches(".qty-btn") || t.closest(".qty-btn")) {
    const btn = t.matches(".qty-btn") ? t : t.closest(".qty-btn");
    const action = btn.dataset.action;
    const key = btn.dataset.key;
    if (action === "inc") changeQty(key, 1);
    if (action === "dec") changeQty(key, -1);
    return;
  }

  if (t.id === "cartOverlay" || t.closest("#cartOverlay")) {
    toggleCart(false);
    return;
  }
});

document.addEventListener("input", function (e) {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("qty-input")) return;
  const key = target.dataset.key;
  const quantity = parseInt(target.value, 10);
  if (Number.isFinite(quantity) && quantity > 0) {
    updateCartTotalsForInput(key, quantity);
  }
});

document.addEventListener("change", function (e) {
  const target = e.target;
  if (
    target instanceof HTMLSelectElement &&
    target.id === "productModalVariantSelect"
  ) {
    const addBtn = document.getElementById("productModalAddToCart");
    const product = findProduct(addBtn?.dataset.id);
    if (product) {
      const selectedIndex = product.options?.findIndex(
        (option) => option.id === target.value,
      );
      setProductModalPreview(
        product,
        target.value,
        selectedIndex >= 0 ? selectedIndex : 0,
      );
      const modalElement = document.getElementById("productModal");
      if (modalElement) {
        modalElement.dataset.currentPhotoIndex =
          selectedIndex >= 0 ? selectedIndex : 0;
      }
      if (addBtn) {
        addBtn.dataset.variant = target.value;
        addBtn.dataset.size =
          document.getElementById("productModalSizeSelect")?.value || "";
      }
    }
    return;
  }

  if (
    target instanceof HTMLSelectElement &&
    target.id === "productModalSizeSelect"
  ) {
    const addBtn = document.getElementById("productModalAddToCart");
    const product = findProduct(addBtn?.dataset.id);
    const price = document.getElementById("productModalPrice");
    if (product && price) {
      const selectedSize = target.value;
      price.textContent = `PHP ${getProductPrice(product, selectedSize)}`;
      if (addBtn) addBtn.dataset.size = selectedSize;
    }
    return;
  }

  if (
    target instanceof HTMLSelectElement &&
    target.classList.contains("cart-variant-select")
  ) {
    const key = target.dataset.key;
    const newValue = target.value;
    updateCartVariant(key, newValue);
    return;
  }

  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("qty-input")) return;
  const key = target.dataset.key;
  const quantity = parseInt(target.value, 10);
  if (Number.isFinite(quantity) && quantity > 0) {
    setQty(key, quantity);
  } else {
    removeCartItem(key);
  }
});

/* initialize badge on load */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
