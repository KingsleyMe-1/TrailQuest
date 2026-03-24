import type { User } from "@supabase/supabase-js";
import { SlidersHorizontal, BarChart3 } from "lucide-react";

interface DashboardHeroProps {
  user: User;
  onCustomTrail: () => void;
}

export default function DashboardHero({ user, onCustomTrail }: DashboardHeroProps) {
  const firstName = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ")[0]
    : "Hiker";

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--primary) 0%, oklch(0.38 0.22 282) 100%)" }}
    >
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M0,220 L0,160 L120,80 L240,140 L360,40 L480,120 L600,20 L720,110 L840,60 L960,130 L1080,50 L1200,100 L1200,220 Z"
          fill="white" fillOpacity="0.05"
        />
        <path
          d="M0,220 L0,180 L150,120 L300,165 L450,90 L600,150 L750,100 L900,155 L1050,115 L1200,145 L1200,220 Z"
          fill="white" fillOpacity="0.07"
        />
        <path
          d="M0,220 L0,200 L200,170 L400,195 L600,175 L800,190 L1000,172 L1200,185 L1200,220 Z"
          fill="white" fillOpacity="0.10"
        />
      </svg>
      <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-28 rounded-full bg-white/5 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-2">
            Welcome back
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-primary-foreground leading-tight">
            {firstName}
            <span className="text-primary-foreground/60">'s Dashboard</span>
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
            You've logged{" "}
            <span className="font-semibold text-primary-foreground">12 trails</span> and climbed{" "}
            <span className="font-semibold text-primary-foreground">9,840 ft</span> of elevation. Keep going!
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onCustomTrail}
            className="flex items-center gap-2 text-sm font-semibold bg-primary-foreground text-primary px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            <SlidersHorizontal size={15} /> Custom Trail
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold border border-primary-foreground/30 text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary-foreground/10 transition-colors cursor-pointer">
            <BarChart3 size={15} /> Progress
          </button>
        </div>
      </div>
    </section>
  );
}
