import { useState, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { Flame, CheckCircle2, Award } from "lucide-react";
import type { ChallengeStats } from "~/constants/challenges";

function AnimatedNumber({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 900;
    function step(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((eased * target).toFixed(1)));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target]);

  return (
    <span>
      {Number.isInteger(target) ? Math.round(display) : display.toFixed(1)}
      {suffix}
    </span>
  );
}

interface ChallengesHeroProps {
  user: User;
  stats: ChallengeStats;
}

export default function ChallengesHero({ user, stats }: ChallengesHeroProps) {
  const displayName = user.user_metadata?.full_name?.split(" ")[0] ?? "Hiker";

  const statCards = [
    {
      icon: Flame,
      value: stats.currentStreak,
      suffix: "",
      label: "Week Streak",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      sub: "Keep it going!",
    },
    {
      icon: CheckCircle2,
      value: stats.activeChallenges,
      suffix: "",
      label: "Active Challenges",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
      sub: `${stats.completedChallenges} completed`,
    },
    {
      icon: Award,
      value: stats.totalBadgesEarned,
      suffix: "",
      label: "Badges Earned",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      sub: "Keep earning",
    },
  ];

  return (
    <section className="px-4 py-8 border-b border-border">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">
            Challenges
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Your Challenge Journey, {displayName}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-1">
            Push your limits. Track your gains. Earn every badge.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto w-full sm:max-w-none">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={`relative overflow-hidden rounded-2xl border ${s.border} bg-card p-4 flex flex-col gap-2 items-center text-center sm:items-start sm:text-left hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-3xl font-bold leading-none ${s.color}`}>
                    <AnimatedNumber target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-tight font-medium">
                    {s.label}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground/70">{s.sub}</p>
                <div
                  className={`pointer-events-none absolute -bottom-4 -right-4 w-16 h-16 rounded-full ${s.bg} blur-xl opacity-60`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
