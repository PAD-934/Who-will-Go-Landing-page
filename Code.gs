/**
 * ═══════════════════════════════════════════════════════════════════
 * WHO WILL GO - COMPLETE ORDER MANAGEMENT SYSTEM (v3.1 - Final)
 *
 * This script contains two main functionalities:
 * 1. doPost(e): A web app endpoint that receives new orders from a landing page.
 * 2. onEdit(e): An automation trigger that physically moves order rows between
 *    sheets based on status changes.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

// ----------------- GLOBAL CONFIGURATION -----------------
const CONFIG = {
  SHEET_ID: "1K_lcQzY_2iNo-DEO206XJOkhtxa4Qz-CB7GUeoD4zVc",
  ORDERS_SHEET_NAME: "Orders",
  DRIVE_FOLDER_NAME: "Payment Screenshots",
  TIMEZONE: "Asia/Manila",
};

// ----------------- WEB APP: RECEIVES NEW ORDERS -----------------
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(
        { success: false, message: "No payload received." },
        400,
      );
    }

    const rawPayload = JSON.parse(e.postData.contents);
    const payload = normalizeRequestData(rawPayload);

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
            if (p.options && typeof p.options === "object") {
              Object.entries(p.options).forEach(([key, value]) => {
                if (!value) return;
                const label = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
                options.push(`${label}: ${value}`);
              });
            }
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
      payload.email || "",
      payload.phone || "",
      payload.address || "",
      payload.customerChurch || "N/A",
      productsString,
      payload.totalItems || 0,
      payload.totalAmount || 0,
      payload.paymentMethod || "",
      payload.transactionId || "",
      screenshotUrl,
      payload.notes || payload.specialNotes || "N/A",
      "Pending",
    ];

    orderSheet.appendRow(newRow);

    return createJsonResponse({
      success: true,
      orderId: orderId,
      paymentScreenshotUrl: screenshotUrl,
    });
  } catch (error) {
    Logger.log(`doPost Error: ${error.toString()}`);
    return createJsonResponse(
      { success: false, message: error.toString() },
      500,
    );
  }
}

// ----------------- AUTOMATION: MANAGES ORDER STATUS -----------------
function onEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();
    const sheetName = sheet.getName();
    const row = range.getRow();
    const column = range.getColumn();

    if (e.value === undefined || e.value === null) return;
    const newStatus = e.value.toString().trim();

    const STATUS_COLUMN = 15; // Column O

    const MONITORED_SHEETS = [
      CONFIG.ORDERS_SHEET_NAME,
      "Processing",
      "On Hold",
      "Cancelled",
      "Ready for Shipment",
      "Pending",
      "Completed",
    ];

    if (!MONITORED_SHEETS.includes(sheetName)) return;
    if (column !== STATUS_COLUMN) return;
    if (row === 1) return;
    if (newStatus === "") return;

    let targetSheetName = newStatus;
    if (newStatus === "Pending") {
      targetSheetName = CONFIG.ORDERS_SHEET_NAME;
    }

    if (targetSheetName === sheetName) {
      return;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const targetSheet = ss.getSheetByName(targetSheetName);
    const sourceDataRange = sheet.getRange(row, 1, 1, sheet.getLastColumn());
    const sourceData = sourceDataRange.getValues()[0];

    if (!targetSheet) {
      const newSheet = getOrCreateSheet(CONFIG.SHEET_ID, targetSheetName);
      newSheet.appendRow(sourceData);
      sheet.deleteRow(row);
    } else {
      targetSheet.appendRow(sourceData);
      sheet.deleteRow(row);
    }
  } catch (error) {
    Logger.log(
      `onEdit Error: ${error.toString()} | Sheet: ${e.range
        .getSheet()
        .getName()} | Cell: ${e.range.getA1Notation()} | New Value: ${e.value}`,
    );
  }
}

// ----------------- HELPER FUNCTIONS -----------------
function getOrCreateSheet(spreadsheetId, sheetName) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  ensureOrdersSheetHeaders(sheet);
  return sheet;
}

function ensureOrdersSheetHeaders(sheet) {
  if (!sheet) return;
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
    "Transaction ID",
    "Proof of Payment (Screenshot)",
    "Special Notes",
    "Status",
  ];

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      headers.length - sheet.getMaxColumns(),
    );
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, headers.length)
    .getValues()[0];
  const headersDiffer = headers.some(
    (header, index) => existingHeaders[index] !== header,
  );
  if (headersDiffer) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setFontWeight("bold")
    .setBackground("#4a4a4a")
    .setFontColor("#ffffff");
  sheet.setFrozenRows(1);
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

function normalizeRequestData(data) {
  const normalized = Object.assign({}, data);

  normalized.email = (data.email || data.customerEmail || "").trim();
  normalized.phone = (data.phone || data.customerContact || "").trim();
  normalized.address = (data.address || data.customerAddress || "").trim();
  normalized.transactionId = (
    data.transactionId ||
    data.gcashReference ||
    data.gCashReference ||
    ""
  ).trim();
  normalized.customerName = (
    data.customerName ||
    data.customer_name ||
    ""
  ).trim();
  normalized.customerChurch =
    data.customerChurch || data.customer_church || data.churchName || "";
  normalized.notes = (data.notes || data.specialNotes || "").trim();
  normalized.paymentMethod = data.paymentMethod || data.payment_method || "";
  normalized.products = Array.isArray(data.products) ? data.products : [];
  normalized.totalItems = Number(data.totalItems) || 0;
  normalized.totalAmount = Number(data.totalAmount) || 0;
  normalized.paymentScreenshot = data.paymentScreenshot || null;
  normalized.screenshotFile = data.screenshotFile || null;
  normalized.screenshotFilename = data.screenshotFilename || null;
  normalized.screenshotMimeType = data.screenshotMimeType || null;

  return normalized;
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
