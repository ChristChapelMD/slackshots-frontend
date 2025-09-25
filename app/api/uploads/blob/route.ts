import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";
import { api } from "@/services/api";
import { FileRecordStatus } from "@/services/api/db/models/file.model";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

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

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (clientPayload: any) => {
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          addRandomSuffix: true,
          callbackUrl: "api/uploads/blob",
          tokenPayload: JSON.stringify({
            uploadSessionId: clientPayload?.uploadSessionId ?? "unknown",
            fileSize: clientPayload?.fileSize ?? 0,
            fileType: clientPayload?.fileType ?? "application/octet-stream",
            userId: user.id,
            workspaceId,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("blob upload completed", blob, tokenPayload);

        const { uploadSessionId, fileSize, fileType, userId, workspaceId } =
          JSON.parse(tokenPayload ?? "{}");

        try {
          await api.db.file.createFileRecord({
            fileName: blob.pathname.split("/").pop() || "",
            blobUrl: blob.url,
            blobPathname: blob.pathname,
            fileSize,
            fileType,
            userId: api.db.utils.toObjectId(userId),
            workspaceId: api.db.utils.toObjectId(workspaceId),
            uploadSessionId,
            status: FileRecordStatus.UPLOADED,
          });
        } catch (error) {
          console.error(error);
          throw new Error("Could not create file record");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
