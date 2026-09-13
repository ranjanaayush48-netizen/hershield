import React, { useState } from 'react';
import { SAFETY_ARTICLES } from '../data/mockData';
import { SafetyArticle } from '../types';
import { 
  ShieldAlert, 
  Laptop, 
  Car, 
  Briefcase, 
  Train, 
  AlertCircle, 
  HeartHandshake, 
  Wallet, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Clock, 
  User, 
  BookOpen,
  Share2
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ShieldAlert,
  Laptop,
  Car,
  Briefcase,
  Train,
  AlertCircle,
  HeartHandshake,
  Wallet
};

export const Resources: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<SafetyArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Emergency Preparedness',
    'Online Safety',
    'Travel Safety',
    'Workplace Safety',
    'Public Transport Safety',
    'Self-Protection Awareness',
    'Relationship Safety',
    'Financial Safety'
  ];

  const filteredArticles = selectedCategory === 'All' 
    ? SAFETY_ARTICLES 
    : SAFETY_ARTICLES.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-bold text-[#2DD4BF] tracking-wider">
            Safety Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Safety Resources & Prevention Guides
          </h1>
          <p className="text-base sm:text-lg text-[#B8B5C9] leading-relaxed">
            Curated tactical security protocols written by crisis counselors, legal advocates, and personal protection specialists.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#F43F6F] text-white shadow-sm'
                  : 'bg-[#1A1028] text-[#B8B5C9] hover:text-white border border-[#30263D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => {
            const Icon = iconMap[art.iconName] || BookOpen;
            return (
              <div
                key={art.id}
                className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-[#A78BFA]/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-[#A78BFA] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-[#B8B5C9] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#2DD4BF] uppercase tracking-wider block">
                    {art.category}
                  </span>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#F43F6F] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#B8B5C9] leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#30263D] flex items-center justify-between">
                  <span className="text-[11px] text-[#B8B5C9] truncate max-w-[150px]">
                    By {art.author.split(' ')[0]} {art.author.split(' ')[1]}
                  </span>

                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#30263D] pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#B8B5C9] pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#A78BFA]" />
                    {selectedArticle.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    {selectedArticle.readTime}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-xl text-[#B8B5C9] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 text-sm text-[#B8B5C9] leading-relaxed">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#30263D] text-white font-medium italic">
                "{selectedArticle.summary}"
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-3">
                  Tactical Action Checklist
                </h4>
                <div className="space-y-2.5">
                  {selectedArticle.keySteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#0B1020] border border-[#30263D]">
                      <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                      <span className="text-xs text-white leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-2">
                  In-Depth Advisory
                </h4>
                <p className="text-xs text-[#B8B5C9] leading-relaxed">
                  {selectedArticle.fullGuide}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#30263D] flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Guide link copied to clipboard!');
                }}
                className="text-xs text-[#B8B5C9] hover:text-white flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Guide
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
