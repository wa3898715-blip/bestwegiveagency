import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import { api } from '../../services/api';
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface BlogSectionProps {
  onNavigate?: (path: string) => void;
  onSelectPost?: (post: BlogPost) => void;
  showAllInitially?: boolean;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onNavigate, onSelectPost, showAllInitially = false }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Website Design',
    'Digital Marketing',
    'Branding',
    'AI & Automation',
    'Business Growth'
  ];

  useEffect(() => {
    setLoading(true);
    api.getBlogPosts(activeCategory === 'All' ? undefined : activeCategory)
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to load blog posts:', err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const displayedPosts = showAllInitially ? posts : posts.slice(0, 3);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <section id="blog" className="py-24 bg-[#080808] relative border-t border-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
            <span>EDITORIAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            INSIGHTS & <span className="text-[#F4C542]">IDEAS</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Strategic perspectives on modern web architecture, digital marketing algorithms, and AI automation.
          </p>
        </div>

        {/* Filter categories on blog page */}
        {showAllInitially && (
          <div className="flex items-center justify-center overflow-x-auto pb-4 mb-12 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#F4C542] text-black shadow-md'
                    : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-neutral-900/60 animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-[#0D0D0D] rounded-2xl border border-neutral-800 hover:border-[#F4C542]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl"
              >
                <div>
                  {/* Article Cover */}
                  <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-black/30" />

                    {/* Category */}
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-[#F4C542]">
                      {post.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Metadata line without pill enclosure */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3 font-medium">
                      <span>{formatDate(post.published_at || post.created_at || '')}</span>
                      <span>•</span>
                      <span>5 min read</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#F4C542] transition-colors line-clamp-2 leading-snug mb-3">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                      {post.meta_description || post.content.slice(0, 140) + '...'}
                    </p>
                  </div>
                </div>

                {/* Read More Footer */}
                <div className="p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onSelectPost) {
                        onSelectPost(post);
                      } else if (onNavigate) {
                        onNavigate(`/blog?slug=${post.slug}`);
                      }
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F4C542] hover:text-white transition-colors cursor-pointer group/link pt-4"
                  >
                    <span>READ FULL ARTICLE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button on Homepage */}
        {!showAllInitially && posts.length > 3 && (
          <div className="mt-14 text-center">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/blog');
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-700 hover:border-[#F4C542] transition-all cursor-pointer shadow-xl"
            >
              <span>VIEW ALL ARTICLES</span>
              <BookOpen className="w-4 h-4 text-[#F4C542]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
