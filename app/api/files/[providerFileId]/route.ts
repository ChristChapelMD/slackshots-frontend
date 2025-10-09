import { NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs/promises";
import path from "path";

import { auth } from "@/lib/auth";
import { api } from "@/services/api";

export async function GET(
  request: Request,
  context: { params: { providerFileId: string } },
) {
  const { providerFileId } = context.params;

  try {
    // 1. Authenticate
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Fetch file record from DB
    const fileRecord = await api.db.file.findFileByProviderId(providerFileId);
    if (!fileRecord) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const workspace = await api.db.workspace.getWorkspaceByDocumentId(
      fileRecord.workspaceId.toString(),
      true,
    );
    if (!workspace?.botToken) {
      return new NextResponse("Workspace config error", { status: 500 });
    }

    // 3. Check user has access
    const userWorkspaceRelation =
      await api.db.userworkspace.getUserWorkspaceRelation(
        userId,
        workspace.workspaceId as string,
      );
    if (!userWorkspaceRelation) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 4. Find the Slack upload
    const slackUpload = fileRecord.uploads.find(
      (upload: any) => upload.provider === "slack",
    );
    if (!slackUpload) {
      return new NextResponse("File not found on provider", { status: 404 });
    }

    // 5. Fetch the file from Slack
    const slackResponse = await api.slack.files.fetchFile(
      slackUpload.providerFileUrl,
      workspace.botToken,
    );

    if (!slackResponse.body) {
      return new NextResponse("Response from provider contained no data.", {
        status: 502,
      });
    }

    // 6. Save to tmp storage
    const tmpPath = path.join("/tmp", `${providerFileId}-${Date.now()}`);
    const fileBuffer = Buffer.from(await slackResponse.arrayBuffer());
    await fs.writeFile(tmpPath, fileBuffer);

    // 7. Read back the file from tmp and return
    const fileData = await fs.readFile(tmpPath);

    // Cleanup tmp file
    await fs.unlink(tmpPath).catch(() => {
      // Ignore cleanup errors
    });

    return new NextResponse(fileData, {
      status: 200,
      headers: {
        "Content-Type": fileRecord.fileType,
        "Content-Length": fileData.length.toString(),
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[File Proxy Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
