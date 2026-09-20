import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import './VendorCard.css';

export default function VendorCard({
  vendor,
  offer = null,
  unit = '',
  onViewShop = null,
  onRequestQuote = null,
  actionLabel = 'View Shop',
}) {
  const vendorName = vendor?.name || offer?.supplier || 'Vendor';
  const location = vendor?.location || offer?.location;
  const rating = vendor?.rating;
  const reviews = vendor?.reviews ?? vendor?.reviewCount;
  const productCount = vendor?.productCount ?? vendor?.productsCount;
  const categoryCount = vendor?.categoryCount ?? vendor?.categoriesCount;
  const hasCatalogCount = productCount != null || categoryCount != null;
  const vendorPath = vendor?.slug || vendor?.id;

  return (
    <article className="vendor-card">
      <div className="vendor-card-header">
        <div>
          <h3 className="vendor-card-name">{vendorName}</h3>
          {vendor?.verified && <span className="vendor-card-verified">Verified</span>}
        </div>
        {rating != null && (
          <div className="vendor-card-rating">
            <Star size={13} fill="currentColor" />
            <span>{rating}</span>
            {reviews != null && <span className="vendor-card-reviews">({reviews})</span>}
          </div>
        )}
      </div>

      {location && (
        <p className="vendor-card-location">
          <MapPin size={14} />
          <span>{location}</span>
        </p>
      )}

      {hasCatalogCount && (
        <p className="vendor-card-catalog">
          {productCount != null && `${productCount} products`}
          {productCount != null && categoryCount != null && ' · '}
          {categoryCount != null && `${categoryCount} categories`}
        </p>
      )}

      {offer && (
        <div className="vendor-card-offer">
          <div className="vendor-card-price">
            <span className="vendor-card-price-label">Offer price</span>
            <strong>₹{Number(offer.price).toLocaleString('en-IN')}</strong>
            {unit && <span>/{unit}</span>}
          </div>
          <span className={`vendor-card-stock ${offer.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {offer.inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>
      )}

      {offer && (offer.moq != null || offer.delivery || vendor?.leadTime) && (
        <div className="vendor-card-details">
          {offer.moq != null && <span>MOQ: {offer.moq}</span>}
          {(offer.delivery || vendor?.leadTime) && (
            <span>Delivery: {offer.delivery || vendor.leadTime}</span>
          )}
        </div>
      )}

      {vendorPath ? (
        <div className="vendor-card-actions">
          <Link to={`/vendor/${vendorPath}`} className="vendor-card-button">
            {actionLabel}
          </Link>
          {onRequestQuote && (
            <button type="button" className="vendor-card-quote-button" onClick={onRequestQuote}>
              Request Quote
            </button>
          )}
        </div>
      ) : (
        <div className="vendor-card-actions">
          <button type="button" className="vendor-card-button" onClick={onViewShop || undefined}>
            {actionLabel}
          </button>
          {onRequestQuote && (
            <button type="button" className="vendor-card-quote-button" onClick={onRequestQuote}>
              Request Quote
            </button>
          )}
        </div>
      )}
    </article>
  );
}
