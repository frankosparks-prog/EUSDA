const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const TicketOrder = require("../models/TicketOrder");
const Event = require("../models/Event");
const { issueTicket } = require("../services/ticketService");


// Paystack webhook listener for asynchronous transaction notifications
router.post("/", async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return res.status(500).send("Webhook secret not configured.");
    }

    const signature = req.headers["x-paystack-signature"];
    if (!signature) {
      return res.status(401).send("Missing signature");
    }

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : typeof req.body === "string"
        ? Buffer.from(req.body)
        : Buffer.from(JSON.stringify(req.body));

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.warn("Paystack webhook warning: Invalid webhook signature.");
      return res.status(401).send("Invalid signature");
    }

    let eventPayload;
    try {
      eventPayload = Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString("utf8"))
        : typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body;
    } catch (parseErr) {
      console.error("Paystack webhook JSON parse error:", parseErr);
      return res.status(400).send("Invalid payload");
    }

    const { event, data } = eventPayload;
    if (event === "charge.success" && data) {
      const reference = data.reference;
      const orderIdFromMeta = data.metadata?.orderId;
      let order = null;
      if (reference) {
        order = await TicketOrder.findOne({ paystackReference: reference });
      }
      if (!order && orderIdFromMeta) {
        order = await TicketOrder.findById(orderIdFromMeta);
      }

      if (!order) {
        return res.status(200).json({ received: true, note: "Order not found" });
      }

      // Idempotency check
      if (order.status !== "PENDING") {
        return res.status(200).json({ received: true, status: order.status });
      }

      const expectedSubunits = Math.round(order.ticketPrice * 100);
      if (data.amount < expectedSubunits) {
        return res.status(200).json({
          received: true,
          error: "Amount paid is less than required ticket price",
        });
      }

      order.status = "PAID";
      order.paidAt = new Date(data.paid_at || Date.now());
      order.paystackChannel = data.channel || null;
      if (!order.paystackReference && reference) {
        order.paystackReference = reference;
      }
      await order.save();



      // Fire-and-forget
      Event.findById(order.event)
        .then((evt) => {
          if (evt) {
            return issueTicket(order, evt);
          }
        })
        .catch((err) => {
          console.error(
            `[webhook] Ticket issuance failed for order ${order._id}:`,
            err.message
          );
        });
    }

    // Acknowledge all events promptly to Paystack
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Paystack webhook handler error:", err);
    res.status(500).json({ error: "Internal server error handling webhook" });
  }
});

module.exports = router;
