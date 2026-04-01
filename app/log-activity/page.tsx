import type { Metadata } from "next";
import { Suspense } from "react";
import LogActivityPage from "./LogActivityPage";

export const metadata: Metadata = {
  title: "Log Activity",
  description: "Track your hike in real time.",
  robots: { index: false },
};

export default function LogActivity() {
  return (
    <Suspense>
      <LogActivityPage />
    </Suspense>
  );
}
