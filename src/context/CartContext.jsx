import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

function getLowestOffer(product) {
  const offers = Array.isArray(product.vendorOffers) ? product.vendorOffers : [];
  return offers.reduce((lowest, offer) => (
    Number(offer.price ?? 0) < Number(lowest?.price ?? Number.POSITIVE_INFINITY) ? offer : lowest
  ), offers[0] || null);
}

function getMinimumQuantity(product, offer) {
  return Math.max(1, Number(offer?.moq ?? product.minimumOrderQuantity ?? product.moq ?? 1));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product, selectedOffer = getLowestOffer(product)) => {
    const offer = selectedOffer || {};
    const minimumOrderQuantity = getMinimumQuantity(product, offer);
    const vendorId = offer.vendorId || product.vendorId || 'default';
    const itemKey = `${product.id}-${vendorId}`;
    const price = Number(offer.price ?? product.price ?? 0);
    const unit = offer.unit || product.unit;
    const supplier = offer.supplier || product.supplier;
    const availableStock = Number(product.stock);
    if (Number.isFinite(availableStock) && availableStock < minimumOrderQuantity) return false;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.key === itemKey);
      if (existingItem) {
        if (Number.isFinite(availableStock) && existingItem.quantity + minimumOrderQuantity > availableStock) return currentItems;
        return currentItems.map((item) => item.key === itemKey
          ? { ...item, quantity: item.quantity + minimumOrderQuantity }
          : item);
      }

      return [
        ...currentItems,
        {
          key: itemKey,
          product,
          quantity: minimumOrderQuantity,
          price,
          unit,
          supplier,
          vendorId,
          minimumOrderQuantity,
        },
      ];
    });
    return true;
  };

  const updateQuantity = (itemKey, quantity) => {
    setItems((currentItems) => currentItems.map((item) => {
      if (item.key !== itemKey) return item;
      const requested = Math.max(item.minimumOrderQuantity, Number(quantity) || item.minimumOrderQuantity);
      const stock = Number(item.product?.stock);
      const nextQuantity = Number.isFinite(stock) ? Math.min(requested, stock) : requested;
      return { ...item, quantity: nextQuantity };
    }));
  };

  const removeFromCart = (itemKey) => {
    setItems((currentItems) => currentItems.filter((item) => item.key !== itemKey));
  };

  const clearCart = () => setItems([]);

  const cartCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

  const value = {
    items,
    cartCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
