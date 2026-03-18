import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Mountain,
  Footprints,
  X,
  Share2,
  Bookmark,
} from "lucide-react";

// ─── Shared types & config ─────────────────────────────────────────────────

export type Difficulty = "Easy" | "Moderate" | "Hard";

export type Trail = {
  name: string;
  location: string;
  difficulty: Difficulty;
  distance: string;
  rating: number;
  completedAt: string;
  duration: string;
  elevation: string;
  type: string;
  description: string;
};

export const difficultyConfig: Record<Difficulty, { bar: string; badge: string }> = {
  Easy: {
    bar: "bg-emerald-500",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  Moderate: {
    bar: "bg-primary",
    badge: "bg-secondary text-secondary-foreground",
  },
  Hard: {
    bar: "bg-rose-500",
    badge: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
  },
};

// ─── Per-trail extended details ────────────────────────────────────────────

type TrailDetail = {
  tags: string[];
  highlights: string[];
  bestSeason: string;
  pace: string;
  difficultyScore: number;
  elevationPoints: number[];
};

const trailDetails: Record<string, TrailDetail> = {
  "Pine Ridge Loop": {
    tags: ["Oak Forest", "Ridge Walk", "Valley Views", "Wildlife"],
    highlights: [
      "Trailhead & parking area — 0.0 mi",
      "Pine canopy switchbacks begin — 0.8 mi",
      "First ridge viewpoint — 2.1 mi",
      "Summit overlook, 180° panorama — 3.0 mi",
      "Return via south loop — 5.2 mi",
    ],
    bestSeason: "Apr – Oct",
    pace: "~2.8 mph",
    difficultyScore: 52,
    elevationPoints: [10, 18, 28, 40, 55, 68, 78, 82, 80, 73, 60, 46, 33, 22, 14, 10],
  },
  "Meadow Walk": {
    tags: ["Wildflowers", "Creekside", "Family Friendly", "Birding"],
    highlights: [
      "Wildflower meadow entrance — 0.0 mi",
      "Creek crossing footbridge — 0.7 mi",
      "Beaver pond overlook — 1.2 mi",
      "Turnaround bench & meadow views — 2.4 mi",
    ],
    bestSeason: "May – Sep",
    pace: "~2.1 mph",
    difficultyScore: 18,
    elevationPoints: [12, 14, 16, 18, 20, 22, 24, 26, 25, 24, 22, 20, 18, 16, 14, 12],
  },
  "Summit Crest Trail": {
    tags: ["Alpine", "Exposed Ridge", "360° Views", "Technical"],
    highlights: [
      "Trailhead at Rocky Mtn NP gate — 0.0 mi",
      "Aspen grove & krummholz zone — 2.0 mi",
      "Tundra crossing, treeline ends — 3.5 mi",
      "False summit, exposed ridge — 5.8 mi",
      "True summit 14,259 ft, 360° view — 8.9 mi",
    ],
    bestSeason: "Jul – Sep",
    pace: "~1.7 mph",
    difficultyScore: 88,
    elevationPoints: [5, 12, 20, 30, 40, 52, 62, 70, 76, 82, 86, 90, 93, 95, 97, 99],
  },
  "Canyon Falls Path": {
    tags: ["Waterfall", "Canyon Views", "Desert Flora", "Family Friendly"],
    highlights: [
      "Trailhead parking area — 0.0 mi",
      "First canyon overlook — 0.6 mi",
      "Hidden alcove rest stop — 1.4 mi",
      "Lower canyon falls viewpoint — 2.3 mi",
      "Upper falls turnaround — 3.1 mi",
    ],
    bestSeason: "Mar – May, Sep – Nov",
    pace: "~2.4 mph",
    difficultyScore: 22,
    elevationPoints: [20, 22, 24, 28, 32, 36, 38, 42, 46, 52, 58, 64, 68, 70, 72, 74],
  },
  "Ridgeline Traverse": {
    tags: ["Volcanic Ridge", "Old-Growth Cedar", "Alpine Lakes", "Remote"],
    highlights: [
      "Cascade Pass trailhead — 0.0 mi",
      "Old-growth cedar grove — 1.5 mi",
      "First ridge panorama — 3.8 mi",
      "Hidden alpine lake camp — 7.0 mi",
      "North peak summit — 11.2 mi",
    ],
    bestSeason: "Jul – Sep",
    pace: "~1.9 mph",
    difficultyScore: 82,
    elevationPoints: [8, 15, 24, 35, 46, 55, 63, 70, 76, 80, 85, 88, 91, 94, 96, 98],
  },
  "Lakeside Stroll": {
    tags: ["Lake Views", "Pine Forest", "Birding", "Sunset"],
    highlights: [
      "Marina trailhead — 0.0 mi",
      "Emerald Cove overlook — 0.8 mi",
      "Sandy beach rest area — 1.7 mi",
      "Bobcat meadow — 2.8 mi",
      "Return to marina — 4.0 mi",
    ],
    bestSeason: "Year Round",
    pace: "~2.9 mph",
    difficultyScore: 14,
    elevationPoints: [12, 13, 14, 13, 15, 16, 15, 14, 15, 16, 17, 16, 15, 14, 13, 12],
  },
  "Granite Dome Circuit": {
    tags: ["Granite Slabs", "Valley Views", "Rock Climbing", "Wildflowers"],
    highlights: [
      "Valley floor trailhead — 0.0 mi",
      "Granite slab zone begins — 1.2 mi",
      "Panorama point overlook — 3.4 mi",
      "Dome summit, 8,122 ft — 4.8 mi",
      "West loop descent — 7.5 mi",
    ],
    bestSeason: "May – Oct",
    pace: "~2.3 mph",
    difficultyScore: 60,
    elevationPoints: [15, 22, 30, 40, 52, 63, 72, 80, 85, 88, 86, 80, 72, 60, 42, 22],
  },
  "Highland Moor Path": {
    tags: ["Temperate Rainforest", "Waterfalls", "Mossy Forest", "Wildlife"],
    highlights: [
      "Visitor center start — 0.0 mi",
      "Rainforest grove — 1.1 mi",
      "Hoh River crossing — 2.5 mi",
      "Hidden waterfall vista — 4.0 mi",
      "Turnaround at meadow — 6.4 mi",
    ],
    bestSeason: "Apr – Oct",
    pace: "~2.5 mph",
    difficultyScore: 46,
    elevationPoints: [10, 14, 18, 24, 30, 36, 42, 50, 55, 58, 55, 50, 44, 36, 26, 16],
  },
  "Deadwood Ravine": {
    tags: ["Appalachian Trail", "Creek Crossings", "Backcountry", "Fire Tower"],
    highlights: [
      "NC border trailhead — 0.0 mi",
      "First creek ford — 1.8 mi",
      "Ravine narrows — 4.5 mi",
      "Ridge junction campsite — 9.0 mi",
      "Fire tower summit — 14.2 mi",
    ],
    bestSeason: "Apr – Jun, Sep – Nov",
    pace: "~1.8 mph",
    difficultyScore: 90,
    elevationPoints: [8, 16, 28, 40, 52, 62, 70, 75, 78, 80, 84, 88, 90, 92, 95, 98],
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function ElevationProfile({ points }: { points: number[] }) {
  const W = 280, H = 64, PAD = 4;
  const xs = points.map((_, i) => PAD + (i / (points.length - 1)) * (W - PAD * 2));
  const ys = points.map((p) => H - PAD - (p / 100) * (H - PAD * 2));
  const linePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${xs[xs.length - 1].toFixed(1)},${(H - PAD).toFixed(1)} L${xs[0].toFixed(1)},${(H - PAD).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="elev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#elev-fill)" />
      <path
        d={linePath}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={xs[0].toFixed(1)} cy={ys[0].toFixed(1)} r="3" fill="var(--primary)" />
      <circle
        cx={xs[xs.length - 1].toFixed(1)}
        cy={ys[ys.length - 1].toFixed(1)}
        r="3"
        fill="var(--primary)"
      />
    </svg>
  );
}

// ─── Modal tabs ────────────────────────────────────────────────────────────

type ModalTab = "overview" | "stats" | "highlights";

const TABS: { id: ModalTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "stats", label: "Stats" },
  { id: "highlights", label: "Highlights" },
];

// ─── TrailDetailModal ──────────────────────────────────────────────────────

type Props = {
  trail: Trail;
  onClose: () => void;
};

export default function TrailDetailModal({ trail, onClose }: Props) {
  const [tab, setTab] = useState<ModalTab>("overview");
  const [mounted, setMounted] = useState(false);
  const details = trailDetails[trail.name];
  const cfg = difficultyConfig[trail.difficulty];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${trail.name} details`}
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${
        mounted ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 max-h-[90dvh] ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header: gradient + mountain silhouette ── */}
        <div
          className="relative flex-shrink-0 h-36 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, oklch(0.40 0.21 285) 100%)",
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 144"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M0,144 L0,60 Q70,10 140,55 Q210,100 280,30 Q350,-10 420,50 Q470,90 500,40 L500,144Z"
              fill="white"
              fillOpacity="0.06"
            />
            <path
              d="M0,144 L0,90 Q80,60 170,85 Q260,110 340,60 Q410,20 500,70 L500,144Z"
              fill="white"
              fillOpacity="0.09"
            />
            <path
              d="M0,144 L0,118 Q90,98 200,115 Q310,132 400,98 Q460,74 500,105 L500,144Z"
              fill="white"
              fillOpacity="0.15"
            />
          </svg>
          <div className="pointer-events-none absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10 blur-2xl" />

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.badge}`}>
                {trail.difficulty}
              </span>
              <span className="text-xs text-primary-foreground/70 bg-white/10 px-2 py-1 rounded-full">
                {trail.type}
              </span>
            </div>
            <h2 className="text-xl font-bold text-primary-foreground leading-tight">
              {trail.name}
            </h2>
            <p className="text-xs text-primary-foreground/75 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {trail.location}
            </p>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex-shrink-0 border-b border-border px-1">
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-xs font-semibold tracking-wide transition-colors relative cursor-pointer ${
                  tab === t.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="px-5 py-4 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trail.description}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <MapPin className="w-3.5 h-3.5" />, label: "Distance", value: trail.distance },
                  { icon: <Clock className="w-3.5 h-3.5" />, label: "Duration", value: trail.duration },
                  { icon: <TrendingUp className="w-3.5 h-3.5" />, label: "Elevation", value: trail.elevation },
                  { icon: <Calendar className="w-3.5 h-3.5" />, label: "Completed", value: trail.completedAt },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 bg-muted/50 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-primary shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs font-semibold text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Trail Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {details.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Best Season</p>
                  <p className="text-xs font-semibold text-foreground">{details.bestSeason}</p>
                </div>
                <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Avg Pace</p>
                  <p className="text-xs font-semibold text-foreground">{details.pace}</p>
                </div>
                <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Rating</p>
                  <p className="text-xs font-semibold text-foreground flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {trail.rating}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STATS */}
          {tab === "stats" && (
            <div className="px-5 py-4 flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground">Difficulty Score</p>
                  <span className="text-xs font-bold text-primary">
                    {details.difficultyScore}/100
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                    style={{ width: `${details.difficultyScore}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">Easy</span>
                  <span className="text-[10px] text-muted-foreground">Moderate</span>
                  <span className="text-[10px] text-muted-foreground">Hard</span>
                </div>
              </div>
              {[
                {
                  label: "Distance",
                  value: trail.distance,
                  pct: Math.min(100, (parseFloat(trail.distance) / 10) * 100),
                },
                {
                  label: "Duration",
                  value: trail.duration,
                  pct: Math.min(100, (parseFloat(trail.duration) / 6) * 100),
                },
                {
                  label: "Elevation Gain",
                  value: trail.elevation,
                  pct: Math.min(
                    100,
                    (parseInt(trail.elevation.replace(/,/g, ""), 10) / 3000) * 100
                  ),
                },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xs font-semibold text-foreground">{s.value}</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Elevation Profile</p>
                <div className="bg-muted/50 rounded-xl p-3">
                  <ElevationProfile points={details.elevationPoints} />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">Start</span>
                    <span className="text-[10px] text-muted-foreground">↑ {trail.elevation}</span>
                    <span className="text-[10px] text-muted-foreground">Finish</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Avg Pace", value: details.pace },
                  { label: "Best Season", value: details.bestSeason },
                  { label: "Trail Type", value: trail.type },
                ].map((s) => (
                  <div key={s.label} className="bg-muted/50 rounded-xl px-2 py-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-xs font-semibold text-foreground leading-tight">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HIGHLIGHTS */}
          {tab === "highlights" && (
            <div className="px-5 py-4">
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Key waypoints and landmarks along this trail.
              </p>
              <ol className="relative">
                {details.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 pb-5 last:pb-0 relative">
                    {i < details.highlights.length - 1 && (
                      <span className="absolute left-3.5 top-7 bottom-0 w-px bg-border" />
                    )}
                    <span
                      className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        i === details.highlights.length - 1
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {i === details.highlights.length - 1 ? (
                        <Mountain className="w-3.5 h-3.5" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div className="flex-1 pt-0.5">
                      <p
                        className={`text-xs leading-relaxed ${
                          i === details.highlights.length - 1
                            ? "font-semibold text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {h}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* ── Action footer ── */}
        <div className="flex-shrink-0 border-t border-border px-5 py-3 flex gap-2 bg-card">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
            <Footprints className="w-3.5 h-3.5" /> Log Activity
          </button>
          <button className="flex items-center justify-center gap-1.5 border border-border text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="flex items-center justify-center gap-1.5 border border-border text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground">
            <Bookmark className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
