import React from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import './Checkout.css';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId);
  if (!order) return <main className="checkout-page"><div className="container checkout-empty"><h1>Order not found</h1><Link to="/orders" className="btn-primary">View Orders</Link></div></main>;
  return <main className="checkout-page"><div className="container order-success"><CheckCircle2 size={58} /><p className="section-label">Order confirmed</p><h1>Thank you for your order!</h1><p className="success-copy">Your BrickBuddy order has been placed and is now being prepared.</p><div className="success-details"><div><span>Order number</span><strong>{order.id}</strong></div><div><span>Total</span><strong>₹{order.total.toLocaleString('en-IN')}</strong></div><div><span>Payment</span><strong>{order.paymentMethod}</strong></div><div><span><MapPin size={14} /> Delivering to</span><strong>{order.address}</strong></div></div><div className="success-actions"><Link to={`/orders/${order.id}`} className="btn-primary">View Order</Link><Link to="/shop" className="btn-outline">Continue Shopping</Link></div></div></main>;
}
