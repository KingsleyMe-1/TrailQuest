import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about TrailQuest - the story, the developer, and the technology stack behind the app.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
