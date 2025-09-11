import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const user = (await auth.api.getSession({ headers: await headers() }))?.user;

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
