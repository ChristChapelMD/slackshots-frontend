import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getSlackToken(headers: Headers) {
  const session = await auth.api.getSession({ headers: headers });
  if (!session) {
    throw new Error("Not signed in");
  }
  const result = await auth.api.getAccessToken({
    body: {
      providerId: "slack",
      userId: session.user.id,
    },
  });
  if (!result.accessToken) {
    throw new Error("Slack access token not found");
  }
  return result.accessToken;
}

export async function GET(request: Request) {
  const user = (await auth.api.getSession({ headers: await headers() }))?.user;

  const slackToken = await getSlackToken(await headers());

  console.log("sAT", slackToken);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(user.id);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}

// // === HANDLER FOR: POST /api/slack/channels ===
// // Used to perform an action, like joining a channel.
// export async function POST(request: Request) {
//   await dbConnect();
//   const userId = headers().get("x-user-id");

//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // For POST requests, we get data from the request body.
//     const { channelId } = await request.json();

//     if (!channelId) {
//       return NextResponse.json(
//         { message: "channelId is required" },
//         { status: 400 },
//       );
//     }

//     const slackAccessToken = await getSlackTokenForUser(userId);

//     await joinSlackChannel(slackAccessToken, channelId);

//     return NextResponse.json({
//       message: `Successfully joined channel ${channelId}`,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { message: (error as Error).message },
//       { status: 500 },
//     );
//   }
// }
