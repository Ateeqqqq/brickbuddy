import React from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import VendorStorefront from './pages/VendorStorefront';
import Services from './pages/Services';
import About from './pages/About';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import Addresses from './pages/Addresses';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';
import { RFQProvider } from './context/RFQContext';
import Quotes from './pages/Quotes';
import QuoteDetail from './pages/QuoteDetail';
import VendorDashboard from './pages/VendorDashboard';
import { VendorProvider } from './context/VendorContext';
import { VendorProductProvider } from './context/VendorProductContext';
import VendorProducts from './pages/VendorProducts';
import VendorProductForm from './pages/VendorProductForm';
import VendorInventory from './pages/VendorInventory';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function RoleRoute({ role, children }) {
  const location = useLocation();
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return currentUser.role === role ? children : <Navigate to={role === 'vendor' ? '/account' : '/vendor/dashboard'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <AddressProvider>
        <OrderProvider>
          <ReviewProvider>
            <WishlistProvider>
              <RFQProvider>
                <VendorProvider><VendorProductProvider><CartProvider><AppShell /></CartProvider></VendorProductProvider></VendorProvider>
              </RFQProvider>
            </WishlistProvider>
          </ReviewProvider>
        </OrderProvider>
      </AddressProvider>
    </AuthProvider>
  );
}

function AppShell() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar cartCount={cartCount} wishlistCount={wishlistCount} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/vendor/:vendorId" element={<VendorStorefront />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
        <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
        <Route path="/quotes/:rfqId" element={<ProtectedRoute><QuoteDetail /></ProtectedRoute>} />
        <Route path="/projects" element={<ComingSoon title="Projects are coming soon" />} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/notifications" element={<ComingSoon title="Notifications are coming soon" />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/vendor/dashboard" element={<RoleRoute role="vendor"><VendorDashboard /></RoleRoute>} />
        <Route path="/vendor/products" element={<RoleRoute role="vendor"><VendorProducts /></RoleRoute>} />
        <Route path="/vendor/products/new" element={<RoleRoute role="vendor"><VendorProductForm /></RoleRoute>} />
        <Route path="/vendor/products/:productId/edit" element={<RoleRoute role="vendor"><VendorProductForm /></RoleRoute>} />
        <Route path="/vendor/inventory" element={<RoleRoute role="vendor"><VendorInventory /></RoleRoute>} />
        <Route path="/vendor/orders" element={<RoleRoute role="vendor"><ComingSoon title="Vendor orders are coming soon" backTo="/vendor/dashboard" /></RoleRoute>} />
        <Route path="/vendor/quotations" element={<RoleRoute role="vendor"><ComingSoon title="Vendor quotations are coming soon" backTo="/vendor/dashboard" /></RoleRoute>} />
        <Route path="/vendor/reviews" element={<RoleRoute role="vendor"><ComingSoon title="Vendor reviews are coming soon" backTo="/vendor/dashboard" /></RoleRoute>} />
        <Route path="/vendor/notifications" element={<RoleRoute role="vendor"><ComingSoon title="Vendor notifications are coming soon" backTo="/vendor/dashboard" /></RoleRoute>} />
        <Route path="/vendor/profile" element={<RoleRoute role="vendor"><ComingSoon title="Vendor profile is coming soon" backTo="/vendor/dashboard" /></RoleRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
