import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Supplier CTA strip */}
      <div className="footer-cta-strip">
        <div className="container">
          <div className="footer-strip-inner">
            <div className="strip-badges">
              <div className="strip-badge"><span>🏆</span><div><strong>Best Quality</strong><span>Guaranteed</span></div></div>
              <div className="strip-badge"><span>💰</span><div><strong>Lowest Prices</strong><span>Always</span></div></div>
              <div className="strip-badge"><span>↩</span><div><strong>Easy Returns</strong><span>Hassle-free</span></div></div>
              <div className="strip-badge"><span>📞</span><div><strong>24/7 Support</strong><span>We're here to help</span></div></div>
            </div>
            <div className="strip-supplier">
              <div>
                <strong>Are you a supplier?</strong>
                <p>Join BrickBuddy and grow your business</p>
              </div>
              <button className="btn-primary">Become a Supplier →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-brick">Brick</span>
                <span className="footer-logo-buddy">Buddy</span>
              </div>
              <p className="footer-desc">India's trusted B2B marketplace for construction materials. Quality products. Verified suppliers. On-time delivery.</p>
              <div className="footer-socials">
                <a href="#" className="social-btn">f</a>
                <a href="#" className="social-btn">in</a>
                <a href="#" className="social-btn">tw</a>
                <a href="#" className="social-btn">yt</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop Materials</Link></li>
                <li><Link to="/services">Our Services</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="#">Become a Supplier</Link></li>
                <li><Link to="#">Bulk Orders</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Categories</h4>
              <ul>
                <li><Link to="/shop?cat=bricks">Bricks & Blocks</Link></li>
                <li><Link to="/shop?cat=cement">Cement</Link></li>
                <li><Link to="/shop?cat=steel">Steel & TMT</Link></li>
                <li><Link to="/shop?cat=sand">Sand & Aggregates</Link></li>
                <li><Link to="/shop?cat=plumbing">Plumbing</Link></li>
                <li><Link to="/shop?cat=electrical">Electrical</Link></li>
                <li><Link to="/shop?cat=paints">Paints & Chemicals</Link></li>
                <li><Link to="/shop?cat=tiles">Tiles & Flooring</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><Link to="#">Help Center</Link></li>
                <li><Link to="#">Track Your Order</Link></li>
                <li><Link to="#">Return Policy</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
                <li><Link to="#">GST & Billing</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Us</h4>
              <div className="footer-contact">
                <p>📍 Hyderabad, Telangana 500072</p>
                <p>📞 1800-123-4567 (Toll Free)</p>
                <p>✉️ support@brickbuddy.in</p>
                <p>🕐 Mon–Sat, 8AM – 8PM</p>
              </div>
              <div className="footer-apps">
                <button className="app-btn">📱 App Store</button>
                <button className="app-btn">🤖 Play Store</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>© 2025 BrickBuddy. All rights reserved.</p>
            <div className="payment-logos">
              <span>UPI</span>
              <span>Razorpay</span>
              <span>VISA</span>
              <span>MC</span>
              <span>NetBanking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
