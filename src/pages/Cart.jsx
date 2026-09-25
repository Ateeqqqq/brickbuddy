import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductIllustration } from '../components/ProductCard';
import './Cart.css';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <main className="cart-page">
      <div className="container cart-shell">
        <div className="cart-heading">
          <div>
            <p className="section-label">Your marketplace basket</p>
            <h1 className="cart-title">Shopping Cart</h1>
          </div>
          <Link to="/shop" className="back-to-shop-link">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <section className="cart-empty">
            <ShoppingCart size={42} />
            <h2>Your cart is empty</h2>
            <p>Browse construction materials and add the products you need for your project.</p>
            <Link to="/shop" className="btn-primary">Browse Materials</Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items" aria-label="Cart items">
              {items.map((item) => (
                <article className="cart-item" key={item.key}>
                  <div className="cart-item-image">
                    <ProductIllustration type={item.product.image} />
                  </div>
                  <div className="cart-item-details">
                    <p className="cart-item-supplier">{item.supplier}</p>
                    <h2>{item.product.name}</h2>
                    <p className="cart-item-unit">₹{item.price.toLocaleString('en-IN')} / {item.unit}</p>
                    {item.minimumOrderQuantity > 1 && (
                      <p className="cart-item-moq">Minimum order: {item.minimumOrderQuantity} {item.unit}s</p>
                    )}
                  </div>
                  <div className="cart-item-quantity">
                    <span>Quantity</span>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - item.minimumOrderQuantity)}
                        disabled={item.quantity <= item.minimumOrderQuantity}
                        aria-label={`Decrease ${item.product.name} quantity`}
                      >
                        <Minus size={14} />
                      </button>
                      <strong>{item.quantity}</strong>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + item.minimumOrderQuantity)}
                        aria-label={`Increase ${item.product.name} quantity`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-subtotal">
                    <span>Subtotal</span>
                    <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() => removeFromCart(item.key)}
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="cart-summary-row">
                <span>Cart subtotal</span>
                <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
              </div>
              <p className="cart-summary-note">Shipping and taxes will be calculated during checkout.</p>
              <Link to="/checkout" className="btn-primary cart-checkout-button">Proceed to Checkout</Link>
              <Link to="/shop" className="cart-summary-link">Continue Shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
