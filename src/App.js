// // src/App.jsx
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/navbar';
// import Home from './components/Home';
// import About from './components/About';
// import Announcements from './components/Announcements';
// import Events from './components/Events';
// import Contributions from './components/Contributions';
// import Profile from './components/Profile';
// import Gallary from './components/Gallary';
// import Contact from './components/Contact';
// import Departments from './components/Departments';
// import Ministries from './components/Ministries';
// import Blog from './components/Blog';
// import ScrollToTop from './components/scrollTop';
// import DeptJoinForm from './components/DeptJoinForm';
// import MinistryJoinForm from './components/MinistryJoinForm';
// import EventDetails from './components/EventDetails';

// const App = () => {
//   return (
//     <div>
//       <ScrollToTop />
//       <Navbar />
//       <Routes>
//         <Route exact path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/announcements" element={<Announcements />} />
//         <Route path="/events" element={<Events />} />
//         <Route path="/contributions" element={<Contributions />} />
//         <Route path="/departments" element={<Departments />} />
//         <Route path="/ministries" element={<Ministries />} />
//         <Route path="/profiles" element={<Profile />} />
//         <Route path="/gallery" element={<Gallary />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/blog" element={<Blog />} />
//         <Route path="/departments/join" element={<DeptJoinForm />} />
//         <Route path="/ministries/join/:ministryName" element={<MinistryJoinForm />} />
//         <Route path="/events/event-details" element={<EventDetails />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;


import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from './components/navbar';
import Home from './components/Home';
import About from './components/About';
import Announcements from './components/Announcements';
import Events from './components/Events';
import Contributions from './components/Contributions';
import Profile from './components/Profile';
import Gallary from './components/Gallary';
import Contact from './components/Contact';
import Departments from './components/Departments';
import Ministries from './components/Ministries';
import Blog from './components/Blog';
import ScrollToTop from './components/scrollTop';
import DeptJoinForm from './components/DeptJoinForm';
import MinistryJoinForm from './components/MinistryJoinForm';
import EventDetails from './components/EventDetails';
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminLogin from "./components/Admin/AdminLogin";
import VisitorTracker from "./components/VisitorTracker";
import Footer from "./components/Footer";
import DeptMembers from "./components/Admin/DeptMembers";
import MinistryMembers from "./components/Admin/MinistryMembers";
import ManageAnnouncements from "./components/Admin/ManageAnnouncements";
import ManageContributions from "./components/Admin/ManageContributions";
import ManageEvents from "./components/Admin/ManageEvents";
import ManageBlogs from "./components/Admin/ManageBlogs";
import ManageLeaders from "./components/Admin/ManageLeaders";
import ManageGallery from "./components/Admin/ManageGallery";
import UsersDetails from "./components/Admin/UserDetails";
import ManagePledges from "./components/Admin/ManagePledges";
import PresentationView from "./components/Admin/PresentationView";

// 👇 create a wrapper component to manage layout
function AppLayout() {
  const location = useLocation();

  // Check if current route starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <VisitorTracker />

      {/* 👇 Only show Navbar & Footer if NOT on admin routes */}
      {!isAdminRoute && <Navbar />}
      <div className="min-h-screen">
        <AppRoutes />
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
}

// 👇 split routes into a separate component
function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contributions" element={<Contributions />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/profiles" element={<Profile />} />
        <Route path="/gallery" element={<Gallary />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/departments/join" element={<DeptJoinForm />} />
        <Route path="/ministries/join/:ministryName" element={<MinistryJoinForm />} />
        <Route path="/events/event-details" element={<EventDetails />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="visitors" replace />} />
        <Route path="visitors" element={<UsersDetails />} />
        <Route path="dept-members" element={<DeptMembers />} />
        <Route path="ministry-members" element={<MinistryMembers />} />
        <Route path="announcements" element={<ManageAnnouncements />} />
        <Route path="contributions" element={<ManageContributions />} />
        <Route path="pledges" element={<ManagePledges />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="blog" element={<ManageBlogs />} />
        <Route path="leaders" element={<ManageLeaders />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="*" element={<Navigate to="visitors" replace />} />
      </Route>
    </Routes>
  );
}

// 👇 Main App
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
 