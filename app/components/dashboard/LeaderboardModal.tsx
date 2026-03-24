import { useState, useEffect, useCallback, type ReactNode } from "react";
import { X, Trophy, Medal, Users, Globe, Mountain } from "lucide-react";
import { COMMUNITY_GROUPS } from "~/constants/community";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "hikers" | "friends" | "groups";

interface HikerEntry {
  rank: number;
  name: string;
  initials: string;
  trails: number;
  miles: number;
  elevation: number;
  badge: string;
  accentClass: string;
  isCurrentUser?: boolean;
}

const ALL_HIKERS: HikerEntry[] = [
  { rank: 1, name: "Alex Rivera",      initials: "AR", trails: 47, miles: 218.4, elevation: 41200, badge: "Summit Master",    accentClass: "text-amber-400 bg-amber-400/10 border-amber-400/25" },
  { rank: 2, name: "Priya Nair",       initials: "PN", trails: 39, miles: 183.1, elevation: 35800, badge: "Peak Bagger",      accentClass: "text-slate-300 bg-slate-300/10 border-slate-300/25" },
  { rank: 3, name: "Jordan Cole",      initials: "JC", trails: 34, miles: 156.7, elevation: 29400, badge: "Ridge Runner",     accentClass: "text-amber-600 bg-amber-600/10 border-amber-600/25" },
  { rank: 4, name: "Sam Torres",       initials: "ST", trails: 28, miles: 134.2, elevation: 23100, badge: "Trail Chaser",     accentClass: "text-primary bg-primary/10 border-primary/25" },
  { rank: 5, name: "Morgan Lee",       initials: "ML", trails: 24, miles: 112.8, elevation: 18700, badge: "Trailblazer",      accentClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25" },
  { rank: 6, name: "Casey Kim",        initials: "CK", trails: 21, miles:  98.3, elevation: 16500, badge: "Weekend Warrior",  accentClass: "text-sky-400 bg-sky-400/10 border-sky-400/25" },
  { rank: 7, name: "Taylor Nguyen",    initials: "TN", trails: 17, miles:  79.5, elevation: 13200, badge: "Nature Seeker",    accentClass: "text-violet-400 bg-violet-400/10 border-violet-400/25" },
  { rank: 8, name: "Riley Brooks",     initials: "RB", trails: 14, miles:  64.1, elevation: 11000, badge: "Path Finder",      accentClass: "text-rose-400 bg-rose-400/10 border-rose-400/25" },
  { rank: 9, name: "Quinn Park",       initials: "QP", trails: 13, miles:  59.7, elevation:  9600, badge: "Explorer",         accentClass: "text-teal-400 bg-teal-400/10 border-teal-400/25" },
  { rank: 10, name: "You",            initials: "KJ", trails: 12, miles:  48.3, elevation:  9840, badge: "Hiker",            accentClass: "text-primary bg-primary/10 border-primary/25", isCurrentUser: true },
];

const FRIENDS: HikerEntry[] = [
  { rank: 1, name: "Marcus Hill",   initials: "MH", trails: 31, miles: 149.6, elevation: 27300, badge: "Peak Bagger",    accentClass: "text-amber-400 bg-amber-400/10 border-amber-400/25" },
  { rank: 2, name: "Nina Zhao",     initials: "NZ", trails: 26, miles: 122.0, elevation: 21800, badge: "Summit Seeker",  accentClass: "text-slate-300 bg-slate-300/10 border-slate-300/25" },
  { rank: 3, name: "Devon Walsh",   initials: "DW", trails: 19, miles:  88.4, elevation: 15200, badge: "Trail Chaser",   accentClass: "text-amber-600 bg-amber-600/10 border-amber-600/25" },
  { rank: 4, name: "You",           initials: "KJ", trails: 12, miles:  48.3, elevation:  9840, badge: "Hiker",         accentClass: "text-primary bg-primary/10 border-primary/25", isCurrentUser: true },
  { rank: 5, name: "Jamie Foster",  initials: "JF", trails: 10, miles:  42.7, elevation:  7900, badge: "Explorer",      accentClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25" },
  { rank: 6, name: "Avery Stone",   initials: "AS", trails:  8, miles:  34.1, elevation:  6400, badge: "Nature Seeker", accentClass: "text-sky-400 bg-sky-400/10 border-sky-400/25" },
];

const RANK_MEDAL = [
  { outerClass: "text-amber-400",  label: "1st" },
  { outerClass: "text-slate-300",  label: "2nd" },
  { outerClass: "text-amber-600",  label: "3rd" },
];

function StaggerItem({ children, index }: { children: ReactNode; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60 + index * 55);
    return () => clearTimeout(t);
  }, [index]);
  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0px)" : "translateY(12px)" }}
    >
      {children}
    </div>
  );
}

function HikerRow({ entry, index }: { entry: HikerEntry; index: number }) {
  const medal = RANK_MEDAL[entry.rank - 1];
  return (
    <StaggerItem index={index}>
      <div
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all duration-200 hover:shadow-sm ${
          entry.isCurrentUser
            ? "border-primary/30 bg-primary/5"
            : "border-border bg-card/50 hover:bg-card"
        }`}
      >
        <div className="w-7 flex items-center justify-center shrink-0">
          {medal ? (
            <Trophy className={`w-4 h-4 ${medal.outerClass}`} />
          ) : (
            <span className="text-xs font-bold text-muted-foreground/60">{entry.rank}</span>
          )}
        </div>

        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${entry.accentClass}`}
        >
          {entry.initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
            {entry.name}
            {entry.isCurrentUser && (
              <span className="ml-1.5 text-[10px] font-normal text-primary/70">(you)</span>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground">{entry.badge}</p>
        </div>

        <div className="flex gap-3 shrink-0 text-right">
          <div>
            <p className="text-xs font-bold text-foreground">{entry.trails}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Trails</p>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{entry.miles}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Mi</p>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

function GroupRow({ group, rank, index }: { group: typeof COMMUNITY_GROUPS[0]; rank: number; index: number }) {
  const medal = RANK_MEDAL[rank - 1];
  const [colorText, colorBg] = group.color.split(" ");
  const Icon = group.icon;
  return (
    <StaggerItem index={index}>
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-border bg-card/50 hover:bg-card hover:shadow-sm transition-all duration-200">
        <div className="w-7 flex items-center justify-center shrink-0">
          {medal ? (
            <Trophy className={`w-4 h-4 ${medal.outerClass}`} />
          ) : (
            <span className="text-xs font-bold text-muted-foreground/60">{rank}</span>
          )}
        </div>

        <div className={`w-8 h-8 rounded-full ${colorBg} border border-current/20 flex items-center justify-center shrink-0 ${colorText}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{group.name}</p>
          <p className="text-[10px] text-muted-foreground">{group.level}</p>
        </div>

        <div className="flex gap-3 shrink-0 text-right">
          <div>
            <p className="text-xs font-bold text-foreground">{group.totalHikes}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Hikes</p>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{group.members}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Members</p>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

const SORTED_GROUPS = [...COMMUNITY_GROUPS].sort((a, b) => b.totalHikes - a.totalHikes);

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("hikers");

  useEffect(() => {
    if (!isOpen) { setMounted(false); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setMounted(false);
    setTimeout(onClose, 220);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") handleClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setActiveTab("hikers");
  }, [isOpen]);

  if (!isOpen) return null;

  const TABS: { key: Tab; label: string; icon: typeof Globe }[] = [
    { key: "hikers",  label: "All Hikers", icon: Globe },
    { key: "friends", label: "Friends",    icon: Users },
    { key: "groups",  label: "Groups",     icon: Mountain },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-lg flex flex-col max-h-[92dvh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
      >
        <div className="h-1 w-full bg-amber-400 shrink-0" />

        <div className="relative px-5 pt-4 pb-5 border-b border-border bg-gradient-to-br from-amber-500/10 via-amber-500/4 to-transparent overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-amber-400/20 rounded-xl scale-125 blur-md animate-pulse pointer-events-none" />
                <div className="relative w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <h2 id="leaderboard-title" className="text-xl font-bold text-amber-400 leading-none">
                  Leaderboards
                </h2>
                <p className="text-sm font-medium text-foreground mt-0.5">Top hikers, friends & groups</p>
                <p className="text-xs text-muted-foreground">Ranked by trails completed</p>
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

        <div className="px-5 pt-3 pb-1 border-b border-border shrink-0">
          <div className="flex gap-1 bg-muted/40 rounded-xl p-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 overflow-y-auto flex-1 scrollbar-themed">
          {activeTab === "hikers" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 mb-1">
                <Medal className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Global Rankings
                </p>
              </div>
              {ALL_HIKERS.map((entry, i) => (
                <HikerRow key={entry.name} entry={entry} index={i} />
              ))}
            </div>
          )}

          {activeTab === "friends" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 mb-1">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Friends Rankings
                </p>
              </div>
              {FRIENDS.map((entry, i) => (
                <HikerRow key={`${entry.name}-${i}`} entry={entry} index={i} />
              ))}
              <div className="flex justify-center mt-3">
                <button className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors cursor-pointer border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/5">
                  + Invite Friends
                </button>
              </div>
            </div>
          )}

          {activeTab === "groups" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 mb-1">
                <Mountain className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Group Rankings · by Total Hikes
                </p>
              </div>
              {SORTED_GROUPS.map((group, i) => (
                <GroupRow key={group.id} group={group} rank={i + 1} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pb-5 pt-3 border-t border-border">
          <button
            onClick={handleClose}
            className="w-full py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-xl hover:bg-muted/50 hover:text-foreground transition-colors duration-150 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
