import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, FileText, MapPin, Search, Scale, ShieldCheck,
  ShoppingCart, Star, Tags
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import VendorCard from '../components/VendorCard';
import MarketplaceSearchSuggestions from '../components/MarketplaceSearchSuggestions';
import heroBanner from '../../banner.png';
import {
  categoryHierarchy,
  marketplaceLocations,
  products,
  stats,
  testimonials,
  vendors,
} from '../data/products';
import { flattenSearchResults, getVendorCatalog, searchMarketplace } from '../utils/marketplaceSearch';
import { useVendor, getVendorMarketplaceProducts } from '../context/VendorContext';
import './Home.css';

const featuredProducts = products.slice(0, 6);
const popularCategoryIds = ['cement', 'steel', 'tiles'];

export default function Home() {
  const { vendorProducts } = useVendor();
  const navigate = useNavigate();
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [marketplaceLocation, setMarketplaceLocation] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const searchRef = useRef(null);

  const vendorCatalog = useMemo(() => getVendorCatalog(), []);

  const featuredVendors = vendorCatalog.slice(0, 4);
  const localVendors = vendorCatalog.filter((vendor) => (
    vendor.location === (marketplaceLocation || marketplaceLocations[0])
  )).slice(0, 4);
  const multipleSupplierProducts = products.filter((product) => (product.vendorOffers?.length || 0) > 1).slice(0, 4);
  const nearbyProducts = products.filter((product) => (
    product.vendorOffers?.some((offer) => offer.location === (marketplaceLocation || marketplaceLocations[0]))
  )).slice(0, 4);

  const searchResults = useMemo(() => searchMarketplace(marketplaceSearch, 5, getVendorMarketplaceProducts(vendorProducts)), [marketplaceSearch, vendorProducts]);

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

  const browseMarketplace = (event) => {
    event.preventDefault();
    const results = flattenSearchResults(searchResults);
    if (marketplaceSearch.trim() && searchOpen && activeSearchIndex >= 0 && results[activeSearchIndex]) {
      selectSearchResult(results[activeSearchIndex]);
      return;
    }
    const params = new URLSearchParams();
    if (marketplaceSearch.trim()) params.set('search', marketplaceSearch.trim());
    if (marketplaceLocation) params.set('location', marketplaceLocation);
    setSearchOpen(false);
    setActiveSearchIndex(-1);
    navigate(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const selectSearchResult = (result) => {
    setMarketplaceSearch('');
    setSearchOpen(false);
    if (result.type === 'product') navigate(`/shop/${result.id}`);
    else if (result.type === 'vendor') navigate(`/vendor/${result.id}`);
    else navigate(`/shop?cat=${result.categoryId}${result.subcategoryId ? `&subcat=${result.subcategoryId}` : ''}`);
  };

  const handleSearchKeyDown = (event) => {
    const results = flattenSearchResults(searchResults);
    if (!searchOpen || marketplaceSearch.trim().length < 2 || !results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSearchIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSearchIndex((index) => (index - 1 + results.length) % results.length);
    }
  };

  return (
    <div className="home">
      <section className="marketplace-hero">
        <img className="marketplace-hero-image" src={heroBanner} alt="" />
        <div className="container marketplace-hero-container">
          <div className="marketplace-hero-content">
            <p className="hero-eyebrow">India&apos;s Trusted Construction Marketplace</p>
            <h1 className="hero-headline">
              Everything You Need<br />
              <span className="hero-accent">to Build.</span>
            </h1>
            <p className="hero-sub">
              Discover construction materials, compare trusted suppliers, and source everything for your site in one marketplace.
            </p>
            <form className="marketplace-search" onSubmit={browseMarketplace} ref={searchRef}>
              <Search size={19} color="#6B6B6B" />
              <input
                type="search"
                placeholder="Search products, brands, or suppliers..."
                value={marketplaceSearch}
                onChange={(event) => {
                  setMarketplaceSearch(event.target.value);
                  setSearchOpen(true);
                  setActiveSearchIndex(-1);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search products, brands, or suppliers"
              />
              <div className="marketplace-search-location">
                <MapPin size={15} />
                <select
                  value={marketplaceLocation}
                  onChange={(event) => setMarketplaceLocation(event.target.value)}
                  aria-label="Choose marketplace location"
                >
                  <option value="">All locations</option>
                  {marketplaceLocations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="marketplace-search-button">Search</button>
              {searchOpen && marketplaceSearch.trim().length >= 2 && (
                <MarketplaceSearchSuggestions
                  className="marketplace-search-results"
                  results={searchResults}
                  query={marketplaceSearch}
                  activeIndex={activeSearchIndex}
                  onSelect={selectSearchResult}
                />
              )}
            </form>
            <div className="hero-ctas">
              <Link to="/shop" className="btn-primary hero-cta-primary">
                Explore Marketplace <ArrowRight size={16} />
              </Link>
              <Link to="/shop" className="btn-outline-white">Find Suppliers</Link>
            </div>
            <div className="hero-trust">
              <span><CheckCircle size={14} /> Verified Suppliers</span>
              <span><CheckCircle size={14} /> Local Offers</span>
              <span><CheckCircle size={14} /> Transparent Pricing</span>
            </div>
          </div>
          <div className="marketplace-hero-panel">
            <span className="hero-panel-kicker">SOURCE WITH CONFIDENCE</span>
            <strong>One place for every build.</strong>
            <div className="hero-panel-stat"><span>16</span><small>construction categories</small></div>
            <div className="hero-panel-stat"><span>{vendors.length}+</span><small>verified suppliers</small></div>
            <Link to="/shop" className="hero-panel-link">Browse marketplace <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="marketplace-stats">
        <div className="container marketplace-stats-grid">
          {stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </div>
      </section>

      <section className="section-categories">
        <div className="container">
          <div className="section-header">
            <div><p className="section-label">Browse construction materials</p><h2 className="section-title">Find Materials by Category</h2></div>
            <Link to="/shop" className="view-all-link">View All Categories →</Link>
          </div>
          <div className="categories-grid">
            {categoryHierarchy.map((category) => (
              <Link key={category.id} to={`/shop?cat=${category.id}`} className="category-card">
                <span className="cat-icon">{category.icon}</span>
                <span className="cat-name">{category.name}</span>
                <span className="cat-count">{category.count}+ Products</span>
                <span className="cat-subpreview">{category.subcategories?.slice(0, 2).map((subcategory) => subcategory.name).join(' · ')}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-popular-subcategories">
        <div className="container">
          <div className="section-header">
            <div><p className="section-label">Popular searches</p><h2 className="section-title">Shop Popular Subcategories</h2></div>
          </div>
          <div className="popular-subcategory-grid">
            {popularCategoryIds.map((categoryId) => {
              const category = categoryHierarchy.find((entry) => entry.id === categoryId);
              return (
                <div className="popular-subcategory-group" key={categoryId}>
                  <div className="popular-subcategory-title"><span>{category.icon}</span><strong>{category.name}</strong></div>
                  <div className="popular-subcategory-links">
                    {category.subcategories.map((subcategory) => (
                      <Link key={subcategory.id} to={`/shop?cat=${category.id}&subcat=${subcategory.id}`}>{subcategory.name}</Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-featured">
        <div className="container">
          <div className="section-header">
            <div><p className="section-label">Trending marketplace picks</p><h2 className="section-title">Popular Products</h2></div>
            <Link to="/shop" className="view-all-link">View All Products →</Link>
          </div>
          <div className="featured-products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => navigate(`/shop/${product.id}`)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-discovery-row">
        <div className="container discovery-row-grid">
          <div>
            <div className="section-header">
              <div><p className="section-label">Compare marketplace offers</p><h2 className="section-title">Multiple Supplier Products</h2></div>
              <Link to="/shop" className="view-all-link">View All →</Link>
            </div>
            <div className="discovery-products-grid">
              {multipleSupplierProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => navigate(`/shop/${product.id}`)} />
              ))}
            </div>
          </div>
          <div>
            <div className="section-header">
              <div><p className="section-label">Local availability</p><h2 className="section-title">Near You</h2></div>
              <Link to={`/shop${marketplaceLocation ? `?location=${encodeURIComponent(marketplaceLocation)}` : ''}`} className="view-all-link">View All →</Link>
            </div>
            <div className="discovery-products-grid">
              {nearbyProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => navigate(`/shop/${product.id}`)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-vendors">
        <div className="container">
          <div className="section-header">
            <div><p className="section-label">Trusted marketplace partners</p><h2 className="section-title">Verified Suppliers</h2></div>
            <Link to="/shop" className="view-all-link">View All Suppliers →</Link>
          </div>
          <div className="featured-vendors-grid">
            {featuredVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
          </div>
        </div>
      </section>

      <section className="section-local-suppliers">
        <div className="container">
          <div className="section-header">
            <div><p className="section-label">Local sourcing</p><h2 className="section-title">Suppliers Near You</h2><p className="section-description">Find suppliers serving your selected marketplace location.</p></div>
            <div className="home-location-picker"><MapPin size={15} /><select value={marketplaceLocation} onChange={(event) => setMarketplaceLocation(event.target.value)} aria-label="Select supplier location"><option value="">All locations</option>{marketplaceLocations.map((location) => <option key={location} value={location}>{location}</option>)}</select></div>
          </div>
          <div className="featured-vendors-grid">
            {localVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
          </div>
        </div>
      </section>

      <section className="section-how-it-works">
        <div className="container">
          <div className="centered-header"><p className="section-label">Simple sourcing</p><h2 className="section-title">How BrickBuddy Marketplace Works</h2></div>
          <div className="how-steps">
            {[
              { icon: Search, title: 'Search Material', text: 'Find products, brands, and suppliers for every stage of your build.' },
              { icon: Scale, title: 'Compare Suppliers', text: 'Review locations, ratings, stock, and multiple vendor offers.' },
              { icon: FileText, title: 'Request a Quote', text: 'Contact the right vendor with your quantity and project needs.' },
              { icon: ShoppingCart, title: 'Buy / Connect', text: 'Choose the offer that works best for your site and budget.' },
            ].map(({ icon: Icon, title, text }, index) => (
              <div className="how-step" key={title}><div className="how-step-icon"><Icon size={21} /></div><span className="how-step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-benefits">
        <div className="container">
          <div className="benefits-grid">
            {[
              { icon: ShieldCheck, title: 'Verified Suppliers' },
              { icon: Scale, title: 'Compare Multiple Offers' },
              { icon: MapPin, title: 'Local Construction Suppliers' },
              { icon: Tags, title: 'Transparent Pricing' },
              { icon: FileText, title: 'Request Quotes Easily' },
            ].map(({ icon: Icon, title }) => <div className="benefit-item" key={title}><Icon size={20} /><span>{title}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section-testimonials">
        <div className="container">
          <div className="centered-header"><p className="section-label">Customer stories</p><h2 className="section-title">What builders say about us</h2></div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="testimonial-card">
                <Star size={20} fill="#F5A800" color="#F5A800" />
                <p className="testimonial-text">&quot;{testimonial.text}&quot;</p>
                <div className="testimonial-author"><div className="author-avatar">{testimonial.avatar}</div><div><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-cta-banner">
        <div className="container">
          <div className="cta-banner"><div className="cta-banner-content"><h2>Find the Right Materials.<br />From the Right Suppliers.</h2><p>Search, compare, and connect with construction suppliers for your next project.</p></div><Link to="/shop" className="btn-primary">Explore Marketplace <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </div>
  );
}
