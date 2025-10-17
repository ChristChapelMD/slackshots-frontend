import { useQueryClient } from "@tanstack/react-query";

import { useUploadProcessStore } from "@/stores/upload-process-store";
import { useUploadFormStore } from "@/stores/upload-form-store";
import { client } from "@/services/client";
import { useToastMutation } from "@/hooks/use-toast-mutation";

export function useUpload() {
  const queryClient = useQueryClient();
  const setUploading = useUploadProcessStore((state) => state.setUploading);
  const setProgress = useUploadProcessStore((state) => state.setProgress);
  const setLastUploadTimestamp = useUploadProcessStore(
    (state) => state.setLastUploadTimestamp,
  );

  const uploadMutation = useToastMutation(
    {
      mutationFn: async () => {
        const formState = useUploadFormStore.getState().formState;
        const resetForm = useUploadFormStore.getState().resetForm;

        if (!formState.files || !formState.channel) {
          throw new Error("No files or channel selected");
        }

        const uploadSessionId = crypto.randomUUID();

        useUploadFormStore.getState().updateForm({ uploadSessionId });

        setUploading(true);
        setProgress(0);

        const fileArray = Array.from(formState.files);
        const batchSize = formState.messageBatchSize;

        try {
          for (let i = 0; i < fileArray.length; i += batchSize) {
            const batch = fileArray.slice(i, i + batchSize);

            await client.upload.uploadBatchToServer(
              batch,
              formState.channel,
              formState.comment,
              uploadSessionId,
            );

            const currentProgress = Math.round(
              ((i + batch.length) / fileArray.length) * 100,
            );

            setProgress(currentProgress);
          }

          queryClient.invalidateQueries({ queryKey: ["files"] });
          setLastUploadTimestamp(Date.now());
          resetForm();

          return "Upload successful";
        } catch (error) {
          throw error;
        } finally {
          setUploading(false);
          setProgress(0);
        }
      },
      toast: {
        onSuccess: {
          title: "Upload Complete",
          description: "Your files have been successfully uploaded.",
          status: "success",
        },
        onError: {
          title: "Upload Failed",
          description: "There was a problem with the upload. Please try again.",
          status: "error",
        },
      },
    },
    ["file-upload"],
  );

  return { startUpload: uploadMutation.mutate };
}
