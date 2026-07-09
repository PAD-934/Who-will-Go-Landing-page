/**
 * ═══════════════════════════════════════════════════════════════════
 * WHO WILL GO - GOOGLE APPS SCRIPT BACKEND
 * Complete Backend for Order Management System
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * CONFIGURATION SECTION
 * Replace these values with your actual Google Sheets ID and email addresses
 */
const CONFIG = {
  // Your Google Sheet ID (from the URL: docs.google.com/spreadsheets/d/{SHEET_ID}/edit)
  SHEET_ID: "YOUR_GOOGLE_SHEET_ID_HERE",

  // Sheet names within the workbook
  SHEETS: {
    ORDERS: "Orders", // Main orders data
    PRODUCTS: "Products", // Product inventory
    SETTINGS: "Settings", // Admin settings
  },

  // Email configuration
  ADMIN_EMAIL: "admin@yourchurch.com", // Where to send order notifications
  REPLY_TO: "noreply@yourchurch.com", // System email

  // Order settings
  ORDER_PREFIX: "WWG", // Unique order ID prefix
  TIMEZONE: "Asia/Manila", // For timestamps
};

/**
 * MAIN POST HANDLER
 * This function is called when the form submits data via fetch API
 * Must be set as Web App endpoint in Google Apps Script deployment
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const requestData = JSON.parse(e.postData.contents);

    // Validate required fields
    if (!isValidOrderData(requestData)) {
      return createJsonResponse(
        {
          success: false,
          message: "Invalid order data. Missing required fields.",
          errors: validateOrderData(requestData),
        },
        400,
      );
    }

    // Generate unique Order ID
    const orderId = generateOrderId();

    // Save payment proof if supplied
    const paymentProof = requestData.paymentScreenshot || null;
    const paymentProofInfo = paymentProof
      ? savePaymentProofFile(paymentProof, orderId)
      : null;

    // Create order object with metadata
    const orderData = {
      orderId: orderId,
      timestamp: new Date().toLocaleString("en-PH", {
        timeZone: CONFIG.TIMEZONE,
      }),
      customerName: requestData.customerName.trim(),
      email: requestData.email.toLowerCase().trim(),
      phone: requestData.phone.trim(),
      address: requestData.address.trim(),
      customerChurch: requestData.customerChurch
        ? requestData.customerChurch.trim()
        : "",
      products: requestData.products, // Array of {name, quantity, price}
      totalItems: requestData.totalItems,
      totalAmount: requestData.totalAmount,
      paymentMethod: requestData.paymentMethod,
      notes: requestData.notes || "",
      paymentScreenshotUrl: paymentProofInfo ? paymentProofInfo.fileUrl : "",
      status: "Pending",
    };

    // Save order to Google Sheets
    const saveResult = saveOrderToSheet(orderData);
    if (!saveResult.success) {
      return createJsonResponse(
        {
          success: false,
          message: "Failed to save order. " + saveResult.error,
        },
        500,
      );
    }

    // Send email notification to admin
    try {
      sendAdminNotification(orderData);
    } catch (emailError) {
      Logger.log("Warning: Admin email failed - " + emailError.toString());
    }

    // Send confirmation email to customer
    try {
      sendCustomerConfirmation(orderData);
    } catch (emailError) {
      Logger.log("Warning: Customer email failed - " + emailError.toString());
    }

    // Return success response
    return createJsonResponse(
      {
        success: true,
        orderId: orderId,
        message: "Order received successfully!",
        timestamp: orderData.timestamp,
      },
      200,
    );
  } catch (error) {
    // Log error for debugging
    Logger.log("Error in doPost: " + error.toString());

    return createJsonResponse(
      {
        success: false,
        message: "Server error: " + error.toString(),
      },
      500,
    );
  }
}

/**
 * Validates that all required order fields are present
 */
function isValidOrderData(data) {
  const required = [
    "customerName",
    "email",
    "phone",
    "address",
    "products",
    "totalAmount",
    "paymentMethod",
    "paymentScreenshot",
  ];
  return required.every(
    (field) =>
      data[field] !== undefined && data[field] !== null && data[field] !== "",
  );
}

/**
 * Validates order data and returns specific error messages
 */
function validateOrderData(data) {
  const errors = [];

  if (!data.customerName || data.customerName.trim().length === 0) {
    errors.push("Customer name is required");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Valid email address is required");
  }

  if (!data.phone || data.phone.trim().length < 7) {
    errors.push("Valid phone number is required");
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.push("Delivery address is required");
  }

  if (
    !data.products ||
    !Array.isArray(data.products) ||
    data.products.length === 0
  ) {
    errors.push("At least one product must be selected");
  }

  if (!data.totalAmount || data.totalAmount <= 0) {
    errors.push("Total amount must be greater than 0");
  }

  if (!data.paymentMethod || data.paymentMethod.trim().length === 0) {
    errors.push("Payment method must be selected");
  }

  if (!data.paymentScreenshot || !data.paymentScreenshot.contentBase64) {
    errors.push("Payment screenshot proof is required");
  }

  return errors;
}

/**
 * Generates a unique Order ID
 * Format: WWG-20240604-001234
 */
function generateOrderId() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  const lastRow = sheet ? sheet.getLastRow() : 0;
  const existingOrders = Math.max(0, lastRow - 1);
  const sequenceNumber = String(existingOrders + 1).padStart(6, "0");
  const date = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd");

  return `${CONFIG.ORDER_PREFIX}-${date}-${sequenceNumber}`;
}

/**
 * Saves order data to Google Sheets
 * Creates columns if they don't exist
 */
function saveOrderToSheet(orderData) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.ORDERS);
      initializeOrdersSheet(sheet);
    }

    // Prepare product list as string
    const productList = orderData.products
      .map((p) => `${p.name} x${p.quantity}`)
      .join("; ");

    // Add row to sheet
    sheet.appendRow([
      orderData.orderId,
      orderData.customerName,
      orderData.email,
      orderData.phone,
      orderData.address,
      orderData.customerChurch,
      orderData.timestamp,
      productList,
      orderData.totalItems,
      orderData.totalAmount,
      orderData.paymentMethod,
      orderData.paymentScreenshotUrl || "",
      orderData.notes,
      orderData.status,
    ]);

    // Format sheet for readability
    formatOrdersSheet(sheet);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Initializes the Orders sheet with proper headers
 */
function initializeOrdersSheet(sheet) {
  const headers = [
    "Order ID",
    "Full Name",
    "Email",
    "Contact Number",
    "Full Address",
    "Church Name (Optional)",
    "Timestamp",
    "Products",
    "Total Items",
    "Total Amount (PHP)",
    "Payment Method",
    "Proof of Payment (Screenshot)",
    "Special Notes",
    "Status",
  ];

  sheet.appendRow(headers);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#0D1B2A");
  headerRange.setFontColor("#C9A84C");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);

  // Set column widths
  sheet.setColumnWidth(1, 130); // Order ID
  sheet.setColumnWidth(2, 180); // Full Name
  sheet.setColumnWidth(3, 180); // Email
  sheet.setColumnWidth(4, 150); // Contact Number
  sheet.setColumnWidth(5, 250); // Full Address
  sheet.setColumnWidth(8, 250); // Products
}

/**
 * Formats the orders sheet for better readability
 */
function formatOrdersSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 14);
    dataRange.setVerticalAlignment("top");
    dataRange.setWrap(true);
  }
}

/**
 * Saves the payment proof image to Drive and returns file metadata
 */
function savePaymentProofFile(paymentProof, orderId) {
  try {
    const contentBytes = Utilities.base64Decode(paymentProof.contentBase64);
    const fileName = `${orderId}_${paymentProof.fileName}`;
    const blob = Utilities.newBlob(
      contentBytes,
      paymentProof.fileType,
      fileName,
    );
    const file = DriveApp.createFile(blob);
    file.setDescription(`Payment screenshot for order ${orderId}`);

    return {
      fileName: fileName,
      fileUrl: file.getUrl(),
    };
  } catch (error) {
    Logger.log("Error saving payment proof: " + error.toString());
    return null;
  }
}

/**
 * Sends admin notification email
 */
function sendAdminNotification(orderData) {
  try {
    const subject = `[New Order] ${orderData.orderId} - ${orderData.customerName}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0D1B2A; padding: 20px; text-align: center; color: #C9A84C;">
          <h2 style="margin: 0;">New Order Received</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h3 style="color: #0D1B2A;">Order Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold; width: 30%;">Order ID:</td>
              <td style="padding: 10px;">${orderData.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Date & Time:</td>
              <td style="padding: 10px;">${orderData.timestamp}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Customer Name:</td>
              <td style="padding: 10px;">${orderData.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${orderData.email}">${orderData.email}</a></td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${orderData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Address:</td>
              <td style="padding: 10px;">${orderData.address}</td>
            </tr>
          </table>
          
          <h3 style="color: #0D1B2A; margin-top: 20px;">Products Ordered</h3>
          <ul>
            ${orderData.products.map((p) => `<li>${p.name} × ${p.quantity} = ₱${(p.price * p.quantity).toLocaleString()}</li>`).join("")}
          </ul>
          
          <table style="width: 100%; border-top: 2px solid #C9A84C; padding-top: 10px;">
            <tr>
              <td style="padding: 10px; font-weight: bold;">Total Items:</td>
              <td style="padding: 10px; text-align: right;">${orderData.totalItems}</td>
            </tr>
            <tr style="background-color: #0D1B2A; color: #C9A84C;">
              <td style="padding: 10px; font-weight: bold;">Total Amount:</td>
              <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold;">₱${orderData.totalAmount.toLocaleString()}</td>
            </tr>
          </table>
          
          <table style="width: 100%; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; font-weight: bold;">Payment Method:</td>
              <td style="padding: 10px;">${orderData.paymentMethod}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Special Notes:</td>
              <td style="padding: 10px;">${orderData.notes || "(None)"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Status:</td>
              <td style="padding: 10px; color: #F59E0B; font-weight: bold;">${orderData.status}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>Log in to your Google Sheet to view and manage orders: <a href="https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}" style="color: #C9A84C;">Open Sheet</a></p>
          </div>
        </div>
      </div>
    `;

    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, "", {
      htmlBody: htmlBody,
      replyTo: CONFIG.REPLY_TO,
    });
  } catch (error) {
    Logger.log("Error sending admin notification: " + error.toString());
  }
}

/**
 * Sends customer confirmation email
 */
function sendCustomerConfirmation(orderData) {
  try {
    const subject = `Order Confirmation - #${orderData.orderId}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0D1B2A; padding: 20px; text-align: center; color: #C9A84C;">
          <h2 style="margin: 0;">✓ Order Confirmed</h2>
          <p style="margin: 10px 0 0 0; font-size: 12px;">Thank you for your support!</p>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${orderData.customerName},</p>
          
          <p>Thank you for your generous support to our missionary work! We have received your order and it is now being processed.</p>
          
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #C9A84C; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #0D1B2A;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${orderData.timestamp}</p>
          </div>
          
          <h3 style="color: #0D1B2A;">Items Ordered</h3>
          <ul style="line-height: 1.8;">
            ${orderData.products.map((p) => `<li>${p.name} <strong>×${p.quantity}</strong> = ₱${(p.price * p.quantity).toLocaleString()}</li>`).join("")}
          </ul>
          
          <div style="background-color: #0D1B2A; color: #C9A84C; padding: 15px; text-align: right; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px;">Total Amount</p>
            <h2 style="margin: 5px 0 0 0;">₱${orderData.totalAmount.toLocaleString()}</h2>
          </div>
          
          <h3 style="color: #0D1B2A; margin-top: 25px;">Next Steps</h3>
          <ol style="line-height: 1.8;">
            <li>Our team will contact you at <strong>${orderData.phone}</strong> to confirm the order details.</li>
            <li>We'll provide payment instructions for <strong>${orderData.paymentMethod}</strong>.</li>
            <li>Once payment is received, we'll process your order and provide tracking information.</li>
          </ol>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #FFC107; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              <strong>💝 Thank you for making a difference!</strong><br/>
              Your purchase directly supports our missionaries serving in remote communities around the world.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
            <p>Who Will Go - Missionary Fundraising Initiative</p>
            <p><strong>Email:</strong> ${CONFIG.ADMIN_EMAIL}</p>
          </div>
        </div>
      </div>
    `;

    GmailApp.sendEmail(orderData.email, subject, "", {
      htmlBody: htmlBody,
      replyTo: CONFIG.ADMIN_EMAIL,
    });
  } catch (error) {
    Logger.log("Error sending customer confirmation: " + error.toString());
  }
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Creates a JSON response with proper headers
 */
function createJsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .append("");
}

/**
 * HELPER FUNCTION: Run this in Apps Script console to test the setup
 * Function > New function > Run this to verify everything is configured correctly
 */
function testSetup() {
  const issues = [];

  // Check Sheet ID
  if (CONFIG.SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
    issues.push(
      "⚠️ SHEET_ID not configured. Add your Google Sheet ID to CONFIG.",
    );
  }

  // Check Admin Email
  if (CONFIG.ADMIN_EMAIL === "admin@yourchurch.com") {
    issues.push(
      "⚠️ ADMIN_EMAIL not configured. Update to your actual admin email.",
    );
  }

  // Try to access the sheet
  try {
    SpreadsheetApp.openById(CONFIG.SHEET_ID);
  } catch (e) {
    issues.push("❌ Cannot access Google Sheet. Verify SHEET_ID is correct.");
  }

  if (issues.length === 0) {
    Logger.log(
      "✅ Setup looks good! Deploy as Web App to get your endpoint URL.",
    );
  } else {
    Logger.log(issues.join("\n"));
  }
}
