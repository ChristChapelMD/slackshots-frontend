import { NextResponse } from "next/server";

import { SlackOAuthResponse } from "@/types/slack";
import { createOrUpdateWorkspace } from "@/services/db/operations/workspace.operation";
import { auth } from "@/lib/auth";
import {
  createOrUpdateUserWorkspaceRelation,
  getUserWorkspaceRelation,
} from "@/services/db/operations/userworkspace.operation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error("Missing code from Slack");
  }

  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      console.error("No user session found during OAuth callback");

      return NextResponse.redirect(
        new URL("/error?message=no_session", request.url),
      );
    }

    const user = session.user;

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
      console.error("Slack OAuth error response:", data);
      throw new Error(data.error || "Slack OAuth exchange failed");
    }

    await createOrUpdateWorkspace({
      workspaceId: data.team.id,
      workspaceName: data.team.name,
      botToken: data.access_token,
      botUserId: data.bot_user_id,
      scope: data.scope,
      enterpriseId: data.enterprise?.id,
      enterpriseName: data.enterprise?.name,
    });

    const userWorkspaceRelation = await getUserWorkspaceRelation(
      user.id,
      data.team.id,
    );

    if (!userWorkspaceRelation) {
      await createOrUpdateUserWorkspaceRelation(user.id, data.team.id);
      console.log(
        `Created member relationship between user ${user.id} and workspace ${data.team.id}`,
      );
    } else {
      console.log(
        `User ${user.id} is already linked to workspace ${data.team.id}`,
      );
    }

    const redirectUrl = new URL("/dashboard", request.url);

    redirectUrl.searchParams.set("workspace", data.team.id);
    redirectUrl.searchParams.set("success", "true");

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("lastWorkspaceId", data.team.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });

    return response;
  } catch (err) {
    console.error("Slack OAuth error:", err);

    return NextResponse.redirect(new URL("/error", request.url));
  }
}
