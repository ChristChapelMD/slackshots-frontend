import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

export const useAuth = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const logout = async () => {
    await authStore.logout();
    router.push("/login");
  };

  return {
    user: authStore.user,
    accessToken: authStore.accessToken,
    isAuthenticated: !!authStore.accessToken,
    logout,
  };
};
