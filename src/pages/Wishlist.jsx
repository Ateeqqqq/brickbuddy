import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductIllustration } from '../components/ProductCard';
import './Wishlist.css';

function getLowestOffer(product) {
  const offers = Array.isArray(product.vendorOffers) ? product.vendorOffers : [];
  return offers.reduce((lowest, offer) => (
    Number(offer.price ?? 0) < Number(lowest?.price ?? Number.POSITIVE_INFINITY) ? offer : lowest
  ), offers[0] || null);
}

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, getLowestOffer(product));
  };

  return (
    <main className="wishlist-page">
      <div className="container wishlist-shell">
        <div className="wishlist-heading">
          <div>
            <p className="section-label">Saved for your project</p>
            <h1 className="wishlist-title">My Wishlist</h1>
          </div>
          <Link to="/shop" className="back-to-shop-link">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <section className="wishlist-empty">
            <Heart size={42} />
            <h2>Your wishlist is empty</h2>
            <p>Save materials here while you compare products and suppliers for your project.</p>
            <Link to="/shop" className="btn-primary">Browse Materials</Link>
          </section>
        ) : (
          <section className="wishlist-grid" aria-label="Wishlist items">
            {items.map((product) => {
              const offer = getLowestOffer(product);
              const price = Number(offer?.price ?? product.price ?? 0);
              const unit = offer?.unit || product.unit;
              const supplier = offer?.supplier || product.supplier;
              const inStock = offer?.inStock ?? product.inStock;
              const vendorId = offer?.vendorId || product.vendorId || 'default';
              const inCart = cartItems.some((item) => item.key === `${product.id}-${vendorId}`);

              return (
                <article className="wishlist-card" key={product.id}>
                  <div className="wishlist-card-image">
                    <ProductIllustration type={product.image} />
                  </div>
                  <div className="wishlist-card-content">
                    <p className="wishlist-card-supplier">{supplier}</p>
                    <h2>{product.name}</h2>
                    <div className="wishlist-card-rating">
                      <Star size={13} fill="#F5A800" color="#F5A800" />
                      <strong>{product.rating}</strong>
                      <span>({product.reviews})</span>
                    </div>
                    <div className="wishlist-card-price">
                      <strong>₹{price.toLocaleString('en-IN')}</strong>
                      <span>/{unit}</span>
                    </div>
                    <p className={`wishlist-card-stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {inStock ? 'In stock' : 'Out of stock'}
                    </p>
                  </div>
                  <div className="wishlist-card-actions">
                    <Link to={`/shop/${product.id}`} className="btn-outline wishlist-view-button">
                      View Product
                    </Link>
                    <button
                      type="button"
                      className={`btn-primary wishlist-cart-button ${inCart ? 'added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                    >
                      <ShoppingCart size={15} />
                      {inCart ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                    <button
                      type="button"
                      className="wishlist-remove-button"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 size={15} /> Remove from Wishlist
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
