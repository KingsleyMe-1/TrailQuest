# TrailQuest: React Router v7 → Next.js App Router Migration

**Branch:** `feat/nextjs-migration`
**Description:** Migrate TrailQuest from React Router v7 (SSR mode, unused) to Next.js 15 App Router to unlock real Vercel/Supabase SSR integration, proper server-side auth, and meaningful SEO metadata — with zero UI/UX changes.

---

## Goal

Replace the React Router v7 framework shell (which currently acts as a glorified SPA bundler) with Next.js 15 App Router. This enables server-side auth guards via Next.js Middleware + `@supabase/ssr`, real `<head>` metadata for every page (SEO), and first-class Vercel deployment — all without changing any component UI or user-facing behavior.

---

## What Changes vs. What Stays the Same

### Stays exactly the same
- All UI components (`app/components/**`) — visual output is identical
- All constants (`app/constants/**`) — static trail/challenge/event data unchanged
- All CSS (`app/app.css`) — Tailwind 4, oklch tokens, `.dark` class-based dark mode unchanged
- `ActivityContext` and `ActivityWidget` — global activity tracker unchanged
- `useTheme` hook — localStorage + `prefers-color-scheme` logic unchanged
- Supabase browser-side operations (avatar upload, sign in/out, `getSession`)
- Auth flow (AuthModal, sign-up, login, email confirmation)
- All routes and their URLs (`/`, `/dashboard`, `/trails`, `/community`, `/about`, `/challenges`, `/events`, `/log-activity`)

### Changes (framework-level only)
| React Router v7 | Next.js equivalent |
|---|---|
| `import { Link } from "react-router"` | `import Link from "next/link"` |
| `import { useNavigate } from "react-router"` | `import { useRouter } from "next/navigation"` |
| `import { useSearchParams } from "react-router"` | `import { useSearchParams } from "next/navigation"` |
| `navigate("/path")` | `router.push("/path")` |
| `navigate("/path", { replace: true })` | `router.replace("/path")` |
| `navigate(-1)` | `router.back()` |
| `meta()` route export | `export const metadata` or `generateMetadata()` |
| `app/routes/*.tsx` | `app/(routes)/*/page.tsx` |
| `app/root.tsx` | `app/layout.tsx` |
| `ProtectedRoute` component (client-side auth check) | Next.js Middleware (server-side auth guard) |
| `@supabase/supabase-js` browser-only client | `@supabase/ssr` (browser + server clients) |
| `react-router.config.ts` + `vite.config.ts` | `next.config.ts` |
| `@vercel/react-router` Vercel preset | Native Next.js on Vercel (no adapter needed) |

---

## Migration Steps

---

### Step 1: Bootstrap Next.js & Swap Dependencies

**Files:**
- `package.json`
- `next.config.ts` _(new)_
- `tsconfig.json`
- `react-router.config.ts` _(deleted)_
- `vite.config.ts` _(deleted)_
- `app/routes.ts` _(deleted)_

**What:**
Uninstall all React Router and Vite packages. Install Next.js 15, `@supabase/ssr`, and `next-themes`. Update `package.json` scripts. Create `next.config.ts` with Tailwind 4, path alias `~/` → `./app/`, and Vercel deployment config. Update `tsconfig.json` for Next.js (`moduleResolution: "bundler"`, `jsx: "preserve"`, `paths` alias).

**Dependency changes:**
```
REMOVE:
  react-router, @react-router/node, @react-router/serve, @react-router/dev
  @vercel/react-router, vite, vite-tsconfig-paths, @tailwindcss/vite

ADD:
  next@^15                   # framework
  @supabase/ssr@^0.6         # server-side Supabase client
  next-themes@^0.4           # SSR-safe dark mode (replaces useTheme flash risk)

KEEP:
  react@^19, react-dom@^19
  @supabase/supabase-js@^2
  lucide-react, tailwindcss@^4, typescript@^5
  @types/react, @types/react-dom, @types/node
```

**`next.config.ts` key options:**
```ts
const nextConfig = {
  // Enables React 19 features
  experimental: { reactCompiler: false },
  // Vercel deploys Next.js natively - no adapter needed
}
```

**`tsconfig.json` path alias:**
```json
"paths": { "~/*": ["./app/*"] }
```

**Testing:** `npm install` completes without errors; `next --version` prints 15.x.

---

### Step 2: Root Layout, CSS, Fonts & Global Providers

**Files:**
- `app/layout.tsx` _(new — replaces root.tsx)_
- `app/app.css` _(no change — just re-imported)_
- `app/root.tsx` _(deleted)_

**What:**
Create `app/layout.tsx` as the Next.js root layout. Migrate everything from `root.tsx`:
- `<html lang="en" suppressHydrationWarning>` — kept exactly as-is
- Google Fonts `<link>` tags — moved to `<head>` in layout (or migrated to `next/font/google` for self-hosting optimization)
- Theme flash prevention inline `<script>` — kept in `<head>` exactly as-is (reads `trailquest-theme` from localStorage before first paint)
- `ActivityProvider` wrapper — kept in layout body
- `ActivityWidget` — kept in layout body

The root layout becomes a **Server Component** that renders an `"use client"` `<Providers>` wrapper for `ActivityProvider` (since it uses context/state). `ActivityWidget` stays within the provider.

**Layout structure:**
```
app/layout.tsx (Server Component)
  └─ <html><head> fonts, theme script, metadata </head>
     <body>
       <Providers>           ← "use client" wrapper (ActivityProvider)
         {children}
         <ActivityWidget />
       </Providers>
     </body></html>
```

**Root SEO metadata (replaces the manual `<Meta />` approach):**
```ts
export const metadata: Metadata = {
  title: { default: "TrailQuest", template: "%s | TrailQuest" },
  description: "Discover hiking trails, track your progress, and connect with fellow hikers.",
  metadataBase: new URL("https://trailquest.vercel.app"), // update to real domain
  openGraph: { type: "website", siteName: "TrailQuest" },
}
```

**Testing:** `npm run dev` starts; visiting `/` loads the app with correct fonts and dark mode flash prevention.

---

### Step 3: Supabase SSR Utilities & Auth Middleware

**Files:**
- `app/lib/supabase.ts` _(updated — browser client rewritten with createBrowserClient)_
- `app/lib/supabase-server.ts` _(new — server-side client)_
- `middleware.ts` _(new — at project root)_
- `app/components/auth/ProtectedRoute.tsx` _(updated — gutted, now just renders children)_

**What:**

**`app/lib/supabase.ts`** — Update to use `createBrowserClient` from `@supabase/ssr`. Same lazy-init pattern, same `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars (rename to `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`):
```ts
import { createBrowserClient } from "@supabase/ssr";
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**`app/lib/supabase-server.ts`** — Server-only client using `createServerClient` with Next.js cookies:
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export async function createSupabaseServerClient() { ... }
```

**`middleware.ts`** — Replaces `ProtectedRoute` with a proper server-side auth guard. Runs on every request matching the protected paths. Uses `@supabase/ssr` to read the session from cookie headers and refresh the token. Redirects unauthenticated users to `/` for protected routes:
```
Protected routes: /dashboard, /challenges, /log-activity
Public routes: /, /trails, /community, /about, /events
```

**`ProtectedRoute.tsx`** — Becomes a passthrough that only shows a loading spinner during the brief client-side session check (kept for graceful UX fallback, but the hard auth guard is now in middleware):
```tsx
// Simplified: middleware already blocks unauthenticated access.
// This component now just passes the user down via render prop,
// fetching from the browser session on mount.
```

**.env rename:** Rename `.env` keys from `VITE_*` to `NEXT_PUBLIC_*`. Update every reference in `app/lib/supabase.ts`.

**Testing:**
- Visit `/dashboard` without being logged in → redirected to `/`
- Visit `/dashboard` while logged in → page loads normally
- Sign out from ProfileMenu → redirected to `/`, middleware blocks re-entry to `/dashboard`

---

### Step 4: Migrate Shared Components (Framework Import Swap)

**Files touched:** All files that import from `"react-router"`:
- `app/components/layout/Navbar.tsx`
- `app/components/user/ProfileMenu.tsx`
- `app/components/auth/ProtectedRoute.tsx`
- `app/components/auth/AuthModal.tsx`
- `app/components/activity/ActivityWidget.tsx`
- Any other component files referencing `react-router`

**What:**
Do a project-wide find-and-replace of framework imports. Each change is mechanical:

| Old | New | Notes |
|---|---|---|
| `import { Link } from "react-router"` | `import Link from "next/link"` | Drop-in |
| `import { useNavigate } from "react-router"` | `import { useRouter } from "next/navigation"` | |
| `const navigate = useNavigate()` | `const router = useRouter()` | |
| `navigate("/path")` | `router.push("/path")` | |
| `navigate("/path", { replace: true })` | `router.replace("/path")` | |
| `navigate(-1)` | `router.back()` | log-activity.tsx only |
| `import { useSearchParams } from "react-router"` | `import { useSearchParams } from "next/navigation"` | |

Add `"use client"` directive to every component that uses hooks (`useState`, `useEffect`, `useRouter`, `useSearchParams`, `useContext`, etc.). Components that are already fully client-side will add `"use client"` at the top.

**Note on `ProfileMenu.tsx` sign-out:**
```ts
// Before
await supabase.auth.signOut();
navigate("/", { replace: true });

// After
await supabase.auth.signOut();
router.replace("/");
```

**Testing:**
- Navbar links navigate correctly
- Sign Out in ProfileMenu redirects to `/`
- Avatar upload still works (Supabase storage calls unchanged)
- Dark/light theme toggle still works

---

### Step 5: Migrate All Route Pages to Next.js Page Files

**Files created (new directory structure):**
```
app/
  page.tsx                         ← was routes/home.tsx
  dashboard/
    page.tsx                       ← was routes/dashboard.tsx
  trails/
    page.tsx                       ← was routes/trails.tsx
  community/
    page.tsx                       ← was routes/community.tsx
  about/
    page.tsx                       ← was routes/about.tsx
  challenges/
    page.tsx                       ← was routes/challenges.tsx
  events/
    page.tsx                       ← was routes/events.tsx
  log-activity/
    page.tsx                       ← was routes/log-activity.tsx
```

**Old files deleted:** `app/routes/` directory (all 8 files).

**Per-page changes:**

| Route | Changes | Notes |
|---|---|---|
| `home` (/) | `"use client"` · `meta()` → `export const metadata` · `useNavigate` → `useRouter` | Auth check + navigate in useEffect stays |
| `dashboard` | `"use client"` · `meta()` → `export const metadata` · ProtectedRoute render-prop kept or replaced with server user fetch | No direct Supabase calls; middleware guards it |
| `trails` | `"use client"` · `meta()` → `export const metadata` · `useSearchParams` from next/navigation · wrap in `<Suspense>` | See Suspense note below |
| `community` | `"use client"` · `meta()` → `export const metadata` · Fix `localStorage` in `useState` initializer → move to `useEffect` | localStorage must not run on server |
| `about` | `"use client"` (thin) · `meta()` → `export const metadata` | Mostly static; could be Server Component with client Navbar shell |
| `challenges` | `"use client"` · `meta()` → `export const metadata` · ProtectedRoute kept (middleware already guards) | All data is static constants |
| `events` | `"use client"` · `meta()` → `export const metadata` | Animation timing, registration state |
| `log-activity` | `"use client"` · `meta()` → `export const metadata` · `useSearchParams` → next/navigation · `navigate(-1)` → `router.back()` · wrap in `<Suspense>` | Protected by middleware |

**Suspense requirement for `useSearchParams`:**
Next.js requires components calling `useSearchParams()` to be wrapped in `<Suspense>` to avoid build errors. Pattern:
```tsx
// app/trails/page.tsx
export default function TrailsPage() {
  return (
    <Suspense fallback={<TrailsLoadingSkeleton />}>
      <TrailsContent />
    </Suspense>
  );
}

function TrailsContent() {
  const searchParams = useSearchParams(); // safe here
  // ... rest of the component
}
```
Same pattern applied to `log-activity/page.tsx`.

**`community.tsx` localStorage fix:**
```ts
// Before (crashes on server):
const [extraComments, setExtraComments] = useState<...>(() => {
  return JSON.parse(localStorage.getItem("tq_activity_comments") ?? "null") ?? {};
});

// After (safe):
const [extraComments, setExtraComments] = useState<...>({});
useEffect(() => {
  try {
    const stored = localStorage.getItem("tq_activity_comments");
    if (stored) setExtraComments(JSON.parse(stored));
  } catch { /* ignore */ }
}, []);
```

**`meta()` → `metadata` pattern:**
```ts
// Before (React Router)
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trails | TrailQuest" },
    { name: "description", content: "..." },
  ];
}

// After (Next.js)
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Trails",        // template in root layout appends "| TrailQuest"
  description: "...",
};
```

**Testing:**
- All 8 routes load correctly in `npm run dev`
- `/dashboard`, `/challenges`, `/log-activity` redirect to `/` when not authenticated
- Trail search via `?q=` param works on `/trails`
- Activity timer log (navigate to `/log-activity?trail=...&location=...`) works
- Dark mode toggle persists across navigations
- Auth modal opens and closes correctly on all pages

---

### Step 6: SEO Metadata Layer

**Files:**
- `app/layout.tsx` _(updated — root metadata + viewport)_
- `app/page.tsx`
- `app/dashboard/page.tsx`
- `app/trails/page.tsx`
- `app/community/page.tsx`
- `app/about/page.tsx`
- `app/challenges/page.tsx`
- `app/events/page.tsx`
- `app/log-activity/page.tsx`
- `public/robots.txt` _(new)_
- `app/sitemap.ts` _(new)_

**What:**

**Root layout metadata** — Shared defaults for all pages:
```ts
export const metadata: Metadata = {
  title: { default: "TrailQuest", template: "%s | TrailQuest" },
  description: "Discover hiking trails, track your progress, and connect with fellow hikers.",
  metadataBase: new URL("https://trailquest.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "TrailQuest",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
}
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}
```

**Per-page metadata** (all pages receive unique title + description):

| Page | `title` | `description` |
|---|---|---|
| `/` | `"TrailQuest – Discover Your Next Adventure"` | Hero copy |
| `/dashboard` | `"Dashboard"` | "Your personal hiking overview…" |
| `/trails` | `"Explore Trails"` | "Browse hundreds of trails by difficulty…" |
| `/community` | `"Community"` | "Connect with fellow hikers…" |
| `/about` | `"About"` | "Learn about the TrailQuest platform…" |
| `/challenges` | `"Challenges"` | "Complete trail challenges and earn badges…" |
| `/events` | `"Events"` | "Discover upcoming hiking events…" |
| `/log-activity` | `"Log Activity"` | `noIndex: true` (authenticated-only page) |

**`robots.txt`** — Allow all crawlers; disallow `/dashboard`, `/log-activity`:
```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /log-activity
Disallow: /challenges
```

**`app/sitemap.ts`** — Static sitemap for public pages:
```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://trailquest.vercel.app/", priority: 1.0 },
    { url: "https://trailquest.vercel.app/trails", priority: 0.9 },
    { url: "https://trailquest.vercel.app/events", priority: 0.8 },
    { url: "https://trailquest.vercel.app/community", priority: 0.7 },
    { url: "https://trailquest.vercel.app/about", priority: 0.6 },
  ];
}
```

**Testing:**
- `curl https://trailquest.vercel.app/trails` shows correct `<title>` and `<meta name="description">` in HTML source
- `/robots.txt` and `/sitemap.xml` return correct responses
- Lighthouse SEO score ≥ 95 on public pages

---

## Summary of File Operations

| Operation | Count |
|---|---|
| Files deleted | `react-router.config.ts`, `vite.config.ts`, `app/root.tsx`, `app/routes.ts`, `app/routes/*.tsx` (8 files) — **12 files total** |
| Files created | `next.config.ts`, `middleware.ts`, `app/layout.tsx`, `app/lib/supabase-server.ts`, `app/sitemap.ts`, `public/robots.txt`, all 8 `app/*/page.tsx` — **15 files total** |
| Files modified | `package.json`, `tsconfig.json`, `.env`, `app/lib/supabase.ts`, `app/components/auth/ProtectedRoute.tsx`, `app/components/layout/Navbar.tsx`, `app/components/user/ProfileMenu.tsx`, `app/components/activity/ActivityWidget.tsx` — **~8 files** |
| Files untouched | All other `app/components/**`, `app/constants/**`, `app/context/`, `app/hooks/useTheme.ts`, `app/app.css` |

---

## Risk Notes

| Risk | Mitigation |
|---|---|
| `useSearchParams` build error in Next.js | Wrap `TrailsContent` and `LogActivityContent` in `<Suspense>` (Step 5) |
| `localStorage` in `useState` initializer crashing on server | Moved to `useEffect` in `community/page.tsx` (Step 5) |
| Theme flash on initial load | Inline `<script>` in `<head>` retained from root.tsx (Step 2) |
| Supabase `VITE_*` env vars not available in Next.js | Renamed to `NEXT_PUBLIC_*` in Step 3; update Vercel project env settings |
| `navigate(-1)` history API not available in some SSR contexts | `router.back()` from next/navigation is the exact equivalent |
| ProtectedRoute still present as client component | Fine — middleware is the real guard; ProtectedRoute is now just a UX loading wrapper |
