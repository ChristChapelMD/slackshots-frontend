import { useToastQuery } from "@/hooks/use-toast-query";
import { useAuthStore } from "@/stores/auth-store";
import { services } from "@/services/api";

export function useChannels() {
  const { accessToken } = useAuthStore();

  return useToastQuery({
    queryKey: ["channels", accessToken],
    queryFn: () => services.channel.fetchChannels(),
    enabled: process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !!accessToken,
    toast: {
      onError: {
        title: "Error fetching channels",
        description:
          "Unable to retrieve available channels. Please try again later.",
        status: "error",
      },
    },
  });
}
