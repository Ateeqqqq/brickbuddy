import React, { useState } from 'react';
import { Edit3, Home, MapPin, Plus, Trash2, BriefcaseBusiness } from 'lucide-react';
import CustomerSidebar from '../components/CustomerSidebar';
import { useAddresses } from '../context/AddressContext';
import './CustomerPages.css';

const emptyForm = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '', landmark: '',
  city: '', state: '', pincode: '', addressType: 'Home', isDefault: false,
};

const fields = [
  ['fullName', 'Full name', 'text'], ['phone', 'Phone', 'tel'],
  ['addressLine1', 'Address line 1', 'text'], ['addressLine2', 'Address line 2', 'text'],
  ['city', 'City', 'text'],
  ['state', 'State', 'text'], ['pincode', 'Pincode', 'text'],
];

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Name is required.';
  if (!/^[+]?[\d\s-]{8,}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!form.addressLine1.trim()) errors.addressLine1 = 'Address is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.state.trim()) errors.state = 'State is required.';
  if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = 'Enter a valid 6-digit pincode.';
  return errors;
}

function AddressIcon({ type }) {
  return type === 'Work' ? <BriefcaseBusiness size={18} /> : <Home size={18} />;
}

export default function Addresses() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setForm({ ...address });
    setEditingId(address.id);
    setErrors({});
    setShowForm(true);
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (editingId) updateAddress(editingId, form);
    else addAddress(form);
    setShowForm(false);
  };

  const cancel = () => {
    setShowForm(false);
    setErrors({});
  };

  const remove = (address) => {
    if (window.confirm(`Delete the ${address.addressType.toLowerCase()} address for ${address.city}?`)) deleteAddress(address.id);
  };

  return (
    <main className="customer-page">
      <div className="container customer-layout">
        <CustomerSidebar />
        <div className="customer-content">
          <header className="customer-page-header address-page-header">
            <div>
              <p className="section-label">Delivery preferences</p>
              <h1>Addresses</h1>
              <p>Save delivery locations for a faster checkout later.</p>
            </div>
            {!showForm && <button type="button" className="btn-primary" onClick={openAddForm}><Plus size={16} /> Add New Address</button>}
          </header>

          {showForm && (
            <section className="customer-panel address-form-panel">
              <div className="section-heading"><div><p className="section-label">{editingId ? 'Update saved location' : 'New delivery location'}</p><h2>{editingId ? 'Edit Address' : 'Add New Address'}</h2></div></div>
              <form className="address-form" onSubmit={submit} noValidate>
                {fields.map(([name, label, type]) => (
                  <div className={`profile-field address-field address-field-${name}`} key={name}>
                    <label htmlFor={`address-${name}`}>{label}</label>
                    <input id={`address-${name}`} name={name} type={type} value={form[name]} onChange={updateField} aria-invalid={Boolean(errors[name])} />
                    {errors[name] && <span className="field-error">{errors[name]}</span>}
                  </div>
                ))}
                <div className="profile-field">
                  <label htmlFor="address-type">Address type</label>
                  <select id="address-type" name="addressType" value={form.addressType} onChange={updateField}>
                    <option>Home</option><option>Work</option><option>Other</option>
                  </select>
                </div>
                <div className="profile-field address-landmark-field">
                  <label htmlFor="address-landmark">Landmark</label>
                  <input id="address-landmark" name="landmark" value={form.landmark} onChange={updateField} />
                </div>
                <label className="address-default-check"><input type="checkbox" name="isDefault" checked={form.isDefault} onChange={updateField} /> Set as default address</label>
                <div className="profile-actions"><button type="submit" className="btn-primary">{editingId ? 'Save Address' : 'Add Address'}</button><button type="button" className="btn-outline" onClick={cancel}>Cancel</button></div>
              </form>
            </section>
          )}

          <section className="address-grid">
            {addresses.map((address) => (
              <article className={`address-card${address.isDefault ? ' is-default' : ''}`} key={address.id}>
                <div className="address-card-header"><div className="address-type"><span className="address-type-icon"><AddressIcon type={address.addressType} /></span><strong>{address.addressType}</strong></div>{address.isDefault && <span className="default-badge">Default</span>}</div>
                <div className="address-card-body"><strong>{address.fullName}</strong><p>{address.phone}</p><p>{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}</p>{address.landmark && <p>{address.landmark}</p>}<p>{address.city}, {address.state} - {address.pincode}</p></div>
                <div className="address-card-actions"><button type="button" onClick={() => openEditForm(address)}><Edit3 size={14} /> Edit</button><button type="button" className="delete-address" onClick={() => remove(address)}><Trash2 size={14} /> Delete</button>{!address.isDefault && <button type="button" className="set-default" onClick={() => setDefaultAddress(address.id)}>Set as Default</button>}</div>
              </article>
            ))}
          </section>
          {!addresses.length && !showForm && <section className="customer-panel empty-addresses"><MapPin size={34} /><h2>No saved addresses yet</h2><p>Add a delivery address to use it during checkout.</p><button type="button" className="btn-primary" onClick={openAddForm}><Plus size={16} /> Add New Address</button></section>}
        </div>
      </div>
    </main>
  );
}
