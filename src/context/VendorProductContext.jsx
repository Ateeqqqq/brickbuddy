import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useVendor } from './VendorContext';

const VendorProductContext = createContext(null);

export function VendorProductProvider({ children }) {
  const { products, setProducts } = useVendor();
  const { currentUser } = useAuth();
  const vendorId = currentUser?.id === 'demo-vendor' ? 'vendor-1' : currentUser?.id;
  const ownedProducts = products.filter((product) => product.vendorId === vendorId);
  const [lowStockThreshold, setLowStockThreshold] = useState(100);
  const [activity, setActivity] = useState([]);
  const isOwned = (product) => product && product.vendorId === vendorId;
  const adjustStock = (id, mode, amount, note = '') => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) throw new Error('Enter a valid non-negative stock value.');
    const source = ownedProducts.find((product) => String(product.id) === String(id));
    if (!source) throw new Error('Product not found.');
    const before = Math.max(0, Number(source.stock) || 0);
    const after = mode === 'set' ? value : mode === 'remove' ? before - value : before + value;
    if (after < 0) throw new Error('Stock cannot be less than zero.');
    const changed = { product: source, before, after };
    setProducts((current) => current.map((product) => {
      if (String(product.id) !== String(id) || !isOwned(product)) return product;
      return { ...product, stock: after, inStock: after > 0 };
    }));
    setActivity((items) => [{ id: `activity-${Date.now()}`, productId: changed.product.id, productName: changed.product.name, mode, amount: value, before: changed.before, after: changed.after, note, createdAt: new Date().toISOString() }, ...items].slice(0, 100));
    return changed.after;
  };
  const value = useMemo(() => ({
    products: ownedProducts,
    vendorProducts: ownedProducts,
    getVendorProducts: () => ownedProducts,
    getVendorProductById: (id) => ownedProducts.find((product) => String(product.id) === String(id)),
    lowStockThreshold,
    setLowStockThreshold: (value) => setLowStockThreshold(Math.max(0, Number(value) || 0)),
    setProductThreshold: (id, value) => {
      const threshold = Number(value);
      if (!Number.isInteger(threshold) || threshold < 0) throw new Error('Threshold must be a non-negative whole number.');
      setProducts((current) => current.map((product) => product.id === id && isOwned(product)
        ? { ...product, lowStockThreshold: threshold, updatedAt: new Date().toISOString() }
        : product));
    },
    activity,
    getProductHealth: (product) => {
      const threshold = product.lowStockThreshold ?? lowStockThreshold;
      return Number(product.stock) <= 0 ? 'Out of Stock' : Number(product.stock) <= threshold ? 'Low Stock' : 'Healthy';
    },
    adjustStock,
    addStock: (id, amount, note) => adjustStock(id, 'add', amount, note),
    removeStock: (id, amount, note) => adjustStock(id, 'remove', amount, note),
    setStock: (id, amount, note) => adjustStock(id, 'set', amount, note),
    createProduct: (product) => {
      const next = { ...product, id: `vp-${Date.now()}`, vendorId, vendorName: 'Hyderabad BuildMart', status: product.status || 'Draft', createdAt: new Date().toISOString() };
      setProducts((current) => [...current, next]);
      return next;
    },
    updateProduct: (id, updates) => setProducts((current) => current.map((product) => (
      product.id === id && isOwned(product) ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
    ))),
    deleteProduct: (id) => setProducts((current) => current.filter((product) => product.id !== id || !isOwned(product))),
    setProductStatus: (id, status) => setProducts((current) => current.map((product) => (
      product.id === id && isOwned(product) ? { ...product, status, inStock: Number(product.stock) > 0 } : product
    ))),
    toggleProductStatus: (id) => setProducts((current) => current.map((product) => product.id === id && isOwned(product) ? { ...product, status: product.status === 'Active' ? 'Inactive' : 'Active' } : product)),
  }), [ownedProducts, lowStockThreshold, activity, setProducts, vendorId]);
  return <VendorProductContext.Provider value={value}>{children}</VendorProductContext.Provider>;
}

export function useVendorProducts() {
  const context = useContext(VendorProductContext);
  if (!context) throw new Error('useVendorProducts must be used within a VendorProductProvider');
  return context;
}
