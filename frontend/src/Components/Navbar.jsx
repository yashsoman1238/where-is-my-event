import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole') || 'attendee';

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('registeredUser');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">WhereIsMyEvent.com</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#mynavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button> 
        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/events">Events</NavLink>
            </li>

            {/* ONLY VISIBLE TO ORGANIZERS */}
            {userRole === 'organizer' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/add-event">Add Event</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/organizer-profile">Organizer</NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {userEmail ? (
              <div className="d-flex align-items-center gap-2">
                <Link 
                  to={userRole === 'organizer' ? "/organizer-profile" : "/dashboard"} 
                  className="btn btn-outline-info btn-sm px-3 fw-semibold"
                >
                  <i className="bi bi-person-circle me-1"></i> {userRole === 'organizer' ? 'Organizer Portal' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm px-2" title="Logout">
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm px-3">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}