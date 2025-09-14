import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { genericOAuth } from "better-auth/plugins";

import { slackScopesConfig } from "@/config/scopes";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db(process.env.MONGO_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    slack: {
      clientId: process.env.SLACK_CLIENT_ID as string,
      clientSecret: process.env.SLACK_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL as string],
  user: {
    additionalFields: {
      workspaceId: { type: "string", required: false, input: false },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "slack_oauth2_v2",
          clientId: process.env.SLACK_CLIENT_ID as string,
          clientSecret: process.env.SLACK_CLIENT_SECRET as string,
          redirectURI: process.env.SLACK_OUTH_2_V2_REDIRECT_URI as string,
          authorizationUrl: "https://slack.com/oauth/v2/authorize",
          tokenUrl: "https://slack.com/api/oauth.v2.access",
          responseType: "code",
          responseMode: "query",
          prompt: "consent",
          pkce: true,
          accessType: "offline",
          scopes: slackScopesConfig,
        },
      ],
    }),
  ],
});
