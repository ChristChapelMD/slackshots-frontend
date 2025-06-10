import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(
      `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Set-Cookie": response.headers.get("set-cookie") || "",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }
}
