"use client";

import { ActivityProvider } from "~/context/ActivityContext";
import ActivityWidget from "~/components/activity/ActivityWidget";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ActivityProvider>
      {children}
      <ActivityWidget />
    </ActivityProvider>
  );
}
