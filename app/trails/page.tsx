import type { Metadata } from "next";
import { Suspense } from "react";
import TrailsPage from "./TrailsPage";

export const metadata: Metadata = {
  title: "Explore Trails",
  description:
    "Browse and discover hiking trails. Filter by difficulty, type, and distance.",
};

export default function Trails() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TrailsPage />
    </Suspense>
  );
}
