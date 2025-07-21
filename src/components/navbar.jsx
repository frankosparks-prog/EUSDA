import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, User, Home, FileText, Calendar, Briefcase, BookOpen, Mic, PenTool } from 'lucide-react'; // Added Lucide icons for nav items

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/about', label: 'About', icon: <FileText size={20} /> },
    { path: '/departments', label: 'Departments', icon: <Mic size={20} /> },
    { path: '/ministries', label: 'Ministries', icon: <BookOpen size={20} /> },
    { path: '/announcements', label: 'Announcements', icon: <Calendar size={20} /> },
    { path: '/contributions', label: 'Contributions', icon: <Briefcase size={20} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/blog', label: 'Blog', icon: <PenTool size={20} /> },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="shadow-md fixed top-0 w-full z-20">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 py-4 px-6 flex items-center justify-between rounded-b-2xl shadow-lg relative">
        {/* Logo Left */}
        <div className="flex items-center gap-3">
          <img
            src="./eusda-logo.png" // Replace with your logo URL
            alt="EUSDA Logo"
            className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
          />
        </div>

        {/* EUSDA Name Center */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-extrabold text-white tracking-wide text-center md:block hidden ">
          Egerton University SDA Church
        </h1>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-extrabold text-white tracking-wide text-center md:hidden sm:inline font-serif">EUSDA Church</h1>

        {/* Right side: Profile + Menu */}
        <div className="flex items-center gap-4 text-white z-20">
          {/* Profile Icon */}
          <div className="hover:text-yellow-300 cursor-pointer transition-all duration-300">
            <NavLink to="/profiles" className="flex items-center gap-2">
              <User size={28} />
            </ NavLink>
          </div>

          {/* Sandwich Menu (only visible on small screens) */}
          <div
            className="hover:text-yellow-300 cursor-pointer transition-all duration-300 md:hidden"
            onClick={toggleMenu}
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </div>
        </div>
      </div>

      {/* Side Navigation Links (appears from the left on small screens) */}
      <nav
        className={`fixed top-0 left-0 w-64 h-full bg-green-700 text-white z-30 transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-500 ease-in-out md:hidden`} // Ensure only visible on small screens
      >
        <div className="flex items-center justify-between p-6">
          <img
            src="./eusda-logo-white.png"
            alt="EUSDA Logo"
            className="w-12 h-12 object-cover rounded-full border-4 border-white"
          />
          <h1 className="absolute text-2xl md:text-3xl font-extrabold text-white ml-16">
            EUSDA
          </h1>
        </div>

        {/* Show individual links when the menu is open (instead of list) */}
        {menuOpen && (
          <>
            {navItems.map((item) => (
              <div key={item.path} className="flex items-center gap-4 py-4 px-6">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-lg font-semibold py-2 px-4 rounded-lg transition-all duration-300
                    ${isActive ? 'bg-green-600' : 'hover:bg-green-600 hover:text-white'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </div>
            ))}
          </>
        )}
      </nav>

      {/* Main Navigation: Only show on larger screens */}
      <nav
        className="hidden md:flex md:items-center md:justify-center bg-green-50 transition-all duration-500 ease-in-out"
      >
        <ul className="flex flex-row items-center gap-4 py-4 px-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative text-lg font-semibold px-5 py-2 rounded-full transition-all duration-300
                   ${isActive ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-green-600 hover:bg-green-200 hover:text-green-800'}
                   border border-green-400`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
