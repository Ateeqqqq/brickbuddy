import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, MapPin, Plus, Tag, Truck } from 'lucide-react';
import { ProductIllustration } from '../components/ProductCard';
import { useAddresses } from '../context/AddressContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import './Checkout.css';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { addresses, defaultAddress } = useAddresses();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || addresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const deliveryOption = useMemo(() => ({ name: 'Standard Delivery', estimate: '3–5 business days', charge: subtotal >= 5000 ? 0 : 99 }), [subtotal]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) || null;
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryOption.charge - discount;

  const applyCoupon = (event) => {
    event.preventDefault();
    if (coupon.trim().toUpperCase() === 'BRICK10') {
      setAppliedCoupon(true);
      setCouponError('');
    } else {
      setAppliedCoupon(false);
      setCouponError('Enter a valid coupon code.');
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (placingOrder) return;
    if (!isAuthenticated || !items.length || !selectedAddress || !paymentMethod) {
      setSubmitError('Select a delivery address and payment method before placing your order.');
      return;
    }
    setPlacingOrder(true);
    setSubmitError('');
    await new Promise((resolve) => setTimeout(resolve, 650));
    const order = createOrder({
      address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
      deliveryAddress: selectedAddress,
      items: items.map((item) => ({
        name: item.product.name,
        product: item.product,
        supplier: item.supplier,
        vendorId: item.vendorId,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal,
      delivery: deliveryOption.charge,
      deliveryOption: deliveryOption.name,
      discount,
      total,
      paymentMethod,
    });
    clearCart();
    navigate(`/order-success/${order.id}`, { replace: true });
  };

  if (!items.length) {
    return <main className="checkout-page"><div className="container checkout-empty"><Truck size={42} /><h1>Your cart is empty</h1><p>Add materials to your cart before starting checkout.</p><Link to="/shop" className="btn-primary">Continue Shopping</Link></div></main>;
  }

  return (
    <main className="checkout-page">
      <div className="container checkout-shell">
        <header className="checkout-header"><div><p className="section-label">Secure order flow</p><h1>Checkout</h1></div><div className="checkout-steps"><span className="complete"><Check size={13} /> Cart</span><ChevronRight size={14} /><strong>Checkout</strong><ChevronRight size={14} /><span>Confirmation</span></div></header>
        <form className="checkout-layout" onSubmit={placeOrder}>
          <div className="checkout-main">
            <section className="checkout-card">
              <div className="checkout-card-heading"><div><p className="section-label">Where should we deliver?</p><h2>Delivery Address</h2></div><Link to="/addresses" className="checkout-manage-link">Manage Addresses</Link></div>
              {addresses.length ? <div className="address-select-grid">{addresses.map((address) => <button type="button" className={`checkout-address${selectedAddressId === address.id ? ' selected' : ''}`} onClick={() => setSelectedAddressId(address.id)} key={address.id}><span className="checkout-address-check">{selectedAddressId === address.id && <Check size={13} />}</span><strong>{address.addressType}{address.isDefault && <em>Default</em>}</strong><span>{address.fullName} · {address.phone}</span><span>{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}</span><span>{address.city}, {address.state} - {address.pincode}</span></button>)}</div> : <div className="checkout-no-address"><MapPin size={22} /><p>No saved address available.</p><Link to="/addresses" className="btn-outline"><Plus size={15} /> Add New Address</Link></div>}
              <Link to="/addresses" className="checkout-add-link"><Plus size={15} /> Add New Address</Link>
            </section>

            <section className="checkout-card"><div className="checkout-card-heading"><div><p className="section-label">Review your basket</p><h2>Order Items</h2></div><Link to="/cart" className="checkout-manage-link">Edit Cart</Link></div><div className="checkout-items">{items.map((item) => <div className="checkout-item" key={item.key}><div className="checkout-item-image"><ProductIllustration type={item.product.image} /></div><div className="checkout-item-info"><strong>{item.product.name}</strong><small>{item.supplier}</small><span>{money(item.price)} / {item.unit}</span></div><div className="checkout-item-quantity">Qty: {item.quantity}</div><strong>{money(item.price * item.quantity)}</strong></div>)}</div></section>

            <section className="checkout-card"><div className="checkout-card-heading"><div><p className="section-label">Delivery method</p><h2>Delivery</h2></div></div><div className="delivery-option"><Truck size={20} /><div><strong>{deliveryOption.name}</strong><small>Estimated delivery: {deliveryOption.estimate}</small></div><strong>{deliveryOption.charge ? money(deliveryOption.charge) : 'FREE'}</strong></div></section>

            <section className="checkout-card"><div className="checkout-card-heading"><div><p className="section-label">Save on your order</p><h2>Coupon</h2></div></div><div className="coupon-form"><div className="coupon-input"><Tag size={16} /><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Enter coupon code" aria-invalid={Boolean(couponError)} /></div><button type="button" className="btn-outline" onClick={applyCoupon}>Apply</button></div>{appliedCoupon && <p className="coupon-success">BRICK10 applied: 10% off your eligible subtotal.</p>}{couponError && <p className="field-error">{couponError}</p>}</section>

            <section className="checkout-card"><div className="checkout-card-heading"><div><p className="section-label">How would you like to pay?</p><h2>Payment Method</h2></div></div><div className="payment-options"><label className={`payment-option${paymentMethod === 'Razorpay / Online Payment' ? ' selected' : ''}`}><input type="radio" name="payment" value="Razorpay / Online Payment" checked={paymentMethod === 'Razorpay / Online Payment'} onChange={(event) => setPaymentMethod(event.target.value)} /><span><strong>Razorpay / Online Payment</strong><small>Payment integration will be enabled soon.</small></span></label><label className={`payment-option${paymentMethod === 'Cash on Delivery' ? ' selected' : ''}`}><input type="radio" name="payment" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(event) => setPaymentMethod(event.target.value)} /><span><strong>Cash on Delivery</strong><small>Pay when your materials arrive.</small></span></label></div></section>
          </div>
          <aside className="checkout-summary"><h2>Order Summary</h2><div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row"><span>Delivery</span><strong>{deliveryOption.charge ? money(deliveryOption.charge) : 'FREE'}</strong></div><div className="summary-row"><span>Discount</span><strong className="discount-value">-{money(discount)}</strong></div><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>{submitError && <p className="checkout-error" role="alert">{submitError}</p>}<button className="btn-primary place-order-button" type="submit" disabled={placingOrder}>{placingOrder ? 'Placing Order…' : 'Place Order'}</button><p className="checkout-summary-note">By placing your order, you agree to our marketplace terms.</p></aside>
        </form>
      </div>
    </main>
  );
}
