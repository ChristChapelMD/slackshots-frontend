import { WebClient } from "@slack/web-api";

export function createSlackClient(slackAccessToken: string): WebClient {
  return new WebClient(slackAccessToken);
}
