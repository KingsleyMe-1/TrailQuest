import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownOption<T extends string> = T | { label: string; value: T };

function getOptionValue<T extends string>(opt: DropdownOption<T>): T {
  return typeof opt === "string" ? opt : opt.value;
}

function getOptionLabel<T extends string>(opt: DropdownOption<T>): string {
  return typeof opt === "string" ? opt : opt.label;
}

type Props<T extends string> = {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (v: T) => void;
  active: boolean;
  fullWidth?: boolean;
  menuAlign?: "left" | "right";
};

export default function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  active,
  fullWidth = false,
  menuAlign = "left",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel =
    getOptionLabel(options.find((o) => getOptionValue(o) === value) ?? value);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative${fullWidth ? " flex-1" : ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-all cursor-pointer${
          fullWidth ? " w-full justify-between" : ""
        } ${
          active
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
        }`}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 shrink-0">
            {label}
          </span>
          <span className={`truncate ${active ? "text-primary font-semibold" : "text-foreground"}`}>
            {selectedLabel}
          </span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden ${
            fullWidth ? "w-full" : "min-w-[140px]"
          } ${menuAlign === "right" ? "right-0" : "left-0"}`}
        >
          {options.map((opt) => {
            const optValue = getOptionValue(opt);
            const optLabel = getOptionLabel(opt);
            return (
              <button
                key={optValue}
                onClick={() => {
                  onChange(optValue);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  optValue === value
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {optLabel}
                {optValue === value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
