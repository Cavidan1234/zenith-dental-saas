'use client';

import React from 'react';
import { Star, Heart, AlertCircle, Check } from 'lucide-react';
import { HIGHLIGHT_TAGS } from './reviewConstants';

interface ReviewStarRatingSelectorProps {
  rating: number;
  hoverRating: number;
  onHoverRating: (stars: number) => void;
  onSelectRating: (stars: number) => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export function ReviewStarRatingSelector({
  rating,
  hoverRating,
  onHoverRating,
  onSelectRating,
  selectedTags,
  onToggleTag,
}: ReviewStarRatingSelectorProps) {
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => onHoverRating(star)}
                onMouseLeave={() => onHoverRating(0)}
                onClick={() => onSelectRating(star)}
                className="p-1 sm:p-2 transition-all duration-150 transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${
                    isActive
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Dynamic Sentiment Descriptor */}
        <div className="text-sm font-bold">
          {rating === 5 && (
            <span className="text-emerald-400 flex items-center justify-center gap-1.5">
              <Heart className="w-4 h-4 fill-emerald-400" />
              Exceptional &amp; Completely Pain-Free!
            </span>
          )}
          {rating === 4 && (
            <span className="text-brand-300">
              Very Good Experience · Highly Recommended
            </span>
          )}
          {rating === 3 && (
            <span className="text-amber-300">
              Satisfactory · Some Room for Improvement
            </span>
          )}
          {rating <= 2 && (
            <span className="text-rose-400 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Experienced Discomfort or Concern
            </span>
          )}
        </div>
      </div>

      {/* Experience Highlight Tag Chips */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
          What stood out most during your visit?
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {HIGHLIGHT_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 scale-102 border border-brand-400'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
