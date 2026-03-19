import { useState, useMemo } from "react";
import type { Route } from "./+types/challenges";
import type { User } from "@supabase/supabase-js";
import {
  LayoutGrid,
  Zap,
  Plus,
  CheckCircle2,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import ChallengesHero from "~/components/challenges/ChallengesHero";
import ChallengeCard from "~/components/challenges/ChallengeCard";
import ChallengeDetailModal from "~/components/challenges/ChallengeDetailModal";
import SeasonalSpotlight from "~/components/challenges/SeasonalSpotlight";
import {
  CHALLENGES,
  CHALLENGE_STATS,
  CHALLENGE_LEADERBOARD,
  CHALLENGE_FRIENDS_LEADERBOARD,
  type Challenge,
  type ChallengeStatus,
} from "~/constants/challenges";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Challenges | TrailQuest" },
    {
      name: "description",
      content:
        "Track your hiking challenges, earn badges, and climb the leaderboard.",
    },
  ];
}

type FilterTab = "all" | "active" | "available" | "completed" | "seasonal";

const FILTER_TABS: { key: FilterTab; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "active", label: "Active", icon: Zap },
  { key: "available", label: "Available", icon: Plus },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
  { key: "seasonal", label: "Seasonal", icon: Sparkles },
];

const EMPTY_STATE: Record<FilterTab, { title: string; description: string }> = {
  all: {
    title: "No challenges found",
    description: "Something went wrong. Try refreshing the page.",
  },
  active: {
    title: "No active challenges",
    description: "Pick one from the available tab to start your journey!",
  },
  available: {
    title: "You're fully committed!",
    description: "You're already in all available challenges. Nice work!",
  },
  completed: {
    title: "No completed challenges yet",
    description: "Complete your first challenge to see it here.",
  },
  seasonal: {
    title: "No seasonal challenges right now",
    description:
      "Check back soon — seasonal events come and go with the hiking calendar.",
  },
};

function ChallengesPage({ user }: { user: User }) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  const [activeChallengeIds, setActiveChallengeIds] = useState<Set<number>>(
    () => new Set(CHALLENGES.filter((c) => c.status === "active").map((c) => c.id))
  );

  const challenges = useMemo(
    () =>
      CHALLENGES.map((c): Challenge => ({
        ...c,
        status: ((): ChallengeStatus => {
          if (c.status === "completed" || c.status === "locked") return c.status;
          return activeChallengeIds.has(c.id) ? "active" : "available";
        })(),
      })),
    [activeChallengeIds]
  );

  function handleStart(id: number) {
    setActiveChallengeIds((prev) => new Set(prev).add(id));
  }

  function handleAbandon(id: number) {
    setActiveChallengeIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  const filteredChallenges = useMemo(() => {
    if (filter === "all") return challenges;
    if (filter === "seasonal") return challenges.filter((c) => c.seasonal);
    return challenges.filter((c) => c.status === filter);
  }, [challenges, filter]);

  const seasonalChallenge = useMemo(
    () => challenges.find((c) => c.seasonal && c.status === "active") ?? null,
    [challenges]
  );

  const resolvedSelectedChallenge = useMemo(
    () =>
      selectedChallenge
        ? challenges.find((c) => c.id === selectedChallenge.id) ?? null
        : null,
    [selectedChallenge, challenges]
  );

  const counts = useMemo(
    () => ({
      all: challenges.length,
      active: challenges.filter((c) => c.status === "active").length,
      available: challenges.filter((c) => c.status === "available").length,
      completed: challenges.filter((c) => c.status === "completed").length,
      seasonal: challenges.filter((c) => c.seasonal).length,
    }),
    [challenges]
  );

  const emptyState = EMPTY_STATE[filter];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar activePath="/challenges" user={user} />

      <main className="flex-1">
        <ChallengesHero user={user} stats={CHALLENGE_STATS} />

        {seasonalChallenge && (
          <SeasonalSpotlight
            challenge={seasonalChallenge}
            onViewDetail={setSelectedChallenge}
          />
        )}

        <div className="sticky top-[57px] z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {FILTER_TABS.map(({ key, label, icon: Icon }) => {
                const isActive = filter === key;
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {counts[key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {filteredChallenges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">
                {emptyState.title}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {emptyState.description}
              </p>
              {filter === "active" && (
                <button
                  onClick={() => setFilter("available")}
                  className="mt-4 text-sm font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
                >
                  Browse available challenges →
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onViewDetail={setSelectedChallenge}
                  onStart={handleStart}
                  onAbandon={handleAbandon}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ChallengeDetailModal
        challenge={resolvedSelectedChallenge}
        isOpen={resolvedSelectedChallenge !== null}
        onClose={() => setSelectedChallenge(null)}
        communityLeaderboard={
          resolvedSelectedChallenge
            ? (CHALLENGE_LEADERBOARD[resolvedSelectedChallenge.id] ?? [])
            : []
        }
        friendsLeaderboard={
          resolvedSelectedChallenge
            ? (CHALLENGE_FRIENDS_LEADERBOARD[resolvedSelectedChallenge.id] ?? [])
            : []
        }
      />
    </div>
  );
}

export default function Challenges() {
  return (
    <ProtectedRoute>
      {(user) => <ChallengesPage user={user} />}
    </ProtectedRoute>
  );
}
