import { NextResponse } from "next/server";
import { SlackOAuthResponse } from "@/types/slack";
import { createOrUpdateWorkspace } from "@/services/db/operations/workspace.operation";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error("Missing code from Slack");
  }

  try {
    const slackOauthResponse = await fetch(
      "https://slack.com/api/oauth.v2.access",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.SLACK_CLIENT_ID!,
          client_secret: process.env.SLACK_CLIENT_SECRET!,
          code,
          redirect_uri: process.env.SLACK_OAUTH2_V2_REDIRECT_URI!,
        }),
      },
    );

    const data: SlackOAuthResponse = await slackOauthResponse.json();

    if (!data.ok) {
      throw new Error(data.error || "Slack OAuth exchange failed");
    }

    const workspaceId = data.team.id;
    const workspaceName = data.team.name;
    const botToken = data.access_token;
    const botUserId = data.bot_user_id;
    const scope = data.scope;
    const enterpriseId = data.enterprise?.id;
    const enterpriseName = data.enterprise?.name;

    const workspace = await createOrUpdateWorkspace({
      workspaceId,
      name: workspaceName,
      botToken,
      botUserId,
      scope,
    });

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // DB Capture

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error("Slack OAuth error:", err);

    return NextResponse.redirect(new URL("/error", req.url));
  }
}
