import {
  LayoutDashboard,
  Mountain,
  Users,
  Home,
  Info,
  Trophy,
  Flag,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const GUEST_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Trails", href: "/trails", icon: Mountain },
  { label: "Events", href: "/events", icon: Flag },
  { label: "Community", href: "/community", icon: Users },
  { label: "About", href: "/about", icon: Info },
];

export const AUTH_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Trails", href: "/trails", icon: Mountain },
  { label: "Events", href: "/events", icon: Flag },
  { label: "Community", href: "/community", icon: Users },
  { label: "Challenges", href: "/challenges", icon: Trophy },
];
