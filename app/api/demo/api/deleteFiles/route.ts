import { NextResponse } from "next/server";

import { bulkDeleteMockFiles } from "@/lib/mock/mock-files";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const files = body.files;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "No files specified for deletion",
        },
        { status: 400 },
      );
    }

    const fileIDs = files.map((file) => file.id);

    const deletedCount = bulkDeleteMockFiles(fileIDs);

    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      ok: true,
      message: `Successfully deleted ${deletedCount} files`,
      deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}
