import { NextResponse } from "next/server";

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
    imageUrls: files,
    hasMore,
    nextCursor: hasMore ? page + 1 : null,
  });
}
