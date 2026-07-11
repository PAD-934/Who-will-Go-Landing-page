/* ==================== INITIALIZATION ==================== */
let mobileCheckoutGesturesInitialized = false;

function initializeApp() {
  const initSteps = [
    ["navigation", initializeNavigation],
    ["modals", initializeModals],
    ["thank you modal", initializeThankYouModal],
    ["token modal", initializeTokenModal],
    ["customize modal", initializeCustomizeModal],
    ["gallery lightbox", initializeGalleryLightbox],
    ["contact form", initializeContactForm],
    ["checkout form", initializeCheckoutForm],
    ["product filters", initializeProductFilters],
    ["product pricing", enhanceProductPricing],
    ["product modal", initializeProductModal],
    ["product hover preview", initializeProductHoverPreview],
    ["bottom nav", initializeBottomNav],
    ["lazy images", applyLazyImageLoading],
    ["scroll animations", initializeScrollAnimations],
    ["messenger visibility", initializeMessengerVisibilityForHero],
    ["cart bindings", attachCartBindings],
  ];

  initSteps.forEach(([name, step]) => {
    try {
      step();
    } catch (error) {
      console.warn(`WWG init failed: ${name}`, error);
    }
  });

  try {
    updateCartBadge();
    renderCartItems();
  } catch (e) {
    console.warn("Cart UI init failed", e);
  }
}

/* Customize modal behavior */
function initializeCustomizeModal() {
  const modal = document.getElementById("customizeModal");
  if (!modal) return;

  function openModal() {
    modal.classList.add("active");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    try {
      modal.querySelector(".modal-close")?.focus();
    } catch (e) {}
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest('[data-action="open-customize-modal"]');
    if (!trigger) return;
    e.preventDefault();
    const imageSrc = trigger.dataset.heroImage;
    const imageAlt = trigger.dataset.heroAlt || "Yarn's Of Joy";
    if (imageSrc) {
      openCustomizeWithImage(imageSrc, imageAlt);
    } else {
      openModal();
    }
  });

  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) closeModal();
  });
  modal
    .querySelectorAll(".modal-close")
    .forEach((btn) => btn.addEventListener("click", closeModal));

  const proceed = document.getElementById("proceedCustomizeBtn");
  if (proceed) {
    proceed.addEventListener("click", () => {
      // optional: copy suggested message for convenience
      try {
        const suggested =
          "Hi Yarn's Of Joy — I'd like to customize a crochet piece. Design: [describe]. Colors: [colors]. Size: [size]. Quantity: [qty]. Notes: [any].";
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(suggested)
            .then(() => {
              showToast(
                "Suggested message copied. Paste it when you message Yarn's Of Joy.",
              );
            })
            .catch(() => {});
        }
      } catch (e) {}
      window.open(
        "https://www.facebook.com/share/18GzwhJLgp/?mibextid=wwXIfr",
        "_blank",
        "noopener",
      );
      closeModal();
    });
  }

  // helper: set hero image src and open modal
  const heroImg = document.getElementById("customizeHeroImg");
  function openCustomizeWithImage(src, alt) {
    try {
      if (heroImg) {
        heroImg.src = src || "";
        heroImg.alt = alt || "Yarn's Of Joy";
        heroImg.style.display = src ? "block" : "none";
      }
    } catch (e) {}
    openModal();
  }

  // clear hero on modal close
  modal.querySelectorAll(".modal-close").forEach((btn) =>
    btn.addEventListener("click", () => {
      try {
        if (heroImg) heroImg.src = "";
      } catch (e) {}
    }),
  );
}

function initializeGalleryLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  if (!lightbox) return;

  const imageEl = document.getElementById("galleryLightboxImage");
  const captionEl = document.getElementById("galleryLightboxCaption");
  const closeBtn = lightbox.querySelector(".gallery-lightbox-close");
  const backdrop = lightbox.querySelector("[data-close-lightbox]");

  function openLightbox(src, alt, caption) {
    if (!imageEl) return;
    imageEl.src = src;
    imageEl.alt = alt || "Mission photo";
    captionEl.textContent = caption || alt || "Mission photo";
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
    if (imageEl) imageEl.src = "";
  }

  document.addEventListener("click", (event) => {
    const link =
      event.target.closest && event.target.closest(".gallery-card a");
    if (!link) return;
    const img = link.querySelector("img");
    const caption = link
      .closest(".gallery-card")
      ?.querySelector(".gallery-caption")?.textContent;
    const url = link.href;
    if (!url || !img) return;
    event.preventDefault();
    openLightbox(url, img.alt, caption);
  });

  closeBtn?.addEventListener("click", closeLightbox);
  backdrop?.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

function initializeThankYouModal() {
  const modal = document.getElementById("thankYouModal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".modal-close");
  const doneBtn = document.getElementById("closeThankyouModal");
  const triggerBtn = document.getElementById("tokenPrimaryBtn");
  const tokenModal = document.getElementById("tokenModal");
  let scrollPosition = 0;

  function openThankYouModal() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    modal.classList.add("active");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";

    if (tokenModal?.classList.contains("active")) {
      tokenModal.classList.remove("active");
      tokenModal.style.display = "none";
      tokenModal.setAttribute("aria-hidden", "true");
      try {
        document.body.classList.remove("token-modal-open");
      } catch (e) {}
    }

    setTimeout(() => {
      try {
        modal.querySelector(".modal-content")?.focus?.();
      } catch (e) {}
    }, 60);
  }

  function closeThankYouModal() {
    modal.classList.remove("active");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
  }

  if (triggerBtn) {
    triggerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openThankYouModal();
    });
  }

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeThankYouModal();
  });

  doneBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeThankYouModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeThankYouModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeThankYouModal();
    }
  });
}

/* Token modal: open/close and handlers */
function initializeTokenModal() {
  // target both header token trigger and bottom-nav token action
  const triggers = document.querySelectorAll(
    '[data-action="open-token-modal"], [data-action="token"]',
  );
  const modal = document.getElementById("tokenModal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".modal-close");
  const copyBtn = document.getElementById("tokenCopyBtn");
  const downloadLink = document.getElementById("tokenDownloadQr");
  const primaryBtn = document.getElementById("tokenPrimaryBtn");
  const qr = document.getElementById("tokenGcashQr");
  const thanks = document.getElementById("tokenThanks");

  function openModal() {
    modal.classList.add("active");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // reset internal scroll so mobile users see top content
    try {
      const content = modal.querySelector(".modal-content");
      if (content) content.scrollTop = 0;
    } catch (e) {}
    // add body class so floating chrome can be hidden while modal is open
    try {
      document.body.classList.add("token-modal-open");
    } catch (e) {}
    // focus close button for accessibility
    setTimeout(() => closeBtn?.focus(), 60);
    // gentle pulse on primary CTA
    if (primaryBtn) {
      primaryBtn.classList.add("pulse");
      setTimeout(() => primaryBtn.classList.remove("pulse"), 3200);
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
    try {
      document.body.classList.remove("token-modal-open");
    } catch (e) {}
  }

  triggers.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    }),
  );

  // delegated fallback: open modal if any element with matching action is clicked
  document.addEventListener("click", function delegatedTokenClick(e) {
    try {
      const el =
        e.target.closest &&
        e.target.closest(
          '[data-action="open-token-modal"], [data-action="token"]',
        );
      if (el) {
        e.preventDefault();
        openModal();
      }
    } catch (err) {}
  });
  closeBtn?.addEventListener("click", closeModal);

  // copy handler
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      const target = e.currentTarget.dataset.copyTarget || "tokenGcashNumber";
      const el = document.getElementById(target);
      if (!el) return showToast("Copy failed");
      try {
        await navigator.clipboard.writeText(el.textContent.trim());
        showToast("GCash number copied!");
      } catch (err) {
        showToast("Unable to copy");
      }
    });
  }

  // QR preview
  if (qr)
    qr.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.showPreviewBySrc)
        window.showPreviewBySrc(qr.src, qr.alt || "GCash QR");
    });
  if (downloadLink)
    downloadLink.addEventListener("click", () =>
      showToast("Downloading QR..."),
    );

  // primary donation flow: keep the button responsive and let the dedicated thank-you modal handle the popup
  if (primaryBtn) {
    primaryBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        primaryBtn.disabled = true;
        primaryBtn.classList.add("loading");
        const original = primaryBtn.textContent;
        primaryBtn.textContent = "Processing...";
        await new Promise((r) => setTimeout(r, 700));
        showToast("Thank you — your gift is appreciated.");
        primaryBtn.textContent = original;
        primaryBtn.classList.remove("loading");
        primaryBtn.disabled = false;
      } catch (err) {
        console.warn("donation flow error", err);
        primaryBtn.disabled = false;
        primaryBtn.classList.remove("loading");
        showToast("Something went wrong.");
      }
    });
  }

  // backdrop click and Escape to close
  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) closeModal();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

// Token modal now initialized as part of `initializeApp` steps.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Capture-phase fallback: catch pointerdown early even if other handlers stop propagation.
// This is a safe last-resort listener to ensure add-to-cart and cart open actions always fire.
try {
  if (!window._wwg_capture_listener_installed) {
    window.addEventListener(
      "pointerdown",
      function (e) {
        try {
          const t = e.target;
          const addBtn = t.closest && t.closest(".add-to-cart");
          if (addBtn) {
            const id = addBtn.dataset.id;
            if (id) {
              console.log("WWG capture: add-to-cart", id);
              try {
                // Intercept products that should open the product modal
                // instead of adding directly to cart.
                try {
                  const prod = findProduct(id);
                  if (prod && prod.openModalOnAdd) {
                    const pendingVariant =
                      e.target.closest && e.target.closest(".product-card")
                        ? e.target.closest(".product-card").dataset
                            .pendingVariant || null
                        : null;
                    openProductModal(id, pendingVariant, null, 1, true);
                    if (e.target.closest && e.target.closest(".product-card")) {
                      e.target.closest(".product-card").dataset.pendingVariant =
                        "";
                    }
                    setTimeout(() => {
                      try {
                        const addBtn = document.getElementById(
                          "productModalAddToCart",
                        );
                        if (addBtn) {
                          try {
                            addBtn.focus({ preventScroll: true });
                          } catch (err) {
                            addBtn.focus();
                          }
                          addBtn.classList.add("product-add-highlight");
                          setTimeout(
                            () =>
                              addBtn.classList.remove("product-add-highlight"),
                            1200,
                          );
                        }
                      } catch (e) {}
                    }, 140);
                    e.preventDefault && e.preventDefault();
                    return;
                  }
                } catch (e) {
                  console.warn("WWG capture openProductModal error", e);
                }
                // otherwise allow normal handlers to run (do not add here)
              } catch (err) {
                console.warn("WWG capture addToCart error", err);
              }
            }
          }

          const cartBtn =
            t.closest && t.closest("#cartButton, .bottom-nav-cart");
          if (cartBtn) {
            try {
              if (typeof toggleCart === "function") toggleCart();
            } catch (tcErr) {
              console.warn("WWG capture toggleCart error", tcErr);
            }
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            return;
          }
        } catch (ex) {
          console.warn("WWG capture listener error", ex);
        }
      },
      true,
    );
    window._wwg_capture_listener_installed = true;
  }
} catch (e) {
  console.warn("Failed to install WWG capture listener", e);
}

// Robust fallback: directly bind add-to-cart and cart button listeners.
// This helps if event delegation is prevented by other scripts or errors.
function attachCartBindings() {
  try {
    // bind add-to-cart buttons (both pointer and click for reliability)
    function bindAddBtn(btn) {
      if (!btn || btn.dataset.bound === "true") return;
      const handler = function (e) {
        try {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
        } catch (er) {}
        const id = btn.dataset.id;
        if (!id) return;
        try {
          console.log("Add to cart clicked", id);
          // For products that should open the product modal instead of
          // adding directly to cart.
          try {
            const prod = findProduct(id);
            const card = btn.closest && btn.closest(".product-card");
            const pendingVariant = card?.dataset?.pendingVariant || null;
            if (prod && prod.openModalOnAdd) {
              openProductModal(id, pendingVariant, null, 1, true);
              if (card) card.dataset.pendingVariant = "";
              setTimeout(() => {
                try {
                  const addBtn = document.getElementById(
                    "productModalAddToCart",
                  );
                  if (addBtn) {
                    try {
                      addBtn.focus({ preventScroll: true });
                    } catch (err) {
                      addBtn.focus();
                    }
                    addBtn.classList.add("product-add-highlight");
                    setTimeout(
                      () => addBtn.classList.remove("product-add-highlight"),
                      1200,
                    );
                  }
                } catch (e) {}
              }, 140);
              return;
            }
          } catch (e) {
            console.warn("attachCartBindings check openModalOnAdd error", e);
          }
          // For all add-to-cart buttons, open the product modal first.
          openProductModal(id, null, null, 1, true);
          setTimeout(() => {
            try {
              const addBtn = document.getElementById("productModalAddToCart");
              if (addBtn) {
                try {
                  addBtn.focus({ preventScroll: true });
                } catch (err) {
                  addBtn.focus();
                }
                addBtn.classList.add("product-add-highlight");
                setTimeout(
                  () => addBtn.classList.remove("product-add-highlight"),
                  1200,
                );
              }
            } catch (e) {}
          }, 140);
          return;
        } catch (err) {
          console.warn("addToCart failed:", err);
          showToast("Unable to add to cart. Please try again.");
        }
      };
      btn.addEventListener("pointerdown", handler, { passive: false });
      btn.addEventListener("click", handler, { passive: false });
      btn.dataset.bound = "true";
    }

    document.querySelectorAll(".add-to-cart").forEach(bindAddBtn);

    // observe future added buttons (e.g., dynamic product renders)
    if (!attachCartBindings.observer) {
      try {
        const mo = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const node of m.addedNodes || []) {
              if (!(node instanceof HTMLElement)) continue;
              if (node.matches && node.matches(".add-to-cart"))
                bindAddBtn(node);
              node.querySelectorAll &&
                node.querySelectorAll(".add-to-cart").forEach(bindAddBtn);
            }
          }
        });
        mo.observe(document.body, { childList: true, subtree: true });
        attachCartBindings.observer = mo;
      } catch (moErr) {
        // observer not supported — ignore
      }
    }

    // bind top nav cart button (pointer + click)
    const cartBtn = document.getElementById("cartButton");
    if (cartBtn && !cartBtn.dataset.bound) {
      const cb = function (e) {
        try {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        } catch (er) {}
        toggleCart();
      };
      cartBtn.addEventListener("pointerdown", cb, { passive: false });
      cartBtn.addEventListener("click", cb, { passive: false });
      cartBtn.dataset.bound = "true";
    }
  } catch (e) {
    // non-fatal — do not break the rest of the script
    console.warn("attachCartBindings error", e);
  }
}

function applyLazyImageLoading() {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    img.decoding = "async";
  });
}

/* ==================== MESSENGER VISIBILITY (HIDE ON HERO) ==================== */
function initializeProductHoverPreview() {
  const preview = document.createElement("div");
  preview.className = "image-preview-overlay";
  preview.setAttribute("role", "dialog");
  preview.setAttribute("aria-modal", "true");
  preview.setAttribute("aria-hidden", "true");
  preview.innerHTML = `
    <div class="image-preview-overlay-backdrop" aria-hidden="true"></div>
    <div class="image-preview-overlay-content">
      <button class="image-preview-overlay-close" aria-label="Close image preview" title="Close">&times;</button>
      <button class="image-preview-nav image-preview-nav-left" aria-label="Previous image">&#x2039;</button>
      <div class="image-preview-inner">
        <img src="" alt="" />
      </div>
      <button class="image-preview-nav image-preview-nav-right" aria-label="Next image">&#x203A;</button>
      <div class="image-preview-counter" aria-hidden="true"></div>
    </div>
  `;
  document.body.appendChild(preview);

  const previewImage = preview.querySelector("img");
  const previewLeft = preview.querySelector(".image-preview-nav-left");
  const previewRight = preview.querySelector(".image-preview-nav-right");
  const previewCounter = preview.querySelector(".image-preview-counter");
  const backdrop = preview.querySelector(".image-preview-overlay-backdrop");

  // navigation support for galleries opened in the preview
  let _navImages = [];
  let _navIndex = -1;

  function _resolveUrl(u) {
    try {
      return new URL(u, document.baseURI).href;
    } catch (e) {
      return String(u || "");
    }
  }

  function _openPreviewAtIndex(images, index, alt) {
    if (!images || !images.length) return;
    // normalize to absolute URLs to avoid mismatches between currentSrc and
    // provided gallery image strings (relative vs absolute paths)
    // normalize and remove duplicates while preserving order
    const resolved = [];
    const seen = new Set();
    for (const i of images) {
      const r = _resolveUrl(i);
      if (!r) continue;
      if (seen.has(r)) continue;
      seen.add(r);
      resolved.push(r);
    }
    _navImages = resolved;
    _navIndex = Math.max(0, Math.min(index || 0, _navImages.length - 1));
    // helper to render current index
    const _renderNavImage = (idx) => {
      const src = _navImages[idx] || "";
      previewImage.src = src;
      previewImage.alt = alt || previewImage.alt || "Product preview";
      if (previewCounter)
        previewCounter.textContent = `${idx + 1} / ${_navImages.length}`;
    };
    _renderNavImage(_navIndex);
    preview.setAttribute("aria-hidden", "false");
    preview.classList.add("visible");
    preview.style.display = "flex";
  }

  function showPreview(target) {
    const src = target.currentSrc || target.src;
    const alt = target.alt || "Product preview";
    // try to find sibling images for gallery navigation
    const gallery =
      target.closest(".product-gallery") || target.closest(".product-card");
    if (gallery) {
      const imgs = Array.from(gallery.querySelectorAll("img"))
        .map((i) => i.currentSrc || i.src)
        .filter(Boolean);
      const idx = imgs.indexOf(src);
      if (imgs.length && idx >= 0) {
        _openPreviewAtIndex(imgs, idx, alt);
        return;
      }
    }
    _openPreviewAtIndex([src], 0, alt);
  }

  function showPreviewBySrc(src, alt, galleryImgs) {
    if (!src) return;
    const resolvedSrc = _resolveUrl(src);
    if (Array.isArray(galleryImgs) && galleryImgs.length) {
      const resolvedGallery = galleryImgs
        .map((i) => _resolveUrl(i))
        .filter(Boolean);
      // try exact match first
      let idx = resolvedGallery.indexOf(resolvedSrc);
      if (idx === -1) {
        // fallback: try match by filename or pathname end (handles some CMS/resolved differences)
        const srcTail = resolvedSrc.split("/").slice(-1)[0];
        idx = resolvedGallery.findIndex(
          (g) => g.endsWith(srcTail) || g.includes(srcTail),
        );
      }
      if (idx >= 0) {
        _openPreviewAtIndex(resolvedGallery, idx, alt);
        return;
      }
      // no match but gallery present — open gallery starting at 0
      _openPreviewAtIndex(resolvedGallery, 0, alt);
      return;
    }
    _openPreviewAtIndex([resolvedSrc], 0, alt);
  }

  function hidePreview() {
    preview.setAttribute("aria-hidden", "true");
    preview.classList.remove("visible");
    preview.style.display = "none";
    _navImages = [];
    _navIndex = -1;
    // mark a short-lived flag so other global click handlers (e.g., product modal)
    // can ignore the next click. This avoids closing the product modal when
    // the user taps the preview's close button on mobile.
    try {
      window._justClosedImagePreview = Date.now();
      setTimeout(() => {
        window._justClosedImagePreview = 0;
      }, 400);
    } catch (e) {}
  }

  preview.style.display = "none";

  document.querySelectorAll(".product-card").forEach((card) => {
    const previewButton = card.querySelector(".view-product");
    const image = card.querySelector(".product-image img");
    if (previewButton && image) {
      previewButton.classList.add("product-summary-preview");
      previewButton.dataset.previewSrc = image.src;
      previewButton.dataset.previewAlt = image.alt || "Product preview";
      previewButton.setAttribute("aria-label", "Preview product image");
    }
  });

  // expose preview helpers for other UI elements (e.g., GCash QR image)
  try {
    window.showPreviewBySrc = showPreviewBySrc;
    window.showPreview = showPreview;
    window.hidePreview = hidePreview;
  } catch (e) {}

  // attach click-to-enlarge for GCash QR images added in the checkout form
  document.querySelectorAll(".gcash-instructions img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (ev) => {
      ev.preventDefault();
      const src = img.currentSrc || img.src;
      try {
        // use the exposed helper
        if (typeof window.showPreviewBySrc === "function") {
          window.showPreviewBySrc(src, img.alt || "GCash QR code");
        }
      } catch (err) {
        console.warn("Failed to open image preview", err);
      }
    });
  });

  document.addEventListener("pointerup", (event) => {
    const target = event.target;
    const summaryButton = target.closest(".product-summary-preview");
    if (summaryButton) {
      event.preventDefault();
      event.stopPropagation();
      const card = summaryButton.closest(".product-card");
      const variantId = summaryButton.dataset.variantId || null;
      if (card && variantId) {
        card.dataset.pendingVariant = variantId;
        card
          .querySelectorAll(".product-summary-preview.selected")
          .forEach((btn) => {
            btn.classList.remove("selected");
          });
        summaryButton.classList.add("selected");
      }
      showPreviewBySrc(
        summaryButton.dataset.previewSrc,
        summaryButton.dataset.previewAlt,
      );
      return;
    }

    const closeButton = target.closest(".image-preview-overlay-close");
    if (closeButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      hidePreview();
      return;
    }

    // if clicking on the preview area itself (not the image), close
    if (target === backdrop || target === preview) {
      event.preventDefault();
      event.stopImmediatePropagation();
      hidePreview();
      return;
    }

    // Clicking the enlarged image should not advance the gallery —
    // navigation is handled via the overlay nav buttons and keyboard only.
  });

  preview.addEventListener("click", (event) => {
    const target = event.target;
    const closeButton = target.closest(".image-preview-overlay-close");
    if (closeButton || target === backdrop || target === preview) {
      event.preventDefault();
      event.stopImmediatePropagation();
      hidePreview();
    }
  });

  const previewCloseButton = preview.querySelector(
    ".image-preview-overlay-close",
  );
  if (previewCloseButton) {
    previewCloseButton.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
  }

  // nav buttons
  if (previewLeft) {
    previewLeft.addEventListener("click", (ev) => {
      ev.preventDefault();
      if (_navImages.length > 1) {
        _navIndex = (_navIndex - 1 + _navImages.length) % _navImages.length;
        // update via centralized render
        previewImage.src = _navImages[_navIndex];
        previewImage.alt = previewImage.alt || "Product preview";
        if (previewCounter)
          previewCounter.textContent = `${_navIndex + 1} / ${_navImages.length}`;
      }
    });
  }
  if (previewRight) {
    previewRight.addEventListener("click", (ev) => {
      ev.preventDefault();
      if (_navImages.length > 1) {
        _navIndex = (_navIndex + 1) % _navImages.length;
        previewImage.src = _navImages[_navIndex];
        previewImage.alt = previewImage.alt || "Product preview";
        if (previewCounter)
          previewCounter.textContent = `${_navIndex + 1} / ${_navImages.length}`;
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hidePreview();
      return;
    }
    if (
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      _navImages.length > 1
    ) {
      event.preventDefault();
      if (event.key === "ArrowLeft") {
        _navIndex = (_navIndex - 1 + _navImages.length) % _navImages.length;
      } else {
        _navIndex = (_navIndex + 1) % _navImages.length;
      }
      previewImage.src = _navImages[_navIndex];
      previewImage.alt = previewImage.alt || "Product preview";
      if (previewCounter)
        previewCounter.textContent = `${_navIndex + 1} / ${_navImages.length}`;
    }
  });
}

function initializeBottomNav() {
  const nav = document.querySelector(".bottom-nav");
  if (!nav) return;

  nav.addEventListener("click", (event) => {
    const item = event.target.closest(".bottom-nav-item");
    if (!item) return;
    const action = item.dataset.action;
    event.preventDefault();

    document.querySelectorAll(".bottom-nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn === item);
    });

    switch (action) {
      case "home":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "shop":
        document.getElementById("store-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "missions":
        document.getElementById("missions")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "token":
        document.getElementById("donation")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "gallery":
        document.getElementById("mission-gallery")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "contact":
        document.getElementById("contact")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "cart":
        toggleCart();
        break;
    }
  });

  initializeBottomNavScrollSpy();
}

function setBottomNavActive(action) {
  const target = document.querySelector(
    `.bottom-nav-item[data-action="${action}"]`,
  );
  if (!target) return;
  document.querySelectorAll(".bottom-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn === target);
  });
}

function initializeBottomNavScrollSpy() {
  const shopSection = document.getElementById("store-section");
  const donationSection = document.getElementById("donation");
  const gallerySection = document.getElementById("mission-gallery");
  if (!shopSection || !donationSection) return;

  let shopTop = 0;
  let donationTop = 0;
  let galleryTop = Infinity;
  let ticking = false;

  const updateOffsets = () => {
    shopTop = shopSection.getBoundingClientRect().top + window.scrollY;
    donationTop = donationSection.getBoundingClientRect().top + window.scrollY;
    galleryTop = gallerySection
      ? gallerySection.getBoundingClientRect().top + window.scrollY
      : Infinity;
  };

  const refreshActiveNav = () => {
    ticking = false;
    const scrollIndicator = window.scrollY + window.innerHeight * 0.24;
    if (gallerySection && scrollIndicator >= galleryTop) {
      setBottomNavActive("gallery");
    } else if (scrollIndicator >= donationTop) {
      setBottomNavActive("token");
    } else if (scrollIndicator >= shopTop) {
      setBottomNavActive("shop");
    } else {
      setBottomNavActive("home");
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(refreshActiveNav);
    }
  };

  const onResize = () => {
    updateOffsets();
    refreshActiveNav();
  };

  updateOffsets();
  refreshActiveNav();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function initializeMessengerVisibilityForHero() {
  const fab = document.querySelector(".messenger-float-btn");
  const hero = document.querySelector(".hero");
  if (!fab || !hero || !("IntersectionObserver" in window)) return;

  // Start hidden when hero is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fab.classList.add("messenger-hidden");
        } else {
          fab.classList.remove("messenger-hidden");
        }
      });
    },
    { threshold: 0.05 },
  );

  observer.observe(hero);
}

/* ==================== PRODUCT FILTERS / TABS ==================== */
function initializeProductFilters() {
  const filterSelect = document.getElementById("productFilter");
  const tabs = document.querySelectorAll(".product-tabs .tab");
  const productsGrid = document.querySelector(".products-grid");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const shopSection = document.getElementById("shop");
  const noResults = document.createElement("div");
  noResults.className = "products-no-results";
  noResults.textContent = "No products match your selection.";
  if (productsGrid && !document.querySelector(".products-no-results")) {
    productsGrid.parentNode.insertBefore(noResults, productsGrid.nextSibling);
  }

  function applyFilters() {
    const activeTab = document.querySelector(".product-tabs .tab.active");
    const category = activeTab ? activeTab.dataset.category : "all";
    const tag = filterSelect ? filterSelect.value : "all";

    let visibleCount = 0;
    productCards.forEach((card) => {
      const cardCategory = card.dataset.category || "all";
      const cardTags = (card.dataset.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const categoryMatch = category === "all" || cardCategory === category;
      const tagMatch =
        tag === "all" || (tag === "limited" && cardTags.includes("limited"));

      if (categoryMatch && tagMatch) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    const nr = document.querySelector(".products-no-results");
    if (nr) nr.style.display = visibleCount ? "none" : "block";
  }

  function scrollToShopTop() {
    if (!shopSection) return;
    shopSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      // reset tab to 'all' if selecting global filter makes sense
      applyFilters();
      scrollToShopTop();
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      applyFilters();
      scrollToShopTop();
    });
  });

  // initial filter application
  applyFilters();
}

function enhanceProductPricing() {
  document.querySelectorAll(".product-price").forEach((priceEl) => {
    if (priceEl.dataset.currencyEnhanced) return;
    const text = priceEl.textContent.trim();
    const match = text.match(/^PHP\s+(.+)$/i);
    if (!match) return;
    priceEl.innerHTML =
      '<span class="price-currency">PHP</span> <span class="price-value">' +
      match[1] +
      "</span>";
    priceEl.dataset.currencyEnhanced = "true";
  });
}

/* ==================== NAVIGATION ==================== */
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navbar = document.querySelector(".navbar");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      const active = this.classList.toggle("active");
      navMenu.classList.toggle("active", active);
      this.setAttribute("aria-expanded", active ? "true" : "false");
      if (active) {
        toggleCart(false);
      }
    });
  }

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      if (hamburger) {
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
      if (navMenu) navMenu.classList.remove("active");
    });
  });

  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  });
}

/* ==================== MODALS ==================== */
function initializeModals() {
  // Love Gift modal removed — no modal initialization required here.
}

// Love Gift modal removed; functions removed.

function initializeProductModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;

  const closeButtons = modal.querySelectorAll(".product-modal-close");
  closeButtons.forEach((button) => {
    const stopCloseEvent = function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    button.addEventListener("pointerdown", stopCloseEvent);
    button.addEventListener("pointerup", stopCloseEvent);
    button.addEventListener("click", function (event) {
      stopCloseEvent(event);
      closeProductModal();
    });
  });

  modal.addEventListener("pointerdown", function (event) {
    if (event.target === modal) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      closeProductModal();
    }
  });
}

/* ==================== CONTACT FORM ==================== */
function initializeContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {
      fullName: formData.get("fullName")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
      timestamp: new Date().toISOString(),
    };

    if (!validateContactForm(data)) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showFormStatus(
        "success",
        "Message sent successfully! We'll be in touch soon.",
      );
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      saveContactMessage(data);
    }, 1200);
  });
}

function initializeCheckoutForm() {
  const form = document.getElementById("order-form");
  if (!form) return;
  form.addEventListener("submit", handleCheckoutSubmit);
  // real-time validation to toggle submit button glow/enable
  const fields = [
    "customerName",
    "customerEmail",
    "customerContact",
    "customerAddress",
    "paymentMethod",
    "transactionId",
  ];
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      clearFieldError(el);
      updateCheckoutSubmitState();
    });
    el.addEventListener("change", () => {
      clearFieldError(el);
      updateCheckoutSubmitState();
    });
  });
  const paymentInput = document.getElementById("paymentScreenshot");
  if (paymentInput)
    paymentInput.addEventListener("change", () => {
      clearFieldError(paymentInput);
      scheduleUpdateCheckoutSubmitState();
    });

  const mobileSubmitButton = document.getElementById("mobileSubmitBtn");
  if (mobileSubmitButton) {
    mobileSubmitButton.addEventListener("click", function (event) {
      event.preventDefault();
      if (form.dataset.submitting === "true" || mobileSubmitButton.disabled)
        return;
      mobileSubmitButton.disabled = true;
      if (form && typeof form.requestSubmit === "function") {
        form.requestSubmit();
      } else if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });
  }

  // sanitize contact input: digits only and max 11
  const contactEl = document.getElementById("customerContact");
  if (contactEl) {
    contactEl.addEventListener("input", function (e) {
      const v = this.value.replace(/[^0-9]/g, "").slice(0, 11);
      if (this.value !== v) this.value = v;
      scheduleUpdateCheckoutSubmitState();
    });
  }

  const checkoutForm = document.getElementById("order-form");
  const detailsPanel = document.getElementById("mobileCheckoutDetailsPanel");
  const mobileCheckoutFooter = document.querySelector(".checkout-fixed-footer");
  if (checkoutForm && mobileCheckoutFooter) {
    const setMobileCheckoutFooter = (visible) => {
      if (visible) {
        mobileCheckoutFooter.setAttribute("aria-hidden", "false");
        mobileCheckoutFooter.classList.remove("footer-hidden-during-input");
      } else {
        mobileCheckoutFooter.setAttribute("aria-hidden", "true");
        mobileCheckoutFooter.classList.add("footer-hidden-during-input");
      }
    };

    const shouldShowMobileFooter = () => {
      return (
        detailsPanel?.getAttribute("aria-hidden") === "false" &&
        !checkoutForm.contains(document.activeElement)
      );
    };

    const hideMobileFooter = () => setMobileCheckoutFooter(false);
    const restoreMobileFooter = () => {
      if (shouldShowMobileFooter()) {
        setMobileCheckoutFooter(true);
      }
    };

    checkoutForm.addEventListener("focusin", (event) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        hideMobileFooter();
      }
    });

    checkoutForm.addEventListener("focusout", () => {
      window.setTimeout(restoreMobileFooter, 120);
    });

    if (window.visualViewport) {
      let lastViewportHeight = window.visualViewport.height;
      window.visualViewport.addEventListener("resize", () => {
        const currentHeight = window.visualViewport.height;
        const keyboardOpen = currentHeight < lastViewportHeight - 100;
        lastViewportHeight = currentHeight;
        if (keyboardOpen) {
          hideMobileFooter();
        } else {
          restoreMobileFooter();
        }
      });
    }
  }

  // initial validation run (debounced)
  scheduleUpdateCheckoutSubmitState(60);
}

// Debounced validation scheduler to avoid showing the glow while the user is typing
let checkoutValidationTimer = null;
function scheduleUpdateCheckoutSubmitState(delay = 400) {
  if (checkoutValidationTimer) clearTimeout(checkoutValidationTimer);
  checkoutValidationTimer = setTimeout(() => {
    try {
      updateCheckoutSubmitState();
    } catch (e) {
      console.warn("Validation schedule failed", e);
    }
  }, delay);
}

async function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  if (!cart.length) {
    showToast("Your cart is empty. Add items before submitting.");
    return;
  }

  // run validation and show inline errors if any
  clearAllFieldErrors(form);
  const fieldErrors = validateCheckoutForm(form);
  if (fieldErrors.length) {
    fieldErrors.forEach((fe) => showFieldError(fe.el, fe.msg));
    const first = fieldErrors[0].el;
    try {
      first.focus();
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {}
    showOrderFeedback(
      "error",
      "Please fix the highlighted fields before submitting.",
    );
    setCheckoutSubmitting(form, false);
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const mobileSubmitBtn = document.getElementById("mobileSubmitBtn");
  if (form.dataset.submitting === "true") return;
  setCheckoutSubmitting(form, true, "Submitting order...");
  clearOrderFeedback();

  const orderId = document
    .getElementById("checkoutOrderId")
    ?.textContent.trim();
  const customerName = form.customerName.value.trim();
  const customerEmail = form.customerEmail.value.trim();
  const customerContact = form.customerContact.value.trim();
  const customerAddress = form.customerAddress.value.trim();
  const customerChurch = form.customerChurch.value.trim();
  const paymentMethod = form.paymentMethod.value.trim();
  const transactionId =
    form.transactionId && form.transactionId.value
      ? form.transactionId.value.trim()
      : "";
  const specialNotes = form.specialNotes.value.trim();
  const paymentInput = form.paymentScreenshot;

  if (!customerName || !customerEmail || !customerContact || !customerAddress) {
    showOrderFeedback("error", "Please complete all required contact fields.");
    setCheckoutSubmitting(form, false);
    return;
  }

  // ensure contact is 11 digits (numbers only)
  if (!/^[0-9]{11}$/.test(customerContact)) {
    showOrderFeedback(
      "error",
      "Please enter a valid 11-digit contact number (numbers only).",
    );
    setCheckoutSubmitting(form, false);
    return;
  }

  if (!paymentMethod) {
    showOrderFeedback("error", "Please select your payment method.");
    setCheckoutSubmitting(form, false);
    return;
  }

  // GCash reference is required for GCash payment method
  if (
    paymentMethod === "GCash" &&
    (!transactionId || transactionId.length < 6)
  ) {
    showOrderFeedback(
      "error",
      "Please enter a valid Transaction ID or GCash reference.",
    );
    setCheckoutSubmitting(form, false);
    return;
  }

  if (!paymentInput || !paymentInput.files || paymentInput.files.length === 0) {
    showOrderFeedback("error", "Please upload a screenshot of your payment.");
    setCheckoutSubmitting(form, false);
    return;
  }

  const paymentFile = paymentInput.files[0];
  let paymentScreenshotBase64;

  try {
    paymentScreenshotBase64 = await fileToBase64(paymentFile);
  } catch (error) {
    console.error(error);
    showOrderFeedback(
      "error",
      "Unable to read the payment screenshot. Please try a different file.",
    );
    setCheckoutSubmitting(form, false);
    return;
  }

  const orderItems = cart.map((item) => {
    const options = {};
    const product = findProduct(item.id);
    if (item.sizeLabel) options.size = item.sizeLabel;

    if (!product?.suppressOptionSelect) {
      const optionKey = product?.optionLabel || "color";
      const variantValue =
        item.variantLabel ||
        (item.variantId && getVariant(product, item.variantId)?.label) ||
        null;
      if (variantValue) {
        options[optionKey] = variantValue;
      }
    }

    return {
      name: item.title,
      quantity: item.qty,
      price: item.price,
      subtotal: item.price * item.qty,
      options,
      variantLabel: item.variantLabel || null,
    };
  });

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const orderDetails = orderItems
    .map((item) => {
      const optionText = item.options
        ? Object.entries(item.options)
            .map(([key, value]) => {
              if (!value) return "";
              const label = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
              return `${label}: ${value}`;
            })
            .filter(Boolean)
            .join(", ")
        : "";
      return `${item.name}${optionText ? ` (${optionText})` : ""} x${item.quantity}`;
    })
    .join("; ");

  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes("YOUR_")) {
    showOrderFeedback(
      "error",
      "Google Apps Script URL is not configured. Update the script.js file.",
    );
    setCheckoutSubmitting(form, false);
    return;
  }

  const payload = {
    orderId: orderId || `WWG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    customerName,
    email: customerEmail,
    customerEmail,
    phone: customerContact,
    customerContact,
    address: customerAddress,
    customerAddress,
    customerChurch,
    paymentMethod,
    transactionId,
    gcashReference: transactionId,
    notes: specialNotes,
    specialNotes,
    status: "Pending",
    paymentScreenshot: {
      contentBase64: paymentScreenshotBase64,
      fileName: paymentFile.name,
      fileType: paymentFile.type,
    },
    screenshotFile: paymentScreenshotBase64,
    screenshotFilename: paymentFile.name,
    screenshotMimeType: paymentFile.type || "image/png",
    products: orderItems,
    totalItems,
    totalAmount,
    orderDetails,
  };

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    let result = null;
    try {
      result = await response.json();
    } catch (error) {
      result = null;
    }

    if (!response.ok || (result && result.success === false)) {
      const errorMessage =
        result?.message ||
        `Unable to submit order. Server returned ${response.status}.`;
      throw new Error(errorMessage);
    }

    const serverOrderId = result?.orderId || payload.orderId;
    showOrderFeedback(
      "success",
      `Order submitted successfully. Your order ID is ${serverOrderId}.`,
    );
    // Populate and show receipt
    const receiptData = {
      orderId: serverOrderId,
      timestamp: payload.timestamp || new Date().toLocaleString(),
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerContact: payload.customerContact,
      customerAddress: payload.customerAddress,
      transactionId: payload.transactionId,
      paymentMethod: payload.paymentMethod,
      products: payload.products,
      totalItems: payload.totalItems,
      totalAmount: payload.totalAmount,
      specialNotes: payload.notes,
      status: payload.status || "Pending",
    };
    populateReceipt(receiptData);
    cart = [];
    saveCart();
    updateCartBadge();
    if (typeof renderCartItems === "function") {
      renderCartItems();
    }
    form.reset();
    // Keep checkout modal open so the user can view the confirmation receipt.
    // The receipt will be closed by the user with the Close Receipt button.
  } catch (error) {
    console.error("Checkout submission error:", error);
    showOrderFeedback(
      "error",
      error.message ||
        "Checkout failed. Please refresh the page and try again.",
    );
  } finally {
    setCheckoutSubmitting(form, false);
  }
}

function populateReceipt(data) {
  // Populate receipt fields (standalone receipt modal is used)
  document.getElementById("receiptOrderId").textContent = data.orderId || "-";
  document.getElementById("receiptTimestamp").textContent =
    data.timestamp || "-";
  document.getElementById("receiptCustomerName").textContent =
    data.customerName || data.customer_name || "-";
  document.getElementById("receiptCustomerEmail").textContent =
    data.email || data.customerEmail || "-";
  document.getElementById("receiptCustomerContact").textContent =
    data.phone || data.customerContact || "-";
  document.getElementById("receiptCustomerAddress").textContent =
    data.address || data.customerAddress || "-";
  document.getElementById("receiptTotalItems").textContent =
    data.totalItems || 0;
  document.getElementById("receiptTotalAmount").textContent = `PHP ${(
    data.totalAmount || 0
  ).toFixed(2)}`;
  document.getElementById("receiptPaymentMethod").textContent =
    data.paymentMethod || "-";
  const receiptTransactionId = document.getElementById("receiptTransactionId");
  if (receiptTransactionId)
    receiptTransactionId.textContent =
      data.transactionId || data.gcashReference || "-";

  document.getElementById("receiptSpecialNotes").textContent =
    data.notes || data.specialNotes || "-";
  document.getElementById("receiptStatus").textContent =
    data.status || "Pending";

  const productsEl = document.getElementById("receiptProducts");
  productsEl.innerHTML = "";
  if (Array.isArray(data.products) && data.products.length) {
    const list = document.createElement("ul");
    list.className = "receipt-products-list";
    data.products.forEach((p) => {
      const li = document.createElement("li");
      li.className = "receipt-product-item";
      const optionEntries = p.options ? Object.entries(p.options) : [];
      const sizeOption = optionEntries.find(
        ([key]) => key.toLowerCase() === "size",
      );
      const otherOptions = optionEntries.filter(
        ([key]) => key.toLowerCase() !== "size",
      );
      const opts = otherOptions.length
        ? " " +
          otherOptions
            .map(([key, value]) => {
              const label = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
              return `${label}: ${value}`;
            })
            .join(", ")
        : "";
      const qty = p.quantity || 1;
      const amount = (p.subtotal || p.price * qty).toFixed(2);
      const sizeHtml = sizeOption
        ? `<span class="rp-size">Size: ${sizeOption[1]}</span>`
        : "";
      li.innerHTML = `
        <div class="rp-main">
          <span class="rp-name">${p.name}</span>
          ${opts ? `<span class="rp-opts">${opts}</span>` : ""}
        </div>
        <div class="rp-meta">
          <span class="rp-qty">Qty: ${qty}</span>
          ${sizeHtml}
          <span class="rp-amount">PHP ${amount}</span>
        </div>
      `;
      list.appendChild(li);
    });
    productsEl.appendChild(list);
  } else {
    productsEl.textContent = data.orderDetails || "-";
  }

  // Open the standalone receipt modal
  openReceiptModal();
}

function openReceiptModal() {
  const modal = document.getElementById("receiptModal");
  if (!modal) return;
  // Close checkout modal if still open
  try {
    closeCheckoutModal();
  } catch (err) {}
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  // default receipt format to JPEG for easier image saving
  try {
    const fmt = document.getElementById("receiptFormat");
    if (fmt) fmt.value = "jpeg";
  } catch (e) {}
}

function closeReceiptModal() {
  const modal = document.getElementById("receiptModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function downloadReceipt(format) {
  const receiptCard = document.getElementById("receiptCard");
  if (!receiptCard) return;
  format = format || "pdf";
  if (typeof html2canvas === "undefined") {
    console.error("html2canvas not loaded");
    return;
  }
  // Render title + subtitle + receipt together by cloning into a temporary wrapper
  const titleEl = document.getElementById("receiptModalTitle");
  const modal = document.getElementById("receiptModal");
  const subtitleEl = modal ? modal.querySelector(".modal-subtitle") : null;
  const wrapper = document.createElement("div");
  wrapper.style.background = "#ffffff";
  wrapper.style.padding = "24px";
  wrapper.style.width = "780px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.fontFamily =
    getComputedStyle(document.body).fontFamily ||
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
  if (titleEl) wrapper.appendChild(titleEl.cloneNode(true));
  if (subtitleEl) wrapper.appendChild(subtitleEl.cloneNode(true));
  wrapper.appendChild(receiptCard.cloneNode(true));
  // place offscreen so html2canvas can render computed styles
  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  document.body.appendChild(wrapper);

  const scale = Math.min(2, window.devicePixelRatio || 1);
  const canvas = await html2canvas(wrapper, {
    scale,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  // remove wrapper after render
  wrapper.remove();
  if (format === "png" || format === "jpeg") {
    const mime = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(mime, 0.95);
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const orderId = (
      document.getElementById("receiptOrderId")?.textContent || "receipt"
    ).replace(/[^a-z0-9-_.]/gi, "_");
    const ext = format === "jpeg" ? "jpg" : "png";
    a.download = `${orderId}-receipt.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  // PDF flow using jsPDF
  if (typeof window.jspdf === "undefined") {
    console.error("jsPDF not loaded");
    return;
  }
  const { jsPDF } = window.jspdf;
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const availableWidth = pageWidth - margin * 2;
  const imgProps = { width: canvas.width, height: canvas.height };
  const imgHeight = (imgProps.height * availableWidth) / imgProps.width;
  let y = margin;
  pdf.addImage(imgData, "PNG", margin, y, availableWidth, imgHeight);
  const orderId2 = (
    document.getElementById("receiptOrderId")?.textContent || "receipt"
  ).replace(/[^a-z0-9-_.]/gi, "_");
  pdf.save(`${orderId2}-receipt.pdf`);
}

// Real-time validation helper for the checkout form
function updateCheckoutSubmitState() {
  const form = document.getElementById("order-form");
  if (!form) return;
  const btn = document.getElementById("submitOrderBtn");
  if (!btn) return;

  const name = form.customerName.value.trim();
  const email = form.customerEmail.value.trim();
  const contact = form.customerContact.value.trim();
  const address = form.customerAddress.value.trim();
  const paymentMethod = form.paymentMethod.value.trim();
  const transactionId = form.transactionId?.value.trim() || "";
  const paymentInput = form.paymentScreenshot;

  const hasPayment =
    paymentInput && paymentInput.files && paymentInput.files.length > 0;
  const contactValid = /^[0-9]{11}$/.test(contact);
  const transactionIdRequired = paymentMethod === "GCash";
  const transactionIdValid =
    !transactionIdRequired || (transactionId && transactionId.length >= 6);

  const requiredFieldsValid =
    name &&
    isValidEmail(email) &&
    contactValid &&
    address &&
    paymentMethod &&
    hasPayment;

  const isSubmitting = form.dataset.submitting === "true";
  const mobileBtn = document.getElementById("mobileSubmitBtn");

  btn.disabled = isSubmitting;
  if (mobileBtn) mobileBtn.disabled = isSubmitting;

  const canGlow = requiredFieldsValid && transactionIdValid && !isSubmitting;
  if (canGlow) {
    btn.classList.add("glow");
    if (mobileBtn) mobileBtn.classList.add("glow");
    try {
      clearOrderFeedback();
    } catch (e) {}
  } else {
    btn.classList.remove("glow");
    if (mobileBtn) mobileBtn.classList.remove("glow");

    if (transactionIdRequired && !transactionIdValid && requiredFieldsValid) {
      showOrderFeedback(
        "error",
        "GCash payments require a Transaction ID or reference number before submission.",
      );
    } else if (!requiredFieldsValid) {
      showOrderFeedback(
        "error",
        "Please complete all required fields before submitting your order.",
      );
    }
  }
}

// Show inline field error message
function showFieldError(el, message) {
  if (!el) return;
  el.classList.add("invalid");
  el.setAttribute("aria-invalid", "true");
  const errorId = `${el.id || "field"}-error`;
  let err = el.nextElementSibling;
  if (!err || !err.classList || !err.classList.contains("field-error")) {
    err = document.createElement("div");
    err.className = "field-error";
    err.id = errorId;
    err.setAttribute("role", "alert");
    err.setAttribute("aria-live", "polite");
    el.parentNode.insertBefore(err, el.nextSibling);
  } else if (!err.id) {
    err.id = errorId;
  }
  el.setAttribute("aria-describedby", errorId);
  err.textContent = message;
}

function clearFieldError(el) {
  if (!el) return;
  el.classList.remove("invalid");
  el.removeAttribute("aria-invalid");
  el.removeAttribute("aria-describedby");
  const next = el.nextElementSibling;
  if (next && next.classList && next.classList.contains("field-error")) {
    next.remove();
  }
  // If no more invalid fields remain in the form, clear the top-level order feedback
  try {
    const form =
      el.closest && el.closest("form")
        ? el.closest("form")
        : document.getElementById("order-form");
    const anyInvalid = form ? form.querySelector(".invalid") : null;
    if (!anyInvalid) {
      clearOrderFeedback();
    }
  } catch (e) {}
}

function clearAllFieldErrors(form) {
  if (!form) return;
  const els = form.querySelectorAll(".invalid");
  els.forEach((e) => e.classList.remove("invalid"));
  form.querySelectorAll(".field-error").forEach((d) => d.remove());
}

function validateCheckoutForm(form) {
  const errors = [];
  const name = form.customerName && form.customerName.value.trim();
  const email = form.customerEmail && form.customerEmail.value.trim();
  const contact = form.customerContact && form.customerContact.value.trim();
  const address = form.customerAddress && form.customerAddress.value.trim();
  const paymentMethod = form.paymentMethod && form.paymentMethod.value.trim();
  const paymentInput = form.paymentScreenshot;

  if (!name)
    errors.push({ el: form.customerName, msg: "Please enter your full name." });
  if (!email || !isValidEmail(email))
    errors.push({
      el: form.customerEmail,
      msg: "Please enter a valid email address.",
    });
  if (!contact)
    errors.push({
      el: form.customerContact,
      msg: "Please enter your contact number (11 digits).",
    });
  else if (!/^[0-9]{11}$/.test(contact))
    errors.push({
      el: form.customerContact,
      msg: "Contact must be 11 digits, numbers only.",
    });
  if (!address)
    errors.push({
      el: form.customerAddress,
      msg: "Please enter your full address.",
    });
  if (!paymentMethod)
    errors.push({
      el: form.paymentMethod,
      msg: "Please select a payment method.",
    });
  if (paymentMethod === "GCash") {
    const transactionId =
      form.transactionId && form.transactionId.value
        ? form.transactionId.value.trim()
        : "";
    if (!transactionId || transactionId.length < 6)
      errors.push({
        el: form.transactionId,
        msg: "Please enter the GCash Transaction ID or reference number.",
      });
  }
  if (!paymentInput || !paymentInput.files || paymentInput.files.length === 0)
    errors.push({
      el: paymentInput || form.paymentScreenshot,
      msg: "Please upload a screenshot of your payment.",
    });

  return errors;
}

// Attach receipt modal button handlers
document.addEventListener("click", (e) => {
  const t = e.target;
  if (!t) return;

  const copyButton = t.closest(".copy-button");
  if (copyButton) {
    e.preventDefault();
    const targetId = copyButton.dataset.copyTarget;
    const targetEl = targetId ? document.getElementById(targetId) : null;
    const value = targetEl ? targetEl.textContent.trim() : "";
    if (value) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(() => {
          showToast("GCash number copied!");
          try {
            showCopiedPopup(copyButton, "Copied");
          } catch (e) {}
        });
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast("GCash number copied!");
        try {
          showCopiedPopup(copyButton, "Copied");
        } catch (e) {}
      }
    }
    return;
  }

  if (t.id === "receiptCloseBtn" || t.id === "receiptModalClose") {
    closeReceiptModal();
  }
  if (t.id === "receiptDownloadBtn") {
    const fmtSelect = document.getElementById("receiptFormat");
    const format = (fmtSelect?.value || "pdf").toLowerCase();
    const receiptCard = document.getElementById("receiptCard");
    if (!receiptCard) return;
    // call download flow
    downloadReceipt(format).catch((err) =>
      console.error("Download error", err),
    );
  }
});

// Global keyboard handler: Esc closes active modals for accessibility
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    const checkoutModal = document.getElementById("checkoutModal");
    const receiptModal = document.getElementById("receiptModal");
    if (checkoutModal && checkoutModal.classList.contains("active")) {
      closeCheckoutModal();
      return;
    }
    if (receiptModal && receiptModal.classList.contains("active")) {
      closeReceiptModal();
      return;
    }
  }

  // keyboard activation for mobile summary bar (Enter / Space)
  if (e.key === "Enter" || e.key === " ") {
    const active = document.activeElement;
    if (active && active.id === "mobileSummaryBar") {
      const details = document.getElementById("mobileSummaryDetails");
      if (!details) return;
      const isOpen = !details.hidden;
      details.hidden = isOpen;
      details.setAttribute("aria-hidden", String(isOpen));
      const bar = document.getElementById("mobileSummaryBar");
      const toggleBtn = document.getElementById("mobileSummaryToggle");
      if (bar) bar.setAttribute("aria-expanded", String(!isOpen));
      if (toggleBtn) toggleBtn.textContent = isOpen ? "▾" : "▴";
      if (!isOpen)
        details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});

function validateContactForm(data) {
  if (!data.fullName) {
    showFormStatus("error", "Please enter your full name.");
    return false;
  }
  if (!data.email || !isValidEmail(data.email)) {
    showFormStatus("error", "Please enter a valid email address.");
    return false;
  }
  if (!data.message) {
    showFormStatus("error", "Please enter your message.");
    return false;
  }
  return true;
}

function showFormStatus(type, message) {
  const status = document.getElementById("formStatus");
  if (!status) return;

  status.className = `form-status ${type}`;
  status.textContent = message;
  status.style.display = "block";

  setTimeout(() => {
    status.style.display = "none";
  }, 5000);
}

function saveContactMessage(data) {
  const existing = JSON.parse(localStorage.getItem("contactMessages") || "[]");
  existing.push(data);
  localStorage.setItem("contactMessages", JSON.stringify(existing));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Love Gift form removed */

/* Love Gift storage removed */

/* ==================== SCROLL ANIMATIONS ==================== */
function initializeScrollAnimations() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
  );

  document
    .querySelectorAll(
      ".step-card, .product-card, .story-card, .contact-info, .contact-form-wrapper, .cta-banner, .mission-content",
    )
    .forEach((el) => {
      observer.observe(el);
    });
}

/* ==================== BUTTON INTERACTIONS ==================== */
function showToast(message, duration = 3500) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast.dismissTimer);
  toast.dismissTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}
window.showToast = showToast;

// Small popup near the clicked element to confirm copy action
function showCopiedPopup(targetEl, message = "Copied") {
  try {
    if (!targetEl) return;
    const popup = document.createElement("div");
    popup.className = "copied-popup";
    popup.textContent = message;
    document.body.appendChild(popup);
    const rect = targetEl.getBoundingClientRect();
    // position above the button, centered
    const left = rect.left + rect.width / 2;
    const top = rect.top - 12;
    popup.style.left = left + "px";
    popup.style.top = top + "px";
    // animate in
    requestAnimationFrame(() => popup.classList.add("visible"));
    setTimeout(() => {
      popup.classList.remove("visible");
      setTimeout(() => popup.remove(), 300);
    }, 1500);
  } catch (e) {
    console.warn("showCopiedPopup failed", e);
  }
}

function showOrderFeedback(type, message) {
  const feedback = document.getElementById("orderFeedback");
  if (!feedback) return;
  feedback.className = `checkout-feedback ${type}`;
  feedback.textContent = message;
}

function clearOrderFeedback() {
  const feedback = document.getElementById("orderFeedback");
  if (!feedback) return;
  feedback.textContent = "";
  feedback.className = "checkout-feedback";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        resolve(dataUrl.replace(/^data:[^;]+;base64,/, ""));
      } else {
        reject(new Error("Unable to encode file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function toggleSubmitButton(button, isLoading, label) {
  if (!button) return;
  button.disabled = isLoading;
  if (isLoading) {
    button.dataset.originalText = button.textContent.trim();
    button.classList.add("loading");

    let spinner = button.querySelector(".button-spinner");
    if (!spinner) {
      spinner = document.createElement("span");
      spinner.className = "button-spinner";
    }

    const labelText = label || "Submitting...";
    let labelSpan = button.querySelector(".button-label");
    if (!labelSpan) {
      labelSpan = document.createElement("span");
      labelSpan.className = "button-label";
    }
    labelSpan.textContent = labelText;

    button.innerHTML = "";
    button.appendChild(spinner);
    button.appendChild(labelSpan);
  } else {
    button.classList.remove("loading");
    const originalText = button.dataset.originalText || "Submit Order";
    button.textContent = originalText;
  }
}

function setCheckoutSubmitting(form, isLoading, label = "Submitting order...") {
  if (!form) return;
  if (isLoading) {
    form.dataset.submitting = "true";
  } else {
    delete form.dataset.submitting;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) toggleSubmitButton(submitBtn, isLoading, label);

  const mobileSubmitBtn = document.getElementById("mobileSubmitBtn");
  if (mobileSubmitBtn) toggleSubmitButton(mobileSubmitBtn, isLoading, label);
}

/* ==================== SIMPLE CART ==================== */
const PRODUCTS = [
  {
    id: "1",
    title: "Who Will Go Mug",
    price: 120,
    img: "Who Will Go Products/Mugs/Mug.png",
    video: "Who Will Go Products/Mugs/MOCKUP Mug.mp4",
    description:
      "Ceramic mug with a statement design — perfect for morning coffee and mission-minded conversations.",
  },
  {
    id: "2",
    title: "Who Will Go Tote Bag",
    price: 130,
    img: "Who Will Go Products/Tote Bag/Tote Bag.png",
    optionLabel: "design",
    description:
      "A polished tote bag with mission-inspired designs and a premium everyday finish.",
    options: [
      {
        id: "faith-can-move-mountains",
        label: "Faith Can Move Mountains",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 2 - Faith Can Move Mountains.png",
      },
      {
        id: "faith-over-fear",
        label: "Faith Over Fear",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 1 - Faith Over Fear.png",
      },
      {
        id: "trust-in-the-lord",
        label: "Trust In The Lord",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 3 - Trust In The Lord.png",
      },
      {
        id: "reach-the-nations",
        label: "Reach The Nations",
        img: "Who Will Go Products/Tote Bag/Tote Bag Different Design option/Tote Bag design 4 - Reach The Nations, Make Jesus Known.png",
      },
    ],
  },
  {
    id: "20",
    title: "CROSS T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/CROSS Design Main.png",
    optionLabel: "color",
    description:
      "Signature CROSS tee with premium print quality. Available in adult and kids sizes for mission squads of every age.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Blue.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/T-Shirts/CROSS different color options/CROSS - Green.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "21",
    title: "HERE AM I T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/HERER AM I design Main.png",
    optionLabel: "color",
    description:
      "Bold HERE AM I statement tee with mission-minded style. Available in adult and kids sizes.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Blue.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/T-Shirts/HERE AM I different color options/HERE AM I - Green.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "22",
    title: "NEVER FAILS T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/NEVER FAILS Design Main.png",
    optionLabel: "color",
    description:
      "A powerful NEVER FAILS tee with two standout color choices. Available in adult and kids sizes.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/NEVER FAILS different color options/NEVER FAILS - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/NEVER FAILS different color options/NEVER FAILS - Black.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "23",
    title: "REDEEMED T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/REDEEMED Design Main.png",
    optionLabel: "color",
    description:
      "REDEEMED themed tee with bold mission messaging. Available in adult and kids sizes.",
    options: [
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/REDEEMED different color options/REDEEMED - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/REDEEMED different color options/REDEEMED - Blue.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  {
    id: "24",
    title: "SHEEP T-Shirt",
    category: "t-shirts",
    price: 250,
    img: "Who Will Go Products/T-Shirts/SHEEP Design Main.png",
    optionLabel: "color",
    description:
      "Sheep graphic tee with a faithful message and flexible sizing for kids and adults.",
    options: [
      {
        id: "beige",
        label: "Beige",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Beige.png",
      },
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Blue.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/T-Shirts/SHEEP different color options/SHEEP - Green.png",
      },
    ],
    sizes: [
      { id: "kids-6", label: "Size #6 (Kids)", category: "Kids", price: 150 },
      { id: "kids-8", label: "Size #8 (Kids)", category: "Kids", price: 150 },
      { id: "kids-10", label: "Size #10 (Kids)", category: "Kids", price: 150 },
      { id: "kids-12", label: "Size #12 (Kids)", category: "Kids", price: 150 },
      { id: "kids-14", label: "Size #14 (Kids)", category: "Kids", price: 150 },
      { id: "adult-xs", label: "XS", category: "Adult", price: 250 },
      { id: "adult-s", label: "S", category: "Adult", price: 250 },
      { id: "adult-m", label: "M", category: "Adult", price: 250 },
      { id: "adult-l", label: "L", category: "Adult", price: 250 },
      { id: "adult-xl", label: "XL", category: "Adult", price: 250 },
      { id: "adult-2xl", label: "2XL", category: "Adult", price: 250 },
    ],
  },
  // Ptr. Adewale Books bundle (4 books) - id 30
  {
    id: "30",
    title: "Ptr. Adewale Books Bundle (4 books)",
    category: "books",
    price: 250,
    img: "Who Will Go Products/Books/main books.png",
    description:
      "Bundle: four ministry books curated by Ptr. Adewale. Includes Baptism of the Holy Spirit; How to Obtain Fullness of Power; Why God Used D. L. Moody; Ten Reasons Why I Believe the Bible.",
    tags: ["bundle", "books"],
    openModalOnAdd: true,
    suppressOptionSelect: true,
    options: [
      {
        id: "book-1",
        label: "Baptism of the Holy Spirit",
        img: "Who Will Go Products/Books/1.png",
      },
      {
        id: "book-2",
        label: "How to Obtain Fullness of Power",
        img: "Who Will Go Products/Books/2.png",
      },
      {
        id: "book-3",
        label: "Why God Used D. L. Moody",
        img: "Who Will Go Products/Books/3.png",
      },
      {
        id: "book-4",
        label: "Ten Reasons Why I Believe the Bible",
        img: "Who Will Go Products/Books/4.png",
      },
    ],
  },
  {
    id: "31",
    title: "Adewale Single Book Collection",
    category: "books",
    price: 60,
    img: "Who Will Go Products/Books/main book 1.png",
    optionLabel: "book",
    description:
      "Choose a single title from the Adewale book collection. Each booklet is sold per piece at PHP 60, with a clean preview of every cover and easy selection.",
    tags: ["books", "single"],
    options: [
      {
        id: "i-must-go",
        label: "I Must Go",
        img: "Who Will Go Products/Books/options/I Must Go.png",
      },
      {
        id: "hebrew-children-series",
        label: "Hebrew Children Series",
        img: "Who Will Go Products/Books/options/20.png",
      },
      {
        id: "5-things-robert-smith-taught-me",
        label: "5 Things Robert Smith Taught Me",
        img: "Who Will Go Products/Books/options/50.png",
      },
      {
        id: "the-bus-ministry",
        label: "The Bus Ministry",
        img: "Who Will Go Products/Books/options/60.png",
      },
      {
        id: "africans-in-the-bible",
        label: "Africans in the Bible",
        img: "Who Will Go Products/Books/options/Africans in the Bible.png",
      },
    ],
  },
  {
    id: "6",
    title: "Who Will Go Cap",
    price: 150,
    img: "Who Will Go Products/Caps/Caps.png",
    optionLabel: "color",
    description:
      "A refined cap with premium stitching and selectable color options for everyday mission-minded wear.",
    options: [
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Blue.png",
      },
      {
        id: "gray",
        label: "Gray",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Gray.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/Caps/Caps Different Color option/Caps - Green.png",
      },
    ],
  },
  {
    id: "10",
    title: "Who Will Go Pins",
    price: 25,
    img: "Who Will Go Products/Accessories/Pins.png",
    optionLabel: "design",
    description:
      "Premium enamel pin designs crafted for everyday wear, backpacks, and mission-inspired gifts.",
    options: [
      {
        id: "love-conquers-all",
        label: "Love Conquers All",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 1 - Love Conquers All.png",
      },
      {
        id: "loved-and-blessed",
        label: "Loved & Blessed",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins Design 2 - Loved and Blessed.png",
      },
      {
        id: "faith-over-fear",
        label: "Faith Over Fear",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 3 - Faith over Fear.png",
      },
      {
        id: "saved-by-grace-alone",
        label: "Saved by Grace Alone",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 4 - Saved By Grace Alone.png",
      },
      {
        id: "peace-love-joy",
        label: "Peace Love Joy",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 5 - Peace Love Joy.png",
      },
      {
        id: "its-gonna-be-ok",
        label: "It’s Gonna Be Ok",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 6 - It's Gonna Be Ok.png",
      },
      {
        id: "let-your-light-shine",
        label: "Let Your Light Shine",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 7 - Let Your Light Shine.png",
      },
      {
        id: "jesus-brings-purpose",
        label: "Jesus Brings Purpose",
        img: "Who Will Go Products/Accessories/Pins Different  Design option/Pins design 8 - Jesus Brings Purpose.png",
      },
    ],
  },
  {
    id: "11",
    title: "Who Will Go Bamboo Notebook",
    price: 100,
    img: "Who Will Go Products/Accessories/Bamboo Notebook.png",
    optionLabel: "design",
    description:
      "A premium bamboo notebook featuring mission-driven artwork and a refined, eco-friendly finish.",
    options: [
      {
        id: "gods-grace-is-sufficient",
        label: "God's Grace is Sufficient",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 1 - God's Grace is Sufficient.png",
      },
      {
        id: "here-am-i-send-me",
        label: "HERE AM I Send Me",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 2 - HERE AM I Send Me.png",
      },
      {
        id: "faith-can-move-mountains",
        label: "Faith Can Move Mountains",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 3 - Faith Can Move Mountains.png",
      },
      {
        id: "i-can-do-all-things",
        label: "I Can Do All Things",
        img: "Who Will Go Products/Accessories/Bamboo Notebook Different Design option/Bamboo Notebook design 4 - I Can Do All Things Through Christ Who Strengtheneth Me.png",
      },
    ],
  },
  {
    id: "12",
    title: "Who Will Go Magnetic Bookmark",
    price: 30,
    img: "Who Will Go Products/Accessories/Magnetic Bookmark.png",
    description:
      "Stylish magnetic bookmark that keeps your place securely while showcasing mission-driven reading.",
  },
  {
    id: "13",
    title: "Crochet Desk Mat",
    price: 155,
    img: "Who Will Go Products/Crochet/Desk-Mat.jpg",
    description:
      "A premium crochet desk mat with a soft, textured surface that protects your workspace and adds a handmade touch.",
    options: [
      {
        id: "black",
        label: "Black",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Black.png",
      },
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Blue.png",
      },
      {
        id: "brown",
        label: "Brown",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Brown.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Green.png",
      },
      {
        id: "pink",
        label: "Pink",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Pink.png",
      },
      {
        id: "purple",
        label: "Purple",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Purple.png",
      },
      {
        id: "red",
        label: "Red",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Red.png",
      },
      {
        id: "yellow",
        label: "Yellow",
        img: "Who Will Go Products/Crochet/Desk-Mat different color/Yellow.png",
      },
    ],
  },
  {
    id: "14",
    title: "Coaster",
    price: 60,
    img: "Who Will Go Products/Crochet/Coaster.jpg",
    description:
      "Handcrafted crochet coaster that protects surfaces and adds a warm, textured accent to any tabletop.",
    options: [
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Crochet/Coaster different color/Blue.png",
      },
      {
        id: "bud-green",
        label: "Bud Green",
        img: "Who Will Go Products/Crochet/Coaster different color/Bud Green.png",
      },
      {
        id: "deep-purple",
        label: "Deep Purple",
        img: "Who Will Go Products/Crochet/Coaster different color/Deep Purple.png",
      },
      {
        id: "honey-yellow",
        label: "Honey Yellow",
        img: "Who Will Go Products/Crochet/Coaster different color/Honey Yellow.png",
      },
      {
        id: "light-brown",
        label: "Light Brown",
        img: "Who Will Go Products/Crochet/Coaster different color/Light Brown.png",
      },
      {
        id: "light-pink",
        label: "Light Pink",
        img: "Who Will Go Products/Crochet/Coaster different color/Light Pink.png",
      },
      {
        id: "red",
        label: "Red",
        img: "Who Will Go Products/Crochet/Coaster different color/Red.png",
      },
    ],
  },
  {
    id: "15",
    title: "Flower Keychain in a pouch",
    price: 155,
    img: "Who Will Go Products/Crochet/Flower Keychain in a pouch.jpg",
    description:
      "A beautiful crochet flower keychain with a fabric pouch — perfect for gifting or keeping keys stylish.",
    options: [
      {
        id: "banana-yellow",
        label: "Banana Yellow",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/BANANA YELLOW.png",
      },
      {
        id: "blush-pink",
        label: "Blush Pink",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/BLUSH PINK.png",
      },
      {
        id: "lavender",
        label: "Lavender",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/LAVENDER.png",
      },
      {
        id: "light-brown",
        label: "Light Brown",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/LIGHT BROWN.png",
      },
      {
        id: "light-orange",
        label: "Light Orange",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/LIGHT ORANGE.png",
      },
      {
        id: "mint-green",
        label: "Mint Green",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/MINT GREEN.png",
      },
      {
        id: "sky-blue",
        label: "Sky Blue",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/SKY BLUE.png",
      },
      {
        id: "watermelon-red",
        label: "Watermelon Red",
        img: "Who Will Go Products/Crochet/Flower Keychain in a pouch different color/WATERMELON RED.png",
      },
    ],
  },
  {
    id: "16",
    title: "Flower Bouquet Keychain",
    price: 130,
    img: "Who Will Go Products/Crochet/Flower Bouquet Keychain.jpg",
    description:
      "Handmade crochet bouquet keychain with delicate detailing for everyday inspiration.",
    options: [
      {
        id: "blue",
        label: "Blue",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/BLUE.png",
      },
      {
        id: "green",
        label: "Green",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/GREEN.png",
      },
      {
        id: "pink",
        label: "Pink",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/PINK.png",
      },
      {
        id: "purple",
        label: "Purple",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/PURPLE.png",
      },
      {
        id: "red",
        label: "Red",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/RED.png",
      },
      {
        id: "yellow",
        label: "Yellow",
        img: "Who Will Go Products/Crochet/Flower Bouquet Keychain different color/YELLOW.png",
      },
    ],
  },
  {
    id: "17",
    title: "Cake Keychain",
    price: 45,
    img: "Who Will Go Products/Crochet/Cake Keychain.jpg",
    description:
      "A charming crochet cake keychain that adds a playful, handcrafted accent to any set of keys.",
    options: [
      {
        id: "blueberry",
        label: "Blueberry",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Blueberry.png",
      },
      {
        id: "chocolate",
        label: "Chocolate",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Chocolate.png",
      },
      {
        id: "mango",
        label: "Mango",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Mango.png",
      },
      {
        id: "matcha",
        label: "Matcha",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Matcha.png",
      },
      {
        id: "red-velvet",
        label: "Red Velvet",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Red Velvet.png",
      },
      {
        id: "strawberry",
        label: "Strawberry",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Strawberry.png",
      },
      {
        id: "ube",
        label: "Ube",
        img: "Who Will Go Products/Crochet/Cake Keychain different color/Ube.png",
      },
    ],
  },
];

let cart = JSON.parse(localStorage.getItem("wwg_cart") || "[]");

// Google Apps Script backend endpoint for native order submission.
// Replace this with your deployed Web App URL after publishing the script.
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxy7oLzRux_fCzUEzYpic4E_6Cws7psw0o3Ptv6RS65hyk88xCSQvqveGMe5sZMEFcg/exec";

function saveCart() {
  localStorage.setItem("wwg_cart", JSON.stringify(cart));
}
window.saveCart = saveCart;

function updateCartBadge() {
  const el = document.getElementById("cartCount");
  const totalCount = cart.reduce((s, i) => s + i.qty, 0);
  if (el) el.textContent = totalCount;
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === String(id));
}

function formatCartKey(productId, variantId, sizeId) {
  if (variantId && sizeId) return `${productId}::${variantId}::${sizeId}`;
  if (variantId) return `${productId}::${variantId}`;
  if (sizeId) return `${productId}::${sizeId}`;
  return String(productId);
}

function getCartItemKey(item) {
  return item.key || formatCartKey(item.id, item.variantId, item.sizeId);
}

function getCartItemId(item) {
  return getCartItemKey(item).replace(/[^a-zA-Z0-9-_]/g, "-");
}

function getVariant(product, variantId) {
  if (!product?.options) return null;
  return product.options.find((option) => option.id === variantId) || null;
}

function getSize(product, sizeId) {
  if (!product?.sizes) return null;
  return product.sizes.find((size) => size.id === sizeId) || null;
}

function getProductPrice(product, sizeId) {
  const selectedSize = sizeId ? getSize(product, sizeId) : null;
  return selectedSize?.price ?? product.price;
}

function addToCart(id, variantId = null, sizeId = null, qty = 1) {
  const product = findProduct(id);
  if (!product) return showToast("Product not found");

  // If product has selectable options normally, require selection — but
  // allow products that explicitly suppress option selection (bundles)
  if (product.options?.length && !product.suppressOptionSelect && !variantId) {
    openProductModal(id, null, sizeId);
    return;
  }

  if (product.sizes?.length && !sizeId) {
    openProductModal(id, variantId || null, null);
    return;
  }

  const selectedVariant = product.suppressOptionSelect
    ? null
    : variantId
      ? getVariant(product, variantId)
      : null;
  const selectedSize = sizeId ? getSize(product, sizeId) : null;
  const productPrice = getProductPrice(product, selectedSize?.id);
  const cartKey = formatCartKey(
    product.id,
    product.suppressOptionSelect ? null : selectedVariant?.id,
    selectedSize?.id,
  );
  const existing = cart.find((item) => getCartItemKey(item) === cartKey);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.unshift({
      key: cartKey,
      id: product.id,
      title: product.title,
      price: productPrice,
      img: selectedVariant?.img || product.img,
      qty,
      variantId: product.suppressOptionSelect
        ? null
        : selectedVariant?.id || null,
      variantLabel: product.suppressOptionSelect
        ? null
        : selectedVariant?.label || null,
      sizeId: selectedSize?.id || null,
      sizeLabel: selectedSize?.label || null,
    });
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast(
    `${product.title}${selectedVariant ? ` — ${selectedVariant.label}` : ""} added to cart`,
  );
}
window.addToCart = addToCart;

function changeQty(key, delta) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((item) => getCartItemKey(item) !== key);
  }
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function setQty(key, value) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  if (value <= 0 || Number.isNaN(value)) {
    return removeCartItem(key);
  }
  item.qty = value;
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function updateCartTotalsForInput(key, value) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item || value <= 0 || Number.isNaN(value)) return;
  const cartItem = document.querySelector(`.qty-input[data-key="${key}"]`);
  if (!cartItem) return;
  const cartRow = cartItem.closest(".cart-item");
  if (!cartRow) return;
  const linePrice = cartRow.querySelector(".cart-item-price");
  if (linePrice) {
    linePrice.textContent = `PHP ${(item.price * value).toFixed(2)}`;
  }
  const total = cart.reduce((sum, current) => {
    return (
      sum +
      (current.key === key
        ? current.price * value
        : current.price * current.qty)
    );
  }, 0);
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = `PHP ${total.toFixed(2)}`;
}

function removeCartItem(key) {
  cart = cart.filter((item) => getCartItemKey(item) !== key);
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function openConfirmDialog(options) {
  const modal = document.getElementById("confirmModal");
  const description = document.getElementById("confirmModalDescription");
  const yesButton = document.getElementById("confirmYes");
  const cancelButton = document.getElementById("confirmCancel");
  const closeButton = modal?.querySelector(".modal-close");

  if (!modal || !description || !yesButton || !cancelButton) return;

  description.textContent = options.message;
  yesButton.textContent = options.confirmText || "Yes";
  cancelButton.textContent = options.cancelText || "No";

  // Apply button styling based on action type
  yesButton.className = options.yesButtonClass || "cta-btn cta-primary";
  cancelButton.className = options.cancelButtonClass || "cta-btn cta-outline";

  const cleanup = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    yesButton.onclick = null;
    cancelButton.onclick = null;
    if (closeButton) closeButton.onclick = null;
  };

  yesButton.onclick = () => {
    cleanup();
    options.onConfirm?.();
  };

  cancelButton.onclick = () => {
    cleanup();
    options.onCancel?.();
  };

  if (closeButton) {
    closeButton.onclick = () => {
      cleanup();
      options.onCancel?.();
    };
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function promptRemoveItem(key, title) {
  // ensure user can see the Order Summary before confirming
  scrollCartToSummary();

  openConfirmDialog({
    message: `Are you sure you want to remove "${title}" from your cart?`,
    confirmText: "Yes, remove",
    cancelText: "No, keep it",
    // make the left-cancel button the emphasized primary action (matches design)
    yesButtonClass: "cta-btn cta-outline",
    cancelButtonClass: "cta-btn cta-primary",
    onConfirm: () => removeCartItem(key),
  });
}

function promptClearCart() {
  // scroll so the user sees the Order Summary while deciding
  scrollCartToSummary();

  openConfirmDialog({
    message: "Are you sure you want to clear all items from your cart?",
    confirmText: "Yes, clear cart",
    cancelText: "No, keep items",
    // emphasize the cancel (keep items) button on the left as primary
    yesButtonClass: "cta-btn cta-outline",
    cancelButtonClass: "cta-btn cta-primary",
    onConfirm: () => {
      clearCart();
      showToast("Cart cleared successfully.");
    },
  });
}

// Scroll the cart sidebar so the Order Summary is visible to the user.
function scrollCartToSummary() {
  try {
    const sidebar = document.getElementById("cartSidebar");
    if (!sidebar) return;
    const summary = sidebar.querySelector(".order-summary");
    if (!summary) return;

    // Calculate position of summary relative to the scroll container
    const sidebarRect = sidebar.getBoundingClientRect();
    const summaryRect = summary.getBoundingClientRect();
    const currentScroll = sidebar.scrollTop || 0;
    const offset = summaryRect.top - sidebarRect.top + currentScroll - 12; // small padding

    sidebar.scrollTo({ top: offset, behavior: "smooth" });
  } catch (e) {
    // silent fail
  }
}

function updateCartVariant(key, variantId) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  const product = findProduct(item.id);
  if (!product?.options?.length) return;
  const variant = getVariant(product, variantId);
  if (!variant) return;

  const targetKey = formatCartKey(item.id, variant.id, item.sizeId);
  const existingVariantItem = cart.find(
    (cartItem) => getCartItemKey(cartItem) === targetKey,
  );

  if (existingVariantItem && existingVariantItem !== item) {
    existingVariantItem.qty += item.qty;
    cart = cart.filter((cartItem) => cartItem !== item);
  } else {
    item.variantId = variant.id;
    item.variantLabel = variant.label;
    item.img = variant.img;
    item.key = targetKey;
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
}

function updateCartSize(key, sizeId) {
  const item = cart.find((item) => getCartItemKey(item) === key);
  if (!item) return;
  const product = findProduct(item.id);
  if (!product?.sizes?.length) return;
  const size = getSize(product, sizeId);
  if (!size) return;

  const targetKey = formatCartKey(item.id, item.variantId, size.id);
  const existingSizeItem = cart.find(
    (cartItem) => getCartItemKey(cartItem) === targetKey,
  );

  if (existingSizeItem && existingSizeItem !== item) {
    existingSizeItem.qty += item.qty;
    cart = cart.filter((cartItem) => cartItem !== item);
  } else {
    item.sizeId = size.id;
    item.sizeLabel = size.label;
    item.price = size.price;
    item.key = targetKey;
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const cartFooter = document.querySelector(".cart-footer");
  if (!container) return;
  container.innerHTML = "";
  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty-card">
        <div class="cart-empty-icon"><i class="fas fa-shopping-basket"></i></div>
        <div>
          <p class="cart-empty-title">Your cart is empty</p>
          <p class="cart-empty-text">
            Add a product to build your order and support missionaries in the field.
          </p>
        </div>
        <a href="#shop" class="cta-btn cta-primary cart-empty-cta">Shop Now</a>
      </div>
    `;
    document.getElementById("cartTotal").textContent = "PHP 0.00";
    const countEl = document.getElementById("cartItemCount");
    if (countEl) countEl.textContent = "(0 items)";
    if (cartFooter) cartFooter.classList.add("empty");
    const emptyCta = container.querySelector(".cart-empty-cta");
    if (emptyCta) {
      emptyCta.addEventListener("click", () => toggleCart(false));
    }
    return;
  }
  if (cartFooter) cartFooter.classList.remove("empty");
  let total = 0;
  cart.forEach((item) => {
    const itemKey = getCartItemKey(item);
    const itemId = getCartItemId(item);
    const product = findProduct(item.id);
    const variantOptions = product?.suppressOptionSelect
      ? []
      : product?.options || [];
    const optionLabel = product?.optionLabel || "option";
    const optionLabelText =
      optionLabel.charAt(0).toUpperCase() + optionLabel.slice(1);
    const variantSelect = variantOptions.length
      ? `
          <div class="cart-item-options">
            <div class="cart-item-option-label">${optionLabelText}</div>
            <select class="cart-variant-select" id="variant-${itemId}" data-key="${itemKey}" aria-label="Choose a ${optionLabel} for ${item.title}">
              ${variantOptions
                .map(
                  (option) => `
                <option value="${option.id}" ${option.id === item.variantId ? "selected" : ""}>
                  ${option.label}
                </option>
              `,
                )
                .join("")}
            </select>
            <div class="cart-item-option-helper">Choose ${optionLabel} variations</div>
          </div>
        `
      : "";

    const sizeOptions = product?.sizes || [];
    const sizeSelect = sizeOptions.length
      ? `
          <div class="cart-item-options">
            <div class="cart-item-option-label">Size</div>
            <select class="cart-size-select" id="size-${itemId}" data-key="${itemKey}" aria-label="Choose a size for ${item.title}">
              ${sizeOptions
                .map((size) => {
                  const sizeLabel = size.label.includes(`(${size.category})`)
                    ? size.label
                    : `${size.label} (${size.category})`;
                  return `
                <option value="${size.id}" ${size.id === item.sizeId ? "selected" : ""}>
                  ${sizeLabel}
                </option>
              `;
                })
                .join("")}
            </select>
            <div class="cart-item-option-helper">Kids sizes PHP 150, adult sizes PHP 250</div>
          </div>
        `
      : "";

    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="cart-item-main">
        <div class="cart-item-title">${item.title}</div>
        ${variantSelect}
        ${sizeSelect}
        <div class="qty-label">Quantity</div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-key="${itemKey}">-</button>
          <input
            type="number"
            class="qty-input"
            min="1"
            step="1"
            inputmode="numeric"
            pattern="[0-9]*"
            value="${item.qty}"
            data-key="${itemKey}"
            aria-label="Quantity for ${item.title}"
          />
          <button class="qty-btn" data-action="inc" data-key="${itemKey}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">PHP ${(item.price * item.qty).toFixed(2)}</div>
        <button
          class="remove-item-btn"
          type="button"
          data-action="remove"
          data-key="${itemKey}"
          aria-label="Remove ${item.title} from cart"
        >
          Remove
        </button>
      </div>
    `;
    container.appendChild(div);
  });
  const count = cart.reduce((s, i) => s + (i.qty || 0), 0);
  const countEl = document.getElementById("cartItemCount");
  if (countEl) countEl.textContent = `(${count} item${count === 1 ? "" : "s"})`;
  const subtotalEl = document.getElementById("cartSubtotal");
  if (subtotalEl) subtotalEl.textContent = `PHP ${total.toFixed(2)}`;
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = `PHP ${total.toFixed(2)}`;
}

function toggleCart(open) {
  const sb = document.getElementById("cartSidebar");
  const ov = document.getElementById("cartOverlay");
  const cartButton = document.getElementById("cartButton");
  if (!sb || !ov) return;
  // debounce repeated calls to avoid double-toggle from pointerdown+click
  if (!toggleCart._last) toggleCart._last = 0;
  const now = Date.now();
  if (now - toggleCart._last < 350) return;
  toggleCart._last = now;
  const doOpen =
    typeof open === "boolean" ? open : !sb.classList.contains("open");
  if (doOpen) {
    sb.classList.add("open");
    ov.classList.add("open");
    sb.setAttribute("aria-hidden", "false");
    if (cartButton) cartButton.setAttribute("aria-expanded", "true");
    renderCartItems();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    document.body.dataset.scrollY = scrollY;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.querySelectorAll(".nav-menu.active").forEach((menu) => {
      menu.classList.remove("active");
    });
    const hamburgerBtn = document.querySelector(".hamburger");
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove("active");
    }
    document.documentElement.classList.add("cart-open");
    document.body.classList.add("cart-open");
  } else {
    sb.classList.remove("open");
    ov.classList.remove("open");
    sb.setAttribute("aria-hidden", "true");
    if (cartButton) cartButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    delete document.body.dataset.scrollY;
    document.documentElement.classList.remove("cart-open");
    document.body.classList.remove("cart-open");
  }
}

window.renderCartItems = renderCartItems;
window.toggleCart = toggleCart;

function getCheckoutOrderText() {
  return cart
    .map((item) => {
      const product = findProduct(item.id);
      const parts = [item.title];
      if (!product?.suppressOptionSelect && item.variantLabel)
        parts.push(item.variantLabel);
      if (item.sizeLabel) parts.push(item.sizeLabel);
      return `${parts.join(" / ")} x${item.qty} = PHP ${(
        item.price * item.qty
      ).toFixed(2)}`;
    })
    .join("\n");
}

function openCheckoutModal() {
  if (!cart.length) {
    showToast("Add products to your cart before checking out.");
    return;
  }

  const modal = document.getElementById("checkoutModal");
  const summaryEl = document.getElementById("checkoutSummary");
  const totalItemsEl = document.getElementById("checkoutTotalItems");
  const totalEl = document.getElementById("checkoutGrandTotal");
  const orderIdEl = document.getElementById("checkoutOrderId");
  if (!modal || !summaryEl || !totalItemsEl || !totalEl || !orderIdEl) {
    return;
  }

  toggleCart(false);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderId = `WWG-${Date.now()}`;

  orderIdEl.textContent = orderId;
  totalItemsEl.textContent = itemCount;
  totalEl.textContent = `PHP ${grandTotal.toFixed(2)}`;
  summaryEl.innerHTML = cart
    .map((item) => {
      const product = findProduct(item.id);
      const parts = [item.title];
      if (!product?.suppressOptionSelect && item.variantLabel)
        parts.push(item.variantLabel);
      if (item.sizeLabel) parts.push(item.sizeLabel);
      return `
        <div class="checkout-summary-item">
          <div class="checkout-summary-item-meta">
            <span>${parts.join(" • ")}</span>
            <span class="checkout-summary-qty">Qty ${item.qty}</span>
          </div>
          <strong>PHP ${(item.price * item.qty).toFixed(2)}</strong>
        </div>
      `;
    })
    .join("");

  // Populate new mobile checkout summary/details screens
  try {
    // Mobile summary tab
    const mobileCheckoutSummaryList = document.getElementById(
      "mobileCheckoutSummaryList",
    );
    const mobileSummaryTotalItems = document.getElementById(
      "mobileSummaryTotalItems",
    );
    const mobileSummaryTotalAmount = document.getElementById(
      "mobileSummaryTotalAmount",
    );

    if (mobileCheckoutSummaryList) {
      mobileCheckoutSummaryList.innerHTML = summaryEl.innerHTML;
    }
    if (mobileSummaryTotalItems)
      mobileSummaryTotalItems.textContent = itemCount;
    if (mobileSummaryTotalAmount)
      mobileSummaryTotalAmount.textContent = `PHP ${grandTotal.toFixed(2)}`;
    // update fixed footer total if present
    const mobileFooterTotal = document.getElementById("mobileFooterTotal");
    if (mobileFooterTotal)
      mobileFooterTotal.textContent = `PHP ${grandTotal.toFixed(2)}`;

    // Reset mobile panels to summary view
    const mobileCheckoutScreen = document.getElementById(
      "mobileCheckoutScreen",
    );
    const mobileSummaryTab = document.getElementById("mobileSummaryTab");
    const mobileDetailsTab = document.getElementById("mobileDetailsTab");
    const mobileCheckoutSummaryPanel = document.getElementById(
      "mobileCheckoutSummaryPanel",
    );
    const mobileCheckoutDetailsPanel = document.getElementById(
      "mobileCheckoutDetailsPanel",
    );

    switchMobileCheckoutTab("summary");
  } catch (err) {
    // non-fatal
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  modal.scrollTop = 0;

  const checkoutForm = document.getElementById("order-form");
  if (checkoutForm) {
    clearAllFieldErrors(checkoutForm);
    clearOrderFeedback();
  }

  // Ensure form-section is scrolled to show summary panel first
  const formSection = document.querySelector(".checkout-form-section");
  if (formSection) {
    formSection.scrollLeft = 0;
    formSection.scrollTop = 0;
  }

  // Don't auto-focus the customer name field on mobile, as it's in the details panel
  // Users will navigate there via the Continue button or tab click

  // Initialize mobile gesture support
  initMobileCheckoutGestures();
}

function switchMobileCheckoutTab(tab) {
  const screen = document.getElementById("mobileCheckoutScreen");
  const summaryTab = document.getElementById("mobileSummaryTab");
  const detailsTab = document.getElementById("mobileDetailsTab");
  const summaryPanel = document.getElementById("mobileCheckoutSummaryPanel");
  const detailsPanel = document.getElementById("mobileCheckoutDetailsPanel");

  const mobileFooter = document.querySelector(".checkout-fixed-footer");

  if (tab === "summary") {
    if (screen) screen.classList.remove("details-active");
    if (summaryTab) {
      summaryTab.classList.add("active");
      summaryTab.setAttribute("aria-selected", "true");
    }
    if (detailsTab) {
      detailsTab.classList.remove("active");
      detailsTab.setAttribute("aria-selected", "false");
    }
    if (summaryPanel) summaryPanel.setAttribute("aria-hidden", "false");
    if (detailsPanel) detailsPanel.setAttribute("aria-hidden", "true");
    if (mobileFooter) mobileFooter.setAttribute("aria-hidden", "true");
  } else if (tab === "details") {
    if (screen) screen.classList.add("details-active");
    if (summaryTab) {
      summaryTab.classList.remove("active");
      summaryTab.setAttribute("aria-selected", "false");
    }
    if (detailsTab) {
      detailsTab.classList.add("active");
      detailsTab.setAttribute("aria-selected", "true");
    }
    if (summaryPanel) summaryPanel.setAttribute("aria-hidden", "true");
    if (detailsPanel) detailsPanel.setAttribute("aria-hidden", "false");
    if (mobileFooter) mobileFooter.setAttribute("aria-hidden", "false");
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

// Mobile checkout touch/swipe gesture support
function initMobileCheckoutGestures() {
  const panels = document.getElementById("mobileCheckoutPanels");
  if (!panels || window.innerWidth > 920 || mobileCheckoutGesturesInitialized)
    return;

  mobileCheckoutGesturesInitialized = true;
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  panels.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false,
  );

  panels.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false,
  );

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const screen = document.getElementById("mobileCheckoutScreen");
    if (!screen) return;

    if (diff > minSwipeDistance) {
      switchMobileCheckoutTab("details");
    } else if (diff < -minSwipeDistance) {
      switchMobileCheckoutTab("summary");
    }
  }
}

/* ==================== PRODUCT MODAL ==================== */
function setProductModalPreview(product, variantId = null, variantIndex = 0) {
  const imageContainer = document.getElementById("productModalImagePreview");
  const imageCount = document.getElementById("productModalImageCount");
  const selectedVariant = variantId ? getVariant(product, variantId) : null;
  const previewImg = selectedVariant?.img || product.img;
  const previewVideo = selectedVariant ? null : product.video;
  const altText = `${product.title}${selectedVariant ? ` — ${selectedVariant.label}` : ""}`;

  if (imageContainer) {
    imageContainer.innerHTML = previewVideo
      ? `
        <video
          autoplay
          muted
          loop
          playsinline
          poster="${previewImg}"
          aria-label="${altText} preview"
        >
          <source src="${previewVideo}" type="video/mp4" />
          <img src="${previewImg}" alt="${altText}" />
        </video>
      `
      : `
        <img src="${previewImg}" alt="${altText}" />
      `;
  }

  // update navigation controls (arrows + counter)
  try {
    const modalElement = document.getElementById("productModal");
    const prevBtn = document.getElementById("productModalPrev");
    const nextBtn = document.getElementById("productModalNext");

    // Build a list of actual images available for the product preview.
    // Prefer explicit variant images, fall back to the product's main image.
    const galleryImgs = (product.options || [])
      .map((o) => o.img || o.image || o.preview)
      .filter(Boolean);
    if (!galleryImgs.length) galleryImgs.push(previewImg);

    const totalImages = galleryImgs.length || 1;
    const currentIndex = Math.min(
      Math.max(Number(variantIndex) || 0, 0),
      totalImages - 1,
    );

    // counter — concise, accessible format (e.g. "1 of 4")
    if (imageCount) {
      imageCount.textContent =
        totalImages > 1 ? `${currentIndex + 1} of ${totalImages}` : "1 of 1";
      imageCount.setAttribute(
        "aria-label",
        totalImages > 1
          ? `Image ${currentIndex + 1} of ${totalImages}`
          : "Single image",
      );
      // remove any stray 'colors' suffix if present (defensive)
      try {
        imageCount.textContent = imageCount.textContent.replace(
          /\s*colors$/i,
          "",
        );
      } catch (err) {}
    }

    // make arrows visible/usable and reflect state
    if (prevBtn) {
      prevBtn.disabled = totalImages <= 1;
      prevBtn.setAttribute(
        "aria-disabled",
        prevBtn.disabled ? "true" : "false",
      );
      prevBtn.tabIndex = prevBtn.disabled ? -1 : 0;
    }
    if (nextBtn) {
      nextBtn.disabled = totalImages <= 1;
      nextBtn.setAttribute(
        "aria-disabled",
        nextBtn.disabled ? "true" : "false",
      );
      nextBtn.tabIndex = nextBtn.disabled ? -1 : 0;
    }

    // store current index on modal for other handlers
    if (modalElement) {
      modalElement.dataset.currentPhotoIndex = String(currentIndex);
      modalElement.dataset.photoCount = String(totalImages);
    }
  } catch (e) {
    // silent fail — don't break product modal when nav controls aren't present
  }

  // attach click-to-enlarge only for the product modal image
  try {
    const imgEl = imageContainer.querySelector("img");
    if (imgEl) {
      imgEl.style.cursor = "zoom-in";
      imgEl.addEventListener("click", (ev) => {
        ev.preventDefault();
        const src = imgEl.currentSrc || imgEl.src;
        // build gallery images from product options if available
        const gallery = (product.options || [])
          .map((o) => o.img || o.image || o.preview)
          .filter(Boolean);
        const galleryImgs = gallery.length ? gallery : [src];
        // open preview at the selected src
        if (typeof window.showPreviewBySrc === "function") {
          window.showPreviewBySrc(src, altText, galleryImgs);
        }
      });
    }
  } catch (e) {}

  // imageCount already updated above with a concise "1 / N" format.
}

function updateProductModalSubtitle(product, variantId = null) {
  const subtitleEl = document.getElementById("productModalSubtitle");
  if (!subtitleEl || !product) return;

  const variant = variantId ? getVariant(product, variantId) : null;
  if (variant && product.optionLabel) {
    const labelName =
      product.optionLabel.charAt(0).toUpperCase() +
      product.optionLabel.slice(1);
    subtitleEl.textContent = `${labelName}: ${variant.label}`;
    return;
  }

  const optionsCount =
    product.options?.length && !product.suppressOptionSelect
      ? product.options.length
      : 0;
  subtitleEl.textContent =
    optionsCount && product.sizes?.length
      ? `Select your ${product.optionLabel || "option"} and size before checkout`
      : optionsCount
        ? `Select your ${product.optionLabel || "option"} before checkout`
        : product.sizes?.length
          ? "Select your size before checkout"
          : "";
}

function renderProductModalOptions(
  product,
  selectedVariantId = null,
  selectedSizeId = null,
  qty = 1,
  selectedVariantIndex = 0,
) {
  const optionsContainer = document.getElementById("productModalOptions");
  if (!optionsContainer) return;
  // allow specific products (e.g., bundles) to provide gallery images via
  // `options` but suppress showing an options selector in the modal UI.
  const hasOptions = product?.options?.length && !product.suppressOptionSelect;

  const variantHtml = hasOptions
    ? (() => {
        const defaultVariant =
          getVariant(product, selectedVariantId) || product.options[0];
        const optionLabel = product.optionLabel || "option";
        const labelText = `Choose a ${optionLabel}`;
        const optionsHtml = product.options
          .map(
            (option) => `
              <option value="${option.id}" ${option.id === defaultVariant.id ? "selected" : ""}>
                ${option.label}
              </option>
            `,
          )
          .join("");

        return `
          <div class="product-option-group">
            <label for="productModalVariantSelect">${labelText}</label>
            <select id="productModalVariantSelect" class="variant-select" aria-label="${labelText} for ${product.title}">
              ${optionsHtml}
            </select>
          </div>
        `;
      })()
    : "";

  const sizeHtml = product?.sizes?.length
    ? (() => {
        const selectedSize =
          getSize(product, selectedSizeId) || product.sizes[0];
        const sizeOptionsHtml = product.sizes
          .map((size) => {
            const sizeLabel = size.label.includes(`(${size.category})`)
              ? size.label
              : `${size.label} (${size.category})`;
            return `
                <option value="${size.id}" ${size.id === selectedSize.id ? "selected" : ""}>
                  ${sizeLabel}
                </option>
              `;
          })
          .join("");

        return `
          <div class="product-option-group">
            <label for="productModalSizeSelect">Select size</label>
            <select id="productModalSizeSelect" class="variant-select" aria-label="Select size for ${product.title}">
              ${sizeOptionsHtml}
            </select>
          </div>
        `;
      })()
    : "";

  const quantityHtml = `
    <div class="product-option-group product-modal-quantity">
      <label for="productModalQty">Quantity</label>
      <div class="product-modal-qty-control">
        <button type="button" class="product-qty-btn" data-action="dec" aria-label="Decrease quantity">-</button>
        <input
          id="productModalQty"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          value="${qty || 1}"
          class="product-modal-qty-input"
          aria-label="Quantity for ${product.title}"
        />
        <button type="button" class="product-qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `;

  optionsContainer.innerHTML = `${variantHtml}${sizeHtml}${quantityHtml}`;

  const resolvedVariant =
    (selectedVariantId && getVariant(product, selectedVariantId)) ||
    product?.options?.[0];

  const variantSelect = document.getElementById("productModalVariantSelect");
  if (variantSelect && resolvedVariant?.id) {
    variantSelect.value = resolvedVariant.id;
  }

  const activeVariantId =
    variantSelect?.value ||
    resolvedVariant?.id ||
    product?.options?.[0]?.id ||
    null;
  const activeVariant = activeVariantId
    ? getVariant(product, activeVariantId)
    : product?.options?.[0];
  const currentIndex = product?.options?.findIndex(
    (option) => option.id === activeVariant?.id,
  );

  const addBtn = document.getElementById("productModalAddToCart");
  if (addBtn) addBtn.dataset.variant = activeVariant?.id || "";

  setProductModalPreview(
    product,
    activeVariant?.id,
    currentIndex >= 0 ? currentIndex : 0,
  );
}

function openProductModal(
  id,
  selectedVariantId = null,
  selectedSizeId = null,
  qty = 1,
  scrollToAdd = false,
) {
  const product = findProduct(id);
  const modal = document.getElementById("productModal");
  if (!modal) return;
  const title = document.getElementById("productModalTitle");
  const desc = document.getElementById("productModalDescription");
  const price = document.getElementById("productModalPrice");
  const cat = document.getElementById("productModalCategory");
  const addBtn = document.getElementById("productModalAddToCart");
  const subtitle = document.getElementById("productModalSubtitle");

  if (product) {
    const card = document.querySelector(
      `.product-card[data-product-id="${id}"]`,
    );
    const resolvedVariantId =
      selectedVariantId ||
      card?.dataset?.pendingVariant ||
      card?.querySelector(".product-summary-preview.selected")?.dataset
        ?.variantId ||
      null;
    selectedVariantId = resolvedVariantId;
    const selectedIndex = product?.options?.findIndex(
      (option) => option.id === selectedVariantId,
    );
    if (card && card.dataset.pendingVariant) {
      delete card.dataset.pendingVariant;
    }
    setProductModalPreview(
      product,
      selectedVariantId,
      selectedIndex >= 0 ? selectedIndex : 0,
    );
    title.textContent = product.title;
    desc.textContent =
      product.description ||
      document.querySelector(
        `.product-card[data-product-id="${id}"] .product-description`,
      )?.textContent ||
      "";
    price.textContent = `PHP ${getProductPrice(product, selectedSizeId)}`;
    cat.textContent =
      document.querySelector(
        `.product-card[data-product-id="${id}"] .product-category`,
      )?.textContent || "";
    addBtn.dataset.id = product.id;
    addBtn.dataset.variant = resolvedVariantId || "";
    addBtn.dataset.size = selectedSizeId || "";
    modal.dataset.productId = product.id;
    modal.dataset.currentPhotoIndex = selectedIndex >= 0 ? selectedIndex : 0;
    modal.dataset.photoCount = product.options?.length || 1;
    renderProductModalOptions(
      product,
      resolvedVariantId,
      selectedSizeId,
      qty,
      selectedIndex >= 0 ? selectedIndex : 0,
    );
    // After rendering options, set the price based on the selected or
    // default size (kids vs adult). This ensures opening the modal from
    // an Add-to-Cart control shows the correct price immediately.
    try {
      const finalSizeId =
        selectedSizeId ||
        (product.sizes && product.sizes.length ? product.sizes[0].id : null);
      if (price)
        price.textContent = `PHP ${getProductPrice(product, finalSizeId)}`;
      if (addBtn) addBtn.dataset.size = finalSizeId || "";
    } catch (e) {}
    // Ensure selects inside the modal update the displayed price immediately
    // (some browsers/custom-styles can prevent delegated change handlers firing
    // reliably, so attach directly here for robustness).
    setTimeout(() => {
      try {
        const sizeSelect = document.getElementById("productModalSizeSelect");
        const variantSelect = document.getElementById(
          "productModalVariantSelect",
        );
        const priceEl = document.getElementById("productModalPrice");
        const addBtnEl = document.getElementById("productModalAddToCart");
        if (sizeSelect && priceEl) {
          sizeSelect.addEventListener("change", function () {
            try {
              const selectedSize = sizeSelect.value || null;
              priceEl.textContent = `PHP ${getProductPrice(product, selectedSize)}`;
              if (addBtnEl) addBtnEl.dataset.size = selectedSize;
            } catch (err) {}
          });
        }
        if (variantSelect) {
          variantSelect.addEventListener("change", function () {
            try {
              // update preview when variant changes
              const selIndex = product.options?.findIndex(
                (o) => o.id === variantSelect.value,
              );
              setProductModalPreview(
                product,
                variantSelect.value,
                selIndex >= 0 ? selIndex : 0,
              );
              updateProductModalSubtitle(product, variantSelect.value);
              if (addBtnEl)
                addBtnEl.dataset.variant = variantSelect.value || "";
            } catch (err) {}
          });
        }
      } catch (e) {}
    }, 40);
    const modalElement = document.getElementById("productModal");
    if (modalElement) {
      modalElement.dataset.currentPhotoIndex =
        selectedIndex >= 0 ? selectedIndex : 0;
      modalElement.dataset.photoCount = product.options?.length || 1;
    }
    const optionsCount =
      product.options?.length && !product.suppressOptionSelect
        ? product.options.length
        : 0;
    const resolvedVariant =
      (resolvedVariantId && getVariant(product, resolvedVariantId)) ||
      product?.options?.[0] ||
      null;
    if (resolvedVariant && product.optionLabel) {
      const labelName =
        product.optionLabel.charAt(0).toUpperCase() +
        product.optionLabel.slice(1);
      subtitle.textContent = `${labelName}: ${resolvedVariant.label}`;
    } else {
      subtitle.textContent =
        optionsCount && product.sizes?.length
          ? `Select your ${product.optionLabel || "option"} and size before checkout`
          : optionsCount
            ? `Select your ${product.optionLabel || "option"} before checkout`
            : product.sizes?.length
              ? "Select your size before checkout"
              : "";
    }

    const sizeGuideSection = document.getElementById("productModalSizeGuide");
    if (sizeGuideSection) {
      if (product.category === "t-shirts") {
        sizeGuideSection.hidden = false;
        sizeGuideSection.innerHTML = `
          <div class="size-guide-header">
            <div>
              <p class="size-guide-tag">T-Shirt Size Guide</p>
              <h3>Tap the image to view the full size chart.</h3>
            </div>
            <p class="size-guide-note">
              The exact measurement chart opens in a larger preview so you can confirm width and length before checkout.
            </p>
          </div>
          <div class="size-guide-content">
            <button
              type="button"
              class="size-guide-image-wrap product-summary-preview"
              data-preview-src="Who Will Go Products/T-Shirts/summary.png"
              data-preview-alt="Full-size T-shirt size guide"
              aria-label="Open full size guide"
            >
              <img
                src="Who Will Go Products/T-Shirts/summary.png"
                alt="Exact T-shirt size guide"
                loading="lazy"
              />
              <span class="size-guide-image-action">View full size guide</span>
            </button>
          </div>
        `;
      } else {
        sizeGuideSection.hidden = true;
        sizeGuideSection.innerHTML = "";
      }
    }
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // If caller requested, scroll the modal so the Add to Cart button is visible
  if (scrollToAdd) {
    setTimeout(() => {
      const addBtn = document.getElementById("productModalAddToCart");
      if (addBtn) {
        try {
          addBtn.scrollIntoView({ behavior: "smooth", block: "center" });
          addBtn.focus({ preventScroll: true });
        } catch (e) {
          // fallback for older browsers
          addBtn.focus();
        }
      }
    }, 140);
  }
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
}

/* product modal events */
document.addEventListener("click", function (e) {
  const t = e.target;
  if (t.id === "productModal" || t.closest("#productModal")) {
    // clicking inside should not close; click overlay only
    if (t.id === "productModal") {
      // If the image preview was just closed, ignore this click so that the
      // product modal isn't also dismissed when the user tapped the '×' on
      // the full-image preview (mobile behaviour).
      if (
        typeof window !== "undefined" &&
        window._justClosedImagePreview &&
        Date.now() - window._justClosedImagePreview < 400
      ) {
        // swallow silently
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      closeProductModal();
      return;
    }
  }
  if (t.matches(".product-modal-close") || t.closest(".product-modal-close")) {
    e.preventDefault();
    e.stopImmediatePropagation();
    closeProductModal();
    return;
  }

  const prevArrow = t.closest("#productModalPrev");
  const nextArrow = t.closest("#productModalNext");
  if (prevArrow || nextArrow) {
    const modalElement = document.getElementById("productModal");
    const productId = modalElement?.dataset?.productId;
    const product = findProduct(productId);
    if (product) {
      // compute actual gallery images (variant images or main image)
      const galleryImgs = (product.options || [])
        .map((o) => o.img || o.image || o.preview)
        .filter(Boolean);
      if (!galleryImgs.length) galleryImgs.push(product.img);

      const total = galleryImgs.length;
      const currentIndex = Number(modalElement.dataset.currentPhotoIndex) || 0;
      const step = prevArrow ? -1 : 1;
      const newIndex = (currentIndex + step + total) % total;

      // try to resolve a variant id for the new index when possible
      let variantId = null;
      if (product.options && product.options.length) {
        if (product.options.length === total) {
          variantId = product.options[newIndex]?.id;
        } else {
          const target = galleryImgs[newIndex];
          for (const opt of product.options) {
            const src = opt.img || opt.image || opt.preview;
            if (!src) continue;
            if (src === target) {
              variantId = opt.id;
              break;
            }
            const tail = (target || "").split("/").pop();
            if (tail && src.includes(tail)) {
              variantId = opt.id;
              break;
            }
          }
        }
      }

      const variantSelect = document.getElementById(
        "productModalVariantSelect",
      );
      if (variantSelect && variantId) {
        variantSelect.value = variantId;
      }

      const addBtn = document.getElementById("productModalAddToCart");
      if (addBtn && variantId) addBtn.dataset.variant = variantId;

      setProductModalPreview(product, variantId, newIndex);
      updateProductModalSubtitle(product, variantId);
      modalElement.dataset.currentPhotoIndex = newIndex;
    }
    return;
  }

  if (t.matches(".product-qty-btn") || t.closest(".product-qty-btn")) {
    const btn = t.matches(".product-qty-btn")
      ? t
      : t.closest(".product-qty-btn");
    const action = btn.dataset.action;
    const qtyInput = document.getElementById("productModalQty");
    if (qtyInput) {
      let qty = parseInt(qtyInput.value, 10);
      if (!Number.isFinite(qty) || qty < 1) qty = 1;
      qty = action === "inc" ? qty + 1 : action === "dec" ? qty - 1 : qty;
      qtyInput.value = qty < 1 ? 1 : qty;
    }
    return;
  }
  if (t.id === "productModalAddToCart" || t.closest("#productModalAddToCart")) {
    const btn =
      t.id === "productModalAddToCart"
        ? t
        : t.closest("#productModalAddToCart");
    const id = btn.dataset.id;
    const variantSelect = document.getElementById("productModalVariantSelect");
    const sizeSelect = document.getElementById("productModalSizeSelect");
    const qtyInput = document.getElementById("productModalQty");
    const selectedVariant = variantSelect?.value || btn.dataset.variant || null;
    const selectedSize = sizeSelect?.value || btn.dataset.size || null;
    const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
    addToCart(
      id,
      selectedVariant,
      selectedSize,
      Number.isFinite(qty) && qty > 0 ? qty : 1,
    );
    closeProductModal();
    return;
  }
});

document.addEventListener("keydown", function (ev) {
  if (ev.key === "Escape") {
    closeProductModal();
    closeCheckoutModal();
  }
});

// keyboard navigation for product modal (left/right arrows)
document.addEventListener("keydown", function (ev) {
  if (!(ev.key === "ArrowLeft" || ev.key === "ArrowRight")) return;
  const modal = document.getElementById("productModal");
  if (!modal) return;
  if (modal.getAttribute("aria-hidden") === "true") return;
  const productId = modal.dataset.productId;
  const product = findProduct(productId);
  if (!product) return;
  ev.preventDefault();
  // compute gallery images and map to variant ids when possible
  const galleryImgs = (product.options || [])
    .map((o) => o.img || o.image || o.preview)
    .filter(Boolean);
  if (!galleryImgs.length) galleryImgs.push(product.img);
  const total = galleryImgs.length;
  const current = Number(modal.dataset.currentPhotoIndex) || 0;
  const step = ev.key === "ArrowLeft" ? -1 : 1;
  const newIndex = (current + step + total) % total;

  let variantId = null;
  if (product.options && product.options.length) {
    if (product.options.length === total)
      variantId = product.options[newIndex]?.id;
    else {
      const target = galleryImgs[newIndex];
      for (const opt of product.options) {
        const src = opt.img || opt.image || opt.preview;
        if (!src) continue;
        if (src === target) {
          variantId = opt.id;
          break;
        }
        const tail = (target || "").split("/").pop();
        if (tail && src.includes(tail)) {
          variantId = opt.id;
          break;
        }
      }
    }
  }

  const variantSelect = document.getElementById("productModalVariantSelect");
  if (variantSelect && variantId) {
    variantSelect.value = variantId;
  }

  const addBtn = document.getElementById("productModalAddToCart");
  if (addBtn && variantId) addBtn.dataset.variant = variantId;

  setProductModalPreview(product, variantId, newIndex);
  updateProductModalSubtitle(product, variantId);
  modal.dataset.currentPhotoIndex = String(newIndex);
});

/* wire cart events */
document.addEventListener("click", function (e) {
  const t = e.target;
  // Quick preview button on product image
  if (t.matches(".view-product") || t.closest(".view-product")) {
    const btn = t.matches(".view-product") ? t : t.closest(".view-product");
    if (btn.classList.contains("product-summary-preview")) {
      return;
    }
    const id = btn.dataset.id;
    openProductModal(id, null, null, 1);
    return;
  }

  // Clicking a product image: on mobile/touch devices open the product
  // modal so users can choose options and add-to-cart. On desktop keep
  // the existing quick-image preview behaviour.
  const imageArea = t.closest(".product-image");
  if (imageArea) {
    const card = imageArea.closest(".product-card");
    const id = card?.dataset?.productId;
    const pendingVariant = card?.dataset?.pendingVariant || null;
    if (id) {
      const isTouch =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      const smallViewport =
        typeof window !== "undefined" && window.innerWidth <= 768;
      if (!isTouch && !smallViewport) {
        // desktop non-touch: let preview overlay handle image clicks
        return;
      }

      // mobile or touch device: open full product modal and align the
      // Add to Cart button to the exact location of the clicked image.
      const imageEl = imageArea.querySelector("img");
      openProductModal(id, pendingVariant, null, 1, false);
      if (card) card.dataset.pendingVariant = "";

      setTimeout(() => {
        try {
          // Keep the modal image at the top (don't scroll the content)
          const modalBody = document.querySelector(
            ".product-modal .product-modal-body",
          );
          if (modalBody) modalBody.scrollTop = 0;

          // Focus the Add to Cart button without scrolling, and briefly
          // highlight it so the user sees the call-to-action at a glance.
          const addBtn = document.getElementById("productModalAddToCart");
          if (!addBtn) return;
          try {
            addBtn.focus({ preventScroll: true });
          } catch (e) {
            addBtn.focus();
          }
          addBtn.classList.add("product-add-highlight");
          setTimeout(
            () => addBtn.classList.remove("product-add-highlight"),
            1200,
          );
        } catch (e) {
          // silent fail — keep modal usable
        }
      }, 180);
      return;
    }
  }

  if (t.matches(".add-to-cart") || t.closest(".add-to-cart")) {
    const btn = t.matches(".add-to-cart") ? t : t.closest(".add-to-cart");
    const id = btn.dataset.id;
    const card = btn.closest(".product-card");
    const pendingVariant = card?.dataset?.pendingVariant || null;
    if (id) {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      e.stopImmediatePropagation && e.stopImmediatePropagation();
      openProductModal(id, pendingVariant, null, 1, true);
      if (card) card.dataset.pendingVariant = "";
      setTimeout(() => {
        try {
          const modalBody = document.querySelector(
            ".product-modal .product-modal-body",
          );
          if (modalBody) modalBody.scrollTop = 0;
          const addBtn = document.getElementById("productModalAddToCart");
          if (!addBtn) return;
          try {
            addBtn.focus({ preventScroll: true });
          } catch (e) {
            addBtn.focus();
          }
          addBtn.classList.add("product-add-highlight");
          setTimeout(
            () => addBtn.classList.remove("product-add-highlight"),
            1200,
          );
        } catch (e) {
          // silent fail
        }
      }, 160);
    }
    return;
  }

  if (t.id === "cartButton" || t.closest("#cartButton")) {
    toggleCart();
    const cartButton = document.getElementById("cartButton");
    if (cartButton) {
      const isOpen = document
        .getElementById("cartSidebar")
        .classList.contains("open");
      cartButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    return;
  }

  if (t.id === "closeCart" || t.closest("#closeCart")) {
    e.preventDefault();
    e.stopPropagation();
    toggleCart(false);
    return;
  }

  if (t.id === "clearCart" || t.closest("#clearCart")) {
    promptClearCart();
    return;
  }

  if (t.id === "saveForLater" || t.closest("#saveForLater")) {
    // Smoothly navigate to the shop section when Shop More is clicked
    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    toggleCart(false);
    return;
  }

  if (t.id === "checkoutBtn" || t.closest("#checkoutBtn")) {
    openCheckoutModal();
    return;
  }

  if (t.id === "checkoutClose" || t.closest("#checkoutClose")) {
    closeCheckoutModal();
    return;
  }

  if (t.id === "checkoutExitBtn" || t.closest("#checkoutExitBtn")) {
    // quick exit from checkout (mobile friendly)
    closeCheckoutModal();
    return;
  }

  // Mobile checkout tab switching
  if (t.id === "mobileSummaryTab" || t.closest("#mobileSummaryTab")) {
    e.preventDefault();
    switchMobileCheckoutTab("summary");
    return;
  }
  if (t.id === "mobileDetailsTab" || t.closest("#mobileDetailsTab")) {
    e.preventDefault();
    switchMobileCheckoutTab("details");
    return;
  }
  if (
    t.id === "mobileContinueToDetails" ||
    t.closest("#mobileContinueToDetails")
  ) {
    e.preventDefault();
    switchMobileCheckoutTab("details");
    return;
  }

  if (t.id === "mobileEditCart" || t.closest("#mobileEditCart")) {
    // Close checkout and open cart for editing
    closeCheckoutModal();
    toggleCart(true);
    const cartButton = document.getElementById("cartButton");
    if (cartButton) cartButton.setAttribute("aria-expanded", "true");
    return;
  }

  if (t.id === "checkoutModal" || t.closest("#checkoutModal")) {
    if (t.id === "checkoutModal") {
      closeCheckoutModal();
      return;
    }
  }

  if (t.matches(".remove-item-btn") || t.closest(".remove-item-btn")) {
    const btn = t.matches(".remove-item-btn")
      ? t
      : t.closest(".remove-item-btn");
    const key = btn.dataset.key;
    const item = cart.find((i) => getCartItemKey(i) === key);
    if (!item) return;
    promptRemoveItem(key, item.title);
    return;
  }

  if (t.matches(".qty-btn") || t.closest(".qty-btn")) {
    const btn = t.matches(".qty-btn") ? t : t.closest(".qty-btn");
    const action = btn.dataset.action;
    const key = btn.dataset.key;
    if (action === "inc") changeQty(key, 1);
    if (action === "dec") changeQty(key, -1);
    return;
  }

  if (t.id === "cartOverlay" || t.closest("#cartOverlay")) {
    toggleCart(false);
    return;
  }
});

document.addEventListener("input", function (e) {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("qty-input")) return;
  const key = target.dataset.key;
  const quantity = parseInt(target.value, 10);
  if (Number.isFinite(quantity) && quantity > 0) {
    updateCartTotalsForInput(key, quantity);
  }
});

document.addEventListener("change", function (e) {
  const target = e.target;
  if (
    target instanceof HTMLSelectElement &&
    target.id === "productModalVariantSelect"
  ) {
    const addBtn = document.getElementById("productModalAddToCart");
    const product = findProduct(addBtn?.dataset.id);
    if (product) {
      const selectedIndex = product.options?.findIndex(
        (option) => option.id === target.value,
      );
      setProductModalPreview(
        product,
        target.value,
        selectedIndex >= 0 ? selectedIndex : 0,
      );
      updateProductModalSubtitle(product, target.value);
      const modalElement = document.getElementById("productModal");
      if (modalElement) {
        modalElement.dataset.currentPhotoIndex =
          selectedIndex >= 0 ? selectedIndex : 0;
      }
      if (addBtn) {
        addBtn.dataset.variant = target.value;
        addBtn.dataset.size =
          document.getElementById("productModalSizeSelect")?.value || "";
      }
    }
    return;
  }

  if (
    target instanceof HTMLSelectElement &&
    target.id === "productModalSizeSelect"
  ) {
    const addBtn = document.getElementById("productModalAddToCart");
    const product = findProduct(addBtn?.dataset.id);
    const price = document.getElementById("productModalPrice");
    if (product && price) {
      const selectedSize = target.value;
      price.textContent = `PHP ${getProductPrice(product, selectedSize)}`;
      if (addBtn) addBtn.dataset.size = selectedSize;
    }
    return;
  }

  if (
    target instanceof HTMLSelectElement &&
    target.classList.contains("cart-variant-select")
  ) {
    const key = target.dataset.key;
    const newValue = target.value;
    updateCartVariant(key, newValue);
    return;
  }

  if (
    target instanceof HTMLSelectElement &&
    target.classList.contains("cart-size-select")
  ) {
    const key = target.dataset.key;
    const newValue = target.value;
    updateCartSize(key, newValue);
    return;
  }

  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("qty-input")) return;
  const key = target.dataset.key;
  const quantity = parseInt(target.value, 10);
  if (Number.isFinite(quantity) && quantity > 0) {
    setQty(key, quantity);
  } else {
    removeCartItem(key);
  }
});

/* initialize badge on load */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
