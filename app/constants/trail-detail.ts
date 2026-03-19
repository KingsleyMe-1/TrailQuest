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

export type ModalTab = "overview" | "stats" | "highlights";

export type TrailDetail = {
  tags: string[];
  highlights: string[];
  bestSeason: string;
  pace: string;
  difficultyScore: number;
  elevationPoints: number[];
};

export const TRAIL_DIFFICULTY_CONFIG: Record<
  Difficulty,
  { bar: string; badge: string }
> = {
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

export const TRAIL_DETAILS: Record<string, TrailDetail> = {
  "Pine Ridge Loop": {
    tags: ["Oak Forest", "Ridge Walk", "Valley Views", "Wildlife"],
    highlights: [
      "Trailhead & parking area - 0.0 mi",
      "Pine canopy switchbacks begin - 0.8 mi",
      "First ridge viewpoint - 2.1 mi",
      "Summit overlook, 180 deg panorama - 3.0 mi",
      "Return via south loop - 5.2 mi",
    ],
    bestSeason: "Apr - Oct",
    pace: "~2.8 mph",
    difficultyScore: 52,
    elevationPoints: [10, 18, 28, 40, 55, 68, 78, 82, 80, 73, 60, 46, 33, 22, 14, 10],
  },
  "Meadow Walk": {
    tags: ["Wildflowers", "Creekside", "Family Friendly", "Birding"],
    highlights: [
      "Wildflower meadow entrance - 0.0 mi",
      "Creek crossing footbridge - 0.7 mi",
      "Beaver pond overlook - 1.2 mi",
      "Turnaround bench & meadow views - 2.4 mi",
    ],
    bestSeason: "May - Sep",
    pace: "~2.1 mph",
    difficultyScore: 18,
    elevationPoints: [12, 14, 16, 18, 20, 22, 24, 26, 25, 24, 22, 20, 18, 16, 14, 12],
  },
  "Summit Crest Trail": {
    tags: ["Alpine", "Exposed Ridge", "360 deg Views", "Technical"],
    highlights: [
      "Trailhead at Rocky Mtn NP gate - 0.0 mi",
      "Aspen grove & krummholz zone - 2.0 mi",
      "Tundra crossing, treeline ends - 3.5 mi",
      "False summit, exposed ridge - 5.8 mi",
      "True summit 14,259 ft, 360 deg view - 8.9 mi",
    ],
    bestSeason: "Jul - Sep",
    pace: "~1.7 mph",
    difficultyScore: 88,
    elevationPoints: [5, 12, 20, 30, 40, 52, 62, 70, 76, 82, 86, 90, 93, 95, 97, 99],
  },
  "Canyon Falls Path": {
    tags: ["Waterfall", "Canyon Views", "Desert Flora", "Family Friendly"],
    highlights: [
      "Trailhead parking area - 0.0 mi",
      "First canyon overlook - 0.6 mi",
      "Hidden alcove rest stop - 1.4 mi",
      "Lower canyon falls viewpoint - 2.3 mi",
      "Upper falls turnaround - 3.1 mi",
    ],
    bestSeason: "Mar - May, Sep - Nov",
    pace: "~2.4 mph",
    difficultyScore: 22,
    elevationPoints: [20, 22, 24, 28, 32, 36, 38, 42, 46, 52, 58, 64, 68, 70, 72, 74],
  },
  "Ridgeline Traverse": {
    tags: ["Volcanic Ridge", "Old-Growth Cedar", "Alpine Lakes", "Remote"],
    highlights: [
      "Cascade Pass trailhead - 0.0 mi",
      "Old-growth cedar grove - 1.5 mi",
      "First ridge panorama - 3.8 mi",
      "Hidden alpine lake camp - 7.0 mi",
      "North peak summit - 11.2 mi",
    ],
    bestSeason: "Jul - Sep",
    pace: "~1.9 mph",
    difficultyScore: 82,
    elevationPoints: [8, 15, 24, 35, 46, 55, 63, 70, 76, 80, 85, 88, 91, 94, 96, 98],
  },
  "Lakeside Stroll": {
    tags: ["Lake Views", "Pine Forest", "Birding", "Sunset"],
    highlights: [
      "Marina trailhead - 0.0 mi",
      "Emerald Cove overlook - 0.8 mi",
      "Sandy beach rest area - 1.7 mi",
      "Bobcat meadow - 2.8 mi",
      "Return to marina - 4.0 mi",
    ],
    bestSeason: "Year Round",
    pace: "~2.9 mph",
    difficultyScore: 14,
    elevationPoints: [12, 13, 14, 13, 15, 16, 15, 14, 15, 16, 17, 16, 15, 14, 13, 12],
  },
  "Granite Dome Circuit": {
    tags: ["Granite Slabs", "Valley Views", "Rock Climbing", "Wildflowers"],
    highlights: [
      "Valley floor trailhead - 0.0 mi",
      "Granite slab zone begins - 1.2 mi",
      "Panorama point overlook - 3.4 mi",
      "Dome summit, 8,122 ft - 4.8 mi",
      "West loop descent - 7.5 mi",
    ],
    bestSeason: "May - Oct",
    pace: "~2.3 mph",
    difficultyScore: 60,
    elevationPoints: [15, 22, 30, 40, 52, 63, 72, 80, 85, 88, 86, 80, 72, 60, 42, 22],
  },
  "Highland Moor Path": {
    tags: ["Temperate Rainforest", "Waterfalls", "Mossy Forest", "Wildlife"],
    highlights: [
      "Visitor center start - 0.0 mi",
      "Rainforest grove - 1.1 mi",
      "Hoh River crossing - 2.5 mi",
      "Hidden waterfall vista - 4.0 mi",
      "Turnaround at meadow - 6.4 mi",
    ],
    bestSeason: "Apr - Oct",
    pace: "~2.5 mph",
    difficultyScore: 46,
    elevationPoints: [10, 14, 18, 24, 30, 36, 42, 50, 55, 58, 55, 50, 44, 36, 26, 16],
  },
  "Deadwood Ravine": {
    tags: ["Appalachian Trail", "Creek Crossings", "Backcountry", "Fire Tower"],
    highlights: [
      "NC border trailhead - 0.0 mi",
      "First creek ford - 1.8 mi",
      "Ravine narrows - 4.5 mi",
      "Ridge junction campsite - 9.0 mi",
      "Fire tower summit - 14.2 mi",
    ],
    bestSeason: "Apr - Jun, Sep - Nov",
    pace: "~1.8 mph",
    difficultyScore: 90,
    elevationPoints: [8, 16, 28, 40, 52, 62, 70, 75, 78, 80, 84, 88, 90, 92, 95, 98],
  },
};

export const TRAIL_DETAIL_TABS: { id: ModalTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "stats", label: "Stats" },
  { id: "highlights", label: "Highlights" },
];
