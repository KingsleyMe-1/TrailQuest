import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Flag,
  MapPin,
  Calendar,
  Users,
  Timer,
  Trophy,
  Mountain,
  Star,
  Zap,
  Wind,
  ChevronRight,
  X,
  CheckCircle2,
  Flame,
  Route,
  Award,
  Medal,
  ArrowUpRight,
  Clock,
  TrendingUp,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { Route as RRRoute } from "./+types/events";
import { supabase } from "~/lib/supabase";
import { AuthModal, type AuthMode } from "~/components/auth/AuthModal";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import {
  EVENTS,
  EVENT_STATS,
  DIFFICULTY_STYLES,
  type TrailEvent,
  type EventStatus,
} from "~/constants/events";

export function meta({}: RRRoute.MetaArgs) {
  return [
    { title: "Events | TrailQuest" },
    {
      name: "description",
      content:
        "Discover upcoming trail running competitions and relive past race results. Register for TrailQuest events.",
    },
  ];
}

type FilterTab = "all" | "upcoming" | "past";

const FILTER_TABS: { key: FilterTab; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All Events", icon: LayoutGrid },
  { key: "upcoming", label: "Upcoming", icon: Flag },
  { key: "past", label: "Past Results", icon: Trophy },
];

const TERRAIN_ICONS: Record<string, LucideIcon> = {
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

function useCountdown(targetDateStr: string) {
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

function StaggerItem({ children, index }: { children: ReactNode; index: number }) {
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

function CountUpStat({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
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

function CountdownUnit({ value, label }: { value: number; label: string }) {
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

function SpotsBar({ spotsLeft, spots }: { spotsLeft: number; spots: number }) {
  const taken = spots - spotsLeft;
  const pct = Math.round((taken / spots) * 100);
  const color = spotsLeft === 0 ? "bg-muted-foreground" : spotsLeft <= 20 ? "bg-rose-500" : spotsLeft <= 60 ? "bg-amber-500" : "bg-primary";
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

function TerrainBadge({ terrain }: { terrain: string }) {
  const Icon = TERRAIN_ICONS[terrain] ?? Mountain;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-muted/60 text-muted-foreground border border-border rounded-full px-2 py-0.5">
      <Icon className="w-2.5 h-2.5" /> {terrain}
    </span>
  );
}

function RankIcon({ rank }: { rank: 1 | 2 | 3 }) {
  const styles = {
    1: "text-amber-400",
    2: "text-slate-300",
    3: "text-amber-600",
  };
  return <Trophy className={`w-4 h-4 ${styles[rank]}`} />;
}

interface EventDetailModalProps {
  event: TrailEvent | null;
  onClose: () => void;
  user: User | null;
  onRegister: (eventId: number, category: string) => void;
  registered: Set<string>;
}

function EventDetailModal({ event, onClose, user, onRegister, registered }: EventDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (event) setTimeout(() => setMounted(true), 10);
    else setMounted(false);
  }, [event]);

  const handleClose = useCallback(() => {
    setMounted(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    if (!event) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [event, handleClose]);

  useEffect(() => {
    document.body.style.overflow = event ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [event]);

  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const endFormatted = event.endDate ? new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric" }) : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        className={`absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-280 ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full max-w-xl flex flex-col max-h-[92dvh] bg-card border ${event.borderColor} rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
      >
        <div className={`h-1 w-full bg-gradient-to-r ${event.gradientFrom.replace("from-", "from-").replace("/80", "")} ${event.gradientTo.replace("to-", "to-").replace("/60", "")} shrink-0`} />

        <div className={`relative px-5 pt-4 pb-5 border-b border-border bg-gradient-to-br ${event.gradientFrom} ${event.gradientTo} overflow-hidden shrink-0`}>
          <div className={`pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${event.gradientFrom} blur-2xl opacity-50`} />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${event.accentColor}`}>
                  {event.status === "upcoming" ? "Upcoming" : "Past Event"}
                </span>
                <span className={`text-[10px] border rounded-full px-2 py-0.5 font-medium ${DIFFICULTY_STYLES[event.difficulty]}`}>
                  {event.difficulty}
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground leading-tight">{event.title}</h2>
              <p className={`text-sm font-medium ${event.accentColor} mt-0.5`}>{event.tagline}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formattedDate}{endFormatted ? ` – ${endFormatted}` : ""}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 scrollbar-themed px-5 py-4 space-y-5">
          <div className="flex flex-wrap gap-1.5">
            {event.terrain.map((t) => <TerrainBadge key={t} terrain={t} />)}
            <span className="inline-flex items-center gap-1 text-[10px] bg-muted/60 text-muted-foreground border border-border rounded-full px-2 py-0.5">
              <MapPin className="w-2.5 h-2.5" /> {event.region}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Star className="w-3 h-3 text-amber-400" /> Course Features
            </h3>
            <ul className="space-y-1.5">
              {event.courseFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {event.podium && (
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-amber-400" /> Podium Results
              </h3>
              <div className="space-y-2">
                {event.podium.map((p) => (
                  <div key={p.rank} className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2 border border-border">
                    <RankIcon rank={p.rank} />
                    <span className="flex-1 text-sm font-semibold text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{p.time}</span>
                    <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5">{p.category}</span>
                  </div>
                ))}
              </div>
              {event.participants && (
                <p className="text-xs text-muted-foreground mt-2">
                  {event.totalFinishers?.toLocaleString()} of {event.participants.toLocaleString()} finishers
                </p>
              )}
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Route className="w-3 h-3 text-primary" /> Race Categories
            </h3>
            <div className="space-y-3">
              {event.categories.map((cat) => {
                const key = `${event.id}-${cat.distance}`;
                const isReg = registered.has(key);
                const soldOut = cat.spotsLeft === 0;
                return (
                  <div key={cat.distance} className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${event.textColor}`}>{cat.distance}</span>
                        <span className="text-[10px] text-muted-foreground">· {cat.elevation} gain</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {cat.cutoff}
                      </div>
                    </div>
                    {event.status === "upcoming" && <SpotsBar spotsLeft={cat.spotsLeft} spots={cat.spots} />}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">${cat.price}</span>
                      {event.status === "upcoming" ? (
                        soldOut ? (
                          <span className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5">Sold Out</span>
                        ) : isReg ? (
                          <button
                            onClick={() => onRegister(event.id, cat.distance)}
                            className="text-xs text-rose-400 border border-rose-400/30 bg-rose-400/10 rounded-lg px-3 py-1.5 hover:bg-rose-400/20 transition-colors cursor-pointer"
                          >
                            Withdraw
                          </button>
                        ) : (
                          <button
                            onClick={() => onRegister(event.id, cat.distance)}
                            className={`text-xs font-semibold text-primary-foreground bg-primary rounded-lg px-3 py-1.5 hover:opacity-90 active:scale-95 transition-all cursor-pointer`}
                          >
                            Register
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">Completed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, index, onOpen }: { event: TrailEvent; index: number; onOpen: (e: TrailEvent) => void }) {
  const isPast = event.status === "past";
  const totalSpots = event.categories.reduce((s, c) => s + c.spots, 0);
  const spotsLeft = event.categories.reduce((s, c) => s + c.spotsLeft, 0);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <StaggerItem index={index}>
      <button
        onClick={() => onOpen(event)}
        className={`group w-full text-left rounded-2xl border ${event.borderColor} bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 cursor-pointer`}
      >
        <div className={`relative px-4 pt-4 pb-3 bg-gradient-to-br ${event.gradientFrom} ${event.gradientTo} overflow-hidden`}>
          <div className={`pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${event.gradientFrom} blur-xl opacity-60 group-hover:opacity-80 transition-opacity`} />
          <div className="relative flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                {isPast ? (
                  <span className="text-[10px] bg-muted/60 text-muted-foreground border border-border rounded-full px-2 py-0.5">Results</span>
                ) : (
                  <span className={`text-[10px] font-semibold ${event.accentColor} uppercase tracking-wide`}>Upcoming</span>
                )}
                <span className={`text-[10px] border rounded-full px-2 py-0.5 font-medium ${DIFFICULTY_STYLES[event.difficulty]}`}>
                  {event.difficulty}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground leading-tight truncate pr-2">{event.title}</h3>
              <p className={`text-xs ${event.accentColor} mt-0.5`}>{event.tagline}</p>
            </div>
            <ArrowUpRight className={`w-4 h-4 ${event.accentColor} shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
          </div>
        </div>

        <div className="px-4 py-3 space-y-2.5">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formattedDate}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {event.terrain.slice(0, 2).map((t) => <TerrainBadge key={t} terrain={t} />)}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Zap className={`w-3 h-3 ${event.accentColor} shrink-0`} />
            <span className="text-muted-foreground">{event.highlight}</span>
          </div>

          {isPast ? (
            event.podium && (
              <div className="flex items-center gap-2 pt-0.5 border-t border-border">
                <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="text-xs text-foreground font-medium truncate">{event.podium[0].name}</span>
                <span className="text-xs text-muted-foreground font-mono ml-auto">{event.podium[0].time}</span>
              </div>
            )
          ) : (
            <SpotsBar spotsLeft={spotsLeft} spots={totalSpots} />
          )}

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex gap-1">
              {event.categories.map((c) => (
                <span key={c.distance} className={`text-[10px] font-semibold ${event.textColor} bg-card border ${event.borderColor} rounded px-1.5 py-0.5`}>
                  {c.distance}
                </span>
              ))}
            </div>
            <span className={`text-xs font-semibold ${event.accentColor} flex items-center gap-0.5 group-hover:gap-1 transition-all`}>
              {isPast ? "View Results" : "Register"} <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </button>
    </StaggerItem>
  );
}

function FeaturedEventCard({ event, onOpen }: { event: TrailEvent; onOpen: (e: TrailEvent) => void }) {
  const countdown = useCountdown(event.date);
  const totalSpots = event.categories.reduce((s, c) => s + c.spots, 0);
  const spotsLeft = event.categories.reduce((s, c) => s + c.spotsLeft, 0);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const endFormatted = event.endDate
    ? new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : null;

  return (
    <button
      onClick={() => onOpen(event)}
      className={`group w-full text-left rounded-2xl border-2 ${event.borderColor} bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/25 hover:-translate-y-1`}
    >
      <div className={`relative px-5 sm:px-6 pt-5 pb-6 bg-gradient-to-br ${event.gradientFrom} ${event.gradientTo} overflow-hidden`}>
        <div className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${event.gradientFrom} blur-3xl opacity-70 group-hover:opacity-90 transition-opacity`} />
        <div className={`pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-gradient-to-tr ${event.gradientTo} blur-2xl opacity-40`} />

        <div className="relative">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${event.accentColor} uppercase tracking-widest`}>
                  <Flag className="w-3 h-3" /> Featured Race
                </span>
                <span className={`text-[10px] border rounded-full px-2 py-0.5 font-medium ${DIFFICULTY_STYLES[event.difficulty]}`}>
                  {event.difficulty}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{event.title}</h2>
              <p className={`text-sm ${event.accentColor} mt-0.5 font-medium`}>{event.tagline}</p>
            </div>
            <ArrowUpRight className={`w-5 h-5 ${event.accentColor} shrink-0 mt-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formattedDate}{endFormatted ? ` – ${endFormatted}` : ""}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.terrain.map((t) => <TerrainBadge key={t} terrain={t} />)}
          </div>

          <div className="flex items-center gap-2 text-sm mb-4">
            <Zap className={`w-4 h-4 ${event.accentColor} shrink-0`} />
            <span className="text-foreground font-medium">{event.highlight}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
              <span>RACE STARTS IN</span>
            </div>
            <div className="flex gap-2">
              <CountdownUnit value={countdown.days} label="days" />
              <CountdownUnit value={countdown.hours} label="hrs" />
              <CountdownUnit value={countdown.minutes} label="min" />
              <CountdownUnit value={countdown.seconds} label="sec" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 space-y-3">
        <SpotsBar spotsLeft={spotsLeft} spots={totalSpots} />
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {event.categories.map((c) => (
              <span key={c.distance} className={`text-[11px] font-bold ${event.textColor} bg-card border-2 ${event.borderColor} rounded-lg px-2 py-1`}>
                {c.distance} · ${c.price}
              </span>
            ))}
          </div>
          <span className={`text-sm font-semibold ${event.accentColor} flex items-center gap-1 group-hover:gap-1.5 transition-all`}>
            View & Register <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Events() {
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [activeEvent, setActiveEvent] = useState<TrailEvent | null>(null);
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [pendingRegister, setPendingRegister] = useState<{ eventId: number; category: string } | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (user && pendingRegister) {
      const key = `${pendingRegister.eventId}-${pendingRegister.category}`;
      setRegistered((prev) => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
      setPendingRegister(null);
    }
  }, [user, pendingRegister]);

  function handleOpenEvent(event: TrailEvent) {
    if (!user) {
      setAuthMode("login");
      setAuthModalOpen(true);
    } else {
      setActiveEvent(event);
    }
  }

  function handleRegister(eventId: number, category: string) {
    if (!user) {
      setPendingRegister({ eventId, category });
      setAuthMode("login");
      setAuthModalOpen(true);
      return;
    }
    const key = `${eventId}-${category}`;
    setRegistered((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleAuthSuccess(newUser: User) {
    setUser(newUser);
    setAuthModalOpen(false);
  }

  const featured = EVENTS.find((e) => e.featured && e.status === "upcoming");
  const filteredEvents = EVENTS.filter((e) => {
    if (filter === "upcoming") return e.status === "upcoming";
    if (filter === "past") return e.status === "past";
    return true;
  }).filter((e) => !e.featured || filter !== "all");

  const upcomingCount = EVENTS.filter((e) => e.status === "upcoming").length;
  const pastCount = EVENTS.filter((e) => e.status === "past").length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar
        activePath="/events"
        user={user}
        onSignUpClick={() => { setAuthMode("signup"); setAuthModalOpen(true); }}
      />

      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <EventDetailModal
        event={activeEvent}
        onClose={() => setActiveEvent(null)}
        user={user}
        onRegister={handleRegister}
        registered={registered}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-card to-background border-b border-border">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute top-10 right-0 w-56 h-56 rounded-full bg-violet-500/8 blur-3xl animate-pulse" style={{ animationDelay: "1.2s" }} />
            <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-primary/6 blur-2xl" />
            <div className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, oklch(0.6056 0.2189 292.7172 / 0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className={`transition-all duration-700 ease-out ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                  <Flag className="w-3 h-3 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Trail Running Events</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
                Race the Wild.
                <br />
                <span className="text-primary">Own the Trail.</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mb-8">
                From midnight firefly runs to elite 50K ultras — explore upcoming competitions and revisit past race results.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <CountUpStat end={EVENT_STATS.totalEvents} suffix="+" label="Events hosted" />
                <CountUpStat end={EVENT_STATS.totalRunners} suffix="+" label="Runners served" />
                <CountUpStat end={EVENT_STATS.countriesRepresented} label="Countries" />
                <CountUpStat end={EVENT_STATS.milesOfTrail} suffix=" mi" label="Trail miles" />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map(({ key, label, icon: Icon }) => {
              const count = key === "upcoming" ? upcomingCount : key === "past" ? pastCount : EVENTS.length;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                    filter === key
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${filter === key ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {registered.size > 0 && (
              <div className="ml-auto flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {registered.size} registered
              </div>
            )}
          </div>

          {(filter === "all" || filter === "upcoming") && featured && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Featured Event</h2>
              </div>
              <FeaturedEventCard event={featured} onOpen={handleOpenEvent} />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-4">
              {filter === "past" ? <Medal className="w-4 h-4 text-primary" /> : <Flag className="w-4 h-4 text-primary" />}
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {filter === "all" ? "Other Events" : filter === "upcoming" ? "Upcoming Races" : "Past Races & Results"}
              </h2>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Flag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No events in this category yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} onOpen={handleOpenEvent} />
                ))}
              </div>
            )}
          </div>

          {!user && (
            <StaggerItem index={8}>
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-violet-500/5 px-6 py-8 text-center">
                <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-violet-500/10 blur-xl" />
                <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-1">Ready to Race?</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                  Create a free account to register for events, track your race history, and join the community.
                </p>
                <button
                  onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <Flag className="w-4 h-4" /> Create Free Account
                </button>
              </div>
            </StaggerItem>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
