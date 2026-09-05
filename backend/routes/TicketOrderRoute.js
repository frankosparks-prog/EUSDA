const express = require("express");
const axios = require("axios");
const router = express.Router();
const TicketOrder = require("../models/TicketOrder");
const Event = require("../models/Event");
const { issueTicket, getTicketPDFBuffer } = require("../services/ticketService");

// ─── POST /api/ticket-orders ───────────────────────────────────────────────────
// Creates a PENDING ticket order for an event.
// Expects: { eventId, fullName, email, phone }
// Returns: { orderId, paystackReference, event, amount, currency, status }
router.post("/", async (req, res) => {
  try {
    const { eventId, fullName, email, phone } = req.body;

    // ── Required-field check ──
    if (!eventId || !fullName || !email || !phone) {
      return res.status(400).json({
        error: "eventId, fullName, email, and phone are required.",
      });
    }

    // ── Name validation ──
    if (
      !/^[A-Za-z\s]+$/.test(fullName.trim()) ||
      fullName.trim().length < 2
    ) {
      return res.status(400).json({ error: "Invalid name format." });
    }

    // ── Email validation ──
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    // ── Phone validation: accept Kenyan 07XX / 01XX (10 digits) ──
    if (!/^0[17]\d{8}$/.test(phone.trim())) {
      return res.status(400).json({
        error: "Phone number must be 10 digits starting with 07 or 01.",
      });
    }

    // ── Look up the event ──
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    // ── Create the pending order ──
    const order = new TicketOrder({
      event: event._id,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      ticketPrice: event.ticketPrice || 0,
      currency: "KES",
      status: "PENDING",
    });

    const saved = await order.save();

    res.status(201).json({
      orderId: saved._id,
      status: saved.status,
      amount: saved.ticketPrice,
      currency: saved.currency,
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        venue: event.venue,
      },
      paystackReference: saved.paystackReference,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error("TicketOrder POST error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/ticket-orders/:orderId/pay ──────────────────────────────────────
// Initializes a Paystack transaction for an existing PENDING ticket order.
// Validates order & event, calculates amount in KES subunits (cents),
// contacts Paystack initialize API, saves reference, and returns authorization URL.
router.post("/:orderId/pay", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        error: "Paystack payment gateway is not configured on the server.",
      });
    }

    // ── 1. Retrieve the order ──
    const order = await TicketOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Ticket order not found." });
    }

    // ── 2. Ensure order is PENDING ──
    if (order.status !== "PENDING") {
      return res.status(400).json({
        error: `Order cannot be paid because it is already in ${order.status} status.`,
        status: order.status,
      });
    }

    // ── 3. Check if ticket is free ──
    if (order.ticketPrice <= 0) {
      return res.status(400).json({
        error: "This order is for a free ticket and does not require payment.",
      });
    }

    // ── 4. Ensure associated event still exists ──
    const event = await Event.findById(order.event);
    if (!event) {
      return res.status(404).json({
        error: "The event for this ticket order no longer exists.",
      });
    }

    // ── 5. Generate unique Paystack reference ──
    const reference = `EUSDA-TKT-${order._id.toString().slice(-6)}-${Date.now()}`;

    // ── 6. Convert amount to KES subunit (cents: amount * 100) ──
    const amountInSubunits = Math.round(order.ticketPrice * 100);

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
    const callbackUrl =
      process.env.PAYSTACK_CALLBACK_URL ||
      `${frontendBase}/payment/callback`;

    // ── 7. Call Paystack Initialize Transaction API ──
    const paystackPayload = {
      email: order.email,
      amount: amountInSubunits,
      currency: order.currency || "KES",
      reference,
      callback_url: callbackUrl,
      metadata: {
        orderId: order._id.toString(),
        eventId: event._id.toString(),
        fullName: order.fullName,
        phone: order.phone,
        custom_fields: [
          {
            display_name: "Event Title",
            variable_name: "event_title",
            value: event.title,
          },
          {
            display_name: "Attendee Name",
            variable_name: "attendee_name",
            value: order.fullName,
          },
          {
            display_name: "Attendee Phone",
            variable_name: "attendee_phone",
            value: order.phone,
          },
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: order._id.toString(),
          },
        ],
      },
    };

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paystackRes.data.status || !paystackRes.data.data) {
      return res.status(400).json({
        error: paystackRes.data.message || "Failed to initialize Paystack transaction.",
      });
    }

    const { authorization_url, access_code } = paystackRes.data.data;

    // ── 8. Store reference & access code on order ──
    order.paystackReference = reference;
    order.paystackAccessCode = access_code;
    await order.save();

    // ── 9. Return only needed redirect information ──
    res.status(200).json({
      authorizationUrl: authorization_url,
      accessCode: access_code,
      reference,
      orderId: order._id,
    });
  } catch (err) {
    console.error("TicketOrder pay initialization error:", err.response?.data || err.message);
    const errorMsg =
      err.response?.data?.message || err.message || "Failed to initialize payment.";
    res.status(500).json({ error: errorMsg });
  }
});

// ─── GET /api/ticket-orders/verify/:reference ─────────────────────────────────
// Verifies transaction directly with Paystack API.
// After confirming PAID, fires issueTicket asynchronously (Phase 3).
// Placed BEFORE /:orderId to prevent route conflict.
router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ error: "Payment reference is required." });
    }

    // Find matching order by Paystack reference
    const order = await TicketOrder.findOne({ paystackReference: reference });
    if (!order) {
      return res.status(404).json({
        error: "No ticket order found matching this payment reference.",
      });
    }

    // If order is already past PENDING (PAID / TICKET_ISSUED / CHECKED_IN),
    // return current state idempotently — no need to re-verify with Paystack.
    if (order.status !== "PENDING") {
      await order.populate("event", "title date venue image ticketPrice time");
      return res.status(200).json({
        status: order.status,
        order,
        message:
          order.status === "TICKET_ISSUED"
            ? "Your ticket has been issued."
            : "Payment has already been confirmed.",
      });
    }

    // ── Call Paystack verify endpoint ──────────────────────────────────────
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        error: "Paystack secret key is not configured.",
      });
    }

    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = paystackRes.data?.data;
    if (!data) {
      return res.status(400).json({
        error: "Unable to retrieve payment details from Paystack.",
      });
    }

    if (data.status === "success") {
      // Cross-check payment details (Paystack amount is in subunits)
      const expectedSubunit = Math.round(order.ticketPrice * 100);
      if (data.amount < expectedSubunit) {
        return res.status(400).json({
          error: "Payment verification failed: Paid amount is less than expected.",
          status: order.status,
        });
      }

      if (
        data.currency &&
        data.currency.toUpperCase() !== (order.currency || "KES").toUpperCase()
      ) {
        return res.status(400).json({
          error: "Payment verification failed: Currency mismatch.",
          status: order.status,
        });
      }

      // ── Update order status to PAID ──
      order.status = "PAID";
      order.paidAt = new Date(data.paid_at || Date.now());
      order.paystackChannel = data.channel || null;
      await order.save();

      // ── Phase 3: Fire-and-forget ticket issuance ──────────────────────────
      // Do not await — respond to the user immediately with PAID status.
      // PaymentCallback.jsx can poll/retry to see TICKET_ISSUED once ready.
      Event.findById(order.event)
        .then((evt) => {
          if (evt) return issueTicket(order, evt);
        })
        .catch((err) => {
          console.error(
            `[verify] Ticket issuance failed for order ${order._id}:`,
            err.message
          );
        });

      await order.populate("event", "title date venue image ticketPrice time");

      return res.status(200).json({
        status: "PAID",
        order,
        message:
          "Payment successfully verified. Your ticket is being prepared and will be emailed shortly.",
      });
    } else {
      // Payment not yet successful (abandoned, failed, pending M-Pesa)
      await order.populate("event", "title date venue image ticketPrice time");

      return res.status(200).json({
        status: order.status, // still PENDING
        paystackStatus: data.status,
        message: data.gateway_response || `Payment status is ${data.status}.`,
        order,
      });
    }
  } catch (err) {
    console.error("TicketOrder verify error:", err.response?.data || err.message);
    const errorMsg =
      err.response?.data?.message || err.message || "Error verifying payment.";
    res.status(500).json({ error: errorMsg });
  }
});

// ─── GET /api/ticket-orders/callback ──────────────────────────────────────────
// Paystack browser redirect endpoint (for ngrok / local dev testing).
// Redirects the browser to http://localhost:3000/payment/callback?reference=<ref>
// Does NOT mark order as PAID — verification is handled strictly server-side.
router.get("/callback", (req, res) => {
  const reference = req.query.reference || req.query.trxref || "";
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontendBase}/payment/callback?reference=${encodeURIComponent(reference)}`);
});

// ─── GET /api/ticket-orders/download/:ticketCode ──────────────────────────────
// Secure ticket PDF download.
// Authorization credential: the ticketCode itself (32-char cryptographically
// random hex, cannot be guessed).
// Placed BEFORE /:orderId to prevent route conflict.
router.get("/download/:ticketCode", async (req, res) => {
  try {
    const { ticketCode } = req.params;

    if (!ticketCode || ticketCode.length < 16) {
      return res.status(400).json({ error: "Invalid ticket code." });
    }

    // Locate order by ticketCode (the unpredictable download credential)
    const order = await TicketOrder.findOne({ ticketCode }).populate(
      "event",
      "title date venue time image ticketPrice"
    );

    if (!order) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    if (order.status === "PENDING") {
      return res.status(400).json({
        error: "Ticket order is still pending payment.",
      });
    }

    // Generate high-resolution PDF buffer in-memory directly
    // This avoids CDN 401 ACL/delivery restrictions and network roundtrips
    let pdfBuffer;
    try {
      pdfBuffer = await getTicketPDFBuffer(order, order.event);
    } catch (genErr) {
      console.warn("Direct PDF generation failed, attempting CDN fetch fallback:", genErr.message);
      if (order.ticketPdfUrl) {
        const pdfResponse = await axios.get(order.ticketPdfUrl, {
          responseType: "arraybuffer",
          timeout: 15000,
        });
        pdfBuffer = Buffer.from(pdfResponse.data);
      } else {
        throw genErr;
      }
    }

    const safeTitle = (order.event?.title || "event")
      .replace(/[^a-z0-9]/gi, "_")
      .slice(0, 40);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="EUSDA_Ticket_${safeTitle}.pdf"`
    );
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Ticket download error:", err.message);
    res.status(500).json({ error: "Failed to retrieve ticket PDF." });
  }
});

// ─── GET /api/ticket-orders/:orderId ──────────────────────────────────────────
// Retrieves a single order by its MongoDB _id.
router.get("/:orderId", async (req, res) => {
  try {
    const order = await TicketOrder.findById(req.params.orderId).populate(
      "event",
      "title date venue image ticketPrice time"
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("TicketOrder GET error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
