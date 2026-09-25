import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import CustomerSidebar from '../components/CustomerSidebar';
import { useAuth } from '../context/AuthContext';
import { useRFQs } from '../context/RFQContext';
import './Quotes.css';

export default function Quotes() {
  const { currentUser } = useAuth();
  const { getUserRFQs, cancelRFQ } = useRFQs();
  const rfqs = getUserRFQs(currentUser.id);
  return <main className="customer-page"><div className="container customer-layout"><CustomerSidebar /><div className="customer-content"><header className="customer-page-header quotes-header"><div><p className="section-label">Procurement workspace</p><h1>Bulk Quotations</h1><p>Request competitive pricing for larger material requirements.</p></div><Link to="/shop" className="btn-primary"><Plus size={16} /> Request a Bulk Quote</Link></header>{rfqs.length ? <div className="rfq-list">{rfqs.map((rfq) => <article className="rfq-card" key={rfq.id}><div className="rfq-card-top"><div><span className="rfq-number">{rfq.id}</span><h2>{rfq.title}</h2></div><span className={`rfq-status ${rfq.status.toLowerCase().replaceAll(' ', '-')}`}>{rfq.status}</span></div><div className="rfq-card-meta"><span>Created {rfq.createdAt}</span><span>{rfq.items.length} requested item{rfq.items.length > 1 ? 's' : ''}</span><span>Required by {rfq.requiredBy}</span><span>{rfq.deliveryAddress.split(',')[1] || rfq.deliveryAddress}</span><span>{rfq.quotations.length} quotation{rfq.quotations.length !== 1 ? 's' : ''}</span></div><div className="rfq-card-actions"><Link to={`/quotes/${rfq.id}`} className="btn-primary">View Details</Link>{['Draft', 'Submitted', 'Quotation Received'].includes(rfq.status) && <button type="button" className="btn-outline" onClick={() => window.confirm('Cancel this quotation request?') && cancelRFQ(rfq.id)}>Cancel RFQ</button>}</div></article>)}</div> : <section className="customer-panel quotes-empty"><FileText size={38} /><h2>No quotation requests yet</h2><p>Ask suppliers for better pricing when you are buying in bulk.</p><Link to="/shop" className="btn-primary"><Plus size={16} /> Request a Bulk Quote</Link></section>}</div></div></main>;
}
