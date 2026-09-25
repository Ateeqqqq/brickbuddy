import React, { createContext, useContext, useMemo, useState } from 'react';

const ReviewContext = createContext(null);

const seededReviews = [
  {
    id: 'review-1', productId: 1, userId: 'customer-101', userName: 'Ravi Kumar',
    rating: 5, title: 'Reliable cement for our site', comment: 'Consistent quality and the bags arrived well packed.',
    date: '12 Sep 2026', verifiedPurchase: true, orderId: 'BB-10420',
  },
  {
    id: 'review-2', productId: 1, userId: 'customer-102', userName: 'Meena S',
    rating: 4, title: 'Good value', comment: 'Good product and quick delivery from the supplier.',
    date: '28 Aug 2026', verifiedPurchase: true, orderId: 'BB-10388',
  },
  {
    id: 'review-3', productId: 3, userId: 'customer-103', userName: 'Arjun Buildworks',
    rating: 5, title: 'Strong, uniform bricks', comment: 'The bricks were uniform and had very little breakage.',
    date: '05 Sep 2026', verifiedPurchase: true, orderId: 'BB-10405',
  },
  {
    id: 'review-4', productId: 6, userId: 'customer-104', userName: 'Sonal P',
    rating: 4, title: 'Trusted brand', comment: 'A dependable cement option for residential construction.',
    date: '19 Aug 2026', verifiedPurchase: true, orderId: 'BB-10360',
  },
];

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(seededReviews);

  const getProductReviews = (productId) => reviews.filter((review) => String(review.productId) === String(productId));
  const getProductRating = (productId) => {
    const productReviews = getProductReviews(productId);
    return productReviews.length
      ? productReviews.reduce((total, review) => total + review.rating, 0) / productReviews.length
      : 0;
  };
  const getReviewCount = (productId) => getProductReviews(productId).length;
  const hasReviewed = (orderId, productId, userId) => reviews.some((review) => (
    review.orderId === orderId
      && String(review.productId) === String(productId)
      && review.userId === userId
  ));
  const addReview = (review) => {
    const newReview = {
      ...review,
      id: `review-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setReviews((currentReviews) => [newReview, ...currentReviews]);
    return newReview;
  };
  const deleteReview = (reviewId) => setReviews((currentReviews) => currentReviews.filter((review) => review.id !== reviewId));

  const value = useMemo(() => ({
    reviews, getProductReviews, getProductRating, getReviewCount, addReview, hasReviewed, deleteReview,
  }), [reviews]);

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReviews must be used within a ReviewProvider');
  return context;
}
