import type { User } from "@supabase/supabase-js";
import { ProfileMenu } from "~/components/ProfileMenu";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", requiresAuth: true },
  { label: "Trails", href: "/trails", requiresAuth: false },
  { label: "Map", href: "#", requiresAuth: false },
  { label: "Community", href: "#", requiresAuth: true },
];

type Props = {
  /** Highlights the nav link whose href matches this value. */
  activePath?: string;
  /** Authenticated user — renders ProfileMenu when provided. */
  user?: User | null;
  /** Called when the Sign Up button is clicked (shown only when user is falsy). */
  onSignUpClick?: () => void;
};

export default function Navbar({ activePath, user, onSignUpClick }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-lg font-bold tracking-tight">
          <span className="font-normal">Trail</span>
          <span className="text-primary">Quest</span>
        </a>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          {NAV_LINKS.filter(({ requiresAuth }) => !requiresAuth || !!user).map(({ label, href }) => (
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

        {user ? (
          <ProfileMenu user={user} />
        ) : (
          <button
            onClick={onSignUpClick}
            className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Sign Up
          </button>
        )}
      </div>
    </header>
  );
}
