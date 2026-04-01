import type { Metadata, Viewport } from "next";
import "./app.css";
import Providers from "~/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "TrailQuest – Discover Your Next Adventure",
    template: "%s | TrailQuest",
  },
  description:
    "Explore thousands of trails, track your progress, and connect with fellow hikers.",
  metadataBase: new URL("https://trailquest.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "TrailQuest",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/* Apply theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('trailquest-theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
