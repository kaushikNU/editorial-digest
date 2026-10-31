export type Region = 'All' | 'India' | 'Global';
export type EditorialCategory = 'All' | 'Editorial' | 'Opinion' | 'Column' | 'Lead' | 'Analysis';
export type DateFilter = 'all' | 'today' | 'yesterday' | 'week';
export type TopicFilter =
  | 'All'
  | 'Tech & AI'
  | 'Economy & Finance'
  | 'Politics & Governance'
  | 'Global Affairs'
  | 'Climate & Ecology'
  | 'Society & Ideas';

export interface EditorialSource {
  id: string;
  name: string;
  region: 'India' | 'Global';
  category: 'Editorial' | 'Opinion' | 'Column' | 'Lead' | 'Analysis';
  feedUrl: string;
  homepage: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  isTechFocus?: boolean;
}

export interface EditorialArticle {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  timestamp: number;
  author?: string;
  contentSnippet: string;
  fullContent?: string;
  sourceId: string;
  sourceName: string;
  region: 'India' | 'Global';
  category: string;
  readingTimeMinutes: number;
  tags?: string[];
  guid?: string;
  isToday: boolean;
  topic: TopicFilter;
  isTech: boolean;
}

export interface AISummary {
  thesis: string;
  keyTakeaways: string[];
  editorialStance: string;
  tone: string;
  discussionQuestions: string[];
  isAI: boolean;
}

export interface ReaderSettings {
  theme: 'paper' | 'dark' | 'sepia';
  fontFamily: 'serif' | 'sans';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  lineHeight: 'normal' | 'relaxed' | 'loose';
}
