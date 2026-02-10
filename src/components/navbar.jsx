// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { Menu, X, User, Home, FileText, Calendar, Briefcase, BookOpen, Mic, PenTool, BookAIcon } from 'lucide-react'; // Added Lucide icons for nav items

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const navItems = [
//     { path: '/', label: 'Home', icon: <Home size={20} /> },
//     { path: '/about', label: 'About', icon: <FileText size={20} /> },
//     { path: '/departments', label: 'Departments', icon: <Mic size={20} /> },
//     { path: '/ministries', label: 'Ministries', icon: <BookOpen size={20} /> },
//     { path: '/announcements', label: 'Announcements', icon: <Calendar size={20} /> },
//     { path: '/contributions', label: 'Contributions', icon: <Briefcase size={20} /> },
//     { path: '/events', label: 'Events', icon: <Calendar size={20} /> },
//     { path: '/blog', label: 'Blog', icon: <PenTool size={20} /> },
//     { path: '/resources', label: 'Resources', icon: <BookAIcon size={20} /> },
//   ];

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <div className="shadow-md fixed top-0 w-full z-20">
//       {/* Top Header */}
//       <div className="bg-gradient-to-r from-green-500 to-green-700 py-4 px-6 flex items-center justify-between rounded-b-2xl shadow-lg relative">
//         {/* Logo Left */}
//         <div className="flex items-center gap-3">
//           <img
//             src={process.env.PUBLIC_URL + '/eusda-logo.png'} // Use PUBLIC_URL so path works on subpaths
//             alt="EUSDA Logo"
//             onError={(e) => {
//               // Fallback to hosted image if local asset can't be resolved
//               e.currentTarget.onerror = null;
//               e.currentTarget.src = 'https://eusda.co.ke/eusda-logo.png';
//             }}
//             className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
//           />
//         </div>

//         {/* EUSDA Name Center */}
//         <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-extrabold text-white tracking-wide text-center md:block hidden ">
//           Egerton University SDA Church
//         </h1>
//         <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-extrabold text-white tracking-wide text-center md:hidden sm:inline font-serif">EUSDA Church</h1>

//         {/* Right side: Profile + Menu */}
//         <div className="flex items-center gap-4 text-white z-20">
//           {/* Profile Icon */}
//           <div className="hover:text-yellow-300 cursor-pointer transition-all duration-300">
//             <NavLink to="/profiles" className="flex items-center gap-2">
//               <User size={28} />
//             </ NavLink>
//           </div>

//           {/* Sandwich Menu (only visible on small screens) */}
//           <div
//             className="hover:text-yellow-300 cursor-pointer transition-all duration-300 md:hidden"
//             onClick={toggleMenu}
//           >
//             {menuOpen ? <X size={32} /> : <Menu size={32} />}
//           </div>
//         </div>
//       </div>

//       {/* Side Navigation Links (appears from the left on small screens) */}
//       <nav
//         className={`fixed top-0 left-0 w-64 h-full bg-green-700 text-white z-30 transform ${
//           menuOpen ? 'translate-x-0' : '-translate-x-full'
//         } transition-all duration-500 ease-in-out md:hidden`} // Ensure only visible on small screens
//       >
//         <div className="flex items-center justify-between p-6">
//           <img
//             src={process.env.PUBLIC_URL + '/eusda-logo-white.png'}
//             alt="EUSDA Logo"
//             onError={(e) => {
//               e.currentTarget.onerror = null;
//               e.currentTarget.src = 'https://eusda.co.ke/eusda-logo-white.png';
//             }}
//             className="w-12 h-12 object-cover rounded-full border-4 border-white"
//           />
//           <h1 className="absolute text-2xl md:text-3xl font-extrabold text-white ml-16">
//             EUSDA
//           </h1>
//         </div>

//         {/* Show individual links when the menu is open (instead of list) */}
//         {menuOpen && (
//           <>
//             {navItems.map((item) => (
//               <div key={item.path} className="flex items-center gap-4 py-4 px-6">
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `flex items-center gap-4 text-lg font-semibold py-2 px-4 rounded-lg transition-all duration-300
//                     ${isActive ? 'bg-green-600' : 'hover:bg-green-600 hover:text-white'}`}
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   {item.icon}
//                   {item.label}
//                 </NavLink>
//               </div>
//             ))}
//           </>
//         )}
//       </nav>

//       {/* Main Navigation: Only show on larger screens */}
//       <nav
//         className="hidden md:flex md:items-center md:justify-center bg-green-50 transition-all duration-500 ease-in-out"
//       >
//         <ul className="flex flex-row items-center gap-4 py-4 px-6">
//           {navItems.map((item) => (
//             <li key={item.path}>
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `relative text-lg font-semibold px-5 py-2 rounded-full transition-all duration-300
//                    ${isActive ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-green-600 hover:bg-green-200 hover:text-green-800'}
//                    border border-green-400`
//                 }
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {item.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, User, Home, FileText, Calendar, Briefcase, BookOpen, Mic, PenTool, BookA, Sun, Clock, Book } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [infoIndex, setInfoIndex] = useState(0);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/about', label: 'About', icon: <FileText size={18} /> },
    { path: '/departments', label: 'Departments', icon: <Mic size={18} /> },
    { path: '/ministries', label: 'Ministries', icon: <BookOpen size={18} /> },
    { path: '/announcements', label: 'Announcements', icon: <Calendar size={18} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={18} /> },
    { path: '/blog', label: 'Blog', icon: <PenTool size={18} /> },
    { path: '/resources', label: 'Resources', icon: <BookA size={18} /> },
    { path: '/contributions', label: 'Giving', icon: <Briefcase size={18} /> },
  ];

  // --- Sabbath Countdown Logic ---
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0=Sun, 5=Fri, 6=Sat
      
      const nextSabbath = new Date();
      nextSabbath.setHours(18, 30, 0, 0);

      if (currentDay === 5 && now.getHours() >= 18 && now.getMinutes() >= 30) {
         return "HAPPY SABBATH";
      } else if (currentDay === 6) {
         return "HAPPY SABBATH";
      } else {
         const daysUntilFriday = (5 - currentDay + 7) % 7;
         nextSabbath.setDate(now.getDate() + daysUntilFriday);
      }

      const diff = nextSabbath - now;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);

      return `${d}d ${h}h ${m}m`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); 
    
    setTimeLeft(calculateTimeLeft()); 

    return () => clearInterval(timer);
  }, []);

  // --- Info Cycle Logic ---
  useEffect(() => {
    const cycler = setInterval(() => {
        setInfoIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(cycler);
  }, []);

  return (
    <>
      <div className="h-[130px] md:h-[120px]" />

      <div className="fixed top-0 w-full z-50 flex flex-col shadow-2xl">
        
        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-900 py-3 px-6 flex items-center justify-between relative z-20 border-b border-green-800/30">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-4 group z-30">
            <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-500">
              <div className="bg-black rounded-full p-0.5">
                <img
                  src={process.env.PUBLIC_URL + '/eusda-logo.png'}
                  alt="EUSDA"
                  onError={(e) => { e.currentTarget.src = 'https://eusda.co.ke/eusda-logo.png'; }}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col text-white">
              <h1 className="text-xl md:text-2xl font-black tracking-wider leading-none font-sans bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">
                EUSDA
              </h1>
              <span className="text-[10px] text-emerald-300 font-medium tracking-[0.2em] uppercase hidden sm:block opacity-80">
                Egerton University SDA
              </span>
            </div>
          </NavLink>

          {/* --- DESKTOP CENTER WIDGET --- */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-4 bg-black/30 backdrop-blur-md border border-emerald-500/20 py-2 px-5 rounded-full shadow-[inset_0_0_10px_rgba(16,185,129,0.1)] min-w-[320px] justify-center overflow-hidden h-10">
            <div className="relative w-full h-full flex items-center justify-center transition-all duration-500">
                {/* Desktop HUD States */}
                <div className={`absolute flex items-center gap-3 transition-all duration-700 ${infoIndex === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400"><Clock size={14} className="animate-pulse" /></div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Sabbath In</span>
                        <span className="text-sm text-white font-mono font-bold tracking-widest">{timeLeft}</span>
                    </div>
                </div>
                <div className={`absolute flex items-center gap-3 transition-all duration-700 ${infoIndex === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400"><Sun size={14} /></div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[9px] text-yellow-400/80 uppercase tracking-widest font-bold">Sunset Today</span>
                        <span className="text-sm text-white font-mono font-bold tracking-widest">18:45 EAT</span>
                    </div>
                </div>
                <div className={`absolute flex items-center gap-3 transition-all duration-700 ${infoIndex === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400"><Book size={14} /></div>
                    <div className="flex flex-col leading-none text-center">
                        <span className="text-[9px] text-blue-300 uppercase tracking-widest font-bold">Verse of the week</span>
                        <span className="text-xs text-white font-serif italic tracking-wide">Exodus 20:8</span>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 animate-slideLoading w-full opacity-50"></div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 text-emerald-100 z-30">
            <NavLink 
              to="/profiles" 
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border border-transparent
                ${isActive ? 'bg-emerald-800/50 text-white border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'hover:bg-white/10 hover:text-white'}
              `}
            >
              <User size={20} />
              <span className="text-xs font-semibold uppercase tracking-wide hidden xl:block">Leaders</span>
            </NavLink>

            <button 
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* BOTTOM NAV (Desktop) */}
        <nav className="hidden md:flex items-center justify-center bg-white/80 backdrop-blur-xl border-b border-white/20 py-2.5 shadow-sm">
          <ul className="flex flex-wrap justify-center gap-1 px-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-full transition-all duration-300 ease-out
                    ${isActive ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-green-500/30 transform scale-105' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`
                  }
                >
                  <span className={({ isActive }) => isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}>
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm transition-opacity duration-500" onClick={() => setMenuOpen(false)} />
        
        <nav className={`absolute top-0 left-0 h-full w-72 bg-gradient-to-b from-emerald-900 via-green-900 to-black text-white shadow-2xl border-r border-emerald-700/30 transform transition-transform duration-300 ease-out overflow-y-auto ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          {/* Header */}
          <div className="p-6 border-b border-emerald-800/50 flex items-center gap-4 bg-black/20">
             <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 rounded-full"></div>
                <img src={process.env.PUBLIC_URL + '/eusda-logo-white.png'} alt="Logo" onError={(e) => { e.currentTarget.src = 'https://eusda.co.ke/eusda-logo-white.png'; }} className="relative w-10 h-10 z-10" />
             </div>
             <div>
                <span className="font-black text-lg tracking-wider block text-white">EUSDA</span>
                <span className="text-[10px] text-emerald-400 tracking-widest uppercase">Menu</span>
             </div>
          </div>

          {/* ✅ MOBILE WIDGET: Spiritual Dashboard */}
          <div className="mx-4 mt-4 mb-2 p-4 rounded-2xl bg-black/20 border border-emerald-500/20 shadow-inner relative overflow-hidden group">
             {/* Glowing Dot Indicators */}
             <div className="absolute top-3 right-3 flex gap-1">
                {[0, 1, 2].map(i => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${infoIndex === i ? (i===0 ? 'bg-emerald-400' : i===1 ? 'bg-yellow-400' : 'bg-blue-400') : 'bg-white/10'}`} />
                ))}
             </div>

             <div className="relative h-12">
                 {/* Mobile State 1: Sabbath */}
                 <div className={`absolute inset-0 flex items-center gap-3 transition-all duration-500 ${infoIndex === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                    <div className="p-2.5 rounded-full bg-emerald-500/20 text-emerald-400"><Clock size={18} /></div>
                    <div>
                        <p className="text-[10px] text-emerald-300/70 uppercase font-bold tracking-wider">Sabbath In</p>
                        <p className="text-lg font-mono font-bold text-white tracking-widest leading-none mt-0.5">{timeLeft}</p>
                    </div>
                 </div>

                 {/* Mobile State 2: Sunset */}
                 <div className={`absolute inset-0 flex items-center gap-3 transition-all duration-500 ${infoIndex === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                    <div className="p-2.5 rounded-full bg-yellow-500/20 text-yellow-400"><Sun size={18} /></div>
                    <div>
                        <p className="text-[10px] text-yellow-300/70 uppercase font-bold tracking-wider">Sunset Today</p>
                        <p className="text-lg font-mono font-bold text-white tracking-widest leading-none mt-0.5">18:45 EAT</p>
                    </div>
                 </div>

                 {/* Mobile State 3: Verse */}
                 <div className={`absolute inset-0 flex items-center gap-3 transition-all duration-500 ${infoIndex === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                    <div className="p-2.5 rounded-full bg-blue-500/20 text-blue-400"><Book size={18} /></div>
                    <div>
                        <p className="text-[10px] text-blue-300/70 uppercase font-bold tracking-wider">Reflect</p>
                        <p className="text-sm font-serif italic text-white leading-tight mt-0.5">"Remember the Sabbath..."</p>
                    </div>
                 </div>
             </div>
          </div>

          {/* Links */}
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-emerald-800/40 text-white border-l-4 border-emerald-400' : 'text-emerald-100/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'}`}>
                <span className={`transition-transform duration-300 ${({isActive}) => isActive ? 'scale-110 text-emerald-400' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="font-medium tracking-wide text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="absolute w-full p-6 bg-black/40 backdrop-blur text-center border-t border-emerald-800/30">
            <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest">© {new Date().getFullYear()} Egerton University SDA</p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;