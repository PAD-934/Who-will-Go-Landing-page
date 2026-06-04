# Google Forms Configuration - QUICK REFERENCE

## COPY THIS EXACT FORM STRUCTURE

### Step 1: Create Google Form
```
Go to: https://forms.google.com
Click: "+" Create new form
Name: Who Will Go - Order Form
Description: Order form for merchandise and services
```

---

## FIELDS TO ADD (IN THIS ORDER)

### FIELD 1
**Question:** Full Name
**Type:** Short answer
**Required:** Yes ✓

### FIELD 2
**Question:** Phone Number
**Type:** Short answer
**Required:** Yes ✓

### FIELD 3
**Question:** Email Address
**Type:** Short answer
**Required:** Yes ✓

### FIELD 4
**Question:** Delivery Address (for pre-order items)
**Type:** Paragraph
**Required:** Yes ✓

### FIELD 5
**Question:** Which products are you ordering? (Select all that apply)
**Type:** Checkboxes
**Required:** Yes ✓
**Options (one per line):**
```
T-shirts
Mugs
String Bag
Keychain
Photobooth
Bookmark
Pins
Bamboo Notebook with Pen
Laser Engraving
Ptr. Adewale Booksfile
```

### FIELD 6
**Question:** Size/Customization Details (colors, sizes, specifications)
**Type:** Paragraph
**Required:** No

### FIELD 7
**Question:** Quantity Needed
**Type:** Short answer
**Required:** Yes ✓

### FIELD 8
**Question:** Preferred Payment Method
**Type:** Multiple choice
**Required:** Yes ✓
**Options:**
```
Bank Transfer
GCash
PayPal
Cash on Delivery
Other
```

### FIELD 9
**Question:** Special Notes or Instructions
**Type:** Paragraph
**Required:** No

---

## HOW TO GET YOUR ENTRY IDs

### Method 1: View Page Source (Easiest)

1. Open your Google Form
2. Right-click anywhere → "View page source"
3. Press Ctrl+F
4. Search for: `"entry.`
5. You'll see multiple lines like:
   ```
   <input name="entry.1234567890" ...
   <input name="entry.9876543210" ...
   ```
6. Copy all the numbers

**Your form field numbers:**
- Field 1 (Full Name): entry.________
- Field 2 (Phone): entry.________
- Field 3 (Email): entry.________
- Field 4 (Address): entry.________
- Field 5 (Products): entry.________
- Field 6 (Size): entry.________
- Field 7 (Quantity): entry.________
- Field 8 (Payment): entry.________
- Field 9 (Notes): entry.________

### Method 2: Browser Inspector

1. Open your Form in browser
2. Press F12 (opens DevTools)
3. Press Ctrl+Shift+C (element picker)
4. Click on each form field
5. In the code, look for `name="entry.XXXXX"`
6. Write down each number

---

## GET YOUR FORM URL

1. Open your Google Form
2. Look at URL bar at top
3. It looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSc_-PXZCU-JIw9RMsS5bwcLMq7ZTSmUBQMGtEaRBLA-Fx6Bzg/edit
   ```
4. Copy the long ID between `/d/e/` and `/edit`
5. Your Form URL is:
   ```
   https://docs.google.com/forms/d/e/[PASTE_YOUR_ID_HERE]/formResponse
   ```

---

## UPDATE YOUR script.js

Find this line in `script.js`:

```javascript
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse',
  entryIds: {
    name: 'YOUR_FIELD_1_ID',
    phone: 'YOUR_FIELD_2_ID',
    email: 'YOUR_FIELD_3_ID',
    address: 'YOUR_FIELD_4_ID',
    products: 'YOUR_FIELD_5_ID',
    size: 'YOUR_FIELD_6_ID',
    qty: 'YOUR_FIELD_7_ID',
    payment: 'YOUR_FIELD_8_ID',
    notes: 'YOUR_FIELD_9_ID'
  }
};
```

**Replace with YOUR actual IDs:**

Example (YOUR numbers will be different):
```javascript
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
```

---

## VERIFY YOUR FORM IS "ACCEPTING RESPONSES"

1. Open your Google Form
2. Look for **Responses** tab (near top)
3. You should see:
   - "Accepting responses" ✓
   
   NOT "Responses will be deleted" ✗

4. If not accepting:
   - Click the three dots ⋮
   - Select "Accepting responses"

---

## TEST YOUR SETUP

1. Go to your website
2. Add items to cart
3. Click "Proceed to Order Form"
4. Fill out form:
   ```
   Name: Test Order
   Phone: 09123456789
   Email: test@example.com
   Address: Test Address Here
   Products: Check "T-shirts" and "Mugs"
   Size: Medium/Large
   Qty: 1
   Payment: GCash
   Notes: Test
   ```
5. Click "Submit Order"
6. Should see: "Order submitted successfully!"
7. Check your Google Form → Responses tab
8. You should see the test entry!

---

## COMMON MISTAKES TO AVOID

❌ **Wrong:** Leaving form in Draft mode
✅ **Right:** Setting to "Accepting responses"

❌ **Wrong:** Copy-pasting wrong entry IDs
✅ **Right:** Getting IDs from YOUR form

❌ **Wrong:** Using old form URL
✅ **Right:** Getting URL from YOUR form

❌ **Wrong:** Adding extra fields to form
✅ **Right:** Using EXACTLY these 9 fields

❌ **Wrong:** Putting fields in wrong order
✅ **Right:** Following the order above

---

## TROUBLESHOOTING CHECKLIST

- [ ] Form is "Accepting responses"?
- [ ] All 9 fields are in correct order?
- [ ] Entry IDs are copied correctly?
- [ ] Form URL is correct?
- [ ] Browser console shows "Order submitted successfully"?
- [ ] Data appears in Google Forms Responses tab?

---

## GETTING PROFESSIONAL ABOUT IT

Once you confirm test data appears:

### Create a Google Sheet for Analysis

1. Open your Google Form
2. Click **Responses** tab
3. Click the **Spreadsheet icon** (green)
4. Click "Create new spreadsheet"
5. All future responses auto-populate here!

### Create Email Alerts

1. In Google Sheet
2. Tools → Notification rules
3. Choose: "Any changes"
4. Choose: "Email immediately"
5. New orders alert you instantly!

---

## YOUR FORM IS READY!

Once all setup is complete:
- ✅ Orders stored in Google Forms
- ✅ Orders backed up in Google Sheet
- ✅ Email notifications sent
- ✅ Professional data tracking
- ✅ Easy CSV export anytime
- ✅ Zero server costs

**Your system is production-ready!**

Need help? Open browser console (F12) and check logs when submitting a test order.
