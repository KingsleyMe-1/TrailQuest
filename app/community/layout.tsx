import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Connect with fellow hikers, join trail groups, and discover upcoming hike events.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
