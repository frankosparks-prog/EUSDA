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
    // ── Premium horizontal ticket slip ───────────────────────────────────────
    // Correctly-proportioned like real ticket stock (not an oversized page),
    // a serif/sans font pairing for a genuine print feel, and no data repeated
    // between the main body and the tear-off stub.
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

    // ── Palette — unchanged brand colors, one gold accent ───────────────────
    const GREEN = "#166534";
    const GREEN_DARK = "#0d3d20";
    const LGREEN = "#16a34a";
    const MINT = "#bbf7d0";
    const DARK = "#111827";
    const GRAY = "#6b7280";
    const GOLD = "#d4af37";
    const CREAM = "#faf8f2"; // warm off-white — reads as premium stock, not printer paper

    const STUB_W = 168;
    const STUB_X = PW - STUB_W;
    const PERF_R = 10;
    const PAD = 26;

    // Embed EUSDA logo if available (unchanged search logic)
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

    // ── Base ─────────────────────────────────────────────────────────────────
    doc.rect(0, 0, PW, PH).fill(CREAM);

    // Clip everything to the rounded outer shape so no fill pokes a square
    // corner past the rounded card edge.
    doc.save();
    doc.roundedRect(0, 0, PW, PH, 5).clip();

    // Faint gradient wash for subtle paper depth — a single gradient fill,
    // not a dot-grid (which would be 1,000+ tiny vector ops for a barely
    // visible effect and unnecessary render/file-size cost).
    const paperWash = doc.linearGradient(0, 0, PW, PH);
    paperWash.stop(0, "#ffffff", 0.5).stop(1, GREEN, 0.03);
    doc.rect(0, 0, PW, PH).fill(paperWash);

    // ── MAIN BODY (left) ────────────────────────────────────────────────────
    doc.rect(0, 0, STUB_X, 5).fill(GREEN);
    doc.rect(0, 5, STUB_X, 1).fill(GOLD);

    let bodyTextX = PAD;
    if (logoPath) {
      try {
        doc.image(logoPath, PAD, 12, { fit: [26, 26], align: "center", valign: "center" });
        bodyTextX = PAD + 34;
      } catch (imgErr) {
        console.warn("[ticketService] Could not embed logo image in PDF:", imgErr.message);
      }
    }

    let y = 18;
    doc.font("Helvetica-Bold").fontSize(8).fillColor(GREEN)
      .text("EUSDA / 24 SABBATH SCHOOL", bodyTextX, y, { characterSpacing: 1.2 });
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(GRAY)
      .text("CONCERT TICKET", 0, y, { width: STUB_X - PAD, align: "right", characterSpacing: 1.2 });
    y += 20;

    // Event title in Times-Bold — a serif display face reads as premium
    // print in a way Helvetica-Bold never does. Auto-shrinks to stay on ONE
    // line rather than wrapping, so a long title can never eat into the
    // vertical space the rows below it depend on.
    const TITLE_W = STUB_X - PAD * 2;
    let titleSize = 25;
    doc.font("Times-Bold");
    while (titleSize > 14 && doc.fontSize(titleSize).widthOfString(event.title) > TITLE_W) {
      titleSize -= 1;
    }
    doc.fontSize(titleSize).fillColor(DARK)
      .text(event.title, PAD, y, { width: TITLE_W, height: titleSize * 1.2, ellipsis: true, lineBreak: false });
    y += titleSize * 1.2 + 10;

    // Ornamental rule under the title — a short accent line, not a full
    // divider, so it reads as a graphic flourish rather than a section break.
    doc.moveTo(PAD, y).lineTo(PAD + 46, y).lineWidth(2).strokeColor(GOLD).stroke();
    y += 14;

    // Date / venue / time — letter-spaced small labels, Times-Italic values,
    // laid out side by side like a boarding pass.
    const formattedDate = new Date(event.date).toLocaleDateString("en-KE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const metaCols = [{ label: "DATE", value: formattedDate }];
    if (event.venue) metaCols.push({ label: "VENUE", value: event.venue });
    if (event.time) metaCols.push({ label: "TIME", value: event.time });

    const colGap = 22;
    const availW = STUB_X - PAD * 2;
    const colW = (availW - colGap * (metaCols.length - 1)) / metaCols.length;
    const metaH = 10.5 * 1.2; // single line, clamped below — keeps total height fixed
    metaCols.forEach((col, i) => {
      const cx = PAD + i * (colW + colGap);
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(LGREEN)
        .text(col.label, cx, y, { characterSpacing: 1.3 });
      doc.font("Times-Italic").fontSize(10.5).fillColor(DARK)
        .text(col.value, cx, y + 11, { width: colW, height: metaH, ellipsis: true, lineBreak: false });
    });
    y += 11 + metaH + 14;

    // Dotted divider
    doc.save().dash(2, { space: 2 }).moveTo(PAD, y).lineTo(STUB_X - PAD, y)
      .strokeColor("#d6cfc0").lineWidth(0.8).stroke().restore();
    y += 14;

    // Attendee (left) + Price (right) — the ONLY place name/email/phone
    // appear; the stub does not repeat any of this.
    const attendeeW = availW * 0.56;
    const rightColX = PAD + attendeeW + 22;
    const rightColW = availW - attendeeW - 22;

    doc.font("Helvetica-Bold").fontSize(6.5).fillColor(GRAY).text("ATTENDEE", PAD, y, { characterSpacing: 1.3 });
    doc.font("Times-Bold").fontSize(13).fillColor(DARK)
      .text(order.fullName, PAD, y + 11, { width: attendeeW, ellipsis: true });
    doc.font("Helvetica").fontSize(8).fillColor(GRAY)
      .text(order.email, PAD, y + 27, { width: attendeeW, ellipsis: true });
    doc.font("Helvetica").fontSize(8).fillColor(GRAY)
      .text(order.phone, PAD, y + 38, { width: attendeeW, ellipsis: true });

    doc.font("Helvetica-Bold").fontSize(6.5).fillColor(GRAY).text("PRICE", rightColX, y, { characterSpacing: 1.3 });
    doc.font("Times-Bold").fontSize(13).fillColor(LGREEN)
      .text(
        `${order.currency || "KES"} ${(order.ticketPrice || 0).toLocaleString()}`,
        rightColX,
        y + 11,
        { width: rightColW }
      );

    doc.font("Helvetica").fontSize(6.5).fillColor("#9ca3af")
      .text(
        "Non-transferable  ·  Valid for one person only  ·  Present QR at entrance",
        PAD,
        PH - 16,
        { width: STUB_X - PAD * 2 }
      );

    // ── PERFORATION between body and stub ───────────────────────────────────
    doc.save();
    doc.circle(STUB_X, 0, PERF_R).fill(CREAM);
    doc.circle(STUB_X, PH, PERF_R).fill(CREAM);
    doc.restore();
    doc.save().dash(3, { space: 3 }).moveTo(STUB_X, PERF_R).lineTo(STUB_X, PH - PERF_R)
      .strokeColor("#b0a894").lineWidth(1).stroke().restore();

    // ── STUB (right) — QR + short code ONLY, nothing repeated from the body ─
    const stubGrad = doc.linearGradient(STUB_X, 0, STUB_X, PH);
    stubGrad.stop(0, GREEN_DARK).stop(0.5, GREEN).stop(1, GREEN_DARK);
    doc.rect(STUB_X, 0, STUB_W, PH).fill(stubGrad);
    doc.rect(STUB_X, 0, 1.4, PH).fill(GOLD);

    // Faint concentric-ring motif — a small graphic detail like an embossed
    // seal, instead of another flat block of color.
    doc.save();
    doc.rect(STUB_X, 0, STUB_W, PH).clip();
    doc.strokeColor("#ffffff").opacity(0.06).lineWidth(1);
    [26, 42, 58].forEach((r) => doc.circle(STUB_X + STUB_W - 8, PH - 8, r).stroke());
    doc.opacity(1);
    doc.restore();

    const stubCX = STUB_X + STUB_W / 2;

    doc.font("Helvetica-Bold").fontSize(7).fillColor(MINT)
      .text("SCAN TO ENTER", STUB_X, 20, { width: STUB_W, align: "center", characterSpacing: 1.2 });

    // QR on a cream card so it reads crisply against the green
    const QR_SIZE = 108;
    const QR_X = stubCX - QR_SIZE / 2;
    const QR_Y = 38;
    const QR_PAD = 9;
    doc.roundedRect(QR_X - QR_PAD, QR_Y - QR_PAD, QR_SIZE + QR_PAD * 2, QR_SIZE + QR_PAD * 2, 7).fill(CREAM);
    doc.image(qrBuf, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });

    let sy = QR_Y + QR_SIZE + QR_PAD + 16;

    // Short human-readable code only (first 8 chars) — the full code is
    // already encoded in the QR, so there's no need to print all 32 hex
    // characters a second time.
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

    doc.restore(); // end rounded-corner clip

    // Crisp outer border drawn last, on top of the clip, so the rounded edge
    // itself reads as one clean printed line
    doc.save().roundedRect(0.75, 0.75, PW - 1.5, PH - 1.5, 5)
      .lineWidth(0.75).strokeColor("#e2dccb").stroke().restore();

    doc.end();
  });
}



// Lifecycle:
//   PAID → ticketCode saved → QR uploaded → PDF uploaded → email sent → TICKET_ISSUED
// If interrupted at any step, re-running resumes from where it left off
// because each checkpoint is saved to the DB immediately.

async function issueTicket(order, event) {

  if (order.status === "TICKET_ISSUED") {
    return order;
  }

  if (order.status !== "PAID") {
    throw new Error(
      `[ticketService] Cannot issue ticket: order ${order._id} is in '${order.status}' status (must be PAID)`
    );
  }

  // Step 1: Generate ticketCode
  // Saved immediately so that even if later steps fail, a retry reuses the
  // same code and never generates two different codes for one order.
  if (!order.ticketCode) {
    order.ticketCode = crypto.randomBytes(16).toString("hex");
    await order.save();
  }

  // Step 2: Generate QR code PNG buffer 
  // The QR encodes only the ticketCode .
  const qrBuffer = await QRCode.toBuffer(order.ticketCode, {
    errorCorrectionLevel: "H",
    width: 400,
    margin: 2,
    color: { dark: "#166534", light: "#ffffff" },
  });

  // Step 3: Upload QR to Cloudinary (optional backup, non-blocking)
  if (!order.qrCodeUrl) {
    try {
      const qrResult = await uploadBuffer(qrBuffer, {
        folder: "EUSDA_tickets/qr",
        public_id: `qr_${order.ticketCode}`,
        resource_type: "image",
        format: "png",
        overwrite: false,
      });
      order.qrCodeUrl = qrResult.secure_url;
      await order.save();
      console.log(`[ticketService] QR uploaded for order ${order._id}`);
    } catch (cldErr) {
      console.warn(`[ticketService] Cloudinary QR upload skipped (${cldErr.message})`);
    }
  }

  // Step 4: Generate PDF in memory
  // Always generated fresh using the stored ticketCode + the QR buffer.
  const pdfBuffer = await generateTicketPDF(order, event, qrBuffer);

  // Step 5: Upload PDF to Cloudinary (optional backup, non-blocking)
  if (!order.ticketPdfUrl) {
    try {
      const pdfResult = await uploadBuffer(pdfBuffer, {
        folder: "EUSDA_tickets/pdf",
        public_id: `ticket_${order.ticketCode}`,
        resource_type: "raw",
        format: "pdf",
        overwrite: false,
      });
      order.ticketPdfUrl = pdfResult.secure_url;
      await order.save();
      console.log(`[ticketService] PDF uploaded for order ${order._id}`);
    } catch (cldErr) {
      console.warn(`[ticketService] Cloudinary PDF upload skipped (${cldErr.message})`);
    }
  }

  // Step 6: Send email
  try {
    await sendTicketEmail({ order, event, pdfBuffer });
    order.emailStatus = "SENT";
  } catch (emailErr) {
    order.emailStatus = "FAILED";
    console.error(
      `[ticketService] Email failed for order ${order._id}:`,
      emailErr.message
    );
  }

  // Step 7: Mark status as TICKET_ISSUED
  order.status = "TICKET_ISSUED";
  order.ticketIssuedAt = new Date();
  await order.save();
  console.log(`[ticketService] Ticket issued successfully for order ${order._id}`);

  return order;
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

module.exports = { issueTicket, generateTicketPDF, getTicketPDFBuffer };