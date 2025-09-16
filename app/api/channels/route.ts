import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getWorkspaceById } from "@/services/db/operations/workspace.operation";
import { slack } from "@/services/integrations";

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

    const workspace = await getWorkspaceById(workspaceId, true);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    const channels = await slack.channels.getChannels(
      workspace.botToken as string,
    );

    return NextResponse.json({ channels });
  } catch (error) {
    console.error("[Channels API] Error:", error);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
