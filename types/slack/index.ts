export interface SlackOAuthResponse {
  ok: boolean;
  access_token: string;
  token_type: "bot" | string;
  scope: string;
  bot_user_id: string;
  app_id: string;
  team: {
    name: string;
    id: string;
  };
  enterprise?: {
    name: string;
    id: string;
  };
  authed_user: {
    id: string;
    scope: string;
    access_token: string;
    token_type: "user" | string;
  };
}
