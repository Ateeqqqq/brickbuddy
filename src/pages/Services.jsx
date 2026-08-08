import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { services } from '../data/products';
import './Services.css';

const howItWorks = [
  { step: '01', title: 'Browse & Select', desc: 'Explore 1,000+ verified products across all construction categories. Compare prices, ratings, and supplier reviews.' },
  { step: '02', title: 'Request Quote or Order', desc: 'For smaller orders, buy directly. For bulk orders, submit a quote request and receive competitive bids within 2 hours.' },
  { step: '03', title: 'Verify & Pay Securely', desc: 'Review your order details, confirm pricing, and pay via UPI, NEFT, or credit with full payment protection.' },
  { step: '04', title: 'Track Delivery to Site', desc: 'Get real-time delivery tracking from warehouse to your site. Our logistics team coordinates with your site supervisor.' },
];

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    period: '/month',
    desc: 'For individual buyers and small contractors',
    features: [
      'Access to all product listings',
      'Standard pricing',
      'Basic order tracking',
      'Email support',
      'Up to 5 projects',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '₹2,499',
    period: '/month',
    desc: 'For active contractors and construction firms',
    features: [
      'Everything in Starter',
      'Bulk order pricing (up to 15% off)',
      'Priority delivery slots',
      'Dedicated account manager',
      'Unlimited projects + monitoring',
      'GST-ready invoicing',
      'Analytics dashboard',
    ],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large construction companies and developers',
    features: [
      'Everything in Professional',
      'Custom pricing agreements',
      'API integration',
      'Multi-site management',
      'Dedicated logistics team',
      'ERP system integration',
      'White-label options',
    ],
    cta: 'Contact Sales',
    highlight: false,
  }
];

export default function Services() {
  return (
    <div className="services-page">
      {/* Hero */}
      <section className="services-hero">
        <div className="container">
          <p className="section-label">What We Offer</p>
          <h1 className="services-hero-title">
            One Platform.<br/>
            <span>Everything You Need to Build.</span>
          </h1>
          <p className="services-hero-desc">
            BrickBuddy powers the full construction supply chain — from material sourcing and supplier management to project monitoring, skilled labor, and last-mile delivery.
          </p>
          <Link to="/shop" className="btn-primary services-hero-cta">
            Start Shopping <ArrowRight size={16}/>
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section className="services-grid-section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <p className="section-label">Our Modules</p>
            <h2 className="section-title" style={{fontSize:'36px'}}>Six pillars of smarter construction</h2>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.description}</p>
                <ul className="service-features">
                  {s.features.map((f, j) => (
                    <li key={j}>
                      <CheckCircle size={14} color="#F5A800"/>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/shop" className="service-link">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}}>
            <p className="section-label">Process</p>
            <h2 className="section-title" style={{fontSize:'36px'}}>How BrickBuddy Works</h2>
            <p style={{fontSize:'15px', color:'var(--bb-gray-500)', maxWidth:'520px', margin:'12px auto 0'}}>
              From browsing to delivery, we've streamlined every step of the construction supply process.
            </p>
          </div>
          <div className="hiw-steps">
            {howItWorks.map((step, i) => (
              <div key={i} className="hiw-step">
                <div className="hiw-step-number">{step.step}</div>
                {i < howItWorks.length - 1 && <div className="hiw-connector"/>}
                <div className="hiw-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <p className="section-label">Pricing</p>
            <h2 className="section-title" style={{fontSize:'36px'}}>Plans for every builder</h2>
          </div>
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.highlight ? 'highlighted' : ''}`}>
                {plan.highlight && <div className="pricing-badge">Most Popular</div>}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price-row">
                  <span className="plan-price">{plan.price}</span>
                  <span className="plan-period">{plan.period}</span>
                </div>
                <p className="plan-desc">{plan.desc}</p>
                <ul className="plan-features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <CheckCircle size={14} color={plan.highlight ? '#F5A800' : '#38A169'}/>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`plan-cta ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'56px 0', background:'var(--bb-gray-50)'}}>
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{fontFamily:'var(--ff-display)', fontSize:'36px', fontWeight:'900', textTransform:'uppercase', marginBottom:'12px'}}>
            Ready to transform your supply chain?
          </h2>
          <p style={{fontSize:'15px', color:'var(--bb-gray-500)', marginBottom:'28px', maxWidth:'500px', margin:'0 auto 28px'}}>
            Talk to our team about how BrickBuddy can be customized for your construction business.
          </p>
          <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/shop" className="btn-primary">Shop Now <ArrowRight size={16}/></Link>
            <Link to="/about" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
