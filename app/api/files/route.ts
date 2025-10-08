import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

import { auth } from "@/lib/auth";
import { api } from "@/services/api";

export async function GET() {
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

    const fileRecords = await api.db.file.getFilesForUser(
      api.db.utils.toObjectId(session.user.id),
    );

    const files = fileRecords.map((fileRecord) => {
      return {
        _id: fileRecord._id,
        fileName: fileRecord.fileName,
        fileSize: fileRecord.fileSize,
        fileType: fileRecord.fileType,
        uploads: fileRecord.uploads.map((upload: any) => ({
          provider: upload.provider,
          providerFileId: upload.providerFileId,
        })),
      };
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("[List Files API] Error:", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
