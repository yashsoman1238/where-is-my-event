import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function OrganizerProfile() {
  const { orgName: paramOrgName } = useParams();
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Registered local organizer details
  const storedUser = JSON.parse(localStorage.getItem('registeredUser') || '{}');
  const loggedInEmail = localStorage.getItem('userEmail') || storedUser.email || '';
  const loggedInOrgName = storedUser.orgName || storedUser.org_name || storedUser.name || 'Organizer Agency';
  const userRole = localStorage.getItem('userRole') || 'attendee';

  // Determine target organizer
  const decodedParamOrg = paramOrgName ? decodeURIComponent(paramOrgName) : null;
  const isViewingSelf = !decodedParamOrg || decodedParamOrg.toLowerCase() === loggedInOrgName.toLowerCase();

  // GUARD: If a normal attendee visits their own organizer dashboard, lock them out
  if (isViewingSelf && userRole !== 'organizer') {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="card border-0 shadow-sm p-5 mx-auto bg-white rounded-3" style={{ maxWidth: '600px' }}>
          <div className="mb-3">
            <i className="bi bi-person-x text-danger" style={{ fontSize: '3.5rem' }}></i>
          </div>
          <h3 className="fw-bold text-dark">Attendee Account Detected</h3>
          <p className="text-muted mb-4">
            You are logged in with an attendee account. Attendee accounts are strictly meant for discovering and booking tickets.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/dashboard" className="btn btn-primary fw-semibold px-4">
              Go to My Tickets Dashboard
            </Link>
            <Link to="/events" className="btn btn-outline-secondary px-4">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDefaultPlatformOrg = decodedParamOrg === 'WIME Global Events Team';

  const orgName = isViewingSelf 
    ? loggedInOrgName 
    : (decodedParamOrg || 'WIME Global Events Team');

  const orgEmail = isViewingSelf 
    ? loggedInEmail 
    : (isDefaultPlatformOrg ? 'events@whereismyevent.com' : 'contact@organizer.com');

  const orgPhone = isViewingSelf 
    ? (storedUser.phone || 'Not Provided') 
    : (isDefaultPlatformOrg ? '+91 9265526360' : '+91 9800000000');

  const orgAddress = isViewingSelf 
    ? (storedUser.address || 'Not Provided') 
    : (isDefaultPlatformOrg ? 'Vadodara, Gujarat, India' : 'India');

  const orgEventType = isViewingSelf 
    ? (storedUser.eventType || storedUser.event_type || 'Event Organizer') 
    : (isDefaultPlatformOrg ? 'Concerts & World Tours' : 'Live Events');

  // Compute initials for the avatar badge
  const initials = orgName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'OG';

  useEffect(() => {
    setLoading(true);
    axios.get('https://where-is-my-event.onrender.com/api/events/')
      .then(res => {
        let matchingEvents = [];

        if (isViewingSelf) {
          // Filter events created by the logged-in user (checks email or agency name, snake_case and camelCase)
          matchingEvents = res.data.filter(item => {
            const email = (item.organizer_email || item.organizerEmail || '').toLowerCase();
            const name = (item.organizer_name || item.organizerName || '').toLowerCase();
            return (
              (loggedInEmail && email === loggedInEmail.toLowerCase()) ||
              (loggedInOrgName && name === loggedInOrgName.toLowerCase())
            );
          });
        } else if (isDefaultPlatformOrg) {
          // Default initial events belong to WIME Global Events Team
          matchingEvents = res.data.filter(item => {
            const name = item.organizer_name || item.organizerName || 'WIME Global Events Team';
            return name === 'WIME Global Events Team';
          });
        } else {
          // Other specific organizers by name
          matchingEvents = res.data.filter(item => {
            const name = (item.organizer_name || item.organizerName || '').toLowerCase();
            return name === decodedParamOrg.toLowerCase();
          });
        }

        setOrganizerEvents(matchingEvents);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setLoading(false);
      });
  }, [decodedParamOrg, isViewingSelf, loggedInEmail, loggedInOrgName, isDefaultPlatformOrg]);

  return (
    <>
      {/* Header Banner */}
      <div className="bg-primary text-white py-5 shadow-sm text-center">
        <div className="container py-3">
          <div 
            className="rounded-circle bg-white text-primary fw-bold d-inline-flex align-items-center justify-content-center shadow mb-3 border border-4 border-white"
            style={{ width: '110px', height: '110px', fontSize: '2.5rem' }}
          >
            {initials}
          </div>
          <h1 className="fw-bold mb-1">
            {orgName} <i className="bi bi-patch-check-fill text-warning fs-4 ms-1"></i>
          </h1>
          <p className="lead mb-3">Verified Organizer | {orgEventType}</p>
          <div className="d-flex justify-content-center gap-3">
            {isViewingSelf ? (
              <Link to="/add-event" className="btn btn-light fw-bold px-4">
                <i className="bi bi-plus-circle me-1"></i> List New Event
              </Link>
            ) : (
              <button className="btn btn-light fw-bold px-4" onClick={() => alert(`Following ${orgName}!`)}>
                Follow
              </button>
            )}
            <Link to="/contact" className="btn btn-outline-light px-4">
              <i className="bi bi-envelope me-1"></i> Contact Agency
            </Link>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4 mb-5">
          {/* Organizer Info Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
              <h5 className="fw-bold border-bottom pb-2 mb-3">Organizer Information</h5>
              <div className="mb-3">
                <span className="text-muted small d-block">Agency / Company</span>
                <span className="fw-bold text-dark">{orgName}</span>
              </div>
              <div className="mb-3">
                <span className="text-muted small d-block">Contact Email</span>
                <span className="fw-bold text-dark">{orgEmail}</span>
              </div>
              <div className="mb-3">
                <span className="text-muted small d-block">Phone Number</span>
                <span className="fw-bold text-dark">{orgPhone}</span>
              </div>
              <div className="mb-3">
                <span className="text-muted small d-block">Location / Address</span>
                <span className="fw-bold text-dark">{orgAddress}</span>
              </div>
              <div className="mb-0">
                <span className="text-muted small d-block">Event Category</span>
                <span className="badge bg-primary-subtle text-primary">{orgEventType}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Event Grid */}
          <div className="col-lg-8">
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                  <p className="text-muted small mb-1 fw-semibold">Hosted Events</p>
                  <h2 className="fw-bold text-primary mb-0">{organizerEvents.length}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                  <p className="text-muted small mb-1 fw-semibold">Active Listings</p>
                  <h2 className="fw-bold text-success mb-0">{organizerEvents.length}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                  <p className="text-muted small mb-1 fw-semibold">Total Attendees</p>
                  <h2 className="fw-bold text-dark mb-0">
                    {organizerEvents.length === 0 ? '0' : `${organizerEvents.length * 150}+`}
                  </h2>
                </div>
              </div>
            </div>

            {/* Active Events Section */}
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0 border-start border-primary border-5 ps-3">
                  Active Events by this Organizer
                </h4>
                {isViewingSelf && (
                  <Link to="/add-event" className="btn btn-sm btn-outline-primary">+ Add More</Link>
                )}
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Loading organizer events...</p>
                </div>
              ) : organizerEvents.length === 0 ? (
                <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
                  <div className="mb-3">
                    <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                  </div>
                  <h5 className="fw-bold text-dark">No Events Published Yet</h5>
                  <p className="text-muted small mb-3">
                    There are no live events listed under <strong>{orgName}</strong> at this time.
                  </p>
                  {isViewingSelf && (
                    <div>
                      <Link to="/add-event" className="btn btn-primary btn-sm px-4 fw-semibold">
                        + Create First Event
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="row g-3">
                  {organizerEvents.map((evt) => (
                    <div className="col-md-6" key={evt.id}>
                      <div className="card border-0 shadow-sm h-100 overflow-hidden rounded-3">
                        <img 
                          src={evt.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"} 
                          className="card-img-top" 
                          alt={evt.title} 
                          style={{ height: '170px', objectFit: 'cover' }} 
                        />
                        <div className="card-body d-flex flex-column">
                          <span className="badge bg-primary-subtle text-primary mb-1 align-self-start small">
                            {evt.artist || "Live Performance"}
                          </span>
                          <h6 className="fw-bold mb-1 text-dark">{evt.title}</h6>
                          <p className="text-muted small mb-2">
                            <i className="bi bi-geo-alt me-1 text-danger"></i>{evt.venue}
                          </p>
                          <p className="text-muted small mb-3">
                            <i className="bi bi-calendar me-1"></i>{evt.date}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                            <span className="fw-bold text-dark">₹ {evt.price}</span>
                            <Link to={`/event/${evt.slug}`} className="btn btn-sm btn-primary px-3">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}