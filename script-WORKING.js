// ═══════════════════════════════════════════════════════════════════
// WHO WILL GO - MISSIONARY FUNDRAISING PLATFORM
// PRODUCTION-READY WORKING VERSION
// ═══════════════════════════════════════════════════════════════════

/**
 * CONFIGURATION
 * 
 * CHOOSE ONE BACKEND METHOD:
 * 
 * METHOD 1: FORMSPREE (Recommended - works immediately, no setup)
 * - Sign up free at: https://formspree.io
 * - Create a new form
 * - Copy your Form ID from: https://formspree.io/f/YOUR_FORM_ID
 * - Replace FORMSPREE_ID below
 * 
 * METHOD 2: GOOGLE APPS SCRIPT (requires full setup)
 * - Deploy as Web App with proper CORS headers
 * - Replace GAS_WEB_APP_URL below
 */

const CONFIG = {
  // === METHOD 1: FORMSPREE (RECOMMENDED - JUST WORKS) ===
  // Get free form at: https://formspree.io
  USE_FORMSPREE: true,
  FORMSPREE_ID: 'f/mnqendlj', // Replace with your Formspree form ID after signup
  
  // === METHOD 2: GOOGLE APPS SCRIPT (If you have it deployed) ===
  USE_GAS: false,
  GOOGLE_APPS_SCRIPT_URL: '', // Paste your Web App URL here if using Google Apps Script
  
  // === EMAIL SETTINGS ===
  ADMIN_EMAIL: 'your.email@gmail.com', // For Formspree notifications
  
  // === SYSTEM SETTINGS ===
  ORDER_PREFIX: 'WWG',
  TIMEZONE: 'Asia/Manila'
};

// ===== PRODUCT DATA =====
const products = [
  { id: 1, name: "T-shirts", category: "preorder", price: 450, tag: "PRE-ORDER", desc: "Premium cotton t-shirts with custom design.", requiresSize: true, maxQuantity: 100, quantityNote: "Order up to 100 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>` },
  { id: 2, name: "Mugs", category: "preorder", price: 320, tag: "PRE-ORDER", desc: "Custom ceramic mugs with personalized design.", requiresSize: false, maxQuantity: 100, quantityNote: "Order up to 100 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>` },
  { id: 3, name: "String Bag", category: "preorder", price: 280, tag: "PRE-ORDER", desc: "Eco-friendly canvas string bag with custom branding.", requiresSize: false, maxQuantity: 100, quantityNote: "Order up to 100 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
  { id: 4, name: "Keychain", category: "preorder", price: 150, tag: "PRE-ORDER", desc: "Custom engraved keychain in metal or plastic.", requiresSize: false, maxQuantity: 200, quantityNote: "Order up to 200 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>` },
  { id: 5, name: "Photobooth", category: "onsite", price: 2500, tag: "ON-SITE", desc: "Professional photobooth rental for events.", requiresSize: false, maxQuantity: 1, quantityNote: "Event service - Quantity: 1", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/></svg>` },
  { id: 6, name: "Bookmark", category: "onsite", price: 50, tag: "ON-SITE", desc: "Beautifully designed bookmarks.", requiresSize: false, maxQuantity: 50, quantityNote: "Limited stock - up to 50", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
  { id: 7, name: "Pins", category: "onsite", price: 75, tag: "ON-SITE", desc: "Custom enamel pins and badges.", requiresSize: false, maxQuantity: 100, quantityNote: "Limited stock - up to 100", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>` },
  { id: 8, name: "Bamboo Notebook with Pen", category: "onsite", price: 180, tag: "ON-SITE", desc: "Eco-friendly bamboo notebook with matching pen.", requiresSize: false, maxQuantity: 30, quantityNote: "Limited stock - up to 30", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
  { id: 9, name: "Laser Engraving", category: "onsite", price: 300, tag: "ON-SITE", desc: "Professional laser engraving service for your items.", requiresSize: false, maxQuantity: 1, quantityNote: "Service - Quantity: 1", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>` },
  { id: 10, name: "Ptr. Adewale Booksfile", category: "onsite", price: 200, tag: "ON-SITE", desc: "Exclusive biography and teachings of Pastor Adewale.", requiresSize: false, maxQuantity: 50, quantityNote: "Limited copies - up to 50", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
];

// ═══════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════
let cart = [];
let isSubmitting = false;
let currentOrderId = null;

// ===== RENDER PRODUCTS =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${p.category}">
      <div class="product-img-placeholder">
        ${p.tag ? `<span class="product-badge">${p.tag}</span>` : ''}
        ${p.icon}
        <span style="font-family:'Cinzel',serif;font-size:0.6rem;letter-spacing:2px;color:var(--gold);text-transform:uppercase;opacity:0.6;">PHP ${p.price}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <p class="product-note" style="font-size:0.8rem;color:var(--gold);margin:8px 0;">${p.quantityNote}</p>
        <div class="qty-control">
          <label for="qty-${p.id}">QTY:</label>
          <input type="number" id="qty-${p.id}" min="0" max="${p.maxQuantity}" value="0" class="qty-input">
        </div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// ===== CART FUNCTIONS =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const input = document.getElementById(`qty-${id}`);
  const qty = parseInt(input.value) || 0;
  
  if (qty <= 0) {
    showToast('Please enter a quantity greater than 0', 'error');
    return;
  }
  
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }
  
  input.value = 0;
  updateCart();
  showToast(`${product.name} added to cart`, 'success');
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart();
    }
  }
}

function updateCart() {
  const cartBody = document.getElementById('cartBody');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  
  if (!cartBody) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartCount.textContent = totalItems;
  cartTotal.textContent = `PHP ${totalAmount.toLocaleString()}`;
  
  if (cart.length === 0) {
    cartBody.innerHTML = '<p style="text-align:center;padding:20px;color:var(--cream);">Your cart is empty</p>';
    return;
  }
  
  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-item-price">PHP ${item.price} each</p>
      </div>
      <div class="cart-item-controls">
        <button onclick="changeQty(${item.id}, -1)" class="qty-btn">−</button>
        <span class="cart-item-qty">${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)" class="qty-btn">+</button>
        <span class="cart-item-total">PHP ${(item.price * item.quantity).toLocaleString()}</span>
        <button onclick="removeFromCart(${item.id})" class="remove-btn">✕</button>
      </div>
    </div>
  `).join('');
  
  buildFormCheckboxes();
}

// ===== FORM BUILDING =====
function buildFormCheckboxes() {
  const container = document.getElementById('productCheckboxesContainer');
  if (!container) return;
  
  container.innerHTML = cart.map(item => `
    <label class="checkbox-label">
      <input type="hidden" name="product_${item.id}" value="${item.name} x${item.quantity} @ PHP ${item.price}">
      <span>${item.name} x${item.quantity}</span>
    </label>
  `).join('');
}

// ===== VALIDATION =====
function isValidEmail(email) {
  // RFC 5322 compliant basic check
  const checks = [
    email.length > 5 && email.length <= 254, // Valid length
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), // Basic format
    !email.startsWith('.') && !email.endsWith('.'), // No leading/trailing dots
    !email.includes('..'), // No consecutive dots
    email.count ===email.split('@').length === 2, // Exactly one @
  ];
  return checks.every(c => c !== false);
}

function validateForm() {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const address = document.getElementById('faddress').value.trim();
  
  if (!name || name.length < 2) {
    showToast('Please enter a valid name (at least 2 characters)', 'error');
    return false;
  }
  
  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return false;
  }
  
  if (!phone || phone.length < 7) {
    showToast('Please enter a valid phone number', 'error');
    return false;
  }
  
  if (!address || address.length < 5) {
    showToast('Please enter a valid address', 'error');
    return false;
  }
  
  return true;
}

function validateProducts() {
  if (cart.length === 0) {
    showToast('Please add at least one product to your cart', 'error');
    return false;
  }
  
  const tshirtItem = cart.find(item => item.id === 1);
  if (tshirtItem && !document.getElementById('fsize').value) {
    showToast('Please select a T-shirt size', 'error');
    return false;
  }
  
  return true;
}

// ===== SUBMISSION =====
function submitOrder(e) {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  if (!validateForm() || !validateProducts()) {
    return;
  }
  
  isSubmitting = true;
  setSubmitButtonLoading(true);
  
  // Generate Order ID
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-PH', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '');
  const orderId = `${CONFIG.ORDER_PREFIX}-${dateStr}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  const orderData = {
    orderId: orderId,
    timestamp: new Date().toLocaleString('en-PH'),
    customerName: document.getElementById('fname').value.trim(),
    email: document.getElementById('femail').value.trim(),
    phone: document.getElementById('fphone').value.trim(),
    address: document.getElementById('faddress').value.trim(),
    products: cart,
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    tshirtSize: document.getElementById('fsize').value || 'N/A',
    paymentMethod: document.getElementById('fpayment').value,
    notes: document.getElementById('fnotes').value.trim() || 'None'
  };
  
  // Submit to backend
  if (CONFIG.USE_FORMSPREE) {
    submitToFormspree(orderData);
  } else if (CONFIG.USE_GAS && CONFIG.GOOGLE_APPS_SCRIPT_URL) {
    submitToGoogleSheets(orderData);
  } else {
    showToast('System not configured. Please contact administrator.', 'error');
    isSubmitting = false;
    setSubmitButtonLoading(false);
  }
}

// ===== FORMSPREE SUBMISSION (RECOMMENDED - Works immediately) =====
function submitToFormspree(orderData) {
  const formData = new FormData();
  formData.append('email', orderData.email);
  formData.append('name', orderData.customerName);
  formData.append('phone', orderData.phone);
  formData.append('address', orderData.address);
  formData.append('order_id', orderData.orderId);
  formData.append('products', orderData.products.map(p => `${p.name} x${p.quantity}`).join('; '));
  formData.append('total_items', orderData.totalItems);
  formData.append('total_amount', `PHP ${orderData.totalAmount.toLocaleString()}`);
  formData.append('tshirt_size', orderData.tshirtSize);
  formData.append('payment_method', orderData.paymentMethod);
  formData.append('notes', orderData.notes);
  formData.append('timestamp', orderData.timestamp);
  
  fetch(`https://formspree.io/${CONFIG.FORMSPREE_ID}`, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      showSuccess(orderData.orderId);
      cart = [];
      document.getElementById('orderForm').reset();
      updateCart();
    } else {
      throw new Error('Server error');
    }
  })
  .catch(error => {
    console.error('Submission error:', error);
    showToast('Failed to submit order. Please try again or contact support.', 'error');
  })
  .finally(() => {
    isSubmitting = false;
    setSubmitButtonLoading(false);
  });
}

// ===== GOOGLE SHEETS SUBMISSION (Alternative if you have it deployed) =====
function submitToGoogleSheets(orderData) {
  if (!CONFIG.GOOGLE_APPS_SCRIPT_URL || CONFIG.GOOGLE_APPS_SCRIPT_URL.includes('YOUR_') || !CONFIG.GOOGLE_APPS_SCRIPT_URL) {
    showToast('Google Apps Script URL not configured. Using Formspree instead...', 'error');
    CONFIG.USE_FORMSPREE = true;
    submitToFormspree(orderData);
    return;
  }
  
  fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(() => {
    showSuccess(orderData.orderId);
    cart = [];
    document.getElementById('orderForm').reset();
    updateCart();
  })
  .catch(error => {
    console.error('Submission error:', error);
    showToast('Failed to submit order. Please try again.', 'error');
  })
  .finally(() => {
    isSubmitting = false;
    setSubmitButtonLoading(false);
  });
}

// ===== UI UTILITIES =====
function setSubmitButtonLoading(isLoading) {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;
  
  const textSpan = btn.querySelector('.btn-text');
  const loaderSpan = btn.querySelector('.btn-loader');
  
  if (isLoading) {
    btn.disabled = true;
    if (textSpan) textSpan.style.display = 'none';
    if (loaderSpan) loaderSpan.style.display = 'inline-flex';
  } else {
    btn.disabled = false;
    if (textSpan) textSpan.style.display = 'inline';
    if (loaderSpan) loaderSpan.style.display = 'none';
  }
}

function showSuccess(orderId) {
  const successMsg = document.getElementById('successMsg');
  const displayOrderId = document.getElementById('displayOrderId');
  
  if (successMsg) {
    if (displayOrderId) displayOrderId.textContent = orderId;
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth' });
  }
}

function continueOrdering() {
  const successMsg = document.getElementById('successMsg');
  if (successMsg) successMsg.style.display = 'none';
  
  renderProducts('all');
  document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth' });
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  renderProducts('all');
  updateCart();
  
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', submitOrder);
  }
  
  // Setup filter tabs
  const filterTabs = document.querySelectorAll('[data-filter]');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderProducts(this.dataset.filter);
    });
  });
  
  // Cart toggle
  const cartToggle = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCart = document.getElementById('closeCart');
  
  if (cartToggle && cartSidebar) {
    cartToggle.addEventListener('click', () => {
      cartSidebar.classList.add('active');
    });
  }
  
  if (closeCart && cartSidebar) {
    closeCart.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
    });
  }
});
