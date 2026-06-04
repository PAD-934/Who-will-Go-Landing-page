# ⚡ QUICK FIX - 30 MINUTES

## THE PROBLEM
```
[Submit Order Button]
         ↓
"SYSTEM NOT CONFIGURED. PLEASE CONTACT ADMINISTRATOR."
```

## THE CAUSE
Your `script.js` file has an EMPTY Web App URL:
```javascript
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: ''  // ← EMPTY! This is the problem
};
```

## THE SOLUTION - 3 SIMPLE STEPS

---

### ✅ STEP 1: Create Google Sheet (5 min)

**Go here:** https://sheets.google.com

**Do this:**
1. Click "Create" → "Blank spreadsheet"
2. Name it: `Who Will Go - Orders`
3. Add headers in row 1:
   ```
   Order ID | Timestamp | ISO Timestamp | Customer Name | Email | Phone | Address | Products | Total Items | Total Amount (PHP) | T-Shirt Size | Payment Method | Special Notes | Status
   ```
4. Copy your Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/[COPY_THIS]/edit
   ```

**Save the Sheet ID** - You'll need it next!

---

### ✅ STEP 2: Deploy Google Apps Script (15 min)

**Go here:** https://script.google.com

**Do this:**
1. Click "New project"
2. Delete "Code.gs" (right-click → delete)
3. Click "+" → "New file" → Name: "Backend"
4. **PASTE THIS CODE:**

```javascript
const CONFIG = {
  SHEET_ID: 'PASTE_YOUR_SHEET_ID_HERE',  // ← From Step 1
  ADMIN_EMAIL: 'your.email@gmail.com',    // ← Your email
  ORDER_PREFIX: 'WWG',
  TIMEZONE: 'Asia/Manila'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const orderId = 'WWG-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random()*1000000).toString().padStart(6,'0');
    
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = ss.getSheetByName('Orders');
    if (!sheet) {
      sheet = ss.insertSheet('Orders');
      sheet.appendRow(['Order ID', 'Timestamp', 'Customer Name', 'Email', 'Phone', 'Address', 'Products', 'Total Items', 'Total Amount (PHP)', 'T-Shirt Size', 'Payment Method', 'Special Notes', 'Status']);
    }
    
    const products = data.products.map(p => `${p.name} x${p.quantity}`).join('; ');
    sheet.appendRow([orderId, new Date().toLocaleString('en-PH', {timeZone: CONFIG.TIMEZONE}), data.customerName, data.email, data.phone, data.address, products, data.totalItems, data.totalAmount, data.tshirtSize, data.paymentMethod, data.notes, 'Pending']);
    
    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, '[New Order] ' + orderId + ' - ' + data.customerName, 'New order received. Check Google Sheets for details.');
    GmailApp.sendEmail(data.email, 'Order Confirmation - #' + orderId, 'Thank you! Order ID: ' + orderId + '. Send payment to GCash.');
    
    return ContentService.createTextOutput(JSON.stringify({success: true, orderId: orderId, message: 'Order received!'})).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({success: false, message: e.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. **Replace these two things in the code:**
   - `SHEET_ID: 'PASTE_YOUR_SHEET_ID_HERE'` → Paste your actual Sheet ID
   - `ADMIN_EMAIL: 'your.email@gmail.com'` → Your actual email

6. **Press Ctrl+S to save**

7. **Click "Deploy"** → "New deployment"
   - Type: "Web App"
   - Execute as: **Your Gmail account**
   - Who has access: **Anyone**
   - Click "Deploy"

8. **You'll see:**
   ```
   Deployment ID: ... 
   New URL: https://script.google.com/macros/d/[LONG_ID]/usercopy
   ```
   
**COPY THAT URL** - You need it next!

---

### ✅ STEP 3: Fix Your Website (10 min)

**Open:** `script.js` in your project folder

**Find this section** (around line 12):
```javascript
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: ''
};
```

**Replace with your actual URL:**
```javascript
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/d/YOUR_LONG_ID_HERE/usercopy'
};
```

**Example (your URL will be different):**
```javascript
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/d/1vB7Tz9mK4pQr2xL0_wN5fJh3uY8aI7sD/usercopy'
};
```

**Press Ctrl+S to save**

**Refresh your browser:** Press F5 or Ctrl+Shift+R (clears cache)

---

## 🧪 TEST IT NOW

1. **Open** `index.html` in your browser
2. **Fill the form:**
   ```
   Name: Test Customer
   Email: YOUR_ACTUAL_EMAIL@gmail.com
   Phone: 09171234567
   Address: 123 Test St
   Product: Any item (Qty 1)
   Payment: GCash
   ```
3. **Click "Submit Order"**
4. **You should see:**
   - ✅ Loading spinner
   - ✅ Success message with Order ID
   - ✅ Email arrives (check inbox + spam folder)
   - ✅ Order in Google Sheets

---

## ❌ STILL NOT WORKING?

**"System not configured" error?**
- ✓ Did you paste the Web App URL?
- ✓ Did you save script.js?
- ✓ Did you refresh the browser?

**"Network error"?**
- ✓ Is Web App URL correct?
- ✓ Does it end with `/usercopy`?
- ✓ Is Google Apps Script deployed?

**"Email not received"?**
- ✓ Check spam folder
- ✓ Wait 2-3 minutes
- ✓ Check ADMIN_EMAIL is correct

**Order not in sheet?**
- ✓ Sheet must be named exactly "Orders"
- ✓ Sheet ID must be correct
- ✓ Check Google Apps Script for errors

---

## 📋 COPY-PASTE CHECKLIST

```
From Step 1 (Google Sheet):
SHEET_ID: ___________________________________

From Step 2 (Google Apps Script):
WEB_APP_URL: ___________________________________

In Step 3 (script.js):
Pasted: ___________________________________
Saved: [ ]
Browser refreshed: [ ]
```

---

## ✨ THAT'S IT!

You now have:
- ✅ Google Sheet (database)
- ✅ Google Apps Script (backend)
- ✅ Updated website (frontend)
- ✅ All connected together

**Total time: 30 minutes**

Orders will now flow automatically:
```
Customer → Website → Google Apps Script → Google Sheet + Emails
```

**You're ready to go live!** 🚀
