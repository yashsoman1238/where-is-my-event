import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/Components/Navbar';
import Footer from '../src/Components/Footer';

import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import OrganizerProfile from './pages/OrganizerProfile';
import AddEvent from './pages/AddEvent';

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:slug" element={<EventDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<UserDashboard />} />
           {/* Self Organizer Profile */}
            <Route path="/organizer-profile" element={<OrganizerProfile />} />
            {/* Dynamic Public Organizer Profile */}
            <Route path="/organizer/:orgName" element={<OrganizerProfile />} />
            <Route path="/add-event" element={<AddEvent />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;