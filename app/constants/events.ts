export type EventStatus = "upcoming" | "past";
export type EventCategory = "5K" | "10K" | "15K" | "25K" | "30K" | "50K" | "Marathon" | "Half Marathon";
export type EventDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Elite";

export interface RaceCategory {
  distance: EventCategory;
  elevation: string;
  cutoff: string;
  price: number;
  spots: number;
  spotsLeft: number;
}

export interface PodiumEntry {
  rank: 1 | 2 | 3;
  name: string;
  time: string;
  category: EventCategory;
}

export interface TrailEvent {
  id: number;
  title: string;
  tagline: string;
  date: string;
  endDate?: string;
  location: string;
  region: string;
  status: EventStatus;
  featured?: boolean;
  difficulty: EventDifficulty;
  terrain: string[];
  highlight: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  categories: RaceCategory[];
  courseFeatures: string[];
  podium?: PodiumEntry[];
  participants?: number;
  totalFinishers?: number;
  description: string;
}

export const EVENTS: TrailEvent[] = [
  {
    id: 1,
    title: "Blue Ridge Ultra 50K",
    tagline: "Conquer the Crest",
    date: "2026-05-17",
    endDate: "2026-05-18",
    location: "Shenandoah Valley, VA",
    region: "Mid-Atlantic",
    status: "upcoming",
    featured: true,
    difficulty: "Elite",
    terrain: ["Alpine", "Ridge", "Forest"],
    highlight: "3,800 ft single‑summit gain",
    accentColor: "text-violet-400",
    gradientFrom: "from-violet-950/80",
    gradientTo: "to-indigo-900/60",
    borderColor: "border-violet-500/30",
    textColor: "text-violet-300",
    description:
      "The Blue Ridge Ultra takes competitors through 50 kilometers of the most scenic ridgeline trails in the eastern United States. Switchback climbs, exposed ridge running, and technical single‑track make this one of the most coveted mid-Atlantic ultras. Aid stations every 8 km ensure you stay fueled across two breathtaking days.",
    categories: [
      { distance: "50K", elevation: "3,800 ft", cutoff: "9 hrs", price: 125, spots: 300, spotsLeft: 47 },
      { distance: "25K", elevation: "1,900 ft", cutoff: "5 hrs", price: 75, spots: 400, spotsLeft: 112 },
    ],
    courseFeatures: [
      "12 aid stations stocked every 8 km",
      "Live GPS tracking for all runners",
      "Technical ridge scramble at km 31",
      "Sunrise start from Skyline Drive",
      "Finisher buckle + custom trail vest",
    ],
  },
  {
    id: 2,
    title: "Summit Circuit Trail Race",
    tagline: "Loop the Peak",
    date: "2026-06-07",
    location: "Rocky Mountain NP, CO",
    region: "Rocky Mountains",
    status: "upcoming",
    difficulty: "Advanced",
    terrain: ["Alpine", "Tundra", "Scree"],
    highlight: "Above 11,000 ft the entire course",
    accentColor: "text-sky-400",
    gradientFrom: "from-sky-950/80",
    gradientTo: "to-cyan-900/60",
    borderColor: "border-sky-500/30",
    textColor: "text-sky-300",
    description:
      "An iconic loop at altitude. The Summit Circuit puts runners on continuous alpine tundra with three technical passes and jaw-dropping 360° vistas. Expect thin air, variable weather, and the most rewarding finish line in trail running.",
    categories: [
      { distance: "25K", elevation: "4,100 ft", cutoff: "6 hrs", price: 95, spots: 250, spotsLeft: 68 },
      { distance: "15K", elevation: "2,200 ft", cutoff: "4 hrs", price: 65, spots: 300, spotsLeft: 134 },
    ],
    courseFeatures: [
      "Three alpine passes above 12,500 ft",
      "Weather contingency route available",
      "Post-race hot soup & mountain lodge access",
      "Mandatory gear check at start",
    ],
  },
  {
    id: 3,
    title: "Firefly Night Run 10K",
    tagline: "Run Under the Stars",
    date: "2026-06-21",
    location: "Great Smoky Mountains, TN",
    region: "Appalachians",
    status: "upcoming",
    difficulty: "Beginner",
    terrain: ["Forest", "Meadow"],
    highlight: "Natural firefly synchronization event",
    accentColor: "text-amber-400",
    gradientFrom: "from-amber-950/80",
    gradientTo: "to-yellow-900/60",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-300",
    description:
      "Timed to coincide with the synchronous firefly emergence in the Smokies, the Firefly Night Run is a magical 10K through glowing forest trails after dark. Headlamps are welcome but the bioluminescent display does most of the lighting. Perfect for first-time trail runners and families.",
    categories: [
      { distance: "10K", elevation: "680 ft", cutoff: "2.5 hrs", price: 45, spots: 500, spotsLeft: 223 },
      { distance: "5K", elevation: "300 ft", cutoff: "1.5 hrs", price: 30, spots: 600, spotsLeft: 341 },
    ],
    courseFeatures: [
      "Headlamp required (rentals available)",
      "Illuminated trail markers every 500 m",
      "Firefly viewing area at km 4 turnaround",
      "Kid-friendly 5K option",
      "Post-race bonfire & s'mores",
    ],
  },
  {
    id: 4,
    title: "Alpine Peaks Marathon",
    tagline: "Where Every Step Counts",
    date: "2026-07-12",
    location: "Cascade Range, WA",
    region: "Pacific Northwest",
    status: "upcoming",
    difficulty: "Advanced",
    terrain: ["Volcanic", "Glacier moraine", "Old-growth forest"],
    highlight: "Glacier moraine crossing at mile 18",
    accentColor: "text-emerald-400",
    gradientFrom: "from-emerald-950/80",
    gradientTo: "to-teal-900/60",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-300",
    description:
      "A full marathon distance across some of the Pacific Northwest's most dramatic volcanic terrain. From lush old-growth forest to stark glacier moraines, the Alpine Peaks Marathon is a study in contrasts — and endurance. A true bucket-list race for serious trail runners.",
    categories: [
      { distance: "Marathon", elevation: "5,600 ft", cutoff: "8 hrs", price: 110, spots: 350, spotsLeft: 89 },
      { distance: "Half Marathon", elevation: "2,800 ft", cutoff: "5 hrs", price: 70, spots: 450, spotsLeft: 167 },
    ],
    courseFeatures: [
      "Glacier moraine crossing with rope assists",
      "Aid stations at miles 6, 12, 18, 22",
      "Stunning Mt. Rainier views throughout",
      "Drop bags allowed at miles 12 & 18",
    ],
  },
  {
    id: 5,
    title: "Ridge to Ridge 25K",
    tagline: "Two Ridges, One Finish Line",
    date: "2026-08-02",
    location: "San Juan Mountains, CO",
    region: "Rocky Mountains",
    status: "upcoming",
    difficulty: "Intermediate",
    terrain: ["Alpine", "Wildflower meadow", "Pine forest"],
    highlight: "Peak wildflower bloom corridor",
    accentColor: "text-rose-400",
    gradientFrom: "from-rose-950/80",
    gradientTo: "to-pink-900/60",
    borderColor: "border-rose-500/30",
    textColor: "text-rose-300",
    description:
      "Connecting two iconic ridges of the San Juans, this 25K is the crown jewel of Colorado's summer trail calendar. The course traverses peak wildflower blooms in late July/early August, and the ridge-to-ridge traverse offers panoramic views that simply can't be captured in photos.",
    categories: [
      { distance: "25K", elevation: "3,200 ft", cutoff: "6 hrs", price: 85, spots: 280, spotsLeft: 155 },
    ],
    courseFeatures: [
      "Peak wildflower-season timing",
      "Exposed ridgeline traverse (weather dependent)",
      "Photography stop at Columbine Meadow",
      "Small-field race (max 280) for intimate experience",
    ],
  },
  {
    id: 6,
    title: "Valley Floor Challenge",
    tagline: "Fast & Flat Never Felt So Wild",
    date: "2026-03-08",
    location: "Yosemite Valley, CA",
    region: "Sierra Nevada",
    status: "past",
    difficulty: "Beginner",
    terrain: ["Valley floor", "River trail", "Meadow"],
    highlight: "Yosemite Falls backdrop at the finish",
    accentColor: "text-teal-400",
    gradientFrom: "from-teal-950/80",
    gradientTo: "to-cyan-900/60",
    borderColor: "border-teal-500/30",
    textColor: "text-teal-300",
    description:
      "An accessible but unforgettable race on the flat valley floor beneath El Capitan and Half Dome. The Valley Floor Challenge is ideal for runners new to trail racing who want a world-class setting without punishing elevation.",
    categories: [
      { distance: "15K", elevation: "420 ft", cutoff: "3 hrs", price: 60, spots: 600, spotsLeft: 0 },
      { distance: "10K", elevation: "210 ft", cutoff: "2 hrs", price: 40, spots: 700, spotsLeft: 0 },
    ],
    courseFeatures: [
      "Flat, runnable course suitable for beginners",
      "Iconic views of El Capitan & Half Dome",
      "Post-race BBQ in Yosemite Valley",
      "National Park entry included in bib",
    ],
    participants: 1180,
    totalFinishers: 1143,
    podium: [
      { rank: 1, name: "Elena Marsh", time: "1:02:14", category: "15K" },
      { rank: 2, name: "David Yuen", time: "1:04:38", category: "15K" },
      { rank: 3, name: "Sofia Brandt", time: "1:06:55", category: "15K" },
    ],
  },
  {
    id: 7,
    title: "Winter Wilderness 15K",
    tagline: "Embrace the Cold",
    date: "2026-01-11",
    location: "Lake Tahoe, NV/CA",
    region: "Sierra Nevada",
    status: "past",
    difficulty: "Intermediate",
    terrain: ["Snow pack", "Pine forest", "Lakeside"],
    highlight: "Frozen Lake Tahoe shoreline segment",
    accentColor: "text-indigo-400",
    gradientFrom: "from-indigo-950/80",
    gradientTo: "to-blue-900/60",
    borderColor: "border-indigo-500/30",
    textColor: "text-indigo-300",
    description:
      "One of the rare winter trail races that embraces the season rather than fighting it. Micro-spikes required, snowshoes optional. The frozen Tahoe shoreline segment is genuinely unlike anything else in trail running.",
    categories: [
      { distance: "15K", elevation: "1,100 ft", cutoff: "3.5 hrs", price: 70, spots: 350, spotsLeft: 0 },
    ],
    courseFeatures: [
      "Micro-spikes required (rentals at start)",
      "Snowshoe-friendly alternate route available",
      "Hot cocoa at aid stations",
      "Frozen lake shore segment (weather permitting)",
    ],
    participants: 312,
    totalFinishers: 298,
    podium: [
      { rank: 1, name: "Marcus Holt", time: "1:24:07", category: "15K" },
      { rank: 2, name: "Priya Nair", time: "1:27:33", category: "15K" },
      { rank: 3, name: "Connor Walsh", time: "1:29:50", category: "15K" },
    ],
  },
  {
    id: 8,
    title: "Cascade Descent 30K",
    tagline: "What Goes Up Must Fly Down",
    date: "2026-02-15",
    location: "Mt. Hood National Forest, OR",
    region: "Pacific Northwest",
    status: "past",
    difficulty: "Advanced",
    terrain: ["Volcanic descent", "Forest single-track"],
    highlight: "5,000 ft of descent in 30K",
    accentColor: "text-orange-400",
    gradientFrom: "from-orange-950/80",
    gradientTo: "to-red-900/60",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-300",
    description:
      "The Cascade Descent is a point-to-point race starting at the Mt. Hood summit trailhead and diving 5,000 feet into the forest below. Quad-burning descents, rooty technical single-track, and a riverside finish make it one of the most memorable races on the West Coast calendar.",
    categories: [
      { distance: "30K", elevation: "5,000 ft descent", cutoff: "6 hrs", price: 90, spots: 400, spotsLeft: 0 },
    ],
    courseFeatures: [
      "Net-downhill point-to-point course",
      "Technical volcanic scree on upper 10K",
      "Rooty single-track middle section",
      "Riverside finish with live music",
    ],
    participants: 388,
    totalFinishers: 362,
    podium: [
      { rank: 1, name: "Alex Rivera", time: "2:41:09", category: "30K" },
      { rank: 2, name: "Yuki Tanaka", time: "2:44:52", category: "30K" },
      { rank: 3, name: "Blake Foster", time: "2:48:15", category: "30K" },
    ],
  },
];

export const EVENT_STATS = {
  totalEvents: 32,
  totalRunners: 18400,
  countriesRepresented: 24,
  milesOfTrail: 6200,
};

export const DIFFICULTY_STYLES: Record<EventDifficulty, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Advanced: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Elite: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};
