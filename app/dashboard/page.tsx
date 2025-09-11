import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { MainContentContainer } from "@/components/dashboard/main/main-content-container";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session) {
    redirect("/sign-in");
  }

  const result = await auth.api.getAccessToken({
    body: {
      providerId: "slack",
      userId: session.user.id,
    },
  });

  console.log("Slack access token:", result.accessToken);

  return (
    <>
      {result.accessToken} <MainContentContainer />
    </>
  );
}
