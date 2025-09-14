import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const url = await auth.api.signInWithOAuth2({
      body: {
        providerId: "slack_oauth2_v2",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
        disableRedirect: false,
      },
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: "OAuth failed" },
      { status: 500 },
    );
  }
}
