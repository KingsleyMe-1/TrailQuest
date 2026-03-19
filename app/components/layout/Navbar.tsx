import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  X,
  LogIn,
  Compass,
} from "lucide-react";
import { ProfileMenu } from "~/components/user/ProfileMenu";
import { AUTH_LINKS, GUEST_LINKS } from "~/constants/navigation";

type Props = {
  activePath?: string;
  user?: User | null;
  onSignUpClick?: () => void;
};

export default function Navbar({ activePath, user, onSignUpClick }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  const visibleLinks = user ? AUTH_LINKS : GUEST_LINKS;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">
            <span className="font-normal">Trail</span>
            <span className="text-primary">Quest</span>
          </a>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            {visibleLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={
                  activePath === href
                    ? "text-foreground font-medium"
                    : "hover:text-foreground transition-colors"
                }
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <ProfileMenu user={user} />
            ) : (
              <button
                onClick={onSignUpClick}
                className="hidden sm:inline-flex bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Sign Up
              </button>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`sm:hidden fixed inset-0 z-[55] bg-background transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        aria-label="Mobile navigation"
        className={`sm:hidden fixed top-0 right-0 h-full w-72 z-[60] flex flex-col
          bg-background/80 backdrop-blur-2xl border-l border-border/60
          shadow-2xl transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-end px-5 py-4 border-b border-border/60">
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-1">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Navigation
          </p>
          {visibleLinks.map(({ label, href, icon: Icon }) => {
            const isActive = activePath === href;
            return (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/15"
                    : "bg-secondary group-hover:bg-background"
                }`}>
                  <Icon size={16} />
                </span>
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/80" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="px-3 py-5 border-t border-border/60 flex flex-col gap-3">
          {!user && (
            <>
              <div className="flex items-center gap-3 px-1">
                <Compass size={14} className="text-primary" />
                <p className="text-xs text-muted-foreground">
                  Join to track trails &amp; earn badges
                </p>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onSignUpClick?.();
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <LogIn size={16} />
                Sign Up / Log In
              </button>
            </>
          )}
          {user && (
            <div className="flex items-center gap-3 px-1">
              <ProfileMenu user={user} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-foreground truncate">
                  {user.user_metadata?.full_name ?? user.email}
                </span>
                <span className="text-[10px] text-muted-foreground">Signed in</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

