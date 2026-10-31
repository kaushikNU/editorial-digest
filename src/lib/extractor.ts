import * as cheerio from 'cheerio';

export interface ExtractedArticle {
  title: string;
  byline?: string;
  leadImage?: string;
  paragraphs: string[];
  wordCount: number;
  readingTimeMinutes: number;
  excerpt: string;
  isComplete: boolean;
}

export async function extractArticleContent(
  url: string,
  fallbackHtmlOrText?: string
): Promise<ExtractedArticle> {
  let html = '';
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(9000)
    });

    if (response.ok) {
      html = await response.text();
    }
  } catch (err) {
    console.warn(`Direct fetch failed for ${url}:`, err);
  }

  const $ = cheerio.load(html || '<div></div>');

  let title =
    $('meta[property="og:title"]').attr('content') ||
    $('h1').first().text().trim() ||
    $('title').text().trim();
  title = title.split(' | ')[0].split(' - ')[0].trim();

  let byline =
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    $('.author, [rel="author"], .byline, .writer-name, .editor-name').first().text().trim();
  if (byline) byline = byline.replace(/^By\s+/i, '').trim();

  const leadImage =
    $('meta[property="og:image"]').attr('content') ||
    $('article img, main img, .lead-image img').first().attr('src') ||
    undefined;

  let fullParagraphs: string[] = [];

  // STRATEGY 1: Extract complete articleBody from JSON-LD Schema (The Hindu, Indian Express, The Guardian)
  if (html) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const raw = $(el).html();
        if (!raw) return;
        const data = JSON.parse(raw);

        let bodyText = '';
        if (typeof data.articleBody === 'string' && data.articleBody.length > 250) {
          bodyText = data.articleBody;
        } else if (Array.isArray(data['@graph'])) {
          for (const node of data['@graph']) {
            if (typeof node.articleBody === 'string' && node.articleBody.length > 250) {
              bodyText = node.articleBody;
              break;
            }
          }
        }

        if (bodyText) {
          const parts = bodyText
            .split(/\n{2,}|\r\n\r\n|\n/)
            .map((p) => p.replace(/\s+/g, ' ').trim())
            .filter((p) => p.length > 30 && !p.toLowerCase().includes('click here to join'));

          if (parts.length > fullParagraphs.length) {
            fullParagraphs = parts;
          }
        }
      } catch {
        // Ignore JSON parse errors for non-standard script blocks
      }
    });
  }

  // STRATEGY 2: Targeted DOM Selectors
  if (fullParagraphs.length < 2 && html) {
    $(
      'script, style, noscript, nav, header, footer, aside, form, svg, iframe, .advertisement, .ad, .social-share, .comments, .related-articles, .newsletter-signup, .cookie-banner, .banner, .paywall-bar, .subscription-block'
    ).remove();

    const targetedSelectors = [
      '.articlebodycontent p', // The Hindu
      '#pcl-full-content p', // The Indian Express
      '.story-details p', // Indian Express & Mint
      'div[itemprop="articleBody"] p',
      '.article-body-commercial-selector p', // The Guardian
      '.article__body p', // Project Syndicate
      '.mainArea p', // Livemint
      '.storyPage_storyContent p',
      '.storyDetails p', // Hindustan Times
      '.article-body p',
      'article p',
      'main p'
    ];

    for (const selector of targetedSelectors) {
      const candidates: string[] = [];
      $(selector).each((_, el) => {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        const lower = text.toLowerCase();
        if (
          text.length > 30 &&
          !lower.includes('all rights reserved') &&
          !lower.includes('terms of service') &&
          !lower.includes('privacy policy') &&
          !lower.includes('sign up for our') &&
          !lower.includes('click here to') &&
          !lower.includes('also read |') &&
          !lower.includes('join our whatsapp') &&
          !lower.includes('published - ') &&
          !lower.includes('download the app')
        ) {
          candidates.push(text);
        }
      });

      if (candidates.length >= 2) {
        fullParagraphs = candidates;
        break;
      }
    }
  }

  // STRATEGY 3: Fallback to RSS fullContent / contentEncoded (The Atlantic, The Conversation, etc.)
  if (fullParagraphs.length < 2 && fallbackHtmlOrText) {
    const $fb = cheerio.load(fallbackHtmlOrText);
    const fbParas: string[] = [];
    $fb('p').each((_, el) => {
      const t = $fb(el).text().replace(/\s+/g, ' ').trim();
      if (t.length > 30) fbParas.push(t);
    });

    if (fbParas.length >= 1) {
      fullParagraphs = fbParas;
    } else {
      // Split plain text by double newlines or sentences
      const plainParts = fallbackHtmlOrText
        .replace(/<[^>]+>/g, ' ')
        .split(/\n{2,}|\.\s+(?=[A-Z])/)
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter((p) => p.length > 40);
      if (plainParts.length > 0) {
        fullParagraphs = plainParts;
      }
    }
  }

  const fullText = fullParagraphs.join(' ');
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const excerpt =
    fullParagraphs.slice(0, 2).join(' ').slice(0, 320) + (fullParagraphs.length > 0 ? '...' : '');

  return {
    title: title || 'Editorial Article',
    byline: byline || undefined,
    leadImage,
    paragraphs: fullParagraphs,
    wordCount,
    readingTimeMinutes,
    excerpt,
    isComplete: fullParagraphs.length > 0
  };
}
