import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Users,
  MapPin,
  Calendar,
  Heart,
  CalendarDays,
  Clock,
  Mountain,
  ArrowRight,
  Bell,
  ChevronRight,
  UserPlus,
  CheckCircle2,
  MessageCircle,
  Images,
  X,
  ChevronLeft,
} from "lucide-react";
import type { Route } from "./+types/community";
import { supabase } from "~/lib/supabase";
import { AuthModal, type AuthMode } from "~/components/auth/AuthModal";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import GroupDetailModal from "~/components/community/GroupDetailModal";
import ActivityCommentModal, { type Comment } from "~/components/community/ActivityCommentModal";
import {
  type CommunityGroup,
  COMMUNITY_ACTIVITIES as ACTIVITIES,
  COMMUNITY_ANNOUNCEMENTS as ANNOUNCEMENTS,
  COMMUNITY_DIFFICULTY_STYLES as difficultyStyles,
  COMMUNITY_GROUP_LEVEL_STYLES as groupLevelStyles,
  COMMUNITY_GROUPS as GROUPS,
} from "~/constants/community";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Community - TrailQuest" },
    {
      name: "description",
      content:
        "Connect with fellow hikers, join trail groups, and discover upcoming hike events.",
    },
  ];
}

const ACTIVITY_BASE_LIKES: Record<number, number> = { 1: 14, 2: 7, 3: 22, 4: 11 };

const ACTIVITY_SEED_COMMENTS: Record<number, Comment[]> = {
  1: [
    { id: 101, seed: "AL", author: "Alex L.", text: "Incredible views up there! 🏔️ That summit shot is unreal.", time: "1h ago" },
    { id: 102, seed: "BK", author: "Blair K.", text: "Can't wait to join next time. How was the trail condition?", time: "45m ago" },
  ],
  2: [
    { id: 201, seed: "DM", author: "Dana M.", text: "That lake reflection photo is stunning. What time was it taken?", time: "3h ago" },
  ],
  3: [
    { id: 301, seed: "FR", author: "Finn R.", text: "Granite Dome never disappoints 🙌 Great trip report!", time: "2d ago" },
    { id: 302, seed: "GS", author: "Grace S.", text: "7.5 miles of pure joy — well done everyone!", time: "1d ago" },
  ],
  4: [
    { id: 401, seed: "JH", author: "Jordan H.", text: "So proud of the turn-out. The trail looks amazing now!", time: "2d ago" },
  ],
};

function SpotsBar({ spots, total }: { spots: number; total: number }) {
  const taken = total - spots;
  const pct = Math.round((taken / total) * 100);
  const urgency = "bg-primary";
  return (
    <div className="flex flex-col gap-1 mt-2">
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

export default function Community() {
  const [user, setUser] = useState<User | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [rsvpd, setRsvpd] = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);
  const [activeGroup, setActiveGroup] = useState<CommunityGroup | null>(null);
  const [likedActivities, setLikedActivities] = useState<Set<number>>(new Set());
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [extraComments, setExtraComments] = useState<Record<number, Comment[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem("tq_activity_comments") ?? "null") ?? {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tq_activity_comments", JSON.stringify(extraComments));
    } catch { }
  }, [extraComments]);

  function totalComments(id: number) {
    return (ACTIVITY_SEED_COMMENTS[id]?.length ?? 0) + (extraComments[id]?.length ?? 0);
  }

  function totalLikes(id: number) {
    return (ACTIVITY_BASE_LIKES[id] ?? 0) + (likedActivities.has(id) ? 1 : 0);
  }

  function handleAddComment(activityId: number, text: string) {
    const seed = user?.email?.charAt(0).toUpperCase() ?? "U";
    const author = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "You";
    const newComment: Comment = {
      id: Date.now(),
      seed,
      author,
      text,
      time: "Just now",
    };
    setExtraComments((prev) => ({
      ...prev,
      [activityId]: [...(prev[activityId] ?? []), newComment],
    }));
  }

  function toggleLike(id: number) {
    requireAuth(() =>
      setLikedActivities((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      })
    );
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  function requireAuth(action: () => void) {
    if (user) {
      action();
    } else {
      setAuthMode("login");
      setModalOpen(true);
    }
  }

  function toggleJoin(id: number) {
    requireAuth(() =>
      setJoinedGroups((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      })
    );
  }

  function toggleRsvp(id: number) {
    requireAuth(() =>
      setRsvpd((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      })
    );
  }

  function openCommentModal(id: number) {
    requireAuth(() => setActiveCommentId(id));
  }

  function openLightbox(photos: string[], index: number) {
    setLightbox({ photos, index });
  }
  function closeLightbox() {
    setLightbox(null);
  }
  function lightboxPrev() {
    setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length });
  }
  function lightboxNext() {
    setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.photos.length });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative flex flex-col items-center w-full max-w-3xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="relative w-full">
              <img
                src={lightbox.photos[lightbox.index]}
                alt={`Photo ${lightbox.index + 1}`}
                className="w-full max-h-[70vh] object-contain rounded-2xl"
              />
              {lightbox.photos.length > 1 && (
                <>
                  <button
                    onClick={lightboxPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors cursor-pointer"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={lightboxNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors cursor-pointer"
                    aria-label="Next"
                  >
                    <ChevronLeft size={20} className="rotate-180" />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {lightbox.photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox((lb) => lb && { ...lb, index: i })}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    i === lightbox.index ? "border-primary" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <p className="text-white/50 text-xs mt-3">
              {lightbox.index + 1} / {lightbox.photos.length}
            </p>
          </div>
        </div>
      )}
      <AuthModal
        isOpen={modalOpen}
        mode={authMode}
        onClose={() => setModalOpen(false)}
        onSwitchMode={(m) => setAuthMode(m)}
        onAuthSuccess={(u) => {
          setUser(u);
          setModalOpen(false);
        }}
      />
      {activeCommentId !== null && (() => {
        const act = ACTIVITIES.find((a) => a.id === activeCommentId);
        if (!act) return null;
        const allComments = [
          ...(ACTIVITY_SEED_COMMENTS[activeCommentId] ?? []),
          ...(extraComments[activeCommentId] ?? []),
        ];
        return (
          <ActivityCommentModal
            activity={act}
            comments={allComments}
            onClose={() => setActiveCommentId(null)}
            onSubmit={(text) => handleAddComment(activeCommentId, text)}
            user={user}
            onAuthRequired={() => {
              setActiveCommentId(null);
              setAuthMode("login");
              setModalOpen(true);
            }}
          />
        );
      })()}
      {activeGroup && (
        <GroupDetailModal
          group={activeGroup}
          onClose={() => setActiveGroup(null)}
          joined={joinedGroups.has(activeGroup.id)}
          onToggleJoin={() => toggleJoin(activeGroup.id)}
          user={user}
          onAuthRequired={() => {
            setActiveGroup(null);
            setAuthMode("login");
            setModalOpen(true);
          }}
          activities={ACTIVITIES}
          announcements={ANNOUNCEMENTS}
          rsvpd={rsvpd}
          onRsvp={toggleRsvp}
          onLightbox={openLightbox}
        />
      )}
      <Navbar activePath="/community" user={user} onSignUpClick={() => { setAuthMode("signup"); setModalOpen(true); }} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 mb-4">
              <Users size={12} />
              {GROUPS.reduce((s, g) => s + g.members, 0).toLocaleString()} hikers active
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Find Your Trail Tribe
            </h1>
            <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
              Connect with local groups, share adventures, and never hike alone. Join a community built around the trails you love.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-14">

          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Groups</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Find your people by trail style</p>
              </div>
              <button className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:opacity-80 transition-opacity font-medium">
                Browse all <ChevronRight size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GROUPS.map((group) => {
                const joined = joinedGroups.has(group.id);
                const Icon = group.icon;
                return (
                  <div
                    key={group.id}
                    onClick={() => setActiveGroup(group)}
                    className="group relative bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-muted shrink-0">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <span className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${groupLevelStyles[group.level] ?? "text-muted-foreground bg-background/60 border-border"}`}>
                        {group.level}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 p-4">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm leading-snug">{group.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{group.tagline}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users size={12} />
                          <span>{group.members.toLocaleString()} members</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleJoin(group.id); }}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            joined
                              ? "bg-primary/10 text-primary border border-primary/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30"
                              : "bg-primary text-primary-foreground hover:opacity-90"
                          }`}
                        >
                          {joined ? (
                            <><CheckCircle2 size={12} /> Joined</>
                          ) : (
                            <><UserPlus size={12} /> Join</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            <section className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold">This Week</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Recent activity from groups</p>
              </div>
              <div className="flex flex-col gap-3">
                {ACTIVITIES.map((a) => (
                  <div
                    key={a.id}
                    className="bg-card border border-border rounded-2xl px-4 py-4 flex flex-col gap-2 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {a.avatarSeeds.map((seed) => (
                          <span
                            key={seed}
                            className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center border-2 border-background"
                          >
                            {seed}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                    </div>

                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-semibold">{a.group}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Mountain size={12} />
                        {a.trail}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{a.detail}</span>
                    </div>

                    {a.photos.length > 0 && (
                      <div className="pt-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2">
                          <Images size={11} />
                          <span>{a.photos.length} photo{a.photos.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex gap-1.5">
                          {a.photos.slice(0, 3).map((src, i) => (
                            <button
                              key={i}
                              onClick={() => openLightbox(a.photos, i)}
                              className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border hover:border-primary/50 hover:scale-105 transition-all cursor-pointer"
                              aria-label={`View photo ${i + 1}`}
                            >
                              <img src={src} alt="" className="w-full h-full object-cover" />
                              {i === 2 && a.photos.length > 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">+{a.photos.length - 3}</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground px-0.5 pt-1">
                      {totalLikes(a.id) > 0 && (
                        <span className="flex items-center gap-1">
                          <Heart size={10} className="fill-rose-400 text-rose-400" />
                          {totalLikes(a.id)} {totalLikes(a.id) === 1 ? "like" : "likes"}
                        </span>
                      )}
                      {totalComments(a.id) > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageCircle size={10} />
                          {totalComments(a.id)} {totalComments(a.id) === 1 ? "comment" : "comments"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-border mt-0.5">
                      <button
                        onClick={() => toggleLike(a.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                          likedActivities.has(a.id)
                            ? "text-rose-500 bg-rose-500/10 border border-rose-500/20"
                            : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent"
                        }`}
                      >
                        <Heart
                          size={13}
                          className={likedActivities.has(a.id) ? "fill-rose-500" : ""}
                        />
                        Like
                      </button>
                      <button
                        onClick={() => openCommentModal(a.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-transparent text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <MessageCircle size={13} />
                        Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-3 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Upcoming Hikes</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Announcements &amp; open events</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                  <Bell size={11} />
                  {ANNOUNCEMENTS.length} upcoming
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {ANNOUNCEMENTS.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        {ev.group}
                      </span>
                      <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        ev.tag === "Featured"
                          ? "text-primary bg-primary/10 border-primary/20"
                          : ev.tag === "Limited Spots"
                          ? "text-primary bg-primary/20 border-primary/30"
                          : ev.tag === "Family-Friendly"
                          ? "text-muted-foreground bg-muted border-border"
                          : "text-primary bg-primary/10 border-primary/20"
                      }`}>
                        {ev.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground text-sm">{ev.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {ev.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={12} />
                        {ev.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {ev.location}
                      </span>
                      <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyStyles[ev.difficulty]}`}>
                        {ev.difficulty}
                      </span>
                    </div>

                    <SpotsBar spots={ev.spots} total={ev.totalSpots} />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => toggleRsvp(ev.id)}
                        className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer ${
                          rsvpd.has(ev.id)
                            ? "bg-primary/10 text-primary border border-primary/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30"
                            : "bg-primary text-primary-foreground hover:opacity-90"
                        }`}
                      >
                        {rsvpd.has(ev.id) ? (
                          <><CheckCircle2 size={13} /> Going</>
                        ) : (
                          <><ArrowRight size={13} /> RSVP</>
                        )}
                      </button>
                      <button
                        onClick={() => requireAuth(() => {})}
                        className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                      >
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

