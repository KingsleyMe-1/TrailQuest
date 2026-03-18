import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrailQuest - Discover Your Next Adventure" },
    {
      name: "description",
      content:
        "Explore thousands of trails, track your progress, and connect with fellow hikers.",
    },
  ];
}

const trails = [
  {
    name: "Pine Ridge Loop",
    location: "Blue Ridge, VA",
    difficulty: "Moderate",
    distance: "5.2 mi",
    rating: 4.7,
  },
  {
    name: "Summit Crest Trail",
    location: "Rocky Mountain, CO",
    difficulty: "Hard",
    distance: "8.9 mi",
    rating: 4.9,
  },
  {
    name: "Meadow Walk",
    location: "Smoky Mountains, TN",
    difficulty: "Easy",
    distance: "2.4 mi",
    rating: 4.5,
  },
];

const difficultyStyle: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-secondary text-secondary-foreground",
  Hard: "bg-red-100 text-red-600",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            <span className="font-normal">Trail</span>
            <span className="text-primary">Quest</span>
          </span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Trails</a>
            <a href="#" className="hover:text-foreground transition-colors">Map</a>
            <a href="#" className="hover:text-foreground transition-colors">Community</a>
          </nav>
          <button className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground px-4 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Discover Your Next Adventure
          </h1>
          <p className="text-sm sm:text-base opacity-90 mb-8">
            Explore thousands of trails, track your progress, and connect with
            fellow hikers.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search trails or locations..."
              className="flex-1 min-w-0 px-4 py-2.5 rounded-lg text-sm text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="bg-background text-primary font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Trails */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Featured Trails</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trails.map((trail) => (
              <div
                key={trail.name}
                className="border border-border rounded-xl p-4 flex flex-col gap-3 bg-card shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-card-foreground">{trail.name}</p>
                    <p className="text-xs text-primary mt-0.5">{trail.location}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                      difficultyStyle[trail.difficulty]
                    }`}
                  >
                    {trail.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>📍 {trail.distance}</span>
                  <span>★ {trail.rating}</span>
                </div>
                <button className="w-full border border-border text-primary text-sm font-medium py-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  View Trail
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © 2026 TrailQuest. All rights reserved.
      </footer>
    </div>
  );
}
