import { GoogleGenAI } from '@google/genai';
import { AISummary } from '@/types';

function generateHeuristicSummary(title: string, textOrSnippet: string): AISummary {
  const sentences = textOrSnippet
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 25);

  const cleanTitle = title.replace(/\s+/g, ' ').trim();
  const firstSentence =
    sentences[0] || `${cleanTitle} presents an important institutional argument on current public developments.`;

  const takeaways = sentences.slice(0, 3);
  if (takeaways.length === 0) {
    takeaways.push(`The editorial delves into the key implications surrounding ${cleanTitle}.`);
    takeaways.push('Highlights systemic structural challenges and institutional priorities.');
    takeaways.push('Calls for stakeholders to balance long-term reform with democratic accountability.');
  } else if (takeaways.length < 3) {
    takeaways.push('Examines institutional checks, policy ramifications, and broader public impact.');
    takeaways.push('Emphasizes the necessity for coherent long-term strategic reforms.');
  }

  return {
    thesis: firstSentence.length > 180 ? firstSentence.slice(0, 180) + '...' : firstSentence,
    keyTakeaways: takeaways.slice(0, 3).map((s) => (s.endsWith('.') ? s : s + '.')),
    editorialStance: 'Evaluative & Policy-Focused Analysis',
    tone: 'Analytical & Objective',
    discussionQuestions: [
      `What are the most significant policy trade-offs involved in this issue?`,
      `How can institutional stakeholders effectively balance competing public interests?`
    ],
    isAI: false
  };
}

export async function summarizeEditorial(
  title: string,
  content: string,
  customApiKey?: string
): Promise<AISummary> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateHeuristicSummary(title, content);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a premier editorial analyst and senior editor for leading global newspapers (The Hindu, Indian Express, The Guardian, Project Syndicate, etc.).
Analyze the following editorial or opinion piece and extract a high-value structured synthesis.

Title: "${title}"
Content:
"""
${content.slice(0, 4000)}
"""

Respond ONLY with a valid JSON object matching this schema:
{
  "thesis": "A single concise, punchy sentence explaining the core thesis or central argument of the editorial.",
  "keyTakeaways": [
    "First crucial argument or evidence cited by the editorial",
    "Second key point or structural critique made",
    "Third actionable implication or forward-looking recommendation"
  ],
  "editorialStance": "A short phrase describing the institutional stance (e.g., 'Critical of government overreach', 'Advocating progressive fiscal expansion', 'Cautiously optimistic about technological integration')",
  "tone": "A 2-3 word description of the authorial tone (e.g., 'Urgent & Indicting', 'Pragmatic & Reforming', 'Philosophical & Reflective')",
  "discussionQuestions": [
    "One sharp question this editorial prompts for civic discussion",
    "A second insightful question examining counterarguments or secondary consequences"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      return generateHeuristicSummary(title, content);
    }

    const parsed = JSON.parse(responseText);
    return {
      thesis: parsed.thesis || `${title}: Key institutional argument.`,
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways.slice(0, 3) : [],
      editorialStance: parsed.editorialStance || 'Analytical Stance',
      tone: parsed.tone || 'Analytical',
      discussionQuestions: Array.isArray(parsed.discussionQuestions)
        ? parsed.discussionQuestions.slice(0, 2)
        : [],
      isAI: true
    };
  } catch (error) {
    console.error('Gemini summarization error (falling back to heuristic):', error);
    return generateHeuristicSummary(title, content);
  }
}
