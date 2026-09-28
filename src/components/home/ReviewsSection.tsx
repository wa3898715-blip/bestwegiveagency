import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquarePlus, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface ReviewsSectionProps {
  onNavigate?: (path: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onNavigate }) => {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    rating: 5,
    message: ''
  });

  useEffect(() => {
    api.getApprovedReviews()
      .then(data => setReviews(data))
      .catch(err => console.error('Failed to load reviews:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitReview(formData);
      showToast(res.message, 'success');
      setShowSubmitModal(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        rating: 5,
        message: ''
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-[#050505] relative border-t border-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              WHAT PEOPLE <span className="text-[#F4C542]">SAY ABOUT US</span>
            </h2>
            <p className="text-base text-neutral-400">
              Honest feedback from our partners, clients, and collaborators.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all duration-200 shadow-lg shadow-[#F4C542]/10 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>SUBMIT YOUR REVIEW</span>
            </button>
          </div>
        </div>

        {/* Demo Content Disclosure Notice */}
        <div className="mb-10 p-3 rounded-lg bg-[#0F0F0F] border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F4C542]" />
            <span>Notice: Sample testimonials below are clearly labeled as <strong className="text-white">SAMPLE REVIEW — DEMO CONTENT</strong> for layout demonstration.</span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:inline">Verification Standard</span>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-neutral-900/60 animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#0B0B0B] rounded-2xl border border-neutral-800 p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#F4C542]/50 shadow-xl relative group"
              >
                <div>
                  {/* Demo Watermark Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-[#F4C542]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-[#F4C542]' : 'text-neutral-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/60 border border-neutral-800 text-neutral-400">
                      SAMPLE REVIEW — DEMO
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic">
                    "{rev.message}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                    {rev.company && (
                      <p className="text-xs text-neutral-400 mt-0.5">{rev.company}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-[#F4C542] font-semibold bg-[#F4C542]/10 px-2 py-0.5 rounded border border-[#F4C542]/20">
                    Verified Project
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B0B0B] border border-neutral-700 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Submit a Client Review</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Reviews are verified and reviewed by administration prior to publication.
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Sterling"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sterling & Co. Enterprises"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className={`p-2 rounded-lg border transition-colors flex items-center gap-1 ${
                        formData.rating >= num
                          ? 'border-[#F4C542] bg-[#F4C542]/10 text-[#F4C542]'
                          : 'border-neutral-800 bg-[#141414] text-neutral-500'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${formData.rating >= num ? 'fill-[#F4C542]' : ''}`} />
                      <span className="text-xs font-bold">{num}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Review Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your experience collaborating with BestWeGive Agency..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-lg p-3 text-sm text-white focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'SUBMIT REVIEW FOR APPROVAL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
