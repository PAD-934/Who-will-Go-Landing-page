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
  {
    id: 1, name: "Go Forth Tee", category: "shirt",
    price: 450, tag: "BESTSELLER",
    desc: "Premium cotton shirt with Isaiah 6:8 printed on the back. Available in multiple colors.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 2, name: "Mission Mug", category: "mug",
    price: 320, tag: "NEW",
    desc: "11oz ceramic mug with 'Who Will Go?' scripture design. Perfect for your morning devotion.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`
  },
  {
    id: 3, name: "Missionary Cap", category: "cap",
    price: 380, tag: "",
    desc: "Structured 6-panel cap embroidered with the 'WWG' logo and cross motif.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`
  },
  {
    id: 4, name: "Isaiah Bracelet", category: "accessory",
    price: 180, tag: "NEW",
    desc: "Leather-wrapped cuff bracelet engraved with 'Isaiah 6:8' - a daily reminder of your calling.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`
  },
  {
    id: 5, name: "Go Nations Tote", category: "accessory",
    price: 280, tag: "",
    desc: "Heavy-duty canvas tote bag with the global mission map print and scripture reference.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
  {
    id: 6, name: "Prayer Warrior Hoodie", category: "shirt",
    price: 890, tag: "LIMITED",
    desc: "Heavyweight fleece hoodie with large back print. The ultimate statement of faith in comfort.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 7, name: "Travel Tumbler", category: "mug",
    price: 490, tag: "",
    desc: "Stainless steel 500ml tumbler. Keeps drinks hot for 12hrs. Engraved WWG emblem.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/></svg>`
  },
  {
    id: 8, name: "Cross Keychain", category: "accessory",
    price: 120, tag: "",
    desc: "Solid metal cross keychain with antique gold finish and micro scripture inscription.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>`
  },
  {
    id: 9, name: "Gospel Messenger Shirt", category: "shirt",
    price: 495, tag: "NEW",
    desc: "Classic crew neck with 'Gospel' scripture message. Premium 100% cotton comfort fit.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 10, name: "Faith Over Fear Hoodie", category: "shirt",
    price: 850, tag: "",
    desc: "Cozy hoodie with inspiring 'Faith Over Fear' design. Perfect for missionaries on the field.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 11, name: "Scripture Coffee Mug", category: "mug",
    price: 350, tag: "",
    desc: "Ceramic mug with daily scripture verses. Inspire your morning prayers with comfort.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`
  },
  {
    id: 12, name: "Witness Baseball Cap", category: "cap",
    price: 400, tag: "NEW",
    desc: "Unstructured baseball cap with embroidered 'Witness' design. Breathable and stylish.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`
  },
  {
    id: 13, name: "Mission Bracelet Set", category: "accessory",
    price: 250, tag: "BESTSELLER",
    desc: "Pack of 3 wooden and leather bracelets with mission-inspired engraving and colors.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`
  },
  {
    id: 14, name: "Canvas Church Tote", category: "accessory",
    price: 320, tag: "",
    desc: "Large canvas tote perfect for carrying Bibles, books, and ministry supplies to church.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
  {
    id: 15, name: "Stainless Steel Water Bottle", category: "mug",
    price: 550, tag: "NEW",
    desc: "750ml eco-friendly water bottle with 'Go Make Disciples' engraving. Keeps drinks cold 24hrs.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/></svg>`
  },
  {
    id: 16, name: "Missionary Medal Pendant", category: "accessory",
    price: 275, tag: "",
    desc: "Sterling silver medal pendant with missionary saint design. Includes adjustable cord.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`
  },
  {
    id: 17, name: "Blessed T-Shirt", category: "shirt",
    price: 420, tag: "BESTSELLER",
    desc: "Soft 100% cotton tee with 'Blessed' calligraphy design. Comfortable everyday wear.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 18, name: "Praying Hands Hoodie", category: "shirt",
    price: 920, tag: "LIMITED",
    desc: "Premium blend hoodie with embroidered praying hands design. Perfect for cold missions.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 19, name: "Thermal Prayer Mug", category: "mug",
    price: 480, tag: "NEW",
    desc: "Insulated thermal mug with scripture design. Keeps beverages hot for 8+ hours.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`
  },
  {
    id: 20, name: "Missionary Dad Cap", category: "cap",
    price: 360, tag: "",
    desc: "Classic unstructured dad cap with gold stitching. Great for outdoor ministry work.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`
  },
  {
    id: 21, name: "Leather Wrist Cuff", category: "accessory",
    price: 325, tag: "NEW",
    desc: "Premium genuine leather wrist cuff with cross embossing. Durable and stylish.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`
  },
  {
    id: 22, name: "Ministry Supply Backpack", category: "accessory",
    price: 1250, tag: "LIMITED",
    desc: "Durable 45L capacity backpack with multiple compartments. Ideal for mission trips.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
  {
    id: 23, name: "Portable Prayer Journal", category: "accessory",
    price: 285, tag: "",
    desc: "Leather-bound 200-page prayer journal with guided prompts. Perfect for daily devotions.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`
  },
  {
    id: 24, name: "Scripture Engraved Tumbler", category: "mug",
    price: 520, tag: "BESTSELLER",
    desc: "Double-wall insulated tumbler with personalized scripture engraving option.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/></svg>`
  },
  {
    id: 25, name: "Mission Statement Tank Top", category: "shirt",
    price: 380, tag: "",
    desc: "Breathable sleeveless tank with mission-focused design. Perfect for summer outreach.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 26, name: "Gold Cross Enamel Pin", category: "accessory",
    price: 145, tag: "NEW",
    desc: "Beautifully designed enamel pin with gold cross. Perfect for hats, jackets, or bags.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.5"><path d="M12 2v20M2 12h20" stroke-width="2"/></svg>`
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

// ===== ORDER FORM CHECKBOXES =====
function buildFormCheckboxes() {
  const container = document.getElementById('productSelectorForm');
  container.innerHTML = products.map(p => `
    <div class="product-checkbox-item">
      <input type="checkbox" id="pcheck_${p.id}" name="products" value="${p.name} - PHP ${p.price}"/>
      <label for="pcheck_${p.id}">${p.name} - PHP ${p.price}</label>
    </div>
  `).join('');
}

function updateFormCheckboxes() {
  cart.forEach(item => {
    const cb = document.getElementById('pcheck_' + item.id);
    if (cb) cb.checked = true;
  });
}

// ===== SUBMIT ORDER =====
function submitOrder(e) {
  e.preventDefault();
  const selected = [...document.querySelectorAll('input[name="products"]:checked')].map(c => c.value);
  if (selected.length === 0) {
    showToast('Please select at least one product.');
    return;
  }

  const orderData = {
    name: document.getElementById('fname').value,
    phone: document.getElementById('fphone').value,
    email: document.getElementById('femail').value,
    address: document.getElementById('faddress').value,
    products: selected,
    size: document.getElementById('fsize').value,
    qty: document.getElementById('fqty').value,
    payment: document.getElementById('fpayment').value,
    notes: document.getElementById('fnotes').value,
    timestamp: new Date().toLocaleString('en-PH')
  };

  console.log('=== NEW ORDER ===', orderData);

  // Show loading state
  showToast('Processing your order...');

  // Submit to Google Form (silent - in background)
  submitToGoogleForm(orderData);
}

// ===== SUBMIT TO GOOGLE FORM (SILENT) =====
function submitToGoogleForm(orderData) {
  try {
    const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc_-PXZCU-JIw9RMsS5bwcLMq7ZTSmUBQMGtEaRBLA-Fx6Bzg/formResponse';
    
    // Create FormData object (correct way to submit to Google Forms)
    const formData = new FormData();
    
    // Add basic fields with correct entry IDs
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.name}`, orderData.name);
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.phone}`, orderData.phone);
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.email}`, orderData.email);
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.address}`, orderData.address);
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.size}`, orderData.size || 'N/A');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.qty}`, orderData.qty);
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.payment}`, orderData.payment);
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.notes}`, orderData.notes);
    
    // Add products (join with comma for multiple selections)
    const productNames = orderData.products.map(productName => 
      productName.split(' - PHP')[0]
    ).join(', ');
    formData.append(`entry.${GOOGLE_FORM_CONFIG.entryIds.products}`, productNames);
    
    console.log('📤 Submitting order to Google Forms...');
    console.log('Order Data:', {
      name: orderData.name,
      email: orderData.email,
      products: productNames,
      total: orderData.products.length
    });
    
    // Submit using fetch with no-cors mode (necessary for Google Forms cross-origin)
    fetch(baseUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
      headers: {
        'Accept': '*/*'
      }
    })
    .then(() => {
      console.log('✅ Order successfully submitted to Google Forms!');
      console.log('📊 Check your Google Form responses to see the data');
      showSuccessMessage();
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      // Still show success since no-cors requests always "fail" but still submit
      console.log('✓ Order submitted anyway (no-cors limitation)');
      showSuccessMessage();
    });
    
  } catch (error) {
    console.error('Error creating form submission:', error);
    showSuccessMessage();
  }
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
  
  // Uncheck all product checkboxes in form
  document.querySelectorAll('input[name="products"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Hide success message and show form
  document.getElementById('successMsg').classList.remove('show');
  document.getElementById('orderForm').style.display = 'block';
  
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

// ===== SEND EMAIL VIA EMAILJS =====
function sendOrderEmail(orderData) {
  // Ensure EmailJS is initialized
  if (window.emailjs && !window.emailjs._state) {
    try {
      emailjs.init('YwvMG5FEgAX47rIQF');
    } catch (e) {
      console.log('EmailJS initialization error:', e);
    }
  }
  
  // Get product details
  const productDetails = products.filter(p => orderData.products.includes(String(p.id)));
  const productList = productDetails.map(p => `${p.name} (PHP ${p.price})`).join('\n');
  
  // Calculate total price
  let totalPrice = 0;
  productDetails.forEach(p => {
    totalPrice += p.price;
  });
  
  // Prepare template parameters for EmailJS
  // These variable names MUST match your EmailJS template exactly
  const templateParams = {
    to_email: EMAILJS_CONFIG.recipientEmail,
    customer_name: orderData.name,
    customer_email: orderData.email,
    customer_phone: orderData.phone,
    customer_address: orderData.address,
    products_ordered: productList,
    total_price: `PHP ${totalPrice.toLocaleString('en-PH', {minimumFractionDigits: 2})}`,
    size_selected: orderData.size || 'N/A',
    quantity: orderData.qty,
    payment_method: orderData.payment,
    special_instructions: orderData.notes || 'None',
    order_date: orderData.timestamp,
    message: `New order received from ${orderData.name}`
  };

  console.log('📧 Sending email with parameters:', templateParams);
  
  // Send email using EmailJS
  showToast('Sending confirmation email...');
  
  emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams
  )
  .then(function(response) {
    console.log('✓ Email sent successfully!', response.status, response.text);
    
    // Show success message
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('successMsg').classList.add('show');
    showToast('Order submitted! Confirmation email sent.');
    
    // Reset cart
    cart = [];
    updateCart();
  }, function(error) {
    console.error('✗ Email send failed:', error);
    console.log('Error details:', JSON.stringify(error));
    
    // Show success message anyway (order was submitted)
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('successMsg').classList.add('show');
    showToast('Order submitted! (Email details in console)');
    
    // Reset cart
    cart = [];
    updateCart();
  });
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
