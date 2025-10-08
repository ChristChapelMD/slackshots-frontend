import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { api } from "@/services/api";

export async function GET(
  request: NextRequest,
  context: { params: { providerFileId: string } },
) {
  const { providerFileId } = context.params;
  console.log(`[PROXY START] Received request for ${providerFileId}`);

  try {
    console.log(`[${providerFileId}] 1. Authenticating session...`);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(
      `[${providerFileId}] 2. Session authenticated. Finding file in DB...`,
    );

    const fileRecord = await api.db.file.findFileByProviderId(providerFileId);
    if (!fileRecord) {
      return new NextResponse("Not Found", { status: 404 });
    }
    console.log(
      `[${providerFileId}] 3. File record found. Getting workspace...`,
    );

    const workspace = await api.db.workspace.getWorkspaceByDocumentId(
      fileRecord.workspaceId.toString(),
      true,
    );
    if (!workspace || !workspace.botToken) {
      return new NextResponse("Workspace config error", { status: 500 });
    }
    console.log(
      `[${providerFileId}] 4. Workspace found. Checking permissions...`,
    );

    const userWorkspaceRelation =
      await api.db.userworkspace.getUserWorkspaceRelation(
        session.user.id,
        workspace.workspaceId as string,
      );
    if (!userWorkspaceRelation) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    console.log(
      `[${providerFileId}] 5. Permissions OK. Finding Slack upload data...`,
    );

    const slackUpload = fileRecord.uploads.find(
      (u: any) => u.provider === "slack",
    );
    if (!slackUpload) {
      return new NextResponse("File not found on provider", { status: 404 });
    }
    console.log(
      `[${providerFileId}] 6. Calling Slack to fetch file: ${slackUpload.providerFileUrl}`,
    );

    const slackResponse = await api.slack.files.fetchFile(
      slackUpload.providerFileUrl,
      workspace.botToken,
    );
    console.log(
      `[${providerFileId}] 7. Slack fetch succeeded. Buffering response...`,
    );

    const imageBuffer = await slackResponse.arrayBuffer();
    console.log(
      `[${providerFileId}] 8. Buffering succeeded. Sending response to client.`,
    );

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": fileRecord.fileType,
        "Content-Length": fileRecord.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error(`[File Proxy Error for ${providerFileId}]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
