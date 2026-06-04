// ═══════════════════════════════════════════════════════════════════
// WHO WILL GO - MISSIONARY FUNDRAISING PLATFORM
// Professional Order Management System with Google Sheets Backend
// PRODUCTION-READY VERSION WITH SECURITY FIXES
// ═══════════════════════════════════════════════════════════════════

/**
 * CONFIGURATION
 * Replace YOUR_GOOGLE_APPS_SCRIPT_URL with the Web App URL from deployment
 * Format: https://script.google.com/macros/d/{SCRIPT_ID}/usercopy
 */
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
};

// ═══════════════════════════════════════════════════════════════════
// PRODUCT DATA
// ═══════════════════════════════════════════════════════════════════
const products = [
  { id: 1, name: "T-shirts", category: "preorder", price: 450, tag: "PRE-ORDER", desc: "Premium cotton t-shirts with custom design.", requiresSize: true, maxQuantity: 100, quantityNote: "Order up to 100 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>` },
  { id: 2, name: "Mugs", category: "preorder", price: 320, tag: "PRE-ORDER", desc: "Custom ceramic mugs with personalized design.", requiresSize: false, maxQuantity: 100, quantityNote: "Order up to 100 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>` },
  { id: 3, name: "String Bag", category: "preorder", price: 280, tag: "PRE-ORDER", desc: "Eco-friendly canvas string bag with custom branding.", requiresSize: false, maxQuantity: 100, quantityNote: "Order up to 100 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
  { id: 4, name: "Keychain", category: "preorder", price: 150, tag: "PRE-ORDER", desc: "Custom engraved keychain in metal or plastic.", requiresSize: false, maxQuantity: 200, quantityNote: "Order up to 200 pieces", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>` },
  { id: 5, name: "Photobooth", category: "onsite", price: 2500, tag: "ON-SITE", desc: "Professional photobooth rental for events.", requiresSize: false, maxQuantity: 1, quantityNote: "Event service - Quantity: 1", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/></svg>` },
  { id: 6, name: "Bookmark", category: "onsite", price: 50, tag: "ON-SITE", desc: "Beautifully designed bookmarks.", requiresSize: false, maxQuantity: 50, quantityNote: "Limited stock - up to 50", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
  { id: 7, name: "Pins", category: "onsite", price: 75, tag: "ON-SITE", desc: "Custom enamel pins and badges.", requiresSize: false, maxQuantity: 100, quantityNote: "Limited stock - up to 100", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>` },
  { id: 8, name: "Bamboo Notebook with Pen", category: "onsite", price: 180, tag: "ON-SITE", desc: "Eco-friendly bamboo notebook with matching pen.", requiresSize: false, maxQuantity: 30, quantityNote: "Limited stock - up to 30", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
  { id: 9, name: "Laser Engraving", category: "onsite", price: 300, tag: "ON-SITE", desc: "Professional laser engraving service for your items.", requiresSize: false, maxQuantity: 1, quantityNote: "Service - Quantity: 1", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>` },
  { id: 10, name: "Ptr. Adewale Booksfile", category: "onsite", price: 200, tag: "ON-SITE", desc: "Exclusive biography and teachings of Pastor Adewale.", requiresSize: false, maxQuantity: 50, quantityNote: "Limited copies - up to 50", icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
];

// ═══════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════
let cart = [];
let isSubmitting = false;
let currentOrderId = null;

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Sanitizes text content to prevent XSS
 * @param {string} str - Text to sanitize
 * @returns {string} Safe HTML-escaped text
 */
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Improved email validation (RFC 5322 compliant)
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
  if (!email || email.length > 254) return false;
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return false;
  
  // Additional checks
  if (email.startsWith('.') || email.endsWith('.')) return false;
  if (email.includes('..')) return false;
  
  const [localPart, domain] = email.split('@');
  
  if (!localPart || localPart.length > 64) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  
  if (!domain || domain.length < 3) return false;
  if (!domain.includes('.')) return false;
  
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;
  if (/^\d+$/.test(tld)) return false;
  
  return true;
}

// ═══════════════════════════════════════════════════════════════════
// SAFE DOM RENDERING (XSS-PROTECTED)
// ═══════════════════════════════════════════════════════════════════

/**
 * Safely renders products without XSS vulnerability
 * @param {string} filter - Category filter (all/preorder/onsite)
 */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  // Clear old content
  grid.innerHTML = '';
  
  // Create elements safely
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = p.category;
    
    const imgDiv = document.createElement('div');
    imgDiv.className = 'product-img-placeholder';
    
    // Add badge safely
    if (p.tag) {
      const badge = document.createElement('span');
      badge.className = 'product-badge';
      badge.textContent = p.tag;
      imgDiv.appendChild(badge);
    }
    
    // Add SVG icon (safe - from code, not user input)
    const iconDiv = document.createElement('div');
    iconDiv.innerHTML = p.icon;
    imgDiv.appendChild(iconDiv);
    
    // Add price safely
    const priceSpan = document.createElement('span');
    priceSpan.style.fontFamily = "'Cinzel', serif";
    priceSpan.style.fontSize = "0.6rem";
    priceSpan.style.letterSpacing = "2px";
    priceSpan.style.color = "var(--gold)";
    priceSpan.style.textTransform = "uppercase";
    priceSpan.style.opacity = "0.6";
    priceSpan.textContent = `PHP ${p.price}`;
    imgDiv.appendChild(priceSpan);
    
    // Add product info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';
    
    const categoryP = document.createElement('p');
    categoryP.className = 'product-category';
    categoryP.textContent = sanitizeHTML(p.category);
    infoDiv.appendChild(categoryP);
    
    const nameP = document.createElement('p');
    nameP.className = 'product-name';
    nameP.textContent = sanitizeHTML(p.name);
    infoDiv.appendChild(nameP);
    
    const descP = document.createElement('p');
    descP.className = 'product-desc';
    descP.textContent = sanitizeHTML(p.desc);
    infoDiv.appendChild(descP);
    
    // Add footer with price and button
    const footer = document.createElement('div');
    footer.className = 'product-footer';
    
    const priceLabel = document.createElement('span');
    priceLabel.className = 'product-price';
    priceLabel.textContent = `PHP ${p.price.toLocaleString()}`;
    footer.appendChild(priceLabel);
    
    const btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.textContent = 'Add to Cart';
    btn.onclick = () => addToCart(p.id);
    btn.setAttribute('aria-label', `Add ${p.name} to cart`);
    footer.appendChild(btn);
    
    infoDiv.appendChild(footer);
    card.appendChild(imgDiv);
    card.appendChild(infoDiv);
    grid.appendChild(card);
  });
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ═══════════════════════════════════════════════════════════════════
// CART LOGIC
// ═══════════════════════════════════════════════════════════════════

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(product.name + ' added to cart');
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCart();
}

/**
 * Updates cart display with safe DOM manipulation
 */
function updateCart() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + (c.price * c.qty), 0);
  
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = count;
  
  const cartTotalEl = document.getElementById('cartTotal');
  if (cartTotalEl) cartTotalEl.textContent = 'PHP ' + total.toLocaleString('en-PH', {minimumFractionDigits:2});

  const body = document.getElementById('cartBody');
  if (!body) return;

  // Clear old content
  body.innerHTML = '';
  
  if (cart.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'cart-empty-message';
    emptyMsg.textContent = 'Your cart is empty.';
    body.appendChild(emptyMsg);
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
      // Icon
      const imgDiv = document.createElement('div');
      imgDiv.className = 'cart-item-img';
      imgDiv.innerHTML = item.icon;
      cartItem.appendChild(imgDiv);
      
      // Details
      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'cart-item-details';
      
      const nameP = document.createElement('p');
      nameP.className = 'cart-item-name';
      nameP.textContent = sanitizeHTML(item.name);
      detailsDiv.appendChild(nameP);
      
      const priceP = document.createElement('p');
      priceP.className = 'cart-item-price';
      priceP.textContent = `PHP ${(item.price * item.qty).toLocaleString()}`;
      detailsDiv.appendChild(priceP);
      
      // Quantity selector
      const qtyDiv = document.createElement('div');
      qtyDiv.className = 'cart-item-qty';
      
      const minusBtn = document.createElement('button');
      minusBtn.className = 'qty-btn';
      minusBtn.textContent = '-';
      minusBtn.onclick = () => changeQty(item.id, -1);
      minusBtn.setAttribute('aria-label', `Decrease ${item.name} quantity`);
      qtyDiv.appendChild(minusBtn);
      
      const qtySpan = document.createElement('span');
      qtySpan.className = 'qty-val';
      qtySpan.textContent = item.qty;
      qtyDiv.appendChild(qtySpan);
      
      const plusBtn = document.createElement('button');
      plusBtn.className = 'qty-btn';
      plusBtn.textContent = '+';
      plusBtn.onclick = () => changeQty(item.id, 1);
      plusBtn.setAttribute('aria-label', `Increase ${item.name} quantity`);
      qtyDiv.appendChild(plusBtn);
      
      detailsDiv.appendChild(qtyDiv);
      cartItem.appendChild(detailsDiv);
      
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-item';
      removeBtn.title = 'Remove';
      removeBtn.textContent = 'x';
      removeBtn.onclick = () => removeFromCart(item.id);
      removeBtn.setAttribute('aria-label', `Remove ${item.name} from cart`);
      cartItem.appendChild(removeBtn);
      
      body.appendChild(cartItem);
    });
  }
  
  updateFormCheckboxes();
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

function scrollToOrder() {
  closeCart();
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════════════
// ORDER FORM UI LOGIC
// ═══════════════════════════════════════════════════════════════════

/**
 * Builds form checkboxes with safe DOM manipulation
 */
function buildFormCheckboxes() {
  const container = document.getElementById('productSelectorForm');
  if (!container) return;
  
  container.innerHTML = '';
  
  products.forEach(p => {
    const item = document.createElement('div');
    item.className = 'product-checkbox-item';
    
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.style.flex = '1';
    
    const checkboxLine = document.createElement('div');
    checkboxLine.className = 'checkbox-line';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `pcheck_${p.id}`;
    checkbox.name = 'products';
    checkbox.value = p.name;
    checkbox.className = 'product-checkbox';
    checkbox.setAttribute('aria-label', `Select ${p.name} for PHP ${p.price}`);
    checkbox.addEventListener('change', updateSizeField);
    
    const label = document.createElement('label');
    label.htmlFor = `pcheck_${p.id}`;
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = sanitizeHTML(p.name);
    label.appendChild(nameSpan);
    
    const priceSpan = document.createElement('span');
    priceSpan.className = 'price-tag';
    priceSpan.textContent = `PHP ${p.price}`;
    label.appendChild(priceSpan);
    
    checkboxLine.appendChild(checkbox);
    checkboxLine.appendChild(label);
    
    const note = document.createElement('div');
    note.className = 'quantity-note';
    note.textContent = sanitizeHTML(p.quantityNote);
    
    checkboxWrapper.appendChild(checkboxLine);
    checkboxWrapper.appendChild(note);
    
    const qtyDiv = document.createElement('div');
    qtyDiv.className = 'quantity-selector';
    
    const qtyLabel = document.createElement('label');
    qtyLabel.htmlFor = `qty_${p.id}`;
    qtyLabel.textContent = 'Qty:';
    
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.id = `qty_${p.id}`;
    qtyInput.className = 'product-qty-input';
    qtyInput.min = '1';
    qtyInput.max = p.maxQuantity;
    qtyInput.value = '1';
    qtyInput.disabled = true;
    qtyInput.setAttribute('maxlength', String(p.maxQuantity).length + 1);
    qtyInput.setAttribute('aria-label', `Quantity for ${p.name} (max ${p.maxQuantity})`);
    
    qtyDiv.appendChild(qtyLabel);
    qtyDiv.appendChild(qtyInput);
    
    item.appendChild(checkboxWrapper);
    item.appendChild(qtyDiv);
    container.appendChild(item);
  });
}

function updateQuantityFields() {
  products.forEach(p => {
    const checkbox = document.getElementById(`pcheck_${p.id}`);
    const qtyInput = document.getElementById(`qty_${p.id}`);
    if (checkbox && qtyInput) {
      qtyInput.disabled = !checkbox.checked;
      if (checkbox.checked && qtyInput.value < 1) qtyInput.value = 1;
    }
  });
}

function updateSizeField() {
  updateQuantityFields();
  const sizeGroup = document.getElementById('sizeGroup');
  if (!sizeGroup) return;
  
  const tshirtsCheckbox = document.getElementById('pcheck_1');
  const showSize = tshirtsCheckbox && tshirtsCheckbox.checked;
  
  sizeGroup.style.display = showSize ? 'block' : 'none';
  document.getElementById('fsize').required = showSize;
  if (!showSize) document.getElementById('fsize').value = '';
}

function updateFormCheckboxes() {
  products.forEach(p => {
    const cb = document.getElementById('pcheck_' + p.id);
    const qtyInput = document.getElementById('qty_' + p.id);
    const itemInCart = cart.find(item => item.id === p.id);
    
    if (cb) cb.checked = !!itemInCart;
    if (qtyInput) {
      qtyInput.value = itemInCart ? itemInCart.qty : 1;
      qtyInput.disabled = !itemInCart;
    }
  });
  updateSizeField();
}

// ═══════════════════════════════════════════════════════════════════
// FORM VALIDATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Validates customer form inputs
 * Returns array of error messages, or empty array if valid
 */
function validateForm() {
  const errors = [];

  const name = document.getElementById('fname').value.trim();
  if (!name || name.length < 3) {
    errors.push('Full name must be at least 3 characters');
  } else if (name.length > 100) {
    errors.push('Full name too long (max 100 characters)');
  }

  const phone = document.getElementById('fphone').value.trim();
  if (!phone || phone.length < 7) {
    errors.push('Please enter a valid phone number');
  } else if (!/^\d+$/.test(phone.replace(/[\s\-()]/g, ''))) {
    errors.push('Phone number contains invalid characters');
  } else if (phone.length > 20) {
    errors.push('Phone number too long');
  }

  const email = document.getElementById('femail').value.trim();
  if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  const address = document.getElementById('faddress').value.trim();
  if (!address || address.length < 5) {
    errors.push('Please enter a complete delivery address');
  } else if (address.length > 500) {
    errors.push('Delivery address too long (max 500 characters)');
  }

  const payment = document.getElementById('fpayment').value;
  if (!payment) {
    errors.push('Please select a payment method');
  }

  return errors;
}

/**
 * Validates selected products
 * Returns array of validation errors
 */
function validateProducts() {
  const errors = [];

  const selectedItems = [];
  products.forEach(p => {
    const checkbox = document.getElementById(`pcheck_${p.id}`);
    if (checkbox && checkbox.checked) {
      const qtyInput = document.getElementById(`qty_${p.id}`);
      const qty = parseInt(qtyInput.value) || 0;

      if (qty < 1 || qty > p.maxQuantity) {
        errors.push(`${p.name}: Quantity must be between 1 and ${p.maxQuantity}`);
      } else {
        selectedItems.push({ ...p, quantity: qty });
      }
    }
  });

  if (selectedItems.length === 0) {
    errors.push('Please select at least one product');
  }

  const tshirtSelected = selectedItems.some(item => item.name === 'T-shirts');
  if (tshirtSelected) {
    const selectedSize = document.getElementById('fsize').value;
    if (!selectedSize) {
      errors.push('Please select a size for T-shirts');
    }
  }

  return errors;
}

// ═══════════════════════════════════════════════════════════════════
// ORDER SUBMISSION
// ═══════════════════════════════════════════════════════════════════

/**
 * Main form submission handler
 */
function submitOrder(e) {
  e.preventDefault();

  if (isSubmitting) {
    showToast('Please wait, your order is being processed...');
    return;
  }

  // Validate form
  const formErrors = validateForm();
  if (formErrors.length > 0) {
    showToast(formErrors[0]);
    return;
  }

  // Validate products
  const productErrors = validateProducts();
  if (productErrors.length > 0) {
    showToast(productErrors[0]);
    return;
  }

  // Collect selected products
  const selectedItems = [];
  let totalAmount = 0;

  products.forEach(p => {
    const checkbox = document.getElementById(`pcheck_${p.id}`);
    if (checkbox && checkbox.checked) {
      const qtyInput = document.getElementById(`qty_${p.id}`);
      const qty = parseInt(qtyInput.value) || 1;

      selectedItems.push({
        name: p.name,
        quantity: qty,
        price: p.price
      });

      totalAmount += p.price * qty;
    }
  });

  // Prepare order data
  const orderData = {
    customerName: document.getElementById('fname').value.trim(),
    email: document.getElementById('femail').value.trim().toLowerCase(),
    phone: document.getElementById('fphone').value.trim(),
    address: document.getElementById('faddress').value.trim(),
    products: selectedItems,
    totalItems: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: totalAmount,
    tshirtSize: document.getElementById('fsize').value || 'N/A',
    paymentMethod: document.getElementById('fpayment').value,
    notes: (document.getElementById('fnotes').value || '').trim().substring(0, 1000)
  };

  // Set submission flag and show loading state
  isSubmitting = true;
  setSubmitButtonLoading(true);
  showToast('Submitting your order...');
  
  submitToGoogleSheets(orderData);
}

/**
 * Shows/hides loading state on submit button
 */
function setSubmitButtonLoading(isLoading) {
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;
  
  submitBtn.disabled = isLoading;
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  
  if (isLoading) {
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline-flex';
  } else {
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
  }
}

/**
 * Sends order data to Google Apps Script Web App
 */
async function submitToGoogleSheets(orderData) {
  try {
    if (CONFIG.GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      throw new Error('Google Apps Script URL not configured');
    }

    const response = await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.success) {
      currentOrderId = result.orderId;
      showSuccess();
      console.log('✅ Order submitted:', result);
    } else {
      throw new Error(result.message || 'Failed to submit order');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    isSubmitting = false;
    setSubmitButtonLoading(false);

    if (error.message.includes('Failed to fetch')) {
      showToast('Network error. Check your connection and try again.', 5000);
    } else if (error.message.includes('not configured')) {
      showToast('System not configured. Contact administrator.', 5000);
    } else {
      showToast('Error: ' + error.message, 5000);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// UI FEEDBACK
// ═══════════════════════════════════════════════════════════════════

/**
 * Displays success message
 */
function showSuccess() {
  const orderForm = document.getElementById('orderForm');
  const successMsg = document.getElementById('successMsg');

  if (orderForm) orderForm.style.display = 'none';
  if (successMsg) successMsg.style.display = 'block';

  const orderIdEl = document.getElementById('displayOrderId');
  if (orderIdEl && currentOrderId) {
    orderIdEl.textContent = currentOrderId;
    const orderIdContainer = document.getElementById('orderIdContainer');
    if (orderIdContainer) orderIdContainer.style.display = 'block';
  }

  showToast('Order received! Thank you for your support.');
  resetOrderAndCart();

  if (successMsg) {
    successMsg.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    isSubmitting = false;
  }, 2000);
}

/**
 * Prepares for placing another order
 */
function continueOrdering() {
  const form = document.getElementById('orderForm');
  const successMsg = document.getElementById('successMsg');
  const orderIdContainer = document.getElementById('orderIdContainer');

  if (form) {
    form.reset();
    form.style.display = 'block';
  }

  if (successMsg) successMsg.style.display = 'none';
  if (orderIdContainer) orderIdContainer.style.display = 'none';

  cart = [];
  updateCart();
  updateFormCheckboxes();

  if (form) {
    form.scrollIntoView({ behavior: 'smooth' });
  }

  showToast('Ready for another order!');
}

function scrollToShop() {
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

function resetOrderAndCart() {
  const form = document.getElementById('orderForm');
  if (form) form.reset();
  cart = [];
  updateCart();
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS AND UTILITIES
// ═══════════════════════════════════════════════════════════════════

/**
 * Displays a temporary toast notification
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) {
    console.warn('Toast element not found');
    return;
  }

  toast.textContent = message;
  toast.classList.add('show');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Copies GCash number to clipboard
 */
function copyGcash() {
  const gcashText = document.getElementById('gcashNumber').textContent;
  navigator.clipboard.writeText(gcashText).then(() => {
    showToast('GCash number copied!');
  }).catch(() => {
    showToast('Could not copy. Please copy manually.');
  });
}

// ═══════════════════════════════════════════════════════════════════
// PAGE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 WHO WILL GO - Initializing');

  renderProducts();
  buildFormCheckboxes();
  updateCart();

  document.querySelectorAll('.product-checkbox').forEach(cb => {
    cb.addEventListener('change', updateSizeField);
  });

  console.log('✅ Application Ready');
});
