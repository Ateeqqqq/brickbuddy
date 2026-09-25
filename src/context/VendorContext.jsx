import React, { createContext, useContext, useMemo, useState } from 'react';
import { categoryHierarchy } from '../data/products';

const VendorContext = createContext(null);

export function getVendorMarketplaceProducts(vendorProducts = []) {
  return vendorProducts.filter((product) => product.status === 'Active').map((product) => ({
    ...product,
    category: categoryHierarchy.find((entry) => entry.name === product.category)?.id || product.category,
    image: product.imageUrl || 'cement',
    description: product.description || `${product.name} supplied by ${product.supplier || 'Hyderabad BuildMart'}.`,
    location: product.location || 'Hyderabad, Telangana',
    supplier: product.supplier || 'Hyderabad BuildMart',
    inStock: Number(product.stock) > 0,
    rating: product.rating || 4.5,
    reviews: product.reviews || 0,
    vendorOffers: [{ vendorId: product.vendorId || 'vendor-1', supplier: product.supplier || 'Hyderabad BuildMart', location: product.location || 'Hyderabad, Telangana', price: Number(product.price), unit: product.unit, moq: product.moq || 1 }],
  }));
}

const initialProducts = [
  { id: 'vp-1', vendorId: 'vendor-1', vendorName: 'Hyderabad BuildMart', name: 'UltraTech PPC Cement', category: 'Cement', price: 420, stock: 860, unit: 'bag', status: 'Active', createdAt: '2026-09-20' },
  { id: 'vp-2', vendorId: 'vendor-1', vendorName: 'Hyderabad BuildMart', name: 'TMT Steel Bars Fe 500', category: 'Steel & TMT', price: 58, stock: 4200, unit: 'kg', status: 'Active', createdAt: '2026-09-18' },
  { id: 'vp-3', vendorId: 'vendor-1', vendorName: 'Hyderabad BuildMart', name: 'AAC Blocks 600x200x100mm', category: 'Bricks & Blocks', price: 42, stock: 0, unit: 'piece', status: 'Out of Stock', createdAt: '2026-09-15' },
  { id: 'vp-4', vendorId: 'vendor-1', vendorName: 'Hyderabad BuildMart', name: 'River Sand (Washed)', category: 'Sand & Aggregates', price: 1850, stock: 42, unit: 'ton', status: 'Active', createdAt: '2026-09-12' },
];

const initialOrders = [
  { id: 'BB-10482', buyer: 'Ravi Constructions', items: 24, total: 68500, status: 'Processing', date: '24 Sep 2026' },
  { id: 'BB-10461', buyer: 'Mehta Builders', items: 8, total: 32400, status: 'Shipped', date: '22 Sep 2026' },
  { id: 'BB-10418', buyer: 'UrbanNest Projects', items: 16, total: 91800, status: 'Delivered', date: '18 Sep 2026' },
];

const initialRFQs = [
  { id: 'RFQ-2084', buyer: 'Ravi Constructions', product: 'PPC Cement', quantity: '500 bags', due: '30 Sep 2026', status: 'New' },
  { id: 'RFQ-2079', buyer: 'Mehta Builders', product: 'TMT Steel Bars', quantity: '2,000 kg', due: '02 Oct 2026', status: 'Quoted' },
  { id: 'RFQ-2068', buyer: 'UrbanNest Projects', product: 'River Sand', quantity: '20 tons', due: '28 Sep 2026', status: 'Won' },
];

export function VendorProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const stats = useMemo(() => ({
    totalRevenue: 486250,
    revenueChange: 12.8,
    totalOrders: 128,
    ordersChange: 8.4,
    activeProducts: products.filter((product) => product.status === 'Active').length,
    lowStock: products.filter((product) => product.stock > 0 && product.stock < 100).length,
    pendingRFQs: initialRFQs.filter((rfq) => ['New', 'Awaiting Customer'].includes(rfq.status)).length,
  }), [products]);

  const vendorProfile = {
    id: 'vendor-1',
    businessName: 'Hyderabad BuildMart',
    ownerName: 'Demo Vendor',
    email: 'vendor@brickbuddy.in',
    phone: '9876543210',
    location: 'Hyderabad, Telangana',
    status: 'Active',
    verified: true,
  };

  return (
    <VendorContext.Provider value={{
      vendorProfile,
      vendorStats: stats,
      vendorProducts: products,
      vendorOrders: initialOrders,
      vendorRFQs: initialRFQs,
      recentOrders: initialOrders,
      recentRFQs: initialRFQs,
      profile: vendorProfile,
      stats,
      products,
      setProducts,
      orders: initialOrders,
      rfqs: initialRFQs,
      recentActivity: initialOrders,
    }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) throw new Error('useVendor must be used within a VendorProvider');
  return context;
}
