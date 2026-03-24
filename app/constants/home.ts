export type HomeDifficulty = "Easy" | "Moderate" | "Hard";

export interface HomeTrail {
  name: string;
  location: string;
  difficulty: HomeDifficulty;
  distance: string;
  rating: number;
}

export const HOME_TRAILS: HomeTrail[] = [
  {
    name: "Pine Ridge Loop",
    location: "Blue Ridge, VA",
    difficulty: "Moderate",
    distance: "5.2 mi",
    rating: 4.7,
  },
  {
    name: "Summit Crest Trail",
    location: "Rocky Mountain, CO",
    difficulty: "Hard",
    distance: "8.9 mi",
    rating: 4.9,
  },
  {
    name: "Meadow Walk",
    location: "Smoky Mountains, TN",
    difficulty: "Easy",
    distance: "2.4 mi",
    rating: 4.5,
  },
];

