import React from 'react';
import { ArrowRight, BriefcaseBusiness, FileText, Heart, MapPin, Package, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAddresses } from '../context/AddressContext';
import { useRFQs } from '../context/RFQContext';
import { dashboardMetrics, mockOrders } from '../data/customerData';
import './Account.css';

const quickActions = [
  { to: '/shop', label: 'Shop Materials', icon: Package },
  { to: '/cart', label: 'View Cart', icon: ShoppingCart },
  { to: '/wishlist', label: 'View Wishlist', icon: Heart },
  { to: '/quotes', label: 'Request Bulk Quote', icon: FileText },
  { to: '/projects', label: 'Create Project', icon: BriefcaseBusiness },
];

const statusClass = (status) => status.toLowerCase();

export default function Account() {
  const { currentUser } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { defaultAddress } = useAddresses();
  const { getUserRFQs } = useRFQs();
  const rfqs = getUserRFQs(currentUser?.id);
  const activeRFQs = rfqs.filter((rfq) => ['Draft', 'Submitted', 'Quotation Received'].includes(rfq.status)).length;
  const receivedQuotes = rfqs.reduce((total, rfq) => total + rfq.quotations.length, 0);
  const acceptedQuotes = rfqs.filter((rfq) => rfq.status === 'Accepted').length;

  return (
    <main className="account-page">
      <div className="container customer-layout">
        <CustomerSidebar />
        <div className="customer-content">
          <header className="account-header">
            <div>
              <p className="section-label">Customer dashboard</p>
              <h1>Welcome, {currentUser?.name || 'Builder'}</h1>
              <p>Here’s what’s happening with your BrickBuddy account.</p>
            </div>
            <Link to="/profile" className="btn-outline">Edit Profile</Link>
          </header>

          <section className="account-profile">
            <div className="account-avatar">{currentUser?.name?.slice(0, 1).toUpperCase() || 'B'}</div>
            <div>
              <h2>{currentUser?.name}</h2>
              <p>{currentUser?.email}</p>
              {currentUser?.phone && <p>{currentUser.phone}</p>}
            </div>
          </section>
          {defaultAddress && (
            <section className="dashboard-section default-address-summary">
              <div className="section-heading">
                <div><p className="section-label">Delivery</p><h2>Default Address</h2></div>
                <Link to="/addresses" className="text-link">Manage <ArrowRight size={14} /></Link>
              </div>
              <p><MapPin size={15} /> {defaultAddress.addressLine1}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}</p>
            </section>
          )}

          <section className="metric-grid" aria-label="Account summary">
            <Metric label="Total Orders" value={dashboardMetrics.totalOrders} icon={Package} />
            <Metric label="Active Orders" value={dashboardMetrics.activeOrders} icon={ArrowRight} />
            <Metric label="Wishlist Items" value={wishlistCount} icon={Heart} />
            <Metric label="Cart Items" value={cartCount} icon={ShoppingCart} />
            <Metric label="Pending Quotes" value={dashboardMetrics.pendingQuotes} icon={FileText} />
            <Metric label="Active Projects" value={dashboardMetrics.activeProjects} icon={BriefcaseBusiness} />
            <Metric label="Active RFQs" value={activeRFQs} icon={FileText} />
            <Metric label="Quotes Received" value={receivedQuotes} icon={FileText} />
            <Metric label="Accepted Quotes" value={acceptedQuotes} icon={FileText} />
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div><p className="section-label">Activity</p><h2>Recent Orders</h2></div>
              <Link to="/orders" className="text-link">View all <ArrowRight size={14} /></Link>
            </div>
            <div className="orders-list">
              {mockOrders.slice(0, 3).map((order) => (
                <div className="order-row" key={order.id}>
                  <div><strong>{order.id}</strong><small>{order.date} · {order.itemCount} items</small></div>
                  <strong>₹{order.total.toLocaleString('en-IN')}</strong>
                  <span className={`order-status ${statusClass(order.status)}`}>{order.status}</span>
                  <Link to={`/orders/${order.id}`} className="btn-outline order-view">View Order</Link>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-heading"><div><p className="section-label">Shortcuts</p><h2>Quick Actions</h2></div></div>
            <div className="quick-actions">
              {quickActions.map(({ to, label, icon: Icon }) => <Link to={to} className="quick-action" key={to}><Icon size={19} /><span>{label}</span><ArrowRight size={14} /></Link>)}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, icon: Icon }) {
  return <div className="metric-card"><span className="metric-icon"><Icon size={19} /></span><div><strong>{value}</strong><small>{label}</small></div></div>;
}
