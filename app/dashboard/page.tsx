import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { MainContentContainer } from "@/components/dashboard/main/main-content-container";
//import { IntersectionObserverVisualizer } from "@/components/ui/intersection-observer-visualizer";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return <MainContentContainer />;
}
