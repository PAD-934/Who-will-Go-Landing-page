# Step-by-Step Setup for Google Forms (Beginner Friendly)

## What You Need to Do (Summary)

1. Create a Google Form with 9 questions
2. Get the Form ID and field ID numbers
3. Replace the configuration in the website code
4. Test it with a sample order

**Time needed:** About 10-15 minutes
**Difficulty:** Easy (just copy-paste)

---

## Step 1: Create Your Google Form

### A. Go to Google Forms

1. Open your browser
2. Go to: **https://forms.google.com**
3. Click the **+ (plus sign)** in top left
4. Click **Blank form**

### B. Name Your Form

1. Click "Untitled form" at top
2. Type: **Who Will Go - Order Form**
3. Below that, click "Form description" and type:
   ```
   Order form for merchandise and services
   ```

---

## Step 2: Add 9 Questions (Copy These Exactly)

### Question 1: Full Name

**In the form editor:**
1. Click the **+** button to add question
2. Where it says "Question", type: **Full Name**
3. Below that, select **Short answer** (should be default)
4. Make it required: Toggle the **Required** switch to ON
5. Click the ✓ checkmark

### Question 2: Phone Number

1. Click **+** to add new question
2. Question: **Phone Number**
3. Type: **Short answer**
4. Required: **ON** ✓
5. Click ✓

### Question 3: Email Address

1. Click **+**
2. Question: **Email Address**
3. Type: **Short answer**
4. Required: **ON** ✓
5. Click ✓

### Question 4: Delivery Address

1. Click **+**
2. Question: **Delivery Address (for pre-order items)**
3. Type: **Paragraph** (switch from Short answer)
4. Required: **ON** ✓
5. Click ✓

### Question 5: Which Products Are You Ordering?

1. Click **+**
2. Question: **Which products are you ordering? (Select all that apply)**
3. Type: **Checkboxes** (not Multiple choice)
4. Required: **ON** ✓
5. Now add these options (click "Add option" for each):
   - T-shirts
   - Mugs
   - String Bag
   - Keychain
   - Photobooth
   - Bookmark
   - Pins
   - Bamboo Notebook with Pen
   - Laser Engraving
   - Ptr. Adewale Booksfile

### Question 6: Size/Customization

1. Click **+**
2. Question: **Size/Customization Details (colors, sizes, specifications)**
3. Type: **Paragraph**
4. Required: **OFF** (leave unchecked)
5. Click ✓

### Question 7: Quantity

1. Click **+**
2. Question: **Quantity Needed**
3. Type: **Short answer**
4. Required: **ON** ✓
5. Click ✓

### Question 8: Payment Method

1. Click **+**
2. Question: **Preferred Payment Method**
3. Type: **Multiple choice** (drop-down list)
4. Required: **ON** ✓
5. Add these options:
   - Bank Transfer
   - GCash
   - PayPal
   - Cash on Delivery
   - Other

### Question 9: Special Notes

1. Click **+**
2. Question: **Special Notes or Instructions**
3. Type: **Paragraph**
4. Required: **OFF** (leave unchecked)
5. Click ✓

### ✅ Done with Form!

---

## Step 3: Make Sure Form is Ready to Receive Responses

1. In top right, click the **3-dot menu** (⋮)
2. Look for **"Accepting responses"** (should be green ✓)
3. If it says "Responses will be deleted", click it and select **"Accepting responses"**

---

## Step 4: Get Your Form's ID and Question IDs

### Find Your Form ID:

1. Look at the URL in your browser address bar
2. It looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSc_-PXZCU.../edit
   ```
3. Copy everything between `/d/e/` and `/edit`
4. Example:
   ```
   1FAIpQLSc_-PXZCU-JIw9RMsS5bwcLMq7ZTSmUBQMGtEaRBLA-Fx6Bzg
   ```
5. **Write this down** or copy to notepad

### Find Your Question IDs:

This is the tricky part. These are special numbers for each question.

**Easiest Method:**

1. Right-click on your form (anywhere)
2. Select **"Inspect"** or **"Inspect Element"**
3. A big box appears at bottom of screen
4. At the top of that box, find the search icon 🔍
5. Click it and type: **entry.**
6. Google will highlight lines with `entry.`
7. Each line shows a number like: `entry.1234567890`
8. Write down all the numbers in order (there will be 9)

**Your field IDs should look like:**
```
Question 1 (Full Name): 1743232616
Question 2 (Phone): 177811076
Question 3 (Email): 836049442
Question 4 (Address): 154821055
Question 5 (Products): 1796804161
Question 6 (Size): 409057574
Question 7 (Quantity): 1791107185
Question 8 (Payment): 83423007
Question 9 (Notes): 688366974
```

**Note:** Your numbers will be DIFFERENT! Don't use the examples above.

---

## Step 5: Update Your Website Code

### Open script.js File

1. Open your website files in a text editor (Notepad, VS Code, etc.)
2. Find the file: **script.js**
3. Open it
4. Use Ctrl+F to search for: **GOOGLE_FORM_CONFIG**

### Find This Section:

```javascript
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/YOUR_ID_HERE/formResponse',
  entryIds: {
    name: 'REPLACE_ME',
    phone: 'REPLACE_ME',
    email: 'REPLACE_ME',
    address: 'REPLACE_ME',
    products: 'REPLACE_ME',
    size: 'REPLACE_ME',
    qty: 'REPLACE_ME',
    payment: 'REPLACE_ME',
    notes: 'REPLACE_ME'
  }
};
```

### Replace With Your Information:

**Replace `YOUR_ID_HERE` with:**
The Form ID you copied (like: 1FAIpQLSc_-PXZCU...)

**Replace the `REPLACE_ME` with:**
Your Question IDs (like: 1743232616)

### Example:

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

### Save the File

Press **Ctrl+S** to save

---

## Step 6: Test Your Setup

### 1. Open Your Website

Open your website in a browser

### 2. Place a Test Order

1. Click on a product and add to cart
2. Add another product
3. Click "Proceed to Order Form"
4. Fill out all the fields:
   - Name: Test Customer
   - Phone: 09123456789
   - Email: test@example.com
   - Address: Test Address
   - Products: Check "T-shirts" and "Mugs"
   - Size/Customization: medium
   - Quantity: 1
   - Payment: GCash
   - Notes: This is a test

5. Click **Submit Order**

### 3. Check If It Worked

**You should see:**
- "Order submitted successfully!" message
- Screen changes to "Order Received!"

**Check your Google Form:**
1. Go back to your Google Form
2. Click the **Responses** tab
3. You should see your test order there!

---

## If Something Went Wrong

### Orders Not Appearing?

Check these things:

1. **Is your form accepting responses?**
   - Go to form
   - Should say "Accepting responses" (not "Responses will be deleted")

2. **Are the entry IDs correct?**
   - Count: Do you have 9 numbers?
   - Check if they match your form fields

3. **Did you save the script.js file?**
   - After editing, press Ctrl+S
   - Look for a save indicator

4. **Check browser console for errors:**
   - Press F12
   - Look at Console tab
   - Should show "✅ Order submitted successfully"

### Email Not Sending?

The email system is set up already, but:
- Check your spam folder
- Make sure it's not marked as spam

---

## You're Done! 🎉

Your website now:
- ✅ Takes orders
- ✅ Sends data to Google Forms
- ✅ Sends you email notification
- ✅ Shows confirmation to customer
- ✅ Stores all orders permanently

**Next Steps:**
1. Create a Google Sheet to track orders
2. Set up email alerts for new orders
3. Test with real customers!

---

## Quick Reference

**Your Form ID:** ___________________________

**Your 9 Question IDs:**
1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________
5. ___________________________
6. ___________________________
7. ___________________________
8. ___________________________
9. ___________________________

Keep this info safe! You might need it later.
