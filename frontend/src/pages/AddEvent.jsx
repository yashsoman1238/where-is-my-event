import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AddEvent() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || '';
  const userRole = localStorage.getItem('userRole') || 'attendee';

  // Guard check: Must be an organizer
  if (!userEmail || userRole !== 'organizer') {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="card border-0 shadow-sm p-5 mx-auto bg-white rounded-3" style={{ maxWidth: '600px' }}>
          <div className="mb-3">
            <i className="bi bi-shield-lock text-danger" style={{ fontSize: '3.5rem' }}></i>
          </div>
          <h3 className="fw-bold text-dark">Organizer Access Required</h3>
          <p className="text-muted mb-4">
            Only verified Event Organizers can publish events on WhereIsMyEvent.com. Attendee accounts cannot list shows.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/signup" className="btn btn-primary fw-semibold px-4">
              Create Organizer Account
            </Link>
            <Link to="/events" className="btn btn-outline-secondary px-4">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Resolve active organizer name accurately from registeredUser
  const storedUser = JSON.parse(localStorage.getItem('registeredUser') || '{}');
  const activeOrgName = 
    storedUser.orgName || 
    storedUser.org_name || 
    storedUser.name || 
    (userEmail ? userEmail.split('@')[0] + ' Events' : 'My Organizer Agency');

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    city: 'Vadodara',
    venue: '',
    price: '',
    date: '',
    time: '06:00 PM',
    duration: '4 Hours Approx.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Explicitly guarantee organizer_name and organizer_email are never undefined or empty
    const eventPayload = {
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      banner: formData.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      organizer_email: userEmail.trim(),
      organizer_name: activeOrgName.trim()
    };

    axios.post('https://where-is-my-event.onrender.com/api/events/', eventPayload)
      .then((res) => {
        alert(`Event "${res.data.title}" successfully published under ${activeOrgName}!`);
        navigate('/organizer-profile');
      })
      .catch((err) => {
        console.error('Error creating event:', err.response?.data || err);
        alert('Failed to publish event. Check console / terminal.');
      });
  };

  return (
    <div className="container my-5 py-3">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <h3 className="fw-bold mb-1 border-start border-primary border-5 ps-3">List New Event</h3>
            <p className="text-muted small ps-3 mb-4">
              Publishing under: <strong className="text-primary">{activeOrgName}</strong> ({userEmail})
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Event Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    className="form-control" 
                    placeholder="e.g. Rock Night Vadodara" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Artist / Performer</label>
                  <input 
                    type="text" 
                    name="artist" 
                    className="form-control" 
                    placeholder="e.g. Local Band" 
                    value={formData.artist} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    className="form-control" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    className="form-control" 
                    placeholder="499" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Event Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    className="form-control" 
                    value={formData.date} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Venue Details</label>
                  <input 
                    type="text" 
                    name="venue" 
                    className="form-control" 
                    placeholder="e.g. Akota Stadium, Vadodara" 
                    value={formData.venue} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Banner Image URL (Optional)</label>
                  <input 
                    type="text" 
                    name="image" 
                    className="form-control" 
                    value={formData.image} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Description</label>
                  <textarea 
                    name="description" 
                    className="form-control" 
                    rows="3" 
                    placeholder="Describe the experience..." 
                    value={formData.description} 
                    onChange={handleChange} 
                    required
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-4">
                Publish Event Under {activeOrgName}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}