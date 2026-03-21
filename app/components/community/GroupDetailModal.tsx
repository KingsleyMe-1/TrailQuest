import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  X,
  MapPin,
  CalendarDays,
  Clock,
  Mountain,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  MessageCircle,
  History,
} from "lucide-react";
import type {
  CommunityGroup,
  CommunityActivity,
  CommunityAnnouncement,
} from "~/constants/community";
import {
  COMMUNITY_DIFFICULTY_STYLES as difficultyStyles,
  COMMUNITY_GROUP_LEVEL_STYLES as groupLevelStyles,
} from "~/constants/community";

type Tab = "about" | "events" | "activity";

type Props = {
  group: CommunityGroup;
  onClose: () => void;
  joined: boolean;
  onToggleJoin: () => void;
  user: User | null;
  onAuthRequired: () => void;
  activities: CommunityActivity[];
  announcements: CommunityAnnouncement[];
  rsvpd: Set<number>;
  onRsvp: (id: number) => void;
  onLightbox: (photos: string[], index: number) => void;
};

function SpotsBar({ spots, total }: { spots: number; total: number }) {
  const taken = total - spots;
  const pct = Math.round((taken / total) * 100);
  const urgency =
    spots <= 5 ? "bg-rose-500" : spots <= 10 ? "bg-amber-500" : "bg-primary";
  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{taken} joined</span>
        <span>{spots} spots left</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${urgency}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const TABS: Tab[] = ["about", "events", "activity"];

export default function GroupDetailModal({
  group,
  onClose,
  joined,
  onToggleJoin,
  user,
  onAuthRequired,
  activities,
  announcements,
  rsvpd,
  onRsvp,
  onLightbox,
}: Props) {
  const [tab, setTab] = useState<Tab>("about");
  const [mounted, setMounted] = useState(false);

  const Icon = group.icon;
  const groupActivities = activities.filter((a) => a.group === group.name);
  const groupEvents = announcements.filter((a) => a.group === group.name);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleJoin() {
    if (!user) { onAuthRequired(); return; }
    onToggleJoin();
  }

  function handleRsvp(id: number) {
    if (!user) { onAuthRequired(); return; }
    onRsvp(id);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${group.name} details`}
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${
        mounted ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 max-h-[92dvh] ${
          mounted
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-8 opacity-0 sm:scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/25" />
        </div>

        <div className="relative flex-shrink-0 h-44 overflow-hidden">
          <img
            src={group.image}
            alt={group.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/55 flex items-center justify-center transition-colors cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
                  groupLevelStyles[group.level] ??
                  "text-white/80 bg-white/10 border-white/20"
                }`}
              >
                {group.level}
              </span>
              <span className="text-[10px] text-white/75 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                {group.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">
              {group.name}
            </h2>
            <p className="flex items-center gap-1 text-xs text-white/65 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {group.location}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 grid grid-cols-3 divide-x divide-border border-b border-border bg-muted/20">
          <div className="flex flex-col items-center py-3">
            <span className="text-[15px] font-bold text-foreground tabular-nums">
              {group.members.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Members
            </span>
          </div>
          <div className="flex flex-col items-center py-3">
            <span className="text-[15px] font-bold text-foreground tabular-nums">
              {group.totalHikes}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Hikes Done
            </span>
          </div>
          <div className="flex flex-col items-center py-3">
            <span className="text-[15px] font-bold text-foreground tabular-nums">
              {group.avgDistance}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Avg Distance
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-border bg-card px-1">
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-xs font-semibold tracking-wide transition-colors relative cursor-pointer capitalize flex items-center justify-center gap-1.5 ${
                  tab === t
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {t === "events" && groupEvents.length > 0 && (
                  <span className="text-[9px] font-bold bg-primary text-primary-foreground rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {groupEvents.length}
                  </span>
                )}
                {t === "activity" && groupActivities.length > 0 && (
                  <span className="text-[9px] font-bold bg-muted text-muted-foreground rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {groupActivities.length}
                  </span>
                )}
                {tab === t && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {tab === "about" && (
            <div className="px-5 py-5 flex flex-col gap-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {group.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-xs bg-muted/60 text-foreground px-3 py-1.5 rounded-xl">
                  <CalendarDays className="w-3 h-3 text-primary" />
                  Founded {group.founded}
                </span>
                <span className="flex items-center gap-1.5 text-xs bg-muted/60 text-foreground px-3 py-1.5 rounded-xl">
                  <MapPin className="w-3 h-3 text-primary" />
                  {group.location}
                </span>
                <span
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl ${group.color}`}
                >
                  <Icon className="w-3 h-3" />
                  {group.category}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Favourite Trails
                </p>
                <div className="flex flex-col gap-2">
                  {group.topTrails.map((trail, i) => (
                    <div
                      key={trail}
                      className="flex items-center gap-3 px-3 py-2.5 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <Mountain className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-xs font-medium text-foreground">
                        {trail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "events" && (
            <div className="px-5 py-4 flex flex-col gap-3">
              {groupEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <CalendarDays className="w-9 h-9 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No upcoming events
                  </p>
                  <p className="text-xs text-muted-foreground/55 mt-1">
                    Check back soon for new hikes
                  </p>
                </div>
              ) : (
                groupEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-muted/40 rounded-2xl p-4 flex flex-col gap-3 border border-border"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground leading-snug">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${difficultyStyles[ev.difficulty]}`}
                      >
                        {ev.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {ev.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ev.location}
                      </span>
                    </div>
                    <SpotsBar spots={ev.spots} total={ev.totalSpots} />
                    <button
                      onClick={() => handleRsvp(ev.id)}
                      className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer ${
                        rsvpd.has(ev.id)
                          ? "bg-primary/10 text-primary border border-primary/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {rsvpd.has(ev.id) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Going
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" /> RSVP for this
                          hike
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "activity" && (
            <div className="px-5 py-4 flex flex-col gap-3">
              {groupActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <History className="w-9 h-9 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No recent activity
                  </p>
                  <p className="text-xs text-muted-foreground/55 mt-1">
                    This group hasn&apos;t posted yet
                  </p>
                </div>
              ) : (
                groupActivities.map((a) => (
                  <div
                    key={a.id}
                    className="bg-muted/40 rounded-2xl p-4 flex flex-col gap-2.5 border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {a.avatarSeeds.map((seed) => (
                          <span
                            key={seed}
                            className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center border-2 border-background"
                          >
                            {seed}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {a.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-semibold">{a.group}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mountain className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-primary font-medium">{a.trail}</span>
                      <span className="text-muted-foreground ml-auto">
                        {a.detail}
                      </span>
                    </div>
                    {a.photos.length > 0 && (
                      <div className="flex gap-1.5 pt-0.5">
                        {a.photos.slice(0, 4).map((src, i) => (
                          <button
                            key={i}
                            onClick={() => onLightbox(a.photos, i)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border hover:border-primary/50 hover:scale-105 transition-all cursor-pointer"
                            aria-label={`View photo ${i + 1}`}
                          >
                            <img
                              src={src}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {i === 3 && a.photos.length > 4 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  +{a.photos.length - 4}
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-border px-5 py-3 flex gap-2 bg-card">
          <button
            onClick={handleJoin}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
              joined
                ? "bg-primary/10 text-primary border border-primary/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {joined ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Joined
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" /> Join Group
              </>
            )}
          </button>
          <button
            onClick={() => {
              if (!user) onAuthRequired();
            }}
            className="flex items-center justify-center gap-1.5 border border-border text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
