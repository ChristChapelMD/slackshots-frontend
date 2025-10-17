import { NextResponse, NextRequest } from "next/server";

import { api } from "@/services/api";

export async function GET(request: NextRequest) {
  const currentWorkspaceId = request.cookies.get("lastWorkspaceId")?.value;

  if (!currentWorkspaceId) {
    return NextResponse.json(
      { error: "No workspace selected" },
      { status: 400 },
    );
  }

  try {
    const workspace = await api.db.workspace.getWorkspaceBySlackId(
      currentWorkspaceId,
      false,
    );

    if (!workspace) {
      return NextResponse.json({ workspace: null });
    }

    return NextResponse.json({ workspace });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ workspace: null });
  }
}
