import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { api } from '../services/api';
import { BlogSection } from '../components/home/BlogSection';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BlogPageProps {
  onNavigate?: (path: string) => void;
  selectedSlug?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, selectedSlug }) => {
  const { getWhatsAppUrl, showToast } = useApp();
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (selectedSlug) {
      api.getBlogPostBySlug(selectedSlug)
        .then(post => setActivePost(post))
        .catch(err => console.error('Failed to load post by slug:', err));
    }
  }, [selectedSlug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activePost?.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  if (activePost) {
    return (
      <div className="pt-28 pb-24 bg-[#000000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setActivePost(null)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#F4C542] mb-8 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL INSIGHTS</span>
          </button>

          <article className="space-y-8">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#111111] border border-neutral-800 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F4C542]">
                {activePost.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
                {activePost.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">{activePost.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(activePost.published_at || activePost.created_at || '').toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Article</span>
                </button>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl h-80 sm:h-96 bg-neutral-900">
              <img
                src={activePost.cover_image}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rich Content */}
            <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed text-base sm:text-lg space-y-6 pt-4">
              <p className="whitespace-pre-line leading-relaxed">
                {activePost.content}
              </p>
            </div>

            {/* Bottom Callout */}
            <div className="mt-14 p-8 rounded-2xl bg-[#0B0B0B] border border-[#F4C542]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Apply These Insights to Your Enterprise</h4>
                <p className="text-xs text-neutral-400">
                  Book a free consultation with our senior digital architects to review your digital positioning.
                </p>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('/book-appointment')}
                className="shrink-0 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-lg shadow-[#F4C542]/20 cursor-pointer"
              >
                SCHEDULE STRATEGY CALL
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <BlogSection
        showAllInitially={true}
        onNavigate={onNavigate}
        onSelectPost={(post) => setActivePost(post)}
      />
    </div>
  );
};
