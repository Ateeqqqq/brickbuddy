import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import './Account.css';

export default function ComingSoon({ title, backTo = '/account' }) {
  return (
    <main className="coming-soon-page">
      <div className="container">
        <section className="coming-soon-card">
          <Construction size={42} color="#F5A800" />
          <p className="section-label">BrickBuddy roadmap</p>
          <h1>{title}</h1>
          <p>This workspace is coming soon. We’re preparing a better way to manage your construction marketplace activity.</p>
          <Link to={backTo} className="btn-primary"><ArrowLeft size={16} /> Back to {backTo === '/account' ? 'Account' : 'Dashboard'}</Link>
        </section>
      </div>
    </main>
  );
}
