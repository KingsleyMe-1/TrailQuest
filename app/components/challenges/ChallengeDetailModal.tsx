import { useState, useEffect } from "react";
import { X, CheckCircle2, ArrowRight, Users, MapPin } from "lucide-react";
import { Link } from "react-router";
import type {
  Challenge,
  ChallengeLeaderEntry,
} from "~/constants/challenges";
import {
  CHALLENGE_TIER_CONFIG,
  CHALLENGE_TYPE_CONFIG,
} from "~/constants/challenges";
import { allTrails } from "~/constants/trails";
import { TRAIL_CARD_IMAGES } from "~/constants/trails-page";

type ModalTab = "overview" | "progress" | "leaderboard";

function LeaderboardRow({
  entry,
  unit,
  isYou,
}: {
  entry: ChallengeLeaderEntry;
  unit: string;
  isYou: boolean;
}) {
  const tierLabel = entry.tier ? CHALLENGE_TIER_CONFIG[entry.tier] : null;
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
        isYou ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
      }`}
    >
      <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
        {entry.rank}
      </span>
      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-secondary-foreground shrink-0">
        {entry.avatarSeed.slice(0, 2)}
      </div>
      <span
        className={`text-xs font-semibold flex-1 ${
          isYou ? "text-primary" : "text-foreground"
        }`}
      >
        {isYou ? "YOU" : entry.name}
      </span>
      {tierLabel && (
        <span className={`text-[10px] font-bold ${tierLabel.color}`}>
          {entry.tier === "gold"
            ? "🥇"
            : entry.tier === "silver"
            ? "🥈"
            : "🥉"}
        </span>
      )}
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">
        {entry.progress} {unit}
      </span>
    </div>
  );
}

interface ChallengeDetailModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  communityLeaderboard: ChallengeLeaderEntry[];
  friendsLeaderboard: ChallengeLeaderEntry[];
}

export default function ChallengeDetailModal({
  challenge,
  isOpen,
  onClose,
  communityLeaderboard,
  friendsLeaderboard,
}: ChallengeDetailModalProps) {
  const [tab, setTab] = useState<ModalTab>("overview");
  const [mounted, setMounted] = useState(false);
  const [leaderboardScope, setLeaderboardScope] = useState<
    "community" | "friends"
  >("community");

  useEffect(() => {
    if (!isOpen) {
      setMounted(false);
      return;
    }
    const frame = requestAnimationFrame(() => setMounted(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setTab("overview");
    setLeaderboardScope("community");
  }, [challenge?.id]);

  if (!isOpen || !challenge) return null;

  const pct =
    challenge.goal > 0
      ? Math.min(Math.round((challenge.current / challenge.goal) * 100), 100)
      : 0;

  const typeConfig = CHALLENGE_TYPE_CONFIG[challenge.type];
  const Icon = challenge.icon;
  const BadgeRewardIcon = challenge.badgeIcon;
  const recommendedTrailObjects = allTrails.filter((t) =>
    challenge.recommendedTrails.includes(t.name)
  );

  const tabs: { id: ModalTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "progress", label: "Progress" },
    { id: "leaderboard", label: "Leaderboard" },
  ];

  const activeLeaderboard =
    leaderboardScope === "community" ? communityLeaderboard : friendsLeaderboard;

  const milestoneValues =
    challenge.type === "streak"
      ? Array.from({ length: challenge.goal }, (_, i) => i + 1)
      : [
          Math.round(challenge.goal * 0.25),
          Math.round(challenge.goal * 0.5),
          Math.round(challenge.goal * 0.75),
          challenge.goal,
        ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${challenge.title} details`}
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${
        mounted ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 max-h-[90dvh] ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative flex-shrink-0 h-36 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, oklch(0.40 0.21 285) 100%)",
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 144"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M0,144 L0,60 Q70,10 140,55 Q210,100 280,30 Q350,-10 420,50 Q470,90 500,40 L500,144Z"
              fill="white"
              fillOpacity="0.06"
            />
            <path
              d="M0,144 L0,90 Q80,60 170,85 Q260,110 340,60 Q410,20 500,70 L500,144Z"
              fill="white"
              fillOpacity="0.09"
            />
          </svg>
          <div className="pointer-events-none absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs text-primary-foreground/70 bg-white/10 px-2 py-1 rounded-full">
                {typeConfig.label}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  challenge.difficulty === "Easy"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : challenge.difficulty === "Hard"
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-white/10 text-primary-foreground/70"
                }`}
              >
                {challenge.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-bold text-primary-foreground leading-tight">
              {challenge.title}
            </h2>
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-border px-1">
          <div className="flex">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-xs font-semibold tracking-wide transition-colors relative cursor-pointer ${
                  tab === t.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {tab === "overview" && (
            <div className="px-5 py-4 flex flex-col gap-5">
              <div>
                <p className="text-xs font-semibold text-foreground mb-1.5">
                  About this Challenge
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-2">
                  💡 Tips for Success
                </p>
                <ul className="flex flex-col gap-2">
                  {challenge.highlights.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                  challenge.status === "completed"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-amber-500/10 border-amber-500/20"
                }`}
              >
                <BadgeRewardIcon
                  className={`w-5 h-5 shrink-0 ${
                    challenge.status === "completed"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {challenge.status === "completed"
                      ? `Earned: ${challenge.badgeLabel}`
                      : `Earn: ${challenge.badgeLabel}`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Unlocked at Gold tier (100%)
                  </p>
                </div>
                {challenge.status === "completed" && (
                  <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500 shrink-0" />
                )}
              </div>

              {recommendedTrailObjects.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    Recommended Trails
                  </p>
                  <div className="flex flex-col gap-2">
                    {recommendedTrailObjects.map((trail) => {
                      const img = TRAIL_CARD_IMAGES[trail.name];
                      return (
                        <Link
                          key={trail.name}
                          to="/trails"
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-accent/50 transition-all group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                            {img ? (
                              <img
                                src={img}
                                alt={trail.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {trail.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {trail.location} · {trail.distance}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "progress" && (
            <div className="px-5 py-4 flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground">
                    Overall Progress
                  </p>
                  <span className="text-xs font-bold text-primary">{pct}%</span>
                </div>
                <div className="h-3 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      challenge.current >= challenge.tiers.gold
                        ? "bg-yellow-400"
                        : challenge.current >= challenge.tiers.silver
                        ? "bg-slate-400"
                        : challenge.current >= challenge.tiers.bronze
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {challenge.current} / {challenge.goal} {challenge.unit}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-3">
                  Milestones
                </p>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(
                      milestoneValues.length,
                      6
                    )}, minmax(0, 1fr))`,
                  }}
                >
                  {milestoneValues.map((val, i) => {
                    const reached = challenge.current >= val;
                    const label =
                      challenge.type === "streak"
                        ? `Wk ${i + 1}`
                        : `${val} ${challenge.unit}`;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                            reached
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-dashed border-border text-muted-foreground"
                          }`}
                        >
                          {reached ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-[10px] font-bold">{i + 1}</span>
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground text-center leading-tight">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Tiers</p>
                <div className="flex flex-col gap-2">
                  {(["bronze", "silver", "gold"] as const).map((tier) => {
                    const t = CHALLENGE_TIER_CONFIG[tier];
                    const thresholdPct = t.minPct;
                    const thresholdVal = Math.round(
                      (thresholdPct / 100) * challenge.goal
                    );
                    const earned = pct >= thresholdPct;
                    const emoji =
                      tier === "bronze" ? "🥉" : tier === "silver" ? "🥈" : "🥇";
                    const remaining = Math.max(0, thresholdVal - challenge.current);
                    return (
                      <div
                        key={tier}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                          earned ? `${t.bg} ${t.border}` : "border-border bg-muted/30"
                        }`}
                      >
                        <span className="text-base">{emoji}</span>
                        <div className="flex-1">
                          <p
                            className={`text-xs font-bold ${
                              earned ? t.color : "text-muted-foreground"
                            }`}
                          >
                            {t.label} ({thresholdPct}%)
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {earned
                              ? "Earned ✓"
                              : `${remaining} ${challenge.unit} to go`}
                          </p>
                        </div>
                        {earned && (
                          <CheckCircle2 className={`w-4 h-4 ${t.color} shrink-0`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                  challenge.status === "completed"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-amber-500/10 border-amber-500/20"
                }`}
              >
                <BadgeRewardIcon
                  className={`w-5 h-5 shrink-0 ${
                    challenge.status === "completed"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    🏅{" "}
                    {challenge.status === "completed"
                      ? `Earned: ${challenge.badgeLabel}`
                      : `Earn: ${challenge.badgeLabel}`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Unlocked at Gold tier
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === "leaderboard" && (
            <div className="px-5 py-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">Rankings</p>
                <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
                  {(["community", "friends"] as const).map((scope) => (
                    <button
                      key={scope}
                      onClick={() => setLeaderboardScope(scope)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize ${
                        leaderboardScope === scope
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      {scope === "community" ? "Community" : "Friends"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {activeLeaderboard.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No entries yet — be the first!
                  </p>
                ) : (
                  activeLeaderboard.map((entry) => (
                    <LeaderboardRow
                      key={entry.rank}
                      entry={entry}
                      unit={challenge.unit}
                      isYou={entry.avatarSeed === "YOU"}
                    />
                  ))
                )}
              </div>

              {leaderboardScope === "community" && activeLeaderboard.length > 0 && (
                <p className="text-[11px] text-muted-foreground text-center pt-1">
                  Showing top {activeLeaderboard.length} community members
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-border px-5 py-3 flex gap-2 bg-card">
          {challenge.status === "active" && (
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Keep Hiking
            </button>
          )}
          {challenge.status === "available" && (
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Start this Challenge
            </button>
          )}
          {challenge.status === "completed" && (
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed!
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 border border-border text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
