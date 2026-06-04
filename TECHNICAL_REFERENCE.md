# 🔧 Technical Implementation Reference

## Code Functions Overview

### 1. `buildFormCheckboxes()`
**Purpose:** Dynamically generates product selection UI with quantity inputs

**Location:** script.js

**What it does:**
- Creates a checkbox for each product
- Adds per-product quantity input
- Shows maximum quantity limit
- Disables qty input until checkbox is checked

**Usage:**
```javascript
buildFormCheckboxes(); // Called on page load
```

**Output:**
```html
<div class="product-checkbox-item">
  <input type="checkbox" id="pcheck_1" name="products" value="T-shirts">
  <label>T-shirts - PHP 450</label>
  <input type="number" id="qty_1" min="1" max="100" value="1" disabled>
</div>
```

---

### 2. `updateQuantityFields()`
**Purpose:** Enables/disables quantity inputs based on checkbox state

**Location:** script.js

**What it does:**
- When checkbox checked → enable quantity input
- When checkbox unchecked → disable quantity input
- Sets quantity to 1 if it was empty

**Triggered by:**
- Checkbox change event
- `updateSizeField()` function

---

### 3. `updateSizeField()`
**Purpose:** Controls visibility of size field based on product selection

**Location:** script.js

**Logic:**
```javascript
if (T-shirts checkbox is checked) {
  Show size field
  Make size field required
} else {
  Hide size field
  Make size field optional
  Clear size value
}
```

**CSS Modified:**
- `display: block` (show)
- `display: none` (hide)

---

### 4. `submitOrder(e)`
**Purpose:** Main form submission handler with comprehensive validation

**Location:** script.js

**Validation Steps:**
1. Collect all selected products with quantities
2. Validate quantity for each product (1 to maxQuantity)
3. Check if T-shirts selected → validate size chosen
4. Verify at least 1 product selected

**Data Collected:**
```javascript
selectedItems = [
  { name: "T-shirts", quantity: 5, price: 450, requiresSize: true },
  { name: "Keychain", quantity: 20, price: 150, requiresSize: false }
]
```

**Calculation:**
- Total Quantity: 5 + 20 = 25
- Total Price: (5 × 450) + (20 × 150) = 5,250

**Output:**
Calls `submitToGoogleForm()` and `sendOrderEmail()`

---

### 5. `submitToGoogleForm(orderData)`
**Purpose:** Sends order data to Google Forms via FormData API

**Location:** script.js

**Key Features:**
- Uses `mode: 'no-cors'` for cross-origin compatibility
- Maps product data to Google Form entry IDs
- Includes quantity totals and sizing info
- Silent submission (no error feedback needed)

**Data Format:**
```javascript
{
  name: "John Doe",
  phone: "09123456789",
  email: "john@example.com",
  address: "123 Main St",
  products: "T-shirts (Qty: 5) - Size: L x PHP 450\nKeychain (Qty: 20) x PHP 150",
  tshirtSize: "L",
  totalQuantity: 25,
  totalPrice: 5,250,
  payment: "GCash",
  notes: "Some notes",
  timestamp: "June 4, 2026 10:30 AM"
}
```

---

### 6. `sendOrderEmail(orderData)`
**Purpose:** Sends formatted order confirmation via EmailJS

**Location:** script.js

**Template Parameters:**
- `customer_name`: Order customer
- `products_ordered`: Formatted product list
- `total_quantity`: Sum of all quantities
- `total_price`: Calculated total
- `tshirt_size`: Size if applicable
- `payment_method`: GCash/QR Code

**Success Flow:**
1. Email sent
2. Hide order form
3. Show success message
4. Reset cart
5. Clear all inputs

**Error Handling:**
- Catches EmailJS errors
- Still shows success (Google Forms backup)
- Clears form data

---

### 7. `continueOrdering()`
**Purpose:** Resets form for new order after success

**Location:** script.js

**Actions:**
- Reset all form fields
- Uncheck all product checkboxes
- Reset quantity inputs
- Clear cart
- Hide success message
- Show order form
- Call `updateSizeField()` to hide size field

---

## Product Data Structure

### Fields:
```javascript
{
  id: 1,                          // Unique identifier
  name: "T-shirts",               // Display name
  category: "preorder",           // Category for filtering
  price: 450,                     // Price in PHP
  tag: "PRE-ORDER",              // Label
  desc: "...",                    // Description
  requiresSize: true,            // Does this need size?
  sizes: ['XS','S','M','L','XL','XXL'],  // Size options
  maxQuantity: 100,              // Max qty allowed
  quantityNote: "Order up to 100 pieces",
  icon: `<svg>...</svg>`        // SVG icon
}
```

### Modifying Products:

**Change max quantity:**
```javascript
{ id: 3, ..., maxQuantity: 150 }  // was 100
```

**Add size requirement:**
```javascript
{
  id: 2,
  name: "Mugs",
  requiresSize: true,
  sizes: ['Regular', 'Large']
}
```

**Remove size requirement:**
```javascript
{ id: 1, ..., requiresSize: false }
```

---

## Form IDs and Elements

| ID | Type | Purpose | Required |
|----|----|---------|----------|
| `fname` | text | Customer name | Yes |
| `fphone` | tel | Phone number | Yes |
| `femail` | email | Email address | Yes |
| `faddress` | text | Delivery address | Yes |
| `productSelectorForm` | div | Product checkboxes container | Yes |
| `pcheck_1` | checkbox | Product ID 1 checkbox | No |
| `qty_1` | number | Product ID 1 quantity | Conditional |
| `fsize` | select | Shirt size selector | Conditional |
| `fpayment` | select | Payment method | Yes |
| `fnotes` | textarea | Special instructions | No |

---

## Quantity Input Naming Convention

```
Product Checkbox: id="pcheck_{productId}"
Quantity Input:   id="qty_{productId}"

Example:
- T-shirts: pcheck_1, qty_1
- Mugs: pcheck_2, qty_2
- Keychain: pcheck_4, qty_4
```

---

## Size Field Visibility Control

**Default:** Hidden
```javascript
#sizeGroup { display: none; }
```

**When T-shirts checked:**
```javascript
#sizeGroup { display: block; }
```

**CSS Class:**
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

---

## Validation Flow

```
Form Submit
    ↓
Check: At least 1 product selected?
    ├─ No → Show error "Please select at least one product"
    └─ Yes ↓
Check: Each product qty valid (1-maxQuantity)?
    ├─ No → Show error "Product X: Qty must be 1-{max}"
    └─ Yes ↓
Check: T-shirts selected?
    ├─ Yes → Check: Size selected?
    │         ├─ No → Show error "Please select a size"
    │         └─ Yes ↓
    └─ No ↓
Build order data
    ↓
Submit to Google Forms
Submit email notification
    ↓
Show success → Reset form
```

---

## Data Flow Diagram

```
Customer fills form
    ↓
Clicks "Place Order"
    ↓
submitOrder() called
    ├─ Collect products + quantities
    ├─ Validate quantities (1 to max)
    ├─ Validate size if T-shirts
    └─ Build orderData object
    ↓
submitToGoogleForm(orderData)
├─ Create FormData
├─ Map fields to entry IDs
└─ Send POST via fetch (no-cors)
    ↓
sendOrderEmail(orderData) [500ms later]
├─ Initialize EmailJS
├─ Build template params
├─ Send via emailjs.send()
└─ On success: show confirmation
    ↓
continueOrdering() [when user clicks "Order Again"]
├─ Reset form
├─ Clear cart
└─ Uncheck checkboxes
```

---

## Google Forms Integration

**Entry IDs Configuration:**
```javascript
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/{FORM_ID}/formResponse',
  entryIds: {
    name: '1743232616',      // Full Name field
    phone: '177811076',      // Phone field
    email: '836049442',      // Email field
    address: '154821055',    // Address field
    products: '1796804161',  // Products field
    size: '409057574',       // Size field
    qty: '1791107185',       // Quantity field
    payment: '83423007',     // Payment field
    notes: '688366974'       // Notes field
  }
};
```

**Finding Entry IDs:**
1. Open Google Form
2. Right-click field → Inspect
3. Look for `data-initial-field-value="{entry_id}"`
4. Copy that ID

---

## EmailJS Integration

**Configuration:**
```javascript
const EMAILJS_CONFIG = {
  serviceId: 'service_lf4em7r',
  templateId: 'template_fzkxekp',
  recipientEmail: 'paulallendiaz86@gmail.com',
  publicKey: 'YwvMG5FEgAX47rIQF'
};
```

**Template Variables:**
- `{{customer_name}}`
- `{{products_ordered}}`
- `{{total_quantity}}`
- `{{total_price}}`
- `{{tshirt_size}}`
- `{{payment_method}}`
- `{{customer_email}}`
- `{{order_date}}`

---

## Error Handling

### Form Validation Errors:
```javascript
showToast('Please select at least one product.');
showToast('Product X: Quantity must be between 1 and Y');
showToast('Please select a size for T-shirts.');
```

### Submission Errors:
```javascript
// Google Forms: Silent (no-cors mode)
// EmailJS: Catches error but shows success anyway
```

### User Feedback:
```javascript
showToast('Processing your order...');
showToast('Sending confirmation email...');
showToast('Order submitted! Confirmation email sent.');
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| FormData API | ✅ | ✅ | ✅ | ✅ |
| fetch() | ✅ | ✅ | ✅ | ✅ |
| no-cors mode | ✅ | ✅ | ✅ | ✅ |
| Number input | ✅ | ✅ | ✅ | ✅ |
| Template literals | ✅ | ✅ | ✅ | ✅ |

---

## Performance Notes

- **Form Init:** ~1ms
- **Validation:** ~5ms
- **Google Forms Submit:** ~200ms (no-cors)
- **Email Submit:** ~500ms (async)
- **Total User Wait:** ~1s (perceived)

---

## Testing Checklist

- [ ] Product checkboxes toggle quantity inputs
- [ ] Size field shows/hides with T-shirts checkbox
- [ ] Quantity validation works (rejects >max)
- [ ] Size validation required for T-shirts
- [ ] Multiple products calculate correctly
- [ ] Order submits to Google Forms
- [ ] Email sends with correct data
- [ ] Success message displays
- [ ] Form resets on "Continue Ordering"
- [ ] Cart totals update correctly

---

## Common Issues & Solutions

### Issue: Size field always visible
**Solution:** Check that checkbox ID is `pcheck_1` for T-shirts

### Issue: Quantities not multiplying prices
**Solution:** Verify `price` field exists on each product

### Issue: Form validation failing
**Solution:** Check console for specific error message

### Issue: Email not sending
**Solution:** Verify EmailJS keys and template variable names

### Issue: Google Forms not receiving data
**Solution:** Verify entry IDs match form field IDs
