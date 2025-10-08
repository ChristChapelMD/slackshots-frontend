import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { api } from "@/services/api";

type Params = Promise<{ providerFileId: string }>;

export async function GET({ params }: { params: Params }) {
  const { providerFileId } = await params;

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

    const responseHeaders = {
      "Content-Type": fileRecord.fileType,
      "Content-Length": fileRecord.fileSize.toString(),
    };

    return new NextResponse(slackResponse.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[File Proxy Error]:", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
