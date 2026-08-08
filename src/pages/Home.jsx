import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Star, CheckCircle, Truck, Package, Lock, Quote } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories, testimonials, stats } from '../data/products';
import './Home.css';

const featuredProducts = products.slice(0, 5);

const categoryIcons = {
  bricks: '🧱', cement: '🪣', steel: '🔩', sand: '⛏️',
  plumbing: '🚿', electrical: '⚡', hardware: '🔨', paints: '🎨',
  tiles: '🟫', wood: '🪵', waterproofing: '💧', safety: '🦺'
};

export default function Home() {
  const [catStart, setCatStart] = useState(0);
  const visibleCats = categories.slice(catStart, catStart + 8);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {/* Construction site SVG background */}
          <svg className="hero-svg-bg" viewBox="0 0 1400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <rect width="1400" height="520" fill="#1C2B3A"/>
            {/* Sky gradient */}
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF8C00" stopOpacity="0.6"/>
                <stop offset="60%" stopColor="#1C2B3A" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="heroOvl" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="transparent"/>
                <stop offset="55%" stopColor="#1C2B3A" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#1C2B3A"/>
              </linearGradient>
            </defs>
            <rect width="1400" height="520" fill="url(#skyGrad)"/>
            
            {/* Building structure */}
            <rect x="550" y="80" width="500" height="440" fill="#2D3748" opacity="0.8"/>
            {/* Building floors */}
            {[0,1,2,3,4,5].map(i => (
              <g key={i}>
                <rect x="550" y={80 + i * 65} width="500" height="3" fill="#4A5568" opacity="0.9"/>
                {/* Windows */}
                {[0,1,2,3,4,5,6].map(j => (
                  <rect key={j} x={570 + j * 65} y={92 + i * 65} width="40" height="45" rx="2"
                    fill={Math.random() > 0.4 ? "#FFC93C" : "#1A2535"} opacity="0.7"/>
                ))}
              </g>
            ))}
            
            {/* Crane */}
            <rect x="980" y="20" width="8" height="460" fill="#E2A000" opacity="0.9"/>
            <rect x="830" y="20" width="160" height="6" fill="#E2A000" opacity="0.9"/>
            <line x1="830" y1="23" x2="984" y2="480" stroke="#E2A000" strokeWidth="2" opacity="0.6"/>
            <line x1="984" y1="26" x2="870" y2="150" stroke="#E2A000" strokeWidth="2" opacity="0.6"/>
            
            {/* Sun/warm glow */}
            <circle cx="900" cy="60" r="80" fill="#FF8C00" opacity="0.15"/>
            <circle cx="900" cy="60" r="40" fill="#FF8C00" opacity="0.2"/>
            
            {/* Scaffold */}
            {[0,1,2,3].map(col => (
              [0,1,2,3,4].map(row => (
                <rect key={`${col}-${row}`} x={555 + col * 30} y={90 + row * 65} width="2" height="65" fill="#718096" opacity="0.5"/>
              ))
            ))}
            
            {/* Ground materials */}
            <rect x="400" y="420" width="200" height="20" rx="2" fill="#8B6914" opacity="0.7"/>
            <rect x="420" y="400" width="60" height="22" rx="2" fill="#F5A800" opacity="0.4"/>
            <rect x="490" y="410" width="80" height="12" rx="2" fill="#9CA3AF" opacity="0.5"/>

            {/* Overlay for text readability */}
            <rect width="1400" height="520" fill="url(#heroOvl)"/>
          </svg>
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">India's Trusted Construction Marketplace</p>
            <h1 className="hero-headline">
              Everything you need,<br/>
              <span className="hero-accent">to build anything.</span>
            </h1>
            <p className="hero-sub">
              Quality products. Verified suppliers. On-time delivery — straight to your site.
            </p>
            <div className="hero-ctas">
              <Link to="/shop" className="btn-primary hero-cta-primary">
                Shop Materials <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="btn-outline-white">
                Request Bulk Quote
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-item"><CheckCircle size={14} color="#F5A800"/> <span>Verified Suppliers</span></div>
              <div className="trust-item"><Truck size={14} color="#F5A800"/> <span>Fast Delivery</span></div>
              <div className="trust-item"><Package size={14} color="#F5A800"/> <span>Bulk Orders</span></div>
              <div className="trust-item"><Lock size={14} color="#F5A800"/> <span>Secure Payments</span></div>
            </div>
          </div>

          {/* Side widgets */}
          <div className="hero-side">
            <div className="hero-widget">
              <div className="widget-header">
                <span className="widget-icon">📦</span>
                <div>
                  <strong>Track Your Order</strong>
                  <p>Enter your order ID to get real-time updates</p>
                </div>
              </div>
              <input type="text" placeholder="Enter Order ID" className="widget-input" />
              <button className="btn-primary" style={{width:'100%', justifyContent:'center'}}>Track Order</button>
            </div>
            <div className="hero-widget hero-widget-alt">
              <div className="widget-header">
                <span className="widget-icon">📋</span>
                <div>
                  <strong>Need Bulk Materials?</strong>
                  <p>Get the best prices for large orders from verified suppliers.</p>
                </div>
              </div>
              <Link to="/shop" className="widget-link">Request a Quote →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Browse</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <div className="cat-nav">
              <button className="cat-nav-btn" onClick={() => setCatStart(Math.max(0, catStart - 4))} disabled={catStart === 0}>
                <ChevronLeft size={18} />
              </button>
              <Link to="/shop" className="view-all-link">View all categories →</Link>
              <button className="cat-nav-btn" onClick={() => setCatStart(Math.min(categories.length - 8, catStart + 4))} disabled={catStart >= categories.length - 8}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="categories-grid">
            {visibleCats.map(cat => (
              <Link key={cat.id} to={`/shop?cat=${cat.id}`} className="category-card">
                <div className="cat-icon">{categoryIcons[cat.id]}</div>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{cat.count}+ Products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS + PROJECTS */}
      <section className="section-featured">
        <div className="container">
          <div className="featured-layout">
            <div className="featured-products-col">
              <div className="section-header">
                <div>
                  <p className="section-label">Handpicked for You</p>
                  <h2 className="section-title">Featured Products</h2>
                </div>
                <Link to="/shop" className="view-all-link">View all products →</Link>
              </div>
              <div className="featured-products-grid">
                {featuredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>

            {/* Projects sidebar */}
            <div className="projects-sidebar">
              <div className="sidebar-header">
                <h3>Your Projects</h3>
                <Link to="#" className="view-all-link">View all</Link>
              </div>
              <div className="project-card-item">
                <div className="project-thumb">🏗️</div>
                <div className="project-details">
                  <strong>Skyline Heights</strong>
                  <span>Hyderabad, TS</span>
                  <div className="progress-row">
                    <div className="progress-track">
                      <div className="progress-fill on-track" style={{width:'75%'}}></div>
                    </div>
                    <span className="progress-pct on-track">On Track • 75%</span>
                  </div>
                </div>
              </div>
              <div className="project-card-item">
                <div className="project-thumb">🏘️</div>
                <div className="project-details">
                  <strong>Green Valley Villas</strong>
                  <span>Vijayawada, AP</span>
                  <div className="progress-row">
                    <div className="progress-track">
                      <div className="progress-fill completed" style={{width:'100%'}}></div>
                    </div>
                    <span className="progress-pct completed">Completed • 100%</span>
                  </div>
                </div>
              </div>
              <Link to="/services" className="sidebar-cta">
                <span>🔍</span> Monitor a New Project
              </Link>

              {/* Quick order */}
              <div className="quick-order-box">
                <h4>Quick Bulk Quote</h4>
                <p>Get best prices for large orders directly from suppliers</p>
                <select className="quick-select">
                  <option>Select Material</option>
                  <option>Cement (Bags)</option>
                  <option>Steel TMT (kg)</option>
                  <option>Bricks (pieces)</option>
                  <option>Sand (ton)</option>
                </select>
                <input type="number" placeholder="Quantity needed" className="quick-input" />
                <button className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'8px'}}>
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY BRICKBUDDY */}
      <section className="section-why">
        <div className="container">
          <div className="why-layout">
            <div className="why-content">
              <p className="section-label">Why Choose Us</p>
              <h2 className="why-title">Built for the construction industry</h2>
              <p className="why-desc">
                BrickBuddy connects property owners, contractors, and suppliers on a single platform — so you get real prices, real materials, and real-time delivery to your site.
              </p>
              <div className="why-features">
                {[
                  { icon: '✅', title: 'Verified Suppliers', desc: 'Every supplier is vetted and rated by our team. No fake listings.' },
                  { icon: '💸', title: 'Guaranteed Best Price', desc: 'We match or beat any local market price for bulk orders.' },
                  { icon: '🚚', title: 'Site-to-Site Delivery', desc: 'Dedicated logistics network covering 50+ cities in South India.' },
                  { icon: '🔒', title: 'Secure Payments', desc: 'Pay with UPI, bank transfer, or credit — escrow protection on all orders.' },
                ].map((f, i) => (
                  <div key={i} className="why-feature">
                    <span className="why-feature-icon">{f.icon}</span>
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/services" className="btn-primary" style={{width:'fit-content'}}>
                Explore All Services <ArrowRight size={16}/>
              </Link>
            </div>
            <div className="why-visual">
              <svg viewBox="0 0 460 400" xmlns="http://www.w3.org/2000/svg" width="100%">
                <rect width="460" height="400" rx="16" fill="#F9FAFB"/>
                {/* Building outline */}
                <rect x="80" y="80" width="300" height="280" rx="4" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="2"/>
                {/* Floors */}
                {[0,1,2,3,4].map(i => (
                  <g key={i}>
                    <rect x="80" y={80+i*54} width="300" height="2" fill="#A0AEC0"/>
                    {[0,1,2,3].map(j => (
                      <rect key={j} x={95+j*70} y={92+i*54} width="45" height="36" rx="3"
                        fill={i === 2 && j === 1 ? '#F5A800' : '#FFFBEB'} stroke="#E2E8F0" strokeWidth="0.5"/>
                    ))}
                  </g>
                ))}
                {/* Crane */}
                <rect x="360" y="20" width="6" height="340" fill="#F5A800"/>
                <rect x="260" y="20" width="106" height="5" fill="#F5A800"/>
                {/* Progress indicators */}
                <rect x="30" y="140" width="40" height="120" rx="4" fill="#F5A800" opacity="0.15" stroke="#F5A800" strokeWidth="2"/>
                <rect x="30" y="170" width="40" height="90" rx="3" fill="#F5A800"/>
                <text x="50" y="135" textAnchor="middle" fill="#F5A800" fontSize="10" fontWeight="bold">75%</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-testimonials">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'40px'}}>
            <p className="section-label">Customer Stories</p>
            <h2 className="section-title">What builders say about us</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <Quote size={24} color="#F5A800" style={{marginBottom:'12px'}}/>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-stars">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} fill="#F5A800" color="#F5A800"/>
                  ))}
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section-cta-banner">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-content">
              <h2>Ready to build smarter?</h2>
              <p>Join 15,000+ contractors and developers already saving on construction materials.</p>
            </div>
            <div className="cta-banner-actions">
              <Link to="/shop" className="btn-primary">Shop Materials →</Link>
              <Link to="/about" className="btn-outline-white">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
