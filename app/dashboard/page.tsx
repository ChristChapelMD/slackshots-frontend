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

  async function getSlackToken(headers: Headers) {
    const session = await auth.api.getSession({ headers: headers });
    if (!session) {
      throw new Error("Not signed in");
    }
    const result = await auth.api.getAccessToken({
      body: {
        providerId: "slack",
        userId: session.user.id,
      },
    });
    if (!result.accessToken) {
      throw new Error("Slack access token not found");
    }
    return result.accessToken;
  }

  console.log(getSlackToken(await headers()));

  if (!session) {
    redirect("/sign-in");
  }

  return <MainContentContainer />;
}
