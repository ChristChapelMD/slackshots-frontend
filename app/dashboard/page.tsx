import { Metadata } from "next";

import { MainContentContainer } from "@/components/dashboard/main/main-content-container";
//import { IntersectionObserverVisualizer } from "@/components/ui/intersection-observer-visualizer";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <MainContentContainer />;
}
