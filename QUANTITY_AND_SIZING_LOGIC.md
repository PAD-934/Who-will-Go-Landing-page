# 📦 Product Quantity & Sizing Logic Guide

## Overview

Your website now has professional quantity and sizing logic for each product type.

---

## 🎯 How It Works

### For Pre-Order Products:
- **Quantity Options:** 1-100 pieces
- **Size Requirements:** Only T-shirts require size selection
- **Quantity Per Product:** Each product has its own quantity input

### For On-Site Products:
- **Quantity Limits:** Vary by product (limited stock)
  - Photobooth: 1 (service)
  - Bookmark: Up to 50
  - Pins: Up to 100
  - Bamboo Notebook: Up to 30
  - Laser Engraving: 1 (service)
  - Ptr. Adewale Booksfile: Up to 50

---

## 📋 Product Configuration

Each product now has these settings:

```javascript
{
  id: 1,
  name: "T-shirts",
  category: "preorder",
  price: 450,
  requiresSize: true,           // ← T-shirts only!
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  maxQuantity: 100,             // ← Quantity limit
  quantityNote: "Order up to 100 pieces"
}
```

### Product Metadata Explained:

| Property | What It Does | Example |
|----------|-------------|---------|
| `requiresSize` | Shows size field only if true | T-shirts: true, Mugs: false |
| `sizes` | Available size options | ['XS', 'S', 'M', 'L', 'XL', 'XXL'] |
| `maxQuantity` | Maximum quantity allowed | 100, 50, 1 |
| `quantityNote` | Hint text for customer | "Order up to 100 pieces" |

---

## 🧮 Quantity Logic

### How Quantities Work:

```
Customer selects products:
  □ T-shirts (Qty: 5)
  □ Mugs (Qty: 10)
  ☑ String Bag (Qty: 1)
  ☑ Keychain (Qty: 20)
       ↓
Form calculates:
  Total Items: 5 + 10 + 1 + 20 = 36 items
  Total Price: (5×450) + (10×320) + (1×280) + (20×150) = PHP 6,580
       ↓
Email & Google Forms receive:
  String Bag (Qty: 1) x PHP 280 = PHP 280
  Keychain (Qty: 20) x PHP 150 = PHP 3,000
  Total: PHP 3,280 for 21 items
```

### Validation Rules:

✅ **Allowed:**
- Quantity ≥ 1
- Quantity ≤ maxQuantity
- Multiple products selected

❌ **Not Allowed:**
- Quantity = 0
- Quantity > maxQuantity
- No products selected
- Size not selected for T-shirts

---

## 👕 Sizing Logic

### When Size Field Shows:

**Size field ONLY appears when T-shirts is selected:**

```javascript
// In script.js:
function updateSizeField() {
  const tshirtsCheckbox = document.getElementById('pcheck_1');
  
  if (tshirtsCheckbox.checked) {
    // Show size field, make it required
    sizeGroup.style.display = 'block';
    fsize.required = true;
  } else {
    // Hide size field, make it optional
    sizeGroup.style.display = 'none';
    fsize.required = false;
  }
}
```

### Size Selection Process:

1. Customer checks "T-shirts" ✓
2. Size field appears with 6 options:
   - XS (Extra Small)
   - S (Small)
   - M (Medium)
   - L (Large)
   - XL (Extra Large)
   - XXL (2X Large)
3. Customer must select a size
4. Size is recorded in order

### Size Submission:

When order is submitted:
```
Products Ordered:
  T-shirts (Qty: 5) - Size: L x PHP 450 = PHP 2,250
```

Size info goes to:
- ✅ Google Forms
- ✅ Email notification
- ✅ Order records

---

## 🔄 Order Form Flow

### Step-by-Step:

1. **Select Products**
   - Check boxes next to products
   - Qty field enables automatically
   
2. **Enter Quantities**
   - Type quantity (1-maxQuantity)
   - Validation checks limits
   
3. **Select Size (if T-shirts)**
   - Size field appears
   - Must select one
   
4. **Fill Customer Info**
   - Name, phone, email, address
   - Same for all orders
   
5. **Choose Payment**
   - GCash or QR Code
   
6. **Add Notes**
   - Colors, customization, etc.
   - Optional
   
7. **Submit**
   - System validates everything
   - Sends to Google Forms + Email
   - Shows confirmation

---

## 📊 Data Sent to Google Forms

When an order is submitted, Google Forms receives:

```
Field: Full Name
Value: John Doe

Field: Phone Number
Value: 09123456789

Field: Email Address
Value: john@example.com

Field: Delivery Address
Value: 123 Main St, City

Field: Products
Value: 
  String Bag (Qty: 1) x PHP 280 = PHP 280
  Keychain (Qty: 20) x PHP 150 = PHP 3,000
  Total: 21 items = PHP 3,280

Field: Size/Customization
Value: L (Large)

Field: Quantity
Value: 21

Field: Payment
Value: GCash

Field: Notes
Value: Red color for some keychains
```

---

## 📧 Data Sent in Email

Email notification includes:

```
CUSTOMER ORDER SUMMARY
======================
Order Date: June 4, 2026

Customer: John Doe
Phone: 09123456789
Email: john@example.com
Address: 123 Main St, City

PRODUCTS ORDERED:
- String Bag (Qty: 1) x PHP 280 = PHP 280
- Keychain (Qty: 20) x PHP 150 = PHP 3,000

Shirt Size: L (Large)
Total Items: 21
Total Amount: PHP 3,280

Payment Method: GCash
Special Notes: Red color for some keychains
```

---

## 🎨 Form UI Structure

### Product Selector (with Quantities):

```
┌─────────────────────────────────────┐
│ ☑ T-shirts                 Qty: 5   │
│   PHP 450 | Order up to 100 pieces  │
├─────────────────────────────────────┤
│ ☑ Mugs                    Qty: 10   │
│   PHP 320 | Order up to 100 pieces  │
├─────────────────────────────────────┤
│ ☑ String Bag               Qty: 1   │
│   PHP 280 | Order up to 100 pieces  │
├─────────────────────────────────────┤
│ ☑ Keychain                Qty: 20   │
│   PHP 150 | Order up to 200 pieces  │
└─────────────────────────────────────┘
```

### Size Field (T-shirts only):

```
Size Field appears when T-shirts checked:

┌──────────────────────────┐
│ Size (for apparel)       │
│ Only required if ordering│
│ T-shirts                 │
│                          │
│ ▼ Select size           │ ← Required field
│   □ XS                  │
│   □ S                   │
│   ☑ M                   │
│   □ L                   │
│   □ XL                  │
│   □ XXL                 │
└──────────────────────────┘
```

---

## ✅ Validation Rules

### Quantity Validation:

```javascript
// Check: quantity is between 1 and maxQuantity
if (qty < 1 || qty > p.maxQuantity) {
  Error: "Quantity must be between 1 and {maxQuantity}"
  Return: false
}
```

### Size Validation (for T-shirts):

```javascript
// Check: if T-shirts selected, size must be chosen
if (tshirtSelected && !selectedSize) {
  Error: "Please select a size for T-shirts"
  Return: false
}
```

### Product Selection:

```javascript
// Check: at least one product selected
if (selectedItems.length === 0) {
  Error: "Please select at least one product"
  Return: false
}
```

---

## 🧪 Testing the Logic

### Test Case 1: T-shirt with Size

1. Select "T-shirts" ✓
2. Size field appears ✓
3. Set Qty: 5
4. Select Size: "L"
5. Submit
6. ✅ Should work: Email shows "T-shirts (Qty: 5) - Size: L"

### Test Case 2: No Size for Non-Apparel

1. Select "Mugs" ✓
2. Size field does NOT appear ✓
3. Set Qty: 10
4. Submit (no size field)
5. ✅ Should work: Email shows "Mugs (Qty: 10)"

### Test Case 3: Multiple Products with Different Quantities

1. Select "T-shirts" Qty: 2
2. Select "Mugs" Qty: 5
3. Select "Keychain" Qty: 20
4. Set Size: "M"
5. Submit
6. ✅ Should show: 27 items, correct prices for each

### Test Case 4: Quantity Too High (Should Fail)

1. Select "T-shirts" Qty: 200 (max is 100)
2. Submit
3. ❌ Error: "Quantity must be between 1 and 100"

### Test Case 5: T-shirt Without Size (Should Fail)

1. Select "T-shirts" Qty: 5
2. Don't select size
3. Submit
4. ❌ Error: "Please select a size for T-shirts"

---

## 💾 Quantity Limits Reference

| Product | Max Qty | Notes |
|---------|---------|-------|
| T-shirts | 100 | Bulk ordering OK |
| Mugs | 100 | Bulk ordering OK |
| String Bag | 100 | Bulk ordering OK |
| Keychain | 200 | Can order more |
| Photobooth | 1 | One-time service |
| Bookmark | 50 | Limited stock |
| Pins | 100 | Limited stock |
| Bamboo Notebook | 30 | Limited stock |
| Laser Engraving | 1 | One-time service |
| Ptr. Adewale Booksfile | 50 | Limited copies |

---

## 🔧 How to Modify Limits

To change quantity limits, edit `script.js`:

```javascript
{
  id: 1, 
  name: "T-shirts",
  maxQuantity: 100,    // ← Change this number
  quantityNote: "Order up to 100 pieces"  // ← Update this text too
}
```

To add size requirements to other products:

```javascript
{
  id: 2,
  name: "Mugs",
  requiresSize: true,  // ← Change to true
  sizes: ['Small', 'Medium', 'Large'],  // ← Add size options
}
```

---

## 🎯 Professional Features

✅ **Per-Product Quantities**
- Each product has its own quantity field
- Enables bulk ordering

✅ **Smart Size Field**
- Only shows when relevant
- Auto-validates for T-shirts

✅ **Quantity Limits**
- Prevents over-ordering
- Respects stock levels

✅ **Price Calculation**
- Automatic total calculation
- Shows per-product breakdown

✅ **Professional Formatting**
- Clear, intuitive form
- Helpful notes for users
- Validation messages

---

## 📝 Example Order Output

### In Google Forms:
```
Name: Maria Santos
Phone: 09987654321
Email: maria@example.com
Address: 456 Oak Ave, City

Products:
T-shirts (Qty: 3) - Size: M x PHP 450 = PHP 1,350
Mugs (Qty: 5) x PHP 320 = PHP 1,600
Keychain (Qty: 10) x PHP 150 = PHP 1,500

Total Quantity: 18
Total Price: PHP 4,450
Payment: GCash
Notes: Use light colors
```

### In Email:
```
NEW ORDER RECEIVED
==================
From: Maria Santos (09987654321, maria@example.com)
Delivery: 456 Oak Ave, City

Order Details:
• T-shirts (Qty: 3, Size: M) = PHP 1,350
• Mugs (Qty: 5) = PHP 1,600
• Keychain (Qty: 10) = PHP 1,500

Total: 18 items = PHP 4,450
Payment: GCash
Notes: Use light colors
```

---

## 🎉 Summary

Your order system now has:

✅ Professional quantity management
✅ Smart sizing for apparel
✅ Per-product controls
✅ Automatic validation
✅ Clear pricing breakdown
✅ Production-ready logic

Everything is handled automatically! 🚀
