import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

// SVG product illustrations since we can't use real images
export const ProductIllustration = ({ type }) => {
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

export default function ProductCard({ product, compact = false, onClick = null }) {
  const { addToCart, items } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const vendorOffers = Array.isArray(product.vendorOffers) ? product.vendorOffers : [];
  const vendorCount = vendorOffers.length || (Array.isArray(product.vendorOfferIds) ? product.vendorOfferIds.length : 0) || 1;
  const displayPrice = vendorOffers.length
    ? Math.min(...vendorOffers.map((offer) => Number(offer.price ?? product.price ?? 0)))
    : Number(product.price ?? 0);
  const displayOriginalPrice = vendorOffers.length
    ? Math.min(...vendorOffers.map((offer) => Number(offer.originalPrice ?? offer.price ?? product.originalPrice ?? product.price ?? 0)))
    : Number(product.originalPrice ?? 0);
  const discount = displayOriginalPrice > 0 && displayPrice > 0
    ? Math.round((1 - displayPrice / displayOriginalPrice) * 100)
    : null;
  const productLocation = product.location || vendorOffers[0]?.location || 'Hyderabad';
  const inStock = product.inStock ?? vendorOffers.some((offer) => offer.inStock);
  const selectedOffer = vendorOffers.reduce((lowest, offer) => (
    Number(offer.price ?? 0) < Number(lowest?.price ?? Number.POSITIVE_INFINITY) ? offer : lowest
  ), vendorOffers[0] || null);
  const cartVendorId = selectedOffer?.vendorId || product.vendorId || 'default';
  const added = items.some((item) => item.key === `${product.id}-${cartVendorId}`);
  const wished = isWishlisted(product.id);

  const handleAddToCart = (event) => {
    event?.stopPropagation();
    addToCart(product, selectedOffer);
  };

  const handleWishlist = (event) => {
    event?.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className={`product-card ${compact ? 'compact' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(event);
        }
      } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Badge */}
      {product.badge && (
        <span className={`product-badge badge-${product.badge}`}>
          {product.badge === 'sale' ? 'SALE' : 'NEW'}
        </span>
      )}
      {!inStock && <span className="product-badge badge-oos">OUT OF STOCK</span>}

      {/* Wishlist */}
      <button
        className={`wishlist-btn ${wished ? 'active' : ''}`}
        onClick={handleWishlist}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} fill={wished ? '#E53E3E' : 'none'} color={wished ? '#E53E3E' : '#9CA3AF'} />
      </button>

      {/* Product image */}
      <div className="product-img">
        <ProductIllustration type={product.image} />
      </div>

      {/* Info */}
      <div className="product-info">
        <p className="product-supplier">
          {vendorCount > 1 ? `${vendorCount} vendors offering` : product.supplier}
        </p>
        <h3 className="product-name">{product.name}</h3>

        {product.brand && <p className="product-brand">{product.brand}</p>}

        <div className="product-marketplace-meta">
          <span className="product-location">{productLocation}</span>
          <span className="marketplace-dot">•</span>
          <span className={`product-stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            {inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        <div className="product-rating">
          <Star size={12} fill="#F5A800" color="#F5A800" />
          <span className="rating-value">{product.rating}</span>
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-price-row">
          <div className="price-block">
            <span className="price-label">{vendorCount > 1 ? 'From' : 'Price'}</span>
            <span className="price-current">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            <span className="price-unit">/{product.unit}</span>
          </div>
          {displayOriginalPrice > 0 && (
            <div className="price-original-block">
              <span className="price-original">₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
              <span className="price-discount">{discount}% off</span>
            </div>
          )}
        </div>

        <button
          className={`add-to-cart-btn ${added ? 'added' : ''} ${!inStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart size={14} />
          {added ? 'Added!' : !inStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
