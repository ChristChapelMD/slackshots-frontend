"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/stores/auth-store";
import { setGlobalAccessToken } from "@/services/api";

export function AuthInit() {
  const { accessToken, setAccessToken } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  const baseApiUrl = `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}`;

  // Refresh token on mount
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch(`${baseApiUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          if (process.env.NODE_ENV === "development") {
            setAccessToken("mock-access-token");
            setGlobalAccessToken("mock-access-token");
          }

          return;
        }

        const data = await response.json();

        if (data.accessToken) {
          setAccessToken(data.accessToken);
          setGlobalAccessToken(data.accessToken);

          /* eslint-disable no-console */
          console.log("Auth state:", {
            accessToken: !!data.accessToken,
            initialized,
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
          });
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error("Failed to refresh token:", error);

        // In development, set mock token on error
        if (process.env.NODE_ENV === "development") {
          const devToken = "mock-access-token";

          setAccessToken(devToken);
          setGlobalAccessToken(devToken);
        }
      } finally {
        setInitialized(true);
      }
    };

    refreshAccessToken();
  }, [setAccessToken]);

  // Listen for auth channel messages
  useEffect(() => {
    const authChannel = new BroadcastChannel("auth_channel");

    authChannel.onmessage = (event) => {
      if (event.data.type === "auth-success") {
        const newToken = event.data.accessToken;

        setAccessToken(newToken);
        setGlobalAccessToken(newToken);
      }
    };

    return () => authChannel.close();
  }, [setAccessToken]);

  useEffect(() => {
    if (accessToken) {
      console.log("Setting global API token from auth store");
      setGlobalAccessToken(accessToken);
    } else if (process.env.NODE_ENV === "development") {
      console.log("Setting mock token for development");
      setGlobalAccessToken("mock-access-token");
    }
  }, [accessToken]);

  return null;
}
