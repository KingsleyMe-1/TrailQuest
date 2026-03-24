import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router";
import { MapPin, Star, Clock, TrendingUp, Route as RouteIcon, Mountain } from "lucide-react";
import type { Route } from "./+types/home";
import { supabase } from "~/lib/supabase";
import { AuthModal, type AuthMode } from "~/components/auth/AuthModal";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import { HOME_TRAILS } from "~/constants/home";
import TrailDetailModal from "~/components/trails/TrailDetailModal";
import { allTrails, type Trail } from "~/constants/trails";
import { TRAIL_CARD_IMAGES, TRAIL_DIFFICULTY_BORDER } from "~/constants/trails-page";
import { TRAIL_DIFFICULTY_CONFIG } from "~/constants/trail-detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrailQuest - Discover Your Next Adventure" },
    {
      name: "description",
      content:
        "Explore thousands of trails, track your progress, and connect with fellow hikers.",
    },
  ];
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    const q = searchQuery.trim();
    if (q) navigate(`/trails?q=${encodeURIComponent(q)}`);
    else navigate("/trails");
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) navigate("/dashboard", { replace: true });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  function openSignUp() {
    setAuthMode("signup");
    setModalOpen(true);
  }

  function openTrail(name: string) {
    const trail = allTrails.find((t) => t.name === name);
    if (trail) setSelectedTrail(trail);
  }

  const featuredTrails = HOME_TRAILS
    .map((ht) => allTrails.find((t) => t.name === ht.name))
    .filter((t): t is Trail => !!t);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <AuthModal
        isOpen={modalOpen}
        mode={authMode}
        onClose={() => setModalOpen(false)}
        onSwitchMode={setAuthMode}
        onAuthSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          navigate("/dashboard", { replace: true });
        }}
      />

      {selectedTrail && (
        <TrailDetailModal
          trail={selectedTrail}
          onClose={() => setSelectedTrail(null)}
          user={user}
          onAuthRequired={() => { setSelectedTrail(null); openSignUp(); }}
        />
      )}

      <Navbar user={user} onSignUpClick={openSignUp} />

      <section className="bg-primary text-primary-foreground px-4 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Discover Your Next Adventure
          </h1>
          <p className="text-sm sm:text-base opacity-90 mb-8">
            Explore thousands of trails, track your progress, and connect with
            fellow hikers.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search trails or locations..."
              className="flex-1 min-w-0 px-4 py-2.5 rounded-lg text-sm text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSearch}
              className="bg-background text-primary font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Featured Trails</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTrails.map((trail) => {
              const cfg = TRAIL_DIFFICULTY_CONFIG[trail.difficulty];
              const imgSrc = TRAIL_CARD_IMAGES[trail.name];
              return (
                <button
                  key={trail.name}
                  onClick={() => openTrail(trail.name)}
                  className={`w-full text-left border border-border border-l-4 ${TRAIL_DIFFICULTY_BORDER[trail.difficulty]} rounded-xl overflow-hidden flex flex-col bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group focus-visible:outline-2 focus-visible:outline-ring`}
                >
                  <div className="relative w-full h-40 overflow-hidden bg-muted shrink-0">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={trail.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Mountain className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2.5 py-1 rounded-full shadow ${cfg.badge}`}>
                      {trail.difficulty}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="min-w-0">
                      <p className="font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors truncate">
                        {trail.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-primary" />
                        {trail.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 text-xs border-t border-border pt-3">
                      <span className="flex flex-col items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-primary/70" />
                        <span className="font-semibold text-foreground">{trail.distance}</span>
                        <span className="text-muted-foreground text-[10px] uppercase tracking-wide">distance</span>
                      </span>
                      <span className="flex flex-col items-center gap-1 border-x border-border">
                        <Clock className="w-3.5 h-3.5 text-primary/70" />
                        <span className="font-semibold text-foreground">{trail.duration}</span>
                        <span className="text-muted-foreground text-[10px] uppercase tracking-wide">time</span>
                      </span>
                      <span className="flex flex-col items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-primary/70" />
                        <span className="font-semibold text-foreground">{trail.elevation}</span>
                        <span className="text-muted-foreground text-[10px] uppercase tracking-wide">elevation</span>
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i <= Math.round(trail.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/20"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-medium text-foreground">{trail.rating}</span>
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <RouteIcon className="w-3 h-3" />
                        {trail.type}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

