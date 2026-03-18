import type { Trail } from "~/components/TrailDetailModal";

export const recentTrails: Trail[] = [
  {
    name: "Pine Ridge Loop",
    location: "Blue Ridge, VA",
    difficulty: "Moderate",
    distance: "5.2 mi",
    rating: 4.7,
    completedAt: "Mar 15, 2026",
    duration: "2h 45m",
    elevation: "820 ft",
    type: "Loop",
    description:
      "A scenic ridge trail through oak and pine forest with panoramic valley views at the summit.",
  },
  {
    name: "Meadow Walk",
    location: "Smoky Mountains, TN",
    difficulty: "Easy",
    distance: "2.4 mi",
    rating: 4.5,
    completedAt: "Mar 10, 2026",
    duration: "1h 10m",
    elevation: "180 ft",
    type: "Out & Back",
    description:
      "A gentle stroll through wildflower meadows alongside a winding creek. Perfect for beginners.",
  },
  {
    name: "Summit Crest Trail",
    location: "Rocky Mountain, CO",
    difficulty: "Hard",
    distance: "8.9 mi",
    rating: 4.9,
    completedAt: "Feb 28, 2026",
    duration: "5h 20m",
    elevation: "2,340 ft",
    type: "Loop",
    description:
      "A challenging high-altitude traverse with exposed ridgeline sections offering 360° summit views.",
  },
];
