import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { headers } from "next/headers";

import { api } from "@/services/api";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
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

    const workspace = await api.db.workspace.getWorkspaceById(
      workspaceId,
      true,
    );

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const {
      responses: blobResponses,
      channel,
      comment,
      messageBatchSize,
    } = body;

    if (!channel) {
      return NextResponse.json(
        { error: "No channel selected" },
        { status: 400 },
      );
    }

    if (!blobResponses || blobResponses.length) {
      return NextResponse.json({ error: "No files selected" }, { status: 400 });
    }

    const files: { file: string; filename: string }[] = blobResponses.map(
      (blobResponse: any) => ({
        file: blobResponse.response.url,
        filename: blobResponse.originalFileName,
      }),
    );

    const uploadResponse = await api.slack.upload.uploadFiles(
      workspace.botToken as string,
      files,
      channel,
      comment,
    );

    return NextResponse.json({ data: uploadResponse.uploadResponseArray });
  } catch (error) {
    console.error("[Uploads API (Provider: Slack)] Error:", error);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
