import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, Loader2, X } from "lucide-react";
import { reviewService } from "../../services/reviewService";
import { toast } from "sonner";

interface ReviewFormProps {
  reviewedUserId: string;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ reviewedUserId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        reviewedUserId,
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted! Thank you.");
      setRating(0);
      setComment("");
      setIsExpanded(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      layout
      className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-6 mb-8 overflow-hidden"
    >
      {!isExpanded ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Share your experience</h4>
              <p className="text-sm text-slate-500 font-medium">How was your collaboration?</p>
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(true)}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-start">
            <h4 className="text-xl font-black text-slate-900">Rate your connection</h4>
            <button 
              type="button" 
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Star Selection */}
          <div className="flex flex-col items-center py-4 bg-slate-50 rounded-2xl">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={40}
                    className={`transition-colors duration-200 ${
                      star <= (hover || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-300 fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
              {rating === 5 ? "Exceptional" : rating === 4 ? "Great" : rating === 3 ? "Good" : rating === 2 ? "Fair" : rating === 1 ? "Poor" : "Select Rating"}
            </p>
          </div>

          {/* Comment Area */}
          <div className="relative">
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Optional Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your learning/teaching experience..."
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-blue-500 min-h-[120px] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full h-14 bg-blue-600 text-white rounded-[20px] font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send size={18} />
                Post Review
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ReviewForm;