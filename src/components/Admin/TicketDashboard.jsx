import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const getToken = () => localStorage.getItem("adminToken");

const fmt = (n) =>
  (n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 });


const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div
    className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} flex flex-col gap-1 hover:shadow-md transition-shadow`}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <p className="text-3xl font-extrabold text-gray-800">{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </div>
);


const ProblemBanner = ({ label, count, color }) => {
  if (!count) return null;
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${color}`}
    >
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>
        <strong>{count}</strong> {label}
      </span>
    </div>
  );
};

const TicketDashboard = () => {
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [dashRes, evtRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/admin/ticketing/dashboard`, { headers }),
        fetch(`${SERVER_URL}/api/admin/ticketing/events`, { headers }),
      ]);
      if (!dashRes.ok) throw new Error("Failed to load dashboard stats.");
      if (!evtRes.ok) throw new Error("Failed to load event stats.");
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


  const chartData = events.slice(0, 8).map((ev) => ({
    name:
      ev.title.length > 14 ? ev.title.slice(0, 14) + "…" : ev.title,
    Pending: ev.ticketStats?.pending || 0,
    Paid: ev.ticketStats?.paid || 0,
    Issued: ev.ticketStats?.ticketIssued || 0,
    "Checked In": ev.ticketStats?.checkedIn || 0,
  }));

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <RefreshCw className="w-8 h-8 animate-spin mr-3" />
        Loading dashboard…
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl text-sm">
        {error}
      </div>
    );

  const orders = data?.orders || {};
  const email = data?.email || {};
  const revenue = data?.revenue || {};
  const problems = data?.problems || {};
  const evData = data?.events || {};

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Ticket Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            System-wide ticketing overview
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Problem alerts */}
      {(problems.paidNotIssued > 0 || problems.issuedEmailFailed > 0) && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            ⚠️ Attention Required
          </p>
          <ProblemBanner
            label="orders paid but ticket not yet issued (email may have failed)"
            count={problems.paidNotIssued}
            color="bg-amber-50 text-amber-800 border border-amber-200"
          />
          <ProblemBanner
            label="tickets issued but email delivery failed"
            count={problems.issuedEmailFailed}
            color="bg-red-50 text-red-700 border border-red-200"
          />
        </div>
      )}

      {/* Summary cards — row 1: events + revenue */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Events"
          value={fmt(evData.total)}
          color="border-blue-500"
        />
        <StatCard
          icon={Ticket}
          label="Ticketed Events"
          value={fmt(evData.ticketed)}
          color="border-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`KES ${fmt(revenue.total)}`}
          color="border-emerald-500"
          sub="Paid + Issued + Checked In"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={fmt(orders.total)}
          color="border-gray-400"
        />
      </div>

      {/* Summary cards — row 2: order lifecycle */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Pending Payment"
          value={fmt(orders.pending)}
          color="border-yellow-400"
        />
        <StatCard
          icon={CheckCircle2}
          label="Payment Confirmed"
          value={fmt(orders.paid)}
          color="border-blue-400"
          sub="Ticket generation in progress"
        />
        <StatCard
          icon={Ticket}
          label="Tickets Issued"
          value={fmt(orders.ticketIssued)}
          color="border-green-500"
        />
        <StatCard
          icon={QrCode}
          label="Checked In"
          value={fmt(orders.checkedIn)}
          color="border-teal-500"
        />
      </div>

      {/* Summary cards — row 3: email */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-md">
        <StatCard
          icon={Mail}
          label="Emails Sent"
          value={fmt(email.sent)}
          color="border-green-400"
        />
        <StatCard
          icon={MailX}
          label="Email Failures"
          value={fmt(email.failed)}
          color="border-red-500"
        />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
            Orders by Status — Ticketed Events
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Pending" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Paid" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Issued" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="Checked In"
                fill="#2dd4bf"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Event table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
            Ticketed Events Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-center">Orders</th>
                <th className="px-4 py-3 text-center">Pending</th>
                <th className="px-4 py-3 text-center">Paid</th>
                <th className="px-4 py-3 text-center">Issued</th>
                <th className="px-4 py-3 text-center">Checked In</th>
                <th className="px-4 py-3 text-right">Revenue (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-gray-400"
                  >
                    No ticketed events found.
                  </td>
                </tr>
              ) : (
                events.map((ev) => {
                  const s = ev.ticketStats || {};
                  return (
                    <tr
                      key={ev._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-800">
                          {ev.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(ev.date).toLocaleDateString("en-KE")} •
                          KES {fmt(ev.ticketPrice)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-700">
                        {s.totalOrders || 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-yellow-600 font-semibold">
                          {s.pending || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-blue-600 font-semibold">
                          {s.paid || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-green-600 font-semibold">
                          {s.ticketIssued || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-teal-600 font-semibold">
                          {s.checkedIn || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {fmt(s.revenue || 0)}
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
  );
};

export default TicketDashboard;
