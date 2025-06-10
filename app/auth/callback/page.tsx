"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

import { useAuthStore } from "@/stores/auth-store";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      setAccessToken(accessToken);

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "auth-success", accessToken }, "*");
        window.close();
      } else {
        router.push("/dashboard");
      }
    }
  }, [searchParams, setAccessToken, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Completing authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading authentication data...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
