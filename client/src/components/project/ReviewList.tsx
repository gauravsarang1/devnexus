
import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl">
        <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <img
                src={review.reviewer.avatar}
                alt={review.reviewer.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h5 className="text-sm font-bold text-gray-900 leading-none">{review.reviewer.name}</h5>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};
