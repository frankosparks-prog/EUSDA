import React, { useEffect, useState, useCallback } from "react";
import {
  ChevronDown,
  RefreshCw,
  Calendar,
  MapPin,
  Ticket,
  Clock,
  AlertTriangle,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const getToken = () => localStorage.getItem("adminToken");

const ORDER_STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  TICKET_ISSUED: "bg-green-100 text-green-800",
  CHECKED_IN: "bg-teal-100 text-teal-800",
};

const EMAIL_STATUS_STYLES = {
  NOT_SENT: "bg-gray-100 text-gray-500",
  SENT: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

const Badge = ({ label, style }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${style}`}>
    {label}
  </span>
);

const StatPill = ({ label, value, color }) => (
  <div className={`flex flex-col items-center px-5 py-3 rounded-xl ${color}`}>
    <span className="text-2xl font-extrabold">{value}</span>
    <span className="text-xs font-medium mt-0.5 opacity-80">{label}</span>
  </div>
);

function getProblem(order) {
  if (order.status === "PAID" && order.emailStatus === "FAILED")
    return "Paid — email failed";
  if (order.status === "PAID")
    return "Paid — ticket pending";
  if (order.status === "TICKET_ISSUED" && order.emailStatus === "FAILED")
    return "Issued — email failed";
  return null;
}

const EventTicketView = () => {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");


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


  const loadOrders = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: 200 });
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(
        `${SERVER_URL}/api/admin/ticketing/events/${selectedId}/orders?${params.toString()}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error("Failed to load orders.");
      const data = await res.json();
      setOrders(data.orders || []);


      const ev = events.find((e) => e._id === selectedId);
      setSelectedEvent(ev || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedId, statusFilter, events]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);


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
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Event Ticket View</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Deep dive into a specific event's orders
          </p>
        </div>
        <div className="flex items-center gap-3">

          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setStatusFilter("");
              }}
              disabled={eventsLoading}
              className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 min-w-[220px]"
            >
              {eventsLoading ? (
                <option>Loading events…</option>
              ) : events.length === 0 ? (
                <option>No ticketed events</option>
              ) : (
                events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title}
                  </option>
                ))
              )}
            </select>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">{error}</div>
      )}


      {selectedEvent && (
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col md:flex-row gap-4">
          {selectedEvent.image && (
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-32 h-24 object-cover rounded-xl border"
            />
          )}
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-extrabold text-gray-800">
              {selectedEvent.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(selectedEvent.date).toLocaleDateString("en-KE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {selectedEvent.venue && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {selectedEvent.venue}
                </span>
              )}
              {selectedEvent.time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {selectedEvent.time}
                </span>
              )}
              <span className="flex items-center gap-1 text-green-700 font-semibold">
                <Ticket className="w-4 h-4" />
                KES {(selectedEvent.ticketPrice || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}


      <div className="flex flex-wrap gap-3">
        <StatPill label="Total Orders" value={stats.total} color="bg-gray-100 text-gray-700" />
        <StatPill label="Pending" value={stats.pending} color="bg-yellow-50 text-yellow-700" />
        <StatPill label="Paid" value={stats.paid} color="bg-blue-50 text-blue-700" />
        <StatPill label="Issued" value={stats.issued} color="bg-green-50 text-green-700" />
        <StatPill label="Checked In" value={stats.checkedIn} color="bg-teal-50 text-teal-700" />
        <StatPill
          label="Revenue (KES)"
          value={stats.revenue.toLocaleString()}
          color="bg-emerald-50 text-emerald-700"
        />
        {stats.emailFailed > 0 && (
          <StatPill
            label="Email Failed"
            value={stats.emailFailed}
            color="bg-red-50 text-red-700"
          />
        )}
      </div>


      <div className="flex items-center gap-3">
        <p className="text-xs text-gray-500 font-semibold">Filter:</p>
        {["", "PENDING", "PAID", "TICKET_ISSUED", "CHECKED_IN"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${statusFilter === s
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>


      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Attendee</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Order Status</th>
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-left">Ticket Code</th>
                <th className="px-4 py-3 text-center">Check In</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No orders found for this event.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const problem = getProblem(order);
                  return (
                    <tr
                      key={order._id}
                      className={`hover:bg-gray-50 transition-colors ${problem ? "bg-amber-50/40" : ""
                        }`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{order.fullName}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                        {problem && (
                          <p className="text-xs text-amber-700 font-medium mt-0.5">
                            <AlertTriangle className="inline w-3 h-3 mr-0.5" />
                            {problem}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">
                        KES {(order.ticketPrice || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          label={order.status}
                          style={ORDER_STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          label={order.emailStatus || "NOT_SENT"}
                          style={EMAIL_STATUS_STYLES[order.emailStatus] || EMAIL_STATUS_STYLES.NOT_SENT}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {order.ticketCode ? (
                          <span className="font-mono text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                            {order.ticketCode.slice(0, 12)}…
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {order.status === "CHECKED_IN" ? (
                          <div>
                            <span className="text-teal-600 font-bold text-xs">In</span>
                            <p className="text-xs text-gray-400">
                              {order.checkedInAt
                                ? new Date(order.checkedInAt).toLocaleTimeString("en-KE", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                : ""}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-KE")}
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

export default EventTicketView;
