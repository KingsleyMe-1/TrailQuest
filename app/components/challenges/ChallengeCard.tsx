import { Lock, CheckCircle2, ArrowRight, Plus } from "lucide-react";
import type { Challenge } from "~/constants/challenges";
import {
  CHALLENGE_TIER_CONFIG,
  CHALLENGE_TYPE_CONFIG,
} from "~/constants/challenges";

function getDaysLeft(endsAt: string): number | null {
  if (!endsAt) return null;
  const end = new Date(endsAt);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onViewDetail: (challenge: Challenge) => void;
  onStart: (id: number) => void;
  onAbandon: (id: number) => void;
}

export default function ChallengeCard({
  challenge,
  onViewDetail,
  onStart,
  onAbandon,
}: ChallengeCardProps) {
  const pct =
    challenge.goal > 0
      ? Math.min(Math.round((challenge.current / challenge.goal) * 100), 100)
      : 0;

  const barColor = challenge.progressColor ?? "bg-primary";

  const daysLeft = challenge.seasonal ? getDaysLeft(challenge.endsAt) : null;
  const isLocked = challenge.status === "locked";
  const isCompleted = challenge.status === "completed";
  const isActive = challenge.status === "active";
  const isAvailable = challenge.status === "available";

  const Icon = challenge.icon;
  const BadgeIcon = challenge.badgeIcon;
  const typeConfig = CHALLENGE_TYPE_CONFIG[challenge.type];

  const difficultyBadge = {
    Easy: "bg-muted text-muted-foreground",
    Moderate: "bg-primary/10 text-primary",
    Hard: "bg-primary/20 text-primary",
  }[challenge.difficulty];

  return (
    <div
      className={`relative w-full max-w-md mx-auto sm:max-w-none sm:mx-0 rounded-2xl border bg-card flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 ${
        isCompleted
          ? "border-primary/25"
          : isLocked
          ? "border-border opacity-60"
          : challenge.border
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-background/60 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-center px-6">
            Complete a Hard trail to unlock
          </p>
        </div>
      )}

      <div className="p-5 flex flex-col gap-4 flex-1 items-center sm:items-stretch">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-3 w-full text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${challenge.bg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-5 h-5 ${challenge.color}`} />
            </div>
            <div>
              <h3 className="text-lg sm:text-base font-bold text-foreground leading-tight">
                {challenge.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {typeConfig.label}
                </span>
                <span className="text-muted-foreground/40 text-xs">·</span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${difficultyBadge}`}
                >
                  {challenge.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 shrink-0">
            {daysLeft !== null && daysLeft > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border whitespace-nowrap">
                {daysLeft}d left
              </span>
            )}
            {isCompleted && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-primary" /> Completed
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 text-center sm:text-left">
          {challenge.description}
        </p>

        {!isLocked && (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-sm text-center sm:text-left">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-foreground">
                {challenge.current}{" "}
                <span className="text-muted-foreground font-normal">
                  / {challenge.goal} {challenge.unit}
                </span>
              </span>
            </div>

            <div className="relative h-2 rounded-full bg-border overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${challenge.title} progress: ${pct}%`}
              />
              {(["bronze", "silver"] as const)
                .filter((tier) => challenge.tiers[tier] < challenge.goal)
                .map((tier) => {
                  const pos = (challenge.tiers[tier] / challenge.goal) * 100;
                  return (
                    <span
                      key={tier}
                      className="absolute top-0 h-full w-px bg-background/70"
                      style={{ left: `${pos}%` }}
                      aria-hidden="true"
                    />
                  );
                })}
            </div>

            <div className="flex items-center justify-center sm:justify-between gap-3 flex-wrap">
              {(["bronze", "silver", "gold"] as const).map((tier) => {
                const t = CHALLENGE_TIER_CONFIG[tier];
                const reached =
                  (tier === "bronze" && challenge.current >= challenge.tiers.bronze) ||
                  (tier === "silver" && challenge.current >= challenge.tiers.silver) ||
                  (tier === "gold" && challenge.current >= challenge.tiers.gold);
                return (
                  <span
                    key={tier}
                    className={`text-xs font-semibold ${
                      reached ? t.color : "text-muted-foreground/40"
                    }`}
                  >
                    {tier === "bronze" ? "🥉" : tier === "silver" ? "🥈" : "🥇"}{" "}
                    {t.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {!isLocked && (
          <div
            className={`flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 px-3 py-2 rounded-xl border w-full ${
              isCompleted
                ? "bg-primary/10 border-primary/20"
                : "bg-muted border-border"
            }`}
          >
            <BadgeIcon
              className={`w-3.5 h-3.5 shrink-0 ${
                isCompleted ? "text-primary" : "text-primary"
              }`}
            />
            {isAvailable ? (
              <span className="text-xs font-semibold text-primary/40 blur-sm select-none pointer-events-none">
                Earn: {challenge.badgeLabel}
              </span>
            ) : (
              <span
                className={`text-xs font-semibold ${
                  isCompleted
                    ? "text-primary"
                    : "text-primary"
                }`}
              >
                {isCompleted
                  ? `Earned: ${challenge.badgeLabel}`
                  : `Earn: ${challenge.badgeLabel}`}
              </span>
            )}
            {isCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-primary shrink-0" />
            )}
          </div>
        )}
      </div>

      {!isLocked && (
        <div className="px-5 pb-5 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {isAvailable && (
            <button
              onClick={() => onStart(challenge.id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Start Challenge
            </button>
          )}
          {isCompleted && (
            <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-border text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground">
              View Certificate
            </button>
          )}
          {isActive && (
            <button
              onClick={() => onAbandon(challenge.id)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-border text-sm font-semibold px-3 py-2 rounded-xl hover:bg-accent transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            >
              Abandon
            </button>
          )}
          <button
            onClick={() => onViewDetail(challenge)}
            className="mx-auto sm:mx-0 sm:ml-auto flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
          >
            View <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
