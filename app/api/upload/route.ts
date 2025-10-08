import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { api } from "@/services/api";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const cookieStore = await cookies();
    const lastWorkspaceId = cookieStore.get("lastWorkspaceId")?.value;

    if (!lastWorkspaceId) {
      throw new Error("No workspace selected or linked");
    }

    const workspace = await api.db.workspace.getWorkspaceById(
      lastWorkspaceId,
      true,
    );

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const formData = await request.formData();
    const result = await api.upload.processAndUpload(
      "slack",
      {
        botToken: workspace.botToken as string,
        userId: api.db.utils.toObjectId(user.id),
        workspaceId: workspace._id,
      },
      formData,
    );

    return NextResponse.json({ data: result.uploadResponseArray });
  } catch (error) {
    console.error("[Process Batch API] Error:", error);

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
