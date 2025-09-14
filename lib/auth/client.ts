import type { auth } from "@/lib/auth";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL + "/api/auth",
  plugins: [inferAdditionalFields<typeof auth>()],
});
