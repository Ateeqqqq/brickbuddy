import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Star, ShoppingCart } from 'lucide-react';
import { products, vendors } from '../data/products';
import { useVendor, getVendorMarketplaceProducts } from '../context/VendorContext';
import VendorCard from '../components/VendorCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useReviews } from '../context/ReviewContext';
import RFQForm from '../components/RFQForm';
import './ProductDetail.css';

const ProductIllustration = ({ type }) => {
  const illustrations = {
    cement: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect x="15" y="20" width="50" height="45" rx="3" fill="#E8E0D5"/>
        <rect x="15" y="20" width="50" height="12" rx="3" fill="#CEC4B5"/>
        <text x="40" y="43" textAnchor="middle" fill="#8B7355" fontSize="7" fontWeight="bold">ULTRATECH</text>
        <text x="40" y="52" textAnchor="middle" fill="#8B7355" fontSize="5">OPC 53 Grade</text>
        <text x="40" y="60" textAnchor="middle" fill="#A0907A" fontSize="6">50 kg</text>
        <rect x="20" y="62" width="40" height="2" rx="1" fill="#CEC4B5"/>
      </svg>
    ),
    steel: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        {[22,30,38,46,54].map((y,i) => (
          <g key={i}>
            <rect x="10" y={y} width="60" height="5" rx="2.5" fill="#9CA3AF"/>
            <rect x="10" y={y} width="60" height="2" rx="1" fill="#D1D5DB"/>
          </g>
        ))}
        <rect x="10" y="22" width="2" height="37" fill="#6B7280"/>
        <rect x="68" y="22" width="2" height="37" fill="#6B7280"/>
      </svg>
    ),
    brick: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        {[0,1,2].map(row => [0,1].map(col => (
          <rect key={`${row}-${col}`}
            x={8 + col * 32 + (row % 2) * 16}
            y={20 + row * 16}
            width={28} height={12}
            rx="2" fill={row % 2 === 0 ? '#C0522A' : '#D4623A'}
            stroke="#A04422" strokeWidth="0.5"
          />
        )))}
        {[3,4].map(row => [0,1,2].map(col => (
          <rect key={`${row}-${col}`}
            x={8 + col * 21}
            y={20 + row * 16}
            width={18} height={12}
            rx="2" fill={row % 2 === 0 ? '#C0522A' : '#D4623A'}
            stroke="#A04422" strokeWidth="0.5"
          />
        )))}
      </svg>
    ),
    block: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x="12" y={18 + i * 18} width="56" height="14" rx="2" fill="#A0AEC0" stroke="#718096" strokeWidth="0.5"/>
            <rect x="22" y={22 + i * 18} width="14" height="6" rx="1" fill="#718096" opacity="0.5"/>
            <rect x="44" y={22 + i * 18} width="14" height="6" rx="1" fill="#718096" opacity="0.5"/>
          </g>
        ))}
      </svg>
    ),
    sand: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <ellipse cx="40" cy="58" rx="30" ry="8" fill="#D4A853"/>
        <path d="M10 58 Q25 20 40 18 Q55 20 70 58Z" fill="#E8C170"/>
        <circle cx="25" cy="45" r="2" fill="#C49040" opacity="0.6"/>
        <circle cx="55" cy="40" r="1.5" fill="#C49040" opacity="0.6"/>
        <circle cx="40" cy="35" r="1" fill="#C49040" opacity="0.6"/>
        <circle cx="32" cy="52" r="1.5" fill="#C49040" opacity="0.6"/>
        <circle cx="50" cy="50" r="2" fill="#C49040" opacity="0.6"/>
      </svg>
    ),
    paint: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect x="22" y="25" width="36" height="42" rx="4" fill="#E2E8F0"/>
        <rect x="22" y="25" width="36" height="42" rx="4" fill="none" stroke="#CBD5E0" strokeWidth="1"/>
        <rect x="28" y="15" width="24" height="12" rx="2" fill="#CBD5E0"/>
        <rect x="32" y="10" width="16" height="6" rx="3" fill="#A0AEC0"/>
        <rect x="26" y="38" width="28" height="18" rx="2" fill="#F5A800" opacity="0.8"/>
        <text x="40" y="50" textAnchor="middle" fill="#1A1A1A" fontSize="6" fontWeight="bold">BERGER</text>
        <text x="40" y="58" textAnchor="middle" fill="#1A1A1A" fontSize="5">WeatherCoat</text>
      </svg>
    ),
    pipe: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <ellipse cx="15" cy="40" rx="8" ry="8" fill="#A0AEC0" stroke="#718096" strokeWidth="1"/>
        <ellipse cx="15" cy="40" rx="5" ry="5" fill="#F7FAFC"/>
        <rect x="15" y="32" width="50" height="16" rx="0" fill="#CBD5E0"/>
        <rect x="15" y="32" width="50" height="4" fill="#E2E8F0"/>
        <ellipse cx="65" cy="40" rx="8" ry="8" fill="#A0AEC0" stroke="#718096" strokeWidth="1"/>
        <ellipse cx="65" cy="40" rx="5" ry="5" fill="#F7FAFC"/>
      </svg>
    ),
    tile: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        {[0,1,2,3].map(row => [0,1,2,3].map(col => (
          <rect key={`${row}-${col}`}
            x={8 + col * 17} y={8 + row * 17}
            width="15" height="15"
            rx="1"
            fill={`hsl(${200 + (row+col) * 10},15%,${75 + (row+col) * 3}%)`}
            stroke="#CBD5E0" strokeWidth="0.5"
          />
        )))}
      </svg>
    ),
    stone: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect x="8" y="15" width="64" height="50" rx="2" fill="#2D3748"/>
        <rect x="8" y="15" width="64" height="50" rx="2" fill="none" stroke="#4A5568" strokeWidth="0.5"/>
        <rect x="10" y="17" width="30" height="2" fill="#4A5568" opacity="0.5"/>
        <rect x="15" y="25" width="50" height="1" fill="#4A5568" opacity="0.3"/>
        <rect x="10" y="35" width="40" height="1" fill="#718096" opacity="0.4"/>
        <rect x="20" y="45" width="45" height="1" fill="#4A5568" opacity="0.3"/>
        <circle cx="30" cy="30" r="3" fill="#F7D900" opacity="0.3"/>
        <circle cx="55" cy="50" r="2" fill="#F7D900" opacity="0.2"/>
      </svg>
    ),
    electrical: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect x="10" y="18" width="60" height="44" rx="4" fill="#FFFBEB"/>
        <rect x="10" y="18" width="60" height="44" rx="4" fill="none" stroke="#E2E8F0" strokeWidth="1"/>
        <circle cx="28" cy="35" r="7" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="1"/>
        <circle cx="28" cy="35" r="4" fill="#1A1A1A"/>
        <circle cx="52" cy="35" r="7" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="1"/>
        <circle cx="52" cy="35" r="4" fill="#1A1A1A"/>
        <rect x="22" y="48" width="36" height="8" rx="2" fill="#E2E8F0"/>
        <rect x="26" y="50" width="28" height="4" rx="1" fill="#CBD5E0"/>
      </svg>
    ),
    tool: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect x="14" y="34" width="52" height="12" rx="4" fill="#F5A800"/>
        <rect x="14" y="34" width="52" height="5" rx="2" fill="#FFC93C"/>
        <rect x="60" y="28" width="8" height="24" rx="2" fill="#718096"/>
        <rect x="8" y="36" width="10" height="8" rx="2" fill="#4A5568"/>
        <polygon points="18,36 26,32 26,48 18,44" fill="#2D3748"/>
      </svg>
    ),
    waterproof: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect x="18" y="22" width="44" height="44" rx="4" fill="#EBF8FF"/>
        <rect x="18" y="22" width="44" height="44" rx="4" fill="none" stroke="#90CDF4" strokeWidth="1"/>
        <rect x="18" y="22" width="44" height="14" rx="4" fill="#63B3ED"/>
        <rect x="22" y="25" width="7" height="5" rx="1" fill="#3182CE"/>
        <path d="M30 50 Q40 38 50 50" stroke="#3182CE" strokeWidth="2" fill="none"/>
        <text x="40" y="62" textAnchor="middle" fill="#2C5282" fontSize="7" fontWeight="bold">Dr. Fixit</text>
      </svg>
    ),
    default: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect x="10" y="10" width="60" height="60" rx="6" fill="#F3F4F6"/>
        <rect x="25" y="25" width="30" height="30" rx="3" fill="#D1D5DB"/>
      </svg>
    )
  };

  return illustrations[type] || illustrations.default;
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated, currentUser } = useAuth();
  const { orders } = useOrders();
  const { getProductReviews, getProductRating, getReviewCount, addReview, hasReviewed } = useReviews();
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorProducts } = useVendor();
  const product = [...products, ...getVendorMarketplaceProducts(vendorProducts)].find((item) => String(item.id) === String(id));
  const [quoteVendor, setQuoteVendor] = useState(null);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', comment: '' });
  const [reviewErrors, setReviewErrors] = useState({});
  const [rfqRequest, setRFQRequest] = useState(null);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container product-detail-shell">
          <div className="product-detail-not-found">
            <h2>Product not found</h2>
            <Link to="/shop" className="btn-primary">Back to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const vendorOffers = Array.isArray(product.vendorOffers) ? product.vendorOffers : [];
  const vendorEntries = vendorOffers.map((offer) => {
    const vendor = vendors.find((entry) => entry.id === offer.vendorId) || {
      name: offer.supplier,
      location: offer.location,
      verified: true,
      rating: product.rating,
    };
    return { ...vendor, offer };
  });

  const lowestOffer = vendorOffers.length
    ? vendorOffers.reduce((lowest, current) => Number(current.price ?? 0) < Number(lowest.price ?? 0) ? current : lowest, vendorOffers[0])
    : null;
  const productReviews = getProductReviews(product.id);
  const reviewRating = getProductRating(product.id);
  const purchasedOrder = orders.find((order) => order.items.some((item) => (
    String(item.product?.id || item.productId || '') === String(product.id) || item.name === product.name
  )));
  const verifiedReviewExists = purchasedOrder && isAuthenticated
    ? hasReviewed(purchasedOrder.id, product.id, currentUser.id)
    : false;
  const ownReview = isAuthenticated
    ? productReviews.find((review) => review.userId === currentUser.id)
    : null;

  const openReviewForm = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `${location.pathname}#reviews` } });
      return;
    }
    if (!verifiedReviewExists && !ownReview) setReviewFormOpen(true);
  };

  const openRFQForm = (vendor = null, offer = lowestOffer) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `${location.pathname}?rfq=1` } });
      return;
    }
    setRFQRequest({ vendor, offer });
  };

  const submitReview = (event) => {
    event.preventDefault();
    const errors = {};
    if (!reviewForm.rating) errors.rating = 'Select a rating.';
    if (!reviewForm.title.trim()) errors.title = 'Review title is required.';
    if (reviewForm.comment.trim().length < 15) errors.comment = 'Comment must be at least 15 characters.';
    setReviewErrors(errors);
    if (Object.keys(errors).length) return;
    addReview({
      ...reviewForm,
      productId: product.id,
      userId: currentUser.id,
      userName: currentUser.name,
      verifiedPurchase: Boolean(purchasedOrder),
      orderId: purchasedOrder?.id || null,
    });
    setReviewForm({ rating: 0, title: '', comment: '' });
    setReviewErrors({});
    setReviewFormOpen(false);
  };

  const openQuoteModal = (vendor, offer) => {
    setQuoteVendor({ vendor, offer });
    setQuoteSubmitted(false);
  };

  const closeQuoteModal = () => {
    setQuoteVendor(null);
    setQuoteSubmitted(false);
  };

  return (
    <div className="product-detail-page">
      <div className="container product-detail-shell">
        <Link to="/shop" className="back-to-shop-link">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="product-detail-card">
          <div className="product-detail-visual">
            <ProductIllustration type={product.image} />
          </div>

          <div className="product-detail-main">
            <p className="product-detail-supplier">{product.supplier}</p>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-rating">
              <Star size={14} fill="#F5A800" color="#F5A800" />
              <span>{reviewRating ? reviewRating.toFixed(1) : product.rating}</span>
              <span className="product-detail-reviews">({getReviewCount(product.id) || product.reviews} reviews)</span>
            </div>

            <div className="product-detail-price-row">
              <span className="product-detail-price">₹{Number(lowestOffer ? lowestOffer.price : product.price).toLocaleString('en-IN')}</span>
              <span className="product-detail-unit">/{product.unit}</span>
              {product.originalPrice && (
                <span className="product-detail-original">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-meta">
              <span>{vendorEntries.length} vendors offering</span>
              <span>•</span>
              <span>{product.location}</span>
              <span>•</span>
              <span>{product.inStock ? 'In stock' : 'Out of stock'}</span>
            </div>

            <button
              className="btn-primary product-detail-cart"
              type="button"
              onClick={() => addToCart(product, lowestOffer)}
              disabled={!product.inStock}
            >
              <ShoppingCart size={15} /> Add to Cart
            </button>
            <button type="button" className="btn-outline product-detail-rfq" onClick={() => openRFQForm()}>
              Request Bulk Quote
            </button>
            <button
              type="button"
              className={`product-detail-wishlist ${isWishlisted(product.id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={16} fill={isWishlisted(product.id) ? '#E53E3E' : 'none'} />
              {isWishlisted(product.id) ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>
        </div>

        {rfqRequest && (
          <div className="quote-modal-backdrop" onClick={() => setRFQRequest(null)}>
            <div className="quote-modal" onClick={(event) => event.stopPropagation()}>
              <div className="quote-modal-header">
                <div><p className="section-label">Procurement request</p><h2>Request Bulk Quote</h2></div>
                <button type="button" className="quote-modal-close" onClick={() => setRFQRequest(null)} aria-label="Close bulk quote form">×</button>
              </div>
              <RFQForm product={product} vendor={rfqRequest.vendor} offer={rfqRequest.offer} onCancel={() => setRFQRequest(null)} onSubmitted={(rfq) => navigate(`/quotes/${rfq.id}`)} />
            </div>
          </div>
        )}

        <section className="product-reviews-section" id="reviews">
          <div className="product-reviews-header">
            <div><p className="section-label">Customer feedback</p><h2>Product Reviews</h2></div>
            <button type="button" className="btn-primary" onClick={openReviewForm} disabled={Boolean(ownReview || verifiedReviewExists)}>
              {ownReview || verifiedReviewExists ? 'Reviewed' : 'Write a Review'}
            </button>
          </div>
          <div className="review-summary">
            <div className="review-average"><strong>{reviewRating ? reviewRating.toFixed(1) : product.rating}</strong><Stars rating={reviewRating || product.rating} /><span>{getReviewCount(product.id) || product.reviews} reviews</span></div>
            <div className="rating-breakdown">{[5, 4, 3, 2, 1].map((rating) => { const count = productReviews.filter((review) => review.rating === rating).length; const percent = productReviews.length ? (count / productReviews.length) * 100 : 0; return <div className="rating-line" key={rating}><span>{rating} <Star size={12} fill="#F5A800" color="#F5A800" /></span><span className="rating-bar"><i style={{ width: `${percent}%` }} /></span><small>{count}</small></div>; })}</div>
          </div>
          {reviewFormOpen && <form className="review-form" onSubmit={submitReview}><h3>Write a Review</h3><div className="review-star-selector"><span>Your rating</span><div>{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} className={rating <= reviewForm.rating ? 'selected' : ''} onClick={() => setReviewForm((form) => ({ ...form, rating }))} aria-label={`${rating} stars`}><Star size={23} fill={rating <= reviewForm.rating ? '#F5A800' : 'none'} /></button>)}</div>{reviewErrors.rating && <span className="field-error">{reviewErrors.rating}</span>}</div><label>Review title<input value={reviewForm.title} onChange={(event) => setReviewForm((form) => ({ ...form, title: event.target.value }))} />{reviewErrors.title && <span className="field-error">{reviewErrors.title}</span>}</label><label>Your review<textarea rows="4" value={reviewForm.comment} onChange={(event) => setReviewForm((form) => ({ ...form, comment: event.target.value }))} />{reviewErrors.comment && <span className="field-error">{reviewErrors.comment}</span>}</label><div className="review-form-actions"><button type="submit" className="btn-primary">Submit Review</button><button type="button" className="btn-outline" onClick={() => setReviewFormOpen(false)}>Cancel</button></div></form>}
          <div className="review-list">{productReviews.length ? productReviews.map((review) => <article className="product-review-card" key={review.id}><div className="review-card-top"><div><strong>{review.userName}</strong>{review.verifiedPurchase && <span className="verified-review">Verified Purchase</span>}</div><span className="review-date">{review.date}</span></div><Stars rating={review.rating} /><h3>{review.title}</h3><p>{review.comment}</p></article>) : <p className="reviews-empty">No reviews yet. Be the first to share your experience.</p>}</div>
        </section>

        <div className="vendor-offers-section">
          <div className="vendor-offers-header">
            <p className="section-label">Compare marketplace offers</p>
            <h2>Available from {vendorEntries.length} vendors</h2>
            <p className="vendor-offers-description">
              Compare price, availability, and delivery details before selecting a vendor.
            </p>
          </div>

          <div className="vendor-offers-list">
            {vendorEntries.map(({ offer, ...vendor }) => (
              <VendorCard
                key={offer.id}
                vendor={vendor}
                offer={offer}
                unit={product.unit}
                actionLabel="Select Vendor"
                onRequestQuote={() => openQuoteModal(vendor, offer)}
              />
            ))}
          </div>

          {quoteVendor && (
            <div className="quote-modal-backdrop" onClick={closeQuoteModal}>
              <div className="quote-modal" onClick={(event) => event.stopPropagation()}>
                <div className="quote-modal-header">
                  <div>
                    <p className="section-label">Contact Vendor</p>
                    <h2>Request a Quote</h2>
                  </div>
                  <button type="button" className="quote-modal-close" onClick={closeQuoteModal} aria-label="Close quote request">
                    ×
                  </button>
                </div>

                {quoteSubmitted ? (
                  <div className="quote-success">
                    <strong>Quote request submitted successfully.</strong>
                    <button type="button" className="btn-primary" onClick={closeQuoteModal}>Done</button>
                  </div>
                ) : (
                  <form
                    className="quote-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setQuoteSubmitted(true);
                    }}
                  >
                    <div className="quote-context">
                      <span><strong>Product:</strong> {product.name}</span>
                      <span><strong>Vendor:</strong> {quoteVendor.vendor.name}</span>
                    </div>
                    <label>Name<input required type="text" name="name" /></label>
                    <label>Phone<input required type="tel" name="phone" /></label>
                    <label>Quantity ({product.unit})<input required min="1" type="number" name="quantity" /></label>
                    <label>Message<textarea name="message" rows="3" placeholder="Add details about your requirement" /></label>
                    <button type="submit" className="btn-primary quote-submit-button">Submit Request</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stars({ rating }) {
  return <span className="review-stars" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill={star <= Math.round(rating) ? '#F5A800' : 'none'} color="#F5A800" />)}</span>;
}
