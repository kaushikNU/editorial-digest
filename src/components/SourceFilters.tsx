'use client';

import React from 'react';
import { EditorialSource, DateFilter, TopicFilter } from '@/types';
import { Calendar, Cpu } from 'lucide-react';

interface SourceFiltersProps {
  sources: EditorialSource[];
  selectedSourceId: string;
  onSelectSource: (id: string) => void;
  selectedTopic: TopicFilter;
  onSelectTopic: (topic: TopicFilter) => void;
  dateFilter: DateFilter;
  onSelectDateFilter: (filter: DateFilter) => void;
  activeRegion: string;
  todayCount: number;
  techCount: number;
}

export const SourceFilters: React.FC<SourceFiltersProps> = ({
  sources,
  selectedSourceId,
  onSelectSource,
  selectedTopic,
  onSelectTopic,
  dateFilter,
  onSelectDateFilter,
  activeRegion,
  todayCount,
  techCount
}) => {
  const filteredSources = sources.filter((s) => {
    if (activeRegion === 'India') return s.region === 'India';
    if (activeRegion === 'Global') return s.region === 'Global';
    return true;
  });

  const topics: { id: TopicFilter; label: string; icon?: boolean; count?: number }[] = [
    { id: 'All', label: 'All Topics' },
    { id: 'Tech & AI', label: `⚡ Tech & AI (${techCount})`, icon: true },
    { id: 'Economy & Finance', label: 'Economy & Finance' },
    { id: 'Politics & Governance', label: 'Politics & Policy' },
    { id: 'Global Affairs', label: 'Global Statecraft' },
    { id: 'Climate & Ecology', label: 'Climate & Ecology' },
    { id: 'Society & Ideas', label: 'Society & Culture' }
  ];

  const dateOptions: { id: DateFilter; label: string }[] = [
    { id: 'all', label: 'All Dates' },
    { id: 'today', label: `Today (${todayCount})` },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Past 7 Days' }
  ];

  return (
    <div className="bg-white border-b border-stone-200 sticky top-[108px] z-20 backdrop-blur-sm bg-white/95">
      {/* Upper sub-bar: Topic Focus (with Tech highlighted) & Date Freshness */}
      <div className="border-b border-stone-100 py-2 px-4 bg-stone-50/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mr-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-stone-700" />
              <span>Topic:</span>
            </span>

            {topics.map((t) => {
              const isSelected = selectedTopic === t.id;
              const isTechOption = t.id === 'Tech & AI';

              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? isTechOption
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm font-bold'
                        : 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : isTechOption
                      ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 font-bold'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-1.5 self-end md:self-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1 mr-1">
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>Date:</span>
            </span>

            {dateOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelectDateFilter(opt.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  dateFilter === opt.id
                    ? 'bg-stone-900 text-white font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lower sub-bar: Newspaper & Tech Publication Pills */}
      <div className="py-2 px-4 max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectSource('all')}
          className={`px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap transition-colors ${
            selectedSourceId === 'all'
              ? 'bg-stone-800 text-white font-medium'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All Publications
        </button>

        {filteredSources.map((source) => (
          <button
            key={source.id}
            onClick={() => onSelectSource(source.id)}
            className={`px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap transition-all border flex items-center gap-1 ${
              selectedSourceId === source.id
                ? 'border-stone-800 bg-stone-800 text-white font-medium'
                : source.isTechFocus
                ? 'border-amber-300 bg-amber-50/60 text-amber-950 hover:bg-amber-100'
                : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {source.isTechFocus && <span className="text-amber-600 text-[10px]">⚡</span>}
            <span>{source.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
