import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockOrders } from '../data/customerData';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(mockOrders);

  const createOrder = (order) => {
    const createdOrder = {
      ...order,
      id: `BB-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Processing',
      itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    };
    setOrders((currentOrders) => [createdOrder, ...currentOrders]);
    return createdOrder;
  };

  const getOrderById = (orderId) => orders.find((order) => order.id === orderId);
  const value = useMemo(() => ({ orders, createOrder, getOrderById }), [orders]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
}
