import React from 'react';

export default function About() {
  return (
    <>
      <div className="bg-primary text-white text-center py-5 shadow">
        <div className="container py-4">
          <h1 className="display-4 fw-bold">Connecting the World Through Events</h1>
          <p className="lead">Your premier destination for discovering and listing global experiences.</p>
        </div>
      </div>
      <div className="container my-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-4">Our Mission</h2>
            <p className="text-muted fs-5">
              Where Is My Event.com was founded with a simple goal: to make finding local and international events as easy as a single click. From small community gatherings in Vadodara to massive concerts in Mumbai and Delhi, we bring everything under one roof.
            </p>
            <p className="text-muted">
              We empower organizers to reach targeted attendees with transparent listings and zero intermediate platform cuts.
            </p>
          </div>
          <div className="col-lg-6">
            <img 
              src="https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=800" 
              className="img-fluid rounded-3 shadow" 
              alt="Events" 
            />
          </div>
        </div>
      </div>
    </>
  );
}