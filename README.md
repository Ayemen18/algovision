# AlgoVision

AI-powered interactive algorithm learning platform — built for coding interview mastery through visualization.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Framework  | Next.js 15 (App Router) + TypeScript    |
| Styling    | Tailwind CSS + CSS Variables            |
| Animation  | Framer Motion                           |
| State      | Zustand                                 |
| Auth       | Clerk                                   |
| Database   | MongoDB Atlas                           |
| AI         | OpenAI GPT-4o                           |
| Deployment | Vercel (frontend) + Render (API)        |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout (fonts, metadata, providers)
│   ├── page.tsx      # Home page
│   └── globals.css   # Design system CSS variables + base styles
│
├── components/
│   ├── ui/           # Reusable primitives (Button, Badge, etc.)
│   ├── layout/       # Navbar, Footer, Sidebar (Phase 2)
│   └── providers/    # Context providers (Phase 2)
│
├── lib/
│   ├── fonts.ts      # Next/font configuration
│   ├── utils.ts      # cn() + shared utilities
│   └── constants.ts  # App-wide constants & config
│
├── store/            # Zustand state slices
└── types/            # TypeScript type definitions
```

## Build Phases

| Phase | Feature                        | Status      |
|-------|--------------------------------|-------------|
| 1     | Project setup & architecture   | ✅ Complete |
| 2     | Landing page & auth (Clerk)    | 🔜 Next     |
| 3     | Problem browser (LeetCode API) | ⏳ Planned  |
| 4     | Code editor + AI explanations  | ⏳ Planned  |
| 5     | Algorithm visualizer           | ⏳ Planned  |
| 6     | AI error analysis              | ⏳ Planned  |
| 7     | Revision system & dashboard    | ⏳ Planned  |

## Scripts

```bash
npm run dev      # Development server with hot reload
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
npm run format   # Prettier format
```

## Design System

The design system lives in `src/app/globals.css` as CSS custom properties:

- **Colors**: `var(--brand-primary)`, `var(--neon-green)`, `var(--surface-raised)`, etc.
- **Fonts**: Cabinet Grotesk (display) + DM Mono (code)
- **Utilities**: `.text-gradient`, `.glass`, `.glow-brand`, `.bg-dots`, `.bg-grid`

All Tailwind config extends these tokens via `tailwind.config.ts`.