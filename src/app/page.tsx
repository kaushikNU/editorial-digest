'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Navbar } from '@/components/Navbar';
import { SourceFilters } from '@/components/SourceFilters';
import { EditorialCard } from '@/components/EditorialCard';
import { ReaderModal } from '@/components/ReaderModal';
import { AISummaryModal } from '@/components/AISummaryModal';
import { SettingsModal } from '@/components/SettingsModal';
import {
  EditorialArticle,
  EditorialSource,
  Region,
  TopicFilter,
  DateFilter
} from '@/types';
import { Newspaper, Sparkles, BookOpen, Clock, AlertCircle, Cpu } from 'lucide-react';

export default function Home() {
  const [articles, setArticles] = useState<EditorialArticle[]>([]);
  const [sources, setSources] = useState<EditorialSource[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [techCount, setTechCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Reader & Modals
  const [activeReaderArticle, setActiveReaderArticle] = useState<EditorialArticle | null>(null);
  const [activeSummaryArticle, setActiveSummaryArticle] = useState<EditorialArticle | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User Local Storage Preferences
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [userApiKey, setUserApiKey] = useState('');

  const [isPending, startTransition] = useTransition();

  // Load local preferences on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('editorial_bookmarks');
      if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks));

      const savedRead = localStorage.getItem('editorial_read');
      if (savedRead) setReadIds(JSON.parse(savedRead));

      const savedKey = localStorage.getItem('editorial_gemini_key');
      if (savedKey) setUserApiKey(savedKey);
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }
  }, []);

  const saveBookmarks = (ids: string[]) => {
    setBookmarkedIds(ids);
    try {
      localStorage.setItem('editorial_bookmarks', JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
  };

  const saveReadIds = (ids: string[]) => {
    setReadIds(ids);
    try {
      localStorage.setItem('editorial_read', JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = (article: EditorialArticle) => {
    const isBookmarked = bookmarkedIds.includes(article.id);
    const updated = isBookmarked
      ? bookmarkedIds.filter((id) => id !== article.id)
      : [...bookmarkedIds, article.id];
    saveBookmarks(updated);
  };

  const handleMarkAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id]);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setUserApiKey(key);
    try {
      localStorage.setItem('editorial_gemini_key', key);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch editorials with date and topic filters
  const fetchEditorials = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (dateFilter !== 'all') params.set('date', dateFilter);
      if (selectedTopic !== 'All') params.set('topic', selectedTopic);

      const res = await fetch(`/api/editorials?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
        setSources(data.sources);
        setTodayCount(data.todayCount || 0);
        setTechCount(data.techCount || 0);
      } else {
        setError(data.error || 'Failed to load editorials');
      }
    } catch (err) {
      console.error(err);
      setError('Network connection error while fetching newspaper feeds.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditorials();
  }, [dateFilter, selectedTopic]);

  // Periodic refresh every 10 minutes to grab new morning editions
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEditorials();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dateFilter, selectedTopic]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (selectedRegion !== 'All' && article.region !== selectedRegion) {
        return false;
      }
      if (selectedSourceId !== 'all' && article.sourceId !== selectedSourceId) {
        return false;
      }
      if (showBookmarksOnly && !bookmarkedIds.includes(article.id)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesSnippet = article.contentSnippet.toLowerCase().includes(query);
        const matchesAuthor = article.author?.toLowerCase().includes(query);
        const matchesSource = article.sourceName.toLowerCase().includes(query);
        const matchesTopic = article.topic.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSnippet && !matchesAuthor && !matchesSource && !matchesTopic) {
          return false;
        }
      }
      return true;
    });
  }, [
    articles,
    selectedRegion,
    selectedSourceId,
    showBookmarksOnly,
    bookmarkedIds,
    searchQuery
  ]);

  const featuredArticle = useMemo(() => {
    if (filteredArticles.length === 0) return null;
    return filteredArticles[0];
  }, [filteredArticles]);

  const gridArticles = useMemo(() => {
    if (filteredArticles.length <= 1) return filteredArticles;
    return filteredArticles.slice(1);
  }, [filteredArticles]);

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 font-sans-ui flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Masthead & Navigation */}
      <Navbar
        currentRegion={selectedRegion}
        onSelectRegion={(r) => {
          setSelectedRegion(r);
          setSelectedSourceId('all');
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => startTransition(() => setSearchQuery(q))}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarks={() => setShowBookmarksOnly(!showBookmarksOnly)}
        bookmarkCount={bookmarkedIds.length}
        onRefresh={fetchEditorials}
        isRefreshing={loading}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalArticles={articles.length}
        todayCount={todayCount}
      />

      {/* Secondary Source, Topic (with Tech focus) & Date Filter Bar */}
      <SourceFilters
        sources={sources}
        selectedSourceId={selectedSourceId}
        onSelectSource={setSelectedSourceId}
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
        dateFilter={dateFilter}
        onSelectDateFilter={setDateFilter}
        activeRegion={selectedRegion}
        todayCount={todayCount}
        techCount={techCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchEditorials}
              className="px-3 py-1 rounded bg-red-800 text-white text-xs font-semibold hover:bg-red-900 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && articles.length === 0 ? (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl border border-stone-200 bg-white space-y-4 animate-pulse">
              <div className="w-24 h-5 bg-stone-200 rounded"></div>
              <div className="w-3/4 h-8 bg-stone-200 rounded"></div>
              <div className="w-1/2 h-4 bg-stone-100 rounded"></div>
              <div className="w-full h-16 bg-stone-100 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-5 rounded-xl border border-stone-200 bg-white space-y-3 animate-pulse">
                  <div className="w-20 h-4 bg-stone-200 rounded"></div>
                  <div className="w-full h-6 bg-stone-200 rounded"></div>
                  <div className="w-full h-12 bg-stone-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-stone-800">No editorials found</h3>
            <p className="text-xs text-stone-500 mt-1">
              {showBookmarksOnly
                ? "You haven't saved any editorials to your reading list yet."
                : 'Try adjusting your search query, topic filter, or publication selection.'}
            </p>
            {(selectedSourceId !== 'all' || selectedTopic !== 'All' || dateFilter !== 'all' || searchQuery || showBookmarksOnly) && (
              <button
                onClick={() => {
                  setSelectedRegion('All');
                  setSelectedSourceId('all');
                  setSelectedTopic('All');
                  setDateFilter('all');
                  setSearchQuery('');
                  setShowBookmarksOnly(false);
                }}
                className="mt-4 px-4 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Lead / Featured Editorial Banner */}
            {featuredArticle && !searchQuery && !showBookmarksOnly && selectedSourceId === 'all' && (
              <section className="relative overflow-hidden rounded-2xl border border-stone-300 bg-stone-900 text-white p-6 sm:p-8 md:p-10 shadow-lg">
                <div className="relative z-10 max-w-4xl space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-amber-400 text-stone-900 flex items-center gap-1">
                      {featuredArticle.isTech && <Cpu className="w-3.5 h-3.5" />}
                      {featuredArticle.isTech ? 'Featured Tech & AI' : 'Featured Editorial'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-semibold">
                      {featuredArticle.sourceName}
                    </span>
                    <span className="text-stone-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredArticle.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h2
                    onClick={() => setActiveReaderArticle(featuredArticle)}
                    className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight hover:text-amber-300 cursor-pointer transition-colors leading-tight"
                  >
                    {featuredArticle.title}
                  </h2>

                  {featuredArticle.author && (
                    <p className="text-xs sm:text-sm text-stone-400 font-medium">
                      By <span className="text-stone-200">{featuredArticle.author}</span>
                    </p>
                  )}

                  <p className="text-sm sm:text-base text-stone-300 font-sans-ui leading-relaxed max-w-3xl line-clamp-3">
                    {featuredArticle.contentSnippet}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveReaderArticle(featuredArticle)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors shadow"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Complete Article</span>
                    </button>

                    <button
                      onClick={() => setActiveSummaryArticle(featuredArticle)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Executive Key Takeaways</span>
                    </button>
                  </div>
                </div>

                <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none select-none text-9xl font-editorial font-bold">
                  {selectedTopic === 'Tech & AI' ? 'TECH' : 'NEWS'}
                </div>
              </section>
            )}

            {/* Grid Section Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl font-bold text-stone-900 flex items-center gap-2">
                  {selectedTopic === 'Tech & AI' && <Cpu className="w-5 h-5 text-amber-600" />}
                  <span>
                    {showBookmarksOnly
                      ? 'Saved Reading List'
                      : dateFilter === 'today'
                      ? `Today’s Fresh Editorials (${todayCount})`
                      : selectedTopic === 'Tech & AI'
                      ? `Technology, AI & Digital Policy (${techCount})`
                      : selectedTopic !== 'All'
                      ? `${selectedTopic} Columns`
                      : selectedRegion === 'India'
                      ? 'National Indian Editorials & Op-Eds'
                      : selectedRegion === 'Global'
                      ? 'International Editorial & Analysis Pages'
                      : 'Today’s Editorial Panorama'}
                  </span>
                </h3>
                <span className="text-xs text-stone-400 font-mono">({filteredArticles.length})</span>
              </div>
            </div>

            {/* Editorial Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(searchQuery || showBookmarksOnly || selectedSourceId !== 'all' || selectedTopic !== 'All' || dateFilter !== 'all'
                ? filteredArticles
                : gridArticles
              ).map((article) => (
                <EditorialCard
                  key={article.id}
                  article={article}
                  onRead={setActiveReaderArticle}
                  onSummarize={setActiveSummaryArticle}
                  isBookmarked={bookmarkedIds.includes(article.id)}
                  onToggleBookmark={handleToggleBookmark}
                  isRead={readIds.includes(article.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Reader Modal */}
      <ReaderModal
        article={activeReaderArticle}
        onClose={() => setActiveReaderArticle(null)}
        isBookmarked={activeReaderArticle ? bookmarkedIds.includes(activeReaderArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onMarkAsRead={handleMarkAsRead}
        userApiKey={userApiKey}
      />

      {/* AI Summary Modal */}
      <AISummaryModal
        article={activeSummaryArticle}
        onClose={() => setActiveSummaryArticle(null)}
        onOpenReader={(art) => {
          setActiveSummaryArticle(null);
          setActiveReaderArticle(art);
        }}
        userApiKey={userApiKey}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={userApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-16 text-center text-xs text-stone-500 font-sans-ui">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-editorial text-sm font-semibold text-stone-800">
            The Editorial Desk
          </p>
          <p>
            Curating complete institutional editorials, technology analysis & opinion essays from The Verge, TechCrunch, IEEE Spectrum, The Hindu, Indian Express, and The Guardian.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-stone-700 hover:text-stone-950 font-medium"
            >
              Configure AI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
