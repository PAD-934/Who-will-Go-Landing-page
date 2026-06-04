# 🔧 SYSTEM CONFIGURATION - SETUP INSTRUCTIONS

## ⚠️ Current Issue

When you click "Submit Order", you get:
```
SYSTEM NOT CONFIGURED. PLEASE CONTACT ADMINISTRATOR.
```

**Reason:** The `GOOGLE_APPS_SCRIPT_URL` in `script.js` is empty.

**Solution:** Follow these exact steps below.

---

## 📋 WHAT YOU NEED TO DO (3 Steps - 30 minutes)

### STEP 1: Create Google Sheet (5 minutes)

1. **Go to:** https://sheets.google.com
2. **Sign in** with your Google account
3. **Create new sheet** → Click "Create" → "Blank spreadsheet"
4. **Name it:** "Who Will Go - Orders"
5. **Add headers** in Row 1:
   ```
   Order ID | Timestamp | ISO Timestamp | Customer Name | Email | Phone | Address | Products | Total Items | Total Amount (PHP) | T-Shirt Size | Payment Method | Special Notes | Status
   ```
6. **Get your Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[COPY_THIS_ID]/edit
   ```
   **Save this ID** - you'll need it in Step 2.

---

### STEP 2: Deploy Google Apps Script (15 minutes)

1. **Go to:** https://script.google.com
2. **Click:** "New project"
3. **Create backend file:**
   - Right-click "Code.gs" → Delete
   - Click "+" → "New file"
   - Name: `Backend`
   - Click "Create"

4. **Copy this backend code** and paste it in the editor:

```javascript
/**
 * WHO WILL GO - GOOGLE APPS SCRIPT BACKEND
 * PRODUCTION-READY
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION - REPLACE THESE VALUES
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  // Your Google Sheet ID (from Step 1)
  SHEET_ID: 'YOUR_SHEET_ID_HERE',
  
  // Email where order notifications go
  ADMIN_EMAIL: 'your.email@gmail.com',
  
  // System settings
  ORDER_PREFIX: 'WWG',
  TIMEZONE: 'Asia/Manila'
};

/**
 * MAIN POST HANDLER
 * Entry point for order submissions
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!requestData.customerName || !requestData.email || !requestData.phone || !requestData.address || !requestData.products || !requestData.totalAmount) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid order data. Missing required fields.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Generate Order ID
    const orderId = generateOrderId();
    
    // Create order object
    const orderData = {
      orderId: orderId,
      timestamp: new Date().toLocaleString('en-PH', { timeZone: CONFIG.TIMEZONE }),
      customerName: requestData.customerName.trim(),
      email: requestData.email.toLowerCase().trim(),
      phone: requestData.phone.trim(),
      address: requestData.address.trim(),
      products: requestData.products,
      totalItems: requestData.totalItems,
      totalAmount: requestData.totalAmount,
      tshirtSize: requestData.tshirtSize || 'N/A',
      paymentMethod: requestData.paymentMethod,
      notes: (requestData.notes || '').trim(),
      status: 'Pending'
    };
    
    // Save to Google Sheets
    saveOrderToSheet(orderData);
    
    // Send emails
    try {
      sendAdminEmail(orderData);
      sendCustomerEmail(orderData);
    } catch (emailError) {
      Logger.log('Email warning: ' + emailError.toString());
    }
    
    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      orderId: orderId,
      message: 'Order received successfully!',
      timestamp: orderData.timestamp
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Server error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Generate Order ID: WWG-YYYYMMDD-SEQUENCE
 */
function generateOrderId() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName('Orders');
    const lastRow = sheet.getLastRow();
    const sequenceNumber = String(lastRow).padStart(6, '0');
    const date = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyyMMdd');
    return `${CONFIG.ORDER_PREFIX}-${date}-${sequenceNumber}`;
  } catch (e) {
    return `${CONFIG.ORDER_PREFIX}-${Date.now()}`;
  }
}

/**
 * Save order to Google Sheets
 */
function saveOrderToSheet(orderData) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = ss.getSheetByName('Orders');
    
    if (!sheet) {
      sheet = ss.insertSheet('Orders');
      // Add headers
      sheet.appendRow([
        'Order ID', 'Timestamp', 'Customer Name', 'Email', 'Phone', 'Address',
        'Products', 'Total Items', 'Total Amount (PHP)', 'T-Shirt Size', 
        'Payment Method', 'Special Notes', 'Status'
      ]);
      // Format header
      const headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground('#0D1B2A');
      headerRange.setFontColor('#C9A84C');
      headerRange.setFontWeight('bold');
    }
    
    // Format products
    const productList = orderData.products
      .map(p => `${p.name} x${p.quantity}`)
      .join('; ');
    
    // Append new row
    sheet.appendRow([
      orderData.orderId,
      orderData.timestamp,
      orderData.customerName,
      orderData.email,
      orderData.phone,
      orderData.address,
      productList,
      orderData.totalItems,
      orderData.totalAmount,
      orderData.tshirtSize,
      orderData.paymentMethod,
      orderData.notes,
      orderData.status
    ]);
    
  } catch (error) {
    Logger.log('Sheet save error: ' + error.toString());
    throw error;
  }
}

/**
 * Send admin notification email
 */
function sendAdminEmail(orderData) {
  const subject = `[New Order] ${orderData.orderId} - ${orderData.customerName}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <div style="background-color: #0D1B2A; padding: 20px; text-align: center; color: #C9A84C;">
        <h2>New Order Received</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h3>Order #${orderData.orderId}</h3>
        <p><strong>Customer:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.email}</p>
        <p><strong>Phone:</strong> ${orderData.phone}</p>
        <p><strong>Address:</strong> ${orderData.address}</p>
        
        <h3>Items Ordered</h3>
        ${orderData.products.map(p => `<p>${p.name} x${p.quantity} @ PHP ${p.price} = PHP ${p.price * p.quantity}</p>`).join('')}
        
        <h3>Total: PHP ${orderData.totalAmount.toLocaleString()}</h3>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Size:</strong> ${orderData.tshirtSize}</p>
        <p><strong>Notes:</strong> ${orderData.notes || 'None'}</p>
        
        <p style="margin-top: 20px; color: #666;">
          <a href="https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/edit">
            View all orders in Google Sheets
          </a>
        </p>
      </div>
    </div>
  `;
  
  GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, '', { htmlBody: htmlBody });
}

/**
 * Send customer confirmation email
 */
function sendCustomerEmail(orderData) {
  const subject = `Order Confirmation - #${orderData.orderId}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <div style="background-color: #0D1B2A; padding: 20px; text-align: center; color: #C9A84C;">
        <h2>Order Confirmation</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Dear ${orderData.customerName},</p>
        
        <p>Thank you for your order! Your Order ID is: <strong>${orderData.orderId}</strong></p>
        
        <h3>Order Summary</h3>
        ${orderData.products.map(p => `<p>${p.name} x${p.quantity} = PHP ${(p.price * p.quantity).toLocaleString()}</p>`).join('')}
        
        <h3 style="color: #C9A84C;">Total: PHP ${orderData.totalAmount.toLocaleString()}</h3>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Send payment to GCash: 0917-XXX-XXXX or scan QR code</li>
          <li>Reply to this email with payment screenshot</li>
          <li>We'll ship within 5-7 business days</li>
          <li>Tracking info will be sent via email</li>
        </ol>
        
        <p style="margin-top: 20px; color: #666; font-style: italic;">
          "Here am I. Send me!" - Isaiah 6:8
        </p>
        <p style="color: #999;">May God bless your generosity!</p>
      </div>
    </div>
  `;
  
  GmailApp.sendEmail(orderData.email, subject, '', { htmlBody: htmlBody });
}
```

5. **Update Configuration** in the code:
   - Find: `SHEET_ID: 'YOUR_SHEET_ID_HERE'`
   - Replace with: Your actual Sheet ID from Step 1
   - Find: `ADMIN_EMAIL: 'your.email@gmail.com'`
   - Replace with: Your actual email

6. **Save the file:** Ctrl+S

7. **Deploy as Web App:**
   - Click "Deploy" button (top right)
   - Select "New deployment"
   - Type: Choose "Web App"
   - Execute as: **Your Google account email**
   - Who has access: **Anyone**
   - Click "Deploy"

8. **Copy the Web App URL** that appears:
   ```
   https://script.google.com/macros/d/[COPY_THIS_LONG_ID]/usercopy
   ```
   **Save this URL** - you need it in Step 3.

---

### STEP 3: Update Your Website (10 minutes)

1. **Open:** `script.js` in your project folder

2. **Find this line** (around line 12):
   ```javascript
   const CONFIG = {
     GOOGLE_APPS_SCRIPT_URL: ''
   };
   ```

3. **Replace with your actual URL:**
   ```javascript
   const CONFIG = {
     GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/d/YOUR_ACTUAL_ID_HERE/usercopy'
   };
   ```

4. **Save the file:** Ctrl+S

5. **Refresh your browser:** F5 or Ctrl+Shift+R (clear cache)

---

## ✅ TEST IT NOW

1. **Open** `index.html` in your browser
2. **Fill in the form:**
   ```
   Name: Test Customer
   Email: YOUR_EMAIL@gmail.com  (use your actual email)
   Phone: 09171234567
   Address: 123 Test Street
   Products: Select any item (Qty: 1)
   Payment: GCash
   ```
3. **Click "Submit Order"**
4. **You should see:**
   - Loading spinner shows
   - Success message appears with Order ID
   - **Check your email** - you should receive TWO emails:
     - Admin notification (in ADMIN_EMAIL inbox)
     - Customer confirmation (in your email)
   - **Check Google Sheets** - new row should appear with order data

---

## 🚨 IF YOU GET ERRORS

### Error: "SYSTEM NOT CONFIGURED"
**Fix:** You didn't paste the Web App URL in script.js  
→ Follow Step 3 above exactly

### Error: "Google Apps Script URL still shows placeholder"
**Fix:** Paste the actual URL, not the placeholder  
→ Double-check you copied the entire URL correctly

### Error: "Sheet ID wrong"
**Fix:** Wrong Sheet ID in Google Apps Script CONFIG  
→ Go back to Step 1, copy the correct Sheet ID from URL

### Error: "Order doesn't appear in sheet"
**Fix:** Sheet name must be exactly "Orders" (capital O)  
→ Right-click sheet tab → Rename to "Orders"

### Error: "Email not received"
**Fix:** Check email spam folder or wait 2-3 minutes  
→ Also verify ADMIN_EMAIL is correct in backend

### Error: "Permission denied"
**Fix:** Google Apps Script needs authorization  
→ Click "Run" → Check permissions → Click "Allow"

---

## 🔍 VERIFICATION CHECKLIST

- [ ] Google Sheet created ("Who Will Go - Orders")
- [ ] Sheet ID copied and pasted in Google Apps Script
- [ ] Google Apps Script backend deployed as Web App
- [ ] Web App URL copied to script.js
- [ ] script.js saved after URL paste
- [ ] Browser cache cleared (F5 or Ctrl+Shift+R)
- [ ] Test order submitted
- [ ] Success message shows with Order ID
- [ ] Email received in inbox (check spam folder)
- [ ] Order appears in Google Sheets
- [ ] All fields match between form and sheet

---

## 📊 WHAT HAPPENS AFTER YOU TEST

1. **Order is submitted** → Script.js sends data to Google Apps Script
2. **Google Apps Script processes** → Validates, generates Order ID, saves to sheet
3. **Emails are sent** → Admin gets notification, customer gets confirmation
4. **Success shown** → You see Order ID on screen
5. **Data stored** → Everything saved in Google Sheets for review

---

## ✨ NOW YOU'RE READY!

Follow these 3 steps in order and your system will work perfectly. Once verified with a test order, you can:
- Share the website URL with supporters
- Start receiving real orders
- Track everything in Google Sheets
- Monitor via email notifications

**Total setup time: ~30 minutes**

---

## 📞 QUICK REFERENCE

| Item | Example |
|------|---------|
| Sheet ID | `1vB7Tz9mK4pQr2xL0_wN5fJh3uY8aI7sD-e9K2m4P3r5t` |
| Web App URL | `https://script.google.com/macros/d/1vB7Tz9mK4pQr2xL0_wN5fJh3uY8aI7sD/usercopy` |
| Admin Email | `your.email@gmail.com` |
| Order ID Format | `WWG-20240604-001234` |

---

**You've got this! Follow the steps exactly and it will work.** 🚀
