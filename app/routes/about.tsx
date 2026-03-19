import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Mountain,
  Map,
  MapPin,
  Users,
  Trophy,
  Shield,
  Zap,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Code2,
  Layers,
  Database,
  Palette,
  Package,
  Server,
  ChevronDown,
} from "lucide-react";
import type { Route } from "./+types/about";
import { supabase } from "~/lib/supabase";
import { AuthModal, type AuthMode } from "~/components/AuthModal";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - TrailQuest" },
    {
      name: "description",
      content:
        "Learn about TrailQuest — the story, the developer, and the technology stack behind the app.",
    },
  ];
}

const FEATURES = [
  {
    icon: Map,
    title: "Trail Discovery",
    description:
      "Browse and filter hundreds of trails by difficulty, distance, type, and rating. Every trail is detailed with elevation profiles and waypoint highlights.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description:
      "Log completed hikes, earn achievement badges, and watch your stats grow. Your personal dashboard keeps every adventure on record.",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Community Groups",
    description:
      "Join groups that match your pace and passion — from beginner-friendly strolls to elite endurance challenges. Never hike alone.",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: Mountain,
    title: "Upcoming Hike Events",
    description:
      "Discover community-organised hike announcements, RSVP instantly, and stay in the loop with real-time spot availability.",
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Authentication is handled by Supabase with row-level security. Your data belongs to you — always encrypted in transit and at rest.",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Built with Vite and React Router v7 SSR for sub-second navigation. Optimised images, code-split routes, and minimal JavaScript on the wire.",
    color: "text-rose-500 bg-rose-500/10",
  },
];

const TECH_STACK = [
  {
    category: "Framework",
    icon: Layers,
    items: [
      { name: "React 19", note: "UI rendering & state" },
      { name: "React Router v7", note: "SSR + file-based routing" },
      { name: "TypeScript 5", note: "Strict type safety" },
    ],
  },
  {
    category: "Styling",
    icon: Palette,
    items: [
      { name: "Tailwind CSS 4", note: "Utility-first, oklch colors" },
      { name: "CSS Custom Properties", note: "Themeable design tokens" },
      { name: "Dark Mode", note: "Class-based, flash-free" },
    ],
  },
  {
    category: "Backend & Auth",
    icon: Database,
    items: [
      { name: "Supabase", note: "Postgres + Auth + Storage" },
      { name: "Row-Level Security", note: "Fine-grained data access" },
      { name: "JWT Sessions", note: "Persistent auth across tabs" },
    ],
  },
  {
    category: "Build & Deploy",
    icon: Server,
    items: [
      { name: "Vite 7", note: "HMR & optimised bundling" },
      { name: "Docker", note: "Multi-stage production build" },
      { name: "Vercel", note: "Edge deployment preset" },
    ],
  },
  {
    category: "UI Components",
    icon: Package,
    items: [
      { name: "lucide-react", note: "Consistent icon set" },
      { name: "Google Fonts", note: "Roboto, Playfair, Fira Code" },
      { name: "Custom Components", note: "Zero external UI framework" },
    ],
  },
  {
    category: "Developer Tools",
    icon: Code2,
    items: [
      { name: "ESLint + Prettier", note: "Code quality & formatting" },
      { name: "tsconfig paths", note: "Clean ~ import aliases" },
      { name: "vite-tsconfig-paths", note: "Path resolution plugin" },
    ],
  },
];

const TIMELINE = [
  {
    version: "v0.1",
    date: "Jan 2026",
    title: "Foundation",
    description: "Project scaffolded with React Router v7, Supabase auth, and the base design system.",
  },
  {
    version: "v0.2",
    date: "Feb 2026",
    title: "Trail Engine",
    description: "Trail directory with search, filters, sorting, and the tabbed TrailDetailModal with SVG elevation chart.",
  },
  {
    version: "v0.3",
    date: "Mar 2026",
    title: "Community & Polish",
    description: "Community groups, hike announcements, responsive mobile drawer, dark mode, and avatar uploads.",
  },
  {
    version: "v1.0",
    date: "Coming Soon",
    title: "Full Launch",
    description: "Real-time activity feeds, map integration, challenge system, and native mobile app.",
    upcoming: true,
  },
];

const FAQS = [
  {
    question: "Is TrailQuest free to use?",
    answer:
      "Yes — TrailQuest is completely free for all core features: browsing trails, joining groups, and RSVPing to hike events. Premium tiers with offline maps and guided routes are planned for v1.0.",
  },
  {
    question: "Can I contribute trail data?",
    answer:
      "Community-submitted trails are on the roadmap. Once the trail submission form ships you will be able to add GPS routes, photos, and conditions reports directly from the app.",
  },
  {
    question: "How is my data stored?",
    answer:
      "All user data is stored in a Supabase Postgres database with row-level security. Passwords are never stored — Supabase handles authentication with JWT tokens. Avatar images are stored in Supabase Storage.",
  },
  {
    question: "What platforms are supported?",
    answer:
      "TrailQuest is a responsive web app optimised for desktop and mobile browsers. A native iOS and Android app built with React Native is planned for the v1.0 launch.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors cursor-pointer gap-4"
      >
        {question}
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function About() {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AuthModal
        isOpen={modalOpen}
        mode={authMode}
        onClose={() => setModalOpen(false)}
        onSwitchMode={(m) => setAuthMode(m)}
        onAuthSuccess={(u) => { setUser(u); setModalOpen(false); }}
      />
      <Navbar
        activePath="/about"
        user={user}
        onSignUpClick={() => { setAuthMode("signup"); setModalOpen(true); }}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-emerald-500/8 blur-3xl pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 mb-5">
              <Globe size={12} /> Open-source & community first
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5 leading-tight">
              Built for hikers,
              <br />
              <span className="text-primary">by a hiker.</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              TrailQuest started as a personal frustration — trail apps were cluttered, slow, and social features were an afterthought. This is the app I wanted to use.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: "9+", label: "Trails catalogued" },
              { value: "6",  label: "Community groups" },
              { value: "4",  label: "Upcoming events" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-4xl font-bold text-primary">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-secondary/20">
          <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">What TrailQuest Does</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
                Every feature was designed around one question: what would make a real hiker's day better?
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${f.color}`}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">The Developer</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                One person, one mission, one trail at a time.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative bg-card/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 group">

                <div className="relative h-44 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-primary/60" />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                  />
                  <div className="absolute top-4 right-10 w-20 h-20 rounded-full bg-white/10 blur-xl animate-pulse" />
                  <div className="absolute bottom-2 left-16 w-14 h-14 rounded-full bg-violet-300/20 blur-lg" />
                  <div className="absolute top-8 left-1/3 w-8 h-8 rounded-full bg-white/15 blur-md" />

                  <div className="absolute bottom-4 right-5 flex items-center gap-2">
                    {[
                      { num: "2+",  label: "Yrs Exp" },
                      { num: "5", label: "Projects" },
                      { num: "∞",   label: "Coffees" },
                    ].map(({ num, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5"
                      >
                        <span className="text-white font-bold text-sm leading-none">{num}</span>
                        <span className="text-white/70 text-[10px] mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 pt-0 pb-7 grid grid-cols-1 md:grid-cols-5 gap-6">

                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="-mt-10 flex items-end gap-3">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-600 border-4 border-card flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                          KJ
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-card" />
                        </span>
                      </div>
                      <div className="mb-1">
                        <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Available for work</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-foreground">Kingsley J.</h3>
                      <p className="text-sm text-primary font-medium">Full-Stack Developer</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Trail Enthusiast · Gamer  · Adrenaline Junkie</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin size={11} className="text-primary" />
                      <span>Lahug, Cebu City</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[
                        { href: "https://github.com/KingsleyMe-1",   Icon: Github,   label: "GitHub" },
                        { href: "https://twitter.com",  Icon: Twitter,  label: "Twitter" },
                        { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
                        { href: "mailto:kjdigman132@gmail.com", Icon: Mail, label: "Email" },
                      ].map(({ href, Icon, label }) => (
                        <a
                          key={label}
                          href={href}
                          target={href.startsWith("mailto") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="p-2 rounded-xl bg-secondary/60 backdrop-blur-sm border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                        >
                          <Icon size={14} />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3 flex flex-col gap-5 md:pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Passionate about building purposeful software and getting outside.
                      TrailQuest is my attempt to merge both worlds — a fast, beautiful,
                      community-driven app for people who love the outdoors as much as
                      they love good UX.
                    </p>

                    <div className="flex flex-col gap-3">
                      {[
                        {
                          group: "Frontend",
                          color: "text-primary border-primary/30 bg-primary/8 hover:bg-primary/15",
                          skills: ["React 19", "TypeScript", "Tailwind CSS", "Vite"],
                        },
                        {
                          group: "Backend",
                          color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/8 hover:bg-emerald-400/15",
                          skills: ["Supabase", "Node.js", "PostgreSQL"],
                        },
                        {
                          group: "Craft",
                          color: "text-violet-400 border-violet-400/30 bg-violet-400/8 hover:bg-violet-400/15",
                          skills: ["UI/UX Design", "Docker", "Git"],
                        },
                      ].map(({ group, color, skills }) => (
                        <div key={group} className="flex items-start gap-2 flex-wrap">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mt-1.5 w-16 shrink-0">
                            {group}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((s) => (
                              <span
                                key={s}
                                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border cursor-default transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm ${color}`}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href="mailto:kjdigman132@gmail.com"
                        className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
                      >
                        <Mail size={13} /> Get in touch
                      </a>
                      <a
                        href="https://github.com/KingsleyMe-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                      >
                        <Github size={13} /> View GitHub
                      </a>
                    </div>
                  </div>

                </div>

                <div className="mx-6 mb-5 rounded-2xl bg-secondary/40 backdrop-blur-sm border border-white/5 px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-xs text-muted-foreground italic">"The best trail is the one you haven't hiked yet."</p>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    <Heart size={11} className="fill-primary" />
                    Made with passion
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/20">
          <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Under the Hood</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Modern, battle-tested tools chosen for developer experience and production reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TECH_STACK.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.category}
                    className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                        <Icon size={15} />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                        {cat.category}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {cat.items.map((item) => (
                        <div key={item.name} className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                          <span className="text-[11px] text-muted-foreground shrink-0">{item.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">The Journey</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              From first commit to community launch — here's how TrailQuest evolved.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="flex flex-col gap-8">
              {TIMELINE.map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 shrink-0 text-[11px] font-bold ${
                    step.upcoming
                      ? "border-dashed border-border text-muted-foreground bg-background"
                      : "border-primary bg-primary/10 text-primary"
                  }`}>
                    {step.version}
                  </div>
                  <div className={`flex-1 bg-card border rounded-2xl px-5 py-4 ${
                    step.upcoming ? "border-dashed border-border opacity-60" : "border-border"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                      <span className="text-[11px] text-muted-foreground">{step.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    {step.upcoming && (
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/20">
          <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Frequently Asked</h2>
              <p className="text-muted-foreground text-sm">Quick answers to common questions.</p>
            </div>
            <div className="flex flex-col gap-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 rounded-3xl px-6 py-14 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <Heart className="mx-auto mb-4 text-primary" size={28} />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join the Trail Community</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
              TrailQuest is growing. Whether you're a weekend walker or an ultramarathon runner, there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => { setAuthMode("signup"); setModalOpen(true); }}
                className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Create Free Account
              </button>
              <a
                href="/trails"
                className="px-6 py-3 border border-border text-sm font-medium rounded-xl hover:bg-secondary transition-colors"
              >
                Explore Trails
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
