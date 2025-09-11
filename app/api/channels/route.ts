import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { WebClient } from "@slack/web-api";

import { auth } from "@/lib/auth";
import { getWorkspaceById } from "@/services/db/operations/workspace.operation";

// async function getSlackToken(headers: Headers) {
//   const session = await auth.api.getSession({ headers: headers });
//   if (!session) {
//     throw new Error("Not signed in");
//   }
//   const result = await auth.api.getAccessToken({
//     body: {
//       providerId: "slack",
//       userId: session.user.id,
//     },
//   });
//   if (!result.accessToken) {
//     throw new Error("Slack access token not found");
//   }
//   return result.accessToken;
// }

export async function GET() {
  try {
    const sessionData = await auth.api.getSession({ headers: await headers() });
    const user = sessionData?.user;

    if (!user) {
      console.log("[Channels API] Unauthorized request, no user session found");

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Channels API] User session found:", user);

    const workspaceId = user.workspaceId;

    if (!workspaceId) {
      console.log(
        "[Channels API] No workspaceId associated with user:",
        user.id,
      );

      return NextResponse.json(
        { error: "No workspace linked to user" },
        { status: 400 },
      );
    }

    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      console.log("[Channels API] Workspace not found:", workspaceId);

      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    console.log("[Channels API] Workspace found:", workspace);

    const slack = new WebClient(workspace.botToken);

    console.log("Bot token: ", workspace.botToken);

    // 4. Call Slack API to fetch channels
    const result = await slack.conversations.list();

    console.log("[Channels API] Slack API response:", result);

    return NextResponse.json({ channels: result.channels });
  } catch (error) {
    console.error("[Channels API] Error:", error);

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}

// // === HANDLER FOR: POST /api/slack/channels ===
// // Used to perform an action, like joining a channel.
// export async function POST(request: Request) {
//   await dbConnect();
//   const userId = headers().get("x-user-id");

//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // For POST requests, we get data from the request body.
//     const { channelId } = await request.json();

//     if (!channelId) {
//       return NextResponse.json(
//         { message: "channelId is required" },
//         { status: 400 },
//       );
//     }

//     const slackAccessToken = await getSlackTokenForUser(userId);

//     await joinSlackChannel(slackAccessToken, channelId);

//     return NextResponse.json({
//       message: `Successfully joined channel ${channelId}`,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { message: (error as Error).message },
//       { status: 500 },
//     );
//   }
// }
