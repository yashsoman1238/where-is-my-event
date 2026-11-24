import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://where-is-my-event.onrender.com/api/events/')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  // Compute organizers automatically based on published events + registered organizers
  const organizerMap = {};

  // Standard platform organizer as baseline
  organizerMap['WIME Global Events Team'] = {
    name: 'WIME Global Events Team',
    category: 'Concerts & World Tours',
    count: 0,
    city: 'Vadodara'
  };

  // If an organizer account is currently logged in, register them in the map immediately
  const storedUser = JSON.parse(localStorage.getItem('registeredUser') || '{}');
  const userRole = localStorage.getItem('userRole');
  const activeOrgName = storedUser.orgName || storedUser.org_name || storedUser.name;

  if (userRole === 'organizer' && activeOrgName) {
    organizerMap[activeOrgName] = {
      name: activeOrgName,
      category: storedUser.eventType || storedUser.event_type || 'Live Entertainment & Shows',
      count: 0,
      city: storedUser.city || 'Vadodara'
    };
  }

  // Populate counts and auto-discover any other organizers from all events in the database
  events.forEach(evt => {
    const org = evt.organizer_name || evt.organizerName || 'WIME Global Events Team';
    if (!organizerMap[org]) {
      organizerMap[org] = {
        name: org,
        category: 'Live Entertainment & Concerts',
        count: 0,
        city: evt.city || 'Vadodara'
      };
    }
    organizerMap[org].count += 1;
  });

  const organizersList = Object.values(organizerMap);

  return (
    <>
      {/* Hero Banner Carousel */}
      <div className="carousel slide shadow">
        <div className="carousel-inner position-relative">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30" 
            alt="Concert" 
            className="w-100" 
            style={{ height: '450px', objectFit: 'cover' }} 
          />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white bg-dark bg-opacity-75 p-4 rounded-3 w-75">
            <h1 className="display-4 fw-bold">Global Events at Your Fingertips</h1>
            <p className="lead">Book the best musical concerts and shows happening around you.</p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="text-center py-5 bg-white border-bottom shadow-sm">
        <div className="container">
          <h2 className="display-5 fw-bold text-dark">Welcome to Where Is My Event.com</h2>
          <p className="lead text-secondary mb-4">The World's Biggest Event Booking & Listing Platform</p>
          <Link to="/about" className="btn btn-primary btn-lg px-4 shadow-sm">Learn More About Us</Link>
        </div>
      </section>

      {/* Featured Concerts Listing */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="border-start border-primary border-5 ps-3 fw-bold mb-0">Featured Concerts</h2>
          <Link to="/events" className="btn btn-outline-primary btn-sm px-3">View All ({events.length})</Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading events from Django API...</p>
          </div>
        ) : (
          <div className="row g-4">
            {events.map((evt) => (
              <div className="col-md-6 col-lg-4" key={evt.id}>
                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                  <img 
                    src={evt.image} 
                    style={{ height: '260px', objectFit: 'cover', objectPosition: 'top' }} 
                    className="card-img-top" 
                    alt={evt.title} 
                  />
                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-primary mb-2 align-self-start">{evt.artist}</span>
                    <h5 className="card-title fw-bold text-dark">{evt.title}</h5>
                    <p className="text-muted small mb-2">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i> {evt.venue}
                    </p>
                    <p className="text-secondary small flex-grow-1">{evt.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                      <span className="fw-bold text-dark fs-5">₹ {evt.price}</span>
                      <Link to={`/event/${evt.slug}`} className="btn btn-outline-primary btn-sm px-3 fw-semibold">
                        View Event Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AUTOMATIC ORGANIZERS DIRECTORY */}
      <div className="container my-5 py-4 border-top">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold border-start border-primary border-5 ps-3 mb-1">
              Verified Event Organizers
            </h2>
            <p className="text-muted small ps-3 mb-0">Leading agencies and verified promoters listing live experiences</p>
          </div>
          <Link to="/add-event" className="btn btn-sm btn-primary">+ Become an Organizer</Link>
        </div>

        <div className="row g-4">
          {organizersList.map((org, index) => {
            const initials = org.name
              .split(' ')
              .filter(Boolean)
              .map(w => w[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();

            return (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card border-0 shadow-sm p-4 text-center h-100 bg-white rounded-3">
                  <div 
                    className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{ width: '70px', height: '70px', fontSize: '1.4rem' }}
                  >
                    {initials}
                  </div>
                  <h6 className="fw-bold text-dark mb-1">
                    {org.name} <i className="bi bi-patch-check-fill text-primary small"></i>
                  </h6>
                  <p className="text-muted small mb-2">{org.city}, India</p>
                  <span className="badge bg-light text-dark border mb-3">
                    {org.count} Active {org.count === 1 ? 'Event' : 'Events'}
                  </span>
                  <Link 
                    to={`/organizer/${encodeURIComponent(org.name)}`} 
                    className="btn btn-outline-primary btn-sm mt-auto w-100"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Features Banner */}
      <div className="container mb-5 text-center p-5 bg-white rounded-3 shadow-sm border">
        <h3 className="fw-bold mb-3">Why Use Our Platform?</h3>
        <p className="text-muted mb-4">Zero intermediate commissions, direct booking verification, and global listings.</p>
        <Link to="/about" className="btn btn-info text-white px-4 py-2 fw-semibold">
          Explore Features
        </Link>
      </div>
    </>
  );
}