import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Flag,
  Trophy,
  CheckCircle2,
  Award,
  Medal,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { Route as RRRoute } from "./+types/events";
import { supabase } from "~/lib/supabase";
import { AuthModal, type AuthMode } from "~/components/auth/AuthModal";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import { EVENTS, EVENT_STATS, type TrailEvent } from "~/constants/events";
import { StaggerItem, CountUpStat } from "~/components/events/EventsShared";
import EventDetailModal from "~/components/events/EventDetailModal";
import EventCard from "~/components/events/EventCard";
import FeaturedEventCard from "~/components/events/FeaturedEventCard";

export function meta({}: RRRoute.MetaArgs) {
  return [
    { title: "Events | TrailQuest" },
    {
      name: "description",
      content: "Discover upcoming trail running competitions and relive past race results. Register for TrailQuest events.",
    },
  ];
}

type FilterTab = "all" | "upcoming" | "past";

const FILTER_TABS: { key: FilterTab; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All Events", icon: LayoutGrid },
  { key: "upcoming", label: "Upcoming", icon: Flag },
  { key: "past", label: "Past Results", icon: Trophy },
];

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
            <div
              className="pointer-events-none absolute inset-0"
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
