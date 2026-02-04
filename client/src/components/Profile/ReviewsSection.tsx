import React from "react";
import { Star, Quote } from "lucide-react";
import { Review } from "../../types";

interface ReviewsSectionProps {
  reviews: Review[];
  stats: { avgRating: number | null; totalReviews: number | null };
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, stats }) => {
  console.log("stats", stats)
  console.log("hello")
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Endorsements</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-yellow-400">
              <Star size={16} fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-slate-600">
              {"0.0"} ({stats.totalReviews}{" "}
              reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-50 border border-slate-100 p-6 rounded-[28px] relative group"
            >
              <Quote
                className="absolute top-4 right-6 text-slate-200 group-hover:text-blue-100 transition-colors"
                size={40}
              />
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    review.reviewer.avatar ||
                    `https://ui-avatars.com/api/?name=${review.reviewer?.name}`
                  }
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  alt=""
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {review.reviewer?.name}
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "{review.comment || "Great experience working together!"}"
              </p>
              <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No reviews yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
