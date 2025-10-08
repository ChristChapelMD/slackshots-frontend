export async function fetchFile(
  slackFileUrl: string,
  botToken: string,
): Promise<Response> {
  try {
    const slackResponse = await fetch(slackFileUrl, {
      headers: {
        Authorization: `Bearer ${botToken}`,
      },
      cache: "no-store",
    });

    if (!slackResponse.ok || !slackResponse.body) {
      throw new Error("Failed to fetch file from provider.");
    }

    return slackResponse;
  } catch (error) {
    console.error("Error fetching file from Slack:", error);
    throw error;
  }
}
