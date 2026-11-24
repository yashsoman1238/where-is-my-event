import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee',
    orgName: '',
    phone: '',
    address: '',
    city: 'Vadodara',
    eventType: 'Musical Concerts & Live Shows'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    // POST directly to Django REST SQL Endpoint
    axios.post('http://127.0.0.1:8000/api/signup/', formData)
      .then((res) => {
        setLoading(false);
        // Persist session locally
        localStorage.setItem('userEmail', res.data.email);
        localStorage.setItem('userRole', res.data.role);
        localStorage.setItem('registeredUser', JSON.stringify(res.data));

        alert(`Account created successfully as ${res.data.role === 'organizer' ? 'Organizer' : 'Attendee'}!`);

        if (res.data.role === 'organizer') {
          navigate('/organizer-profile');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        setLoading(false);
        const serverError = err.response?.data?.error || 'Registration failed. Make sure Django backend is running.';
        setErrorMessage(serverError);
      });
  };

  return (
    <div className="container my-5 py-4">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
            <h2 className="text-center fw-bold mb-2">Create Account</h2>
            <p className="text-center text-muted small mb-4">
              Join WhereIsMyEvent.com to discover or organize live shows
            </p>

            {errorMessage && (
              <div className="alert alert-danger py-2 small mb-3">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold small">Account Type</label>
                <select 
                  name="role" 
                  className="form-select border-primary fw-semibold" 
                  value={formData.role} 
                  onChange={handleChange}
                >
                  <option value="attendee">Event Attendee / Normal User</option>
                  <option value="organizer">Event Organizer / Promoter</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Your Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control" 
                    placeholder="e.g. Yash Soman" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    placeholder="name@example.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              {/* ORGANIZER-ONLY FIELDS */}
              {formData.role === 'organizer' && (
                <div className="p-3 mb-3 bg-light rounded-3 border">
                  <h6 className="fw-bold text-primary mb-3">
                    <i className="bi bi-building me-1"></i> Organizer Details
                  </h6>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">Organization / Agency Name</label>
                    <input 
                      type="text" 
                      name="orgName" 
                      className="form-control form-control-sm" 
                      placeholder="e.g. Royal Holidayj & Events / WIME Team" 
                      value={formData.orgName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Contact Phone</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        className="form-control form-control-sm" 
                        placeholder="+91 9265526360" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Types of Events Hosted</label>
                      <select 
                        name="eventType" 
                        className="form-select form-select-sm" 
                        value={formData.eventType} 
                        onChange={handleChange}
                      >
                        <option>Musical Concerts & Live Shows</option>
                        <option>Festivals & Cultural Nights</option>
                        <option>Tech Conferences & Workshops</option>
                        <option>Stand-up Comedy & Theatre</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-1">
                    <label className="form-label small fw-bold">Office Address / Location</label>
                    <input 
                      type="text" 
                      name="address" 
                      className="form-control form-control-sm" 
                      placeholder="e.g. Alkapuri, Vadodara, Gujarat" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    placeholder="Create password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    className="form-control" 
                    placeholder="Confirm password" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 fw-bold py-2 mb-3"
                disabled={loading}
              >
                {loading ? 'Creating Account in Database...' : 'Create Account'}
              </button>

              <p className="text-center mb-0 small text-muted">
                Already have an account? <Link to="/login" className="fw-semibold">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}