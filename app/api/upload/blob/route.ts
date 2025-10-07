import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";
import { api } from "@/services/api";
import { FileRecordStatus } from "@/services/api/db/models/file.model";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  let encodedFileName = "";

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload: any) => {
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

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          addRandomSuffix: true,
          callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/uploads/blob`,
          tokenPayload: JSON.stringify({
            uploadSessionId: clientPayload?.uploadSessionId ?? "unknown",
            fileSize: clientPayload?.fileSize ?? 0,
            fileType: clientPayload?.fileType ?? "application/octet-stream",
            userId: user.id,
            workspaceId: workspace._id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { uploadSessionId, fileSize, fileType, userId, workspaceId } =
          JSON.parse(tokenPayload ?? "{}");

        const blobFileName = blob.pathname.split("/").pop() || "";

        try {
          const fileRecord = await api.db.file.createFileRecord({
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

          encodedFileName = `${fileRecord._id.toString().length}#${fileRecord._id.toString()}_#${blobFileName.length}${blobFileName}`;

          blob.pathname = encodedFileName;
        } catch (error) {
          console.error(error);
          throw new Error("Could not create file record");
        }
      },
    });

    return NextResponse.json({
      ...jsonResponse, // keep everything from Vercel’s response
      encodedFileName, // add your custom data
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
