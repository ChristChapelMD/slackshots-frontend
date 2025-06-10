"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

export function useAuthInit() {
  const { accessToken, refreshToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      if (!accessToken) {
        const newToken = await refreshToken();

        if (!newToken && pathname.startsWith("/dashboard")) {
          router.push("/");
        }
      }
    };

    initAuth();
  }, [accessToken, refreshToken, router, pathname]);
}
