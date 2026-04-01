import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import {
  X,
  CheckCircle2,
  Footprints,
  TrendingUp,
  Award,
  Mountain,
  Flame,
  Zap,
  MapPin,
  Calendar,
  Lock,
  Star,
  Trophy,
} from "lucide-react";
import { recentTrails } from "~/constants/trails";
import { DASHBOARD_BADGES } from "~/constants/dashboard";
import type { DashboardStat } from "~/constants/dashboard";

interface StatsDetailModalProps {
  stat: DashboardStat | null;
  onClose: () => void;
}

const DIFFICULTY_CONFIG: Record<string, { badge: string; bar: string }> = {
  Easy: {
    badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    bar: "bg-emerald-500",
  },
  Moderate: {
    badge: "bg-primary/15 text-primary border-primary/30",
    bar: "bg-primary",
  },
  Hard: {
    badge: "bg-rose-500/15 text-rose-500 border-rose-500/30",
    bar: "bg-rose-500",
  },
};

const MONTHLY_ACTIVITY = [
  { month: "Oct", trails: 1 },
  { month: "Nov", trails: 2 },
  { month: "Dec", trails: 1 },
  { month: "Jan", trails: 3 },
  { month: "Feb", trails: 2 },
  { month: "Mar", trails: 3 },
];

const WEEKLY_MILES = [
  { week: "W1", miles: 5.2 },
  { week: "W2", miles: 9.8 },
  { week: "W3", miles: 6.4 },
  { week: "W4", miles: 11.1 },
  { week: "W5", miles: 7.6 },
  { week: "W6", miles: 8.2 },
];

const ELEVATION_PER_TRAIL = [
  { name: "Pine Ridge Loop", elevation: 820, colorClass: "bg-primary" },
  { name: "Meadow Walk", elevation: 310, colorClass: "bg-primary" },
  { name: "Summit Crest Trail", elevation: 2840, colorClass: "bg-primary" },
  { name: "Canyon Falls Path", elevation: 1540, colorClass: "bg-primary" },
  { name: "Ridgeline Traverse", elevation: 2330, colorClass: "bg-primary" },
];

const NEXT_BADGES = [
  {
    icon: Mountain,
    label: "Peak Bagger",
    requirement: "Complete 5 Hard trails",
    progress: 3,
    total: 5,
    unit: "",
    textClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/20",
    barClass: "bg-primary",
  },
  {
    icon: Footprints,
    label: "Century Hiker",
    requirement: "Hike 100 miles total",
    progress: 48,
    total: 100,
    unit: " mi",
    textClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/20",
    barClass: "bg-primary",
  },
  {
    icon: Flame,
    label: "Iron Hiker",
    requirement: "5-Week hiking streak",
    progress: 3,
    total: 5,
    unit: " wks",
    textClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/20",
    barClass: "bg-primary",
  },
];

const STAT_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    cta: string;
    icon: typeof CheckCircle2;
    accent: string;
    gradient: string;
    accentBar: string;
  }
> = {
  "Trails Completed": {
    title: "Trails Completed",
    subtitle: "Your hiking history at a glance",
    cta: "Explore Trails",
    icon: CheckCircle2,
    accent: "text-primary",
    gradient: "from-primary/10 via-primary/4 to-transparent",
    accentBar: "bg-primary",
  },
  "Miles Hiked": {
    title: "Miles Hiked",
    subtitle: "Distance covered across all hikes",
    cta: "Log Activity",
    icon: Footprints,
    accent: "text-primary",
    gradient: "from-primary/10 via-primary/4 to-transparent",
    accentBar: "bg-primary",
  },
  "Elevation Gained": {
    title: "Elevation Gained",
    subtitle: "Total vertical feet climbed",
    cta: "Find Hilly Trails",
    icon: TrendingUp,
    accent: "text-primary",
    gradient: "from-primary/10 via-primary/4 to-transparent",
    accentBar: "bg-primary",
  },
  "Badges Earned": {
    title: "Badges Earned",
    subtitle: "Achievements and milestones",
    cta: "View Challenges",
    icon: Award,
    accent: "text-primary",
    gradient: "from-primary/10 via-primary/4 to-transparent",
    accentBar: "bg-primary",
  },
};

function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    function step(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
      else setValue(target);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

function CountDisplay({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const animated = useCountUp(value);
  const display =
    decimals > 0
      ? animated.toFixed(decimals)
      : Math.round(animated).toLocaleString();
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function StaggerItem({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80 + index * 70);
    return () => clearTimeout(t);
  }, [index]);
  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(14px)",
      }}
    >
      {children}
    </div>
  );
}

function SummaryStatCard({
  value,
  suffix = "",
  label,
  textClass,
  bgClass,
  borderClass,
  decimals = 0,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  decimals?: number;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl ${bgClass} border ${borderClass} p-3 min-h-[80px] transition-all duration-500`}
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? "scale(1) translateY(0px)" : "scale(0.9) translateY(8px)",
      }}
    >
      <span
        className={`text-lg font-bold whitespace-nowrap leading-none ${textClass}`}
        style={ready ? { animation: "count-pop 0.4s ease-out both" } : undefined}
      >
        {ready ? (
          <CountDisplay value={value} decimals={decimals} suffix={suffix} />
        ) : (
          "0"
        )}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function BarChart({
  data,
  valueKey,
  labelKey,
  colorClass,
  maxOverride,
  unit = "",
}: {
  data: Record<string, number | string>[];
  valueKey: string;
  labelKey: string;
  colorClass: string;
  maxOverride?: number;
  unit?: string;
}) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, []);

  const max =
    maxOverride ?? Math.max(...data.map((d) => d[valueKey] as number));
  const maxIndex = data.reduce(
    (best, d, i) =>
      (d[valueKey] as number) > (data[best][valueKey] as number) ? i : best,
    0
  );

  return (
    <div className="flex items-stretch gap-2 h-44 w-full">
      {data.map((d, i) => {
        const pct = ((d[valueKey] as number) / max) * 100;
        const isMax = i === maxIndex;
        const isHovered = hovered === i;

        return (
          <div
            key={i}
            className="flex flex-col items-center gap-1 flex-1 relative"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {isHovered && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground/90 text-background text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap z-20 pointer-events-none shadow-lg">
                {d[valueKey]}
                {unit}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground/90" />
              </div>
            )}
            {isMax ? (
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
            ) : (
              <span className="w-2.5 h-2.5 shrink-0" />
            )}
            <div className="w-full flex-1 flex items-end rounded overflow-hidden bg-muted/40">
              <div
                className={`w-full rounded transition-[opacity] duration-200 ${colorClass} ${isMax ? "opacity-100" : isHovered ? "opacity-90" : "opacity-65"}`}
                style={{
                  height: animated ? `${pct}%` : "0%",
                  transition: `height ${500 + i * 55}ms cubic-bezier(0.34, 1.1, 0.64, 1) ${animated ? 0 : i * 55}ms, opacity 0.2s`,
                }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground leading-none">
              {d[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function GoalBar({
  pct,
  colorClass,
  shimmer = false,
}: {
  pct: number;
  colorClass: string;
  shimmer?: boolean;
}) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`h-full ${colorClass} rounded-full relative overflow-hidden`}
      style={{
        width: animated ? `${Math.min(pct, 100)}%` : "0%",
        transition: "width 1s cubic-bezier(0.34, 1.1, 0.64, 1)",
      }}
    >
      {shimmer && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ animation: "shimmer 2s ease-in-out infinite" }}
        />
      )}
    </div>
  );
}

function CircularProgress({
  pct,
  colorClass,
  size = 88,
  label,
  valueStr,
}: {
  pct: number;
  colorClass: string;
  size?: number;
  label: string;
  valueStr: string;
}) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 160);
    return () => clearTimeout(t);
  }, []);

  const strokeOffset =
    circumference - (animated ? (Math.min(pct, 100) / 100) * circumference : 0);

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${colorClass}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 absolute inset-0"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          style={{ stroke: "var(--border)" }}
          strokeWidth={9}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={9}
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dashoffset 1.3s cubic-bezier(0.34, 1.15, 0.64, 1)",
          }}
        />
      </svg>
      <div className="text-center z-10 select-none">
        <p className="text-sm font-bold leading-none text-foreground">
          {valueStr}
        </p>
        <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
          {label}
        </p>
      </div>
    </div>
  );
}

function TrailsCompletedContent() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        <SummaryStatCard
          value={12}
          label="Total Trails"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={100}
        />
        <SummaryStatCard
          value={2}
          label="This Month"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={190}
        />
        <SummaryStatCard
          value={4.7}
          decimals={1}
          label="Avg Rating"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={280}
        />
      </div>

      <StaggerItem index={0}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Monthly Activity
        </p>
        <BarChart
          data={MONTHLY_ACTIVITY as Record<string, number | string>[]}
          valueKey="trails"
          labelKey="month"
          colorClass="bg-primary"
          maxOverride={4}
          unit=" trails"
        />
      </StaggerItem>

      <StaggerItem index={1}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Recent Completions
        </p>
        <div className="flex flex-col gap-2">
          {recentTrails.map((trail, i) => {
            const cfg =
              DIFFICULTY_CONFIG[trail.difficulty] ?? DIFFICULTY_CONFIG.Moderate;
            const badgeBgClass = cfg.badge
              .split(" ")
              .find((c) => c.startsWith("bg-")) ?? "";
            return (
              <StaggerItem key={trail.name} index={i + 2}>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-sm p-3 transition-all duration-200 cursor-default group">
                  <div
                    className={`w-8 h-8 rounded-lg ${badgeBgClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {trail.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {trail.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}
                    >
                      {trail.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {trail.completedAt}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerItem>
    </div>
  );
}

function MilesHikedContent() {
  const weeklyMax = Math.max(...WEEKLY_MILES.map((w) => w.miles));
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        <SummaryStatCard
          value={48.3}
          decimals={1}
          suffix=" mi"
          label="Total Miles"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={100}
        />
        <SummaryStatCard
          value={8}
          suffix=" mi"
          label="Per Week"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={190}
        />
        <SummaryStatCard
          value={11.1}
          decimals={1}
          suffix=" mi"
          label="Best Week"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={280}
        />
      </div>

      <StaggerItem index={0}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Weekly Breakdown
        </p>
        <BarChart
          data={WEEKLY_MILES as Record<string, number | string>[]}
          valueKey="miles"
          labelKey="week"
          colorClass="bg-primary"
          maxOverride={weeklyMax}
          unit=" mi"
        />
      </StaggerItem>

      <StaggerItem index={1}>
        <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <CircularProgress
            pct={48.3}
            colorClass="text-primary"
            size={84}
            label="of 100 mi"
            valueStr="48%"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Century Hiker Goal</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              51.7 mi remaining to earn the badge
            </p>
            <div className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden">
              <GoalBar pct={48.3} colorClass="bg-primary" shimmer />
            </div>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem index={2}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Per-Trail Distance
        </p>
        <div className="flex flex-col gap-2.5">
          {recentTrails.map((trail) => (
            <div key={trail.name} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-28 truncate shrink-0">
                {trail.name}
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <GoalBar
                  pct={(parseFloat(trail.distance) / 10) * 100}
                  colorClass="bg-primary"
                />
              </div>
              <span className="text-xs font-semibold text-foreground w-12 text-right shrink-0">
                {trail.distance}
              </span>
            </div>
          ))}
        </div>
      </StaggerItem>
    </div>
  );
}

function ElevationGainedContent() {
  const elevMax = Math.max(...ELEVATION_PER_TRAIL.map((e) => e.elevation));
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        <SummaryStatCard
          value={9840}
          suffix=" ft"
          label="Total Feet"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={100}
        />
        <SummaryStatCard
          value={2840}
          suffix=" ft"
          label="Best Climb"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={190}
        />
        <SummaryStatCard
          value={820}
          suffix=" ft"
          label="Avg / Trail"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={280}
        />
      </div>

      <StaggerItem index={0}>
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              Personal Best
            </p>
            <p className="text-xs text-muted-foreground">
              Summit Crest Trail â€” 2,840 ft gained in one hike
            </p>
          </div>
          <Trophy className="w-5 h-5 text-primary ml-auto shrink-0" />
        </div>
      </StaggerItem>

      <StaggerItem index={1}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Elevation by Trail
        </p>
        <div className="flex flex-col gap-2.5">
          {ELEVATION_PER_TRAIL.map((item, i) => (
            <StaggerItem key={item.name} index={i + 2}>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-32 truncate shrink-0">
                  {item.name}
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <GoalBar
                    pct={(item.elevation / elevMax) * 100}
                    colorClass={item.colorClass}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-18 text-right shrink-0">
                  {item.elevation.toLocaleString()} ft
                </span>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem index={3}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Difficulty Breakdown
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            {
              label: "Easy",
              count: 3,
              textClass: "text-primary",
              bgBorder: "bg-primary/10 border-primary/20",
            },
            {
              label: "Moderate",
              count: 6,
              textClass: "text-primary",
              bgBorder: "bg-primary/10 border-primary/20",
            },
            {
              label: "Hard",
              count: 3,
              textClass: "text-primary",
              bgBorder: "bg-primary/10 border-primary/20",
            },
          ].map((d) => (
            <div
              key={d.label}
              className={`rounded-xl border ${d.bgBorder} p-2.5 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-default`}
            >
              <p className={`text-lg font-bold ${d.textClass}`}>{d.count}</p>
              <p className="text-[10px] text-muted-foreground">{d.label}</p>
            </div>
          ))}
        </div>
      </StaggerItem>
    </div>
  );
}

function BadgesEarnedContent() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        <SummaryStatCard
          value={5}
          label="Earned"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={100}
        />
        <SummaryStatCard
          value={3}
          label="In Progress"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={190}
        />
        <SummaryStatCard
          value={8}
          label="Total"
          textClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/15"
          delay={280}
        />
      </div>

      <StaggerItem index={0}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Earned Badges
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DASHBOARD_BADGES.map((badge, i) => {
            const Icon = badge.icon;
            const parts = badge.color.split(" ");
            const textClass = parts[0];
            const bgClass = parts[1];
            const borderClass = parts[2];
            return (
              <StaggerItem key={badge.label} index={i + 1}>
                <div
                  className={`group relative flex flex-col items-center gap-2 rounded-xl border ${bgClass} ${borderClass} p-3 cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 ${bgClass} opacity-0 group-hover:opacity-60 blur-md scale-110 pointer-events-none transition-opacity duration-300`}
                  />
                  <div
                    className={`relative w-10 h-10 rounded-full ${bgClass} border ${borderClass} flex items-center justify-center`}
                  >
                    <Icon
                      className={`w-5 h-5 ${textClass} transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}
                    />
                  </div>
                  <div className="relative flex items-center gap-0.5">
                    {[0, 1, 2].map((s) => (
                      <Star
                        key={s}
                        className="w-3 h-3 fill-amber-400 text-amber-400 transition-transform duration-200 group-hover:scale-125"
                        style={{ transitionDelay: `${s * 50}ms` }}
                      />
                    ))}
                  </div>
                  <p className="relative text-[11px] font-semibold text-foreground text-center leading-tight">
                    {badge.label}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerItem>

      <StaggerItem index={2}>
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Next Up
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {NEXT_BADGES.map((nb, i) => {
            const Icon = nb.icon;
            const pct = (nb.progress / nb.total) * 100;
            return (
              <StaggerItem key={nb.label} index={i + 3}>
                <div
                  className={`flex items-center gap-3 rounded-xl border ${nb.borderClass} bg-card/50 hover:bg-card hover:shadow-sm p-3 transition-all duration-200`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl border ${nb.borderClass} ${nb.bgClass} flex items-center justify-center shrink-0`}
                  >
                    <Lock className="w-4 h-4 text-muted-foreground animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-foreground">
                        {nb.label}
                      </p>
                      <span
                        className={`text-[10px] font-semibold ${nb.textClass}`}
                      >
                        {nb.progress}/{nb.total}
                        {nb.unit}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <GoalBar
                        pct={pct}
                        colorClass={nb.barClass}
                        shimmer
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {nb.requirement}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerItem>
    </div>
  );
}

export default function StatsDetailModal({
  stat,
  onClose,
}: StatsDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!stat) {
      setMounted(false);
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, [stat]);

  const handleClose = useCallback(() => {
    setMounted(false);
    setTimeout(onClose, 220);
  }, [onClose]);

  useEffect(() => {
    if (!stat) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stat, handleClose]);

  useEffect(() => {
    document.body.style.overflow = stat ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stat]);

  if (!stat) return null;

  const meta = STAT_META[stat.label];
  const Icon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stat-detail-title"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-lg flex flex-col max-h-[92dvh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
      >
        <div className={`h-1 w-full ${meta.accentBar} shrink-0`} />



        <div
          className={`relative px-4 sm:px-6 pt-3 sm:pt-4 pb-5 border-b border-border bg-gradient-to-br ${meta.gradient} overflow-hidden`}
        >
          <div
            className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full ${stat.bg} blur-2xl opacity-60`}
          />

          <div className="relative flex items-start gap-4 justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div
                  className={`absolute inset-0 ${stat.bg} rounded-xl scale-125 blur-md animate-pulse pointer-events-none`}
                />
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p
                  id="stat-detail-title"
                  className="text-sm font-semibold text-foreground"
                >
                  {meta.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{meta.subtitle}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="relative shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 scrollbar-themed">
          {stat.label === "Trails Completed" && <TrailsCompletedContent />}
          {stat.label === "Miles Hiked" && <MilesHikedContent />}
          {stat.label === "Elevation Gained" && <ElevationGainedContent />}
          {stat.label === "Badges Earned" && <BadgesEarnedContent />}
        </div>

        <div className="px-4 sm:px-6 pb-5 pt-3 border-t border-border flex gap-2.5">
          <button
            onClick={handleClose}
            className={`flex-1 py-2.5 text-sm font-semibold text-primary-foreground ${meta.accentBar} rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 cursor-pointer`}
          >
            {meta.cta}
          </button>
          <button
            onClick={handleClose}
            className="py-2.5 px-5 text-sm font-medium text-muted-foreground border border-border rounded-xl hover:bg-muted/50 hover:text-foreground transition-colors duration-150 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
