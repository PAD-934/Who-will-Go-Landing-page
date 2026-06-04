# HOW THE CODE WORKS - Beginner's Learning Guide
## Understanding Your Who Will Go Fundraising Platform

---

## Introduction

Welcome! This guide explains **how the code works** in a beginner-friendly way. You don't need to be a programmer to understand this - just curious!

Think of your website like a restaurant:
- **Customer (Browser)** = Person placing an order
- **Website (HTML/CSS/JS)** = Order taker (takes the order)
- **Google Apps Script** = Kitchen (processes the order)
- **Google Sheets** = Inventory (stores all orders)
- **Email** = Receipt (confirms to customer)

---

## Part 1: The Website (What Customer Sees)

### index.html - The Skeleton

`index.html` is like the **blueprint of a house**. It defines:
- Where things go (layout)
- What text appears
- Where buttons are located
- What form fields exist

**Key sections:**
```html
<h1>Who Will Go</h1>           <!-- Title -->
<div id="shop">                <!-- Shop section -->
  <div class="product-card">   <!-- Product card -->
<form id="orderForm">          <!-- Order form -->
```

### styles.css - The Decoration

`styles.css` is like **paint and furniture**. It defines:
- Colors (gold #C9A84C, dark blue #0D1B2A)
- Fonts
- Spacing
- Responsive design (looks good on phones)

### script.js - The Brain

`script.js` contains the **JavaScript** - the logic that makes things interactive.

---

## Part 2: Understanding script.js (The Code)

### 2.1 Configuration (Top of File)

```javascript
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/d/1A2B3C/usercopy'
};
```

**What it does:** Stores the address where your backend lives.

**Analogy:** Like an address book entry for the kitchen.

### 2.2 State Management

```javascript
let cart = [];           // Array to store items customer selected
let isSubmitting = false;  // Flag: "Are we currently sending an order?"
let currentOrderId = null; // Stores the Order ID returned from server
```

**What it does:** Remembers information while the website is open.

**Analogy:** 
- `cart` = Your shopping basket
- `isSubmitting` = "Is someone currently processing this?"
- `currentOrderId` = Your receipt number

### 2.3 Main Process: Submitting an Order

When customer clicks "Submit Order":

```
1. submitOrder() function runs
   ↓
2. Check if already submitting (prevent double click)
   ↓
3. Validate form fields (name, email, phone, address)
   ↓
4. Validate products (at least 1 selected, quantities valid)
   ↓
5. Collect order data into an object
   ↓
6. Send to Google Apps Script using fetch()
   ↓
7. Wait for response
   ↓
8. Show success message or error
```

### 2.4 Validation Functions

#### validateForm()
```javascript
function validateForm() {
  const errors = [];
  
  const name = document.getElementById('fname').value.trim();
  if (!name || name.length < 3) {
    errors.push('Full name must be at least 3 characters');
  }
  
  return errors;
}
```

**What it does:** Checks if customer entered valid information.

**Checks:**
- Name ≥ 3 characters
- Phone ≥ 7 characters
- Email has @ and domain
- Address is not empty
- Payment method selected

#### validateProducts()
```javascript
function validateProducts() {
  const errors = [];
  
  if (selectedItems.length === 0) {
    errors.push('Please select at least one product');
  }
  
  return errors;
}
```

**What it does:** Checks if customer selected valid products.

**Checks:**
- At least 1 product selected
- Quantities are within min/max
- If T-shirts selected, size is specified

### 2.5 Sending Data to Backend

```javascript
async function submitToGoogleSheets(orderData) {
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
  }
}
```

**What it does:** Sends order to the backend (like calling the kitchen).

**Step by step:**
1. `fetch()` = Internet call
2. `method: 'POST'` = Sending data (like mailing a package)
3. `JSON.stringify()` = Convert data to text format
4. `await` = Wait for response before continuing
5. `response.json()` = Read the response
6. Check if successful, then show success message

**Analogy:** Like using a telephone:
- You call (fetch)
- You say what you want (POST)
- You wait for them to respond (await)
- You listen to their response (response.json())

### 2.6 Handling Cart Operations

```javascript
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);
  
  if (existing) {
    existing.qty += 1;  // Already in cart, increase quantity
  } else {
    cart.push({...product, qty: 1});  // New item, add to cart
  }
  
  updateCart();  // Refresh display
}
```

**What it does:** Adds item to shopping cart.

**Process:**
1. Find the product from products array
2. Check if already in cart
3. If yes: add 1 to quantity
4. If no: add new item with qty=1
5. Update display (cart count, total price, etc.)

### 2.7 Showing Success Message

```javascript
function showSuccess() {
  document.getElementById('orderForm').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';
  
  const orderIdEl = document.getElementById('displayOrderId');
  if (orderIdEl && currentOrderId) {
    orderIdEl.textContent = currentOrderId;
  }
  
  showToast('Order received!');
}
```

**What it does:** Shows the success screen to customer.

**Process:**
1. Hide the order form
2. Show the success message
3. Display the Order ID
4. Show a toast notification (temporary message)

---

## Part 3: Understanding Google Apps Script Backend

### 3.1 What is Google Apps Script?

**Google Apps Script** is:
- JavaScript that runs on Google's servers (not your browser)
- Can access Google Sheets, Gmail, Calendar, etc.
- Secure - runs on Google's infrastructure
- Free to use

**Analogy:** It's like hiring a worker that lives at Google's office to do work for you.

### 3.2 Main Function: doPost()

```javascript
function doPost(e) {
  // 1. Receive data from website
  const data = JSON.parse(e.postData.contents);
  
  // 2. Validate data
  const errors = validateOrderData(data);
  if (errors.length > 0) {
    return createJsonResponse({success: false, errors: errors}, 400);
  }
  
  // 3. Generate Order ID
  const orderId = generateOrderId();
  
  // 4. Create order object
  const orderData = {...data, orderId: orderId, timestamp: new Date()};
  
  // 5. Save to Google Sheets
  saveOrderToSheet(orderData);
  
  // 6. Send admin email
  sendAdminNotification(orderData);
  
  // 7. Send customer confirmation
  sendCustomerConfirmation(orderData);
  
  // 8. Return success response
  return createJsonResponse({
    success: true,
    orderId: orderId,
    message: 'Order received successfully'
  });
}
```

**What it does:** This is the main function that receives the order from your website.

**Process (like a restaurant kitchen):**
1. **Receive** - Get the order from frontend
2. **Check** - Verify all information is correct
3. **Generate ID** - Create unique order number
4. **Save** - Write to Google Sheets (record)
5. **Email** - Send notifications
6. **Respond** - Tell frontend it worked

### 3.3 Validation

```javascript
function validateOrderData(data) {
  const errors = [];
  
  if (!data.customerName || data.customerName.length < 3) {
    errors.push('Name must be at least 3 characters');
  }
  
  if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
}
```

**Why two validations?** (Frontend AND Backend)

```
Browser Validation (Client-Side):
✓ Fast (immediate feedback)
✓ Better user experience
✗ Can be bypassed (tech-savvy user)

Server Validation (Backend):
✓ Can't be bypassed (more secure)
✓ Double-checks integrity
✗ Slower (needs internet)
```

**Best Practice:** Always do both!

### 3.4 Order ID Generation

```javascript
function generateOrderId() {
  const today = new Date().toLocaleDateString('en-CA');  // YYYY-MM-DD
  const ordersSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
    .getSheetByName('Orders');
  
  const lastRow = ordersSheet.getLastRow();
  const sequence = (lastRow).toString().padStart(6, '0');
  
  return `${CONFIG.ORDER_PREFIX}-${today}-${sequence}`;
}
```

**Output example:** `WWG-20240604-000001`

**Breakdown:**
- `WWG` = Order prefix (Who Will Go)
- `20240604` = Date (2024-06-04)
- `000001` = Sequence number (1st order)

### 3.5 Saving to Google Sheets

```javascript
function saveOrderToSheet(orderData) {
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
    .getSheetByName('Orders');
  
  sheet.appendRow([
    orderData.orderId,
    orderData.timestamp,
    orderData.customerName,
    orderData.email,
    orderData.phone,
    orderData.address,
    formatProducts(orderData.products),
    orderData.totalItems,
    orderData.totalAmount,
    orderData.tshirtSize,
    orderData.paymentMethod,
    orderData.notes,
    'Pending'
  ]);
}
```

**What it does:** Adds a new row to Google Sheets with all order information.

**Column layout:**
1. Order ID
2. Timestamp
3. Customer Name
4. Email
5. Phone
6. Address
7. Products
8. Total Items
9. Total Amount
10. T-Shirt Size
11. Payment Method
12. Notes
13. Status

### 3.6 Email Notifications

#### Admin Email
```javascript
function sendAdminNotification(orderData) {
  const subject = `[New Order] ${orderData.orderId} - ${orderData.customerName}`;
  
  const htmlBody = `
    <h2>New Order Received</h2>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    <p><strong>Customer:</strong> ${orderData.customerName}</p>
    <p><strong>Email:</strong> ${orderData.email}</p>
    <p><strong>Phone:</strong> ${orderData.phone}</p>
    ...more details...
  `;
  
  GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, '', {
    htmlBody: htmlBody
  });
}
```

**What it does:** Sends email to admin (you) with order details.

**Email includes:**
- Order ID
- Customer information
- Products ordered
- Total amount
- Payment method
- Link to spreadsheet

#### Customer Confirmation Email
```javascript
function sendCustomerConfirmation(orderData) {
  const subject = `Order Confirmation - #${orderData.orderId}`;
  
  const htmlBody = `
    <h2>Order Received!</h2>
    <p>Dear ${orderData.customerName},</p>
    <p>Thank you for your order!</p>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    ...next steps...
  `;
  
  GmailApp.sendEmail(orderData.email, subject, '', {
    htmlBody: htmlBody
  });
}
```

**What it does:** Sends confirmation to customer with order details and next steps.

---

## Part 4: Data Flow (The Complete Journey)

### Example: Customer Places an Order

```
STEP 1: Customer enters data in browser
├─ Name: John Doe
├─ Email: john@example.com
├─ Products: 2x T-shirts, 1x Mug
└─ Total: PHP 1,220

        ↓

STEP 2: script.js validates locally (Fast feedback)
├─ Check name length ✓
├─ Check email format ✓
├─ Check products selected ✓
└─ All valid → Send to backend

        ↓

STEP 3: fetch() sends to Google Apps Script
└─ HTTPS POST request to Web App URL

        ↓

STEP 4: doPost() receives and processes
├─ Parse incoming JSON
├─ Validate again (Security!)
├─ Generate Order ID: WWG-20240604-001234
└─ Create order object with all details

        ↓

STEP 5: Save to Google Sheets
└─ New row added with:
   - Order ID
   - Timestamp
   - Customer info
   - Products
   - Total amount

        ↓

STEP 6: Send emails
├─ Email to admin:
│  Subject: [New Order] WWG-20240604-001234 - John Doe
│  Content: Full order details
│
└─ Email to customer:
   Subject: Order Confirmation - #WWG-20240604-001234
   Content: Thank you message + next steps

        ↓

STEP 7: Return response to browser
└─ { success: true, orderId: "WWG-20240604-001234" }

        ↓

STEP 8: Browser shows success
├─ Hide form
├─ Show success message
├─ Display Order ID: WWG-20240604-001234
└─ Show "Order received" toast
```

---

## Part 5: Common Code Patterns

### 5.1 Finding Elements in HTML

```javascript
document.getElementById('fname')        // Get by ID
document.querySelector('.btn-primary')  // Get by CSS selector
document.querySelectorAll('.product')   // Get all matching elements
```

**Analogy:** Like finding a specific book in a library.

### 5.2 Event Listeners

```javascript
button.addEventListener('click', submitOrder);
// When button is clicked, run submitOrder function
```

**Analogy:** Like a doorbell - when pressed, someone answers.

### 5.3 Array Operations

```javascript
cart.push(item);           // Add item to cart
cart.find(p => p.id === 1);  // Find first item with id=1
cart.filter(p => p.qty > 0); // Get all items with qty > 0
cart.map(p => p.price);      // Get all prices as new array
```

**Analogy:** Like operations on a to-do list:
- push = Add task
- find = Search for task
- filter = Show only completed tasks
- map = Transform all tasks

### 5.4 Async/Await (Waiting for Responses)

```javascript
async function submitOrder(orderData) {
  const response = await fetch(URL, {method: 'POST'});
  // Code here runs AFTER fetch completes
}
```

**Why "async"?**
- Without it: Code keeps running while waiting (bad)
- With it: Code waits for response before continuing (good)

**Analogy:** Like ordering at a restaurant:
- Without await: "I'll order! *leaves immediately*"
- With await: "I'll order... *waits for acknowledgment*"

---

## Part 6: Glossary of Terms

| Term | Explanation | Example |
|------|-------------|---------|
| **Variable** | Container storing information | `let cart = []` |
| **Function** | Reusable block of code | `function addToCart() {}` |
| **Array** | List of items | `[1, 2, 3]` or `[product1, product2]` |
| **Object** | Collection of properties | `{name: 'John', age: 25}` |
| **Event** | User action (click, submit, type) | Button click, form submit |
| **DOM** | The HTML elements on the page | `document.getElementById()` |
| **API** | Way for programs to talk | Google Apps Script Web App |
| **Fetch** | Internet request to another computer | Sending order to backend |
| **JSON** | Standard format for sending data | `{"name": "John", "age": 25}` |
| **Async** | Asynchronous - wait for something | Waiting for fetch response |
| **Error Handling** | What to do if something goes wrong | try/catch block |
| **Validation** | Checking if data is correct | Name must be ≥3 chars |
| **HTTPS** | Secure internet connection | 🔒 in browser address |

---

## Part 7: How the System Prevents Bugs

### Problem 1: Double Submission

**The Problem:** What if customer clicks "Submit" twice?
```
Click 1: Order sent ✓
Click 2: Order sent again ✗ (Duplicate!)
```

**The Solution:**
```javascript
if (isSubmitting) {
  showToast('Please wait...');
  return;  // Stop if already submitting
}

isSubmitting = true;  // Set flag
// ... send order ...
isSubmitting = false; // Reset after done
```

**Result:** Button click 2 is ignored because `isSubmitting` is true.

### Problem 2: Invalid Data

**The Problem:** Customer enters "abc" for phone (not a real number)
```
Phone: abc ← Invalid!
```

**The Solution:**
```javascript
if (phone.length < 7) {
  showToast('Phone must be at least 7 digits');
  return;  // Don't send invalid data
}
```

**Result:** Customer sees error message and can fix it.

### Problem 3: Network Error

**The Problem:** Internet disconnects while sending order
```
Order sent ... but no response
Customer thinks it didn't work
```

**The Solution:**
```javascript
try {
  const response = await fetch(URL);
  // ... process response ...
} catch (error) {
  showToast('Network error. Try again.');
  isSubmitting = false;
}
```

**Result:** Customer sees error message and can retry.

---

## Part 8: How to Modify the Code

### Changing Product Prices

Find this section in script.js:
```javascript
const products = [
  {
    id: 1,
    name: 'T-shirts',
    price: 450,      // ← Change this
    category: 'pre-order',
    ...
  }
];
```

### Adding a New Product

Add to the products array:
```javascript
{
  id: 11,  // New ID
  name: 'New Product Name',
  price: 199,
  category: 'pre-order',
  icon: '📦',
  maxQuantity: 50
}
```

### Changing Admin Email

In GOOGLE_APPS_SCRIPT.gs:
```javascript
ADMIN_EMAIL: 'newemail@example.com'  // ← Change this
```

### Changing Timezone

In GOOGLE_APPS_SCRIPT.gs:
```javascript
TIMEZONE: 'Asia/Manila'  // ← Change to your timezone
```

---

## Part 9: Testing and Debugging

### 1. Check Browser Console

Press **F12** to open Developer Tools.

**Look for:**
- Red errors (problems)
- Yellow warnings (not critical)
- Blue logs (informational)

### 2. Test Each Step

1. Add product to cart
2. Open form
3. Enter customer info
4. Submit order
5. Check success message
6. Check Google Sheets
7. Check email inbox

### 3. Common Errors

**Error:** `Cannot read property 'value' of null`
- **Cause:** Element doesn't exist in HTML
- **Fix:** Check element ID matches in HTML and JS

**Error:** `CORS error`
- **Cause:** Request blocked by browser
- **Fix:** Ensure Google Apps Script is shared as "Anyone"

**Error:** `JSON.parse error`
- **Cause:** Response isn't valid JSON
- **Fix:** Check Google Apps Script is returning proper JSON

---

## Part 10: Learning Resources

### Understanding JavaScript Better

- [MDN JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/)
- [Codecademy JavaScript Course](https://www.codecademy.com/learn/introduction-to-javascript)

### Understanding Google Apps Script

- [Google Apps Script Documentation](https://developers.google.com/apps-script/guides)
- [Google Sheets API Guide](https://developers.google.com/sheets/api)
- [Gmail API Guide](https://developers.google.com/gmail/api)

### Understanding APIs and Fetch

- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [REST API Basics](https://www.codecademy.com/articles/what-is-rest)

---

## Summary

**You've learned:**
1. ✅ How the frontend works (HTML/CSS/JS)
2. ✅ How the backend works (Google Apps Script)
3. ✅ How data flows between them
4. ✅ How validation keeps the system safe
5. ✅ How to modify the code
6. ✅ How to debug problems

**Key Takeaways:**
- Frontend = User interface (what customer sees)
- Backend = Server logic (what happens behind scenes)
- Validation = Safety checks (both frontend and backend)
- Email = Confirmation (for customer and admin)
- Google Sheets = Database (stores all data)

**Next Steps:**
1. Play with the code - change things and see what happens
2. Read the comments in script.js and GOOGLE_APPS_SCRIPT.gs
3. Try adding a new product
4. Try changing colors in styles.css
5. Ask yourself: "What if I...?" and experiment!

---

**Remember:** Every expert programmer started as a beginner. The only way to learn is by doing! 🚀

*Last updated: June 4, 2024*  
*Who Will Go - Learning Guide v1.0*
