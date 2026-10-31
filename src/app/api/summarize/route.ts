import { NextRequest, NextResponse } from 'next/server';
import { summarizeEditorial } from '@/lib/summarizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, apiKey } = body;

    if (!title && !content) {
      return NextResponse.json(
        { error: 'Article title or content is required' },
        { status: 400 }
      );
    }

    const summary = await summarizeEditorial(title || '', content || '', apiKey);
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('Error in /api/summarize:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
