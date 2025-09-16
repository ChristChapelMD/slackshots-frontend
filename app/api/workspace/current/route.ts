import { NextResponse, NextRequest } from "next/server";

import { getWorkspaceById } from "@/services/db/operations/workspace.operation";

export async function GET(request: NextRequest) {
  const currentWorkspaceId = request.cookies.get("lastWorkspaceId")?.value;

  if (!currentWorkspaceId) {
    return NextResponse.json(
      { error: "No workspace selected" },
      { status: 400 },
    );
  }

  try {
    const workspace = await getWorkspaceById(currentWorkspaceId, false);

    if (!workspace) {
      return NextResponse.json({ workspace: null });
    }

    return NextResponse.json({ workspace });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ workspace: null });
  }
}
