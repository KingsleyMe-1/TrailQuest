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
  description: string;
  founded: string;
  totalHikes: number;
  avgDistance: string;
  location: string;
  topTrails: string[];
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
    description:
      "A community of passionate hikers exploring the full length of the Appalachian highlands. From scenic overlooks to challenging ridge traverses, we welcome all skill levels who share a love for the Blue Ridge.",
    founded: "Jan 2021",
    totalHikes: 142,
    avgDistance: "7.4 mi",
    location: "Blue Ridge, VA",
    topTrails: ["Summit Crest Trail", "Pine Ridge Loop", "Ridgeline Traverse"],
  },
  {
    id: 2,
    name: "Dawn Patrol",
    tagline: "Early morning summits & sunrise chasers",
    members: 153,
    category: "Specialty",
    level: "Summit Seekers",
    icon: Flame,
    color: "text-primary bg-primary/10",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    description:
      "We chase sunrises and reach summits before breakfast. If you love watching the world wake up from 4,000 feet, this is your tribe. Early starts, big rewards, and unforgettable mornings.",
    founded: "Jun 2022",
    totalHikes: 87,
    avgDistance: "9.1 mi",
    location: "Asheville, NC",
    topTrails: ["Granite Dome Circuit", "Summit Crest Trail", "Highland Moor Path"],
  },
  {
    id: 3,
    name: "Forest Wanders",
    tagline: "Casual strolls through old-growth forests",
    members: 412,
    category: "Beginner",
    level: "Beginner-Friendly",
    icon: Leaf,
    color: "text-primary bg-primary/10",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
    description:
      "Not every hike needs to be a challenge. We believe in the restorative power of forests — slow, mindful walks through old-growth canopies with plenty of time to stop, breathe, and take it all in.",
    founded: "Mar 2020",
    totalHikes: 203,
    avgDistance: "4.2 mi",
    location: "Green Valley, NC",
    topTrails: ["Meadow Walk", "Lakeside Stroll", "Pine Ridge Loop"],
  },
  {
    id: 4,
    name: "Ultra Distance Crew",
    tagline: "20+ mile adventures for the relentless",
    members: 89,
    category: "Advanced",
    level: "Elite Endurance",
    icon: Zap,
    color: "text-primary bg-primary/10",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    description:
      "For those who think a long hike starts at 20 miles. We push limits, carry heavy packs, and cover terrain most people only dream about. Come prepared — this is not a beginner group.",
    founded: "Sep 2023",
    totalHikes: 51,
    avgDistance: "22.3 mi",
    location: "Spruce Pine, NC",
    topTrails: ["Ridgeline Traverse", "Deadwood Ravine", "Highland Moor Path"],
  },
  {
    id: 5,
    name: "Weekend Warriors",
    tagline: "Making the most of Saturday & Sunday",
    members: 631,
    category: "General",
    level: "Casual Adventurers",
    icon: Activity,
    color: "text-primary bg-primary/10",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80",
    description:
      "Working Monday to Friday so we can crush trails on Saturday and Sunday. We do it all — summits, loops, waterfalls — as long as it fits in a weekend. All fitness levels genuinely welcome.",
    founded: "Apr 2021",
    totalHikes: 318,
    avgDistance: "6.8 mi",
    location: "Charlotte, NC",
    topTrails: ["Canyon Falls Path", "Summit Crest Trail", "Meadow Walk"],
  },
  {
    id: 6,
    name: "Trail Photographers",
    tagline: "Capturing landscapes one step at a time",
    members: 198,
    category: "Specialty",
    level: "Leisurely Pace",
    icon: Mountain,
    color: "text-primary bg-primary/10",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
    description:
      "We hike with cameras as much as boots. Golden hour chases, macro wildflower shots, misty valley panoramas — we help you see trails as art. Any camera from phone to mirrorless is welcome.",
    founded: "Aug 2022",
    totalHikes: 94,
    avgDistance: "5.5 mi",
    location: "Asheville, NC",
    topTrails: ["Granite Dome Circuit", "Canyon Falls Path", "Lakeside Stroll"],
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
  Easy: "text-muted-foreground bg-muted border-border",
  Moderate: "text-primary bg-primary/10 border-primary/20",
  Hard: "text-primary bg-primary/20 border-primary/30",
};

export const COMMUNITY_GROUP_LEVEL_STYLES: Record<string, string> = {
  "Beginner-Friendly": "text-white bg-slate-600 border-slate-500",
  "Leisurely Pace": "text-white bg-slate-600 border-slate-500",
  "All Levels Welcome": "text-white bg-primary border-primary",
  "Casual Adventurers": "text-white bg-primary border-primary",
  "Summit Seekers": "text-white bg-primary border-primary",
  "Elite Endurance": "text-white bg-primary border-primary",
};
