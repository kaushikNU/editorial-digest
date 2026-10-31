# The Editorial Desk 🗞️

A reader website that aggregates complete institutional editorials, analytical deep-dives, and opinion columns from leading national (*The Hindu*, *The Indian Express*, *Livemint*) and international publications (*The Guardian*, *Project Syndicate*, *The Conversation*, *The Atlantic*), with a dedicated first-class focus on **Technology, Artificial Intelligence, and Digital Policy** (*The Verge*, *TechCrunch*, *IEEE Spectrum*, *The Guardian Technology*).

---

## 🌟 Features

- **⚡ First-Class Focus on Tech & AI (Along with All Major Topics)**:
  - **165+ Tech & AI Editorials**: In-depth coverage of generative AI breakthroughs, semiconductor statecraft, big tech antitrust, cybersecurity, and algorithmic governance.
  - **Dedicated Tech Publications**: Real-time ingestion from **The Verge (Tech & Policy)**, **TechCrunch (AI & Startups)**, **IEEE Spectrum (Computing & Hardware)**, and **The Guardian (Technology)**.
  - **One-Click `⚡ Tech & AI` Topic Filter**: Quickly isolate technology editorials or browse across **Economy & Finance**, **Politics & Policy**, **Global Statecraft**, **Climate & Ecology**, and **Society & Culture**.
- **Full, Uncut Editorial Extraction**:
  - Delivers complete, multi-paragraph essays and institutional editorials.
  - Multi-tier extraction engine parsing JSON-LD Schema metadata (`articleBody`) and high-density semantic DOM trees.
  - Automatic filtering to exclude visual cartoons, galleries, or audio snippets so every item is a full readable text essay.
- **Top Curated Editorial Desks & Columns**:
  - **The Hindu**: Institutional Editorials, Front-Page Lead Essays, and Regular Columns.
  - **The Indian Express**: Official Editorials, *The Ideas Page* (Pratap Bhanu Mehta, C. Raja Mohan, P. Chidambaram), and *The Explained Page* (in-depth policy and legal breakdowns).
  - **Livemint**: Macroeconomics, corporate governance, RBI, and public policy commentaries.
  - **The Guardian**: *The Guardian View* (Editorial Board) and *Comment is Free*.
  - **Project Syndicate**: World columns and global essays by Nobel laureates, central bank governors, and diplomats.
  - **The Conversation**: Academic analysis and policy breakdowns.
  - **The Atlantic**: Long-form cultural and socio-political essays.
- **Distraction-Free Focus Reader Mode**:
  - Three reading palettes: **Paper** (clean off-white), **Warm Sepia** (classic book finish), and **Midnight Dark**.
  - Font switcher: **Editorial Serif** (Georgia/Cambria) vs. **Modern Clean Sans**.
  - Font scaling (`A-`, `A`, `A+`, `A++`) and word count estimators.
  - One-click **"Copy Full Text"** button to copy complete essays into your notebook.
- **Executive AI Synthesis**:
  - **Central Thesis**: One punchy sentence summarizing the core argument.
  - **Key Arguments & Takeaways**: 3 bulleted structural insights.
  - **Editorial Stance & Tone**: Identifies whether the perspective is critical, progressive, cautionary, or reformist.
  - **Questions for Discussion**: Thought-provoking questions examining counterarguments.
  - Powered by **Google Gemini 2.5 Flash** with an automatic heuristic fallback that works out-of-the-box.
- **Date Freshness & Live Ingestion**:
  - Background polling every 10 minutes to grab new morning editions.
  - Filter by `Today's Fresh`, `Yesterday`, `Past 7 Days`, and `All Dates`.
  - LocalStorage bookmarking and automatic read status tracking.

---

## 🚀 Quick Start

### 1. Run the Development Server
```bash
cd editorial-digest
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
