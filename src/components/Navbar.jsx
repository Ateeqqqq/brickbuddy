import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, Truck, Menu, X, ChevronDown } from 'lucide-react';
import { categories, marketplaceLocations, products, vendors } from '../data/products';
import './Navbar.css';

export default function Navbar({ cartCount = 3 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLocation = new URLSearchParams(location.search).get('location') || marketplaceLocations[0];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (normalizedQuery.length < 2) return [];

    const productResults = products
      .filter((product) => {
        const category = categories.find((entry) => entry.id === product.category);
        const searchableText = [
          product.name,
          product.brand,
          product.supplier,
          product.location,
          category?.name,
          ...(product.vendorOffers || []).flatMap((offer) => [offer.location, offer.supplier]),
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
      .map((product) => ({ type: 'Product', id: product.id, name: product.name, meta: product.brand || product.category }));

    const vendorResults = vendors
      .filter((vendor) => [vendor.name, vendor.brand, vendor.location, vendor.city, vendor.state]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery))
      .map((vendor) => ({ type: 'Vendor', id: vendor.id, name: vendor.name, meta: vendor.location }));

    return [...productResults, ...vendorResults].slice(0, 8);
  }, [normalizedQuery]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (normalizedQuery) navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const selectSearchResult = (result) => {
    setSearchQuery('');
    navigate(result.type === 'Product' ? `/shop/${result.id}` : `/vendor/${result.id}`);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="navbar-topbar">
        <div className="container">
          <div className="topbar-inner">
            <div className="topbar-logo">
              <Link to="/" className="logo-link">
                <div className="logo-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="0" y="14" width="12" height="7" rx="1" fill="#F5A800"/>
                    <rect x="13" y="14" width="15" height="7" rx="1" fill="#F5A800"/>
                    <rect x="0" y="0" width="7" height="13" rx="1" fill="#F5A800" opacity="0.8"/>
                    <rect x="8" y="6" width="20" height="7" rx="1" fill="#F5A800" opacity="0.6"/>
                  </svg>
                </div>
                <div className="logo-text">
                  <span className="logo-brick">Brick</span>
                  <span className="logo-buddy">Buddy</span>
                  <span className="logo-tagline">Building Better Together</span>
                </div>
              </Link>
              <label className="location-chip">
                <MapPin size={13} color="#F5A800" />
                <span className="location-label">Near you</span>
                <select
                  className="location-select"
                  value={selectedLocation}
                  onChange={(event) => {
                    window.location.href = `/shop?location=${encodeURIComponent(event.target.value)}`;
                  }}
                  aria-label="Select marketplace location"
                >
                  {marketplaceLocations.map((availableLocation) => (
                    <option key={availableLocation} value={availableLocation}>{availableLocation}</option>
                  ))}
                </select>
                <ChevronDown size={12} />
              </label>
            </div>

            <form className="search-bar" onSubmit={handleSearchSubmit}>
              <select className="search-cat">
                <option>All Categories</option>
                <option>Bricks & Blocks</option>
                <option>Cement</option>
                <option>Steel & TMT</option>
                <option>Sand & Aggregates</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Hardware</option>
                <option>Paints</option>
              </select>
              <input
                type="text"
                placeholder="Search materials, brands, products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <Search size={18} />
              </button>
              {normalizedQuery.length >= 2 && (
                <div className="search-results" role="listbox">
                  {searchResults.length > 0 ? searchResults.map((result) => (
                    <button
                      type="button"
                      className="search-result"
                      key={`${result.type}-${result.id}`}
                      onClick={() => selectSearchResult(result)}
                    >
                      <span className="search-result-type">{result.type}</span>
                      <span className="search-result-content">
                        <strong>{result.name}</strong>
                        <small>{result.meta}</small>
                      </span>
                    </button>
                  )) : (
                    <div className="search-no-results">No products or vendors found</div>
                  )}
                </div>
              )}
            </form>

            <div className="topbar-actions">
              <Link to="#" className="action-item">
                <Truck size={20} />
                <span>Track Order</span>
              </Link>
              <Link to="#" className="action-item">
                <User size={20} />
                <span>Supplier</span>
              </Link>
              <Link to="/shop" className="action-item cart-action">
                <div className="cart-icon-wrap">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
                <span>Cart</span>
              </Link>
              <Link to="#" className="action-item">
                <User size={20} />
                <span>Login</span>
              </Link>
            </div>

            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`navbar-main ${isScrolled ? 'sticky' : ''}`}>
        <div className="container">
          <div className="mainnav-inner">
            <div className="all-categories">
              <Menu size={16} />
              <span>All Categories</span>
            </div>

            <div className="nav-links">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/shop" className="nav-link">Bulk Orders</Link>
              <Link to="/about" className="nav-link">Offers</Link>
            </div>

            <div className="nav-trust">
              <span className="trust-chip">✓ Best Prices</span>
              <span className="trust-chip">🔒 Secure Payments</span>
              <span className="trust-chip">↩ Easy Returns</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <Search size={16} />
            <input type="text" placeholder="Search products..." />
          </div>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="mobile-link">
              {link.label}
            </Link>
          ))}
          <div className="mobile-actions">
            <Link to="#" className="mobile-link">📦 Track Order</Link>
            <Link to="#" className="mobile-link">🏪 Become a Supplier</Link>
            <Link to="#" className="mobile-link">👤 Login / Sign Up</Link>
          </div>
        </div>
      )}
    </>
  );
}
