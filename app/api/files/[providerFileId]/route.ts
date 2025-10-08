import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { api } from "@/services/api";
import { headers } from "next/headers";

type Params = Promise<{ providerFileId: string }>;

// THE FIX IS IN THE FUNCTION SIGNATURE:
// We destructure { params } directly from the second argument.
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    // 'params' is now directly available, so we can get the ID from it.
    const { providerFileId } = await params;

    // Pass the request headers to getSession, as it may need them.
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
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
      return new NextResponse("Workspace configuration error", { status: 500 });
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

    const imageBuffer = await slackResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": fileRecord.fileType,
        "Content-Length": fileRecord.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error("[File Proxy Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
