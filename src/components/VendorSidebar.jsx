import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, ClipboardList, FileText, LogOut, Package, Star, UserRound, Warehouse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './VendorSidebar.css';

const links = [
  { to: '/vendor/dashboard', label: 'Overview', icon: ClipboardList, end: true },
  { to: '/vendor/products', label: 'Products', icon: Package },
  { to: '/vendor/inventory', label: 'Inventory', icon: Warehouse },
  { to: '/vendor/orders', label: 'Orders', icon: ClipboardList },
  { to: '/vendor/quotations', label: 'Quotations', icon: FileText },
  { to: '/vendor/reviews', label: 'Reviews', icon: Star },
  { to: '/vendor/notifications', label: 'Notifications', icon: Bell },
  { to: '/vendor/profile', label: 'Profile', icon: UserRound },
];

export default function VendorSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return <nav className="vendor-sidebar" aria-label="Vendor navigation">
    <Link to="/vendor/dashboard" className="vendor-sidebar-brand">
      <img src="/assets/brickbuddy-logo.jpg" alt="BrickBuddy" />
      <span>Vendor workspace</span>
    </Link>
    <div className="vendor-nav-links">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `vendor-nav-link${isActive ? ' active' : ''}`}><Icon size={17} /><span>{label}</span></NavLink>)}</div>
    <button type="button" className="vendor-nav-link vendor-logout" onClick={() => { logout(); navigate('/', { replace: true }); }}><LogOut size={17} /><span>Logout</span></button>
  </nav>;
}
