import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/events/')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.artist.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1 border-start border-primary border-5 ps-3">All Concerts & Shows</h2>
          <p className="text-muted small ps-3 mb-0">Browse and search events happening across India</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <input 
            type="text" 
            placeholder="Search artist or city..." 
            className="form-control"
            style={{ width: '260px' }}
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading all events...</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(evt => (
            <div className="col-md-6 col-lg-4" key={evt.id}>
              <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <img 
                  src={evt.image} 
                  style={{ height: '240px', objectFit: 'cover', objectPosition: 'top' }} 
                  className="card-img-top" 
                  alt={evt.title} 
                />
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-primary mb-2 align-self-start">{evt.artist}</span>
                  <h5 className="card-title fw-bold text-dark">{evt.title}</h5>
                  <p className="text-muted small mb-2">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i> {evt.venue}
                  </p>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-calendar-event me-1"></i> {evt.date}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                    <h5 className="fw-bold text-primary mb-0">₹ {evt.price}</h5>
                    <Link to={`/event/${evt.slug}`} className="btn btn-primary btn-sm px-3">
                      View Event
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-12 text-center py-5">
              <h5 className="text-muted">No events found matching "{search}"</h5>
            </div>
          )}
        </div>
      )}
    </div>
  );
}