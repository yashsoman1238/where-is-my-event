import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/api/events/${slug}/`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Detail fetch error:', err);
        setLoading(false);
      });
  }, [slug]);

  const handleBooking = () => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole') || 'attendee';

    // 1. Require Login
    if (!userEmail) {
      alert("Please login as a user to book tickets.");
      navigate('/login');
      return;
    }

    // 2. Prevent organizer accounts from booking user tickets
    if (userRole === 'organizer') {
      alert("Organizers cannot book attendee tickets. Please login with a user account.");
      return;
    }

    // 3. Create the ticket object
    const newBooking = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      title: event.title,
      artist: event.artist,
      venue: event.venue,
      date: event.date,
      price: event.price,
      status: 'Confirmed',
      bookedAt: new Date().toLocaleDateString()
    };

    // 4. Save to user-specific booking storage key
    const userBookingKey = `userBookings_${userEmail.toLowerCase()}`;
    const existingBookings = JSON.parse(localStorage.getItem(userBookingKey) || '[]');
    const updatedBookings = [newBooking, ...existingBookings];
    localStorage.setItem(userBookingKey, JSON.stringify(updatedBookings));

    alert(`Success! Ticket booked for ${event.title}. Redirecting to your dashboard.`);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container my-5 text-center py-5">
        <h3>Event Not Found</h3>
        <p className="text-muted">The event you are looking for does not exist or has been removed.</p>
        <Link to="/events" className="btn btn-primary mt-3">Back to Events</Link>
      </div>
    );
  }

  return (
    <>
      {/* Event Header Banner */}
      <div 
        className="w-100 shadow-sm text-white d-flex align-items-end" 
        style={{
          height: '420px',
          background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${event.banner || event.image}) center/cover no-repeat`
        }}
      >
        <div className="container pb-4">
          <span className="badge bg-primary fs-6 mb-2">{event.title}</span>
          <h1 className="display-4 fw-bold">On {event.date}</h1>
          <p className="lead mb-0"><i className="bi bi-geo-alt-fill me-2 text-primary"></i> {event.venue}</p>
        </div>
      </div>

      {/* Main Content & Sticky Sidebar */}
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3">
              <h4 className="fw-bold mb-3">About This Event</h4>
              <p className="fs-5 text-secondary">{event.description}</p>
              <p className="text-secondary">
                Expect an electrifying atmosphere, acoustic sets, and an unforgettable evening of live music.
              </p>
            </div>

            <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
              <h4 className="fw-bold mb-3">Location Map</h4>
              <div className="bg-light rounded text-dark d-flex align-items-center justify-content-center border border-dashed" style={{ height: '260px' }}>
                <p className="mb-0 text-muted"><i className="bi bi-map me-2"></i> {event.venue}, {event.city}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3 position-sticky" style={{ top: '90px' }}>
              <h3 className="fw-bold text-primary mb-4">₹ {event.price} <small className="text-muted fs-6">onwards</small></h3>
              
              <div className="mb-3 d-flex align-items-center">
                <i className="bi bi-calendar-event fs-4 me-3 text-primary"></i>
                <div>
                  <p className="mb-0 fw-bold">Date & Time</p>
                  <p className="mb-0 small text-muted">{event.date} | {event.time || '06:00 PM'}</p>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-center">
                <i className="bi bi-clock fs-4 me-3 text-primary"></i>
                <div>
                  <p className="mb-0 fw-bold">Duration</p>
                  <p className="mb-0 small text-muted">{event.duration || '4 Hours Approx.'}</p>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-lg w-100 shadow mb-3 fw-bold" 
                onClick={handleBooking}
              >
                Book Now
              </button>
              <p className="text-center small text-muted mb-0">Instant ticket confirmation & free cancellation</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}