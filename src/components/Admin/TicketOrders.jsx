import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const getToken = () => localStorage.getItem("adminToken");

/* ─── Constants ───
   Design system: "ticket stub" — ink navy for structure/authority,
   a single brass accent for primary action, solid (not pastel) status
   colors so state is legible at a glance. Order ID / Ref use a
   dashed-outline chip to evoke a torn ticket edge — the one deliberate
   motif, used consistently instead of decorating everything. */
const LIMIT = 50;

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

/* ─── Helpers (unchanged logic) ─── */
function getProblem(order) {
  if (order.status === "PENDING") return null;
  if (order.status === "PAID" && order.emailStatus === "FAILED") return "Payment confirmed — email failed";
  if (order.status === "PAID") return "Payment confirmed — ticket pending";
  if (order.status === "TICKET_ISSUED" && order.emailStatus === "FAILED") return "Ticket issued — email failed";
  return null;
}

function canRetry(order) {
  return order.status === "PAID" || order.emailStatus === "FAILED";
}

/* ─── Small components ─── */
const Badge = ({ label, bg, text, ring }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap ${bg} ${text} ${ring || ""}`}>
    {label}
  </span>
);

/* Copy affordance for IDs/refs — brass on rest, ink on hover, not gray */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      className={`ml-1 shrink-0 transition-colors ${copied ? "text-emerald-600" : "text-[#B8860B] hover:text-[#161B33]"}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

/* Dashed "stub" chip for Order ID / Payment Ref — the one recurring motif */
const StubChip = ({ children }) => (
  <span className="font-mono text-[11px] tracking-tight text-[#161B33] bg-[#F2F3F7] border border-dashed border-[#B8860B]/50 px-2 py-1 rounded">
    {children}
  </span>
);

/* ─── Action button ─── */
const ActionBtn = ({ onClick, loading, icon: Icon, label, variant = "default", disabled = false, title }) => {
  const base = "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap";
  const variants = {
    default: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    green: "bg-[#161B33] text-white hover:bg-[#232a52]",
    blue: "bg-white text-[#161B33] border border-[#161B33]/20 hover:bg-[#F2F3F7]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`${base} ${variants[variant]}`}
    >
      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
};

/* ─── Toast ─── */
const InlineToast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const cfg = type === "error"
    ? "bg-red-50 border-red-200 text-red-700"
    : "bg-emerald-50 border-emerald-200 text-emerald-700";
  return (
    <div className={`flex items-start gap-2 text-xs px-4 py-3 rounded-xl border ${cfg}`}>
      {type === "error" ? <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
      <p className="flex-1">{msg}</p>
      <button onClick={onClose} className="shrink-0"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
};

/* ─── Per-row actions hook (unchanged logic) ─── */
function useOrderActions(load, page) {
  const [actionState, setActionState] = useState({}); // { [orderId]: { retrying, verifying, retryMsg, verifyMsg } }

  const setState = (id, patch) =>
    setActionState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const retry = async (order) => {
    const id = order._id;
    setState(id, { retrying: true, retryMsg: null, retryErr: null });
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/ticketing/orders/${id}/retry`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry failed.");
      setState(id, { retrying: false, retryMsg: "Retry complete." });
      load(page);
    } catch (e) {
      setState(id, { retrying: false, retryErr: e.message });
    }
  };

  const verify = async (order) => {
    const id = order._id;
    const ref = order.paystackReference;
    if (!ref) return;
    setState(id, { verifying: true, verifyMsg: null, verifyErr: null });
    try {
      const res = await fetch(`${SERVER_URL}/api/ticket-orders/verify/${encodeURIComponent(ref)}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verify failed.");
      setState(id, {
        verifying: false,
        verifyMsg: data.message || `Status: ${data.status}`,
      });
      load(page);
    } catch (e) {
      setState(id, { verifying: false, verifyErr: e.message });
    }
  };

  return { actionState, retry, verify };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
const TicketOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedEmail, setAppliedEmail] = useState("");

  /* manual retry panel */
  const [manualId, setManualId] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualMsg, setManualMsg] = useState(null);
  const [manualErr, setManualErr] = useState(null);

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: p, limit: LIMIT });
        if (appliedSearch) params.set("search", appliedSearch);
        if (appliedStatus) params.set("status", appliedStatus);
        if (appliedEmail) params.set("emailStatus", appliedEmail);

        const res = await fetch(
          `${SERVER_URL}/api/admin/ticketing/orders?${params}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (!res.ok) throw new Error("Failed to load orders.");
        const data = await res.json();
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setPage(p);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [appliedSearch, appliedStatus, appliedEmail]
  );

  useEffect(() => { load(1); }, [load]);

  const applyFilters = () => {
    setAppliedSearch(search);
    setAppliedStatus(statusFilter);
    setAppliedEmail(emailFilter);
  };

  const clearFilters = () => {
    setSearch(""); setStatusFilter(""); setEmailFilter("");
    setAppliedSearch(""); setAppliedStatus(""); setAppliedEmail("");
  };

  const { actionState, retry, verify } = useOrderActions(load, page);

  const totalPages = Math.ceil(total / LIMIT);

  /* manual retry */
  const handleManualRetry = async () => {
    const id = manualId.trim();
    if (!id) return;
    setManualLoading(true);
    setManualMsg(null);
    setManualErr(null);
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/ticketing/orders/${id}/retry`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry failed.");
      setManualMsg(data.message || "Retry complete.");
      setManualId("");
      load(page);
    } catch (e) {
      setManualErr(e.message);
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F7]">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">

        {/* Header — ink navy, the one dark surface on the page */}
        <div className="bg-[#161B33] rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">All Ticket Orders</h1>
            <p className="text-sm text-white/50 mt-0.5">{total.toLocaleString()} orders on file</p>
          </div>
          <button
            onClick={() => load(page)}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-[#B8860B] text-white rounded-xl hover:bg-[#a3760a] transition-colors font-semibold shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Name, email, phone, ticket code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 focus:border-[#B8860B]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 bg-white"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="TICKET_ISSUED">Issued</option>
              <option value="CHECKED_IN">Checked in</option>
            </select>
            <select
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 bg-white"
            >
              <option value="">All email statuses</option>
              <option value="NOT_SENT">Not sent</option>
              <option value="SENT">Sent</option>
              <option value="FAILED">Failed</option>
            </select>
            <button
              onClick={applyFilters}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#161B33] text-white rounded-xl text-sm hover:bg-[#232a52] transition-colors font-semibold"
            >
              <Filter className="w-4 h-4" /> Apply
            </button>
            {(appliedSearch || appliedStatus || appliedEmail) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Manual retry panel — dashed edge ties it to the "stub" motif */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-[#B8860B]/40 shadow-sm p-4 space-y-3">
          <p className="text-sm font-semibold text-[#161B33] flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-[#B8860B]" /> Manual retry by Order ID
          </p>
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Paste full Order ID..."
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualRetry()}
              className="flex-1 min-w-[220px] border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 focus:border-[#B8860B]"
            />
            <button
              onClick={handleManualRetry}
              disabled={!manualId.trim() || manualLoading}
              className="flex items-center gap-2 px-5 py-2 bg-[#B8860B] text-white rounded-xl text-sm font-semibold hover:bg-[#a3760a] transition-colors disabled:opacity-50"
            >
              {manualLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              Retry
            </button>
          </div>
          {manualMsg && <InlineToast msg={manualMsg} type="success" onClose={() => setManualMsg(null)} />}
          {manualErr && <InlineToast msg={manualErr} type="error" onClose={() => setManualErr(null)} />}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Table — desktop */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1080px]">
              <thead>
                <tr className="bg-[#161B33] text-white/60 text-xs border-b border-slate-100">
                  <th className="px-4 py-3 text-left font-semibold text-white">Ticket Holder</th>
                  <th className="px-4 py-3 text-left">Event</th>
                  <th className="px-4 py-3 text-left">Ticket Code</th>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Payment ref</th>
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
                    <td colSpan={10} className="py-14 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin inline mr-2" /> Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-14 text-center text-slate-400">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const problem = getProblem(order);
                    const sc = STATUS_CONFIG[order.status] || { label: order.status, bg: "bg-slate-400", text: "text-white" };
                    const ec = EMAIL_CONFIG[order.emailStatus] || EMAIL_CONFIG.NOT_SENT;
                    const as = actionState[order._id] || {};
                    const shortId = String(order._id).slice(-10);

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
                            <p className="text-xs text-amber-700 mt-1 flex items-center gap-1 font-medium">
                              <AlertTriangle className="w-3 h-3" /> {problem}
                            </p>
                          )}
                          {as.retryMsg && <p className="text-xs text-emerald-600 mt-0.5">{as.retryMsg}</p>}
                          {as.retryErr && <p className="text-xs text-red-600 mt-0.5">{as.retryErr}</p>}
                          {as.verifyMsg && <p className="text-xs text-[#2F5EA8] mt-0.5">{as.verifyMsg}</p>}
                          {as.verifyErr && <p className="text-xs text-red-600 mt-0.5">{as.verifyErr}</p>}
                        </td>

                        {/* Event — clean title without redundant date */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-700 leading-tight">{order.event?.title || "—"}</p>
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
                            <StubChip>...{shortId}</StubChip>
                            <CopyButton text={String(order._id)} />
                          </div>
                        </td>

                        {/* Payment ref */}
                        <td className="px-4 py-3">
                          {order.paystackReference ? (
                            <div className="flex items-center">
                              <StubChip>{order.paystackReference.slice(0, 18)}...</StubChip>
                              <CopyButton text={order.paystackReference} />
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 text-right font-bold text-[#161B33] tabular-nums">
                          KES {(order.ticketPrice || 0).toLocaleString()}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center">
                          <Badge label={sc.label} bg={sc.bg} text={sc.text} />
                          {order.status === "CHECKED_IN" && order.checkedInAt && (
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(order.checkedInAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-center">
                          <Badge label={ec.label} bg={ec.bg} text={ec.text} ring={ec.ring} />
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-KE")}<br />
                          <span className="text-slate-400">
                            {new Date(order.createdAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
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
                                title="Retry ticket issuance and email delivery"
                              />
                            )}
                            {order.paystackReference && (
                              <ActionBtn
                                icon={ShieldCheck}
                                label="Verify"
                                variant="blue"
                                loading={as.verifying}
                                onClick={() => verify(order)}
                                title="Verify payment status with Paystack"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Page {page} of {totalPages} &middot; {total.toLocaleString()} orders
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => load(page - 1)}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => load(page + 1)}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card list — mobile. Dashed divider between info and actions
            echoes a ticket stub tear line. */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin inline mr-2" /> Loading...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No orders found.</div>
          ) : (
            orders.map((order) => {
              const problem = getProblem(order);
              const sc = STATUS_CONFIG[order.status] || { label: order.status, bg: "bg-slate-400", text: "text-white" };
              const ec = EMAIL_CONFIG[order.emailStatus] || EMAIL_CONFIG.NOT_SENT;
              const as = actionState[order._id] || {};
              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${problem ? "border-amber-300" : "border-slate-200"}`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#161B33] truncate">{order.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{order.email}</p>
                        <p className="text-xs text-slate-400">{order.phone}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge label={sc.label} bg={sc.bg} text={sc.text} />
                        <Badge label={ec.label} bg={ec.bg} text={ec.text} ring={ec.ring} />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Event</span>
                        <span className="font-medium text-slate-700 truncate max-w-[60%]">{order.event?.title || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Amount</span>
                        <span className="font-bold text-[#161B33] tabular-nums">KES {(order.ticketPrice || 0).toLocaleString()}</span>
                      </div>
                      {order.ticketCode && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Ticket Code</span>
                          <div className="flex items-center">
                            <StubChip>{order.ticketCode}</StubChip>
                            <CopyButton text={order.ticketCode} />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Order ID</span>
                        <div className="flex items-center">
                          <StubChip>...{String(order._id).slice(-10)}</StubChip>
                          <CopyButton text={String(order._id)} />
                        </div>
                      </div>
                      {order.paystackReference && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Ref</span>
                          <div className="flex items-center">
                            <StubChip>{order.paystackReference.slice(0, 16)}...</StubChip>
                            <CopyButton text={order.paystackReference} />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Created</span>
                        <span className="text-slate-600">{new Date(order.createdAt).toLocaleDateString("en-KE")}</span>
                      </div>
                    </div>

                    {problem && (
                      <p className="text-xs text-amber-700 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3 h-3" /> {problem}
                      </p>
                    )}
                    {(as.retryMsg || as.verifyMsg) && (
                      <p className="text-xs text-emerald-600">{as.retryMsg || as.verifyMsg}</p>
                    )}
                    {(as.retryErr || as.verifyErr) && (
                      <p className="text-xs text-red-600">{as.retryErr || as.verifyErr}</p>
                    )}
                  </div>

                  {(canRetry(order) || order.paystackReference) && (
                    <div className="flex gap-2 px-4 py-3 border-t-2 border-dashed border-slate-200 bg-[#F8F9FB]">
                      {canRetry(order) && (
                        <ActionBtn
                          icon={RotateCcw}
                          label="Retry"
                          variant="green"
                          loading={as.retrying}
                          onClick={() => retry(order)}
                        />
                      )}
                      {order.paystackReference && (
                        <ActionBtn
                          icon={ShieldCheck}
                          label="Verify"
                          variant="blue"
                          loading={as.verifying}
                          onClick={() => verify(order)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Mobile pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="p-2 rounded-xl border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => load(page + 1)}
                className="p-2 rounded-xl border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketOrders;