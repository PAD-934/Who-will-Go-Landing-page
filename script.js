// ═══════════════════════════════════════════════════════════════════
// WHO WILL GO - MISSIONARY FUNDRAISING PLATFORM
// Professional Order Management System with Google Sheets Backend
// ═══════════════════════════════════════════════════════════════════

/**
 * CONFIGURATION
 * 
 * METHOD 1: FORMSPREE (RECOMMENDED - Works immediately, no setup needed)
 * - Sign up free at: https://formspree.io
 * - Create a new form
 * - Copy your Form ID: https://formspree.io/f/YOUR_FORM_ID
 * - Paste the ID below in FORMSPREE_ID
 * 
 * METHOD 2: GOOGLE APPS SCRIPT (Alternative, requires setup)
 * - Deploy as Web App with "Execute as" = your account, "Who has access" = Anyone
 * - Paste URL below in GOOGLE_APPS_SCRIPT_URL
 */
const CONFIG = {
  // === METHOD 1: FORMSPREE (Recommended - works from file:// and everywhere) ===
  USE_FORMSPREE: true,
  FORMSPREE_ID: 'f/xdavovgv', // ⚠️ IMPORTANT: Must include 'f/' prefix! Format: 'f/yourformid'
  
  // === METHOD 2: GOOGLE APPS SCRIPT (if you have it deployed) ===
  USE_GAS: false,
  GOOGLE_APPS_SCRIPT_URL: '', // Paste Web App URL here if using Google Apps Script
  
  // System settings
  ORDER_PREFIX: 'WWG'
};

// ===== PRODUCT DATA =====
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
        <p class="product-category">${p.category}</p>
        <p class="product-name">${p.name}</p>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">PHP ${p.price.toLocaleString()}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>`).join('');
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ===== CART LOGIC =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
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

function updateCart() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + (c.price * c.qty), 0);
  
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = count;
  
  const cartTotalEl = document.getElementById('cartTotal');
  if (cartTotalEl) cartTotalEl.textContent = 'PHP ' + total.toLocaleString('en-PH', {minimumFractionDigits:2});

  const body = document.getElementById('cartBody');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<div id="cartEmpty" class="cart-empty-message">Your cart is empty.</div>';
  } else {
    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.icon}</div>
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">PHP ${(item.price * item.qty).toLocaleString()}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">x</button>
      </div>`).join('');
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

// ===== ORDER FORM UI LOGIC =====
function buildFormCheckboxes() {
  const container = document.getElementById('productSelectorForm');
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product-checkbox-item">
      <div style="flex:1;">
        <div class="checkbox-line">
          <input type="checkbox" id="pcheck_${p.id}" name="products" value="${p.name}" class="product-checkbox" onchange="updateSizeField()"/>
          <label for="pcheck_${p.id}">
            <span>${p.name}</span>
            <span class="price-tag">PHP ${p.price}</span>
          </label>
        </div>
        <div class="quantity-note">${p.quantityNote}</div>
      </div>
      <div class="quantity-selector">
        <label for="qty_${p.id}">Qty:</label>
        <input type="number" id="qty_${p.id}" class="product-qty-input" min="1" max="${p.maxQuantity}" value="1" disabled/>
      </div>
    </div>`).join('');
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

// ===== SUBMIT ORDER =====
/**
 * Main form submission handler
 * Validates and sends order to Google Apps Script backend
 */
function submitOrder(e) {
  e.preventDefault();

  // Prevent double submission
  if (isSubmitting) {
    showToast('Please wait, your order is being processed...');
    return;
  }

  // Validate form fields
  const formErrors = validateForm();
  if (formErrors.length > 0) {
    showToast(formErrors[0]);
    return;
  }

  // Validate product selection and quantities
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
    notes: document.getElementById('fnotes').value.trim()
  };

  // Set submission flag and send to backend
  isSubmitting = true;
  showToast('Submitting your order...');
  submitToGoogleSheets(orderData);
}

/**
 * Validates customer form inputs
 * Returns array of error messages, or empty array if valid
 */
function validateForm() {
  const errors = [];

  // Validate name
  const name = document.getElementById('fname').value.trim();
  if (!name || name.length < 3) {
    errors.push('Full name must be at least 3 characters');
  }

  // Validate phone
  const phone = document.getElementById('fphone').value.trim();
  if (!phone || phone.length < 7) {
    errors.push('Please enter a valid phone number');
  }

  // Validate email
  const email = document.getElementById('femail').value.trim();
  if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  // Validate address
  const address = document.getElementById('faddress').value.trim();
  if (!address || address.length < 5) {
    errors.push('Please enter a complete delivery address');
  }

  // Validate payment method
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

  // Validate T-shirts size if selected
  const tshirtSelected = selectedItems.some(item => item.name === 'T-shirts');
  if (tshirtSelected) {
    const selectedSize = document.getElementById('fsize').value;
    if (!selectedSize) {
      errors.push('Please select a size for T-shirts');
    }
  }

  return errors;
}

/**
 * Simple email validation using regex
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Sends order data to backend (Formspree or Google Apps Script)
 * Handles both methods seamlessly
 */
async function submitToGoogleSheets(orderData) {
  try {
    if (CONFIG.USE_FORMSPREE) {
      // Method 1: FORMSPREE (Recommended)
      submitToFormspree(orderData);
    } else if (CONFIG.USE_GAS && CONFIG.GOOGLE_APPS_SCRIPT_URL) {
      // Method 2: GOOGLE APPS SCRIPT
      submitToGAS(orderData);
    } else {
      // Fallback to Formspree if nothing configured
      CONFIG.USE_FORMSPREE = true;
      submitToFormspree(orderData);
    }
  } catch (error) {
    console.error('❌ Submission error:', error);
    isSubmitting = false;
    showToast('Error: ' + error.message);
  }
}

/**
 * PROFESSIONAL SENIOR-LEVEL: Submit to Formspree with comprehensive error handling
 * - Validates all inputs
 * - Handles network errors gracefully
 * - Ensures Order ID displays properly
 * - Provides detailed logging for debugging
 * - Works from file:// and GitHub Pages
 */
function submitToFormspree(orderData) {
  console.log('═════════════════════════════════════════════════════════════');
  console.log('🚀 FORMSPREE SUBMISSION INITIATED');
  console.log('═════════════════════════════════════════════════════════════');
  
  // STEP 1: VALIDATE CONFIGURATION
  if (!CONFIG.FORMSPREE_ID) {
    console.error('❌ CRITICAL: FORMSPREE_ID is not configured.');
    isSubmitting = false;
    showToast('Configuration Error: Please contact administrator.');
    return;
  }

  // STEP 2: NORMALIZE FORMSPREE ID
  let formId = CONFIG.FORMSPREE_ID.trim();
  if (!formId.startsWith('f/')) {
    console.warn('⚠️  Auto-fixing Formspree ID format: Adding f/ prefix');
    formId = 'f/' + formId;
  }

  // STEP 3: BUILD ENDPOINT
  const endpointUrl = `https://formspree.io/${formId}`;
  console.log('📡 Formspree Endpoint:', endpointUrl);
  
  // STEP 4: GENERATE ORDER ID (do this BEFORE attempting submission)
  const generatedOrderId = 'WWG-' + 
    new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + 
    Math.floor(Math.random()*1000000).toString().padStart(6,'0');
  
  console.log('📋 Generated Order ID:', generatedOrderId);
  
  // STEP 5: STORE ORDER ID IMMEDIATELY (don't wait for Formspree response)
  currentOrderId = generatedOrderId;
  
  // STEP 6: PREPARE FORM DATA (Formspree-compatible format)
  const formData = new FormData();
  
  // Email is CRITICAL - Formspree needs this to send the email
  formData.append('email', orderData.email);
  
  // These fields will appear in the email Formspree sends to you
  formData.append('_subject', `New Order from ${orderData.customerName} - ID: ${generatedOrderId}`);
  formData.append('_reply_to', orderData.email);
  
  // Order details
  formData.append('name', orderData.customerName);
  formData.append('phone', orderData.phone);
  formData.append('address', orderData.address);
  formData.append('order_id', generatedOrderId);
  formData.append('products', orderData.products.map(p => `${p.name} (Qty: ${p.quantity})`).join(' | '));
  formData.append('total_items', orderData.totalItems);
  formData.append('total_amount', `PHP ${orderData.totalAmount.toLocaleString()}`);
  
  if (orderData.tshirtSize && orderData.tshirtSize !== 'N/A') {
    formData.append('tshirt_size', orderData.tshirtSize);
  }
  
  formData.append('payment_method', orderData.paymentMethod);
  
  if (orderData.notes && orderData.notes.trim()) {
    formData.append('notes', orderData.notes);
  }
  
  formData.append('submission_time', new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }));
  
  // Debug logging
  console.log('✅ Form data prepared:', {
    email: orderData.email,
    customer: orderData.customerName,
    phone: orderData.phone,
    items: orderData.products.length,
    total: `PHP ${orderData.totalAmount}`,
    order_id: generatedOrderId
  });
  
  // STEP 7: SUBMIT TO FORMSPREE
  console.log('📤 Sending form data to Formspree...');
  
  fetch(endpointUrl, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Who-Will-Go-Order-Form/1.0'
    }
  })
  .then(response => {
    console.log('📞 Formspree Response Received');
    console.log('   Status:', response.status, response.statusText);
    console.log('   Headers:', {
      'content-type': response.headers.get('content-type'),
      'server': response.headers.get('server')
    });
    
    if (response.ok) {
      console.log('✅ SUCCESS: Order submitted to Formspree');
      console.log('✅ Order ID:', generatedOrderId);
      console.log('✅ Email will be sent to:', orderData.email);
      showSuccess();
    } else if (response.status === 400) {
      throw new Error('Invalid Formspree form ID or data format. Check CONFIG.FORMSPREE_ID.');
    } else if (response.status === 401) {
      throw new Error('Formspree authentication failed. Invalid form ID.');
    } else if (response.status === 429) {
      throw new Error('Rate limited. Please wait 60 seconds before trying again.');
    } else if (response.status === 503) {
      throw new Error('Formspree service temporarily unavailable. Try again in a moment.');
    } else {
      throw new Error(`Formspree error: ${response.status} ${response.statusText}`);
    }
  })
  .catch(error => {
    console.error('═════════════════════════════════════════════════════════════');
    console.error('❌ FORMSPREE SUBMISSION FAILED');
    console.error('═════════════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('Endpoint:', endpointUrl);
    console.error('Form ID:', CONFIG.FORMSPREE_ID);
    console.error('Customer Email:', orderData.email);
    console.error('═════════════════════════════════════════════════════════════');
    console.error('DEBUGGING STEPS:');
    console.error('1. Verify FORMSPREE_ID is correct: f/xdavovgv');
    console.error('2. Check browser Network tab to see actual request');
    console.error('3. Verify Formspree form is active at: https://formspree.io/forms');
    console.error('═════════════════════════════════════════════════════════════');
    
    isSubmitting = false;
    showToast('Order submission failed: ' + error.message);
  });
}

/**
 * Submit to Google Apps Script (if you have it deployed)
 */
async function submitToGAS(orderData) {
  try {
    const response = await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // With no-cors mode, we can't check response, so assume success
    currentOrderId = orderData.orderId;
    showSuccess();
    console.log('✅ Order submitted successfully via Google Apps Script');
  } catch (error) {
    console.error('❌ Google Apps Script error:', error);
    isSubmitting = false;
    showToast('Failed to submit order. Check your internet connection.');
  }
}

// ===== UI FEEDBACK AND RESET =====
/**
 * PROFESSIONAL: Displays success message with Order ID
 * - Ensures Order ID is set and displayed
 * - Validates all DOM elements exist
 * - Provides comprehensive logging
 * - Handles errors gracefully
 */
function showSuccess() {
  console.log('🎉 SHOWING SUCCESS MESSAGE');
  console.log('   Current Order ID:', currentOrderId);
  
  const orderForm = document.getElementById('orderForm');
  const successMsg = document.getElementById('successMsg');
  const orderIdEl = document.getElementById('displayOrderId');
  const orderIdContainer = document.getElementById('orderIdContainer');

  // STEP 1: Hide form
  if (orderForm) {
    orderForm.style.display = 'none';
    console.log('✅ Order form hidden');
  } else {
    console.warn('⚠️  Order form element not found');
  }

  // STEP 2: Show success message
  if (successMsg) {
    successMsg.style.display = 'block';
    console.log('✅ Success message displayed');
  } else {
    console.error('❌ Success message element not found!');
  }

  // STEP 3: Display Order ID
  if (currentOrderId) {
    console.log('📝 Setting Order ID:', currentOrderId);
    
    if (orderIdEl) {
      orderIdEl.textContent = currentOrderId;
      console.log('✅ Order ID text set:', orderIdEl.textContent);
    } else {
      console.error('❌ displayOrderId element not found!');
    }
    
    if (orderIdContainer) {
      orderIdContainer.style.display = 'block';
      console.log('✅ Order ID container shown');
    } else {
      console.error('❌ orderIdContainer element not found!');
    }
  } else {
    console.error('❌ currentOrderId is not set!');
  }

  // STEP 4: Show feedback toast
  showToast('✅ Order received! Your Order ID is displayed above.');
  
  // STEP 5: Reset cart
  resetOrderAndCart();

  // STEP 6: Scroll to success message
  if (successMsg) {
    setTimeout(() => {
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('✅ Scrolled to success message');
    }, 300);
  }

  // STEP 7: Log completion
  console.log('🎉 SUCCESS SEQUENCE COMPLETE');
  console.log('   Order ID:', currentOrderId);
  console.log('   Timestamp:', new Date().toLocaleString('en-PH'));
  
  // Reset submission flag after brief delay
  setTimeout(() => {
    isSubmitting = false;
    console.log('✅ Submission flag reset - ready for next order');
  }, 1500);
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

  // Reset form state
  cart = [];
  updateCart();
  updateFormCheckboxes();

  // Scroll to form
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
// NOTIFICATION AND UTILITY SECTION
// ═══════════════════════════════════════════════════════════════════

/**
 * Displays a temporary toast notification
 * @param {string} message - Message to display
 * @param {number} duration - How long to show (ms), default 3000
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) {
    console.warn('Toast element not found in DOM');
    return;
  }

  toast.textContent = message;
  toast.classList.add('show');

  // Auto-hide after duration
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
    showToast('GCash number copied to clipboard!');
  }).catch(() => {
    showToast('Could not copy. Please copy manually.');
  });
}

// ═══════════════════════════════════════════════════════════════════
// PAGE INITIALIZATION SECTION
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 WHO WILL GO - Initializing Application');

  // Initialize product display
  renderProducts();
  console.log(`✓ Rendered ${products.length} products`);

  // Initialize order form
  buildFormCheckboxes();
  console.log('✓ Built order form checkboxes');

  // Initialize cart display
  updateCart();
  console.log('✓ Initialized cart');

  // Add event listeners for product checkboxes
  document.querySelectorAll('.product-checkbox').forEach(cb => {
    cb.addEventListener('change', updateSizeField);
  });

  console.log('✅ Application Ready');
  console.log(`API Endpoint: ${CONFIG.GOOGLE_APPS_SCRIPT_URL}`);

  // Check if API is configured
  if (CONFIG.GOOGLE_APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbyrhPY5XA134AJCKg9b26xfgaa2PNvqa5Y3v0vB1CMV_pLeJxpRdQU4VKK3yY21v4cxzg/exec') {
    console.warn('⚠️ Google Apps Script URL not configured!');
    showToast('⚠️ System not fully configured. Please contact administrator.', 5000);
  }
});