import React from 'react';
import { Link } from 'react-router-dom';
import './Account.css';

export default function NotFound() {
  return (
    <main className="coming-soon-page">
      <div className="container">
        <section className="coming-soon-card">
          <p className="section-label">404 error</p>
          <h1>Page not found</h1>
          <p>That BrickBuddy page doesn’t exist or may have moved.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </section>
      </div>
    </main>
  );
}
