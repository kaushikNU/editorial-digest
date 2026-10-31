import { NextRequest, NextResponse } from 'next/server';
import { fetchAllEditorials } from '@/lib/rss';
import { EDITORIAL_SOURCES } from '@/lib/sources';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const sourceId = searchParams.get('source');
    const category = searchParams.get('category');
    const topic = searchParams.get('topic'); // 'All' | 'Tech & AI' | etc.
    const dateFilter = searchParams.get('date'); // 'all' | 'today' | 'yesterday' | 'week'
    const search = searchParams.get('search')?.toLowerCase().trim();

    let articles = await fetchAllEditorials();

    if (dateFilter === 'today') {
      articles = articles.filter((a) => a.isToday);
    } else if (dateFilter === 'yesterday') {
      const now = Date.now();
      articles = articles.filter((a) => {
        const diffHours = (now - a.timestamp) / (1000 * 60 * 60);
        return diffHours > 24 && diffHours <= 48;
      });
    } else if (dateFilter === 'week') {
      const now = Date.now();
      articles = articles.filter((a) => {
        const diffHours = (now - a.timestamp) / (1000 * 60 * 60);
        return diffHours <= 168; // 7 days
      });
    }

    if (region && region !== 'All') {
      articles = articles.filter((a) => a.region.toLowerCase() === region.toLowerCase());
    }

    if (sourceId && sourceId !== 'all') {
      articles = articles.filter((a) => a.sourceId === sourceId);
    }

    if (category && category !== 'All') {
      articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    // Topic filter (e.g. 'Tech & AI')
    if (topic && topic !== 'All') {
      if (topic === 'Tech & AI') {
        articles = articles.filter((a) => a.isTech || a.topic === 'Tech & AI');
      } else {
        articles = articles.filter((a) => a.topic.toLowerCase() === topic.toLowerCase());
      }
    }

    if (search) {
      articles = articles.filter((a) =>
        a.title.toLowerCase().includes(search) ||
        a.contentSnippet.toLowerCase().includes(search) ||
        (a.author && a.author.toLowerCase().includes(search)) ||
        a.sourceName.toLowerCase().includes(search) ||
        a.topic.toLowerCase().includes(search)
      );
    }

    const allArticles = await fetchAllEditorials();
    const todayCount = allArticles.filter((a) => a.isToday).length;
    const techCount = allArticles.filter((a) => a.isTech).length;

    return NextResponse.json({
      success: true,
      count: articles.length,
      todayCount,
      techCount,
      articles,
      sources: EDITORIAL_SOURCES
    });
  } catch (error) {
    console.error('Error in /api/editorials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch editorial feeds' },
      { status: 500 }
    );
  }
}
