import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell, BriefcaseBusiness, ClipboardList, FileText, Heart, LogOut, MapPin,
  Package, ShoppingCart, Star, UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CustomerSidebar.css';

const links = [
  { to: '/account', label: 'Overview', icon: ClipboardList, end: true },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/addresses', label: 'Addresses', icon: MapPin },
  { to: '/quotes', label: 'Quotes', icon: FileText },
  { to: '/projects', label: 'Projects', icon: BriefcaseBusiness },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function CustomerSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="customer-sidebar" aria-label="Customer account navigation">
      <div className="customer-nav-links">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `customer-nav-link${isActive ? ' active' : ''}`}>
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
      <button type="button" className="customer-nav-link customer-logout" onClick={handleLogout}>
        <LogOut size={17} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
