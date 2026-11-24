import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const storedUser = JSON.parse(localStorage.getItem('registeredUser') || '{}');
  const displayName = storedUser.name || userEmail.split('@')[0];

  // User-scoped booking storage key
  const userBookingKey = `userBookings_${userEmail.toLowerCase()}`;
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Read bookings strictly for the logged-in user (starts empty for new users)
    const stored = JSON.parse(localStorage.getItem(userBookingKey) || '[]');
    setBookings(stored);
  }, [userBookingKey]);

  // Dynamic calculations
  const totalSpent = bookings.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const activePasses = bookings.filter(b => b.status === 'Confirmed').length;

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'US';

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('registeredUser');
    navigate('/login');
  };

  const viewTicket = (b) => {
    alert(`🎟️ TICKET DETAILS\n\nTicket ID: ${b.id}\nEvent: ${b.title}\nVenue: ${b.venue}\nDate: ${b.date}\nAmount Paid: ₹${b.price}\nStatus: ${b.status}`);
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Left Sidebar */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <div className="text-center mb-4">
              <div 
                className="rounded-circle bg-primary text-white fw-bold d-inline-flex align-items-center justify-content-center shadow mb-3"
                style={{ width: '90px', height: '90px', fontSize: '2rem' }}
              >
                {initials}
              </div>
              <h5 className="fw-bold mb-0 text-capitalize">{displayName}</h5>
              <p className="text-muted small mb-1">{userEmail}</p>
              <span className="badge bg-primary-subtle text-primary">Normal User Account</span>
            </div>
            <hr />
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-primary text-start fw-semibold py-2">
                <i className="bi bi-grid-fill me-2"></i> My Dashboard
              </button>
              <Link to="/events" className="btn btn-light text-start text-dark py-2">
                <i className="bi bi-ticket-perforated me-2"></i> Browse & Book Events
              </Link>
              <Link to="/contact" className="btn btn-light text-start text-dark py-2">
                <i className="bi bi-question-circle me-2"></i> Support
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-danger text-start py-2 mt-3">
                <i className="bi bi-box-arrow-left me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Right Dashboard Content */}
        <div className="col-md-9">
          {/* Counters: Always start at 0 for new attendees */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                <p className="text-muted mb-1 small fw-semibold">Booked Events</p>
                <h2 className="fw-bold text-primary mb-0">{bookings.length}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                <p className="text-muted mb-1 small fw-semibold">Active Passes</p>
                <h2 className="fw-bold text-success mb-0">{activePasses}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                <p className="text-muted mb-1 small fw-semibold">Total Spent</p>
                <h2 className="fw-bold text-dark mb-0">₹ {totalSpent.toLocaleString()}</h2>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">My Booked Tickets</h5>
              {bookings.length > 0 && (
                <Link to="/events" className="btn btn-sm btn-outline-primary">+ Book Another</Link>
              )}
            </div>
            
            {bookings.length === 0 ? (
              /* Clean empty state for new user */
              <div className="text-center py-5 border rounded-3 bg-light">
                <div className="mb-3">
                  <i className="bi bi-ticket-detailed fs-1 text-muted"></i>
                </div>
                <h5 className="fw-bold text-dark">No Events Booked Yet</h5>
                <p className="text-muted small mb-4">
                  You haven't purchased tickets for any live concert or show yet.
                </p>
                <Link to="/events" className="btn btn-primary px-4 fw-semibold shadow-sm">
                  <i className="bi bi-calendar-check me-2"></i>Book Tickets
                </Link>
              </div>
            ) : (
              /* Live ticket list once booked */
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Ticket ID</th>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="fw-bold text-secondary small">{b.id}</td>
                        <td>
                          <span className="fw-bold text-dark d-block">{b.title}</span>
                          <small className="text-muted">{b.venue}</small>
                        </td>
                        <td>{b.date}</td>
                        <td className="fw-semibold">₹ {b.price}</td>
                        <td>
                          <span className={`badge ${b.status === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewTicket(b)}
                          >
                            View Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}