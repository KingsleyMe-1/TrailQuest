"use client";

import { useRouter } from "next/navigation";
import { Pause, Play, Square, MapPin, ChevronUp } from "lucide-react";
import { useActivity } from "~/context/ActivityContext";

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function ActivityWidget() {
  const { status, elapsed, trailName, location, minimized, setStatus, setMinimized } =
    useActivity();
  const router = useRouter();

  if (!minimized || (status !== "active" && status !== "paused")) return null;

  function handleExpand() {
    setMinimized(false);
    router.push(
      `/log-activity?trail=${encodeURIComponent(trailName)}&location=${encodeURIComponent(location)}`
    );
  }

  function handleFinish() {
    setStatus("finished");
    setMinimized(false);
    router.push(
      `/log-activity?trail=${encodeURIComponent(trailName)}&location=${encodeURIComponent(location)}`
    );
  }

  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:min-w-[360px] sm:max-w-[440px] z-50">
      <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div
          className={`h-1 transition-colors ${
            status === "active" ? "bg-emerald-500" : "bg-amber-400"
          }`}
        />
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    status === "active" ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {status === "active" ? "Tracking" : "Paused"}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground truncate leading-tight">
                {trailName}
              </p>
              {location && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  {location}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold tabular-nums text-foreground tracking-tight">
                {formatTime(elapsed)}
              </p>
              <p className="text-[10px] text-muted-foreground">elapsed</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus(status === "active" ? "paused" : "active")}
              className="flex-1 flex items-center justify-center gap-1.5 border border-border text-xs font-semibold py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground"
            >
              {status === "active" ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-primary" /> Resume
                </>
              )}
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Finish
            </button>
            <button
              onClick={handleExpand}
              aria-label="Expand tracker"
              className="w-10 flex items-center justify-center border border-border rounded-xl hover:bg-accent transition-colors cursor-pointer text-foreground"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
