import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, Truck, Heart, LogOut, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { categoryHierarchy, marketplaceLocations } from '../data/products';
import { flattenSearchResults, searchMarketplace } from '../utils/marketplaceSearch';
import MarketplaceSearchSuggestions from './MarketplaceSearchSuggestions';
import { useAuth } from '../context/AuthContext';
import { useVendor, getVendorMarketplaceProducts } from '../context/VendorContext';
import './Navbar.css';

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { vendorProducts } = useVendor();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLocation = new URLSearchParams(location.search).get('location') || marketplaceLocations[0];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = searchMarketplace(normalizedQuery, 5, getVendorMarketplaceProducts(vendorProducts));

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const results = flattenSearchResults(searchResults);
    if (normalizedQuery && searchOpen && activeSearchIndex >= 0 && results[activeSearchIndex]) {
      selectSearchResult(results[activeSearchIndex]);
      return;
    }
    if (normalizedQuery) navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  const selectSearchResult = (result) => {
    setSearchQuery('');
    setSearchOpen(false);
    setActiveSearchIndex(-1);
    if (result.type === 'product') navigate(`/shop/${result.id}`);
    else if (result.type === 'vendor') navigate(`/vendor/${result.id}`);
    else navigate(`/shop?cat=${result.categoryId}${result.subcategoryId ? `&subcat=${result.subcategoryId}` : ''}`);
  };

  useEffect(() => {
    const closeSearch = (event) => {
      if (!searchRef.current?.contains(event.target)) setSearchOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setActiveSearchIndex(-1);
      }
    };
    document.addEventListener('mousedown', closeSearch);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeSearch);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const handleSearchKeyDown = (event) => {
    const results = flattenSearchResults(searchResults);
    if (!searchOpen || normalizedQuery.length < 2 || !results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSearchIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSearchIndex((index) => (index - 1 + results.length) % results.length);
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCategoriesOpen(false);
    setMobileCategory(null);
  }, [location]);

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
                <img className="brand-logo" src="/assets/brickbuddy-logo.jpg" alt="BrickBuddy" />
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

            <form className="search-bar" onSubmit={handleSearchSubmit} ref={searchRef}>
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
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                setActiveSearchIndex(-1);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <Search size={18} />
              </button>
              {searchOpen && normalizedQuery.length >= 2 && (
                <MarketplaceSearchSuggestions
                  className="search-results"
                  results={searchResults}
                  query={searchQuery}
                  activeIndex={activeSearchIndex}
                  onSelect={selectSearchResult}
                />
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
              <Link to="/cart" className="action-item cart-action">
                <div className="cart-icon-wrap">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
                <span>Cart</span>
              </Link>
              <Link to="/wishlist" className="action-item wishlist-action">
                <div className="wishlist-icon-wrap">
                  <Heart size={20} />
                  {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
                </div>
                <span>Wishlist</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to={currentUser?.role === 'vendor' ? '/vendor/dashboard' : '/account'} className="action-item">
                    <User size={20} />
                    <span>{currentUser?.role === 'vendor' ? 'Vendor Dashboard' : 'Account'}</span>
                  </Link>
                  <button type="button" className="action-item action-button" onClick={logout} title={`Log out ${currentUser?.name || 'account'}`}>
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="action-item">
                  <User size={20} />
                  <span>Login / Register</span>
                </Link>
              )}
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
            <div
              className="category-menu-wrapper"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                className="all-categories"
                onClick={() => setCategoriesOpen((open) => !open)}
                aria-expanded={categoriesOpen}
                aria-controls="desktop-category-menu"
              >
                <Menu size={16} />
                <span>All Categories</span>
                <ChevronDown size={14} />
              </button>
              {categoriesOpen && (
                <div className="category-mega-menu" id="desktop-category-menu">
                  {categoryHierarchy.map((category) => (
                    <div className="mega-category" key={category.id}>
                      <Link
                        to={`/shop?cat=${category.id}`}
                        className="mega-category-heading"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        <span className="mega-category-icon">{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                      <div className="mega-subcategories">
                        {category.subcategories?.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            to={`/shop?cat=${category.id}&subcat=${subcategory.id}`}
                            onClick={() => setCategoriesOpen(false)}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          <div className="mobile-category-section">
            <button
              type="button"
              className="mobile-category-toggle"
              onClick={() => setMobileCategory(mobileCategory ? null : 'all')}
              aria-expanded={Boolean(mobileCategory)}
            >
              <span>All Categories</span>
              <ChevronDown size={17} className={mobileCategory ? 'expanded' : ''} />
            </button>
            {mobileCategory && (
              <div className="mobile-category-list">
                {categoryHierarchy.map((category) => (
                  <div className="mobile-category-item" key={category.id}>
                    <div className="mobile-category-row">
                      <Link to={`/shop?cat=${category.id}`} className="mobile-category-link">
                        <span>{category.icon}</span>{category.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileCategory(mobileCategory === category.id ? 'all' : category.id)}
                        aria-label={`Show ${category.name} subcategories`}
                      >
                        <ChevronRight size={16} className={mobileCategory === category.id ? 'expanded' : ''} />
                      </button>
                    </div>
                    {mobileCategory === category.id && (
                      <div className="mobile-subcategory-list">
                        {category.subcategories?.map((subcategory) => (
                          <Link key={subcategory.id} to={`/shop?cat=${category.id}&subcat=${subcategory.id}`}>
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mobile-actions">
            <Link to="#" className="mobile-link">📦 Track Order</Link>
            <Link to="#" className="mobile-link">🏪 Become a Supplier</Link>
            <Link to="/wishlist" className="mobile-link">♡ Wishlist</Link>
            {isAuthenticated ? (
              <>
                <Link to={currentUser?.role === 'vendor' ? '/vendor/dashboard' : '/account'} className="mobile-link">👤 {currentUser?.role === 'vendor' ? 'Vendor Dashboard' : 'Account'}</Link>
                <button type="button" className="mobile-link mobile-action-button" onClick={logout}>↪ Logout</button>
              </>
            ) : (
              <Link to="/login" className="mobile-link">👤 Login / Sign Up</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
