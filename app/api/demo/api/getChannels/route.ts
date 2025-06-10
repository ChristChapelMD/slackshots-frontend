import { NextResponse } from "next/server";

export async function GET() {
  const randomDelay = Math.floor(Math.random() * 601) + 200;

  await new Promise((resolve) => setTimeout(resolve, randomDelay));

  const mockChannels = [
    { id: "C12345", name: "general", isMember: true },
    { id: "C67890", name: "random", isMember: true },
    { id: "C24680", name: "engineering", isMember: false },
    { id: "C13579", name: "product", isMember: true },
    { id: "C97531", name: "design", isMember: false },
  ];

  return NextResponse.json(mockChannels);
}
