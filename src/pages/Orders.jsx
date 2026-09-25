import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { useOrders } from '../context/OrderContext';
import './CustomerPages.css';

const filters = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [filter, setFilter] = useState('All');
  const { orders: allOrders } = useOrders();
  const orders = filter === 'All' ? allOrders : allOrders.filter((order) => order.status === filter);
  return (
    <main className="customer-page">
      <div className="container customer-layout">
        <CustomerSidebar />
        <div className="customer-content">
          <header className="customer-page-header"><p className="section-label">Purchase history</p><h1>Orders</h1><p>Track your material orders and delivery progress.</p></header>
          <section className="customer-panel">
            <div className="filter-tabs">{filters.map((item) => <button type="button" className={`filter-tab${filter === item ? ' active' : ''}`} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
            <div className="orders-table">
              <div className="orders-table-header"><span>Order</span><span>Date</span><span>Status</span><span>Total</span><span /></div>
              {orders.map((order) => <div className="customer-order-card" key={order.id}><div><strong>{order.id}</strong><small>{order.itemCount} items</small></div><small>{order.date}</small><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span><strong>₹{order.total.toLocaleString('en-IN')}</strong><Link className="btn-outline order-view" to={`/orders/${order.id}`}>View Order</Link></div>)}
              {!orders.length && <p className="empty-state">No orders match this filter.</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
