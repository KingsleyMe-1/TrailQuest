import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Track your hiking challenges, earn badges, and climb the leaderboard.",
  robots: { index: false },
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
