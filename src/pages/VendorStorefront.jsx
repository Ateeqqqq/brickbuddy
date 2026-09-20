import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, vendors } from '../data/products';
import './VendorStorefront.css';

const slugify = (value) => String(value)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export default function VendorStorefront() {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const vendor = vendors.find((entry) => entry.id === vendorId || entry.slug === vendorId || slugify(entry.name) === vendorId);

  const vendorProducts = useMemo(() => {
    if (!vendor) return [];
    return products
      .filter((product) => product.vendorOffers?.some((offer) => offer.vendorId === vendor.id))
      .map((product) => ({
        ...product,
        vendorOffers: product.vendorOffers.filter((offer) => offer.vendorId === vendor.id),
      }));
  }, [vendor]);

  if (!vendor) {
    return (
      <div className="vendor-storefront-page">
        <div className="container vendor-storefront-shell">
          <div className="vendor-storefront-not-found">
            <h1>Vendor not found</h1>
            <Link to="/shop" className="btn-primary">Back to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const categories = [...new Set(vendorProducts.map((product) => product.category))];

  return (
    <div className="vendor-storefront-page">
      <div className="container vendor-storefront-shell">
        <Link to="/shop" className="back-to-shop-link">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <header className="vendor-storefront-header">
          <div className="vendor-storefront-heading">
            <div>
              <div className="vendor-storefront-title-row">
                <h1>{vendor.name}</h1>
                {vendor.verified && <span className="vendor-storefront-verified">Verified</span>}
              </div>
              <p className="vendor-storefront-description">
                Trusted construction materials supplier serving projects across {vendor.state}.
              </p>
            </div>
            <div className="vendor-storefront-rating">
              <Star size={16} fill="currentColor" />
              <strong>{vendor.rating}</strong>
              <span>vendor rating</span>
            </div>
          </div>

          <div className="vendor-storefront-meta">
            <span><MapPin size={15} /> {vendor.location}</span>
            <span>{vendorProducts.length} products</span>
            <span>{categories.length} categories</span>
          </div>
        </header>

        <section className="vendor-storefront-products">
          <div className="vendor-storefront-section-heading">
            <div>
              <p className="section-label">Available from {vendor.name}</p>
              <h2>Products</h2>
            </div>
          </div>

          {vendorProducts.length ? (
            <div className="vendor-storefront-grid">
              {vendorProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/shop/${product.id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="vendor-storefront-empty">No products are currently listed for this vendor.</p>
          )}
        </section>
      </div>
    </div>
  );
}
