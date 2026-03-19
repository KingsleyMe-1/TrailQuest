import { Link } from "react-router";
import { Mountain, ArrowRight } from "lucide-react";

export default function NextAdventureCTA() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "linear-gradient(135deg, var(--primary) 0%, oklch(0.38 0.22 282) 100%)" }}
    >
      <div className="pointer-events-none absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
      <Mountain className="w-7 h-7 text-primary-foreground/80" />
      <div>
        <p className="text-sm font-bold text-primary-foreground">Ready for more?</p>
        <p className="text-xs text-primary-foreground/70 mt-0.5 leading-relaxed">
          Discover new trails matched to your skill level and location.
        </p>
      </div>
      <Link
        to="/trails"
        className="flex items-center justify-center gap-2 text-xs font-bold bg-primary-foreground text-primary py-2 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
      >
        Explore Trails <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
