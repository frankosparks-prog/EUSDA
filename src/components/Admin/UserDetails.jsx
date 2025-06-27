import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import CircularProgress from "@mui/material/CircularProgress";
import { Users, Loader } from "lucide-react";
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

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const UsersDetails = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem("adminToken");
      if (!userToken) throw new Error("No token found. Please log in.");

      // Fetch total visitor count
      const visitorResponse = await fetch(
        `${SERVER_URL}/api/visitors/visitor-count`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!visitorResponse.ok) {
        const errorMessage = await visitorResponse.text();
        throw new Error(
          `Failed to fetch visitor count: ${errorMessage} (Status: ${visitorResponse.status})`
        );
      }

      const visitorData = await visitorResponse.json();
      setVisitorCount(visitorData.visitorCount || 0);

      // Fetch weekly stats for chart
      const chartResponse = await fetch(
        `${SERVER_URL}/api/visitors/weekly-stats`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!chartResponse.ok) {
        throw new Error("Failed to fetch weekly stats.");
      }

      const chartData = await chartResponse.json();
      setWeeklyData(chartData);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch the visitor count data when the component mounts

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setVisitorCount(0);
    setError("You have been logged out.");
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-4">
        <Loader className="animate-spin" size={40} />
        Loading visitors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        👥 Users Overview
      </h1>

      {/* Total Visitors Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between transition-transform transform hover:scale-[1.02]">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Total Visitors
          </h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {visitorCount}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded-full">
          <Users className="text-blue-500 w-10 h-10" />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Weekly Visitors
        </h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {/* <BarChart data={dummyData}> */}
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visitors" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-10 text-center">
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full text-lg shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default UsersDetails;
