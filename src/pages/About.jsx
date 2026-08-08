import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Award, Users } from 'lucide-react';
import { stats } from '../data/products';
import './About.css';

const values = [
  { icon: '🤝', title: 'Trust First', desc: 'Every supplier on BrickBuddy is verified, rated, and held accountable. We stake our reputation on yours.' },
  { icon: '⚡', title: 'Speed Matters', desc: 'Construction timelines are unforgiving. We built our logistics network to deliver on time, every time.' },
  { icon: '💡', title: 'Transparency', desc: 'No hidden markups, no surprise fees. The price you see is the price you pay, backed by GST invoices.' },
  { icon: '🌱', title: 'Built to Last', desc: 'We are building infrastructure for India\'s construction industry, not just an app for one season.' },
];

const team = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', initials: 'AM', bio: '12 years in construction tech and supply chain' },
  { name: 'Kavya Iyer', role: 'Co-founder & COO', initials: 'KI', bio: 'Former operations lead at a logistics unicorn' },
  { name: 'Rohan Das', role: 'Head of Supplier Relations', initials: 'RD', bio: '15 years managing material vendor networks' },
  { name: 'Sneha Patil', role: 'Head of Engineering', initials: 'SP', bio: 'Built marketplace platforms at scale' },
];

const milestones = [
  { year: '2022', title: 'BrickBuddy Founded', desc: 'Started in Hyderabad with a mission to fix construction procurement.' },
  { year: '2023', title: '1,000 Suppliers Onboarded', desc: 'Expanded across Telangana and Andhra Pradesh.' },
  { year: '2024', title: '5,000+ Projects Served', desc: 'Launched bulk ordering and project monitoring modules.' },
  { year: '2025', title: 'Pan-South India Expansion', desc: 'Crossed 15,000 verified suppliers across 6 states.' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div>
            <p className="section-label">Our Story</p>
            <h1 className="about-hero-title">
              Building India's most trusted construction marketplace
            </h1>
            <p className="about-hero-desc">
              BrickBuddy started with a simple frustration: construction material sourcing was slow, opaque, and full of middlemen. We set out to fix that — one verified supplier, one on-time delivery at a time.
            </p>
            <div className="about-hero-ctas">
              <Link to="/shop" className="btn-primary">Browse Marketplace <ArrowRight size={16}/></Link>
              <Link to="/services" className="btn-outline">Our Services</Link>
            </div>
          </div>
          <div className="about-hero-visual">
            <svg viewBox="0 0 400 360" xmlns="http://www.w3.org/2000/svg" width="100%">
              <rect width="400" height="360" rx="20" fill="#1A1A1A"/>
              <rect x="40" y="200" width="320" height="120" rx="4" fill="#2D3748"/>
              {/* Buildings skyline */}
              <rect x="60" y="120" width="50" height="200" fill="#3D4759"/>
              <rect x="120" y="80" width="60" height="240" fill="#4A5568"/>
              <rect x="190" y="140" width="45" height="180" fill="#3D4759"/>
              <rect x="245" y="60" width="65" height="260" fill="#4A5568"/>
              <rect x="320" y="160" width="40" height="160" fill="#3D4759"/>
              {/* Windows */}
              {[120,160,200,240,280].map((y,i) => (
                <g key={i}>
                  <rect x="130" y={y} width="10" height="14" fill="#F5A800" opacity={i%2===0 ? 0.9 : 0.3}/>
                  <rect x="150" y={y} width="10" height="14" fill="#F5A800" opacity={i%3===0 ? 0.9 : 0.3}/>
                  <rect x="255" y={y-20} width="10" height="14" fill="#F5A800" opacity={i%2===1 ? 0.9 : 0.3}/>
                  <rect x="280" y={y-20} width="10" height="14" fill="#F5A800" opacity={i%4===0 ? 0.9 : 0.3}/>
                </g>
              ))}
              {/* Crane */}
              <rect x="200" y="20" width="5" height="180" fill="#F5A800"/>
              <rect x="150" y="20" width="100" height="4" fill="#F5A800"/>
              <line x1="150" y1="22" x2="202" y2="100" stroke="#F5A800" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="about-stat">
                <span className="about-stat-value">{s.value}</span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon"><Target size={28} color="#F5A800"/></div>
              <h3>Our Mission</h3>
              <p>To make construction material procurement as simple as online shopping — transparent pricing, verified quality, and reliable delivery for every builder in India, from individual homeowners to large developers.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><Eye size={28} color="#F5A800"/></div>
              <h3>Our Vision</h3>
              <p>A construction industry where remote property owners can monitor builds from anywhere, contractors source materials at fair prices, and skilled labor finds consistent, well-paying work — all on one platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <p className="section-label">What Drives Us</p>
            <h2 className="section-title" style={{fontSize:'34px'}}>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <span className="value-icon">{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}}>
            <p className="section-label">Our Journey</p>
            <h2 className="section-title" style={{fontSize:'34px', color:'var(--bb-white)'}}>Milestones</h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <span className="timeline-year">{m.year}</span>
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
                <div className="timeline-dot"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <p className="section-label">Leadership</p>
            <h2 className="section-title" style={{fontSize:'34px'}}>Meet the Team</h2>
          </div>
          <div className="team-grid">
            {team.map((t, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{t.initials}</div>
                <h4>{t.name}</h4>
                <span className="team-role">{t.role}</span>
                <p>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta-box">
            <Award size={32} color="#F5A800" style={{marginBottom:'16px'}}/>
            <h2>Join thousands of builders who trust BrickBuddy</h2>
            <p>Whether you're building a home or managing a portfolio of projects, we're here to help you build better, together.</p>
            <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'24px'}}>
              <Link to="/shop" className="btn-primary">Start Shopping <ArrowRight size={16}/></Link>
              <Link to="#" className="btn-outline">Become a Supplier</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
