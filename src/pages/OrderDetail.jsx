import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';
import { products } from '../data/products';
import './CustomerPages.css';

export default function OrderDetail() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const { currentUser } = useAuth();
  const { hasReviewed } = useReviews();
  const order = getOrderById(orderId);
  if (!order) return <main className="customer-page"><div className="container customer-panel"><h1>Order not found</h1><Link to="/orders" className="text-link">Back to orders</Link></div></main>;
  return (
    <main className="customer-page">
      <div className="container customer-layout">
        <CustomerSidebar />
        <div className="customer-content">
          <header className="customer-page-header"><p className="section-label">Order details</p><h1>{order.id}</h1><p>{order.date} · <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></p></header>
          <div className="order-detail-grid">
            <section className="customer-panel"><h2>Items</h2><div className="order-detail-items">{order.items.map((item, index) => { const product = item.product || products.find((entry) => String(entry.id) === String(item.productId) || entry.name === item.name); const reviewed = product && hasReviewed(order.id, product.id, currentUser?.id); return <div className="detail-item" key={`${item.name}-${index}`}><div><strong>{item.name}</strong><small>{item.quantity} {item.unit} × ₹{item.price.toLocaleString('en-IN')}</small>{item.supplier && <small>Supplier: {item.supplier}</small>}</div><div className="order-item-review">{reviewed ? <span className="reviewed-label">Reviewed</span> : product ? <Link to={`/shop/${product.id}#reviews`} className="text-link">Write Review</Link> : null}<strong>₹{(item.subtotal ?? item.quantity * item.price).toLocaleString('en-IN')}</strong></div></div>; })}</div></section>
            <div className="customer-content">
              <section className="customer-panel"><h2>Summary</h2><div className="order-summary-list"><div className="order-summary-line"><span>Items</span><span>{order.itemCount}</span></div><div className="order-summary-line total"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div></div></section>
              <section className="customer-panel"><h2>Delivery address</h2><p>{order.address}</p></section>
            </div>
          </div>
          <section className="customer-panel"><h2>Order timeline</h2><div className="timeline">{['Order placed', 'Payment confirmed', 'Order shipped', 'Delivered'].map((step, index) => <div className={`timeline-step${index > (order.status === 'Delivered' ? 3 : order.status === 'Shipped' ? 2 : 1) ? ' pending' : ''}`} key={step}><span className="timeline-dot" /><div><strong>{step}</strong><small>{index === 0 ? order.date : index <= 1 ? 'Processing complete' : 'Status will update as your order moves'}</small></div></div>)}</div></section>
          <Link to="/orders" className="text-link">← Back to orders</Link>
        </div>
      </div>
    </main>
  );
}
