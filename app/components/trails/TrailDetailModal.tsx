"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  MapPin,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Mountain,
  Footprints,
  X,
  Share2,
  Bookmark,
} from "lucide-react";
import {
  type ModalTab,
  type Trail,
  TRAIL_DETAILS,
  TRAIL_DETAIL_TABS,
  TRAIL_DIFFICULTY_CONFIG,
} from "~/constants/trail-detail";
import { TRAIL_CARD_IMAGES } from "~/constants/trails-page";

function ElevationProfile({ points }: { points: number[] }) {
  const W = 280, H = 64, PAD = 4;
  const xs = points.map((_, i) => PAD + (i / (points.length - 1)) * (W - PAD * 2));
  const ys = points.map((p) => H - PAD - (p / 100) * (H - PAD * 2));
  const linePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${xs[xs.length - 1].toFixed(1)},${(H - PAD).toFixed(1)} L${xs[0].toFixed(1)},${(H - PAD).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="elev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#elev-fill)" />
      <path
        d={linePath}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={xs[0].toFixed(1)} cy={ys[0].toFixed(1)} r="3" fill="var(--primary)" />
      <circle
        cx={xs[xs.length - 1].toFixed(1)}
        cy={ys[ys.length - 1].toFixed(1)}
        r="3"
        fill="var(--primary)"
      />
    </svg>
  );
}

type Props = {
  trail: Trail;
  onClose: () => void;
  user: User | null;
  onAuthRequired: () => void;
};

export default function TrailDetailModal({ trail, onClose, user, onAuthRequired }: Props) {
  const [tab, setTab] = useState<ModalTab>("overview");
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const details = TRAIL_DETAILS[trail.name];
  const cfg = TRAIL_DIFFICULTY_CONFIG[trail.difficulty];
  const imgSrc = TRAIL_CARD_IMAGES[trail.name];
  const router = useRouter();
  const shareRef = useRef<HTMLDivElement>(null);

  function handleLogActivity() {
    if (!user) { onAuthRequired(); return; }
    router.push(`/log-activity?trail=${encodeURIComponent(trail.name)}&location=${encodeURIComponent(trail.location)}`);
  }

  function handleShare() {
    if (!user) { onAuthRequired(); return; }
    setShareOpen((v) => !v);
  }

  function handleSave() {
    if (!user) { onAuthRequired(); return; }
    setSaved((v) => !v);
  }

  useEffect(() => {
    if (!shareOpen) return;
    function onOutside(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    function onEscShare(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEscShare, true);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEscShare, true);
    };
  }, [shareOpen]);

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${trail.name} details`}
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${
        mounted ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 max-h-[90dvh] ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-shrink-0 h-44 overflow-hidden">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={trail.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: imgSrc
                ? "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.60) 100%)"
                : "linear-gradient(135deg, var(--primary) 0%, oklch(0.40 0.21 285) 100%)",
            }}
          />

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.badge}`}>
                {trail.difficulty}
              </span>
              <span className="text-xs text-primary-foreground/70 bg-white/10 px-2 py-1 rounded-full">
                {trail.type}
              </span>
            </div>
            <h2 className="text-xl font-bold text-primary-foreground leading-tight">
              {trail.name}
            </h2>
            <p className="text-xs text-primary-foreground/75 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {trail.location}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-border px-1">
          <div className="flex">
            {TRAIL_DETAIL_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-xs font-semibold tracking-wide transition-colors relative cursor-pointer ${
                  tab === t.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">

          {tab === "overview" && (
            <div className="px-5 py-4 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trail.description}
              </p>
              <div className={`grid gap-2 ${user ? "grid-cols-2" : "grid-cols-3"}`}>
                {[
                  { icon: <MapPin className="w-3.5 h-3.5" />, label: "Distance", value: trail.distance },
                  { icon: <Clock className="w-3.5 h-3.5" />, label: "Duration", value: trail.duration },
                  { icon: <TrendingUp className="w-3.5 h-3.5" />, label: "Elevation", value: trail.elevation },
                  ...(user
                    ? [{ icon: <Calendar className="w-3.5 h-3.5" />, label: "Completed", value: trail.completedAt || "—" }]
                    : []),
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 bg-muted/50 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-primary shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs font-semibold text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Trail Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {details.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Best Season</p>
                  <p className="text-xs font-semibold text-foreground">{details.bestSeason}</p>
                </div>
                <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Avg Pace</p>
                  <p className="text-xs font-semibold text-foreground">{details.pace}</p>
                </div>
                <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Rating</p>
                  <p className="text-xs font-semibold text-foreground flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {trail.rating}
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === "stats" && (
            <div className="px-5 py-4 flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground">Difficulty Score</p>
                  <span className="text-xs font-bold text-primary">
                    {details.difficultyScore}/100
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                    style={{ width: `${details.difficultyScore}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">Easy</span>
                  <span className="text-[10px] text-muted-foreground">Moderate</span>
                  <span className="text-[10px] text-muted-foreground">Hard</span>
                </div>
              </div>
              {[
                {
                  label: "Distance",
                  value: trail.distance,
                  pct: Math.min(100, (parseFloat(trail.distance) / 10) * 100),
                },
                {
                  label: "Duration",
                  value: trail.duration,
                  pct: Math.min(100, (parseFloat(trail.duration) / 6) * 100),
                },
                {
                  label: "Elevation Gain",
                  value: trail.elevation,
                  pct: Math.min(
                    100,
                    (parseInt(trail.elevation.replace(/,/g, ""), 10) / 3000) * 100
                  ),
                },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xs font-semibold text-foreground">{s.value}</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Elevation Profile</p>
                <div className="bg-muted/50 rounded-xl p-3">
                  <ElevationProfile points={details.elevationPoints} />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">Start</span>
                    <span className="text-[10px] text-muted-foreground">↑ {trail.elevation}</span>
                    <span className="text-[10px] text-muted-foreground">Finish</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Avg Pace", value: details.pace },
                  { label: "Best Season", value: details.bestSeason },
                  { label: "Trail Type", value: trail.type },
                ].map((s) => (
                  <div key={s.label} className="bg-muted/50 rounded-xl px-2 py-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-xs font-semibold text-foreground leading-tight">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "highlights" && (
            <div className="px-5 py-4">
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Key waypoints and landmarks along this trail.
              </p>
              <ol className="relative">
                {details.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 pb-5 last:pb-0 relative">
                    {i < details.highlights.length - 1 && (
                      <span className="absolute left-3.5 top-7 bottom-0 w-px bg-border" />
                    )}
                    <span
                      className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        i === details.highlights.length - 1
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {i === details.highlights.length - 1 ? (
                        <Mountain className="w-3.5 h-3.5" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div className="flex-1 pt-0.5">
                      <p
                        className={`text-xs leading-relaxed ${
                          i === details.highlights.length - 1
                            ? "font-semibold text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {h}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-border px-5 py-3 flex gap-2 bg-card">
          <button
            onClick={handleLogActivity}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Footprints className="w-3.5 h-3.5" /> Start Activity
          </button>
          <div ref={shareRef} className="relative">
            {shareOpen && (
              <div className="absolute bottom-full right-0 mb-2.5 bg-card border border-border rounded-2xl shadow-xl px-4 py-3 flex gap-4 z-20">
                <div className="absolute -bottom-[7px] right-5 w-3.5 h-3.5 bg-card border-r border-b border-border rotate-45" />
                <button
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  aria-label="Share on Facebook"
                >
                  <span className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Facebook</span>
                </button>
                <button
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  aria-label="Share on Instagram"
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
                    style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Instagram</span>
                </button>
                <button
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  aria-label="Share on TikTok"
                >
                  <span className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34l-.03-8.41a8.2 8.2 0 004.84 1.56V5.01a4.85 4.85 0 01-1.04-.68z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">TikTok</span>
                </button>
              </div>
            )}
            <button
              onClick={handleShare}
              className={`flex items-center justify-center gap-1.5 border text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors cursor-pointer min-w-[72px] ${
                shareOpen
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent text-foreground"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center justify-center gap-1.5 border text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              saved
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-accent text-foreground"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-primary" : ""}`} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
