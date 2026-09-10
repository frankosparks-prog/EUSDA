import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Ticket,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Mail,
  MailX,
  QrCode,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const getToken = () => localStorage.getItem("adminToken");
const fmt = (n) => (n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 });

/* ─── Color Palette aligned with Ticket Stub Design Language ─── */
const PALETTE = {
  navy: "#161B33",
  navyHover: "#232a52",
  brass: "#B8860B",
  brassLight: "#d4a017",
  emerald: "#059669",
  blue: "#2F5EA8",
  amber: "#f59e0b",
  red: "#dc2626",
  slateBg: "#F2F3F7",
};

const PIE_COLORS = {
  Pending: PALETTE.amber,
  Paid: PALETTE.blue,
  Issued: PALETTE.navy,
  "Checked In": PALETTE.emerald,
};

/* ─── Dashed "Stub" Chip ─── */
const StubChip = ({ children }) => (
  <span className="font-mono text-[11px] tracking-tight text-[#161B33] bg-[#F2F3F7] border border-dashed border-[#B8860B]/50 px-2 py-0.5 rounded">
    {children}
  </span>
);

/* ─── Standard Metric Stat Card ─── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  accent = PALETTE.brass,
  badge,
}) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between gap-2 hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}15` }}
      >
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl sm:text-3xl font-bold text-[#161B33] tracking-tight tabular-nums">
          {value}
        </p>
        {badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {badge}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  </div>
);

/* ─── Hero Revenue Card ─── */
const HeroCard = ({ value, sub, totalSales }) => (
  <div className="relative rounded-2xl p-6 text-white col-span-2 md:col-span-1 flex flex-col justify-between overflow-hidden shadow-md border border-slate-700/60 bg-gradient-to-br from-[#161B33] via-[#1c2242] to-[#242c54]">
    {/* Decorative Ticket Stub Border motif on right edge */}
    <div className="absolute right-0 top-0 bottom-0 w-3 border-l-2 border-dashed border-white/20" />
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#B8860B] animate-pulse" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">
          Confirmed Revenue
        </p>
      </div>
      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
        <TrendingUp className="w-4 h-4 text-[#B8860B]" />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
        {value}
      </p>
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-white/60">{sub}</p>
        {totalSales > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/10">
            {totalSales} sold
          </span>
        )}
      </div>
    </div>
  </div>
);

/* ─── Attention Problem Banner with dashed stub accent ─── */
const ProblemBanner = ({ label, count, onClick, type = "warn" }) => {
  if (!count) return null;
  const isRed = type === "error";
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
        isRed
          ? "bg-red-50/70 border-red-300 hover:bg-red-50 text-red-900"
          : "bg-amber-50/70 border-[#B8860B]/50 hover:bg-amber-50 text-amber-950"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            isRed ? "bg-red-600 text-white" : "bg-amber-500 text-white"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm font-medium truncate">
          <strong className="font-bold">{count}</strong> {label}
        </p>
      </div>
      <span
        className={`text-xs font-semibold flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg transition-colors ${
          isRed
            ? "bg-red-600 text-white group-hover:bg-red-700"
            : "bg-[#161B33] text-white group-hover:bg-[#232a52]"
        }`}
      >
        Resolve <ArrowRight className="w-3 h-3" />
      </span>
    </div>
  );
};

/* ─── Tooltip Styling ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#161B33] text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 space-y-1">
      {label && <p className="font-bold text-white/80 border-b border-white/10 pb-1 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
            {p.name}:
          </span>
          <strong className="font-bold text-white tabular-nums">{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
const TicketDashboard = () => {
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [dashRes, evtRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/admin/ticketing/dashboard`, { headers }),
        fetch(`${SERVER_URL}/api/admin/ticketing/events`, { headers }),
      ]);
      if (!dashRes.ok) throw new Error("Failed to load dashboard statistics.");
      if (!evtRes.ok) throw new Error("Failed to load event ticketing details.");
      const [dash, evts] = await Promise.all([dashRes.json(), evtRes.json()]);
      setData(dash);
      setEvents(evts.filter((e) => e.ticketed));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F2F3F7] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-[#B8860B] animate-spin" />
          <p className="text-sm font-semibold text-[#161B33]">Loading ticket analytics...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#F2F3F7] p-6">
        <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl text-sm flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-2 flex-1">
            <p className="font-bold">Failed to load ticketing overview</p>
            <p className="text-xs text-red-700">{error}</p>
            <button
              onClick={load}
              className="mt-2 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );

  const orders = data?.orders || {};
  const email = data?.email || {};
  const revenue = data?.revenue || {};
  const problems = data?.problems || {};
  const evData = data?.events || {};

  /* Chart data */
  const barData = events.slice(0, 8).map((ev) => ({
    name: ev.title.length > 13 ? ev.title.slice(0, 13) + "…" : ev.title,
    Pending: ev.ticketStats?.pending || 0,
    Paid: ev.ticketStats?.paid || 0,
    Issued: ev.ticketStats?.ticketIssued || 0,
    "Checked In": ev.ticketStats?.checkedIn || 0,
  }));

  const pieData = [
    { name: "Pending", value: orders.pending || 0 },
    { name: "Paid", value: orders.paid || 0 },
    { name: "Issued", value: orders.ticketIssued || 0 },
    { name: "Checked In", value: orders.checkedIn || 0 },
  ].filter((d) => d.value > 0);

  const totalLifecycleOrders =
    (orders.pending || 0) + (orders.paid || 0) + (orders.ticketIssued || 0) + (orders.checkedIn || 0);

  const hasProblems = problems.paidNotIssued > 0 || problems.issuedEmailFailed > 0;

  return (
    <div className="min-h-screen bg-[#F2F3F7]">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

        {/* ─── Header: Ink Navy Banner ─── */}
        <div className="bg-[#161B33] rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Ticket Dashboard</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#B8860B]/20 text-[#d4a017] border border-[#B8860B]/40">
                Ticketing Overview
              </span>
            </div>
            <p className="text-sm text-white/50 mt-1">
              System-wide revenue, order lifecycle & live sales analytics
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate("/admin/ticket-orders")}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-semibold transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>All Orders</span>
            </button>
            <button
              onClick={() => navigate("/admin/qr-checkin")}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-semibold transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>QR Scanner</span>
            </button>
            <button
              onClick={load}
              className="flex items-center gap-2 text-xs sm:text-sm px-4 py-2 bg-[#B8860B] text-white rounded-xl hover:bg-[#a3760a] transition-colors font-semibold shadow-sm shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* ─── Attention Required / Problem Banners ─── */}
        {hasProblems ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Action Required
              </p>
              <span className="text-xs text-slate-400">Needs immediate administrative review</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <ProblemBanner
                label="orders paid but ticket issuance incomplete"
                count={problems.paidNotIssued}
                type="warn"
                onClick={() => navigate("/admin/ticket-orders")}
              />
              <ProblemBanner
                label="tickets generated but email delivery failed"
                count={problems.issuedEmailFailed}
                type="error"
                onClick={() => navigate("/admin/ticket-orders")}
              />
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All ticketing pipelines are healthy — no stuck orders or delivery failures detected.</span>
            </div>
            <span className="hidden sm:inline font-mono text-[11px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
              Status: OK
            </span>
          </div>
        )}

        {/* ─── High-Level Summary Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HeroCard
            value={`KES ${fmt(revenue.total)}`}
            sub="Confirmed paid, issued & verified"
            totalSales={orders.ticketIssued + orders.checkedIn}
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={fmt(orders.total)}
            sub="All initiated bookings"
            accent={PALETTE.blue}
            badge="Orders"
          />
          <StatCard
            icon={Calendar}
            label="Total Events"
            value={fmt(evData.total)}
            sub="Configured in calendar"
            accent="#6366f1"
          />
          <StatCard
            icon={Ticket}
            label="Ticketed Events"
            value={fmt(evData.ticketed)}
            sub="Paid ticketing active"
            accent={PALETTE.brass}
            badge="Ticketed"
          />
        </div>

        {/* ─── Order Lifecycle Funnel Cards ─── */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Order Lifecycle Breakdown
            </p>
            <span className="text-xs text-slate-400">From checkout to venue check-in</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending
                </span>
                <span className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-bold text-amber-600 tabular-nums">
                  {fmt(orders.pending)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Awaiting checkout payment</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Paid
                </span>
                <span className="w-6 h-6 rounded-md bg-[#2F5EA8] text-white flex items-center justify-center text-xs font-bold">
                  <Check className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-bold text-[#2F5EA8] tabular-nums">
                  {fmt(orders.paid)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Payment verified & processing</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Issued
                </span>
                <span className="w-6 h-6 rounded-md bg-[#161B33] text-white flex items-center justify-center text-xs font-bold">
                  <Ticket className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-bold text-[#161B33] tabular-nums">
                  {fmt(orders.ticketIssued)}
                </p>
                <p className="text-xs text-slate-400 mt-1">QR ticket generated & ready</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Checked In
                </span>
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">
                  {fmt(orders.checkedIn)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Admitted at event entrance</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Delivery & Email Stats Chips ─── */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Emails Sent</p>
              <p className="text-sm font-bold text-[#161B33] tabular-nums">{fmt(email.sent)} delivered</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <MailX className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Failures</p>
              <p className="text-sm font-bold text-[#161B33] tabular-nums">{fmt(email.failed)} failed</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center ml-auto">
            <button
              onClick={() => navigate("/admin/ticket-events")}
              className="text-xs font-semibold text-[#161B33] hover:text-[#B8860B] flex items-center gap-1 transition-colors"
            >
              <span>Manage Events deep-dive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ─── Visual Analytics (Donut & Bar charts) ─── */}
        {(pieData.length > 0 || barData.length > 0) && (
          <div className="grid md:grid-cols-3 gap-5">
            {/* Donut Chart: Status Mix */}
            {pieData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status Distribution
                    </p>
                    <span className="text-[11px] font-medium text-slate-400">
                      {totalLifecycleOrders} total
                    </span>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={PIE_COLORS[entry.name] || "#94a3b8"} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ background: PIE_COLORS[d.name] }}
                      />
                      <span className="text-xs text-slate-600 font-medium truncate">
                        {d.name}: <strong className="text-[#161B33]">{d.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bar Chart: Orders per Event */}
            {barData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Orders by Event (Top Active)
                    </p>
                    <span className="text-xs text-slate-400">Volume by lifecycle status</span>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          axisLine={{ stroke: "#e2e8f0" }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                          formatter={(value) => <span className="text-slate-600 text-xs font-medium">{value}</span>}
                        />
                        <Bar dataKey="Pending" fill={PALETTE.amber} radius={[3, 3, 0, 0]} maxBarSize={16} />
                        <Bar dataKey="Paid" fill={PALETTE.blue} radius={[3, 3, 0, 0]} maxBarSize={16} />
                        <Bar dataKey="Issued" fill={PALETTE.navy} radius={[3, 3, 0, 0]} maxBarSize={16} />
                        <Bar dataKey="Checked In" fill={PALETTE.emerald} radius={[3, 3, 0, 0]} maxBarSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Ticketed Events Performance Table ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 bg-[#161B33] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#B8860B]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                Ticketed Events ({events.length})
              </p>
            </div>
            <p className="text-xs text-white/50">Click row to open event view</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-100">
                  <th className="px-5 py-3 text-left font-semibold text-[#161B33]">Event</th>
                  <th className="px-4 py-3 text-center font-semibold">Total Orders</th>
                  <th className="px-4 py-3 text-center font-semibold">Pending</th>
                  <th className="px-4 py-3 text-center font-semibold">Paid</th>
                  <th className="px-4 py-3 text-center font-semibold">Issued</th>
                  <th className="px-4 py-3 text-center font-semibold">Checked In</th>
                  <th className="px-5 py-3 text-right font-semibold text-[#161B33]">Revenue</th>
                  <th className="px-4 py-3 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-sm">
                      No ticketed events configured.
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => {
                    const s = ev.ticketStats || {};
                    const hasAttention = (s.paid || 0) > 0 || (s.emailFailed || 0) > 0;
                    return (
                      <tr
                        key={ev._id}
                        className="hover:bg-[#F2F3F7] transition-colors cursor-pointer group"
                        onClick={() => navigate("/admin/ticket-events")}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {hasAttention && (
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-[#161B33] leading-tight group-hover:text-[#B8860B] transition-colors truncate">
                                {ev.title}
                              </p>
                              <div className="mt-1">
                                <StubChip>KES {fmt(ev.ticketPrice)}</StubChip>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-[#161B33] tabular-nums">
                          {s.totalOrders || 0}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500 text-white shadow-xs">
                            {s.pending || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#2F5EA8] text-white shadow-xs">
                            {s.paid || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#161B33] text-white shadow-xs">
                            {s.ticketIssued || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-600 text-white shadow-xs">
                            {s.checkedIn || 0}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#161B33] tabular-nums">
                          KES {fmt(s.revenue || 0)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#161B33] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors ml-auto">
                            <ArrowRight className="w-3.5 h-3.5" />
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

export default TicketDashboard;

