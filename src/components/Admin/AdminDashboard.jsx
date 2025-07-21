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
    // Clear the admin token from local storage
    localStorage.removeItem("adminToken");
    // Redirect to the admin login page
    window.location.href = "/admin";
  };

  return (
    <div className="flex h-screen font-inter text-white">
      {/* ──────────────────  Sidebar  ────────────────── */}
      <aside
        className={`bg-gray-800 border-r border-gray-700 fixed md:relative z-20 top-0 h-full w-64 p-5 transition-transform duration-300
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo + Close (mobile) */}
        <div className="flex items-center justify-between mb-10 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            <img
              src="./eusda-logo.png"
              alt="Eusda logo"
              className="w-9 h-9 rounded-full border-2 border-green-500 object-cover"
            />
            <h2 className="text-2xl font-extrabold text-green-400">EUSDA</h2>
          </div>

          {/* Close btn (mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden hover:text-green-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav>
          <ul className="space-y-4">
            <li>
              <NavLink
                to="visitors"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <Users className="w-5 h-5" />
                Visitor Details
              </NavLink>
            </li>

            <li>
              <NavLink
                to="leaders"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <MailCheck className="w-5 h-5" />
                Leaders
              </NavLink>
            </li>

            <li>
              <NavLink
                to="blog"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <BookOpenText className="w-5 h-5" />
                Blog
              </NavLink>
            </li>

            <li>
              <NavLink
                to="announcements"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <MessageCircle className="w-5 h-5" />
                Announcements
              </NavLink>
            </li>
            <li>
              <NavLink
                to="events"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <Calendar className="w-5 h-5" />
                Events
              </NavLink>
            </li>
            <li>
              <NavLink
                to="contributions"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <CreditCard className="w-5 h-5" />
                Contributions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="pledges"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <ShoppingBag className="w-5 h-5" />
                Pledges
              </NavLink>
            </li>
            <li>
              <NavLink
                to="gallery"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <GalleryThumbnails className="w-5 h-5" />
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink
                to="dept-members"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <Mic className="w-5 h-5" />
                Department Members
              </NavLink>
            </li>
            <li>
              <NavLink
                to="ministry-members"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg font-medium transition-colors duration-200 ${
                    isActive ? "text-green-400" : "hover:text-green-400"
                  }`
                }
              >
                <BookOpen className="w-5 h-5" />
                Ministry Members
              </NavLink>
            </li>
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

      {/* ──────────────────  Main Content  ────────────────── */}
      <main
        className={`flex-1 bg-gray-100 text-gray-900 p-6 pt-20 md:pt-6 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? "md:ml-2" : ""
        }`}
      >
        {/* Top bar (mobile toggle) */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hover:text-green-400"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

/* Redirect /admin to /admin/products by default */
export const AdminRoutes = () => <Navigate to="products" replace />;

export default AdminDashboard;
