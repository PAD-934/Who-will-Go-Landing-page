/* ==================== INITIALIZATION ==================== */
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeModals();
  initializeContactForm();
  initializeLoveGiftForm();
  initializeProductFilters();
  initializeMobilePreviewMode();
  applyLazyImageLoading();
  initializeScrollAnimations();
});

function applyLazyImageLoading() {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    img.decoding = "async";
  });
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
        (tag === "made" && cardTags.includes("made")) ||
        (tag === "onsite" && cardTags.includes("onsite"));

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
    link.addEventListener("click", () => {
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

function initializeMobilePreviewMode() {
  const toggle = document.getElementById("mobilePreviewToggle");
  const body = document.body;
  const appShell = document.getElementById("appShell");

  if (!toggle || !appShell) return;

  toggle.addEventListener("click", function () {
    const active = body.classList.toggle("mobile-preview-mode");
    this.classList.toggle("active", active);
    this.setAttribute("aria-pressed", active ? "true" : "false");
    this.setAttribute(
      "aria-label",
      active ? "Exit mobile preview" : "Toggle mobile preview",
    );
    const label = this.querySelector("span");
    if (label) label.textContent = active ? "Exit Preview" : "Mobile Preview";
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    if (!active) {
      toggleCart(false);
      document
        .querySelectorAll(".nav-menu.active")
        .forEach((menu) => menu.classList.remove("active"));
      const hamburgerBtn = document.querySelector(".hamburger");
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
    }
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
    price: 115,
    img: "Who Will Go Products/Mugs/Mugs.png",
    video: "Who Will Go Products/Mugs/Mugs - MOCKUP.mp4",
    description:
      "Ceramic mug with a statement design — perfect for morning coffee and mission-minded conversations.",
  },
  {
    id: "2",
    title: "Faith Can Move Mountains Tote",
    price: 130,
    img: "Who Will Go Products/Tote Bag/Tote Bag - Faith Can Move Mountains.png",
    description:
      "Heavy-duty canvas tote with bold script artwork for everyday use.",
  },
  {
    id: "3",
    title: "Faith Over Fear Tote",
    price: 130,
    img: "Who Will Go Products/Tote Bag/Tote Bag - Faith Over Fear.png",
    description: "Stylish canvas carryall with an inspiring mission message.",
  },
  {
    id: "4",
    title: "Reach The Nations Tote",
    price: 130,
    img: "Who Will Go Products/Tote Bag/Tote Bag - Reach The Nations, Make Jesus Known.png",
    description:
      "Mission-driven tote for your daily essentials with a bold statement.",
  },
  {
    id: "5",
    title: "Trust In the Lord Tote",
    price: 130,
    img: "Who Will Go Products/Tote Bag/Tote Bag - Trust In the Lord.png",
    description:
      "Faith-inspired tote with elegant lettering and durable canvas.",
  },
  {
    id: "6",
    title: "Who Will Go Cap — Black",
    price: 100,
    img: "Who Will Go Products/Caps/caps-black.png",
    description:
      "Structured cap with embroidered logo — classic fit and durable.",
  },
  {
    id: "7",
    title: "Who Will Go Cap — Blue",
    price: 100,
    img: "Who Will Go Products/Caps/caps-blue.png",
    description:
      "Structured cap with embroidered logo — classic fit and durable.",
  },
  {
    id: "8",
    title: "Who Will Go Cap — Gray",
    price: 100,
    img: "Who Will Go Products/Caps/caps-gray.png",
    description:
      "Structured cap with embroidered logo — classic fit and durable.",
  },
  {
    id: "9",
    title: "Who Will Go Cap — Green",
    price: 100,
    img: "Who Will Go Products/Caps/caps-green.png",
    description:
      "Structured cap with embroidered logo — classic fit and durable.",
  },
  {
    id: "10",
    title: "Who Will Go Pins",
    price: 25,
    img: "Who Will Go Products/Accessories/Pins.png",
    description:
      "Premium enamel pins with mission-inspired motifs — perfect for bags, jackets, and gifting.",
  },
  {
    id: "11",
    title: "Who Will Go Bamboo Notebook",
    price: 120,
    img: "Who Will Go Products/Accessories/Bamboo Notebook.png",
    description:
      "Eco-friendly bamboo journal with a soft-touch cover for notes, prayers, and planning.",
  },
  {
    id: "12",
    title: "Who Will Go Magnetic Bookmark",
    price: 30,
    img: "Who Will Go Products/Accessories/Magnetic Bookmark.png",
    description:
      "Stylish magnetic bookmark that holds your page securely while showcasing mission-driven style.",
  },
  {
    id: "13",
    title: "Crochet Desk Mat",
    price: 155,
    img: "Who Will Go Products/Crochet/Desk-Mat.jpg",
    description:
      "A premium crochet desk mat with a soft, textured surface that protects your workspace and adds a handmade touch.",
  },
  {
    id: "14",
    title: "Crochet Coaster",
    price: 60,
    img: "Who Will Go Products/Crochet/Coaster.jpg",
    description:
      "Handcrafted crochet coaster designed to keep tables dry while adding mission-inspired charm.",
  },
  {
    id: "15",
    title: "Bouquet Keychain (with pouch)",
    price: 155,
    img: "Who Will Go Products/Crochet/Flower Keychain in a pouch.jpg",
    description:
      "A beautiful crochet bouquet keychain with a fabric pouch — perfect for gifting or keeping keys stylish.",
  },
  {
    id: "16",
    title: "Bouquet Keychain",
    price: 130,
    img: "Who Will Go Products/Crochet/Flower Bouquet Keychain.jpg",
    description:
      "Handmade crochet bouquet keychain with delicate detailing for everyday inspiration.",
  },
  {
    id: "17",
    title: "Cake Keychain",
    price: 45,
    img: "Who Will Go Products/Crochet/Cake Keychain.jpg",
    description:
      "A charming crochet cake keychain that adds a playful, handcrafted accent to any set of keys.",
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

function addToCart(id) {
  const product = findProduct(id);
  if (!product) return showToast("Product not found");
  const existing = cart.find((i) => i.id === product.id);
  if (existing) existing.qty += 1;
  else
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      qty: 1,
    });
  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast(`${product.title} added to cart`);
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function setQty(id, value) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  if (value <= 0 || Number.isNaN(value)) {
    return removeCartItem(id);
  }
  item.qty = value;
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function updateCartTotalsForInput(id, value) {
  const item = cart.find((i) => i.id === id);
  if (!item || value <= 0 || Number.isNaN(value)) return;
  const cartItem = document.querySelector(`.qty-input[data-id="${id}"]`);
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
      (current.id === id ? current.price * value : current.price * current.qty)
    );
  }, 0);
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = `PHP ${total.toFixed(2)}`;
}

function removeCartItem(id) {
  cart = cart.filter((i) => i.id !== id);
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
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-meta">
          <div class="qty-controls">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
            <input
              type="number"
              class="qty-input"
              min="1"
              step="1"
              inputmode="numeric"
              pattern="[0-9]*"
              value="${item.qty}"
              data-id="${item.id}"
              aria-label="Quantity for ${item.title}"
            />
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
          <div class="cart-item-price">PHP ${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <button
            class="remove-item-btn"
            type="button"
            data-action="remove"
            data-id="${item.id}"
            aria-label="Remove ${item.title} from cart"
          >
            Remove
          </button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  document.getElementById("cartTotal").textContent = `PHP ${total.toFixed(2)}`;
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
    if (document.body.classList.contains("mobile-preview-mode")) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document
        .querySelectorAll(".nav-menu.active")
        .forEach((menu) => menu.classList.remove("active"));
      const hamburgerBtn = document.querySelector(".hamburger");
      if (hamburgerBtn) hamburgerBtn.classList.remove("active");
    }
  } else {
    sb.classList.remove("open");
    ov.classList.remove("open");
    sb.setAttribute("aria-hidden", "true");
    if (cartButton) cartButton.setAttribute("aria-expanded", "false");
    if (document.body.classList.contains("mobile-preview-mode")) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }
  }
}

/* ==================== PRODUCT MODAL ==================== */
function openProductModal(id) {
  const product = findProduct(id);
  const modal = document.getElementById("productModal");
  if (!modal) return;
  const imageContainer = document.getElementById("productModalImage");
  const title = document.getElementById("productModalTitle");
  const desc = document.getElementById("productModalDescription");
  const price = document.getElementById("productModalPrice");
  const cat = document.getElementById("productModalCategory");
  const addBtn = document.getElementById("productModalAddToCart");

  const subtitle = document.getElementById("productModalSubtitle");

  if (product && imageContainer) {
    if (product.video) {
      imageContainer.innerHTML = `
        <video
          controls
          muted
          autoplay
          loop
          playsinline
          poster="${product.img}"
        >
          <source src="${product.video}" type="video/mp4" />
          <img src="${product.img}" alt="${product.title}" />
        </video>
      `;
      subtitle.textContent = "Mockup preview";
    } else {
      imageContainer.innerHTML = `
        <img src="${product.img}" alt="${product.title}" />
      `;
      subtitle.textContent = "";
    }

    title.textContent = product.title;
    desc.textContent =
      product.description ||
      document.querySelector(
        `.product-card[data-product-id="${id}"] .product-description`,
      )?.textContent ||
      "";
    price.textContent = `PHP ${product.price}`;
    cat.textContent =
      document.querySelector(
        `.product-card[data-product-id="${id}"] .product-category`,
      )?.textContent || "";
    addBtn.dataset.id = product.id;
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
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
    if (t.id === "productModal") closeProductModal();
  }
  if (t.matches(".product-modal-close") || t.closest(".product-modal-close")) {
    closeProductModal();
    return;
  }
  if (t.id === "productModalAddToCart" || t.closest("#productModalAddToCart")) {
    const btn =
      t.id === "productModalAddToCart"
        ? t
        : t.closest("#productModalAddToCart");
    const id = btn.dataset.id;
    addToCart(id);
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
  // Quick view button
  if (t.matches(".view-product") || t.closest(".view-product")) {
    const btn = t.matches(".view-product") ? t : t.closest(".view-product");
    const id = btn.dataset.id;
    openProductModal(id);
    return;
  }
  if (t.matches(".add-to-cart") || t.closest(".add-to-cart")) {
    const btn = t.matches(".add-to-cart") ? t : t.closest(".add-to-cart");
    const id = btn.dataset.id;
    addToCart(id);
    return;
  }

  if (t.id === "cartButton" || t.closest("#cartButton")) {
    toggleCart();
    const cartButton = document.getElementById("cartButton");
    if (cartButton) {
      const isOpen = document
        .getElementById("cartSidebar")
        .classList.contains("open");
      cartButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (document.body.classList.contains("mobile-preview-mode")) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return;
  }

  if (t.id === "closeCart" || t.closest("#closeCart")) {
    toggleCart(false);
    return;
  }

  if (t.id === "clearCart" || t.closest("#clearCart")) {
    clearCart();
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
    const id = btn.dataset.id;
    removeCartItem(id);
    return;
  }

  if (t.matches(".qty-btn") || t.closest(".qty-btn")) {
    const btn = t.matches(".qty-btn") ? t : t.closest(".qty-btn");
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === "inc") changeQty(id, 1);
    if (action === "dec") changeQty(id, -1);
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
  const id = target.dataset.id;
  const quantity = parseInt(target.value, 10);
  if (Number.isFinite(quantity) && quantity > 0) {
    updateCartTotalsForInput(id, quantity);
  }
});

document.addEventListener("change", function (e) {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("qty-input")) return;
  const id = target.dataset.id;
  const quantity = parseInt(target.value, 10);
  if (Number.isFinite(quantity) && quantity > 0) {
    setQty(id, quantity);
  } else {
    removeCartItem(id);
  }
});

/* initialize badge on load */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
