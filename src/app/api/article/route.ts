import { NextRequest, NextResponse } from 'next/server';
import { extractArticleContent } from '@/lib/extractor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const fallback = searchParams.get('fallback') || undefined;

    if (!url) {
      return NextResponse.json({ error: 'Missing article URL parameter' }, { status: 400 });
    }

    const data = await extractArticleContent(url, fallback);
    return NextResponse.json({ success: true, article: data });
  } catch (error) {
    console.error('Error extracting article content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract article content'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, fallback } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing article URL parameter' }, { status: 400 });
    }

    const data = await extractArticleContent(url, fallback);
    return NextResponse.json({ success: true, article: data });
  } catch (error) {
    console.error('Error extracting article content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract article content'
      },
      { status: 500 }
    );
  }
}
