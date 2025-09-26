import { useUploadProcessStore } from "@/stores/upload-process-store";
import { useUploadFormStore } from "@/stores/upload-form-store";
import { client } from "@/services/client";
import { refreshFilesAfterUpload } from "@/hooks/use-files";
import { useToastMutation } from "@/hooks/use-toast-mutation";

export function useUpload() {
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

        try {
          const blobResponses = await client.upload.uploadToBlob(
            formState.files,
            formState.channel,
            uploadSessionId,
            (progress: number) => setProgress(progress),
          );

          await client.upload.uploadToSlack(
            blobResponses,
            formState.channel,
            formState.comment,
            formState.messageBatchSize,
          );

          refreshFilesAfterUpload();
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
