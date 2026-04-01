"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  Clock,
  TrendingUp,
  MapPin,
  Timer,
  Zap,
  Footprints,
} from "lucide-react";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";
import Navbar from "~/components/layout/Navbar";
import { useActivity } from "~/context/ActivityContext";

const TRAIL_COORDS: Record<string, { lat: number; lon: number }> = {
  "Pine Ridge Loop": { lat: 37.8, lon: -79.8 },
  "Summit Crest Trail": { lat: 40.3, lon: -105.6 },
  "Meadow Walk": { lat: 35.6, lon: -83.5 },
  "Canyon Falls Path": { lat: 37.2, lon: -113.0 },
  "Ridgeline Traverse": { lat: 47.5, lon: -121.7 },
  "Lakeside Stroll": { lat: 39.0, lon: -120.0 },
  "Granite Dome Circuit": { lat: 37.7, lon: -119.6 },
  "Highland Moor Path": { lat: 47.8, lon: -123.6 },
  "Deadwood Ravine": { lat: 35.5, lon: -82.5 },
};

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

function LogActivityInner({ user }: { user: User }) {
  const params = useSearchParams();
  const router = useRouter();
  const trailName = params.get("trail") ?? "Trail Activity";
  const location = params.get("location") ?? "";
  const coords = TRAIL_COORDS[trailName];

  const { status, setStatus, elapsed, setMinimized, initActivity, clearActivity } = useActivity();

  const SPAN = 0.06;
  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - SPAN},${coords.lat - SPAN},${coords.lon + SPAN},${coords.lat + SPAN}&layer=mapnik&marker=${coords.lat},${coords.lon}`
    : null;

  useEffect(() => {
    initActivity(trailName, location);
    setMinimized(false);
  }, [initActivity, location, trailName, setMinimized]);

  function handleBack() {
    if (status === "active" || status === "paused") {
      setMinimized(true);
      router.push("/trails");
    } else {
      router.back();
    }
  }

  const secondaryStats = [
    {
      icon: <Footprints className="w-4 h-4" />,
      label: "Distance",
      value: "0.00",
      unit: "mi",
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Elev. Gain",
      value: "0",
      unit: "ft",
    },
    {
      icon: <Timer className="w-4 h-4" />,
      label: "Pace",
      value: status === "idle" || status === "paused" ? "--:--" : "0:00",
      unit: "/mi",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "Speed",
      value: "0.0",
      unit: "mph",
    },
  ];

  return (
    <div className="h-dvh flex flex-col bg-background text-foreground font-sans overflow-hidden">
      <Navbar user={user} activePath="/trails" />

      <div className="relative flex-1 min-h-0 bg-muted">
        {mapSrc ? (
          <iframe
            src={mapSrc}
            title={`Map of ${trailName}`}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-10 h-10 text-primary mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Map unavailable</p>
            </div>
          </div>
        )}

        <button
          onClick={handleBack}
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border text-xs font-semibold px-3 py-2 rounded-xl shadow-md hover:bg-card transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {status === "active" || status === "paused" ? "Minimize" : "Back"}
        </button>

        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 rounded-xl shadow-md text-center max-w-[55vw]">
          <p className="text-xs font-bold text-foreground truncate">{trailName}</p>
          {location && (
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5 mt-0.5">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              {location}
            </p>
          )}
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md ${
              status === "active"
                ? "bg-emerald-500 text-white"
                : status === "paused"
                  ? "bg-amber-400 text-amber-950"
                  : status === "finished"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/90 backdrop-blur-sm border border-border text-muted-foreground"
            }`}
          >
            {status === "idle"
              ? "Ready"
              : status === "active"
                ? "● Tracking"
                : status === "paused"
                  ? "⏸ Paused"
                  : "Complete"}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 bg-card border-t border-border px-4 pt-4 pb-6">
        <div className="flex flex-col items-center mb-3">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Elapsed Time
          </span>
          <span className="text-4xl font-bold tabular-nums text-foreground tracking-tight">
            {formatTime(elapsed)}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {secondaryStats.map((s) => (
            <div
              key={s.label}
              className="bg-muted/60 rounded-xl py-2.5 flex flex-col items-center gap-1"
            >
              <span className="text-primary">{s.icon}</span>
              <p className="text-sm font-bold text-foreground tabular-nums leading-none">
                {s.value}
                <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                  {s.unit}
                </span>
              </p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {status === "idle" && (
          <button
            onClick={() => setStatus("active")}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" /> Start Activity
          </button>
        )}
        {(status === "active" || status === "paused") && (
          <div className="flex gap-2">
            <button
              onClick={() => setStatus(status === "active" ? "paused" : "active")}
              className="flex-1 flex items-center justify-center gap-1.5 border border-border text-sm font-semibold py-3 rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground"
            >
              {status === "active" ? (
                <><Pause className="w-4 h-4" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 fill-current text-primary" /> Resume</>
              )}
            </button>
            <button
              onClick={() => setStatus("finished")}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-500 text-white font-semibold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" /> Finish
            </button>
          </div>
        )}
        {status === "finished" && (
          <button
            onClick={() => { clearActivity(); router.push("/dashboard"); }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Save Activity
          </button>
        )}
      </div>
    </div>
  );
}

export default function LogActivityPage() {
  return (
    <ProtectedRoute>
      {(user) => <LogActivityInner user={user} />}
    </ProtectedRoute>
  );
}
