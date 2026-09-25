import React, { useState } from 'react';
import CustomerSidebar from '../components/CustomerSidebar';
import { useAuth } from '../context/AuthContext';
import './CustomerPages.css';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '' });
  const [saved, setSaved] = useState(false);
  const update = (event) => { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); setSaved(false); };
  const save = (event) => { event.preventDefault(); updateProfile(form); setSaved(true); };
  const cancel = () => setForm({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '' });
  return <main className="customer-page"><div className="container customer-layout"><CustomerSidebar /><div className="customer-content"><header className="customer-page-header"><p className="section-label">Account settings</p><h1>Profile</h1><p>Keep your customer details up to date.</p></header><section className="customer-panel"><h2>Personal information</h2><form className="profile-form" onSubmit={save}><div className="profile-field"><label htmlFor="profile-name">Full name</label><input id="profile-name" name="name" value={form.name} onChange={update} required /></div><div className="profile-field"><label htmlFor="profile-email">Email</label><input id="profile-email" name="email" type="email" value={form.email} onChange={update} required /></div><div className="profile-field"><label htmlFor="profile-phone">Phone</label><input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={update} /></div><div className="profile-actions"><button type="submit" className="btn-primary">Save Changes</button><button type="button" className="btn-outline" onClick={cancel}>Cancel</button>{saved && <span className="text-link">Profile saved</span>}</div></form></section></div></div></main>;
}
