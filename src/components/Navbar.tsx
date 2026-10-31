'use client';

import React from 'react';
import { Newspaper, Bookmark, RefreshCw, Settings, Sparkles, Search } from 'lucide-react';
import { Region } from '@/types';

interface NavbarProps {
  currentRegion: Region;
  onSelectRegion: (r: Region) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showBookmarksOnly: boolean;
  onToggleBookmarks: () => void;
  bookmarkCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  totalArticles: number;
  todayCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRegion,
  onSelectRegion,
  searchQuery,
  onSearchChange,
  showBookmarksOnly,
  onToggleBookmarks,
  bookmarkCount,
  onRefresh,
  isRefreshing,
  onOpenSettings,
  totalArticles,
  todayCount
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      {/* Top Masthead Accent */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-bold tracking-wider uppercase text-[10px] text-amber-400">
              The Daily Editorial Digest
            </span>
            <span className="hidden sm:inline text-stone-500">•</span>
            <span className="hidden sm:inline text-stone-300">
              Complete, un-truncated institutional editorials & premium columns from the world’s premier presses
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-400 text-[11px]">
            <span className="text-amber-300 font-semibold">{todayCount} Fresh Today</span>
            <span>•</span>
            <span>{totalArticles} articles indexed</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center shadow-sm">
              <Newspaper className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 leading-none">
                The Editorial Desk
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-sans-ui">
                Full-length editorials, guest essays & thought-leader commentary
              </p>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[180px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search editorials, topics, authors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-stone-100/80 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:bg-white transition-all text-stone-800 placeholder-stone-400"
              />
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={onToggleBookmarks}
              title="Saved Articles"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showBookmarksOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span className="hidden sm:inline">Saved</span>
              {bookmarkCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-stone-900 text-white font-bold">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Feeds"
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-stone-900' : ''}`} />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Reader & AI Settings"
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Region Filter Navigation */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(['All', 'India', 'Global'] as Region[]).map((r) => (
              <button
                key={r}
                onClick={() => onSelectRegion(r)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  currentRegion === r
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {r === 'All' ? 'All Publications' : r === 'India' ? '🇮🇳 Indian Press' : '🌍 Global Press'}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 hidden sm:flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>AI Editorial Synthesis & Distraction-Free Reader</span>
          </div>
        </div>
      </div>
    </header>
  );
};
