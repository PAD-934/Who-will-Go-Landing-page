# Quick Troubleshooting Guide
## Who Will Go Missionary Fundraising Platform

---

## Before You Start Troubleshooting

**Quick Checklist:**
- [ ] Have you updated CONFIG.GOOGLE_APPS_SCRIPT_URL in script.js?
- [ ] Have you updated SHEET_ID in Google Apps Script?
- [ ] Have you deployed Google Apps Script as Web App?
- [ ] Are you using the correct web app URL (the one from deployment)?
- [ ] Are you on a working internet connection?
- [ ] Is your Google account active and logged in?

---

## 🔴 Critical Issues

### Issue 1: "System not configured" error appears

**What you'll see:**
```
⚠️ System not configured. Please contact administrator.
```

**Likely cause:** CONFIG.GOOGLE_APPS_SCRIPT_URL is still set to the placeholder value.

**How to fix:**
1. Open `script.js`
2. Find: `const CONFIG = {`
3. Look for: `GOOGLE_APPS_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'`
4. Replace with your actual URL
   ```javascript
   GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/d/1A2B3C4D5E6F7G8H9I0J/usercopy'
   ```
5. Save the file
6. Refresh browser (Ctrl+R or Cmd+R)
7. Test again

**How to get your URL if you forgot:**
1. Go to [Google Apps Script dashboard](https://script.google.com)
2. Click on "Who Will Go Backend" project
3. Click "Deploy" → "Manage deployments"
4. Copy the URL from the Web App deployment

---

### Issue 2: "Network error. Please check your internet connection"

**What you'll see:**
```
❌ Network error. Please check your internet connection and try again.
```

**Likely causes (in order of probability):**
1. URL is incorrect
2. Internet is not working
3. Google Apps Script deployment was deleted
4. Browser is blocking the request

**How to fix:**

**Step 1:** Check your internet
- Try opening Google.com in a new tab
- If Google doesn't load, fix your internet first

**Step 2:** Verify the URL is correct
- Check for typos in CONFIG.GOOGLE_APPS_SCRIPT_URL
- Make sure it starts with `https://`
- Make sure it ends with `/usercopy`

**Step 3:** Test the URL directly
- Copy your GOOGLE_APPS_SCRIPT_URL
- Open it in a new tab (paste in address bar)
- You should see a blank page or error (that's normal)
- If you get a 404 error, the URL is wrong

**Step 4:** Check if Apps Script deployment exists
1. Go to [Google Apps Script dashboard](https://script.google.com)
2. Find "Who Will Go Backend" project
3. Click "Deploy" → "Manage deployments"
4. Do you see an active deployment?
5. If not, create new deployment:
   - Click "Deploy" → "New deployment"
   - Select type: "Web app"
   - Click "Deploy"

**Step 5:** Try a different browser
- Sometimes browser extensions block requests
- Try Chrome, Firefox, or Safari
- Try incognito/private mode

---

### Issue 3: Order submitted but doesn't appear in Google Sheets

**What happened:**
- No error message appeared
- Success screen showed
- But order not in Google Sheets

**Likely cause:** SHEET_ID is incorrect in Google Apps Script.

**How to fix:**

**Step 1:** Get your correct Sheet ID
1. Open your Google Sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/1A2b3C4d5E6f7G8h9I0j/edit#gid=0
   ```
3. Copy this part: `1A2b3C4d5E6f7G8h9I0j`

**Step 2:** Update in Google Apps Script
1. Go to [Google Apps Script dashboard](https://script.google.com)
2. Open "Who Will Go Backend" project
3. Find the CONFIG section at the top
4. Update: `SHEET_ID: '1A2b3C4d5E6f7G8h9I0j'`
5. Save (Ctrl+S)

**Step 3:** Redeploy (Important!)
1. Click "Deploy" → "Manage deployments"
2. Delete the old deployment (click trash icon)
3. Create new deployment:
   - Click "Deploy" → "New deployment"
   - Select "Web app"
   - Click "Deploy"
4. Copy the new URL

**Step 4:** Update script.js with new URL
1. Open script.js
2. Update CONFIG.GOOGLE_APPS_SCRIPT_URL with the new URL
3. Save

**Step 5:** Test again
- Submit a test order
- Check Google Sheets within 10 seconds

---

### Issue 4: No email received after submitting order

**What you expected:** Email in inbox from your system.

**What actually happened:** No email appears.

**Likely causes:**
1. Email is in spam folder
2. Email address is incorrect
3. Gmail is blocking automated emails

**How to fix:**

**Step 1:** Check spam folder
1. In Gmail, click "More" → "All mail"
2. Check spam folder (left sidebar)
3. Look for email from: "WWG Order System" or your Gmail address
4. If found: Move to inbox and mark "not spam"

**Step 2:** Verify email address is correct
1. Go to Google Apps Script project
2. Find CONFIG section
3. Check: `ADMIN_EMAIL: 'your-email@gmail.com'`
4. Make sure there are no typos or extra spaces

**Step 3:** Use Gmail address for testing
- Google Apps Script works best with Gmail
- If using work email, switch to personal Gmail for testing
- After confirming it works, you can use work email

**Step 4:** Enable "Less secure apps" (if using Gmail)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Scroll down to "Less secure app access"
3. Turn it ON
4. Note: This is only needed if emails aren't working

**Step 5:** Test with testEmail() function
1. In Google Apps Script editor
2. Paste this function:
   ```javascript
   function testEmail() {
     GmailApp.sendEmail(
       'your-email@gmail.com',
       'Test Email from Apps Script',
       'If you see this, emails are working!'
     );
   }
   ```
3. Click the function dropdown (top) and select "testEmail"
4. Click the Play button
5. Check your email within 30 seconds

---

## 🟡 Common Issues

### Issue 5: Order ID not displaying on success screen

**What you'll see:**
- Success screen appears
- But Order ID shows as blank

**Likely cause:** Order ID container is hidden.

**How to fix:**
1. Open index.html
2. Search for: `id="orderIdContainer"`
3. Change: `style="display:none;"`
4. To: `style="display:block;"`
5. Save
6. Refresh browser
7. Test again

**Or in script.js:**
1. Find the `showSuccess()` function
2. Make sure this line exists:
   ```javascript
   orderIdContainer.style.display = 'block';
   ```

---

### Issue 6: T-shirt size field not appearing when T-shirts selected

**What should happen:** When you check "T-shirts", a size dropdown appears.

**What actually happens:** Size field stays hidden.

**Likely cause:** updateSizeField() function not working.

**How to fix:**
1. Open script.js
2. Find: `function updateSizeField() {`
3. Make sure it contains:
   ```javascript
   const tshirtSelected = ... some.name === 'T-shirts' ...
   if (tshirtSelected) {
     document.getElementById('sizeGroup').style.display = 'block';
   }
   ```
4. Check that your form has a div with id="sizeGroup"

---

### Issue 7: Cart count not updating

**What should happen:** When you add items, cart shows "1", "2", "3", etc.

**What actually happens:** Cart count stays 0.

**Likely cause:** updateCart() function not being called.

**How to fix:**
1. In addToCart() function, check it calls updateCart()
2. Make sure it's not commented out
3. Example:
   ```javascript
   function addToCart(id) {
     // ... add to cart code ...
     updateCart();  // This line must exist
   }
   ```

---

### Issue 8: Form not clearing after submitting order

**What should happen:** After submitting, form resets to blank.

**What actually happens:** Old data still in form.

**Likely cause:** continueOrdering() not being called, or form fields not resetting.

**How to fix:**
1. Check that success message button has:
   ```html
   <button onclick="continueOrdering()">Place Another Order</button>
   ```
2. In continueOrdering(), check it includes:
   ```javascript
   document.getElementById('orderForm').reset();
   ```

---

### Issue 9: Double clicking submit creates duplicate orders

**What should happen:** Clicking submit twice has no effect.

**What actually happens:** Two orders created.

**Likely cause:** isSubmitting flag not working or not checked.

**How to fix:**
1. In submitOrder(), first line should be:
   ```javascript
   if (isSubmitting) {
     showToast('Please wait...');
     return;
   }
   ```
2. Before sending, set: `isSubmitting = true;`
3. After success/error, set: `isSubmitting = false;`

---

### Issue 10: Validation errors not showing

**What should happen:** When you submit with empty name, error appears.

**What actually happens:** No error, form submits anyway.

**Likely cause:** validateForm() not being called in submitOrder().

**How to fix:**
1. In submitOrder(), add before sending data:
   ```javascript
   const formErrors = validateForm();
   if (formErrors.length > 0) {
     showToast(formErrors[0]);
     return;
   }
   ```

---

## 🟢 Browser/Environment Issues

### Issue 11: Website looks different on phone

**What's expected:** Should look good on phones, tablets, and computers.

**What's happening:** Layout broken, text too small, buttons not clickable.

**Likely cause:** CSS not loading properly or viewport not set.

**How to fix:**
1. Check index.html has this line in `<head>`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. Hard refresh browser:
   - PC: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
3. Clear browser cache
4. Try different browser

### Issue 12: Styles not applying (colors wrong, layout broken)

**What's happening:** Website looks unstyled.

**Likely cause:** styles.css not loading.

**How to fix:**
1. Check styles.css file exists in same folder as index.html
2. In index.html, check this line exists in `<head>`:
   ```html
   <link rel="stylesheet" href="styles.css">
   ```
3. Make sure path is correct (if styles.css in subfolder, use: `href="css/styles.css"`)
4. Hard refresh: Ctrl+Shift+R

### Issue 13: Open browser developer tools shows errors

**How to open:**
- Press F12 (or Ctrl+Shift+I on Windows)
- Or right-click → "Inspect"
- Look at "Console" tab

**Common errors and fixes:**

**Error:** `Uncaught ReferenceError: submitOrder is not defined`
- Fix: Check onClick handlers have correct function name

**Error:** `Uncaught TypeError: Cannot read property 'value' of null`
- Fix: Check element IDs in HTML match what script.js is looking for
- Example: `getElementById('fname')` needs `<input id="fname">`

**Error:** `CORS error`
- Fix: This is expected - Apps Script handles CORS properly
- If blocking your requests, check Google Apps Script is deployed as "Anyone"

---

## 🔵 Setup Verification Checklist

Use this to verify everything is set up correctly:

**Google Sheets Setup:**
- [ ] Google Sheet created and named "Who Will Go - Orders"
- [ ] Sheet tab is named "Orders"
- [ ] Sheet ID copied
- [ ] Sheet is accessible (not deleted)

**Google Apps Script Setup:**
- [ ] Project created and named "Who Will Go Backend"
- [ ] GOOGLE_APPS_SCRIPT.gs code copied and pasted
- [ ] CONFIG.SHEET_ID updated with your sheet ID
- [ ] CONFIG.ADMIN_EMAIL updated with your email
- [ ] Script saved (Ctrl+S)
- [ ] Deployed as Web App
- [ ] Deployment is still active (not deleted)

**Website Setup:**
- [ ] All files (index.html, styles.css, script.js) in same folder
- [ ] script.js has CONFIG.GOOGLE_APPS_SCRIPT_URL set correctly
- [ ] Website opens in browser without JavaScript errors
- [ ] All form elements load properly

**Testing:**
- [ ] Can add products to cart
- [ ] Cart count updates
- [ ] Form validation works (empty fields show error)
- [ ] Can submit order without error
- [ ] Success message appears with Order ID
- [ ] Order appears in Google Sheets within 10 seconds
- [ ] Admin email received
- [ ] Customer confirmation email received

---

## Still Having Issues?

**Try these steps in order:**

1. **Clear everything and start fresh**
   - Hard refresh: Ctrl+Shift+R
   - Close all browser tabs with website
   - Wait 30 seconds
   - Open website again

2. **Check the browser console**
   - Press F12
   - Look at Console tab
   - Note any red errors
   - Try to match with errors in this guide

3. **Test Google Apps Script directly**
   - Go to [Google Apps Script dashboard](https://script.google.com)
   - Open "Who Will Go Backend"
   - At top, click function dropdown
   - Select "testSetup"
   - Click Play button (▶️)
   - Look for status in Execution Log at bottom

4. **Check network requests**
   - Press F12 → Network tab
   - Submit an order
   - Look for request to your Google Apps Script URL
   - Click it and check response
   - If red/failed, URL is wrong

5. **Verify credentials**
   - Make sure you're signed into the correct Google account
   - Check email address in Google Apps Script is correct
   - Check Sheet ID in Apps Script is correct

---

## When to Ask for Help

Contact your development team if:
- You've tried all steps above and still have issues
- You get unexpected errors not listed here
- The system worked before but now broken
- You need to modify the code significantly

**Include when asking for help:**
1. Screenshot of error message
2. Browser console errors (F12 → Console)
3. Exact steps you took to reproduce
4. What you expected vs. what happened
5. When this worked last (if ever)

---

## FAQ - Frequently Asked Questions

**Q: Can I change the Order ID format?**  
A: Yes! In Google Apps Script, find generateOrderId() and modify the format.

**Q: What if I want orders to go to multiple emails?**  
A: In sendAdminNotification(), add:
```javascript
GmailApp.sendEmail('email1@example.com', subject, '', {htmlBody});
GmailApp.sendEmail('email2@example.com', subject, '', {htmlBody});
```

**Q: Can I send SMS notifications instead of email?**  
A: Yes! You can integrate with Twilio, but that requires additional setup.

**Q: What's the maximum number of orders?**  
A: Google Sheets can handle millions. Practically unlimited.

**Q: Can I test without deploying?**  
A: You need to deploy as Web App to use fetch() from the browser.

**Q: How do I see all past orders?**  
A: They're all in your Google Sheet. Sort by date to see oldest/newest.

**Q: Can customers edit their orders?**  
A: Currently no - but you can add this feature later.

**Q: Is my customer data secure?**  
A: Yes - it's in Google Sheets (encrypted), and only people with access can see it.

---

## Success Indicators

**When everything is working, you should see:**
1. ✅ Website loads without console errors
2. ✅ Can add products to cart
3. ✅ Form validation shows errors for blank fields
4. ✅ Order submits successfully with Order ID displayed
5. ✅ New row appears in Google Sheets within 10 seconds
6. ✅ Admin email received with order details
7. ✅ Customer confirmation email received
8. ✅ Can place another order without issues
9. ✅ Order IDs are unique and sequential
10. ✅ All times displayed are correct for your timezone

**If all above are working, CONGRATULATIONS! 🎉**

Your Who Will Go missionary fundraising platform is fully operational and ready for customers!

---

*Last updated: June 4, 2024*  
*Who Will Go - Troubleshooting Guide v1.0*
