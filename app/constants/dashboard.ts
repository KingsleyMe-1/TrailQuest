import {
  CheckCircle2,
  Footprints,
  TrendingUp,
  Award,
  Mountain,
  Flame,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface DashboardStat {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix: string;
  sub: string;
  color: string;
  bg: string;
  border: string;
}

export interface DashboardBadge {
  icon: LucideIcon;
  label: string;
  color: string;
}

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    icon: CheckCircle2,
    label: "Trails Completed",
    value: 12,
    suffix: "",
    sub: "+2 this month",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Footprints,
    label: "Miles Hiked",
    value: 48.3,
    suffix: " mi",
    sub: "~8 mi/week",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: TrendingUp,
    label: "Elevation Gained",
    value: 9840,
    suffix: " ft",
    sub: "Personal best",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Award,
    label: "Badges Earned",
    value: 5,
    suffix: "",
    sub: "2 more available",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
];

export const DASHBOARD_BADGES: DashboardBadge[] = [
  {
    icon: Mountain,
    label: "Summit Seeker",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: Flame,
    label: "3-Week Streak",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: Zap,
    label: "Speed Hiker",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: Footprints,
    label: "50 mi Club",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: Award,
    label: "Trailblazer",
    color: "text-primary bg-primary/10 border-primary/20",
  },
];

export const DASHBOARD_RECENT_TRAIL_IMAGES: Record<string, string> = {
  "Pine Ridge Loop":
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=70",
  "Meadow Walk":
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=70",
  "Summit Crest Trail":
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=70",
};

export const WEEKLY_GOALS = [
  {
    label: "Distance",
    current: 8.2,
    goal: 15,
    unit: "mi",
    color: "bg-primary",
  },
  {
    label: "Elevation",
    current: 1340,
    goal: 3000,
    unit: "ft",
    color: "bg-primary",
  },
  {
    label: "Hikes",
    current: 1,
    goal: 3,
    unit: "hikes",
    color: "bg-primary",
  },
];
