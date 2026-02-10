import React, { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import {
  Users,
  MailCheck,
  BookOpenText,
  MessageCircle,
  GalleryThumbnails,
  CreditCard,
  Calendar,
  Mic,
  BookOpen,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  return (
    <div className="flex h-screen font-inter text-white">

      {/* ─────────── Sidebar ─────────── */}
      <aside
        className={`bg-gray-800 border-r border-gray-700 fixed md:relative z-20 top-0 h-full w-64 p-5 
        transition-transform duration-300 overflow-y-auto  /* 👈 scrollable sidebar */
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* Logo + Mobile Close Button */}
        <div className="flex items-center justify-between mb-10 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            <img
              src="../../eusda-logo.png"
              alt="Eusda logo"
              className="w-9 h-9 rounded-full border-2 border-green-500 object-cover"
            />
            <h2 className="text-2xl font-extrabold text-green-400">EUSDA</h2>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden hover:text-green-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ─────────── Nav Links ─────────── */}
        <nav>
          <ul className="space-y-4 pb-8">

            {/* Each NavLink closes sidebar on mobile */}
            {[
              { to: "visitors", label: "Visitor Details", icon: <Users className="w-5 h-5" /> },
              { to: "subscribed", label: "Subscribed", icon: <MailCheck className="w-5 h-5" /> },
              { to: "leaders", label: "Leaders", icon: <MailCheck className="w-5 h-5" /> },
              { to: "blog", label: "Blog", icon: <BookOpenText className="w-5 h-5" /> },
              { to: "announcements", label: "Announcements", icon: <MessageCircle className="w-5 h-5" /> },
              { to: "events", label: "Events", icon: <Calendar className="w-5 h-5" /> },
              { to: "contributions", label: "Contributions", icon: <CreditCard className="w-5 h-5" /> },
              { to: "pledges", label: "Pledges", icon: <ShoppingBag className="w-5 h-5" /> },
              { to: "gallery", label: "Gallery", icon: <GalleryThumbnails className="w-5 h-5" /> },
              { to: "dept-members", label: "Department Members", icon: <Mic className="w-5 h-5" /> },
              { to: "ministry-members", label: "Ministry Members", icon: <BookOpen className="w-5 h-5" /> },
              { to: "bs-details", label: "Bible Study", icon: <BookOpen className="w-5 h-5" /> },
            ].map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)} // 👈 closes on mobile
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-lg font-medium transition-colors duration-200 
                    ${isActive ? "text-green-400" : "hover:text-green-400"}`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}

            {/* Logout */}
            <li className="pt-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-lg font-medium hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ─────────── Main Content ─────────── */}
      <main
        className={`flex-1 bg-gray-100 text-gray-900 p-6 pt-20 md:pt-6 transition-all duration-300 overflow-y-auto`}
      >
        {/* Mobile top bar */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hover:text-green-500"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export const AdminRoutes = () => <Navigate to="products" replace />;

export default AdminDashboard;
