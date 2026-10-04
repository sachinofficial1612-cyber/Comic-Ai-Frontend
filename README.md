# ComicCraft — Frontend (AI Comic Story Creator)

Modern, interactive React frontend for **ComicCraft**, an AI-powered comic generator that transforms story prompts into multi-panel illustrated comics.

---

## 🎨 Features

- **Interactive Comic Canvas**: Multi-panel sequential layout view with responsive grid rendering.
- **Dynamic Speech Bubble Overlays**: Vector dialogue overlays supporting `speech`, `thought`, `shout`, and `whisper` bubbles.
- **Panel-by-Panel Comic Editor**: Edit dialogue, modify narrations, change camera angles, and regenerate artwork on the fly.
- **Character Bible Viewer**: Visual character sheet inspector ensuring visual continuity.
- **Export System**: 1-click export to PDF comic books and composite PNG pages.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Bangers Comic Typography
- **Icons**: Lucide React
- **Routing**: React Router 6

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/sachinofficial1612-cyber/Comic-Ai-Frontend.git
cd Comic-Ai-Frontend

# Install dependencies
npm install
```

### 3. Configure Environment

Create a `.env` file (or copy `.env.example`):

```bash
cp .env.example .env
```

Set the backend API URL:
```env
# For local development with proxy:
VITE_API_BASE_URL=

# Or point to deployed backend:
# VITE_API_BASE_URL=https://comic-ai-backend.onrender.com
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

---

## 🌐 Deploying to Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variable `VITE_API_BASE_URL` pointing to your deployed backend API.
