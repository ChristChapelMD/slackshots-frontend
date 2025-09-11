import { createSlackClient } from "./client";

export async function getSlackChannels(accessToken: string) {
  const client = createSlackClient(accessToken);

  try {
    const result = await client.conversations.list();

    return (
      result.channels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        isMember: channel.is_member,
      })) ?? []
    );
  } catch (error) {
    console.error(`Error fetching Slack channels: ${error}`);
    throw new Error("Failed to fetch Slack channels.");
  }
}

export async function joinSlackChannel(accessToken: string, channelId: string) {
  const client = createSlackClient(accessToken);

  try {
    await client.conversations.join({ channel: channelId });
  } catch (error) {
    console.error(`Error joining channel ${channelId}: ${error}`);
    throw new Error(`Failed to join channel ${channelId}.`);
  }
}
