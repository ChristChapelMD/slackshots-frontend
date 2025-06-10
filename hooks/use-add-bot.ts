import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth-store";

interface AddBotResponse {
  message: string;
}

export function useAddBot() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  const addBotToChannel = async (
    channelId: string,
  ): Promise<AddBotResponse> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}/api/addBotToChannel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ channelId }),
        credentials: "include",
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      throw new Error(errorData.message || "Failed to add bot to channel");
    }

    return res.json();
  };

  return useMutation({
    mutationFn: addBotToChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
    onError: (error: Error) => {
      // eslint-disable-next-line no-console
      console.error(`Error adding bot to channel: ${error.message}`);
    },
  });
}
