'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bookmark,
  ExternalLink,
  Clock,
  Type,
  Sun,
  Moon,
  Coffee,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileCheck2
} from 'lucide-react';
import { EditorialArticle, AISummary, ReaderSettings } from '@/types';
import { ExtractedArticle } from '@/lib/extractor';

interface ReaderModalProps {
  article: EditorialArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: EditorialArticle) => void;
  onMarkAsRead: (id: string) => void;
  userApiKey?: string;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onMarkAsRead,
  userApiKey
}) => {
  const [extracted, setExtracted] = useState<ExtractedArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedFullText, setCopiedFullText] = useState(false);

  const [settings, setSettings] = useState<ReaderSettings>({
    theme: 'paper',
    fontFamily: 'serif',
    fontSize: 'medium',
    lineHeight: 'relaxed'
  });

  useEffect(() => {
    if (!article) return;

    onMarkAsRead(article.id);
    setLoading(true);
    setExtracted(null);
    setSummary(null);

    // Fetch full extracted article content with fallback
    fetch('/api/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: article.link,
        fallback: article.fullContent || article.contentSnippet
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.article) {
          setExtracted(data.article);
        }
      })
      .catch((err) => console.error('Error extracting article:', err))
      .finally(() => setLoading(false));

    setLoadingSummary(true);
    fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: article.title,
        content: article.fullContent || article.contentSnippet,
        apiKey: userApiKey
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.summary) {
          setSummary(data.summary);
        }
      })
      .catch((err) => console.error('Error generating summary:', err))
      .finally(() => setLoadingSummary(false));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article, onClose, onMarkAsRead, userApiKey]);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyFullArticle = () => {
    const textToCopy = paragraphsToRender.join('\n\n');
    const header = `${article.title}\nSource: ${article.sourceName}\nAuthor: ${article.author || 'Editorial Board'}\nLink: ${article.link}\n\n`;
    navigator.clipboard.writeText(header + textToCopy);
    setCopiedFullText(true);
    setTimeout(() => setCopiedFullText(false), 2000);
  };

  const getThemeClass = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-[#121316] text-[#e2e8f0] border-stone-800';
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#ebd9b3]';
      case 'paper':
      default:
        return 'bg-[#fafaf8] text-[#1a1a1a] border-stone-200';
    }
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small':
        return 'text-base sm:text-lg leading-relaxed';
      case 'large':
        return 'text-xl sm:text-2xl leading-loose';
      case 'xlarge':
        return 'text-2xl sm:text-3xl leading-loose';
      case 'medium':
      default:
        return 'text-lg sm:text-xl leading-relaxed';
    }
  };

  const paragraphsToRender =
    extracted && extracted.paragraphs.length > 0
      ? extracted.paragraphs
      : [article.contentSnippet];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 transition-all font-sans-ui">
      <div
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col my-auto transition-colors duration-200 border ${getThemeClass()}`}
      >
        {/* Sticky Reader Toolbar */}
        <div
          className={`sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b backdrop-blur-md rounded-t-2xl ${
            settings.theme === 'dark'
              ? 'bg-[#121316]/90 border-stone-800'
              : settings.theme === 'sepia'
              ? 'bg-[#fbf0d9]/90 border-[#ebd9b3]'
              : 'bg-[#fafaf8]/90 border-stone-200'
          }`}
        >
          {/* Outlet Info & Word Count */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="uppercase tracking-wider opacity-75">{article.sourceName}</span>
            <span className="opacity-40">•</span>
            <span className="opacity-75 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {extracted?.readingTimeMinutes || article.readingTimeMinutes} min read
            </span>
            <span className="opacity-40">•</span>
            <span className="opacity-85 font-mono flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
              <FileCheck2 className="w-3.5 h-3.5" />
              Complete Text ({paragraphsToRender.length} Paras • {extracted?.wordCount || article.readingTimeMinutes * 180} words)
            </span>
          </div>

          {/* Controls: Copy Text, Theme, Font Family, Font Size, Share, Bookmark, Close */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleCopyFullArticle}
              title="Copy Complete Editorial Text"
              className="px-2 py-1 text-xs rounded border border-stone-300/40 hover:bg-black/5 flex items-center gap-1"
            >
              {copiedFullText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Text</span>
                </>
              )}
            </button>

            <div className="flex items-center rounded-lg border border-stone-300/40 p-0.5 bg-black/5">
              <button
                onClick={() => setSettings((s) => ({ ...s, theme: 'paper' }))}
                title="Paper Theme"
                className={`p-1 rounded ${settings.theme === 'paper' ? 'bg-white shadow-sm' : 'opacity-60'}`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-600" />
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, theme: 'sepia' }))}
                title="Warm Sepia Theme"
                className={`p-1 rounded ${settings.theme === 'sepia' ? 'bg-[#f0e2c2] shadow-sm' : 'opacity-60'}`}
              >
                <Coffee className="w-3.5 h-3.5 text-amber-800" />
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, theme: 'dark' }))}
                title="Dark Theme"
                className={`p-1 rounded ${settings.theme === 'dark' ? 'bg-stone-800 text-stone-200 shadow-sm' : 'opacity-60'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  fontFamily: s.fontFamily === 'serif' ? 'sans' : 'serif'
                }))
              }
              title="Toggle Serif / Sans Font"
              className="px-2 py-1 text-xs rounded border border-stone-300/40 font-mono hover:bg-black/5"
            >
              {settings.fontFamily === 'serif' ? 'Serif' : 'Sans'}
            </button>

            <button
              onClick={() => {
                const sizes: ReaderSettings['fontSize'][] = ['small', 'medium', 'large', 'xlarge'];
                const nextIndex = (sizes.indexOf(settings.fontSize) + 1) % sizes.length;
                setSettings((s) => ({ ...s, fontSize: sizes[nextIndex] }));
              }}
              title="Adjust Font Size"
              className="p-1.5 rounded border border-stone-300/40 hover:bg-black/5 flex items-center gap-0.5 text-xs font-bold"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase">{settings.fontSize[0]}</span>
            </button>

            <button
              onClick={handleShare}
              title="Share Link"
              className="p-1.5 rounded border border-stone-300/40 hover:bg-black/5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onToggleBookmark(article)}
              title={isBookmarked ? 'Remove Bookmark' : 'Save for Later'}
              className="p-1.5 rounded border border-stone-300/40 hover:bg-black/5"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              title="Close Reader (Esc)"
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Article Body Container */}
        <div className="px-5 sm:px-12 py-8 overflow-y-auto max-h-[82vh]">
          {/* Header Masthead & Date */}
          <div className="mb-6 pb-6 border-b border-stone-300/30">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-black/5">
                {article.sourceName}
              </span>
              <span className="text-xs opacity-60">
                {new Date(article.timestamp).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <h1
              className={`font-bold tracking-tight mb-3 ${
                settings.fontFamily === 'serif' ? 'font-editorial' : 'font-sans-ui'
              } text-2xl sm:text-3xl md:text-4xl leading-tight`}
            >
              {article.title}
            </h1>

            {article.author && (
              <p className="text-sm font-medium opacity-75">
                By <span className="font-semibold">{article.author}</span>
              </p>
            )}
          </div>

          {/* AI Executive Synthesis Box */}
          <div className="mb-8 rounded-xl border border-amber-300/60 bg-amber-500/10 p-4 transition-all">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowSummary(!showSummary)}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-700">
                  {summary?.isAI ? 'Gemini AI Editorial Synthesis' : 'Executive Key Takeaways'}
                </span>
              </div>
              <button className="text-stone-500 hover:text-stone-800">
                {showSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showSummary && (
              <div className="mt-3 pt-3 border-t border-amber-300/40 text-xs sm:text-sm space-y-3 font-sans-ui">
                {loadingSummary ? (
                  <div className="flex items-center gap-2 py-2 text-stone-500">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                    <span>Synthesizing editorial arguments and key takeaways...</span>
                  </div>
                ) : summary ? (
                  <>
                    <div>
                      <div className="font-semibold text-amber-800 text-[11px] uppercase tracking-wider mb-1">
                        Core Central Thesis
                      </div>
                      <p className="font-medium italic opacity-95">{summary.thesis}</p>
                    </div>

                    <div>
                      <div className="font-semibold text-amber-800 text-[11px] uppercase tracking-wider mb-1">
                        Key Arguments & Implications
                      </div>
                      <ul className="list-disc list-inside space-y-1 opacity-90">
                        {summary.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="leading-snug">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 font-semibold text-amber-800">
                        Stance: {summary.editorialStance}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/5 opacity-80">
                        Tone: {summary.tone}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-stone-500">Summary unavailable.</p>
                )}
              </div>
            )}
          </div>

          {/* Section Divider: Full Editorial Text */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-300/30">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Full Uncut Editorial Text ({paragraphsToRender.length} Paragraphs)</span>
            </span>
          </div>

          {/* Full Extracted Content / Paragraphs */}
          <div
            className={`space-y-6 ${getFontSizeClass()} ${
              settings.fontFamily === 'serif' ? 'font-editorial' : 'font-sans-ui'
            }`}
          >
            {loading ? (
              <div className="space-y-4 py-8">
                <div className="h-4 bg-stone-300/30 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-stone-300/30 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-stone-300/30 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-stone-300/30 rounded animate-pulse w-2/3"></div>
              </div>
            ) : (
              paragraphsToRender.map((paragraph, index) => (
                <p key={index} className="leading-relaxed opacity-95">
                  {paragraph}
                </p>
              ))
            )}
          </div>

          {/* Original Source Link Banner */}
          <div className="mt-10 pt-6 border-t border-stone-300/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs opacity-75 text-center sm:text-left">
              Published by <span className="font-semibold">{article.sourceName}</span>. Read the original on the
              publisher site.
            </div>

            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow"
            >
              <span>Visit {article.sourceName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
