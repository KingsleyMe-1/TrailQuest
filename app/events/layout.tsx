import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming trail running competitions and relive past race results. Register for TrailQuest events.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
