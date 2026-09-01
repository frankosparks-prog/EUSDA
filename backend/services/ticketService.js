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
    const doc = new PDFDocument({
      size: "A4",
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

    const PW = 595;
    const GREEN = "#166534";
    const LGREEN = "#16a34a";
    const DARK = "#111827";
    const GRAY = "#6b7280";
    const LGRAY = "#f3f4f6";

    doc.rect(0, 0, PW, 90).fill(GREEN);
    doc.font("Helvetica-Bold").fontSize(26).fillColor("#ffffff").text("EUSDA", 50, 22);
    doc.font("Helvetica").fontSize(10).fillColor("#bbf7d0").text("EVANGELICAL CHURCH", 50, 54);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#ffffff")
      .text("EVENT TICKET", 0, 38, { width: PW - 50, align: "right" });

    doc.font("Helvetica-Bold").fontSize(19).fillColor(DARK)
      .text(event.title, 50, 110, { width: PW - 100 });

    let y = doc.y + 12;

    const metaRows = [];
    const formattedDate = new Date(event.date).toLocaleDateString("en-KE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    metaRows.push(`Date:     ${formattedDate}`);
    if (event.venue) metaRows.push(`Venue:    ${event.venue}`);
    if (event.time) metaRows.push(`Time:     ${event.time}`);

    doc.font("Helvetica").fontSize(11).fillColor(GRAY);
    for (const row of metaRows) {
      doc.text(row, 50, y);
      y += 17;
    }

    doc.font("Helvetica-Bold").fontSize(11).fillColor(LGREEN)
      .text(
        `Ticket Price:     ${order.currency || "KES"} ${(order.ticketPrice || 0).toLocaleString()}`,
        50,
        y
      );
    y += 28;

    doc.save()
      .dash(4, { space: 4 })
      .moveTo(50, y)
      .lineTo(PW - 50, y)
      .strokeColor("#d1d5db")
      .lineWidth(0.8)
      .stroke()
      .restore();
    y += 20;

    const QR_SIZE = 130;
    const QR_X = PW - 50 - QR_SIZE;
    const QR_Y = y;
    const LEFT_MAX = QR_X - 20;

    // QR code image
    doc.image(qrBuf, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });
    doc.font("Helvetica").fontSize(7).fillColor(GRAY)
      .text("Scan at entrance", QR_X, QR_Y + QR_SIZE + 4, { width: QR_SIZE, align: "center" });

    doc.font("Helvetica-Bold").fontSize(8).fillColor(GRAY).text("ATTENDEE", 50, y);
    y += 13;
    doc.font("Helvetica-Bold").fontSize(15).fillColor(DARK).text(order.fullName, 50, y, { width: LEFT_MAX });
    y += 20;
    doc.font("Helvetica").fontSize(10).fillColor(GRAY).text(order.email, 50, y, { width: LEFT_MAX });
    y += 15;
    doc.font("Helvetica").fontSize(10).fillColor(GRAY).text(order.phone, 50, y);
    y += 26;

    doc.font("Helvetica-Bold").fontSize(8).fillColor(GRAY).text("TICKET CODE", 50, y);
    y += 12;

    const CODE_BOX_W = Math.min(LEFT_MAX, 230);
    doc.rect(50, y, CODE_BOX_W, 28).fill(LGRAY);
    doc.font("Helvetica").fontSize(9).fillColor(GREEN)
      .text(order.ticketCode, 57, y + 9, {
        width: CODE_BOX_W - 14,
        lineBreak: false,
        ellipsis: false,
      });

    y = Math.max(y + 28, QR_Y + QR_SIZE + 18) + 18;

    // ── Second divider ─────────────────────────────────────────────────────
    doc.save()
      .dash(4, { space: 4 })
      .moveTo(50, y)
      .lineTo(PW - 50, y)
      .strokeColor("#d1d5db")
      .lineWidth(0.8)
      .stroke()
      .restore();
    y += 18;


    const FOOTER_H = 90;
    doc.rect(0, y, PW, FOOTER_H).fill("#f0fdf4");
    doc.font("Helvetica-Bold").fontSize(11).fillColor(GREEN)
      .text("Present this QR code at the entrance for check-in.", 50, y + 14, {
        width: PW - 100,
        align: "center",
      });
    doc.font("Helvetica").fontSize(9).fillColor(GRAY)
      .text("This ticket is valid for one person only · Non-transferable", 50, y + 33, {
        width: PW - 100,
        align: "center",
      });
    const ref = order.paystackReference || String(order._id);
    doc.font("Helvetica").fontSize(8).fillColor("#9ca3af")
      .text(`Issued by EUSDA Events System · Ref: ${ref}`, 50, y + 52, {
        width: PW - 100,
        align: "center",
      });

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

  //Step 3: Upload QR to Cloudinary 
  if (!order.qrCodeUrl) {
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
  }

  // Step 4: Generate PDF in memory
  // Always generated fresh using the stored ticketCode + the QR buffer.
  const pdfBuffer = await generateTicketPDF(order, event, qrBuffer);

  // Step 5: Upload PDF to Cloudinary 
  if (!order.ticketPdfUrl) {
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
  }

  // Step 6: Send email
  try {
    await sendTicketEmail({ order, event, pdfBuffer });
    order.emailStatus = "SENT";
  } catch (emailErr) {
    order.emailStatus = "FAILED";
    await order.save();
    console.error(
      `[ticketService] Email failed for order ${order._id}:`,
      emailErr.message
    );
    throw emailErr;
  }


  // Only reached after email succeeds.
  order.status = "TICKET_ISSUED";
  order.ticketIssuedAt = new Date();
  await order.save();

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
