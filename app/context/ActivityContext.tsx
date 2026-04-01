import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

export type ActivityStatus = "idle" | "active" | "paused" | "finished";

interface ActivityContextValue {
  status: ActivityStatus;
  elapsed: number;
  trailName: string;
  location: string;
  minimized: boolean;
  setStatus: (s: ActivityStatus) => void;
  setMinimized: (v: boolean) => void;
  initActivity: (name: string, loc: string) => void;
  clearActivity: () => void;
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ActivityStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [trailName, setTrailName] = useState("");
  const [location, setLocation] = useState("");
  const [minimized, setMinimized] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "active") {
      intervalRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  const initActivity = useCallback((name: string, loc: string) => {
    setTrailName(name);
    setLocation(loc);
  }, []);

  const clearActivity = useCallback(() => {
    setStatus("idle");
    setElapsed(0);
    setTrailName("");
    setLocation("");
    setMinimized(false);
  }, []);

  return (
    <ActivityContext.Provider
      value={{
        status,
        elapsed,
        trailName,
        location,
        minimized,
        setStatus,
        setMinimized,
        initActivity,
        clearActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
}
