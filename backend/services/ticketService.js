const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const cloudinary = require("../config/cloudinary");
const { sendTicketEmail } = require("./emailService");

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

function generateTicketPDF(order, event, qrBuf) {
  return new Promise((resolve, reject) => {

    const PW = 620;
    const PH = 234;
    const doc = new PDFDocument({
      size: [PW, PH],
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title: `EUSDA Ticket – ${event.title}`,
        Author: "EUSDA Events",
        Subject: `Event ticket for ${order.fullName}`,
      },
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const GREEN = "#166534";
    const GREEN_DARK = "#0d3d20";
    const LGREEN = "#16a34a";
    const MINT = "#bbf7d0";
    const DARK = "#111827";
    const GRAY = "#6b7280";
    const GOLD = "#d4af37";
    const WHITE = "#ffffff";

    const STUB_W = 168;
    const STUB_X = PW - STUB_W;
    const PERF_R = 10;
    const PAD = 26;

    const logoCandidates = [
      path.resolve(__dirname, "../../public/eusda-logo.png"),
      path.resolve(__dirname, "../../public/eusda-logo-white.png"),
      path.resolve(process.cwd(), "public/eusda-logo.png"),
      path.resolve(process.cwd(), "public/eusda-logo-white.png"),
      path.resolve(process.cwd(), "../public/eusda-logo.png"),
      path.resolve(process.cwd(), "../public/eusda-logo-white.png"),
    ];
    let logoPath = null;
    for (const p of logoCandidates) {
      if (fs.existsSync(p)) {
        logoPath = p;
        break;
      }
    }

    doc.rect(0, 0, PW, PH).fill(WHITE);

    doc.save();
    doc.roundedRect(0, 0, PW, PH, 5).clip();

    doc.save();
    // Concentric Guilloché security arcs 
    doc.opacity(0.045).strokeColor(GOLD).lineWidth(0.75);
    [35, 50, 65, 80, 95].forEach((r) => {
      doc.circle(STUB_X - 10, 10, r).stroke();
    });

    //Faint geometric diamond security lattice 
    doc.opacity(0.05).strokeColor(GREEN).lineWidth(0.6);
    const drawDiamond = (cx, cy, size) => {
      doc.moveTo(cx, cy - size)
        .lineTo(cx + size, cy)
        .lineTo(cx, cy + size)
        .lineTo(cx - size, cy)
        .closePath()
        .stroke();
    };
    drawDiamond(180, 100, 150);
    drawDiamond(180, 100, 120);
    drawDiamond(320, 90, 150);
    drawDiamond(320, 90, 100);
    // drawDiamond(180, 100, 24);
    // drawDiamond(180, 100, 16);
    // drawDiamond(320, 90, 28);
    // drawDiamond(320, 90, 18);
    doc.restore();

    doc.rect(0, 0, STUB_X, 5).fill(GREEN);
    doc.rect(0, 5, STUB_X, 1).fill(GOLD);

    const LOGO_SIZE = 28;
    const LOGO_Y = 12;
    let bodyTextX = PAD;
    if (logoPath) {
      try {
        doc.image(logoPath, PAD, LOGO_Y, { fit: [LOGO_SIZE, LOGO_SIZE], align: "center", valign: "center" });
        bodyTextX = PAD + LOGO_SIZE + 8;
      } catch (imgErr) {
        console.warn("[ticketService] Could not embed logo image in PDF:", imgErr.message);
      }
    }
    const textMidY = LOGO_Y + LOGO_SIZE / 2 - 4.5;
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(GREEN)
      .text("EUSDA / 24 SABBATH SCHOOL", bodyTextX, textMidY, { characterSpacing: 1.2 });
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(GRAY)
      .text("CONCERT TICKET", 0, textMidY, { width: STUB_X - PAD, align: "right", characterSpacing: 1.2 });

    let y = LOGO_Y + LOGO_SIZE + 10; // y ≈ 50

    // Event title in Times-Bold — serif display face
    const TITLE_W = STUB_X - PAD * 2;
    let titleSize = 24;
    doc.font("Times-Bold");
    while (titleSize > 14 && doc.fontSize(titleSize).widthOfString(event.title) > TITLE_W) {
      titleSize -= 1;
    }
    doc.fontSize(titleSize).fillColor(DARK)
      .text(event.title, PAD, y, { width: TITLE_W, height: titleSize * 1.2, ellipsis: true, lineBreak: false });
    y += titleSize * 1.2 + 6;

    // Ornamental rule under the title
    doc.moveTo(PAD, y).lineTo(PAD + 46, y).lineWidth(2).strokeColor(GOLD).stroke();
    y += 10;

    // Date / venue / time
    const formattedDate = new Date(event.date).toLocaleDateString("en-KE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const metaCols = [{ label: "DATE", value: formattedDate }];
    if (event.venue) metaCols.push({ label: "VENUE", value: event.venue });
    if (event.time) metaCols.push({ label: "TIME", value: event.time });

    const colGap = 20;
    const availW = STUB_X - PAD * 2;
    const colW = (availW - colGap * (metaCols.length - 1)) / metaCols.length;
    const metaH = 10.5 * 1.2;
    metaCols.forEach((col, i) => {
      const cx = PAD + i * (colW + colGap);
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(LGREEN)
        .text(col.label, cx, y, { characterSpacing: 1.3 });
      doc.font("Times-Italic").fontSize(10.5).fillColor(DARK)
        .text(col.value, cx, y + 10, { width: colW, height: metaH, ellipsis: true, lineBreak: false });
    });
    y += 10 + metaH + 10;

    // Dotted divider
    doc.save().dash(2, { space: 2 }).moveTo(PAD, y).lineTo(STUB_X - PAD, y)
      .strokeColor("#e5e7eb").lineWidth(0.8).stroke().restore();
    y += 10;

    //Bottom Section: Premium Serif Typography 
    doc.font("Helvetica-Bold").fontSize(6).fillColor(LGREEN)
      .text("TICKET HOLDER", PAD, y, { characterSpacing: 1.5 });
    doc.font("Times-Italic").fontSize(10).fillColor(DARK)
      .text(order.fullName, PAD, y + 10, { width: 200, ellipsis: true });
    // Emai
    doc.save().opacity(0.4);
    doc.font("Helvetica").fontSize(7).fillColor(GRAY)
      .text(order.email, PAD, y + 27, { width: 200, ellipsis: true });
    doc.restore();

    // PURCHASED DATE 
    const rawPurchaseDate = order.paidAt || order.createdAt || Date.now();
    const purchasedDate = new Date(rawPurchaseDate).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const dateY = y + 42;
    doc.font("Helvetica-Bold").fontSize(6).fillColor(LGREEN)
      .text("PURCHASED", PAD, dateY, { characterSpacing: 1.5 });
    doc.font("Times-Italic").fontSize(11).fillColor(DARK)
      .text(purchasedDate, PAD, dateY + 10);

    //AMOUNT PAID 
    const numericPrice = Number(order.ticketPrice || 0);
    const formattedAmount = numericPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const currencyStr = order.currency || "KES";
    const amountPaidDisplay = `${currencyStr} ${formattedAmount}`;

    const badgeW = 148;
    const badgeX = STUB_X - PAD - badgeW;
    const badgeY2 = y + 2;
    const badgeH = 54;

    // Badge background & border
    doc.save();
    doc.roundedRect(badgeX, badgeY2, badgeW, badgeH, 7)
      .fillAndStroke("#fafbfc", "#e2e8f0");
    // Gold left accent stripe
    doc.roundedRect(badgeX, badgeY2 + 8, 3.5, badgeH - 16, 2).fill(GOLD);

    doc.font("Helvetica-Bold").fontSize(6).fillColor(GRAY)
      .text("AMOUNT PAID", badgeX + 14, badgeY2 + 12, { width: badgeW - 20, characterSpacing: 1.5 });
    doc.font("Times-Bold").fontSize(15).fillColor(GREEN)
      .text(amountPaidDisplay, badgeX + 14, badgeY2 + 26, { width: badgeW - 20 });
    doc.restore();

    // Footer disclaimer
    doc.font("Helvetica").fontSize(6).fillColor("#c0c5cc")
      .text(
        "Non-transferable  ·  Valid for one person only  ·  Present QR at entrance",
        PAD, PH - 14,
        { width: STUB_X - PAD * 2 }
      );

    doc.save();
    doc.circle(STUB_X, 0, PERF_R).fill(WHITE);
    doc.circle(STUB_X, PH, PERF_R).fill(WHITE);
    doc.restore();
    doc.save().dash(3, { space: 3 }).moveTo(STUB_X, PERF_R).lineTo(STUB_X, PH - PERF_R)
      .strokeColor("#d1d5db").lineWidth(1).stroke().restore();

    //STUB
    const stubGrad = doc.linearGradient(STUB_X, 0, STUB_X, PH);
    stubGrad.stop(0, GREEN_DARK).stop(0.5, GREEN).stop(1, GREEN_DARK);
    doc.rect(STUB_X, 0, STUB_W, PH).fill(stubGrad);
    doc.rect(STUB_X, 0, 1.4, PH).fill(GOLD);

    // Faint concentric ring motif
    doc.save();
    doc.rect(STUB_X, 0, STUB_W, PH).clip();
    doc.strokeColor("#ffffff").opacity(0.06).lineWidth(1);
    [26, 42, 58].forEach((r) => doc.circle(STUB_X + STUB_W - 8, PH - 8, r).stroke());
    doc.opacity(1);
    doc.restore();

    const stubCX = STUB_X + STUB_W / 2;

    doc.font("Helvetica-Bold").fontSize(6.5).fillColor(MINT)
      .text("PRESENT QR AT ENTRANCE", STUB_X, 20, { width: STUB_W, align: "center", characterSpacing: 1.1 });

    // QR on a crisp white card 
    const QR_SIZE = 108;
    const QR_X = stubCX - QR_SIZE / 2;
    const QR_Y = 38;
    const QR_PAD = 9;
    doc.roundedRect(QR_X - QR_PAD, QR_Y - QR_PAD, QR_SIZE + QR_PAD * 2, QR_SIZE + QR_PAD * 2, 7).fill(WHITE);
    doc.image(qrBuf, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });

    let sy = QR_Y + QR_SIZE + QR_PAD + 16;

    const shortCode = order.ticketCode.slice(0, 8).toUpperCase();
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor(MINT)
      .text("TICKET CODE", STUB_X, sy, { width: STUB_W, align: "center", characterSpacing: 1.2 });
    sy += 11;
    doc.font("Courier-Bold").fontSize(12).fillColor("#ffffff")
      .text(shortCode, STUB_X, sy, { width: STUB_W, align: "center", characterSpacing: 1.5 });

    const ref = order.paystackReference || String(order._id);
    doc.font("Helvetica").fontSize(5.5).fillColor(MINT).opacity(0.8)
      .text(`Ref ${ref.slice(-10)}`, STUB_X, PH - 15, { width: STUB_W, align: "center" });
    doc.opacity(1);

    doc.restore();

    doc.save().roundedRect(0.75, 0.75, PW - 1.5, PH - 1.5, 5)
      .lineWidth(0.75).strokeColor("#e5e7eb").stroke().restore();

    doc.end();
  });
}



// In-flight tracker: ensures only ONE delivery process runs per order at any given time
const inFlightDeliveries = new Map();

/**
 * Secondary delivery/storage tasks:
 *   - Cloudinary QR upload (only if !order.qrCodeUrl)
 *   - Cloudinary PDF upload (only if !order.ticketPdfUrl)
 *   - Email sending (only if order.emailStatus !== "SENT")
 *
 * Each task is strictly sequential:
 *   load fresh doc → process QR → await save → process PDF → await save → process Email → await save
 *
 * Guaranteed:
 *   1. No ParallelSaveError (saves never overlap on the same document)
 *   2. No duplicate emails (in-flight map prevents concurrent runs)
 *   3. Succeeded tasks are skipped; failed tasks are saved and retryable
 */
async function processSecondaryDeliveries(orderOrId, event, { qrBuffer, pdfBuffer } = {}) {
  const TicketOrder = require("../models/TicketOrder");
  const Event = require("../models/Event");

  const orderId = String(orderOrId._id || orderOrId);

  // If a delivery is already in progress for this order, join the active promise
  if (inFlightDeliveries.has(orderId)) {
    console.log(`[ticketService] Delivery already in progress for order ${orderId}, joining active task`);
    return inFlightDeliveries.get(orderId);
  }

  const deliveryPromise = (async () => {
    try {
      const order = await TicketOrder.findById(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      if (!event || !event.title) {
        event = await Event.findById(order.event);
        if (!event) {
          throw new Error(`Event for order ${orderId} not found`);
        }
      }

      // Ensure ticketCode exists (reuse existing, never regenerate)
      if (!order.ticketCode) {
        order.ticketCode = crypto.randomBytes(16).toString("hex");
        await order.save();
      }

      // Ensure status is TICKET_ISSUED
      if (order.status === "PAID") {
        order.status = "TICKET_ISSUED";
        order.ticketIssuedAt = order.ticketIssuedAt || new Date();
        await order.save();
      }

      // ── Step A: Cloudinary QR upload (sequential) ──
      if (!order.qrCodeUrl) {
        try {
          if (!qrBuffer) {
            qrBuffer = await QRCode.toBuffer(order.ticketCode, {
              errorCorrectionLevel: "H",
              width: 400,
              margin: 2,
              color: { dark: "#166534", light: "#ffffff" },
            });
          }
          const qrResult = await uploadBuffer(qrBuffer, {
            folder: "EUSDA_tickets/qr",
            public_id: `qr_${order.ticketCode}`,
            resource_type: "image",
            format: "png",
            overwrite: false,
          });
          order.qrCodeUrl = qrResult.secure_url;
          await order.save();
          console.log(`[ticketService] QR uploaded to Cloudinary for order ${order._id}`);
        } catch (cldErr) {
          console.warn(`[ticketService] Cloudinary QR upload skipped/failed for order ${order._id} (${cldErr.message})`);
        }
      }

      // ── Step B: Cloudinary PDF upload (sequential) ──
      if (!order.ticketPdfUrl) {
        try {
          if (!pdfBuffer) {
            if (!qrBuffer) {
              qrBuffer = await QRCode.toBuffer(order.ticketCode, {
                errorCorrectionLevel: "H",
                width: 400,
                margin: 2,
                color: { dark: "#166534", light: "#ffffff" },
              });
            }
            pdfBuffer = await generateTicketPDF(order, event, qrBuffer);
          }
          const pdfResult = await uploadBuffer(pdfBuffer, {
            folder: "EUSDA_tickets/pdf",
            public_id: `ticket_${order.ticketCode}`,
            resource_type: "raw",
            format: "pdf",
            overwrite: false,
          });
          order.ticketPdfUrl = pdfResult.secure_url;
          await order.save();
          console.log(`[ticketService] PDF uploaded to Cloudinary for order ${order._id}`);
        } catch (cldErr) {
          console.warn(`[ticketService] Cloudinary PDF upload skipped/failed for order ${order._id} (${cldErr.message})`);
        }
      }

      // ── Step C: Email delivery (sequential) ──
      if (order.emailStatus !== "SENT") {
        try {
          if (!pdfBuffer) {
            if (!qrBuffer) {
              qrBuffer = await QRCode.toBuffer(order.ticketCode, {
                errorCorrectionLevel: "H",
                width: 400,
                margin: 2,
                color: { dark: "#166534", light: "#ffffff" },
              });
            }
            pdfBuffer = await generateTicketPDF(order, event, qrBuffer);
          }
          await sendTicketEmail({ order, event, pdfBuffer });
          order.emailStatus = "SENT";
          await order.save();
          console.log(`[ticketService] Ticket email sent successfully for order ${order._id}`);
        } catch (emailErr) {
          order.emailStatus = "FAILED";
          await order.save();
          console.error(`[ticketService] Ticket email failed for order ${order._id}:`, emailErr.message);
        }
      }

      return order;
    } finally {
      inFlightDeliveries.delete(orderId);
    }
  })();

  inFlightDeliveries.set(orderId, deliveryPromise);
  return deliveryPromise;
}

/**
 * Critical Path Ticket Issuance:
 *   1. Ensure ticketCode exists (generate and save if missing; reuse if present)
 *   2. Generate in-memory QR code
 *   3. Generate in-memory PDF
 *   4. Mark order as TICKET_ISSUED immediately & save to DB
 *   5. Trigger secondary deliveries (Cloudinary / Email) in background
 *   6. Return order immediately
 */
async function issueTicket(order, event) {
  if (!order) {
    throw new Error("[ticketService] Order is required to issue ticket.");
  }

  if (
    order.status !== "PAID" &&
    order.status !== "TICKET_ISSUED" &&
    order.status !== "CHECKED_IN"
  ) {
    throw new Error(
      `[ticketService] Cannot issue ticket: order ${order._id} is in '${order.status}' status (must be PAID, TICKET_ISSUED, or CHECKED_IN)`
    );
  }

  if (!event || !event.title) {
    const Event = require("../models/Event");
    event = await Event.findById(order.event);
    if (!event) {
      throw new Error(`[ticketService] Event not found for order ${order._id}`);
    }
  }

  // ── Step 1: Ensure ticketCode exists ──
  // The ticket code is permanent and stable. It is reused across all retries.
  if (!order.ticketCode) {
    order.ticketCode = crypto.randomBytes(16).toString("hex");
    await order.save();
  }

  // ── Step 2: Generate QR code PNG buffer in memory ──
  const qrBuffer = await QRCode.toBuffer(order.ticketCode, {
    errorCorrectionLevel: "H",
    width: 400,
    margin: 2,
    color: { dark: "#166534", light: "#ffffff" },
  });

  // ── Step 3: Generate ticket PDF buffer in memory ──
  const pdfBuffer = await generateTicketPDF(order, event, qrBuffer);

  // ── Step 4: Mark status as TICKET_ISSUED immediately ──
  // Critical checkpoint: ticket is now officially valid and downloadable BEFORE secondary tasks
  if (order.status === "PAID") {
    order.status = "TICKET_ISSUED";
    order.ticketIssuedAt = order.ticketIssuedAt || new Date();
    await order.save();
    console.log(`[ticketService] Ticket status set to TICKET_ISSUED for order ${order._id}`);
  }

  // ── Step 5: Secondary deliveries (Cloudinary & Email) ──
  const needsQR = !order.qrCodeUrl;
  const needsPDF = !order.ticketPdfUrl;
  const needsEmail = order.emailStatus !== "SENT";

  if (needsQR || needsPDF || needsEmail) {
    // Process secondary tasks in background using in-flight protected processor
    processSecondaryDeliveries(order._id, event, { qrBuffer, pdfBuffer }).catch((err) => {
      console.error(
        `[ticketService] Secondary delivery background error for order ${order._id}:`,
        err.message
      );
    });
  }

  return order;
}

/**
 * Manual/admin retry mechanism.
 * Resumes from the point of failure for an order:
 * - Reuses existing ticketCode (never creates duplicate code/ticket)
 * - Skips already-successful deliveries
 * - Retries only missing/failed secondary tasks (Cloudinary / Email)
 * - Single-flight protected: avoids ParallelSaveError and duplicate email sends
 * - Awaits completion so the caller receives immediate status
 */
async function retryTicketDeliveries(orderId) {
  return await processSecondaryDeliveries(orderId);
}

// Generates the ticket PDF buffer ondemand for download.
async function getTicketPDFBuffer(order, event) {
  if (!event || !event.title) {
    const Event = require("../models/Event");
    event = await Event.findById(order.event);
  }
  const qrBuffer = await QRCode.toBuffer(order.ticketCode, {
    errorCorrectionLevel: "H",
    width: 400,
    margin: 2,
    color: { dark: "#166534", light: "#ffffff" },
  });
  return await generateTicketPDF(order, event, qrBuffer);
}

module.exports = {
  issueTicket,
  generateTicketPDF,
  getTicketPDFBuffer,
  processSecondaryDeliveries,
  retryTicketDeliveries,
};