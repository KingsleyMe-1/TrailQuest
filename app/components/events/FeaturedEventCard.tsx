import { Calendar, MapPin, Flag, Zap, ChevronRight, ArrowUpRight } from "lucide-react";
import { DIFFICULTY_STYLES, type TrailEvent } from "~/constants/events";
import { useCountdown, CountdownUnit, TerrainBadge, SpotsBar } from "~/components/events/EventsShared";

interface FeaturedEventCardProps {
  event: TrailEvent;
  onOpen: (e: TrailEvent) => void;
}

export default function FeaturedEventCard({ event, onOpen }: FeaturedEventCardProps) {
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
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}{endFormatted ? ` – ${endFormatted}` : ""}
            </span>
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
