import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const result = await auth.api.oAuth2Callback({
      method: "GET",
      query: {
        code: url.searchParams.get("code") ?? undefined,
        state: url.searchParams.get("state") ?? undefined,
        error: url.searchParams.get("error") ?? undefined,
        error_description:
          url.searchParams.get("error_description") ?? undefined,
      },
      params: {
        providerId: "slack_oauth2_v2",
      },
    });

    console.log("Slack workspace data:", result);

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error("Slack OAuth error:", err);

    return NextResponse.redirect(new URL("/error", req.url));
  }
}
