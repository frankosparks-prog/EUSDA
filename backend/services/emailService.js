const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}


//This function sends the ticket PDF as an email attachment to the attendee.
async function sendTicketEmail({ order, event, pdfBuffer }) {
  const transporter = createTransporter();

  const fromAddress =
    process.env.DEFAULT_FROM_EMAIL || process.env.EMAIL_HOST_USER;

  const formattedDate = new Date(event.date).toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const firstName = order.fullName.split(" ")[0];
  const priceDisplay = `${order.currency || "KES"} ${(
    order.ticketPrice || 0
  ).toLocaleString()}`;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your EUSDA Event Ticket</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto 40px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

    <!-- ── Header ── -->
    <div style="background:#166534;padding:32px 40px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:2px;">EUSDA</h1>
      <p style="color:#bbf7d0;margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:3px;">EVANGELICAL CHURCH</p>
    </div>

    <!-- ── Greeting ── -->
    <div style="padding:36px 40px 24px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 10px;font-weight:800;"> Your Ticket is Ready, ${firstName}!</h2>
      <p style="color:#6b7280;font-size:14px;margin:0;line-height:1.7;">
        Thank you for registering. Your entry ticket for
        <strong style="color:#166534;">${event.title}</strong>
        is attached to this email as a PDF. Open the PDF and show the QR code at the venue entrance.
      </p>
    </div>

    <!-- ── Event Info Card ── -->
    <div style="margin:0 40px 24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:22px 24px;">
      <h3 style="margin:0 0 14px;font-size:16px;color:#166534;font-weight:800;">${event.title}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;white-space:nowrap;width:90px;"> &nbsp;Date</td>
          <td style="padding:6px 0;color:#111827;font-weight:600;">${formattedDate}</td>
        </tr>
        ${event.venue ? `
        <tr>
          <td style="padding:6px 0;color:#6b7280;"> &nbsp;Venue</td>
          <td style="padding:6px 0;color:#111827;font-weight:600;">${event.venue}</td>
        </tr>` : ""}
        ${event.time ? `
        <tr>
          <td style="padding:6px 0;color:#6b7280;"> &nbsp;Time</td>
          <td style="padding:6px 0;color:#111827;font-weight:600;">${event.time}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:6px 0;color:#6b7280;"> &nbsp;Paid</td>
          <td style="padding:6px 0;color:#166534;font-weight:700;">${priceDisplay}</td>
        </tr>
      </table>
    </div>

    <!-- ── Attendee & Ticket Code ── -->
    <div style="margin:0 40px 24px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:22px 24px;">
      <p style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 6px;">ATTENDEE</p>
      <p style="font-size:17px;font-weight:800;color:#111827;margin:0 0 4px;">${order.fullName}</p>
      <p style="font-size:13px;color:#6b7280;margin:0 0 20px;">${order.email} &nbsp;·&nbsp; ${order.phone}</p>

      <p style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px;">TICKET CODE</p>
      <div style="background:#ffffff;border:1px solid #d1d5db;border-radius:8px;padding:12px 16px;font-family:monospace;font-size:13px;color:#166534;word-break:break-all;letter-spacing:1.5px;">
        ${order.ticketCode}
      </div>
    </div>

    <!-- ── Instruction Banner ── -->
    <div style="margin:0 40px 32px;background:#166534;border-radius:12px;padding:20px 24px;text-align:center;">
      <p style="color:#ffffff;font-weight:700;font-size:14px;margin:0 0 6px;"> How to use your ticket</p>
      <p style="color:#bbf7d0;font-size:12px;margin:0;line-height:1.7;">
        Open the attached PDF and present the QR code to our staff at the entrance.<br/>
        This ticket is valid for <strong>one person</strong> only. Non-transferable.
      </p>
    </div>

    <!-- ── Footer ── -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0 0 4px;">
        Questions? Contact us through the EUSDA website.
      </p>
      <p style="color:#d1d5db;font-size:10px;margin:0;">
        EUSDA Events System &nbsp;·&nbsp; This ticket was issued automatically upon payment confirmation.
      </p>
    </div>

  </div>
</body>
</html>`.trim();

  const safeEventTitle = (event.title || "event")
    .replace(/[^a-z0-9]/gi, "_")
    .slice(0, 40);

  await transporter.sendMail({
    from: `"EUSDA Events" <${fromAddress}>`,
    to: order.email,
    subject: `Your ticket for ${event.title} | EUSDA`,
    html: emailHtml,
    attachments: [
      {
        filename: `EUSDA_Ticket_${safeEventTitle}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  console.log(`Ticket email sent to ${order.email} (order: ${order._id})`);
}

module.exports = { sendTicketEmail };
