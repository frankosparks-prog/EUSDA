import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  Home,
  FileText,
  Calendar,
  Briefcase,
  BookOpen,
  Mic,
  PenTool,
} from 'lucide-react';

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

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="fixed top-0 w-full z-20 shadow-md">
      {/* Top Header */}
      <div className="relative flex items-center justify-between py-4 px-6 bg-gradient-to-r from-green-500 to-green-700 rounded-b-2xl shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwO8uDAe3N3IHiomKCDoFimUPW4-NvVu9d8A&s"
            alt="EUSDA Logo"
            className="w-14 h-14 object-cover rounded-full border-4 border-white shadow-md"
          />
        </div>

        {/* Centered Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          EUSDA Church
        </h1>

        {/* Right Side: Profile & Menu Toggle */}
        <div className="flex items-center gap-4 text-white z-20">
          <NavLink
            to="/profiles"
            className="flex items-center gap-2 hover:text-yellow-300 transition duration-300 cursor-pointer"
          >
            <User size={28} />
          </NavLink>

          {/* Hamburger / Close Menu Icon */}
          <button
            onClick={toggleMenu}
            className="md:hidden hover:text-yellow-300 transition duration-300 cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Side Navigation */}
      <nav
        className={`fixed top-0 left-0 w-64 h-full bg-green-700 text-white z-30 transform transition-transform duration-500 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center p-6 justify-start gap-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwO8uDAe3N3IHiomKCDoFimUPW4-NvVu9d8A&s"
            alt="EUSDA Logo"
            className="w-12 h-12 object-cover rounded-full border-4 border-white"
          />
          <h1 className="text-2xl font-extrabold text-white">EUSDA</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 py-4 px-6 text-lg font-semibold rounded-lg transition duration-300
                 ${
                   isActive
                     ? 'bg-green-600'
                     : 'hover:bg-green-600 hover:text-white'
                 }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center bg-green-50">
        <ul className="flex items-center gap-4 py-4 px-6">
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative text-lg font-semibold px-5 py-2 rounded-full border border-green-400 transition duration-300
                   ${
                     isActive
                       ? 'bg-green-600 text-white shadow-lg'
                       : 'bg-white text-green-600 hover:bg-green-200 hover:text-green-800'
                   }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
