/**
 * ═══════════════════════════════════════════════════════════════════
 * WHO WILL GO - GOOGLE APPS SCRIPT BACKEND
 * PRODUCTION-READY VERSION WITH SECURITY FEATURES
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * CONFIGURATION SECTION
 * Replace these values with your actual settings
 */
const CONFIG = {
  // Your Google Sheet ID (from URL: docs.google.com/spreadsheets/d/{SHEET_ID}/edit)
  SHEET_ID: "YOUR_GOOGLE_SHEET_ID_HERE",

  // Sheet names within the workbook
  SHEETS: {
    ORDERS: "Orders",
    PRODUCTS: "Products",
    SETTINGS: "Settings",
  },

  // Email configuration
  ADMIN_EMAIL: "admin@yourchurch.com", // Where order notifications go
  REPLY_TO: "noreply@yourchurch.com", // System email

  // Order settings
  ORDER_PREFIX: "WWG", // Order ID prefix
  TIMEZONE: "Asia/Manila", // For timestamps
};

/**
 * MAIN POST HANDLER
 * Entry point for order submissions from the website
 */
function doPost(e) {
  try {
    // Get client IP for rate limiting
    const clientIp = e.clientAddress || "unknown";

    // Check rate limit (prevent abuse)
    if (checkRateLimit(clientIp)) {
      return createJsonResponse(
        {
          success: false,
          message: "Too many requests. Please try again later.",
          errors: ["Rate limit exceeded"],
        },
        429,
      );
    }

    // Parse incoming JSON data
    const requestData = JSON.parse(e.postData.contents);

    // Validate that required fields are present
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
      timestampISO: new Date().toISOString(),
      customerName: requestData.customerName.trim(),
      email: requestData.email.toLowerCase().trim(),
      phone: requestData.phone.trim(),
      address: requestData.address.trim(),
      products: requestData.products,
      totalItems: requestData.totalItems,
      totalAmount: requestData.totalAmount,
      tshirtSize: requestData.tshirtSize || "N/A",
      paymentMethod: requestData.paymentMethod,
      notes: (requestData.notes || "").trim(),
      paymentScreenshotName: paymentProofInfo ? paymentProofInfo.fileName : "",
      paymentScreenshotUrl: paymentProofInfo ? paymentProofInfo.fileUrl : "",
      status: "Pending",
    };

    // Save to Google Sheets
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
 * RATE LIMITING
 * Prevents spam and DDoS attacks
 * Limit: 10 requests per minute per IP
 */
function checkRateLimit(clientIp) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `ratelimit_${clientIp}`;
  const data = scriptProperties.getProperty(key);

  let requestCount = 0;
  let timestamp = Date.now();

  if (data) {
    const parsed = JSON.parse(data);
    const elapsed = timestamp - parsed.timestamp;

    // Reset if older than 1 minute
    if (elapsed > 60000) {
      requestCount = 0;
      timestamp = Date.now();
    } else {
      requestCount = parsed.count;
    }
  }

  requestCount++;

  // Store updated count
  scriptProperties.setProperty(
    key,
    JSON.stringify({
      count: requestCount,
      timestamp: timestamp,
    }),
  );

  // Clean up old entries (older than 2 minutes)
  const allProps = scriptProperties.getProperties();
  const now = Date.now();
  for (let key in allProps) {
    if (key.startsWith("ratelimit_")) {
      try {
        const data = JSON.parse(allProps[key]);
        if (now - data.timestamp > 120000) {
          scriptProperties.deleteProperty(key);
        }
      } catch (e) {
        scriptProperties.deleteProperty(key);
      }
    }
  }

  // Return true if rate limit exceeded (>10 requests/minute)
  return requestCount > 10;
}

/**
 * Checks if order data has all required fields
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

  for (let field of required) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      return false;
    }
  }

  if (!data.paymentScreenshot || !data.paymentScreenshot.contentBase64) {
    return false;
  }

  return true;
}

/**
 * Detailed validation of order data
 * Returns array of specific error messages
 */
function validateOrderData(data) {
  const errors = [];

  // Name validation
  if (!data.customerName || data.customerName.trim().length === 0) {
    errors.push("Customer name is required");
  } else if (data.customerName.length > 100) {
    errors.push("Customer name too long (max 100)");
  }

  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Valid email address is required");
  } else if (data.email.length > 254) {
    errors.push("Email too long");
  }

  // Phone validation
  if (!data.phone || data.phone.trim().length < 7) {
    errors.push("Valid phone number is required");
  } else if (data.phone.length > 20) {
    errors.push("Phone number too long");
  } else if (!/^[0-9\s\-()]*$/.test(data.phone)) {
    errors.push("Phone contains invalid characters");
  }

  // Address validation
  if (!data.address || data.address.trim().length === 0) {
    errors.push("Delivery address is required");
  } else if (data.address.length > 500) {
    errors.push("Address too long (max 500)");
  }

  // Products validation
  if (
    !data.products ||
    !Array.isArray(data.products) ||
    data.products.length === 0
  ) {
    errors.push("At least one product must be selected");
  } else if (data.products.length > 50) {
    errors.push("Too many products");
  }

  // Amount validation
  if (!data.totalAmount || data.totalAmount <= 0) {
    errors.push("Total amount must be greater than 0");
  } else if (data.totalAmount > 1000000) {
    errors.push("Total amount too high");
  }

  // Payment method validation
  if (!data.paymentMethod || data.paymentMethod.trim().length === 0) {
    errors.push("Payment method must be selected");
  } else if (data.paymentMethod.length > 50) {
    errors.push("Payment method string too long");
  }

  // Payment proof validation
  if (!data.paymentScreenshot || !data.paymentScreenshot.contentBase64) {
    errors.push("Payment screenshot proof is required");
  }

  // Notes validation
  if (data.notes && data.notes.length > 1000) {
    errors.push("Special notes too long (max 1000)");
  }

  return errors;
}

/**
 * RFC 5322 simplified email validation
 */
function isValidEmail(email) {
  if (!email || email.length > 254) return false;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return false;

  if (email.startsWith(".") || email.endsWith(".")) return false;
  if (email.includes("..")) return false;

  const [localPart, domain] = email.split("@");

  if (!localPart || localPart.length > 64) return false;
  if (localPart.startsWith(".") || localPart.endsWith(".")) return false;
  if (localPart.includes("..")) return false;

  if (!domain || domain.length < 3) return false;
  if (!domain.includes(".")) return false;

  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) return false;
  if (/^\d+$/.test(tld)) return false;

  return true;
}

/**
 * Generates unique Order ID
 * Format: WWG-20240604-001234
 */
function generateOrderId() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(
      CONFIG.SHEETS.ORDERS,
    );
    const lastRow = sheet.getLastRow();

    // Sequence number based on row count
    const sequenceNumber = String(lastRow).padStart(6, "0");

    // Current date
    const date = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd");

    return `${CONFIG.ORDER_PREFIX}-${date}-${sequenceNumber}`;
  } catch (e) {
    Logger.log("Error generating Order ID: " + e.toString());
    // Fallback to timestamp
    return `${CONFIG.ORDER_PREFIX}-${Date.now()}`;
  }
}

/**
 * Saves order data to Google Sheets
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

    // Format products as string
    const productList = orderData.products
      .map((p) => `${p.name} x${p.quantity}`)
      .join("; ");

    // Append row to sheet
    sheet.appendRow([
      orderData.orderId,
      orderData.timestamp,
      orderData.timestampISO,
      orderData.customerName,
      orderData.email,
      orderData.phone,
      orderData.address,
      productList,
      orderData.totalItems,
      orderData.totalAmount,
      orderData.tshirtSize,
      orderData.paymentMethod,
      orderData.paymentScreenshotName || "",
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
 * Initializes the Orders sheet with headers
 */
function initializeOrdersSheet(sheet) {
  const headers = [
    "Order ID",
    "Timestamp",
    "ISO Timestamp",
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "Products",
    "Total Items",
    "Total Amount (PHP)",
    "T-Shirt Size",
    "Payment Method",
    "Payment Proof File",
    "Payment Proof URL",
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
  sheet.setColumnWidth(2, 180); // Timestamp
  sheet.setColumnWidth(3, 200); // ISO Timestamp
  sheet.setColumnWidth(4, 150); // Customer Name
  sheet.setColumnWidth(5, 180); // Email
  sheet.setColumnWidth(6, 120); // Phone
  sheet.setColumnWidth(7, 200); // Address
  sheet.setColumnWidth(8, 250); // Products
  sheet.setColumnWidth(14, 100); // Status
}

/**
 * Formats the orders sheet for readability
 */
function formatOrdersSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 16);
    dataRange.setVerticalAlignment("top");
    dataRange.setWrap(true);
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
              <td style="padding: 10px;">${escapeHtml(orderData.customerName)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${orderData.email}">${escapeHtml(orderData.email)}</a></td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${escapeHtml(orderData.phone)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Address:</td>
              <td style="padding: 10px;">${escapeHtml(orderData.address)}</td>
            </tr>
          </table>
          
          <h3 style="color: #0D1B2A; margin-top: 20px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${orderData.products
              .map(
                (p) => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">${escapeHtml(p.name)} (x${p.quantity})</td>
                <td style="padding: 10px; text-align: right;">PHP ${(p.price * p.quantity).toLocaleString()}</td>
              </tr>
            `,
              )
              .join("")}
            <tr style="background-color: #0D1B2A; color: #C9A84C; font-weight: bold;">
              <td style="padding: 10px;">TOTAL:</td>
              <td style="padding: 10px; text-align: right;">PHP ${orderData.totalAmount.toLocaleString()}</td>
            </tr>
          </table>
          
          <h3 style="color: #0D1B2A; margin-top: 20px;">Additional Information</h3>
          <p><strong>T-Shirt Size:</strong> ${orderData.tshirtSize}</p>
          <p><strong>Payment Method:</strong> ${escapeHtml(orderData.paymentMethod)}</p>
          <p><strong>Special Notes:</strong> ${orderData.notes ? escapeHtml(orderData.notes) : "None"}</p>
          <p><strong>Status:</strong> <span style="color: #8B6914; font-weight: bold;">${orderData.status}</span></p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            <a href="https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/edit" style="color: #0D1B2A;">View all orders in Google Sheets</a>
          </p>
        </div>
      </div>
    `;

    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, "", {
      htmlBody: htmlBody,
      replyTo: CONFIG.REPLY_TO,
    });

    Logger.log("✅ Admin notification sent to: " + CONFIG.ADMIN_EMAIL);
  } catch (error) {
    Logger.log("❌ Error sending admin email: " + error.toString());
    throw error;
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
          <h2 style="margin: 0;">✓ Order Confirmation</h2>
        </div>
        
        <div style="padding: 20px; background-color: #fafafa;">
          <p style="font-size: 16px; color: #333;">Dear ${escapeHtml(orderData.customerName)},</p>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for your order! Your support helps us send missionaries around the world. We truly appreciate your generosity in supporting our mission.
          </p>
          
          <h3 style="color: #0D1B2A; margin-top: 20px;">Your Order Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: #0D1B2A; color: #C9A84C;">
              <td style="padding: 10px; font-weight: bold;">Order ID:</td>
              <td style="padding: 10px; font-weight: bold;">${orderData.orderId}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px;">Date:</td>
              <td style="padding: 10px;">${orderData.timestamp}</td>
            </tr>
          </table>
          
          <h3 style="color: #0D1B2A;">Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${orderData.products
              .map(
                (p) => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">${escapeHtml(p.name)}</td>
                <td style="padding: 10px; text-align: center;">x${p.quantity}</td>
                <td style="padding: 10px; text-align: right;">PHP ${(p.price * p.quantity).toLocaleString()}</td>
              </tr>
            `,
              )
              .join("")}
            <tr style="background-color: #0D1B2A; color: #C9A84C; font-weight: bold;">
              <td colspan="2" style="padding: 10px;">TOTAL:</td>
              <td style="padding: 10px; text-align: right;">PHP ${orderData.totalAmount.toLocaleString()}</td>
            </tr>
          </table>
          
          <h3 style="color: #0D1B2A; margin-top: 20px;">What's Next?</h3>
          <ol style="color: #666; line-height: 1.8;">
            <li>Send payment to: <strong>0917-XXX-XXXX</strong> (GCash) or use our QR Code</li>
            <li>Reply to this email with a screenshot of your payment</li>
            <li>We'll ship your items within 5-7 business days</li>
            <li>You'll receive tracking information via email</li>
          </ol>
          
          <p style="color: #666; margin-top: 20px;">
            Questions? Contact us at <a href="mailto:contact@yourchurch.com">contact@yourchurch.com</a>
          </p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #8B6914; font-style: italic; text-align: center; margin: 20px 0;">
            "Then I heard the voice of the Lord saying, 'Whom shall I send? And who will go for us?' And I said, 'Here am I. Send me!'" - Isaiah 6:8
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            May God bless your generosity and guide our missionaries.
          </p>
        </div>
      </div>
    `;

    GmailApp.sendEmail(orderData.email, subject, "", {
      htmlBody: htmlBody,
      replyTo: CONFIG.ADMIN_EMAIL,
    });

    Logger.log("✅ Customer confirmation sent to: " + orderData.email);
  } catch (error) {
    Logger.log("❌ Error sending customer email: " + error.toString());
    throw error;
  }
}

/**
 * Escapes HTML special characters for safe display in emails
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Creates a JSON response with proper headers
 */
function createJsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * TEST FUNCTION
 * Run this in the Apps Script editor to test without submitting from website
 * Go to Run → Run function → testOrder
 */
function testOrder() {
  const testData = {
    customerName: "Test Customer",
    email: "test@gmail.com",
    phone: "09171234567",
    address: "123 Test Street, Test City",
    products: [{ name: "Test Product", quantity: 1, price: 500 }],
    totalItems: 1,
    totalAmount: 500,
    tshirtSize: "N/A",
    paymentMethod: "Test",
    notes: "This is a test order",
  };

  Logger.log("Testing order processing...");

  try {
    if (!isValidOrderData(testData)) {
      Logger.log("❌ Validation failed");
      Logger.log(validateOrderData(testData));
      return;
    }

    const orderId = generateOrderId();
    Logger.log("✅ Generated Order ID: " + orderId);

    const orderData = {
      ...testData,
      orderId: orderId,
      timestamp: new Date().toLocaleString("en-PH", {
        timeZone: CONFIG.TIMEZONE,
      }),
      timestampISO: new Date().toISOString(),
      status: "Pending",
    };

    const result = saveOrderToSheet(orderData);
    if (result.success) {
      Logger.log("✅ Order saved to sheet successfully");
    } else {
      Logger.log("❌ Save failed: " + result.error);
    }

    Logger.log("✅ Test complete");
  } catch (e) {
    Logger.log("❌ Error: " + e.toString());
  }
}
