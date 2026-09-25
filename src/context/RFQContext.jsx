import React, { createContext, useContext, useMemo, useState } from 'react';

const RFQContext = createContext(null);

const seededRFQs = [
  {
    id: 'RFQ-2026-001',
    userId: 'demo-customer',
    createdAt: '20 Sep 2026',
    status: 'Quotation Received',
    title: 'Cement requirement for Lake View project',
    items: [{ productId: 1, productName: 'UltraTech Cement OPC 53 Grade', vendorId: 'vendor-ultratech', vendorName: 'UltraTech Ltd', quantity: 500, unit: 'bag', targetPrice: 400 }],
    deliveryAddress: '24 Lake View Road, Bengaluru, Karnataka - 560001',
    requiredBy: '2026-10-15',
    notes: 'Please include delivery to the project site.',
    quotations: [
      { id: 'QUO-2026-101', rfqId: 'RFQ-2026-001', vendorId: 'vendor-ultratech', vendorName: 'UltraTech Ltd', createdAt: '21 Sep 2026', validUntil: '30 Sep 2026', items: [{ productId: 1, productName: 'UltraTech Cement OPC 53 Grade', quantity: 500, unit: 'bag', price: 395 }], subtotal: 197500, deliveryCharge: 2500, total: 200000, notes: 'Delivery within 4 business days.', status: 'Pending' },
      { id: 'QUO-2026-102', rfqId: 'RFQ-2026-001', vendorId: 'vendor-raj-cement', vendorName: 'Raj Cement Depot', createdAt: '22 Sep 2026', validUntil: '02 Oct 2026', items: [{ productId: 1, productName: 'UltraTech Cement OPC 53 Grade', quantity: 500, unit: 'bag', price: 405 }], subtotal: 202500, deliveryCharge: 1200, total: 203700, notes: 'Bulk pricing includes site unloading.', status: 'Pending' },
    ],
  },
];

export function RFQProvider({ children }) {
  const [rfqs, setRFQs] = useState(seededRFQs);
  const createRFQ = (rfq) => {
    const created = { ...rfq, id: `RFQ-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`, createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Submitted', quotations: [] };
    setRFQs((current) => [created, ...current]);
    return created;
  };
  const getRFQById = (id) => rfqs.find((rfq) => rfq.id === id);
  const getUserRFQs = (userId) => rfqs.filter((rfq) => rfq.userId === userId);
  const updateRFQ = (id, updates) => setRFQs((current) => current.map((rfq) => rfq.id === id ? { ...rfq, ...updates } : rfq));
  const cancelRFQ = (id) => updateRFQ(id, { status: 'Cancelled' });
  const addMockQuotation = (rfqId, quotation) => setRFQs((current) => current.map((rfq) => rfq.id === rfqId ? { ...rfq, status: 'Quotation Received', quotations: [...rfq.quotations, { ...quotation, rfqId }] } : rfq));
  const getQuotationsForRFQ = (id) => getRFQById(id)?.quotations || [];
  const acceptQuotation = (rfqId, quotationId) => setRFQs((current) => current.map((rfq) => rfq.id !== rfqId ? rfq : { ...rfq, status: 'Accepted', quotations: rfq.quotations.map((quote) => ({ ...quote, status: quote.id === quotationId ? 'Accepted' : 'Rejected' })) }));
  const rejectQuotation = (rfqId, quotationId) => setRFQs((current) => current.map((rfq) => rfq.id !== rfqId ? rfq : { ...rfq, quotations: rfq.quotations.map((quote) => quote.id === quotationId ? { ...quote, status: 'Rejected' } : quote) }));
  const value = useMemo(() => ({ rfqs, createRFQ, getRFQById, getUserRFQs, cancelRFQ, updateRFQ, addMockQuotation, getQuotationsForRFQ, acceptQuotation, rejectQuotation }), [rfqs]);
  return <RFQContext.Provider value={value}>{children}</RFQContext.Provider>;
}

export function useRFQs() {
  const context = useContext(RFQContext);
  if (!context) throw new Error('useRFQs must be used within an RFQProvider');
  return context;
}
