// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your page components here
// import About from './components/about';
// import Announcements from './components/announcements';
// import Events from './components/events';
// import Jobs from './components/jobs';
// import Readings from './components/readings'; 
// import Songs from './components/songs';
import Navbar from './components/navbar';
import Home from './components/Home';
// import Contribution from './components/Contribution';
// import Donate from './components/Donate';
// import Profile from './components/Profile';
// import Gallery from './components/Gallery';
// import Contact from './components/Contact';
// import Services from './components/Services';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/events" element={<Events />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/readings" element={<Readings />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/contributions" element={<Contribution />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} /> */}
      </Routes>
    </div>
  );
};

export default App;
