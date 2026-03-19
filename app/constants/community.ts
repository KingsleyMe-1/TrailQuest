import {
  Mountain,
  Flame,
  Leaf,
  Zap,
  Activity,
  type LucideIcon,
} from "lucide-react";

export interface CommunityGroup {
  id: number;
  name: string;
  tagline: string;
  members: number;
  category: string;
  level: string;
  icon: LucideIcon;
  color: string;
  image: string;
}

export interface CommunityActivity {
  id: number;
  group: string;
  action: string;
  trail: string;
  detail: string;
  time: string;
  avatarSeeds: string[];
  photos: string[];
}

export interface CommunityAnnouncement {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  spots: number;
  totalSpots: number;
  group: string;
  tag: string;
}

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 1,
    name: "Blue Ridge Hikers",
    tagline: "Exploring the Appalachian highlands together",
    members: 284,
    category: "Regional",
    level: "All Levels Welcome",
    icon: Mountain,
    color: "text-primary bg-primary/10",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Dawn Patrol",
    tagline: "Early morning summits & sunrise chasers",
    members: 153,
    category: "Specialty",
    level: "Summit Seekers",
    icon: Flame,
    color: "text-rose-500 bg-rose-500/10",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Forest Wanders",
    tagline: "Casual strolls through old-growth forests",
    members: 412,
    category: "Beginner",
    level: "Beginner-Friendly",
    icon: Leaf,
    color: "text-emerald-500 bg-emerald-500/10",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Ultra Distance Crew",
    tagline: "20+ mile adventures for the relentless",
    members: 89,
    category: "Advanced",
    level: "Elite Endurance",
    icon: Zap,
    color: "text-amber-500 bg-amber-500/10",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Weekend Warriors",
    tagline: "Making the most of Saturday & Sunday",
    members: 631,
    category: "General",
    level: "Casual Adventurers",
    icon: Activity,
    color: "text-sky-500 bg-sky-500/10",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Trail Photographers",
    tagline: "Capturing landscapes one step at a time",
    members: 198,
    category: "Specialty",
    level: "Leisurely Pace",
    icon: Mountain,
    color: "text-violet-500 bg-violet-500/10",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
  },
];

export const COMMUNITY_ACTIVITIES: CommunityActivity[] = [
  {
    id: 1,
    group: "Blue Ridge Hikers",
    action: "completed a group hike",
    trail: "Summit Crest Trail",
    detail: "14 members · 8.9 mi",
    time: "2 hours ago",
    avatarSeeds: ["A", "B", "C"],
    photos: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 2,
    group: "Forest Wanders",
    action: "posted a new meetup",
    trail: "Lakeside Stroll",
    detail: "Sat, Mar 21 · 4.0 mi",
    time: "Yesterday",
    avatarSeeds: ["D", "E"],
    photos: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 3,
    group: "Dawn Patrol",
    action: "shared a trip report",
    trail: "Granite Dome Circuit",
    detail: "7.5 mi · 2,100 ft gain",
    time: "2 days ago",
    avatarSeeds: ["F", "G", "H"],
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 4,
    group: "Weekend Warriors",
    action: "organised a trail clean-up",
    trail: "Pine Ridge Loop",
    detail: "23 volunteers · 5.2 mi",
    time: "3 days ago",
    avatarSeeds: ["I", "J"],
    photos: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

export const COMMUNITY_ANNOUNCEMENTS: CommunityAnnouncement[] = [
  {
    id: 1,
    title: "Spring Sunrise Summit",
    description:
      "Join us for the annual spring sunrise hike up Summit Crest Trail. Hot coffee provided at the trailhead.",
    date: "Sat, Mar 28, 2026",
    time: "5:30 AM",
    location: "Blue Ridge, VA",
    difficulty: "Hard",
    spots: 18,
    totalSpots: 25,
    group: "Dawn Patrol",
    tag: "Featured",
  },
  {
    id: 2,
    title: "Family Meadow Walk",
    description:
      "A relaxed outing for all skill levels. Kids and dogs welcome! We'll stop at the wildflower fields.",
    date: "Sun, Mar 29, 2026",
    time: "9:00 AM",
    location: "Green Valley, NC",
    difficulty: "Easy",
    spots: 30,
    totalSpots: 40,
    group: "Forest Wanders",
    tag: "Family-Friendly",
  },
  {
    id: 3,
    title: "High Country Challenge",
    description:
      "A strenuous 11-mile ridge traverse with 3,400 ft of elevation gain. Full-day commitment required.",
    date: "Sat, Apr 4, 2026",
    time: "6:00 AM",
    location: "Spruce Pine, NC",
    difficulty: "Hard",
    spots: 7,
    totalSpots: 12,
    group: "Ultra Distance Crew",
    tag: "Limited Spots",
  },
  {
    id: 4,
    title: "Photo Hike - Golden Hour",
    description:
      "Capture stunning fall light along the Granite Dome Circuit. Tripods and wide-angle lenses recommended.",
    date: "Sun, Apr 5, 2026",
    time: "4:45 PM",
    location: "Asheville, NC",
    difficulty: "Moderate",
    spots: 14,
    totalSpots: 16,
    group: "Trail Photographers",
    tag: "New",
  },
];

export const COMMUNITY_DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  Moderate: "text-primary bg-primary/10 border-primary/20",
  Hard: "text-rose-500 bg-rose-500/10 border-rose-500/20",
};

export const COMMUNITY_GROUP_LEVEL_STYLES: Record<string, string> = {
  "Beginner-Friendly": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  "Leisurely Pace": "text-teal-500 bg-teal-500/10 border-teal-500/20",
  "All Levels Welcome": "text-sky-500 bg-sky-500/10 border-sky-500/20",
  "Casual Adventurers": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Summit Seekers": "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "Elite Endurance": "text-rose-500 bg-rose-500/10 border-rose-500/20",
};
