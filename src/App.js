// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
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
      </Routes>
    </div>
  );
};

export default App;
