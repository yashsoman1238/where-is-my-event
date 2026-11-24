import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    // Authenticate with Django REST SQL Endpoint
    axios.post('http://127.0.0.1:8000/api/login/', { email, password })
      .then((res) => {
        setLoading(false);
        const { email: userEmail, role, name, orgName } = res.data;

        // Persist session from SQL database response
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userRole', role);
        localStorage.setItem('registeredUser', JSON.stringify({
          email: userEmail,
          role,
          name,
          orgName
        }));

        alert(`Welcome back, ${name || userEmail}!`);

        if (role === 'organizer') {
          navigate('/organizer-profile');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        setLoading(false);
        const serverError = err.response?.data?.error || 'Invalid credentials or backend unavailable.';
        setErrorMessage(serverError);
      });
  };

  return (
    <div className="container my-5 py-4">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
            <h2 className="text-center fw-bold mb-3">Login</h2>

            {errorMessage && (
              <div className="alert alert-danger py-2 small mb-3">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold small">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 fw-bold py-2 mt-2"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login'}
              </button>
              
              <p className="text-center mt-3 mb-0 small text-muted">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}