import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">Get In Touch</h1>
        <p className="lead text-secondary">We're here to help you find or promote your next big event.</p>
      </div>
      <div className="row g-5">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm h-100 p-4 bg-primary text-white rounded-3">
            <h3 className="fw-bold mb-3">Contact Information</h3>
            <p className="mb-4">Fill out the form and our team will get back to you within 24 hours.</p>
            <p><i className="bi bi-geo-alt-fill me-2"></i> Vadodara, Gujarat, India</p>
            <p><i className="bi bi-telephone-fill me-2"></i> +91 9265526360</p>
            <p><i className="bi bi-envelope-fill me-2"></i> wime@gmail.com</p>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card border-0 shadow-sm h-100 p-4 bg-white rounded-3">
            {submitted ? (
              <div className="alert alert-success my-auto text-center py-4">
                <h4 className="fw-bold">Message Sent!</h4>
                <p className="mb-0">Thank you for reaching out. We will get in touch with you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Your Name</label>
                  <input type="text" className="form-control" placeholder="John Doe" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email Address</label>
                  <input type="email" className="form-control" placeholder="name@example.com" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Message</label>
                  <textarea className="form-control" rows="4" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}