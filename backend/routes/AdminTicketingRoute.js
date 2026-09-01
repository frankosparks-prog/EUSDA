const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TicketOrder = require("../models/TicketOrder");
const Event = require("../models/Event");
const authenticateToken = require("../authToken");

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

router.use(authenticateToken, requireAdmin);

router.get("/dashboard", async (req, res) => {
  try {
    // ── Event counts ──
    const [totalEvents, ticketedEventsCount] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ ticketed: true }),
    ]);

    // ── Order aggregation ──
    const orderStats = await TicketOrder.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
          },
          paid: {
            $sum: { $cond: [{ $eq: ["$status", "PAID"] }, 1, 0] },
          },
          ticketIssued: {
            $sum: { $cond: [{ $eq: ["$status", "TICKET_ISSUED"] }, 1, 0] },
          },
          checkedIn: {
            $sum: { $cond: [{ $eq: ["$status", "CHECKED_IN"] }, 1, 0] },
          },
          emailSent: {
            $sum: { $cond: [{ $eq: ["$emailStatus", "SENT"] }, 1, 0] },
          },
          emailFailed: {
            $sum: { $cond: [{ $eq: ["$emailStatus", "FAILED"] }, 1, 0] },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    ["PAID", "TICKET_ISSUED", "CHECKED_IN"],
                  ],
                },
                "$ticketPrice",
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = orderStats[0] || {
      totalOrders: 0,
      pending: 0,
      paid: 0,
      ticketIssued: 0,
      checkedIn: 0,
      emailSent: 0,
      emailFailed: 0,
      totalRevenue: 0,
    };

    // Problem counters for quick admin attention
    // "paid but ticket not issued" = status is PAID (email may have failed)
    const paidNotIssued = stats.paid;
    // "issued but email failed" = TICKET_ISSUED + emailStatus=FAILED (shouldn't happen but defensive)
    const issuedEmailFailed = await TicketOrder.countDocuments({
      status: "TICKET_ISSUED",
      emailStatus: "FAILED",
    });

    res.json({
      events: {
        total: totalEvents,
        ticketed: ticketedEventsCount,
      },
      orders: {
        total: stats.totalOrders,
        pending: stats.pending,
        paid: stats.paid,
        ticketIssued: stats.ticketIssued,
        checkedIn: stats.checkedIn,
      },
      email: {
        sent: stats.emailSent,
        failed: stats.emailFailed,
      },
      problems: {
        paidNotIssued,
        issuedEmailFailed,
      },
      revenue: {
        total: stats.totalRevenue,
        currency: "KES",
      },
    });
  } catch (err) {
    console.error("Admin ticketing dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/ticketing/events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }).lean();

    // Build per-event stats via aggregation
    const stats = await TicketOrder.aggregate([
      {
        $group: {
          _id: "$event",
          totalOrders: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
          },
          paid: {
            $sum: { $cond: [{ $eq: ["$status", "PAID"] }, 1, 0] },
          },
          ticketIssued: {
            $sum: { $cond: [{ $eq: ["$status", "TICKET_ISSUED"] }, 1, 0] },
          },
          checkedIn: {
            $sum: { $cond: [{ $eq: ["$status", "CHECKED_IN"] }, 1, 0] },
          },
          emailFailed: {
            $sum: { $cond: [{ $eq: ["$emailStatus", "FAILED"] }, 1, 0] },
          },
          revenue: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    ["PAID", "TICKET_ISSUED", "CHECKED_IN"],
                  ],
                },
                "$ticketPrice",
                0,
              ],
            },
          },
        },
      },
    ]);

    // Map stats by event ID for O(1) lookup
    const statsMap = {};
    for (const s of stats) {
      statsMap[String(s._id)] = s;
    }

    const result = events.map((ev) => {
      const s = statsMap[String(ev._id)] || {
        totalOrders: 0,
        pending: 0,
        paid: 0,
        ticketIssued: 0,
        checkedIn: 0,
        emailFailed: 0,
        revenue: 0,
      };
      return {
        ...ev,
        ticketStats: {
          totalOrders: s.totalOrders,
          pending: s.pending,
          paid: s.paid,
          ticketIssued: s.ticketIssued,
          checkedIn: s.checkedIn,
          emailFailed: s.emailFailed,
          revenue: s.revenue,
        },
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Admin ticketing events error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/ticketing/events/:eventId/orders
router.get("/events/:eventId/orders", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status, page = 1, limit = 50 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID." });
    }

    const filter = { event: eventId };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      TicketOrder.find(filter)
        .populate("event", "title date venue ticketPrice")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      TicketOrder.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("Admin event orders error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/admin/ticketing/orders ──────────────────────────────────────────
// Returns all orders with search (name/email/ticketCode) and status filter.
router.get("/orders", async (req, res) => {
  try {
    const {
      search = "",
      status,
      emailStatus,
      eventId,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (emailStatus) filter.emailStatus = emailStatus;
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
      filter.event = eventId;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { fullName: regex },
        { email: regex },
        { ticketCode: regex },
        { phone: regex },
      ];
    }

    const [orders, total] = await Promise.all([
      TicketOrder.find(filter)
        .populate("event", "title date venue ticketPrice")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      TicketOrder.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("Admin orders error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/admin/ticketing/checkin ────────────────────────────────────────
// Event-day QR check-in. ALL validations performed server-side.
// Body: { ticketCode, eventId }
// The frontend MUST NOT perform any validation or mutate status directly.
router.post("/checkin", async (req, res) => {
  try {
    const { ticketCode, eventId } = req.body;

    if (!ticketCode || !eventId) {
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        message: "ticketCode and eventId are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT",
        message: "Invalid event ID.",
      });
    }

    // ── 1. Look up ticket ──
    const order = await TicketOrder.findOne({ ticketCode }).populate(
      "event",
      "title date venue time"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: " Invalid ticket — not found in the system.",
      });
    }

    // ── 2. Verify correct event ──
    if (String(order.event._id) !== String(eventId)) {
      return res.status(400).json({
        success: false,
        code: "WRONG_EVENT",
        message: `Wrong event — this ticket is for "${order.event.title}", not the selected event.`,
        ticketEvent: order.event.title,
      });
    }

    // ── 3. Payment / ticket issuance checks ──
    if (order.status === "PENDING") {
      return res.status(400).json({
        success: false,
        code: "PAYMENT_PENDING",
        message: "Payment not confirmed for this ticket.",
        attendee: order.fullName,
      });
    }

    if (order.status === "PAID") {
      return res.status(400).json({
        success: false,
        code: "TICKET_NOT_ISSUED",
        message: "Ticket not yet issued — payment confirmed but ticket generation is pending.",
        attendee: order.fullName,
      });
    }

    // ── 4. Already checked in ──
    if (order.status === "CHECKED_IN") {
      return res.status(409).json({
        success: false,
        code: "ALREADY_CHECKED_IN",
        message: ` Already checked in at ${new Date(order.checkedInAt).toLocaleString("en-KE")}.`,
        attendee: order.fullName,
        checkedInAt: order.checkedInAt,
        checkedInBy: order.checkedInBy,
      });
    }

    // ── 5. Valid — perform check-in ──
    // status must be TICKET_ISSUED at this point
    const adminUsername = req.user?.username || req.user?.id || "admin";
    order.status = "CHECKED_IN";
    order.checkedInAt = new Date();
    order.checkedInBy = adminUsername;
    await order.save();

    return res.status(200).json({
      success: true,
      code: "CHECKED_IN",
      message: `Valid ticket — ${order.fullName} checked in successfully.`,
      attendee: {
        name: order.fullName,
        email: order.email,
        phone: order.phone,
      },
      event: {
        title: order.event.title,
        date: order.event.date,
        venue: order.event.venue,
        time: order.event.time,
      },
      ticketCode: order.ticketCode,
      checkedInAt: order.checkedInAt,
      checkedInBy: order.checkedInBy,
    });
  } catch (err) {
    console.error("Admin check-in error:", err);
    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "Server error during check-in.",
      error: err.message,
    });
  }
});

module.exports = router;
