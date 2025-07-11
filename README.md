# 💜 Girls' Growth Diary · 女生成长日记

A gentle, powerful web app to track your growth, dreams, and emotions.  
This is your **personal space** for self-reflection, health monitoring, mood logging, and writing letters to your future self — beautifully crafted with 💖.

---

## ✨ Features

- 📅 Growth Calendar with body fat, weight, mood, and notes
- 🌠 Visual Wish List with countdowns and categories
- 💌 Write letters and emotional capsules to your future self
- 📊 Trend Charts & Mood Heatmaps
- 🔐 Login & data privacy, designed just for you

---

## 🧭 App Structure

<pre>
/
├── 🏠 Home (Dashboard) ※ [Coming Soon]
│   ├── Today Overview: Body Fat, Mood, Period, Wish Reminders
│   └── Quick Actions: Add Log / New Wish / View Charts
│
├── 📅 Growth Calendar → /log.tsx + /date/[date].tsx
│   ├── Daily Logs: Body Fat, Weight, Mood, Notes
│   ├── Visual Tags: Emoji Mood + Period Markers (future support)
│   └── View Details: Click heatmap to explore a specific day
│
├── 🌠 Wish List → /wishes.tsx
│   ├── All Wishes (Completed / In Progress)
│   ├── Countdown & Tag Filters (Growth / Travel / Health / etc.)
│   └── Add New Wish (Supports image + text)
│
├── 💌 Future Letters & Emotional Capsules ※ [Coming Soon]
│   ├── 📬 /future-letter.tsx
│   │   ├── Write to Future Self (Encouragement / Comfort)
│   │   ├── Text or Voice [Coming Soon]
│   │   └── Precise Unlock Time (Not viewable before set time)
│   └── 🎙️ /future-capsule.tsx
│       ├── Record Current Mood & Thoughts (Release to the future)
│       └── Choose Text or Voice, with Unlock Timer
│
├── 📊 Data Visualization → /charts.tsx, /mood-heatmap.tsx
│   ├── Body Fat & Weight Trend Charts
│   ├── Mood Heatmap (with Hover & Tooltip)
│   └── Period Cycle Chart + Prediction (Planned)
│
├── 🔐 Authentication
│   ├── /login.tsx
│   └── /register.tsx
│
└── ⚙️ Settings ※ [Coming Soon]
    ├── Profile: Nickname / Avatar / Privacy Lock
    ├── Export Logs / Download Charts
    └── Feedback & About the Project
</pre>

---

## ⚙️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/), React, TypeScript
- **Backend:** Firebase Firestore
- **Auth:** Firebase Authentication
- **Charts & UI:** Recharts, React Calendar Heatmap, Tailwind CSS, Shadcn UI
- **Fonts:** Quicksand (primary), Dancing Script (logo/headings)

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/girls-growth-diary.git
cd girls-growth-diary
npm install
npm run dev
