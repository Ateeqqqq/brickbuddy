import React, { useMemo, useState } from 'react';
import { Edit3, MoreVertical, Package, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorSidebar from '../components/VendorSidebar';
import { categories } from '../data/products';
import { useVendorProducts } from '../context/VendorProductContext';
import './VendorProducts.css';

export default function VendorProducts() {
  const { products, deleteProduct, setProductStatus } = useVendorProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === 'all' || product.category === category) && (status === 'all' || product.status === status);
  }).sort((a, b) => sort === 'price-asc' ? Number(a.price) - Number(b.price) : sort === 'price-desc' ? Number(b.price) - Number(a.price) : sort === 'stock-asc' ? Number(a.stock) - Number(b.stock) : sort === 'stock-desc' ? Number(b.stock) - Number(a.stock) : sort === 'oldest' ? String(a.createdAt || '').localeCompare(String(b.createdAt || '')) : String(b.createdAt || '').localeCompare(String(a.createdAt || ''))), [products, query, category, status, sort]);
  const counts = { total: products.length, active: products.filter((p) => p.status === 'Active').length, draft: products.filter((p) => p.status === 'Draft').length, outOfStock: products.filter((p) => p.status === 'Out of Stock' || Number(p.stock) === 0).length };
  return <main className="vendor-products-page"><div className="container vendor-layout"><VendorSidebar /><div className="vendor-content">
    <header className="vendor-header"><div><p className="section-label">Catalogue</p><h1>Products</h1><p>Manage the products your customers see in the marketplace.</p></div><Link to="/vendor/products/new" className="btn-primary"><Plus size={17} /> Add product</Link></header>
    <div className="product-summary-grid">{[['Total products', counts.total], ['Active products', counts.active], ['Draft products', counts.draft], ['Out of stock', counts.outOfStock]].map(([label, value]) => <div className="product-summary-card" key={label}><Package size={18} /><strong>{value}</strong><span>{label}</span></div>)}</div>
    <section className="vendor-panel product-management-panel"><div className="product-filters"><label className="product-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></label><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All status</option><option>Active</option><option>Draft</option><option>Out of stock</option></select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Sort: newest</option><option value="price">Sort: price</option><option value="stock">Sort: stock</option></select></div>
      <div className="vendor-product-table"><div className="vendor-product-row vendor-product-heading"><span>Product</span><span>Category</span><span>Price / unit</span><span>Stock</span><span>MOQ</span><span>Status</span><span /></div>{filtered.map((product) => <div className="vendor-product-row" key={product.id}><div className="vendor-product-name"><div className="vendor-product-thumb">{product.imageUrl ? <img src={product.imageUrl} alt="" /> : <Package size={20} />}</div><strong>{product.name}</strong></div><span>{product.category}</span><span>₹{Number(product.price || 0).toLocaleString('en-IN')} / {product.unit || 'unit'}</span><span>{product.stock || 0}</span><span>{product.moq || product.minimumOrderQuantity || 1}</span><span><em className={`vendor-product-status ${(Number(product.stock) === 0 && product.status === 'Active' ? 'out-of-stock' : product.status.toLowerCase().replaceAll(' ', '-'))}`}>{Number(product.stock) === 0 && product.status === 'Active' ? 'Out of Stock' : product.status}</em></span><div className="vendor-product-actions"><Link to={`/vendor/products/${product.id}/edit`} aria-label={`Edit ${product.name}`}><Edit3 size={16} /></Link><button type="button" aria-label={`Delete ${product.name}`} onClick={() => window.confirm(`Deactivate ${product.name}?`) && setProductStatus(product.id, 'Inactive')}><Trash2 size={16} /></button><button type="button" aria-label={`Toggle ${product.name} status`} onClick={() => setProductStatus(product.id, product.status === 'Active' ? 'Inactive' : 'Active')}><MoreVertical size={16} /></button></div></div>)}</div>
      {!filtered.length && <p className="product-empty">No products match these filters.</p>}
    </section>
  </div></div></main>;
}
