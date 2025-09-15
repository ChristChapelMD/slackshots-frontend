import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { useToastQuery } from "@/hooks/use-toast-query";
import { client } from "@/services/client";

export function useChannels() {
  const { session } = useAuth();
  const { currentWorkspace } = useWorkspace();

  return useToastQuery({
    queryKey: ["channels", currentWorkspace, session?.session.id],
    queryFn: () => client.channels.fetchChannels(),
    enabled: !!currentWorkspace && !!session?.session.id,
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
