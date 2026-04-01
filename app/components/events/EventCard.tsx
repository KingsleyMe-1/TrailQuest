import { Calendar, MapPin, Zap, Trophy, ChevronRight, ArrowUpRight } from "lucide-react";
import { DIFFICULTY_STYLES, type TrailEvent } from "~/constants/events";
import { StaggerItem, SpotsBar, TerrainBadge } from "~/components/events/EventsShared";

interface EventCardProps {
  event: TrailEvent;
  index: number;
  onOpen: (e: TrailEvent) => void;
}

export default function EventCard({ event, index, onOpen }: EventCardProps) {
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
