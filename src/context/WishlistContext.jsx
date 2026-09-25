import React, { createContext, useContext, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  const isWishlisted = (productId) => items.some((product) => product.id === productId);

  const toggleWishlist = (product) => {
    setItems((currentItems) => (
      currentItems.some((item) => item.id === product.id)
        ? currentItems.filter((item) => item.id !== product.id)
        : [...currentItems, product]
    ));
  };

  const removeFromWishlist = (productId) => {
    setItems((currentItems) => currentItems.filter((product) => product.id !== productId));
  };

  const wishlistCount = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{ items, wishlistCount, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
