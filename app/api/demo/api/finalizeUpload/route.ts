import { NextRequest, NextResponse } from "next/server";

import { addMockFile } from "@/lib/mock/mock-files";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionID } = body;

    if (!sessionID) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const uploadCount = Math.floor(Math.random() * 5) + 1;
    const createdFiles = [];

    for (let i = 0; i < uploadCount; i++) {
      const sizeIndex = i % 5;
      const sizePatterns = [
        { width: 400, height: 300 },
        { width: 300, height: 400 },
        { width: 500, height: 500 },
        { width: 600, height: 400 },
        { width: 400, height: 600 },
      ];

      const width = sizePatterns[sizeIndex].width;
      const height = sizePatterns[sizeIndex].height;
      const seed = `${sessionID}-${i}`;

      const mockFile = addMockFile({
        name: `Upload ${i + 1} - ${sessionID.substring(0, 6)}`,
        fileType: "image/jpeg",
        fileSize: Math.floor(Math.random() * 1000000) + 500000,
        width: width,
        height: height,
        // Use a predictable URL format that doesn't change on refresh
        url: `https://picsum.photos/${width}/${height}?seed=${seed}`,
      });

      createdFiles.push(mockFile);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${uploadCount} files`,
      uploadCount,
      files: createdFiles,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 },
    );
  }
}
