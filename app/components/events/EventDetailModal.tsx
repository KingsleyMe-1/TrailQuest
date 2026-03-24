import { useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Calendar,
  MapPin,
  X,
  Star,
  Trophy,
  CheckCircle2,
  Route,
  Clock,
} from "lucide-react";
import { DIFFICULTY_STYLES, type TrailEvent } from "~/constants/events";
import { TerrainBadge, SpotsBar, RankIcon } from "~/components/events/EventsShared";

export interface EventDetailModalProps {
  event: TrailEvent | null;
  onClose: () => void;
  user: User | null;
  onRegister: (eventId: number, category: string) => void;
  registered: Set<string>;
}

export default function EventDetailModal({ event, onClose, user, onRegister, registered }: EventDetailModalProps) {
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
  const endFormatted = event.endDate
    ? new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : null;

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
        <div className={`h-1 w-full bg-gradient-to-r ${event.gradientFrom} ${event.gradientTo} shrink-0`} />

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
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}{endFormatted ? ` – ${endFormatted}` : ""}
                </span>
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
                            className="text-xs font-semibold text-primary-foreground bg-primary rounded-lg px-3 py-1.5 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
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
