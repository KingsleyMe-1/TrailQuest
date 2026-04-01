# TrailQuest

A full-stack hiking trail discovery and activity tracking web application. TrailQuest lets hikers explore trails, log activities, track personal progress, join community groups, and complete challenges — all in one place.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Authentication](#authentication)
- [Theme System](#theme-system)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)

---

## Features

- **Trail Discovery** — Browse 9+ curated hiking trails with filtering by difficulty, trail type, and sorting by rating, distance, elevation, or duration
- **Trail Detail Modals** — In-page modals with tabbed detail views (Overview, Stats, Highlights), an elevation profile chart, trail tags, best season, and pace info
- **Activity Tracking** — Live hike timer with distance, elevation, pace, and speed metrics; floating persistent activity widget across pages; OpenStreetMap integration
- **Personal Dashboard** — Animated stat counters (trails, miles, elevation, badges), recent trails, weekly goals, badge collection, and upcoming adventure CTA
- **Challenges** — Gamified hiking challenges with Bronze/Silver/Gold tier progression, dual leaderboards (community + friends), seasonal spotlights, and challenge type variety
- **Community Hub** — Community groups with join/leave, group detail modals, upcoming hike events with RSVP and spots tracking, activity feed with likes and threaded comments
- **Authentication** — Email/password sign up and login via Supabase, session persistence, protected routes, profile avatar upload
- **Light/Dark Mode** — System-preference aware, persisted to `localStorage`, flash-free on page load
- **Fully Responsive** — Mobile-first design with a slide-in drawer nav, bottom-sheet modals on mobile, and adaptive grid layouts
- **Server-Side Rendering** — React Router v7 SSR for fast initial loads and SEO

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Router v7 (SSR) | 7.12.0 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS v4 | 4.1.13 |
| Build Tool | Vite | 7.1.7 |
| Auth / Storage | Supabase JS | ^2.99.2 |
| Icons | lucide-react | ^0.577.0 |
| Language | TypeScript | ^5.9.2 |
| Runtime | Node.js | 20 (Alpine) |
| Deployment (cloud) | Vercel (`@vercel/react-router`) | ^1.2.6 |
| Server (self-hosted) | `@react-router/serve` | 7.12.0 |

---

## Project Structure

```
app/
├── root.tsx                  # App shell, providers, font imports, flash-free theme script
├── routes.ts                 # Route definitions
├── app.css                   # Tailwind v4 config, OKLCH color tokens, custom shadows & fonts
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx         # Sign up / login modal (Supabase)
│   │   └── ProtectedRoute.tsx    # Render-prop auth guard
│   ├── challenges/
│   │   ├── ChallengeCard.tsx     # Challenge grid card with progress bar and tier badges
│   │   ├── ChallengeDetailModal.tsx  # Full challenge modal with tabs and leaderboard
│   │   ├── ChallengesHero.tsx    # Animated stats hero banner
│   │   └── SeasonalSpotlight.tsx # Featured seasonal challenge banner
│   ├── community/
│   │   ├── GroupDetailModal.tsx  # Group detail with hero, stats, tabs
│   │   └── ActivityCommentModal.tsx  # Threaded comments for activity feed
│   ├── dashboard/
│   │   ├── BadgesCard.tsx        # Earned badges grid
│   │   ├── DashboardHero.tsx     # Personalized hero with SVG mountain
│   │   ├── NextAdventureCTA.tsx  # CTA card linking to trails
│   │   ├── RecentTrails.tsx      # Recent activity list
│   │   ├── StatsGrid.tsx         # Animated counter stat cards
│   │   └── WeeklyGoals.tsx       # Weekly progress tracker
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky nav, mobile drawer, auth-aware links
│   │   └── Footer.tsx            # Site footer
│   ├── trails/
│   │   └── TrailDetailModal.tsx  # Full trail detail modal with elevation chart
│   └── user/
│       └── ProfileMenu.tsx       # Avatar upload, theme toggle, sign out dropdown
├── constants/
│   ├── trails.ts             # allTrails[] and recentTrails[] data
│   ├── trail-detail.ts       # Trail & TrailDetail types, TRAIL_DETAILS record, difficulty config
│   ├── trails-page.ts        # Trail card hero images map
│   ├── challenges.ts         # CHALLENGES[], challenge types, tier config, leaderboard data
│   ├── dashboard.ts          # Dashboard stats, badges, recent trails, weekly goals
│   ├── community.ts          # COMMUNITY_GROUPS[], events, activity feed
│   ├── navigation.ts         # Guest and authenticated nav link arrays
│   ├── home.ts               # Featured trails for landing page
│   └── about.ts              # Features, tech stack, FAQ, timeline data
├── hooks/
│   └── useTheme.ts           # Light/dark mode hook (localStorage + system preference)
├── lib/
│   └── supabase.ts           # Lazy Supabase client proxy
└── routes/
    ├── home.tsx              # Landing page with hero and featured trails
    ├── trails.tsx            # Trail browser with search, filters, sort
    ├── dashboard.tsx         # Protected personal dashboard
    ├── challenges.tsx        # Protected challenges page
    ├── community.tsx         # Community hub (groups, events, feed)
    └── about.tsx             # About page with FAQ and tech stack
```

---

## Pages & Routes

### `/` — Home
Public landing page. Displays a hero with a search bar and a grid of featured trails. If a user is already logged in, they are automatically redirected to `/dashboard`. Unauthenticated visitors can sign up via the hero CTA, which opens the `AuthModal`.

### `/trails` — Explore Trails
Public trail browser. Full filtering and sorting controls:
- **Difficulty**: All / Easy / Moderate / Hard
- **Trail Type**: All / Loop / Out & Back / Point to Point
- **Sort**: Rating / Distance / Elevation / Duration
- **Live search** by trail name or location

Clicking a trail card opens `TrailDetailModal` in-page with three tabs:
- **Overview**: description, key stats, tags, best season, pace, rating
- **Stats**: detailed metrics and difficulty score bar
- **Highlights**: waypoint list and SVG elevation profile chart

From the modal, authenticated users can start a hike (navigates to `/log-activity`) or save/share the trail.

### `/dashboard` — Personal Dashboard *(protected)*
Authenticated users' home base. Includes:
- **Hero banner**: personalized greeting, trail count and elevation summary
- **StatsGrid**: 4 animated counter cards (trails completed, miles hiked, elevation gained, badges earned)
- **RecentTrails**: the last few hikes
- **WeeklyGoals**: weekly target progress bar
- **BadgesCard**: earned achievement badges (Summit Seeker, Streak badges, etc.)
- **NextAdventureCTA**: link back to trail browsing

### `/challenges` — Challenges *(protected)*
Gamified challenge tracking. Features:
- **Filter tabs**: All / Active / Available / Completed / Seasonal (with live counts)
- **SeasonalSpotlight**: highlighted banner for the current seasonal challenge
- **ChallengeCard grid**: each card shows type icon, title, difficulty, XP reward, progress bar with Bronze/Silver/Gold tier markers, and Start/Abandon buttons
- **ChallengeDetailModal**: full modal with Overview, Progress, and Leaderboard tabs
  - Recommended trail cards open `TrailDetailModal` in-page
  - Dual leaderboard: Community vs Friends toggle
  - Tier milestone tracker (progress rings)

**Challenge types**: `streak` · `distance` · `elevation` · `collection` · `difficulty` · `seasonal` · `speed`

### `/community` — Community Hub
Public page for community discovery. Auth required only for join/RSVP actions.
- **Community Groups**: 6 groups with join/leave, category tags, member count, and `GroupDetailModal` for full info (founded date, total hikes, top trails, upcoming tabs)
- **Upcoming Events**: event cards with date, location, difficulty, RSVP button, and animated spots bar that changes colour when spots are limited
- **Activity Feed**: recent community posts with:
  - Photo gallery with lightbox and arrow navigation
  - Like button (toggle, persisted in state)
  - Comment button → `ActivityCommentModal` with threaded replies (persisted to `localStorage`)

### `/about` — About
Static informational page. Covers the project's motivation, a features grid, tech stack breakdown, a versioned changelog/roadmap, and an accordion FAQ section.

---

## Authentication

TrailQuest uses **Supabase** for all authentication.

### Sign Up / Login
- `AuthModal` handles both modes via a tab toggle
- Sign up: email + password (min 6 chars) + confirm password → `supabase.auth.signUp()`
- If email confirmation is required, a "check your email" message is shown
- Login: `supabase.auth.signInWithPassword()`
- On success, the `onAuthSuccess(user)` callback fires and the user is redirected to `/dashboard`

### Protected Routes
`ProtectedRoute` (render-prop pattern) guards `/dashboard`, `/challenges`, and `/log-activity`:
```tsx
<ProtectedRoute>
  {(user) => <PageContent user={user} />}
</ProtectedRoute>
```
On mount it calls `supabase.auth.getSession()`. No session → `navigate("/", { replace: true })`. It also subscribes to `onAuthStateChange` to handle mid-session sign-outs.

### Profile & Avatar
`ProfileMenu` (authenticated navbar dropdown):
- Displays initials avatar or uploaded photo
- File picker for avatar upload: validates JPEG/PNG/WebP/GIF, max 2 MB → uploaded to Supabase Storage at `avatars/{user.id}.{ext}` → user metadata updated
- Theme toggle (light/dark)
- Sign out → `supabase.auth.signOut()` → redirect to home

### Dev Bypass
Set `VITE_DISABLE_AUTH_GUARD=true` to skip `ProtectedRoute` checks during development.

---

## Theme System

- **Hook**: `useTheme.ts` manages `"light" | "dark"` state
- **Persistence**: stored in `localStorage` under key `trailquest-theme`
- **System default**: falls back to `window.matchMedia("(prefers-color-scheme: dark)")` if no stored preference
- **Application**: `.dark` class toggled on `<html>` via `document.documentElement.classList`
- **Flash prevention**: an inline `<script>` in `<head>` (inside `root.tsx`) runs synchronously before first paint to apply the correct class without a flash

### Color System
Tailwind CSS v4 with `@custom-variant dark (&:is(.dark *))`. All colors use the **OKLCH** color space:
- Primary (purple-blue): `oklch(0.6056 0.2189 292.7172)`
- Dark background: `oklch(0.2077 0.0398 265.7549)`
- Full semantic token set: `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--ring`, `--destructive`, `--chart-1..5`

### Typography
| Variable | Font |
|---|---|
| `--font-sans` | Roboto |
| `--font-serif` | Playfair Display |
| `--font-mono` | Fira Code |

---

## Data Models

### Trail
```ts
type Trail = {
  name: string;
  location: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  distance: string;      // "5.2 mi"
  rating: number;        // 0–5
  completedAt: string;
  duration: string;      // "2h 45m"
  elevation: string;     // "820 ft"
  type: string;          // "Loop" | "Out & Back" | "Point to Point"
  description: string;
};
```

### TrailDetail
```ts
type TrailDetail = {
  tags: string[];
  highlights: string[];     // "Waypoint name – X.X mi"
  bestSeason: string;
  pace: string;
  difficultyScore: number;  // 0–100
  elevationPoints: number[]; // for SVG elevation profile
};
```

### Challenge
```ts
type Challenge = {
  id: number;
  title: string;
  type: "streak" | "distance" | "elevation" | "collection" | "difficulty" | "seasonal" | "speed";
  status: "active" | "available" | "completed" | "locked";
  difficulty: "Easy" | "Moderate" | "Hard";
  current: number;
  goal: number;
  unit: string;
  tiers: { bronze: number; silver: number; gold: number };
  xp: number;
  seasonal: boolean;
  recommendedTrails: string[];
  highlights: string[];
  startedAt: string;
  endsAt: string;
};
```

### Community Group
```ts
type CommunityGroup = {
  id: number;
  name: string;
  tagline: string;
  members: number;
  category: string;
  level: string;
  icon: LucideIcon;
  color: string;
  image: string;
  description: string;
  founded: string;
  totalHikes: number;
  avgDistance: string;
  location: string;
  topTrails: string[];
};
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: bypass auth guards during development
VITE_DISABLE_AUTH_GUARD=true
```

The Supabase client uses a lazy proxy — it only initialises on first use, so SSR builds won't fail if env vars are absent at build time. Missing vars produce a clear error message at runtime.

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:5173` with Hot Module Replacement.

### Type Checking

```bash
npm run typecheck
```

Runs `react-router typegen` (generates route type helpers) followed by `tsc`.

---

## Building for Production

```bash
npm run build
```

Output:
```
build/
├── client/    # Static assets (JS, CSS, images)
└── server/    # SSR server bundle
```

Start the production server:

```bash
npm start
# Serves via react-router-serve on port 3000
```

---

## Deployment

### Vercel (recommended)

Zero-config deployment. The project already includes the Vercel preset in `react-router.config.ts`:

```ts
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  ssr: true,
  presets: [vercelPreset()],
};
```

Push to a Git repository and connect it to Vercel. Set the environment variables in the Vercel project settings.

### Docker

A multi-stage `Dockerfile` is included for containerised deployments:

```bash
docker build -t trailquest .
docker run -p 3000:3000 trailquest
```

The image uses Node 20 Alpine and a 4-stage build (dev deps → prod deps → build → final). Compatible with any Docker-capable platform:

- AWS ECS / App Runner
- Google Cloud Run
- Azure Container Apps
- Fly.io
- Railway
- DigitalOcean App Platform

### Self-Hosted Node

```bash
npm run build
npm start
```

Serves the SSR application using `@react-router/serve` on port 3000.

---

## Available Trails

| Trail | Location | Difficulty | Distance |
|---|---|---|---|
| Pine Ridge Loop | Blue Ridge, VA | Moderate | 5.2 mi |
| Summit Crest Trail | Rocky Mountain, CO | Hard | 8.9 mi |
| Meadow Walk | Smoky Mountains, TN | Easy | 2.4 mi |
| Canyon Falls Path | Zion NP, UT | Easy | 3.1 mi |
| Ridgeline Traverse | Cascade Range, WA | Hard | 11.2 mi |
| Lakeside Stroll | Lake Tahoe, CA | Easy | 4.0 mi |
| Granite Dome Circuit | Yosemite, CA | Moderate | 7.5 mi |
| Highland Moor Path | Olympic NP, WA | Moderate | 6.4 mi |
| Deadwood Ravine | Appalachian Trail, NC | Hard | 14.2 mi |

---

Built with React Router · Supabase · Tailwind CSS · TypeScript
