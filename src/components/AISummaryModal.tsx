'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { EditorialArticle, AISummary } from '@/types';

interface AISummaryModalProps {
  article: EditorialArticle | null;
  onClose: () => void;
  onOpenReader: (article: EditorialArticle) => void;
  userApiKey?: string;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({
  article,
  onClose,
  onOpenReader,
  userApiKey
}) => {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!article) return;

    setLoading(true);
    setSummary(null);

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
      .catch((err) => console.error('Error fetching AI summary:', err))
      .finally(() => setLoading(false));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article, onClose, userApiKey]);

  if (!article) return null;

  const handleCopySummary = () => {
    if (!summary) return;
    const text = `Editorial: ${article.title} (${article.sourceName})
Core Thesis: ${summary.thesis}

Key Arguments & Takeaways:
${summary.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Stance: ${summary.editorialStance} | Tone: ${summary.tone}
Link: ${article.link}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-3 sm:p-4 items-center">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col font-sans-ui">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-400 text-stone-900">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {summary?.isAI ? 'Gemini AI Editorial Synthesis' : 'Executive Editorial Analysis'}
              </h3>
              <p className="text-[11px] text-stone-400">{article.sourceName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopySummary}
              disabled={!summary}
              title="Copy Summary"
              className="p-1.5 rounded text-stone-300 hover:text-white hover:bg-stone-800 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-stone-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Editorial Title
            </span>
            <h2 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
              {article.title}
            </h2>
            {article.author && (
              <p className="text-xs text-stone-500 mt-1">By {article.author}</p>
            )}
          </div>

          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-stone-500 gap-3">
              <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm font-medium">Synthesizing core thesis & arguments...</p>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              {/* Thesis Card */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Core Central Thesis
                </span>
                <p className="text-sm font-medium text-stone-900 leading-snug">
                  {summary.thesis}
                </p>
              </div>

              {/* Key Arguments */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Key Arguments & Evidence
                </span>
                <ul className="space-y-2">
                  {summary.keyTakeaways.map((takeaway, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/60"
                    >
                      <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stance & Tone */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Institutional Stance
                  </span>
                  <p className="text-xs font-semibold text-stone-800 mt-0.5">
                    {summary.editorialStance}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Authorial Tone
                  </span>
                  <p className="text-xs font-semibold text-stone-800 mt-0.5">
                    {summary.tone}
                  </p>
                </div>
              </div>

              {/* Discussion Questions */}
              {summary.discussionQuestions.length > 0 && (
                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/70">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Questions for Discussion</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                    {summary.discussionQuestions.map((q, idx) => (
                      <li key={idx} className="leading-normal">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-stone-500">Could not generate summary.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
          >
            <span>Original Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => {
              onClose();
              onOpenReader(article);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open in Reader Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
