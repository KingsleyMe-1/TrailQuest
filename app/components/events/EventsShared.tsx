import { useState, useEffect, type ReactNode } from "react";
import {
  Mountain,
  Wind,
  TrendingUp,
  Flame,
  Star,
  Route,
  Zap,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export const TERRAIN_ICONS: Record<string, LucideIcon> = {
  Alpine: Mountain,
  Forest: Wind,
  Ridge: TrendingUp,
  Tundra: Wind,
  Scree: Mountain,
  Volcanic: Flame,
  Meadow: Star,
  Lakeside: Route,
  "Pine forest": Wind,
  "Snow pack": Zap,
  "Old-growth forest": Wind,
  "Glacier moraine": Mountain,
  "Valley floor": Route,
  "River trail": Route,
  "Wildflower meadow": Star,
  "Forest single-track": Route,
  "Volcanic descent": Flame,
};

export function useCountdown(targetDateStr: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDateStr).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDateStr]);

  return timeLeft;
}

export function StaggerItem({ children, index }: { children: ReactNode; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80 + index * 70);
    return () => clearTimeout(t);
  }, [index]);
  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
    >
      {children}
    </div>
  );
}

export function CountUpStat({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 1400;
    const start = performance.now();
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * end));
      if (t < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end]);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl sm:text-3xl font-bold text-primary tabular-nums">
        {val.toLocaleString()}{suffix}
      </span>
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

export function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-card/80 border border-border rounded-xl flex items-center justify-center shadow-inner">
          <span className="text-xl sm:text-2xl font-bold tabular-nums text-primary">
            {String(value).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 animate-pulse pointer-events-none" />
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function SpotsBar({ spotsLeft, spots }: { spotsLeft: number; spots: number }) {
  const taken = spots - spotsLeft;
  const pct = Math.round((taken / spots) * 100);
  const color =
    spotsLeft === 0 ? "bg-muted-foreground" :
    spotsLeft <= 20 ? "bg-rose-500" :
    spotsLeft <= 60 ? "bg-amber-500" :
    "bg-primary";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{taken} registered</span>
        <span className={spotsLeft === 0 ? "text-muted-foreground" : spotsLeft <= 20 ? "text-rose-400 font-semibold" : "text-muted-foreground"}>
          {spotsLeft === 0 ? "Sold out" : `${spotsLeft} left`}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function TerrainBadge({ terrain }: { terrain: string }) {
  const Icon = TERRAIN_ICONS[terrain] ?? Mountain;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-muted/60 text-muted-foreground border border-border rounded-full px-2 py-0.5">
      <Icon className="w-2.5 h-2.5" /> {terrain}
    </span>
  );
}

export function RankIcon({ rank }: { rank: 1 | 2 | 3 }) {
  const styles = { 1: "text-amber-400", 2: "text-slate-300", 3: "text-amber-600" };
  return <Trophy className={`w-4 h-4 ${styles[rank]}`} />;
}
