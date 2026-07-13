// Global payment method toggle helper (keeps behavior outside validation scope)
function updatePaymentMethodFields(paymentMethod) {
  // debug: indicate the helper ran
  try {
    console.debug("updatePaymentMethodFields called:", paymentMethod);
  } catch (e) {}

  const transactionSection = document.getElementById("gcashTransactionSection");
  const gcashDetails = document.getElementById("gcashDetailsSection");
  const paymentScreenshotSection = document.getElementById(
    "paymentScreenshotSection",
  );
  const paymentMethodNote = document.getElementById("paymentMethodNote");
  const transactionInput = document.getElementById("transactionId");
  const paymentScreenshotInput = document.getElementById("paymentScreenshot");

  const showGcash = paymentMethod === "GCash";

  const hideClass = "hidden-by-payment";

  // Transaction section
  if (transactionSection) {
    if (showGcash) {
      transactionSection.classList.remove(hideClass);
      transactionSection.hidden = false;
      transactionSection.style.display = "";
    } else {
      transactionSection.classList.add(hideClass);
      transactionSection.hidden = true;
      transactionSection.style.display = "none";
    }
    if (transactionInput) {
      transactionInput.required = showGcash;
      if (!showGcash) {
        transactionInput.value = "";
        clearFieldError(transactionInput);
      }
    }
  }

  // GCash details block
  if (gcashDetails) {
    if (showGcash) gcashDetails.classList.remove(hideClass);
    else gcashDetails.classList.add(hideClass);
    gcashDetails.hidden = !showGcash;
  }

  // Proof upload
  if (paymentScreenshotSection) {
    if (showGcash) paymentScreenshotSection.classList.remove(hideClass);
    else paymentScreenshotSection.classList.add(hideClass);
    paymentScreenshotSection.hidden = !showGcash;
  }
  if (paymentScreenshotInput) paymentScreenshotInput.required = showGcash;

  // Note
  if (paymentMethodNote) {
    if (paymentMethod === "GCash") {
      paymentMethodNote.hidden = false;
      paymentMethodNote.innerHTML =
        "<strong>GCash selected.</strong> Required: Transaction ID and payment screenshot. Send payment to the number or QR code above, then upload your screenshot before submitting.";
      paymentMethodNote.style.display = "block";
    } else if (paymentMethod === "COD") {
      paymentMethodNote.hidden = false;
      paymentMethodNote.innerHTML =
        "<strong>Cash on Delivery selected.</strong> Required: provide your contact number and address. We will contact you to confirm delivery details and payment upon arrival. No GCash screenshot is needed.";
      paymentMethodNote.style.display = "block";
    } else if (paymentMethod === "Cash On Pick-up") {
      paymentMethodNote.hidden = false;
      paymentMethodNote.innerHTML =
        "<strong>Cash on Pick-up selected.</strong> Required: provide your contact number and address. We will contact you to arrange pick-up details and schedule once your order is confirmed.";
      paymentMethodNote.style.display = "block";
    } else {
      paymentMethodNote.hidden = true;
      paymentMethodNote.textContent = "";
      paymentMethodNote.style.display = "none";
    }
  }
}

try {
  window.updatePaymentMethodFields = updatePaymentMethodFields;
} catch (e) {}
