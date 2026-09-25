import React, { useState } from 'react';
import './InventoryAdjustmentModal.css';

export default function InventoryAdjustmentModal({ product, mode, onClose, onSubmit }) {
  const [amount, setAmount] = useState(mode === 'set' ? product.stock : '');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const labels = { add: 'Add stock', remove: 'Remove stock', set: 'Set exact stock' };
  const submit = (event) => {
    event.preventDefault();
    try { onSubmit(amount, note); onClose(); } catch (exception) { setError(exception.message); }
  };
  return <div className="inventory-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="inventory-modal" onSubmit={submit}>
      <h2>{labels[mode]}</h2><p>{product.name} · Current stock: <strong>{product.stock || 0} {product.unit || 'units'}</strong></p>
      <label>{mode === 'set' ? 'New stock quantity' : 'Quantity'}<input autoFocus type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
      <label>Note (optional)<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="e.g. Received shipment" rows="3" /></label>
      {error && <p className="inventory-form-error">{error}</p>}
      <div className="inventory-modal-actions"><button type="button" className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary" type="submit">{labels[mode]}</button></div>
    </form>
  </div>;
}
