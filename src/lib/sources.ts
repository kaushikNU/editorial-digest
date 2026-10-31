import { EditorialSource } from '@/types';

export const EDITORIAL_SOURCES: EditorialSource[] = [
  // --- Dedicated Technology & AI Thought Leadership Desks ---
  {
    id: 'the-verge-tech',
    name: 'The Verge (Tech & Policy)',
    region: 'Global',
    category: 'Analysis',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
    homepage: 'https://www.theverge.com/',
    color: '#e11d48',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239',
    description: 'In-depth reporting and commentary on artificial intelligence, Big Tech policy, and hardware.',
    isTechFocus: true
  },
  {
    id: 'the-guardian-tech',
    name: 'The Guardian (Technology)',
    region: 'Global',
    category: 'Analysis',
    feedUrl: 'https://www.theguardian.com/technology/rss',
    homepage: 'https://www.theguardian.com/technology',
    color: '#059669',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    description: 'Critical perspectives on digital rights, algorithmic governance, cybersecurity, and Big Tech power.',
    isTechFocus: true
  },
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch (AI & Startups)',
    region: 'Global',
    category: 'Analysis',
    feedUrl: 'https://techcrunch.com/feed/',
    homepage: 'https://techcrunch.com/',
    color: '#16a34a',
    badgeBg: '#dcfce7',
    badgeText: '#15803d',
    description: 'Frontier AI models, venture economics, semiconductor breakthroughs, and tech innovation.',
    isTechFocus: true
  },
  {
    id: 'ieee-spectrum',
    name: 'IEEE Spectrum (Computing)',
    region: 'Global',
    category: 'Analysis',
    feedUrl: 'https://spectrum.ieee.org/feeds/feed.rss',
    homepage: 'https://spectrum.ieee.org/',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    description: 'Authoritative engineering, semiconductor architecture, quantum computing, and AI systems analysis.',
    isTechFocus: true
  },

  // --- Indian Premier Editorial & Op-Ed Desks ---
  {
    id: 'the-hindu-editorial',
    name: 'The Hindu (Editorials)',
    region: 'India',
    category: 'Editorial',
    feedUrl: 'https://www.thehindu.com/opinion/editorial/feeder/default.rss',
    homepage: 'https://www.thehindu.com/opinion/editorial/',
    color: '#0f3a60',
    badgeBg: '#e8f0fe',
    badgeText: '#185abc',
    description: "Official institutional editorials from India's national newspaper of record."
  },
  {
    id: 'the-hindu-lead',
    name: 'The Hindu (Lead Essays)',
    region: 'India',
    category: 'Lead',
    feedUrl: 'https://www.thehindu.com/opinion/op-ed/feeder/default.rss',
    homepage: 'https://www.thehindu.com/opinion/op-ed/',
    color: '#0f3a60',
    badgeBg: '#e8f0fe',
    badgeText: '#185abc',
    description: 'In-depth analytical essays on law, statecraft, AI transformation, and society.'
  },
  {
    id: 'the-hindu-columns',
    name: 'The Hindu (Columns)',
    region: 'India',
    category: 'Column',
    feedUrl: 'https://www.thehindu.com/opinion/columns/feeder/default.rss',
    homepage: 'https://www.thehindu.com/opinion/columns/',
    color: '#0f3a60',
    badgeBg: '#e8f0fe',
    badgeText: '#185abc',
    description: 'Regular opinion columns by diplomats, jurists, and policy thinkers.'
  },
  {
    id: 'indian-express-editorial',
    name: 'The Indian Express (Editorials)',
    region: 'India',
    category: 'Editorial',
    feedUrl: 'https://indianexpress.com/section/opinion/editorials/feed/',
    homepage: 'https://indianexpress.com/section/opinion/editorials/',
    color: '#b91c1c',
    badgeBg: '#fee2e2',
    badgeText: '#991b1b',
    description: 'Institutional stances on governance, civil liberties, and technological impact.'
  },
  {
    id: 'indian-express-columns',
    name: 'Indian Express (The Ideas Page)',
    region: 'India',
    category: 'Column',
    feedUrl: 'https://indianexpress.com/section/opinion/columns/feed/',
    homepage: 'https://indianexpress.com/section/opinion/columns/',
    color: '#b91c1c',
    badgeBg: '#fee2e2',
    badgeText: '#991b1b',
    description: 'Commentaries by Pratap Bhanu Mehta, C. Raja Mohan, and leading economic minds.'
  },
  {
    id: 'indian-express-explained',
    name: 'Indian Express (Explained)',
    region: 'India',
    category: 'Analysis',
    feedUrl: 'https://indianexpress.com/section/explained/feed/',
    homepage: 'https://indianexpress.com/section/explained/',
    color: '#991b1b',
    badgeBg: '#fef2f2',
    badgeText: '#7f1d1d',
    description: 'Analytical deep-dives unpacking current technologies, cyber laws, and state policies.'
  },
  {
    id: 'livemint-opinion',
    name: 'Mint (Macro & Policy)',
    region: 'India',
    category: 'Opinion',
    feedUrl: 'https://www.livemint.com/rss/opinion',
    homepage: 'https://www.livemint.com/opinion',
    color: '#c2410c',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    description: 'Macroeconomics, tech regulation, corporate shifts, and public policy commentaries.'
  },

  // --- Global / International Editorial & Op-Ed Pages ---
  {
    id: 'the-guardian-editorial',
    name: 'The Guardian View',
    region: 'Global',
    category: 'Editorial',
    feedUrl: 'https://www.theguardian.com/profile/editorial/rss',
    homepage: 'https://www.theguardian.com/profile/editorial',
    color: '#047857',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    description: "The Guardian's institutional editorial board perspectives on global affairs."
  },
  {
    id: 'the-guardian-opinion',
    name: 'The Guardian (Comment is Free)',
    region: 'Global',
    category: 'Opinion',
    feedUrl: 'https://www.theguardian.com/commentisfree/rss',
    homepage: 'https://www.theguardian.com/commentisfree',
    color: '#047857',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    description: 'Diverse perspectives on international politics, tech platforms, climate, and culture.'
  },
  {
    id: 'project-syndicate',
    name: 'Project Syndicate',
    region: 'Global',
    category: 'Opinion',
    feedUrl: 'https://www.project-syndicate.org/rss',
    homepage: 'https://www.project-syndicate.org/',
    color: '#4338ca',
    badgeBg: '#e0e7ff',
    badgeText: '#3730a3',
    description: "The world's opinion page: Nobel laureates, AI researchers, and global scholars."
  },
  {
    id: 'the-conversation-global',
    name: 'The Conversation',
    region: 'Global',
    category: 'Analysis',
    feedUrl: 'https://theconversation.com/global/articles.atom',
    homepage: 'https://theconversation.com/global',
    color: '#be123c',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239',
    description: 'Academic analysis and expert commentary on computing, science, and world politics.'
  },
  {
    id: 'the-atlantic-ideas',
    name: 'The Atlantic (Ideas)',
    region: 'Global',
    category: 'Opinion',
    feedUrl: 'https://www.theatlantic.com/feed/channel/ideas/',
    homepage: 'https://www.theatlantic.com/ideas/',
    color: '#b45309',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    description: 'Long-form philosophical essays on technology, society, and the future.'
  }
];
