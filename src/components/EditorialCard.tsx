'use client';

import React from 'react';
import { BookOpen, Sparkles, Bookmark, ExternalLink, Clock, Check, Cpu } from 'lucide-react';
import { EditorialArticle } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface EditorialCardProps {
  article: EditorialArticle;
  onRead: (article: EditorialArticle) => void;
  onSummarize: (article: EditorialArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: EditorialArticle) => void;
  isRead: boolean;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  article,
  onRead,
  onSummarize,
  isBookmarked,
  onToggleBookmark,
  isRead
}) => {
  const getBadgeStyle = (sourceId: string) => {
    if (sourceId.includes('verge')) return 'bg-rose-50 text-rose-900 border-rose-200';
    if (sourceId.includes('techcrunch')) return 'bg-emerald-50 text-emerald-950 border-emerald-200';
    if (sourceId.includes('ieee')) return 'bg-sky-50 text-sky-950 border-sky-200';
    if (sourceId.includes('hindu')) return 'bg-blue-50 text-blue-900 border-blue-200';
    if (sourceId.includes('indian-express')) return 'bg-red-50 text-red-900 border-red-200';
    if (sourceId.includes('guardian')) return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (sourceId.includes('conversation')) return 'bg-rose-50 text-rose-900 border-rose-200';
    if (sourceId.includes('mint')) return 'bg-orange-50 text-orange-950 border-orange-200';
    if (sourceId.includes('syndicate')) return 'bg-indigo-50 text-indigo-900 border-indigo-200';
    if (sourceId.includes('atlantic')) return 'bg-amber-50 text-amber-900 border-amber-200';
    return 'bg-stone-100 text-stone-800 border-stone-200';
  };

  let timeAgo = '';
  try {
    timeAgo = formatDistanceToNow(new Date(article.timestamp), { addSuffix: true });
  } catch {
    timeAgo = article.pubDate ? new Date(article.pubDate).toLocaleDateString() : '';
  }

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-xl border bg-white p-5 transition-all hover:shadow-md hover:border-stone-400/80 ${
        article.isTech ? 'border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-white' : ''
      } ${isRead ? 'border-stone-200/60 bg-stone-50/40 opacity-80' : 'border-stone-200'}`}
    >
      <div>
        {/* Card Header: Source Badge + Topic Tag + Reading Time */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getBadgeStyle(
                article.sourceId
              )}`}
            >
              {article.sourceName}
            </span>

            {/* Tech Badge */}
            {article.isTech && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Cpu className="w-3 h-3 text-amber-700" />
                <span>Tech & AI</span>
              </span>
            )}

            {article.isToday && (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-stone-900 text-white uppercase tracking-wider">
                Today
              </span>
            )}

            {isRead && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-stone-400 font-medium">
                <Check className="w-3 h-3 text-emerald-500" /> Read
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {article.readingTimeMinutes}m
            </span>

            <button
              onClick={() => onToggleBookmark(article)}
              title={isBookmarked ? 'Remove Bookmark' : 'Save for Later'}
              className="p-1 rounded text-stone-400 hover:text-amber-600 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2
          onClick={() => onRead(article)}
          className="font-editorial text-lg sm:text-xl font-bold text-stone-900 group-hover:text-stone-950 leading-snug cursor-pointer transition-colors mb-2"
        >
          {article.title}
        </h2>

        {/* Author Byline */}
        {article.author && (
          <p className="text-xs font-medium text-stone-500 mb-2">
            By <span className="text-stone-700">{article.author}</span>
          </p>
        )}

        {/* Excerpt Snippet */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans-ui line-clamp-3 mb-4">
          {article.contentSnippet || 'Click to read full editorial and commentary.'}
        </p>
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
        <span className="text-[11px] text-stone-400">{timeAgo}</span>

        <div className="flex items-center gap-1.5">
          {/* AI Takeaways Button */}
          <button
            onClick={() => onSummarize(article)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
            title="Generate AI Thesis & Key Takeaways"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">AI Takeaways</span>
          </button>

          {/* Reader Mode Button */}
          <button
            onClick={() => onRead(article)}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read</span>
          </button>

          {/* External Link */}
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            title="Read on original publisher website"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
