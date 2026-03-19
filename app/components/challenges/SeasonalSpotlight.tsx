import { Clock } from "lucide-react";
import type { Challenge } from "~/constants/challenges";

function getDaysLeft(endsAt: string): number {
  const end = new Date(endsAt);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

interface SeasonalSpotlightProps {
  challenge: Challenge;
  onViewDetail: (challenge: Challenge) => void;
}

export default function SeasonalSpotlight({
  challenge,
  onViewDetail,
}: SeasonalSpotlightProps) {
  const pct =
    challenge.goal > 0
      ? Math.min(Math.round((challenge.current / challenge.goal) * 100), 100)
      : 0;
  const daysLeft = getDaysLeft(challenge.endsAt);
  const BadgeIcon = challenge.badgeIcon;

  if (daysLeft === 0) return null;

  return (
    <section className="px-4 py-4">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-amber-500/5 p-6">
          <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  🌸 Seasonal Challenge
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Clock className="w-3 h-3" /> {daysLeft} days left
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground leading-tight mb-1">
                {challenge.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                {challenge.description}
              </p>

              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {challenge.current} / {challenge.goal} {challenge.unit}
                  </span>
                  <span className="font-bold text-primary">{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${challenge.title} progress`}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <BadgeIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Earn: {challenge.badgeLabel}
                  </span>
                </div>
                <button
                  onClick={() => onViewDetail(challenge)}
                  className="sm:ml-auto flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  Continue Challenge →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
