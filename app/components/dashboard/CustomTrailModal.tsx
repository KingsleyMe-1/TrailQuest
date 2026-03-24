import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { X, SlidersHorizontal, PlayCircle, MapPin, Mountain, Check, LocateFixed, Loader2, AlertCircle } from "lucide-react";

type GeoStatus = "idle" | "loading" | "success" | "error" | "denied";

interface CustomTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Difficulty = "Easy" | "Moderate" | "Hard";
type TrailType = "Loop" | "Out & Back" | "Point to Point";

const DIFFICULTY_OPTIONS: { value: Difficulty; activeClass: string; inactiveClass: string }[] = [
  {
    value: "Easy",
    activeClass: "bg-emerald-500 text-white border-emerald-500",
    inactiveClass: "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 hover:border-emerald-500/60",
  },
  {
    value: "Moderate",
    activeClass: "bg-primary text-primary-foreground border-primary",
    inactiveClass: "border-primary/30 text-primary bg-primary/10 hover:border-primary/60",
  },
  {
    value: "Hard",
    activeClass: "bg-rose-500 text-white border-rose-500",
    inactiveClass: "border-rose-500/30 text-rose-600 bg-rose-500/10 dark:text-rose-400 hover:border-rose-500/60",
  },
];

const TYPE_OPTIONS: TrailType[] = ["Loop", "Out & Back", "Point to Point"];

export default function CustomTrailModal({ isOpen, onClose }: CustomTrailModalProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const [trailInput, setTrailInput] = useState("");
  const [location, setLocation] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [trailType, setTrailType] = useState<TrailType | null>(null);
  const [trailError, setTrailError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (!res.ok) throw new Error("Reverse geocode failed");
          const data = await res.json();
          const addr = data.address ?? {};
          const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? "";
          const state = addr.state ?? "";
          const country_code = (addr.country_code ?? "").toUpperCase();
          const label = [city, state || country_code].filter(Boolean).join(", ");
          setLocation(label || data.display_name?.split(",").slice(0, 2).join(",").trim() || "");
          setGeoStatus("success");
        } catch {
          setGeoStatus("error");
        }
      },
      (err) => {
        setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { timeout: 10000 }
    );
  }

  useEffect(() => {
    if (!isOpen) {
      setMounted(false);
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setMounted(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTrailInput("");
      setLocation("");
      setDifficulty(null);
      setTrailType(null);
      setTrailError(false);
      setLocationError(false);
      setGeoStatus("idle");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleSubmit() {
    const name = trailInput.trim();
    const loc = location.trim();
    let hasError = false;
    if (!name) { setTrailError(true); hasError = true; }
    if (!loc) { setLocationError(true); hasError = true; }
    if (hasError) {
      if (!name) inputRef.current?.focus();
      return;
    }
    const params = new URLSearchParams();
    params.set("trail", name);
    params.set("location", loc);
    navigate(`/log-activity?${params.toString()}`);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-trail-title"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full sm:max-w-md flex flex-col max-h-[90dvh] sm:max-h-[92dvh] bg-card border-t sm:border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl transition-all duration-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 sm:scale-95"
        }`}
      >
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden" aria-hidden="true">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-4 sm:px-6 pt-3 sm:pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 id="custom-trail-title" className="text-base font-semibold text-foreground leading-tight">
                Custom Trail
              </h2>
              <p className="text-xs text-muted-foreground">Pick an existing trail or create your own</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 overflow-y-auto flex-1">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trail-name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Trail Name <span className="text-rose-500 normal-case font-normal tracking-normal">*</span>
            </label>
            <div className="relative">
              <Mountain className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="trail-name"
                ref={inputRef}
                type="text"
                value={trailInput}
                onChange={(e) => {
                  setTrailInput(e.target.value);
                  setTrailError(false);
                }}
                placeholder="Enter a custom trail name…"
                autoComplete="off"
                className={`w-full pl-9 pr-3 py-2.5 text-sm bg-background border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
                  trailError ? "border-rose-500 ring-2 ring-rose-500/30" : "border-border"
                }`}
              />
            </div>
            {trailError && (
              <p className="text-xs text-rose-500">Please enter a trail name to continue.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trail-location" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Location <span className="text-rose-500 normal-case font-normal tracking-normal">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="trail-location"
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setGeoStatus("idle"); setLocationError(false); }}
                  placeholder="e.g. Blue Ridge, VA"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm bg-background border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
                    locationError ? "border-rose-500 ring-2 ring-rose-500/30" : "border-border"
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={fetchCurrentLocation}
                disabled={geoStatus === "loading" || geoStatus === "denied"}
                title={
                  geoStatus === "denied"
                    ? "Location access denied — please allow it in your browser settings"
                    : geoStatus === "error"
                    ? "Could not get location — try again"
                    : "Use my current location"
                }
                className={`w-full sm:w-auto flex items-center justify-center gap-1.5 shrink-0 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  geoStatus === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : geoStatus === "denied"
                    ? "bg-muted border-border text-muted-foreground/40 cursor-not-allowed"
                    : geoStatus === "error"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                    : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                }`}
              >
                {geoStatus === "loading" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : geoStatus === "error" ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5" />
                )}
                {geoStatus === "loading"
                  ? "Locating…"
                  : geoStatus === "success"
                  ? "Located"
                  : geoStatus === "denied"
                  ? "Denied"
                  : geoStatus === "error"
                  ? "Retry"
                  : "Use My Location"}
              </button>
            </div>
            {geoStatus === "denied" && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Location access was denied. Enable it in your browser settings.
              </p>
            )}
            {geoStatus === "error" && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Couldn't retrieve your location. Please try again or type it manually.
              </p>
            )}
            {locationError && geoStatus !== "denied" && geoStatus !== "error" && (
              <p className="text-xs text-rose-500">Please enter a starting location to continue.</p>
            )}
          </div>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
              Difficulty <span className="font-normal tracking-normal normal-case text-muted-foreground/60">(optional)</span>
            </legend>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(difficulty === opt.value ? null : opt.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                    difficulty === opt.value ? opt.activeClass : opt.inactiveClass
                  }`}
                >
                  {difficulty === opt.value && <Check className="w-3 h-3" />}
                  {opt.value}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
              Trail Type <span className="font-normal tracking-normal normal-case text-muted-foreground/60">(optional)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTrailType(trailType === opt ? null : opt)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                    trailType === opt
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground bg-muted/50 hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {trailType === opt && <Check className="w-3 h-3" />}
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="px-4 sm:px-6 pb-5 pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-t border-border">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-center text-muted-foreground hover:text-foreground border border-border sm:border-transparent rounded-xl sm:rounded-none transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" /> Start Activity
          </button>
        </div>
      </div>
    </div>
  );
}
