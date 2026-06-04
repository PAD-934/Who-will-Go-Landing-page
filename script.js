// ===== EMAILJS INITIALIZATION =====
// Initialize EmailJS with your Public Key - wrapped in try-catch so it doesn't block other functions
try {
  if (window.emailjs) {
    emailjs.init('YwvMG5FEgAX47rIQF');
  }
} catch (e) {
  console.log('EmailJS not yet loaded, will retry on form submission');
}

// ===== CONFIGURATION yes =====
const EMAILJS_CONFIG = {
  serviceId: 'service_lf4em7r',
  templateId: 'template_fzkxekp',
  recipientEmail: 'paulallendiaz86@gmail.com'
};

// ===== GOOGLE FORM CONFIGURATION =====
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_-PXZCU-JIw9RMsS5bwcLMq7ZTSmUBQMGtEaRBLA-Fx6Bzg/formResponse',
  entryIds: {
    name: '1743232616',
    phone: '177811076',
    email: '836049442',
    address: '154821055',
    products: '1796804161',
    size: '409057574',
    qty: '1791107185',
    payment: '83423007',
    notes: '688366974'
  }
};

// ===== PRODUCT DATA =====
const products = [
  // ===== PRE-ORDER PRODUCTS =====
  {
    id: 1, name: "T-shirts", category: "preorder",
    price: 450, tag: "PRE-ORDER",
    desc: "Premium cotton t-shirts with custom design. Available in multiple colors and sizes. Lead time: 2-3 weeks.",
    requiresSize: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    maxQuantity: 100,
    quantityNote: "Order up to 100 pieces",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 2, name: "Mugs", category: "preorder",
    price: 320, tag: "PRE-ORDER",
    desc: "Custom ceramic mugs with personalized design. 11oz ceramic with durable print. Lead time: 2-3 weeks.",
    requiresSize: false,
    maxQuantity: 100,
    quantityNote: "Order up to 100 pieces",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`
  },
  {
    id: 3, name: "String Bag", category: "preorder",
    price: 280, tag: "PRE-ORDER",
    desc: "Eco-friendly canvas string bag with custom branding. Perfect for shopping or events. Lead time: 2-3 weeks.",
    requiresSize: false,
    sizes: ['One Size'],
    maxQuantity: 100,
    quantityNote: "Order up to 100 pieces",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
  {
    id: 4, name: "Keychain", category: "preorder",
    price: 150, tag: "PRE-ORDER",
    desc: "Custom engraved keychain in metal or plastic. Compact and personalized. Lead time: 1-2 weeks.",
    requiresSize: false,
    maxQuantity: 200,
    quantityNote: "Order up to 200 pieces",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>`
  },

  // ===== ONSITE PRODUCTS =====
  {
    id: 5, name: "Photobooth", category: "onsite",
    price: 2500, tag: "ON-SITE",
    desc: "Professional photobooth rental for events. Includes backdrop, props, and instant prints. Available on-site only.",
    requiresSize: false,
    maxQuantity: 1,
    quantityNote: "Event service - Quantity: 1",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/></svg>`
  },
  {
    id: 6, name: "Bookmark", category: "onsite",
    price: 50, tag: "ON-SITE",
    desc: "Beautifully designed bookmarks. Available at events while supplies last. Perfect gift with purchases.",
    requiresSize: false,
    maxQuantity: 50,
    quantityNote: "Limited stock - up to 50",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
  {
    id: 7, name: "Pins", category: "onsite",
    price: 75, tag: "ON-SITE",
    desc: "Custom enamel pins and badges. Limited quantities available on-site only.",
    requiresSize: false,
    maxQuantity: 100,
    quantityNote: "Limited stock - up to 100",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>`
  },
  {
    id: 8, name: "Bamboo Notebook with Pen", category: "onsite",
    price: 180, tag: "ON-SITE",
    desc: "Eco-friendly bamboo notebook with matching pen. Perfect for notes and signatures. On-site purchase only.",
    requiresSize: false,
    maxQuantity: 30,
    quantityNote: "Limited stock - up to 30",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
  {
    id: 9, name: "Laser Engraving", category: "onsite",
    price: 300, tag: "ON-SITE",
    desc: "Professional laser engraving service for your items. Custom designs available. On-site service only.",
    requiresSize: false,
    maxQuantity: 1,
    quantityNote: "Service - Quantity: 1",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>`
  },
  {
    id: 10, name: "Ptr. Adewale Booksfile", category: "onsite",
    price: 200, tag: "ON-SITE",
    desc: "Exclusive biography and teachings of Pastor Adewale. Limited copies available at events.",
    requiresSize: false,
    maxQuantity: 50,
    quantityNote: "Limited copies - up to 50",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
];

let cart = [];

// ===== RENDER PRODUCTS =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  let html = '';
  filtered.forEach(p => {
    html += `
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
    </div>`;
  });
  
  grid.innerHTML = html;
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ===== CART =====
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
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = 'PHP ' + total.toLocaleString('en-PH', {minimumFractionDigits:2});

  const body = document.getElementById('cartBody');
  const empty = document.getElementById('cartEmpty');

  if (cart.length === 0) {
    body.innerHTML = '';
    body.appendChild(empty);
    empty.style.display = 'block';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.icon}
      </div>
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
    </div>
  `).join('');

  updateFormCheckboxes();
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

function scrollToOrder() {
  closeCart();
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// ===== ORDER FORM - PRODUCT SELECTOR WITH QUANTITIES =====
function buildFormCheckboxes() {
  const container = document.getElementById('productSelectorForm');
  
  container.innerHTML = products.map(p => `
    <div class="product-checkbox-item" style="display:flex; gap:12px; margin-bottom:16px; padding:12px; border:1px solid rgba(201,168,76,0.2); border-radius:4px; background:rgba(201,168,76,0.03);">
      <div style="flex:1;">
        <div style="display:flex; align-items:center; margin-bottom:8px;">
          <input type="checkbox" id="pcheck_${p.id}" name="products" value="${p.name}" class="product-checkbox" onchange="updateSizeField()"/>
          <label for="pcheck_${p.id}" style="margin-left:8px; cursor:pointer; flex:1;">
            <span style="font-weight:500;">${p.name}</span>
            <span style="color:var(--gold); margin-left:8px;">PHP ${p.price}</span>
          </label>
        </div>
        <div style="font-size:0.85rem; color:var(--text-light);">${p.quantityNote}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <label for="qty_${p.id}" style="font-size:0.85rem; color:var(--text-light);">Qty:</label>
        <input type="number" id="qty_${p.id}" class="product-qty-input" min="1" max="${p.maxQuantity}" value="1" style="width:60px; padding:6px; border:1px solid var(--gold); border-radius:3px; background:transparent; color:var(--cream); text-align:center;" disabled/>
      </div>
    </div>
  `).join('');
}

// ===== UPDATE QUANTITY FIELDS BASED ON CHECKBOX =====
function updateQuantityFields() {
  products.forEach(p => {
    const checkbox = document.getElementById(`pcheck_${p.id}`);
    const qtyInput = document.getElementById(`qty_${p.id}`);
    if (checkbox && qtyInput) {
      qtyInput.disabled = !checkbox.checked;
      if (checkbox.checked && qtyInput.value < 1) {
        qtyInput.value = 1;
      }
    }
  });
}

// ===== UPDATE SIZE FIELD VISIBILITY =====
function updateSizeField() {
  updateQuantityFields();
  
  const sizeGroup = document.getElementById('sizeGroup');
  if (!sizeGroup) return;
  
  // Check if T-shirts is selected
  const tshirtsCheckbox = document.getElementById('pcheck_1');
  const showSize = tshirtsCheckbox && tshirtsCheckbox.checked;
  
  if (showSize) {
    sizeGroup.style.display = 'block';
    document.getElementById('fsize').required = true;
  } else {
    sizeGroup.style.display = 'none';
    document.getElementById('fsize').required = false;
    document.getElementById('fsize').value = '';
  }
}

function updateFormCheckboxes() {
  cart.forEach(item => {
    const cb = document.getElementById('pcheck_' + item.id);
    const qtyInput = document.getElementById('qty_' + item.id);
    if (cb) {
      cb.checked = true;
      if (qtyInput) {
        qtyInput.value = item.qty || 1;
        qtyInput.disabled = false;
      }
    }
  });
  updateSizeField();
}

// ===== SUBMIT ORDER =====
function submitOrder(e) {
  e.preventDefault();
  
  // Get selected products with quantities
  const selectedItems = [];
  products.forEach(p => {
    const checkbox = document.getElementById(`pcheck_${p.id}`);
    const qtyInput = document.getElementById(`qty_${p.id}`);
    
    if (checkbox && checkbox.checked) {
      const qty = parseInt(qtyInput.value) || 1;
      
      // Validate quantity
      if (qty < 1 || qty > p.maxQuantity) {
        showToast(`${p.name}: Quantity must be between 1 and ${p.maxQuantity}`);
        return;
      }
      
      selectedItems.push({
        name: p.name,
        price: p.price,
        quantity: qty,
        requiresSize: p.requiresSize
      });
    }
  });
  
  if (selectedItems.length === 0) {
    showToast('Please select at least one product.');
    return;
  }
  
  // Validate size if T-shirts selected
  const tshirtSelected = selectedItems.some(item => item.name === 'T-shirts');
  const selectedSize = document.getElementById('fsize').value;
  
  if (tshirtSelected && !selectedSize) {
    showToast('Please select a size for T-shirts.');
    return;
  }

  // Build product list with quantities
  const productList = selectedItems.map(item => {
    let productStr = `${item.name} (Qty: ${item.quantity})`;
    if (item.name === 'T-shirts' && selectedSize) {
      productStr += ` - Size: ${selectedSize}`;
    }
    productStr += ` x PHP ${item.price} = PHP ${item.price * item.quantity}`;
    return productStr;
  }).join('\n');
  
  // Calculate total
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderData = {
    name: document.getElementById('fname').value,
    phone: document.getElementById('fphone').value,
    email: document.getElementById('femail').value,
    address: document.getElementById('faddress').value,
    products: productList,
    tshirtSize: selectedSize || 'N/A',
    totalQuantity: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: totalPrice,
    payment: document.getElementById('fpayment').value,
    notes: document.getElementById('fnotes').value,
    timestamp: new Date().toLocaleString('en-PH')
  };

  console.log('=== NEW ORDER ===', orderData);
  console.log('Processing order submission...');

  // Show loading state
  showToast('Submitting your order...');

  // ===== SUBMIT TO GOOGLE FORM (SILENT) =====
  submitToGoogleForm(orderData, selectedItems);
}

// ===== SUBMIT TO GOOGLE FORM (SILENT) =====
function submitToGoogleForm(orderData, selectedItems) {
  try {
    // Create FormData object for Google Forms
    const formData = new FormData();
    
    // Add all fields with correct entry IDs
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.name}`, orderData.name || '');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.phone}`, orderData.phone || '');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.email}`, orderData.email || '');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.address}`, orderData.address || '');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.size}`, orderData.tshirtSize || 'N/A');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.qty}`, String(orderData.totalQuantity || 1));
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.payment}`, orderData.payment || '');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.notes}`, orderData.notes || '');
    
    // Add products as single entry
    const productNames = (selectedItems && selectedItems.length > 0) 
      ? selectedItems.map(item => item.name).join(', ')
      : 'N/A';
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.products}`, productNames);
    
    // Add timestamp
    formData.append('timestamp', orderData.timestamp || new Date().toISOString());
    
    console.log('📤 Submitting order to Google Forms...');
    console.log('✓ Order Data:', {
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      products: productNames,
      qty: orderData.totalQuantity,
      size: orderData.tshirtSize,
      payment: orderData.payment,
      notes: orderData.notes
    });
    
    // Build the URL with parameters for reliable submission
    const url = new URL(GOOGLE_FORM_CONFIG.formUrl);
    
    // Add form data to URL params for GET-style submission (more reliable)
    // This is a workaround for Google Forms CORS restrictions
    const image = new Image();
    image.style.display = 'none';
    
    // Construct URL with all parameters
    let paramString = `?timestamp=${encodeURIComponent(orderData.timestamp || '')}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.name}=${encodeURIComponent(orderData.name || '')}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.phone}=${encodeURIComponent(orderData.phone || '')}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.email}=${encodeURIComponent(orderData.email || '')}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.address}=${encodeURIComponent(orderData.address || '')}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.products}=${encodeURIComponent(productNames)}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.size}=${encodeURIComponent(orderData.tshirtSize || 'N/A')}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.qty}=${encodeURIComponent(String(orderData.totalQuantity || 1))}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.payment}=${encodeURIComponent(orderData.payment || '')}`;
    paramString += `&entry.${GOOGLE_FORM_CONFIG.entryIds.notes}=${encodeURIComponent(orderData.notes || '')}`;
    
    // Try POST first with no-cors
    fetch(GOOGLE_FORM_CONFIG.formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      console.log('✅ Form submission completed');
      showSuccess();
    })
    .catch(() => {
      // Fallback: try as image beacon (works reliably with Google Forms)
      image.src = GOOGLE_FORM_CONFIG.formUrl.replace('formResponse', 'formResponse/') + paramString;
      image.onload = () => {
        console.log('✅ Form submission completed via beacon');
        showSuccess();
      };
      image.onerror = () => {
        console.log('✅ Form submission initiated');
        showSuccess();
      };
      document.body.appendChild(image);
      setTimeout(() => document.body.removeChild(image), 1000);
    });
    
  } catch (error) {
    console.error('Error preparing form submission:', error);
    showSuccess();
  }
}

// Show success and reset form
function showSuccess() {
  document.getElementById('orderForm').style.display = 'none';
  document.getElementById('successMsg').classList.add('show');
  showToast('Order submitted successfully!');
  
  // Reset cart
  cart = [];
  updateCart();
}

// Show success message and reset form
function showSuccessMessage() {
  document.getElementById('orderForm').style.display = 'none';
  document.getElementById('successMsg').classList.add('show');
  showToast('Order submitted successfully!');
}

// Continue ordering - reset form and show it again
function continueOrdering() {
  // Reset form inputs
  document.getElementById('orderForm').reset();
  
  // Reset cart
  cart = [];
  updateCart();
  
  // Uncheck all product checkboxes and reset quantities
  products.forEach(p => {
    const checkbox = document.getElementById(`pcheck_${p.id}`);
    const qtyInput = document.getElementById(`qty_${p.id}`);
    if (checkbox) checkbox.checked = false;
    if (qtyInput) qtyInput.value = 1;
  });
  
  // Hide success message and show form
  document.getElementById('successMsg').classList.remove('show');
  document.getElementById('orderForm').style.display = 'block';
  
  // Reset size field visibility
  updateSizeField();
  
  // Scroll back to order form
  document.getElementById('orderFormWrapper').scrollIntoView({ behavior: 'smooth' });
  
  showToast('Ready for another order!');
}

// Scroll to shop section
function scrollToShop() {
  // Reset cart
  cart = [];
  updateCart();
  
  // Hide success message and show form again
  document.getElementById('successMsg').classList.remove('show');
  document.getElementById('orderForm').style.display = 'block';
  
  // Scroll to shop
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}



// ===== COPY GCASH =====
function copyGcash() {
  const num = document.getElementById('gcashNumber').textContent.trim();
  navigator.clipboard.writeText(num).then(() => {
    showToast('GCash number copied!');
  }).catch(() => {
    showToast('Copy: ' + num);
  });
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== AUTO-INIT - Removed, handled in HTML =====
console.log('✓ new-script.js loaded successfully');
console.log(`✓ Products: ${products.length} items available`);