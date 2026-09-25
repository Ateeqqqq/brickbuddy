import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAddresses } from '../context/AddressContext';
import { useAuth } from '../context/AuthContext';
import { useRFQs } from '../context/RFQContext';
import './RFQForm.css';

export default function RFQForm({ product, vendor, offer, onCancel, onSubmitted }) {
  const { currentUser } = useAuth();
  const { addresses, defaultAddress } = useAddresses();
  const { createRFQ } = useRFQs();
  const [form, setForm] = useState({ quantity: '', unit: offer?.unit || product.unit, targetPrice: '', requiredBy: '', deliveryAddress: defaultAddress?.id || addresses[0]?.id || '', notes: '' });
  const [errors, setErrors] = useState({});
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!Number(form.quantity) || Number(form.quantity) <= 0) errors.quantity = 'Enter a quantity greater than zero.';
    if (!form.requiredBy || Number.isNaN(new Date(form.requiredBy).getTime()) || new Date(`${form.requiredBy}T00:00:00`) < new Date(new Date().toDateString())) errors.requiredBy = 'Select a valid future required-by date.';
    if (!form.deliveryAddress) errors.deliveryAddress = 'Select a delivery address.';
    setErrors(errors);
    if (Object.keys(errors).length) return;
    const address = addresses.find((item) => item.id === form.deliveryAddress);
    if (!address) {
      setErrors({ deliveryAddress: 'Select a saved delivery address.' });
      return;
    }
    const created = createRFQ({ userId: currentUser.id, title: `${product.name} bulk quotation`, items: [{ productId: product.id, productName: product.name, vendorId: vendor?.id || offer?.vendorId, vendorName: vendor?.name || offer?.supplier, quantity: Number(form.quantity), unit: form.unit, targetPrice: form.targetPrice ? Number(form.targetPrice) : null }], deliveryAddress: `${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`, requiredBy: form.requiredBy, notes: form.notes });
    onSubmitted(created);
  };
  return <form className="rfq-form" onSubmit={submit}><div className="rfq-context"><strong>{product.name}</strong><span>Supplier: {vendor?.name || offer?.supplier}</span><span>Unit: {form.unit}</span></div><label>Quantity<input name="quantity" type="number" min="1" value={form.quantity} onChange={update} />{errors.quantity && <small className="field-error">{errors.quantity}</small>}</label><label>Unit<select name="unit" value={form.unit} onChange={update}><option>{product.unit}</option><option>bag</option><option>piece</option><option>ton</option><option>kg</option></select></label><label>Target Price <span>(optional)</span><input name="targetPrice" type="number" min="0" value={form.targetPrice} onChange={update} placeholder="₹ per unit" /></label><label>Required By<input name="requiredBy" type="date" value={form.requiredBy} onChange={update} />{errors.requiredBy && <small className="field-error">{errors.requiredBy}</small>}</label><label>Delivery Address{addresses.length ? <select name="deliveryAddress" value={form.deliveryAddress} onChange={update}><option value="">Select an address</option>{addresses.map((address) => <option value={address.id} key={address.id}>{address.addressType} - {address.city}, {address.state}</option>)}</select> : <Link to="/addresses">Add an address first</Link>}{errors.deliveryAddress && <small className="field-error">{errors.deliveryAddress}</small>}</label><label>Additional Requirements / Notes<textarea name="notes" rows="3" value={form.notes} onChange={update} placeholder="Tell suppliers about your project requirements" /></label><div className="rfq-form-actions"><button type="button" className="btn-outline" onClick={onCancel}>Cancel</button><button type="submit" className="btn-primary">Submit RFQ</button></div></form>;
}
