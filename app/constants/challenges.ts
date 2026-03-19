import {
  Flame,
  Trophy,
  Mountain,
  Footprints,
  Compass,
  Shield,
  Zap,
  Award,
  Leaf,
  Star,
  type LucideIcon,
} from "lucide-react";

export type ChallengeStatus = "active" | "available" | "completed" | "locked";

export type ChallengeTier = "bronze" | "silver" | "gold" | null;

export type ChallengeType =
  | "streak"
  | "distance"
  | "elevation"
  | "collection"
  | "difficulty"
  | "seasonal"
  | "speed";

export interface Challenge {
  id: number;
  title: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  difficulty: "Easy" | "Moderate" | "Hard";
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  progressColor: string;
  current: number;
  goal: number;
  unit: string;
  tiers: { bronze: number; silver: number; gold: number };
  badgeLabel: string;
  badgeIcon: LucideIcon;
  startedAt: string;
  endsAt: string;
  seasonal: boolean;
  recommendedTrails: string[];
  highlights: string[];
  xp: number;
}

export interface ChallengeLeaderEntry {
  rank: number;
  name: string;
  avatarSeed: string;
  progress: number;
  tier: ChallengeTier;
}

export interface ChallengeStats {
  activeChallenges: number;
  completedChallenges: number;
  currentStreak: number;
  totalBadgesEarned: number;
}

export const CHALLENGE_TYPE_CONFIG: Record<
  ChallengeType,
  { label: string; icon: LucideIcon }
> = {
  streak: { label: "Streak", icon: Flame },
  distance: { label: "Distance", icon: Footprints },
  elevation: { label: "Elevation", icon: Mountain },
  collection: { label: "Collection", icon: Compass },
  difficulty: { label: "Difficulty", icon: Shield },
  seasonal: { label: "Seasonal", icon: Leaf },
  speed: { label: "Speed", icon: Zap },
};

export const CHALLENGE_TIER_CONFIG: Record<
  NonNullable<ChallengeTier>,
  { label: string; color: string; bg: string; border: string; minPct: number }
> = {
  bronze: {
    label: "Bronze",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    minPct: 25,
  },
  silver: {
    label: "Silver",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    minPct: 50,
  },
  gold: {
    label: "Gold",
    color: "text-yellow-500",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    minPct: 100,
  },
};

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "The Streak Machine",
    description:
      "Hike at least once every week for 6 consecutive weeks. Any trail counts — even a short one.",
    type: "streak",
    status: "active",
    difficulty: "Easy",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    progressColor: "bg-orange-500",
    current: 4,
    goal: 6,
    unit: "weeks",
    tiers: { bronze: 2, silver: 3, gold: 6 },
    badgeLabel: "Streak Master",
    badgeIcon: Flame,
    startedAt: "2026-02-07T00:00:00Z",
    endsAt: "",
    seasonal: false,
    recommendedTrails: ["Meadow Walk", "Lakeside Stroll", "Canyon Falls Path"],
    highlights: [
      "Set a recurring weekend hike reminder on your phone",
      "Short hikes count — even 1 mi keeps your streak alive",
      "Invite a friend for accountability on tough weeks",
    ],
    xp: 200,
  },
  {
    id: 2,
    title: "Spring Trail Blitz",
    description:
      "Cover 50 miles of trails before the cherry blossoms fall. Any trail, any pace — just keep moving.",
    type: "seasonal",
    status: "active",
    difficulty: "Moderate",
    icon: Leaf,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    progressColor: "bg-emerald-500",
    current: 18.3,
    goal: 50,
    unit: "mi",
    tiers: { bronze: 12.5, silver: 25, gold: 50 },
    badgeLabel: "Seasonal Bloomer",
    badgeIcon: Award,
    startedAt: "2026-03-01T00:00:00Z",
    endsAt: "2026-04-20T23:59:59Z",
    seasonal: true,
    recommendedTrails: ["Pine Ridge Loop", "Granite Dome Circuit", "Highland Moor Path"],
    highlights: [
      "Log every hike — miles add up faster than you think",
      "Combine shorter trails on the same day to boost distance",
      "The deadline is firm — pace yourself with weekly mini-goals",
    ],
    xp: 500,
  },
  {
    id: 3,
    title: "Summit Collector",
    description:
      "Gain 10,000 feet of elevation across any combination of trails. Every uphill step counts.",
    type: "elevation",
    status: "active",
    difficulty: "Hard",
    icon: Mountain,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    progressColor: "bg-sky-500",
    current: 6820,
    goal: 10000,
    unit: "ft",
    tiers: { bronze: 2500, silver: 5000, gold: 10000 },
    badgeLabel: "Peak Bagger",
    badgeIcon: Mountain,
    startedAt: "2026-01-15T00:00:00Z",
    endsAt: "",
    seasonal: false,
    recommendedTrails: ["Summit Crest Trail", "Ridgeline Traverse", "Deadwood Ravine"],
    highlights: [
      "Prioritize trails with high elevation gain per mile",
      "Out-and-back routes let you double the vert on the same trail",
      "Plan a dedicated 'vert day' on a challenging trail",
    ],
    xp: 400,
  },
  {
    id: 4,
    title: "Trailblazer 50",
    description:
      "Cover 50 total miles across any trails. A classic distance challenge for hikers who want a consistent goal.",
    type: "distance",
    status: "available",
    difficulty: "Moderate",
    icon: Footprints,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    progressColor: "bg-primary",
    current: 0,
    goal: 50,
    unit: "mi",
    tiers: { bronze: 12.5, silver: 25, gold: 50 },
    badgeLabel: "50 Mile Pioneer",
    badgeIcon: Trophy,
    startedAt: "",
    endsAt: "",
    seasonal: false,
    recommendedTrails: ["Pine Ridge Loop", "Meadow Walk", "Canyon Falls Path"],
    highlights: [
      "Break it into 5 ten-mile weeks for a sustainable pace",
      "Mix trail types — loops, out-and-backs, and point-to-points all count",
      "Log your miles immediately after each hike so nothing is lost",
    ],
    xp: 350,
  },
  {
    id: 5,
    title: "The Grand Explorer",
    description:
      "Hike in 5 different locations. Seek out new landscapes — each distinct location unlocks a step.",
    type: "collection",
    status: "available",
    difficulty: "Easy",
    icon: Compass,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    progressColor: "bg-indigo-500",
    current: 0,
    goal: 5,
    unit: "locations",
    tiers: { bronze: 2, silver: 3, gold: 5 },
    badgeLabel: "Wanderer",
    badgeIcon: Compass,
    startedAt: "",
    endsAt: "",
    seasonal: false,
    recommendedTrails: [
      "Meadow Walk",
      "Canyon Falls Path",
      "Lakeside Stroll",
      "Highland Moor Path",
      "Ridgeline Traverse",
    ],
    highlights: [
      "Plan one new location per month to complete this in 5 months",
      "Road trips count — even a quick trail stop on a trip is progress",
      "Mix difficulty levels across locations to build skills",
    ],
    xp: 250,
  },
  {
    id: 6,
    title: "Beyond the Comfort Zone",
    description:
      "Complete 3 trails rated Hard. Push past your limits and build the mental strength that defines every great hiker.",
    type: "difficulty",
    status: "available",
    difficulty: "Hard",
    icon: Shield,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    progressColor: "bg-rose-500",
    current: 0,
    goal: 3,
    unit: "hard trails",
    tiers: { bronze: 1, silver: 2, gold: 3 },
    badgeLabel: "Iron Hiker",
    badgeIcon: Award,
    startedAt: "",
    endsAt: "",
    seasonal: false,
    recommendedTrails: ["Summit Crest Trail", "Ridgeline Traverse", "Deadwood Ravine"],
    highlights: [
      "Build up with 1-2 Moderate trails for conditioning first",
      "Never hike Hard trails alone — bring an experienced partner",
      "Check trail conditions and weather 24 hours before departure",
    ],
    xp: 450,
  },
  {
    id: 7,
    title: "Speed Demon",
    description:
      "Complete any trail 20% faster than its listed duration. Requires precision, fitness, and a solid warm-up.",
    type: "speed",
    status: "locked",
    difficulty: "Hard",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    progressColor: "bg-yellow-500",
    current: 0,
    goal: 1,
    unit: "completion",
    tiers: { bronze: 1, silver: 1, gold: 1 },
    badgeLabel: "Speed Hiker",
    badgeIcon: Zap,
    startedAt: "",
    endsAt: "",
    seasonal: false,
    recommendedTrails: ["Pine Ridge Loop", "Meadow Walk"],
    highlights: [
      "Start with shorter trails where timing is easier to control",
      "Train on similar terrain before attempting a speed run",
      "Warm up properly — speed hiking puts extra strain on joints",
    ],
    xp: 300,
  },
  {
    id: 8,
    title: "Winter Warrior",
    description:
      "Complete 20 miles of trails during the winter season. Cold conditions, short days, and stunning scenery.",
    type: "seasonal",
    status: "completed",
    difficulty: "Moderate",
    icon: Leaf,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    progressColor: "bg-slate-400",
    current: 20,
    goal: 20,
    unit: "mi",
    tiers: { bronze: 5, silver: 10, gold: 20 },
    badgeLabel: "Winter Warrior",
    badgeIcon: Star,
    startedAt: "2025-12-01T00:00:00Z",
    endsAt: "2026-02-28T23:59:59Z",
    seasonal: true,
    recommendedTrails: ["Pine Ridge Loop", "Granite Dome Circuit"],
    highlights: [
      "Layer up — cotton kills in cold conditions, use moisture-wicking base layers",
      "Bring hand warmers and traction devices for icy trails",
      "Shorter days mean earlier start times — plan for sunset",
    ],
    xp: 350,
  },
];

export const CHALLENGE_LEADERBOARD: Record<number, ChallengeLeaderEntry[]> = {
  1: [
    { rank: 1, name: "Alex M.", avatarSeed: "AM", progress: 6, tier: "gold" },
    { rank: 2, name: "Sam T.", avatarSeed: "ST", progress: 5, tier: "silver" },
    { rank: 3, name: "YOU", avatarSeed: "YOU", progress: 4, tier: "silver" },
    { rank: 4, name: "Jordan K.", avatarSeed: "JK", progress: 3, tier: "bronze" },
    { rank: 5, name: "Riley P.", avatarSeed: "RP", progress: 2, tier: "bronze" },
  ],
  2: [
    { rank: 1, name: "Morgan L.", avatarSeed: "ML", progress: 42, tier: "silver" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 18.3, tier: null },
    { rank: 3, name: "Taylor B.", avatarSeed: "TB", progress: 15, tier: null },
    { rank: 4, name: "Quinn A.", avatarSeed: "QA", progress: 11.2, tier: null },
    { rank: 5, name: "Drew C.", avatarSeed: "DC", progress: 8.5, tier: null },
  ],
  3: [
    { rank: 1, name: "Chris H.", avatarSeed: "CH", progress: 9200, tier: "silver" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 6820, tier: "silver" },
    { rank: 3, name: "Avery S.", avatarSeed: "AS", progress: 5100, tier: "bronze" },
    { rank: 4, name: "Parker N.", avatarSeed: "PN", progress: 3800, tier: "bronze" },
    { rank: 5, name: "Reese G.", avatarSeed: "RG", progress: 2500, tier: null },
  ],
  4: [
    { rank: 1, name: "Jordan K.", avatarSeed: "JK", progress: 38, tier: "silver" },
    { rank: 2, name: "Alex M.", avatarSeed: "AM", progress: 22, tier: null },
    { rank: 3, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null },
    { rank: 4, name: "Riley P.", avatarSeed: "RP", progress: 0, tier: null },
    { rank: 5, name: "Sam T.", avatarSeed: "ST", progress: 0, tier: null },
  ],
  5: [
    { rank: 1, name: "Morgan L.", avatarSeed: "ML", progress: 3, tier: null },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null },
    { rank: 3, name: "Chris H.", avatarSeed: "CH", progress: 0, tier: null },
    { rank: 4, name: "Avery S.", avatarSeed: "AS", progress: 0, tier: null },
    { rank: 5, name: "Taylor B.", avatarSeed: "TB", progress: 0, tier: null },
  ],
  6: [
    { rank: 1, name: "Sam T.", avatarSeed: "ST", progress: 2, tier: null },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null },
    { rank: 3, name: "Drew C.", avatarSeed: "DC", progress: 0, tier: null },
    { rank: 4, name: "Quinn A.", avatarSeed: "QA", progress: 0, tier: null },
    { rank: 5, name: "Parker N.", avatarSeed: "PN", progress: 0, tier: null },
  ],
  7: [
    { rank: 1, name: "Alex M.", avatarSeed: "AM", progress: 1, tier: "gold" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null },
    { rank: 3, name: "Jordan K.", avatarSeed: "JK", progress: 0, tier: null },
    { rank: 4, name: "Sam T.", avatarSeed: "ST", progress: 0, tier: null },
    { rank: 5, name: "Morgan L.", avatarSeed: "ML", progress: 0, tier: null },
  ],
  8: [
    { rank: 1, name: "YOU", avatarSeed: "YOU", progress: 20, tier: "gold" },
    { rank: 2, name: "Riley P.", avatarSeed: "RP", progress: 20, tier: "gold" },
    { rank: 3, name: "Avery S.", avatarSeed: "AS", progress: 18, tier: "silver" },
    { rank: 4, name: "Jordan K.", avatarSeed: "JK", progress: 15, tier: "silver" },
    { rank: 5, name: "Taylor B.", avatarSeed: "TB", progress: 12, tier: "bronze" },
  ],
};

export const CHALLENGE_FRIENDS_LEADERBOARD: Record<number, ChallengeLeaderEntry[]> = {
  1: [
    { rank: 1, name: "Sam T.", avatarSeed: "ST", progress: 5, tier: "silver" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 4, tier: "silver" },
    { rank: 3, name: "Jordan K.", avatarSeed: "JK", progress: 3, tier: "bronze" },
  ],
  2: [
    { rank: 1, name: "Casey W.", avatarSeed: "CW", progress: 31.0, tier: "silver" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 18.3, tier: "bronze" },
    { rank: 3, name: "Drew B.", avatarSeed: "DB", progress: 14.5, tier: "bronze" },
  ],
  3: [
    { rank: 1, name: "YOU", avatarSeed: "YOU", progress: 6820, tier: "silver" },
    { rank: 2, name: "Sage O.", avatarSeed: "SO", progress: 5200, tier: "silver" },
  ],
  4: [
    { rank: 1, name: "Reese M.", avatarSeed: "RM", progress: 27.0, tier: "silver" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null },
  ],
  5: [
    { rank: 1, name: "Rowan F.", avatarSeed: "RF", progress: 3, tier: "bronze" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null },
  ],
  6: [
    { rank: 1, name: "Scout B.", avatarSeed: "SB", progress: 2, tier: "silver" },
    { rank: 2, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null },
  ],
  7: [{ rank: 1, name: "YOU", avatarSeed: "YOU", progress: 0, tier: null }],
  8: [
    { rank: 1, name: "YOU", avatarSeed: "YOU", progress: 20, tier: "gold" },
    { rank: 2, name: "North C.", avatarSeed: "NC", progress: 18, tier: "gold" },
  ],
};

export const CHALLENGE_STATS: ChallengeStats = {
  activeChallenges: 3,
  completedChallenges: 4,
  currentStreak: 4,
  totalBadgesEarned: 7,
};
