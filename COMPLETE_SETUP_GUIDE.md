# WHO WILL GO - Complete Setup Guide for Beginners
## Professional Missionary Fundraising Platform with Google Sheets Backend

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Google Sheets Setup](#step-1-google-sheets-setup)
4. [Step 2: Google Apps Script Deployment](#step-2-google-apps-script-deployment)
5. [Step 3: Configure Your Website](#step-3-configure-your-website)
6. [Step 4: Testing the System](#step-4-testing-the-system)
7. [Troubleshooting](#troubleshooting)
8. [Security Recommendations](#security-recommendations)
9. [Deployment to GitHub Pages](#deployment-to-github-pages)

---

## Architecture Overview

### How It Works

Your website now operates with a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                     CUSTOMER'S BROWSER                       │
│  (HTML + CSS + JavaScript) - Static Files on GitHub Pages   │
│                                                              │
│  When customer submits form:                                 │
│  1. JavaScript validates data on browser                     │
│  2. Sends order to Google Apps Script via fetch API          │
└────────────────┬──────────────────────────────────────────────┘
                 │ HTTPS POST Request
                 │ (Secure)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            GOOGLE APPS SCRIPT WEB APP                        │
│  (Backend - Your Server Code)                               │
│                                                              │
│  1. Receives order data                                      │
│  2. Validates all information                                │
│  3. Generates unique Order ID                                │
│  4. Saves to Google Sheets                                   │
│  5. Sends email to admin                                     │
│  6. Sends confirmation to customer                           │
│  7. Returns Order ID to browser                              │
└────────────────┬──────────────────────────────────────────────┘
                 │ Connected to
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              GOOGLE SHEETS DATABASE                          │
│                                                              │
│  Orders Table:                                               │
│  - Order ID                                                  │
│  - Timestamp                                                 │
│  - Customer Info                                             │
│  - Products Ordered                                          │
│  - Total Amount                                              │
│  - Payment Status                                            │
│                                                              │
│  ✓ Accessible only by authorized admin                       │
│  ✓ Automatically backed up by Google                        │
│  ✓ Real-time updates                                         │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

✅ **No Double Submissions** - System prevents accidental duplicate orders  
✅ **Automatic Order IDs** - Each order gets unique ID like `WWG-20240604-001234`  
✅ **Email Notifications** - Admin gets email when new order arrives  
✅ **Customer Confirmation** - Customers receive professional email  
✅ **Real-time Updates** - Orders appear in Google Sheets instantly  
✅ **Mobile Responsive** - Works on phones, tablets, computers  
✅ **Secure** - HTTPS encryption, server-side validation  
✅ **No Server Maintenance** - Google handles everything automatically  

---

## Prerequisites

Before starting, you need:

1. **Google Account** - For Google Sheets and Google Apps Script
   - Free account works perfectly
   - [Create account →](https://accounts.google.com/signup)

2. **GitHub Account** - For hosting your website
   - Free accounts work
   - [Create account →](https://github.com/signup)

3. **Basic Text Editor** - To edit configuration
   - VS Code (recommended)
   - Notepad++
   - Atom
   - Or any text editor

4. **Your Website Files** - The HTML, CSS, JavaScript files
   - You already have these!

5. **Admin Email Address** - Where to send order notifications
   - Use your personal email or church email

---

## Step 1: Google Sheets Setup

### 1.1 Create a New Google Sheet

1. Go to [Google Sheets →](https://sheets.google.com)
2. Click **"+ Create new spreadsheet"**
3. Name it: `"Who Will Go - Orders"`
4. Click **"Create"**

### 1.2 Create Order Columns

Your sheet will have a blank sheet named "Sheet1". Rename it to "Orders":

1. Right-click on "Sheet1" tab at bottom
2. Select **"Rename"**
3. Type: `Orders`
4. Press Enter

### 1.3 Create Headers (You can skip this - the Apps Script creates them automatically)

The Google Apps Script will create the headers automatically, but here's what will be created:

| Column | Description |
|--------|-------------|
| Order ID | Unique identifier (WWG-20240604-001234) |
| Timestamp | Order date and time in local timezone |
| ISO Timestamp | International standard timestamp |
| Customer Name | Full name of customer |
| Email | Customer email address |
| Phone | Contact number |
| Address | Delivery address |
| Products | List of ordered items |
| Total Items | Number of items ordered |
| Total Amount (PHP) | Total price |
| T-Shirt Size | Size if T-shirts ordered |
| Payment Method | GCash, QR Code, etc. |
| Special Notes | Custom instructions |
| Status | Processing, Completed, etc. |

### 1.4 Share Spreadsheet with Apps Script Account

1. Click **Share** button (top right)
2. Copy your sheet URL (you'll need this later)
   - Format: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - The `{SHEET_ID}` is what you need
3. For sharing: Click **"Change to anyone with the link"** (not required yet)

### 1.5 Get Your Sheet ID

Your Sheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/1A2b3C4d5E6f7G8h9I0j/edit#gid=0
                                        └─────────────────┘
                                         This is Sheet ID
```

**Save this ID** - you'll need it in Step 2.

---

## Step 2: Google Apps Script Deployment

### 2.1 Open Google Apps Script Editor

1. Go to [Google Apps Script →](https://script.google.com)
2. Click **"+ New project"**
3. Name it: `"Who Will Go Backend"`
4. Click **"Create"**

### 2.2 Copy the Backend Code

1. In your editor, you should see a blank `Code.gs` file
2. **DELETE everything** in the file
3. Open `GOOGLE_APPS_SCRIPT.gs` from your project files
4. Copy **ALL the code**
5. Paste it into `Code.gs` in the Apps Script editor

### 2.3 Configure the Backend Code

In the Apps Script editor, find this section at the top:

```javascript
const CONFIG = {
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
  SHEETS: {
    ORDERS: 'Orders',
    PRODUCTS: 'Products',
    SETTINGS: 'Settings'
  },
  ADMIN_EMAIL: 'admin@yourchurch.com',
  REPLY_TO: 'noreply@yourchurch.com',
  ORDER_PREFIX: 'WWG',
  TIMEZONE: 'Asia/Manila'
};
```

**Update these values:**

- **`SHEET_ID`**: Replace `'YOUR_GOOGLE_SHEET_ID_HERE'` with your actual Sheet ID from Step 1.5
  
  Example:
  ```javascript
  SHEET_ID: '1A2b3C4d5E6f7G8h9I0j',
  ```

- **`ADMIN_EMAIL`**: Replace with email where orders should be sent
  
  Example:
  ```javascript
  ADMIN_EMAIL: 'pastor@ourchurch.org',
  ```

- **`REPLY_TO`**: Email for customers to reply to (can be same as ADMIN_EMAIL)
  
  Example:
  ```javascript
  REPLY_TO: 'orders@ourchurch.org',
  ```

- **`TIMEZONE`**: Set to your timezone
  
  Common timezones:
  - `'Asia/Manila'` - Philippines
  - `'Asia/Singapore'` - Singapore
  - `'America/Chicago'` - Chicago
  - `'America/Los_Angeles'` - California
  - `'Europe/London'` - UK
  - `'Australia/Sydney'` - Australia

- **`ORDER_PREFIX`**: Keep as `'WWG'` (Who Will Go)

### 2.4 Save the Script

Press **Ctrl+S** (or Cmd+S on Mac) to save.

### 2.5 Deploy as Web App

1. Click **"Deploy"** button (top right)
2. Click **"New deployment"** (if this is the first deployment)
3. Click the **dropdown** for "Select type"
4. Choose **"Web app"**
5. Fill in the form:
   - **Execute as**: Select your Google account
   - **Who has access**: Select **"Anyone"**
6. Click **"Deploy"**

### 2.6 Get Your Web App URL

After deployment, Google will show a dialog:

```
Deployment ID: AKfycbw...
New deployment: Web app
```

**Copy the URL** shown under "New deployment"

The URL will look like:
```
https://script.google.com/macros/d/1A2B3C4D5E6F7G8H9I0J/usercopy
```

**Save this URL** - this is your `GOOGLE_APPS_SCRIPT_URL`

---

## Step 3: Configure Your Website

### 3.1 Update script.js Configuration

Open `script.js` in your text editor.

Find this section near the top:

```javascript
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
};
```

**Replace** `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your actual URL from Step 2.6.

Example:
```javascript
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/d/1A2B3C4D5E6F7G8H9I0J/usercopy'
};
```

### 3.2 Test Locally (Optional)

1. Open `index.html` in your browser
2. Try adding items to cart
3. Submit an order
4. Check that you receive the order

---

## Step 4: Testing the System

### 4.1 Manual Testing

1. Open your website in browser
2. **Select some products** from the shop
3. **Fill out the order form**:
   - Name: "Test Customer"
   - Phone: "09XXXXXXXXX"
   - Email: Your email address
   - Address: "123 Test St"
4. **Submit the form**
5. You should see **"Order Received!"** message with an Order ID

### 4.2 Check Google Sheets

1. Open your Google Sheet
2. You should see a **new row** with your test order
3. Check all data is correct

### 4.3 Check Email

1. **Check your admin email** - You should receive an email with order details
2. **Check your customer email** - You should receive a confirmation email

### 4.4 Common Issues

| Issue | Solution |
|-------|----------|
| "System not configured" error | Your CONFIG.GOOGLE_APPS_SCRIPT_URL is wrong or the Apps Script URL wasn't copied correctly |
| Order doesn't appear in sheet | Check that SHEET_ID in Apps Script is correct |
| No email received | Check spam folder, verify email addresses in CONFIG |
| Order submitted twice | Refresh the page - the system prevents double-clicks |

---

## Step 5: Deployment to GitHub Pages

### 5.1 Create GitHub Repository

1. Go to [GitHub →](https://github.com)
2. Click **"+"** menu → **"New repository"**
3. Name: `whoWillGo` (or similar)
4. Description: "Christian Missionary Fundraising Platform"
5. **Make it PUBLIC** (GitHub Pages requires this)
6. Click **"Create repository"**

### 5.2 Upload Your Files

Option A: **Use GitHub Website**
1. In your new repo, click **"Add file" → "Upload files"**
2. Select these files:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Click **"Commit changes"**

Option B: **Use Git (Command Line)**
```bash
git clone https://github.com/YOUR_USERNAME/whoWillGo.git
cd whoWillGo
# Copy your files here
git add .
git commit -m "Initial commit: Who Will Go website"
git push
```

### 5.3 Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (in sidebar)
3. Under "Source", select **"Deploy from a branch"**
4. Select **"main"** branch and **"/root"** folder
5. Click **"Save"**
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://YOUR_USERNAME.github.io/whoWillGo`

### 5.4 Custom Domain (Optional)

If you have your own domain:
1. Go to repo Settings → Pages
2. Under "Custom domain", enter your domain
3. Follow the DNS instructions provided

---

## Troubleshooting

### Problem: "Network error. Please check your internet connection"

**Solutions:**
1. Check your internet connection
2. Verify CONFIG.GOOGLE_APPS_SCRIPT_URL is correct
3. Test the Apps Script URL in your browser directly

### Problem: "System not configured"

**Solutions:**
1. Make sure you replaced `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with actual URL
2. Check for extra spaces or typos in the URL

### Problem: Order not appearing in Google Sheets

**Solutions:**
1. Verify SHEET_ID in Google Apps Script CONFIG is correct
2. Make sure sheet name is exactly "Orders"
3. Check that Apps Script has access to the sheet
4. Try running the `testSetup()` function in Apps Script console

### Problem: Not receiving emails

**Solutions:**
1. Check spam/junk folder
2. Verify admin email address in Apps Script CONFIG
3. Check Gmail settings → Less secure apps (might need to enable for automated emails)
4. Try with a Gmail address (most reliable)

### Problem: Order ID not displaying

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
2. Refresh the page after submitting
3. Check browser console for errors (F12)

---

## Security Recommendations

### Important Security Practices

1. **Enable 2-Factor Authentication**
   - Go to your Google Account Security settings
   - Enable 2FA for extra protection

2. **Limit Spreadsheet Access**
   - Don't share sheet link publicly
   - Only share with trusted admin staff
   - Use "Viewer" role for read-only access

3. **Regular Backups**
   - Google automatically backs up your data
   - But you can export orders monthly as CSV:
     - In Google Sheets, File → Download → CSV
     - Save to your computer

4. **Use HTTPS**
   - Your website uses HTTPS on GitHub Pages (automatic)
   - Always use HTTPS - check for 🔒 in browser

5. **Monitor Orders**
   - Check your sheet regularly for suspicious activity
   - Verify customer information looks legitimate

6. **Email Best Practices**
   - Use professional email address for ADMIN_EMAIL
   - Regularly check admin email for notifications
   - Don't share admin credentials

### GDPR & Privacy Compliance

1. **Add Privacy Policy** - Add to your website footer
2. **Collect Consent** - Optional: Add checkbox to order form
   - "I consent to receive order updates via email"
3. **Data Retention** - Don't keep customer data longer than needed
   - Archive old orders annually
   - Delete test/spam orders

---

## Next Steps

1. ✅ Set up Google Sheets
2. ✅ Deploy Google Apps Script
3. ✅ Configure your website
4. ✅ Test the system thoroughly
5. ✅ Deploy to GitHub Pages
6. ✅ Share your website link
7. ✅ Monitor orders in Google Sheets
8. ✅ Follow up with customers after payment

---

## FAQ

**Q: Can I change product prices?**  
A: Yes! Edit the `products` array in `script.js`

**Q: Can I add more products?**  
A: Yes! Add new objects to the `products` array in `script.js`

**Q: What's the maximum number of orders?**  
A: Google Sheets can handle millions of rows - no practical limit

**Q: Can I accept other payment methods?**  
A: Yes! Edit the payment options in `index.html` form

**Q: How do I back up orders?**  
A: Download CSV from Google Sheets regularly

**Q: Can multiple people access the orders?**  
A: Yes! Share the Google Sheet with team members

**Q: Is the system mobile-friendly?**  
A: Yes! Fully responsive design

**Q: Do I need technical skills?**  
A: No! Just follow these step-by-step instructions

---

## Support & Contact

If you have questions:
1. Check this guide again
2. Look at troubleshooting section
3. Check browser console for error messages (F12)
4. Review the code comments in script.js and GOOGLE_APPS_SCRIPT.gs

---

## Summary: You Now Have

✅ Professional order management system  
✅ Automated email notifications  
✅ Google Sheets database (automatic backups)  
✅ Unique Order IDs for every order  
✅ Mobile-responsive website  
✅ Live on GitHub Pages  
✅ Security best practices  
✅ Zero server maintenance required  

**You're ready to receive orders and support your missionary work!**

May God bless your fundraising efforts. 🙏

---

*Last updated: June 4, 2024*  
*Who Will Go - Missionary Fundraising Platform v1.0*
