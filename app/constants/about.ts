import {
  Mountain,
  Map,
  Users,
  Trophy,
  Shield,
  Zap,
  Layers,
  Database,
  Palette,
  Package,
  Server,
  Code2,
  type LucideIcon,
} from "lucide-react";

export interface AboutFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface AboutTechItem {
  name: string;
  note: string;
}

export interface AboutTechCategory {
  category: string;
  icon: LucideIcon;
  items: AboutTechItem[];
}

export interface AboutTimelineStep {
  version: string;
  date: string;
  title: string;
  description: string;
  upcoming?: boolean;
}

export interface AboutFaq {
  question: string;
  answer: string;
}

export const ABOUT_FEATURES: AboutFeature[] = [
  {
    icon: Map,
    title: "Trail Discovery",
    description:
      "Browse and filter hundreds of trails by difficulty, distance, type, and rating. Every trail is detailed with elevation profiles and waypoint highlights.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description:
      "Log completed hikes, earn achievement badges, and watch your stats grow. Your personal dashboard keeps every adventure on record.",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Community Groups",
    description:
      "Join groups that match your pace and passion - from beginner-friendly strolls to elite endurance challenges. Never hike alone.",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: Mountain,
    title: "Upcoming Hike Events",
    description:
      "Discover community-organised hike announcements, RSVP instantly, and stay in the loop with real-time spot availability.",
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Authentication is handled by Supabase with row-level security. Your data belongs to you - always encrypted in transit and at rest.",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Built with Vite and React Router v7 SSR for sub-second navigation. Optimised images, code-split routes, and minimal JavaScript on the wire.",
    color: "text-rose-500 bg-rose-500/10",
  },
];

export const ABOUT_TECH_STACK: AboutTechCategory[] = [
  {
    category: "Framework",
    icon: Layers,
    items: [
      { name: "React 19", note: "UI rendering & state" },
      { name: "React Router v7", note: "SSR + file-based routing" },
      { name: "TypeScript 5", note: "Strict type safety" },
    ],
  },
  {
    category: "Styling",
    icon: Palette,
    items: [
      { name: "Tailwind CSS 4", note: "Utility-first, oklch colors" },
      { name: "CSS Custom Properties", note: "Themeable design tokens" },
      { name: "Dark Mode", note: "Class-based, flash-free" },
    ],
  },
  {
    category: "Backend & Auth",
    icon: Database,
    items: [
      { name: "Supabase", note: "Postgres + Auth + Storage" },
      { name: "Row-Level Security", note: "Fine-grained data access" },
      { name: "JWT Sessions", note: "Persistent auth across tabs" },
    ],
  },
  {
    category: "Build & Deploy",
    icon: Server,
    items: [
      { name: "Vite 7", note: "HMR & optimised bundling" },
      { name: "Docker", note: "Multi-stage production build" },
      { name: "Vercel", note: "Edge deployment preset" },
    ],
  },
  {
    category: "UI Components",
    icon: Package,
    items: [
      { name: "lucide-react", note: "Consistent icon set" },
      { name: "Google Fonts", note: "Roboto, Playfair, Fira Code" },
      { name: "Custom Components", note: "Zero external UI framework" },
    ],
  },
  {
    category: "Developer Tools",
    icon: Code2,
    items: [
      { name: "ESLint + Prettier", note: "Code quality & formatting" },
      { name: "tsconfig paths", note: "Clean ~ import aliases" },
      { name: "vite-tsconfig-paths", note: "Path resolution plugin" },
    ],
  },
];

export const ABOUT_TIMELINE: AboutTimelineStep[] = [
  {
    version: "v0.1",
    date: "Jan 2026",
    title: "Foundation",
    description:
      "Project scaffolded with React Router v7, Supabase auth, and the base design system.",
  },
  {
    version: "v0.2",
    date: "Feb 2026",
    title: "Trail Engine",
    description:
      "Trail directory with search, filters, sorting, and the tabbed TrailDetailModal with SVG elevation chart.",
  },
  {
    version: "v0.3",
    date: "Mar 2026",
    title: "Community & Polish",
    description:
      "Community groups, hike announcements, responsive mobile drawer, dark mode, and avatar uploads.",
  },
  {
    version: "v1.0",
    date: "Coming Soon",
    title: "Full Launch",
    description:
      "Real-time activity feeds, map integration, challenge system, and native mobile app.",
    upcoming: true,
  },
];

export const ABOUT_FAQS: AboutFaq[] = [
  {
    question: "Is TrailQuest free to use?",
    answer:
      "Yes - TrailQuest is completely free for all core features: browsing trails, joining groups, and RSVPing to hike events. Premium tiers with offline maps and guided routes are planned for v1.0.",
  },
  {
    question: "Can I contribute trail data?",
    answer:
      "Community-submitted trails are on the roadmap. Once the trail submission form ships you will be able to add GPS routes, photos, and conditions reports directly from the app.",
  },
  {
    question: "How is my data stored?",
    answer:
      "All user data is stored in a Supabase Postgres database with row-level security. Passwords are never stored - Supabase handles authentication with JWT tokens. Avatar images are stored in Supabase Storage.",
  },
  {
    question: "What platforms are supported?",
    answer:
      "TrailQuest is a responsive web app optimised for desktop and mobile browsers. A native iOS and Android app built with React Native is planned for the v1.0 launch.",
  },
];
