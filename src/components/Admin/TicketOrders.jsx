import React, { useEffect, useState, useCallback } from "react";
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const getToken = () => localStorage.getItem("adminToken");


const ORDER_STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  TICKET_ISSUED: "bg-green-100 text-green-800",
  CHECKED_IN: "bg-teal-100 text-teal-800",
};

const EMAIL_STATUS_STYLES = {
  NOT_SENT: "bg-gray-100 text-gray-600",
  SENT: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

const Badge = ({ label, style }) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${style}`}
  >
    {label}
  </span>
);


function getProblem(order) {
  if (order.status === "PENDING") return null;
  if (order.status === "PAID" && order.emailStatus === "FAILED")
    return "Payment confirmed but email delivery failed";
  if (order.status === "PAID")
    return "Payment confirmed — ticket not yet issued";
  if (order.status === "TICKET_ISSUED" && order.emailStatus === "FAILED")
    return "Ticket issued but email delivery failed";
  return null;
}

const LIMIT = 50;

const TicketOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedEmail, setAppliedEmail] = useState("");

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: p,
          limit: LIMIT,
        });
        if (appliedSearch) params.set("search", appliedSearch);
        if (appliedStatus) params.set("status", appliedStatus);
        if (appliedEmail) params.set("emailStatus", appliedEmail);

        const res = await fetch(
          `${SERVER_URL}/api/admin/ticketing/orders?${params.toString()}`,
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

  useEffect(() => {
    load(1);
  }, [load]);

  const applyFilters = () => {
    setAppliedSearch(search);
    setAppliedStatus(statusFilter);
    setAppliedEmail(emailFilter);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setEmailFilter("");
    setAppliedSearch("");
    setAppliedStatus("");
    setAppliedEmail("");
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">All Ticket Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {total.toLocaleString()} total orders
          </p>
        </div>
        <button
          onClick={() => load(page)}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-end">
        {/* Search box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, phone, ticket code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Order status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid (Not Issued)</option>
          <option value="TICKET_ISSUED">Ticket Issued</option>
          <option value="CHECKED_IN">Checked In</option>
        </select>

        {/* Email status filter */}
        <select
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Email Statuses</option>
          <option value="NOT_SENT">Email Not Sent</option>
          <option value="SENT">Email Sent</option>
          <option value="FAILED">Email Failed</option>
        </select>

        <button
          onClick={applyFilters}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          <Filter className="w-4 h-4" /> Apply
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Attendee</th>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Order Status</th>
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-left">Ticket Code</th>
                <th className="px-4 py-3 text-center">Check-in</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No orders found.
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
                      {/* Attendee */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 leading-tight">
                          {order.fullName}
                        </p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                        {problem && (
                          <p className="text-xs text-amber-700 mt-0.5 font-medium">
                            ⚠️ {problem}
                          </p>
                        )}
                      </td>

                      {/* Event */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-700 leading-tight">
                          {order.event?.title || "—"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.event?.date
                            ? new Date(order.event.date).toLocaleDateString(
                              "en-KE"
                            )
                            : ""}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">
                        KES {(order.ticketPrice || 0).toLocaleString()}
                      </td>

                      {/* Order status */}
                      <td className="px-4 py-3 text-center">
                        <Badge
                          label={order.status}
                          style={
                            ORDER_STATUS_STYLES[order.status] ||
                            "bg-gray-100 text-gray-600"
                          }
                        />
                      </td>

                      {/* Email status */}
                      <td className="px-4 py-3 text-center">
                        <Badge
                          label={order.emailStatus || "NOT_SENT"}
                          style={
                            EMAIL_STATUS_STYLES[order.emailStatus] ||
                            EMAIL_STATUS_STYLES.NOT_SENT
                          }
                        />
                      </td>

                      {/* Ticket code */}
                      <td className="px-4 py-3">
                        {order.ticketCode ? (
                          <span className="font-mono text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                            {order.ticketCode.slice(0, 12)}…
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Check-in */}
                      <td className="px-4 py-3 text-center">
                        {order.status === "CHECKED_IN" ? (
                          <div>
                            <span className="text-teal-600 font-bold text-xs">
                              In
                            </span>
                            <p className="text-xs text-gray-400">
                              {order.checkedInAt
                                ? new Date(
                                  order.checkedInAt
                                ).toLocaleTimeString("en-KE", {
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

                      {/* Created date */}
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-KE")}
                        <br />
                        {new Date(order.createdAt).toLocaleTimeString("en-KE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages} ({total.toLocaleString()} total)
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => load(page + 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketOrders;
