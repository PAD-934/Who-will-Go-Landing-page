/**
 * ═══════════════════════════════════════════════════════════════════
 * WHO WILL GO - ADVANCED GOOGLE APPS SCRIPT BACKEND (CUSTOMIZED)
 * Handles complex orders with product variations and file uploads.
 * Version updated to match user's specific sheet column order.
 * ═══════════════════════════════════════════════════════════════════
 */

// ----------------- CONFIGURATION -----------------
const CONFIG = {
  SHEET_ID: "1K_lcQzY_2iNo-DEO206XJOkhtxa4Qz-CB7GUeoD4zVc",
  ORDERS_SHEET_NAME: "Orders",
  DRIVE_FOLDER_NAME: "Payment Screenshots",
  TIMEZONE: "Asia/Manila",
};

// ----------------- MAIN FUNCTION -----------------
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(
        { success: false, message: "No payload received." },
        400,
      );
    }

    const payload = JSON.parse(e.postData.contents);

    // --- 1. File Upload Handling ---
    let screenshotUrl = "No Screenshot Uploaded";
    const screenshotData = getScreenshotPayload(payload);

    if (
      screenshotData &&
      screenshotData.fileName &&
      screenshotData.fileContent
    ) {
      const folder = getOrCreateDriveFolder(CONFIG.DRIVE_FOLDER_NAME);
      const fileBlob = Utilities.newBlob(
        Utilities.base64Decode(screenshotData.fileContent),
        screenshotData.fileMimeType || "image/png",
        screenshotData.fileName,
      );
      const savedFile = folder.createFile(fileBlob);
      savedFile.setSharing(
        DriveApp.Access.ANYONE_WITH_LINK,
        DriveApp.Permission.VIEW,
      );
      screenshotUrl = savedFile.getUrl();
    }

    // --- 2. Data Preparation ---
    const orderSheet = getOrCreateSheet(
      CONFIG.SHEET_ID,
      CONFIG.ORDERS_SHEET_NAME,
    );
    const orderId = generateOrderId(orderSheet);
    const timestamp = new Date();

    const productsString = Array.isArray(payload.products)
      ? payload.products
          .map((p) => {
            const options = [];
            if (p.options && p.options.size)
              options.push(`Size: ${p.options.size}`);
            if (p.options && p.options.color)
              options.push(`Color: ${p.options.color}`);
            if (p.options && p.options.design)
              options.push(`Design: ${p.options.design}`);
            const optionsString =
              options.length > 0 ? ` (${options.join(", ")})` : "";
            return `${p.name}${optionsString} x${p.quantity}`;
          })
          .join("; ")
      : "";

    const newRow = [
      orderId,
      Utilities.formatDate(timestamp, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss"),
      payload.customerName || "",
      payload.customerEmail || "",
      payload.customerContact || "",
      payload.customerAddress || "",
      payload.customerChurch || "N/A",
      productsString,
      payload.totalItems || 0,
      payload.totalAmount || 0,
      payload.paymentMethod || "",
      screenshotUrl,
      payload.specialNotes || "N/A",
      "Pending",
    ];

    orderSheet.appendRow(newRow);

    return createJsonResponse({ success: true, orderId: orderId });
  } catch (error) {
    Logger.log(error.toString());
    return createJsonResponse(
      { success: false, message: error.toString() },
      500,
    );
  }
}

// ----------------- HELPER FUNCTIONS -----------------
function getOrCreateSheet(spreadsheetId, sheetName) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headers = [
      "Order ID",
      "Timestamp",
      "Full Name",
      "Email",
      "Contact Number",
      "Full Address",
      "Church Name (Optional)",
      "Products",
      "Total Items",
      "Total Amount (PHP)",
      "Payment Method",
      "Proof of Payment (Screenshot)",
      "Special Notes",
      "Status",
    ];
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange
      .setFontWeight("bold")
      .setBackground("#4a4a4a")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateDriveFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

function getScreenshotPayload(payload) {
  if (payload.screenshotFile && payload.screenshotFilename) {
    return {
      fileContent: payload.screenshotFile,
      fileName: payload.screenshotFilename,
      fileMimeType: payload.screenshotMimeType || "image/png",
    };
  }

  if (
    payload.paymentScreenshot &&
    payload.paymentScreenshot.contentBase64 &&
    payload.paymentScreenshot.fileName
  ) {
    return {
      fileContent: payload.paymentScreenshot.contentBase64,
      fileName: payload.paymentScreenshot.fileName,
      fileMimeType: payload.paymentScreenshot.fileType || "image/png",
    };
  }

  return null;
}

function generateOrderId(sheet) {
  const lastRow = sheet.getLastRow();
  const date = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyMMdd");
  const sequence = lastRow.toString().padStart(4, "0");
  return `WWG-${date}-${sequence}`;
}

function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(
    JSON.stringify(data),
  ).setMimeType(ContentService.MimeType.JSON);
  return output;
}
