import { useState } from "react";
import type { Route } from "./+types/dashboard";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import DashboardHero from "~/components/dashboard/DashboardHero";
import StatsGrid from "~/components/dashboard/StatsGrid";
import RecentTrails from "~/components/dashboard/RecentTrails";
import WeeklyGoals from "~/components/dashboard/WeeklyGoals";
import BadgesCard from "~/components/dashboard/BadgesCard";
import NextAdventureCTA from "~/components/dashboard/NextAdventureCTA";
import CustomTrailModal from "~/components/dashboard/CustomTrailModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - TrailQuest" },
    {
      name: "description",
      content:
        "Your personal TrailQuest dashboard — track progress, revisit trails, and plan your next adventure.",
    },
  ];
}

export default function Dashboard() {
  const [customTrailOpen, setCustomTrailOpen] = useState(false);

  return (
    <ProtectedRoute>
      {(user) => (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
          <CustomTrailModal
            isOpen={customTrailOpen}
            onClose={() => setCustomTrailOpen(false)}
          />
          <Navbar activePath="/dashboard" user={user} />

          <main className="flex-1">
            <DashboardHero user={user} onCustomTrail={() => setCustomTrailOpen(true)} />

            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
              <StatsGrid />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <section className="lg:col-span-3">
                  <RecentTrails />
                </section>

                <aside className="lg:col-span-2 flex flex-col gap-6">
                  <WeeklyGoals />
                  <BadgesCard />
                  <NextAdventureCTA />
                </aside>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
}

