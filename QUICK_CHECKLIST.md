# ⚡ QUICK ACTION CHECKLIST

**Time to set up:** ~15 minutes
**Difficulty:** Easy ✓

---

## 📝 YOUR ACTION ITEMS

### TODAY - Do These 5 Things:

#### ☐ 1. CREATE GOOGLE FORM (5 min)
- [ ] Go to https://forms.google.com
- [ ] Click "+" Create blank form
- [ ] Name: "Who Will Go - Order Form"
- [ ] Add 9 fields (use **BEGINNER_SETUP.md** for exact instructions)

**Note:** The form needs these 9 fields IN THIS ORDER:
1. Full Name (Short answer)
2. Phone Number (Short answer)
3. Email Address (Short answer)
4. Delivery Address (Paragraph)
5. Which products are you ordering? (Checkboxes - with all 10 product names)
6. Size/Customization Details (Paragraph)
7. Quantity Needed (Short answer)
8. Preferred Payment Method (Multiple choice)
9. Special Notes or Instructions (Paragraph)

#### ☐ 2. SET FORM TO ACCEPT RESPONSES (1 min)
- [ ] Open your Google Form
- [ ] Look at top - should say "Accepting responses" ✓
- [ ] If not, click "⋮" menu → select "Accepting responses"

#### ☐ 3. GET YOUR FORM'S ID (1 min)
- [ ] Look at URL bar: `https://docs.google.com/forms/d/e/XXXXX.../edit`
- [ ] Copy everything between `/d/e/` and `/edit`
- [ ] Write it down: `_____________________`

#### ☐ 4. GET YOUR FIELD IDs (2 min)
- [ ] Right-click your form → "Inspect"
- [ ] Press Ctrl+F, type: `entry.`
- [ ] Copy all 9 numbers you see
- [ ] Write them down (in order):

```
1. Full Name:              ___________________
2. Phone:                  ___________________
3. Email:                  ___________________
4. Address:                ___________________
5. Products:               ___________________
6. Size:                   ___________________
7. Quantity:               ___________________
8. Payment:                ___________________
9. Notes:                  ___________________
```

#### ☐ 5. UPDATE YOUR WEBSITE CODE (3 min)
- [ ] Open **script.js** in text editor
- [ ] Find: `const GOOGLE_FORM_CONFIG = {`
- [ ] Replace `formUrl:` with your form URL from step 3
- [ ] Replace all 9 `entryIds:` numbers with yours from step 4
- [ ] Save file (Ctrl+S)

---

## 🧪 VERIFY IT WORKS (2 min)

### Test Your Setup:

1. [ ] Open your website in browser
2. [ ] Add items to cart
3. [ ] Click "Proceed to Order Form"
4. [ ] Fill form with TEST data:
   - Name: Test Order
   - Phone: 09123456789
   - Email: test@example.com
   - Address: Test Address
   - Products: Check 2-3 items
   - Size: M
   - Qty: 1
   - Payment: GCash
   - Notes: Test
5. [ ] Click "Submit Order"

### Check Results:

- [ ] See "Order submitted successfully!" message
- [ ] Go to Google Form → Responses tab
- [ ] See your test order there ✓
- [ ] Check email inbox (check spam too!)
- [ ] See order confirmation email ✓

---

## ✅ DONE!

If all checks pass, you're ready to go live:

- [ ] Orders automatically stored in Google Forms
- [ ] You get email notifications
- [ ] Customers see confirmation
- [ ] Professional system working!

---

## 🚨 TROUBLESHOOTING

### Problem: Orders not in Google Forms

**Checklist:**
- [ ] Form is "Accepting responses"?
- [ ] Entry IDs match YOUR form (not examples)?
- [ ] Did you save script.js?
- [ ] Check browser console (F12) for errors

**Solution:** Re-read the IDs from your form carefully.

### Problem: No email received

- [ ] Check spam folder
- [ ] Email system is secondary - main data is in Google Forms
- [ ] Don't worry, orders still saved

### Problem: JavaScript errors in console (F12)

- [ ] Most likely: Wrong entry IDs
- [ ] Solution: Double-check all 9 numbers

---

## 📞 NEED HELP?

**Read these files in order:**

1. **BEGINNER_SETUP.md** ← Start here (easiest)
2. **GOOGLE_FORMS_QUICK_REFERENCE.md** ← If you need copy-paste
3. **SETUP_GUIDE.md** ← For technical details
4. **WHAT_IS_NEW.md** ← To understand what changed

---

## 🎉 YOU'VE GOT THIS!

The setup is straightforward:
1. Create form ✓
2. Get IDs ✓
3. Update code ✓
4. Test ✓
5. Done! ✓

**Total time: 15 minutes**
**Total cost: $0**
**Result: Professional order system** ✨

---

**Save this file for reference!**
