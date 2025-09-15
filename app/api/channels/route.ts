import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getWorkspaceById } from "@/services/db/operations/workspace.operation";
import { getSlackChannels } from "@/services/slack/channels";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const workspaceId = cookieStore.get("lastWorkspaceId")?.value;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "No workspace selected or linked" },
        { status: 400 },
      );
    }

    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    // ✅ Fetch Slack channels using bot token
    const channels = await getSlackChannels(workspace.botToken);

    return NextResponse.json({ channels });
  } catch (error) {
    console.error("[Channels API] Error:", error);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
