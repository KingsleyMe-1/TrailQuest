export type DifficultyFilter = "All" | "Easy" | "Moderate" | "Hard";
export type TypeFilter = "All" | "Loop" | "Out & Back" | "Point to Point";
export type SortKey = "rating" | "distance" | "name";

export const DIFFICULTY_FILTERS: DifficultyFilter[] = [
  "All",
  "Easy",
  "Moderate",
  "Hard",
];

export const TYPE_FILTERS: TypeFilter[] = [
  "All",
  "Loop",
  "Out & Back",
  "Point to Point",
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating", label: "Top Rated" },
  { value: "distance", label: "Distance" },
  { value: "name", label: "Name" },
];

export const TRAIL_DIFFICULTY_BORDER: Record<string, string> = {
  Easy: "border-l-emerald-500",
  Moderate: "border-l-primary",
  Hard: "border-l-rose-500",
};

export const TRAIL_CARD_IMAGES: Record<string, string> = {
  "Pine Ridge Loop":
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
  "Summit Crest Trail":
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  "Meadow Walk":
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
  "Canyon Falls Path":
    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80",
  "Ridgeline Traverse":
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
  "Lakeside Stroll":
    "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80",
  "Granite Dome Circuit":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80",
  "Highland Moor Path":
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
  "Deadwood Ravine":
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
};
