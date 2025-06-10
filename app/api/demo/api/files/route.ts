import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { generateMockFiles } from "@/lib/mock/mock-files";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const startIndex = (page - 1) * limit;
  const files = generateMockFiles(limit, startIndex);
  const hasMore = startIndex + limit < 100;

  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    files,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  });
}

export async function POST(request: NextRequest) {
  const uploadMetadata = request.headers.get("Upload-Metadata");
  const contentLength = request.headers.get("Content-Length");

  if (!uploadMetadata || !contentLength) {
    return new Response(null, { status: 400 });
  }

  const uploadId = crypto.randomUUID();
  const uploadUrl = `/api/demo/api/files/${uploadId}`;

  return new Response(null, {
    status: 201,
    headers: {
      Location: uploadUrl,
      "Tus-Resumable": "1.0.0",
      "Tus-Version": "1.0.0",
      "Tus-Extension": "creation,termination",
      "Tus-Max-Size": "1073741824", // 1GB
    },
  });
}

export async function PATCH(request: NextRequest) {
  const uploadOffset = request.headers.get("Upload-Offset") || "0";
  const contentLength = request.headers.get("Content-Length") || "0";

  const newOffset = parseInt(uploadOffset) + parseInt(contentLength);

  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 200 + 100),
  );

  return new Response(null, {
    status: 204,
    headers: {
      "Tus-Resumable": "1.0.0",
      "Upload-Offset": newOffset.toString(),
    },
  });
}

export async function HEAD() {
  const totalSize = 1000000;
  const currentOffset = Math.floor(Math.random() * totalSize);

  return new Response(null, {
    status: 200,
    headers: {
      "Tus-Resumable": "1.0.0",
      "Upload-Offset": currentOffset.toString(),
      "Upload-Length": totalSize.toString(),
      "Cache-Control": "no-store",
    },
  });
}
