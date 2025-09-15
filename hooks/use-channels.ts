import { useAuth } from "./use-auth";

import { useToastQuery } from "@/hooks/use-toast-query";
import { client } from "@/services/client";

export function useChannels() {
  const { session } = useAuth();

  return useToastQuery({
    queryKey: ["channels"],
    queryFn: client.channels.fetchChannels(),
    enabled: !!session?.user?.workspaceId,
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
