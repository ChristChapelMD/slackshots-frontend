export type SlackOAuthSuccessResponse = {
  ok: true;
  access_token: string;
  token_type: "bot";
  scope: string;
  bot_user_id: string;
  app_id: string;
  team: {
    id: string;
    name: string;
  };
  enterprise?: {
    id: string;
    name: string;
  };
  authed_user: {
    id: string;
    scope: string;
    access_token: string;
    token_type: string;
  };
};

export type SlackOAuthErrorResponse = {
  ok: false;
  error: string;
};

export type SlackOAuthResponse =
  | SlackOAuthSuccessResponse
  | SlackOAuthErrorResponse;
