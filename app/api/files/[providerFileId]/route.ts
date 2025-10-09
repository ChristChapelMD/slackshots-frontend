import fs from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { api } from "@/services/api";

export async function GET(
  request: Request,
  context: { params: { providerFileId: string } } | any,
) {
  const params = await context.params;
  const { providerFileId } = params;

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileRecord = await api.db.file.findFileByProviderId(providerFileId);

    if (!fileRecord) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const workspace = await api.db.workspace.getWorkspaceByDocumentId(
      fileRecord.workspaceId.toString(),
      true,
    );

    if (!workspace || !workspace.botToken) {
      return new NextResponse("Workspace config error", { status: 500 });
    }

    const userWorkspaceRelation =
      await api.db.userworkspace.getUserWorkspaceRelation(
        session.user.id,
        workspace.workspaceId as string,
      );

    if (!userWorkspaceRelation) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const slackUpload = fileRecord.uploads.find(
      (upload: any) => upload.provider === "slack",
    );

    if (!slackUpload) {
      return new NextResponse("File not found on provider", { status: 404 });
    }

    const slackResponse = await api.slack.files.fetchFile(
      slackUpload.providerFileUrl,
      workspace.botToken,
    );

    if (!slackResponse.body) {
      return new NextResponse("Response from provider contained no data.", {
        status: 502,
      });
    }

    const tmpPath = path.join("/tmp", `${providerFileId}-${Date.now()}`);
    const fileBuffer = Buffer.from(await slackResponse.arrayBuffer());

    await fs.writeFile(tmpPath, fileBuffer);

    const fileData = await fs.readFile(tmpPath);

    await fs.unlink(tmpPath).catch(() => {
      // Ignore cleanup errors
    });

    const responseHeaders = {
      "Content-Type": fileRecord.fileType,
      "Content-Length": fileRecord.fileSize.toString(),
      "Cache-Control": "public, max-age=0, must-revalidate",
    };

    return new NextResponse(fileData, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[File Proxy Error]:", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
