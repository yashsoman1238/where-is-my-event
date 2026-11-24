import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row">
          {/* Brand & Mission */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">WhereIsMyEvent.com</h5>
            <p className="text-secondary small">
              The world's premier platform for discovering and booking live experiences. From Vadodara to the world.
            </p>
            <div className="fs-5">
              <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>

          {/* Core Navigation */}
          <div className="col-md-2 mb-4">
            <h5 className="fw-bold">Navigation</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-secondary text-decoration-none d-block py-1 small">Home</Link></li>
              <li><Link to="/events" className="text-secondary text-decoration-none d-block py-1 small">All Events</Link></li>
              <li><Link to="/add-event" className="text-secondary text-decoration-none d-block py-1 small">Add Event</Link></li>
              <li><Link to="/organizer-profile" className="text-secondary text-decoration-none d-block py-1 small">Organizer Profile</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none d-block py-1 small">About Us</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none d-block py-1 small">Contact Us</Link></li>
            </ul>
          </div>

          {/* User Account & Information */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Account & Portal</h5>
            <ul className="list-unstyled">
              <li><Link to="/dashboard" className="text-secondary text-decoration-none d-block py-1 small">User Dashboard</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none d-block py-1 small">Login</Link></li>
              <li><Link to="/signup" className="text-secondary text-decoration-none d-block py-1 small">Sign Up</Link></li>
              <li><Link to="/organizer-profile" className="text-secondary text-decoration-none d-block py-1 small">Organizer View</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none d-block py-1 small">Our Mission</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Newsletter</h5>
            <p className="small text-secondary">Get the latest event updates right in your inbox.</p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control bg-dark text-white border-secondary small" 
                placeholder="Email Address" 
              />
              <button 
                className="btn btn-primary btn-sm" 
                type="button" 
                onClick={() => alert('Subscribed to event newsletter!')}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-3 mb-3" />
        <p className="text-center mb-0 small text-secondary">
          Copyright © 2026 | WhereIsMyEvent.com | Based in Vadodara
        </p>
      </div>
    </footer>
  );
}