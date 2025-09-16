import { client } from "@/services/client";
import { useAuth } from "@/hooks/use-auth";
import { useToastQuery } from "@/hooks/use-toast-query";
import { useToastMutation } from "@/hooks/use-toast-mutation";

export function useWorkspace() {
  const { session } = useAuth();

  const { data: currentWorkspace, ...rest } = useToastQuery({
    queryKey: ["workspace", session?.user.id],
    queryFn: () => client.workspace.fetchCurrentWorkspace(),
    enabled: !!session?.user.id,
    toast: {
      onError: {
        title: "Error get worskapce",
        description:
          "Unable to retrieve workspace data. Please try again later.",
        status: "error",
      },
    },
  });

  const { mutate: addWorkspace, ...mutationRest } = useToastMutation(
    {
      mutationFn: client.workspace.addWorkspace,
      toast: {
        onError: {
          title: "Error adding workspace",
          description: "Unable to connect to workspace. Please try again.",
          status: "error",
        },
      },
    },
    ["addWorkspace"],
  );

  return { currentWorkspace, addWorkspace, ...rest, ...mutationRest };
}
