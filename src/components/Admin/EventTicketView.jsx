import React, { useEffect, useState, useCallback } from "react";
import {
  ChevronDown,
  RefreshCw,
  Calendar,
  MapPin,
  Ticket,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Download,
  Copy,
  Check,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const getToken = () => localStorage.getItem("adminToken");

/* ─── Status configs (shared design language with TicketOrders) ─── */
const STATUS_CONFIG = {
  PENDING: { label: "Pending", bg: "bg-amber-500", text: "text-white" },
  PAID: { label: "Paid", bg: "bg-[#2F5EA8]", text: "text-white" },
  TICKET_ISSUED: { label: "Issued", bg: "bg-[#161B33]", text: "text-white" },
  CHECKED_IN: { label: "Checked In", bg: "bg-emerald-600", text: "text-white" },
};

const EMAIL_CONFIG = {
  NOT_SENT: { label: "Not sent", bg: "bg-slate-200", text: "text-slate-500" },
  SENT: { label: "Sent", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-1 ring-emerald-200" },
  FAILED: { label: "Failed", bg: "bg-red-600", text: "text-white" },
};

function getProblem(order) {
  if (order.status === "PAID" && order.emailStatus === "FAILED") return "Paid — email failed";
  if (order.status === "PAID") return "Paid — ticket pending";
  if (order.status === "TICKET_ISSUED" && order.emailStatus === "FAILED") return "Issued — email failed";
  return null;
}

function canRetry(order) {
  return order.status === "PAID" || order.emailStatus === "FAILED";
}

/* ─── Small shared components ─── */
const Badge = ({ label, bg, text, ring }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap ${bg} ${text} ${ring || ""}`}>
    {label}
  </span>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };
  return (
    <button onClick={copy} title="Copy" className={`ml-1 shrink-0 transition-colors ${copied ? "text-emerald-600" : "text-[#B8860B] hover:text-[#161B33]"}`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

/* Dashed "stub" chip — same motif as TicketOrders, for the same fields */
const StubChip = ({ children }) => (
  <span className="font-mono text-[11px] tracking-tight text-[#161B33] bg-[#F2F3F7] border border-dashed border-[#B8860B]/50 px-2 py-1 rounded">
    {children}
  </span>
);

/* Stat card — each carries a distinct role, not a repeated tile.
   Revenue gets ink treatment since it's the number that matters most;
   Email Failed only appears when it's actually a problem worth flagging. */
const StatCard = ({ label, value, tone = "light" }) => {
  const tones = {
    light: "bg-white border border-slate-200 text-[#161B33]",
    dark: "bg-[#161B33] text-white",
    warn: "bg-red-600 text-white",
  };
  return (
    <div className={`flex-1 min-w-[110px] rounded-xl px-4 py-3 ${tones[tone]}`}>
      <span className={`text-xs font-medium ${tone === "light" ? "text-slate-400" : "text-white/60"}`}>{label}</span>
      <p className="text-xl font-bold mt-1 tabular-nums">{value}</p>
    </div>
  );
};

/* ─── Action button ─── */
const ActionBtn = ({ onClick, loading, icon: Icon, label, variant = "default", disabled = false, title }) => {
  const base = "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap";
  const variants = {
    default: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    green: "bg-[#161B33] text-white hover:bg-[#232a52]",
    blue: "bg-white text-[#161B33] border border-[#161B33]/20 hover:bg-[#F2F3F7]",
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} title={title} className={`${base} ${variants[variant]}`}>
      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
};

/* ─── CSV export (unchanged logic) ─── */
function exportCSV(orders, eventTitle) {
  const headers = [
    "Order ID", "Full Name", "Email", "Phone",
    "Amount (KES)", "Status", "Email Status",
    "Payment Ref", "Ticket Code", "Created At", "Checked In At"
  ];
  const rows = orders.map((o) => [
    o._id,
    o.fullName,
    o.email,
    o.phone,
    o.ticketPrice || 0,
    o.status,
    o.emailStatus || "NOT_SENT",
    o.paystackReference || "",
    o.ticketCode || "",
    o.createdAt ? new Date(o.createdAt).toISOString() : "",
    o.checkedInAt ? new Date(o.checkedInAt).toISOString() : "",
  ]);

  const csvContent = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EUSDA_Tickets_${(eventTitle || "event").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
const EventTicketView = () => {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  /* per-row action state */
  const [actionState, setActionState] = useState({});
  const setAS = (id, patch) =>
    setActionState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  /* load events list */
  useEffect(() => {
    (async () => {
      setEventsLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/admin/ticketing/events`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to load events.");
        const data = await res.json();
        const ticketed = data.filter((e) => e.ticketed);
        setEvents(ticketed);
        if (ticketed.length > 0) setSelectedId(ticketed[0]._id);
      } catch (e) {
        setError(e.message);
      } finally {
        setEventsLoading(false);
      }
    })();
  }, []);

  /* load orders for selected event */
  const loadOrders = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    setActionState({});
    try {
      const params = new URLSearchParams({ limit: 200 });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(
        `${SERVER_URL}/api/admin/ticketing/events/${selectedId}/orders?${params}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error("Failed to load orders.");
      const data = await res.json();
      setOrders(data.orders || []);
      setSelectedEvent(events.find((e) => e._id === selectedId) || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedId, statusFilter, events]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  /* action handlers */
  const retry = async (order) => {
    const id = order._id;
    setAS(id, { retrying: true, retryMsg: null, retryErr: null });
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/ticketing/orders/${id}/retry`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry failed.");
      setAS(id, { retrying: false, retryMsg: data.message || "Retry complete." });
      loadOrders();
    } catch (e) {
      setAS(id, { retrying: false, retryErr: e.message });
    }
  };

  const verify = async (order) => {
    const id = order._id;
    const ref = order.paystackReference;
    if (!ref) return;
    setAS(id, { verifying: true, verifyMsg: null, verifyErr: null });
    try {
      const res = await fetch(`${SERVER_URL}/api/ticket-orders/verify/${encodeURIComponent(ref)}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verify failed.");
      setAS(id, { verifying: false, verifyMsg: data.message || `Status: ${data.status}` });
      loadOrders();
    } catch (e) {
      setAS(id, { verifying: false, verifyErr: e.message });
    }
  };

  /* stats (unchanged logic) */
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    paid: orders.filter((o) => o.status === "PAID").length,
    issued: orders.filter((o) => o.status === "TICKET_ISSUED").length,
    checkedIn: orders.filter((o) => o.status === "CHECKED_IN").length,
    emailFailed: orders.filter((o) => o.emailStatus === "FAILED").length,
    revenue: orders
      .filter((o) => ["PAID", "TICKET_ISSUED", "CHECKED_IN"].includes(o.status))
      .reduce((sum, o) => sum + (o.ticketPrice || 0), 0),
  };

  return (
    <div className="min-h-screen bg-[#F2F3F7]">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">

        {/* Header — same ink navy surface as TicketOrders */}
        <div className="bg-[#161B33] rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Event Ticket View</h1>
            <p className="text-sm text-white/50 mt-0.5">Order detail for a specific event</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Event selector */}
            <div className="relative">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedId}
                onChange={(e) => { setSelectedId(e.target.value); setStatusFilter(""); }}
                disabled={eventsLoading}
                className="appearance-none border border-transparent rounded-xl px-4 py-2.5 pr-9 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B8860B]/60 min-w-[200px] bg-white text-[#161B33]"
              >
                {eventsLoading ? (
                  <option>Loading...</option>
                ) : events.length === 0 ? (
                  <option>No ticketed events</option>
                ) : (
                  events.map((ev) => (
                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                  ))
                )}
              </select>
            </div>
            <button
              onClick={loadOrders}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#B8860B] text-white rounded-xl text-sm hover:bg-[#a3760a] transition-colors font-semibold"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {orders.length > 0 && (
              <button
                onClick={() => exportCSV(orders, selectedEvent?.title)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-white/20 text-white rounded-xl text-sm hover:bg-white/10 transition-colors font-semibold"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Event info card */}
        {selectedEvent && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row gap-4">
            {selectedEvent.image && (
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-24 h-18 object-cover rounded-xl border border-slate-100 shrink-0"
              />
            )}
            <div className="flex-1 space-y-1 min-w-0">
              <h2 className="text-lg font-bold text-[#161B33] truncate">{selectedEvent.title}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedEvent.date).toLocaleDateString("en-KE", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
                {selectedEvent.venue && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedEvent.venue}</span>
                )}
                {selectedEvent.time && (
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedEvent.time}</span>
                )}
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Ticket className="w-3.5 h-3.5" /> KES {(selectedEvent.ticketPrice || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stats — revenue gets the dark card since it's the number that
            matters most; email-failed only shows up when it's a real problem */}
        <div className="flex flex-wrap gap-2.5">
          <StatCard label="Total orders" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Paid" value={stats.paid} />
          <StatCard label="Issued" value={stats.issued} />
          <StatCard label="Checked in" value={stats.checkedIn} />
          <StatCard label="Revenue" value={`KES ${stats.revenue.toLocaleString()}`} tone="dark" />
          {stats.emailFailed > 0 && (
            <StatCard label="Email failed" value={stats.emailFailed} tone="warn" />
          )}
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 font-semibold">Filter</span>
          {["", "PENDING", "PAID", "TICKET_ISSUED", "CHECKED_IN"].map((s) => {
            const cfg = s ? STATUS_CONFIG[s] : null;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${statusFilter === s
                  ? "bg-[#161B33] text-white border-[#161B33]"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {cfg?.label || "All"}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[780px]">
              <thead>
                <tr className="bg-[#161B33] text-white/60 text-xs border-b border-slate-100">
                  <th className="px-4 py-3 text-left font-semibold text-white">Ticket Holder</th>
                  <th className="px-4 py-3 text-left">Ticket Code</th>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Email</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin inline mr-2" /> Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-slate-400">
                      {selectedId ? "No orders for this event." : "Select an event above."}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const problem = getProblem(order);
                    const sc = STATUS_CONFIG[order.status] || { label: order.status, bg: "bg-slate-400", text: "text-white" };
                    const ec = EMAIL_CONFIG[order.emailStatus] || EMAIL_CONFIG.NOT_SENT;
                    const as = actionState[order._id] || {};

                    return (
                      <tr
                        key={order._id}
                        className={`hover:bg-[#F2F3F7] transition-colors ${problem ? "border-l-4 border-l-amber-500" : ""}`}
                      >
                        {/* Attendee */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#161B33] leading-tight">{order.fullName}</p>
                          <p className="text-xs text-slate-400">{order.email}</p>
                          <p className="text-xs text-slate-400">{order.phone}</p>
                          {problem && (
                            <p className="text-xs text-amber-700 flex items-center gap-1 mt-1 font-medium">
                              <AlertTriangle className="w-3 h-3" /> {problem}
                            </p>
                          )}
                          {(as.retryMsg || as.verifyMsg) && (
                            <p className="text-xs text-emerald-600 mt-0.5">{as.retryMsg || as.verifyMsg}</p>
                          )}
                          {(as.retryErr || as.verifyErr) && (
                            <p className="text-xs text-red-600 mt-0.5">{as.retryErr || as.verifyErr}</p>
                          )}
                        </td>

                        {/* Ticket Code — copyable for QR Check-in */}
                        <td className="px-4 py-3">
                          {order.ticketCode ? (
                            <div className="flex items-center">
                              <StubChip>{order.ticketCode}</StubChip>
                              <CopyButton text={order.ticketCode} />
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Order ID */}
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <StubChip>...{String(order._id).slice(-10)}</StubChip>
                            <CopyButton text={String(order._id)} />
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 text-right font-bold text-[#161B33] tabular-nums">
                          KES {(order.ticketPrice || 0).toLocaleString()}
                        </td>

                        {/* Status + Check-in time combined */}
                        <td className="px-4 py-3 text-center">
                          <Badge label={sc.label} bg={sc.bg} text={sc.text} />
                          {order.status === "CHECKED_IN" && order.checkedInAt && (
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(order.checkedInAt).toLocaleTimeString("en-KE", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-center">
                          <Badge label={ec.label} bg={ec.bg} text={ec.text} ring={ec.ring} />
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-KE")}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 justify-end flex-wrap">
                            {canRetry(order) && (
                              <ActionBtn
                                icon={RotateCcw}
                                label="Retry"
                                variant="green"
                                loading={as.retrying}
                                onClick={() => retry(order)}
                                title="Retry ticket issuance / email"
                              />
                            )}
                            {order.paystackReference && (
                              <ActionBtn
                                icon={ShieldCheck}
                                label="Verify"
                                variant="blue"
                                loading={as.verifying}
                                onClick={() => verify(order)}
                                title="Verify payment with Paystack"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTicketView;