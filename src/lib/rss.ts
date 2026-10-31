import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { EditorialArticle, EditorialSource, TopicFilter } from '@/types';
import { EDITORIAL_SOURCES } from './sources';

interface CacheEntry {
  data: EditorialArticle[];
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const feedCache: Map<string, CacheEntry> = new Map();

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
      ['author', 'author'],
      ['category', 'category']
    ]
  },
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    Accept: 'application/rss+xml, application/xml, text/xml, */*'
  },
  timeout: 8000
});

function sanitizeSnippet(rawHtmlOrText: string): string {
  if (!rawHtmlOrText) return '';
  const $ = cheerio.load(rawHtmlOrText);
  $('script, style, noscript, iframe, figure').remove();
  let text = $.text().replace(/\s+/g, ' ').trim();
  text = text.replace(/^Published:\s+/i, '');
  text = text.replace(/Read more\.\.\.$/i, '');
  return text;
}

function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 180));
}

function cleanTitle(title: string): string {
  if (!title) return 'Untitled Editorial';
  return title
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function checkIfToday(date: Date, now: Date): boolean {
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours >= 0 && diffHours <= 24) return true;
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function classifyTopic(title: string, text: string, source: EditorialSource): { topic: TopicFilter; isTech: boolean } {
  const combined = (title + ' ' + text).toLowerCase();

  const techKeywords = [
    'ai', 'artificial intelligence', 'machine learning', 'llm', 'chatgpt', 'openai', 'anthropic',
    'semiconductor', 'chip', 'cyber', 'cybersecurity', 'malware', 'hack', 'quantum', 'algorithm',
    'software', 'hardware', 'computing', 'crypto', 'bitcoin', 'blockchain', 'deepfake',
    'surveillance', 'data center', 'nvidia', 'intel', 'robot', 'robotics', 'automation',
    'social media', 'big tech', 'tech policy', 'digital public infrastructure'
  ];

  const hasTechKeyword = techKeywords.some((kw) => {
    // Check boundary or word presence
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(combined);
  });

  if (source.isTechFocus || hasTechKeyword) {
    return { topic: 'Tech & AI', isTech: true };
  }

  const economyKeywords = [
    'economy', 'inflation', 'gdp', 'rbi', 'central bank', 'federal reserve', 'fiscal', 'deficit',
    'interest rate', 'tariff', 'trade', 'stock', 'banking', 'recession', 'debt', 'tax'
  ];
  if (economyKeywords.some((kw) => combined.includes(kw))) {
    return { topic: 'Economy & Finance', isTech: false };
  }

  const climateKeywords = [
    'climate', 'global warming', 'cop29', 'carbon', 'emission', 'solar', 'renewable', 'pollution',
    'environment', 'ecology', 'biodiversity', 'flood', 'drought'
  ];
  if (climateKeywords.some((kw) => combined.includes(kw))) {
    return { topic: 'Climate & Ecology', isTech: false };
  }

  const globalKeywords = [
    'geopolitics', 'diplomacy', 'war', 'russia', 'ukraine', 'israel', 'gaza', 'china',
    'taiwan', 'nato', 'unsc', 'foreign policy', 'treaty', 'bilateral'
  ];
  if (globalKeywords.some((kw) => combined.includes(kw))) {
    return { topic: 'Global Affairs', isTech: false };
  }

  const politicsKeywords = [
    'election', 'court', 'supreme court', 'judiciary', 'parliament', 'constitution', 'governance',
    'democracy', 'legislation', 'bill', 'rights'
  ];
  if (politicsKeywords.some((kw) => combined.includes(kw))) {
    return { topic: 'Politics & Governance', isTech: false };
  }

  return { topic: 'Society & Ideas', isTech: false };
}

export async function fetchFeedForSource(source: EditorialSource): Promise<EditorialArticle[]> {
  const now = Date.now();
  const nowDate = new Date(now);
  const cached = feedCache.get(source.id);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const feed = await parser.parseURL(source.feedUrl);
    const articles: EditorialArticle[] = (feed.items || [])
      .filter((item) => {
        const link = (item.link || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        if (
          link.includes('/picture/') ||
          link.includes('/gallery/') ||
          link.includes('/audio/') ||
          link.includes('/video/')
        ) {
          return false;
        }
        if (title.startsWith('cartoon:') || title.includes('| cartoon') || title.includes('podcast')) {
          return false;
        }
        return true;
      })
      .map((item, index) => {
        const rawContent =
          (item as unknown as { contentEncoded?: string }).contentEncoded ||
          item.content ||
          item.summary ||
          item['content:encoded'] ||
          item.contentSnippet ||
          '';
        const snippet = sanitizeSnippet(rawContent || item.contentSnippet || '');
        const pubDateStr = item.pubDate || item.isoDate || new Date().toISOString();
        const parsedDate = new Date(pubDateStr);
        const timestamp = isNaN(parsedDate.getTime()) ? now - index * 60000 : parsedDate.getTime();
        const articleDate = new Date(timestamp);
        const isToday = checkIfToday(articleDate, nowDate);

        const author =
          (item as unknown as { creator?: string }).creator ||
          item.author ||
          (item as unknown as { 'dc:creator'?: string })['dc:creator'] ||
          undefined;

        const title = cleanTitle(item.title || 'Untitled');
        const readingTime = calculateReadingTime(
          snippet.length > 500 ? snippet : snippet + ' ' + title
        );

        const { topic, isTech } = classifyTopic(title, snippet, source);

        return {
          id: `${source.id}-${index}-${encodeURIComponent(
            item.link || item.guid || item.title || index.toString()
          )}`,
          title,
          link: item.link || source.homepage,
          pubDate: pubDateStr,
          timestamp,
          author: author ? author.replace(/^By\s+/i, '').trim() : undefined,
          contentSnippet: snippet.length > 320 ? snippet.slice(0, 320) + '...' : snippet,
          fullContent: rawContent && rawContent.length > 500 ? rawContent : undefined,
          sourceId: source.id,
          sourceName: source.name,
          region: source.region,
          category: source.category,
          readingTimeMinutes: readingTime,
          guid: item.guid || item.link,
          isToday,
          topic,
          isTech
        };
      });

    feedCache.set(source.id, { data: articles, timestamp: now });
    return articles;
  } catch (error) {
    console.error(`Error fetching feed for ${source.name} (${source.feedUrl}):`, error);
    if (cached) return cached.data;
    return [];
  }
}

export async function fetchAllEditorials(): Promise<EditorialArticle[]> {
  const results = await Promise.allSettled(
    EDITORIAL_SOURCES.map((source) => fetchFeedForSource(source))
  );

  const allArticles: EditorialArticle[] = [];
  for (const res of results) {
    if (res.status === 'fulfilled') {
      allArticles.push(...res.value);
    }
  }

  allArticles.sort((a, b) => b.timestamp - a.timestamp);

  const seen = new Set<string>();
  const uniqueArticles: EditorialArticle[] = [];
  for (const article of allArticles) {
    const key = article.link || article.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueArticles.push(article);
    }
  }

  return uniqueArticles;
}
