"use client";

import dynamic from "next/dynamic";

// Dynamically import the dashboard with SSR disabled
// This prevents prerendering issues with the useStream hook
const StreamingDashboard = dynamic(
  () => import("@/components/StreamingDashboard"),
  { ssr: false }
);

export default function Home() {
  return <StreamingDashboard />;
}
