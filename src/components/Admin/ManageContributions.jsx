import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function ManageContributions() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [status, setStatus] = useState("All");
  const [purpose, setPurpose] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchContributions();
  }, []);

  useEffect(() => {
    filterData();
  }, [status, purpose, data]);

  const fetchContributions = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/mpesa/transactions`);
      setData(res.data);
    } catch (err) {
      console.error("Error loading contributions:", err);
    }
  };

  const filterData = () => {
    let result = [...data];

    if (status !== "All")
      result = result.filter((item) => item.status === status);
    if (purpose !== "All")
      result = result.filter((item) => item.purpose === purpose);

    if (startDate) {
      const from = new Date(startDate);
      result = result.filter((item) => new Date(item.createdAt) >= from);
    }

    if (endDate) {
      const to = new Date(endDate);
      result = result.filter((item) => new Date(item.createdAt) <= to);
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const header = ["Phone", "Amount", "Purpose", "Status", "Date"];
    const rows = filtered.map((txn) => [
      txn.phone,
      txn.amount,
      txn.purpose,
      txn.status,
      format(new Date(txn.createdAt), "yyyy-MM-dd HH:mm"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contributions.csv";
    link.click();
  };

  const totalAmount = filtered.reduce((acc, curr) => acc + curr.amount, 0);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`${SERVER_URL}/api/mpesa/transactions/${id}`);
        fetchContributions();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  function handleEdit() {
    window.alert("Edit functionality is not implemented yet. Coming soon!");
  }
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-green-800">
          Manage Contributions
        </h2>
        <button
          onClick={exportCSV}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Total Contributions: {filtered.length} | Total Amount:{" "}
        <span className="font-semibold text-green-700">
          KES {totalAmount.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>

        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm"
        >
          <option value="All">All Purposes</option>
          <option value="Tithe">Tithe</option>
          <option value="Offering">Offering</option>
          <option value="Thanksgiving">Thanksgiving</option>
          <option value="Building Fund">CDC</option>
          <option value="Special Giving">Special Giving</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-100 text-green-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((txn, i) => (
              <tr
                key={txn._id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-3">{txn.phone}</td>
                <td className="px-4 py-3">KES {txn.amount}</td>
                <td className="px-4 py-3">{txn.purpose}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      txn.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : txn.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {format(new Date(txn.createdAt), "dd MMM yyyy, h:mm a")}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button title="Edit" onClick={() => handleEdit()}>
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button onClick={() => handleDelete(txn._id)} title="Delete">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No contributions found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === num
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageContributions;
