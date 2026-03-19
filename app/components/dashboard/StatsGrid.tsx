import { useState, useEffect, useRef } from "react";
import { DASHBOARD_STATS } from "~/constants/dashboard";

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
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

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {DASHBOARD_STATS.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className={`relative overflow-hidden rounded-2xl border ${s.border} bg-card p-4 flex flex-col gap-2 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold leading-none ${s.color}`}>
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">{s.label}</p>
            </div>
            <p className="text-[11px] text-muted-foreground/60">{s.sub}</p>
            <div className={`pointer-events-none absolute -bottom-4 -right-4 w-16 h-16 rounded-full ${s.bg} blur-xl opacity-60`} />
          </div>
        );
      })}
    </div>
  );
}
