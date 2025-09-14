import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { SlackOAuthResponse } from "@/types/slack";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const result = (await auth.api.oAuth2Callback({
      method: "GET",
      query: Object.fromEntries(url.searchParams),
      params: { providerId: "slack_oauth2_v2" },
    })) as unknown as SlackOAuthResponse;

    if (!result) {
      throw new Error("Slack provider account missing");
    }

    const workspaceId = result.team?.id;
    const workspaceName = result.team?.name;
    const botToken = result.access_token;

    console.log("Slack workspace connected:", {
      workspaceId,
      workspaceName,
      botToken,
    });

    // DB Capture

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error("Slack OAuth error:", err);

    return NextResponse.redirect(new URL("/error", req.url));
  }
}
