import React from 'react';
import { Link } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';
import './CustomerPages.css';

export default function Reviews() {
  const { currentUser } = useAuth();
  const { reviews, deleteReview } = useReviews();
  const userReviews = reviews.filter((review) => review.userId === currentUser?.id);

  return (
    <main className="customer-page">
      <div className="container customer-layout">
        <CustomerSidebar />
        <div className="customer-content">
          <header className="customer-page-header"><p className="section-label">Your feedback</p><h1>Reviews</h1><p>Review history for materials purchased through BrickBuddy.</p></header>
          <section className="customer-panel">
            <h2>Review history</h2>
            {userReviews.length ? userReviews.map((review) => {
              const product = products.find((item) => String(item.id) === String(review.productId));
              return <article className="review-item" key={review.id}><div className="review-meta"><div><strong>{product?.name || 'Product'}</strong><span className="review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><small>{review.date}</small></div><h3>{review.title}</h3><p>{review.comment}</p><div className="customer-review-footer"><span className={review.verifiedPurchase ? 'verified-review' : 'unverified-review'}>{review.verifiedPurchase ? 'Verified Purchase' : 'Customer Review'}</span><button type="button" className="review-delete-button" onClick={() => deleteReview(review.id)}>Delete</button><Link to={`/shop/${review.productId}`} className="text-link">View product</Link></div></article>;
            }) : <div className="empty-review-state"><p>You have not submitted any reviews yet.</p><Link to="/orders" className="btn-primary">Review a Purchased Product</Link></div>}
          </section>
        </div>
      </div>
    </main>
  );
}
