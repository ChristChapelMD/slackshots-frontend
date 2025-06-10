import { create } from "zustand";

interface User {
  id: string;
  teamId?: string;
  teamName?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isTokenProcessed: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setTokenProcessed: (processed: boolean) => void;
  refreshToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const baseApiUrl = `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}`;

export const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    process.env.NODE_ENV === "development" ? "mock-access-token" : null,
  user: null,
  isTokenProcessed: false,

  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setTokenProcessed: (isTokenProcessed) => set({ isTokenProcessed }),

  refreshToken: async () => {
    try {
      const response = await fetch(`${baseApiUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();

      if (data.accessToken) {
        set({ accessToken: data.accessToken });
        // eslint-disable-next-line no-console
        console.log("Access token refreshed successfully.");

        return data.accessToken;
      }

      return null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error refreshing access token:", error);
      set({ accessToken: null });

      return null;
    }
  },

  logout: async () => {
    try {
      await fetch(`${baseApiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout failed:", error);
    } finally {
      set({ accessToken: null, user: null, isTokenProcessed: false });
    }
  },
}));
