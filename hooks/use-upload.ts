import { useUploadProcessStore } from "@/stores/upload-process-store";
import { useUploadFormStore } from "@/stores/upload-form-store";
import { client } from "@/services/client";
import { refreshFilesAfterUpload } from "@/hooks/use-files";

export function useUpload() {
  const setUploading = useUploadProcessStore((state) => state.setUploading);
  const setProgress = useUploadProcessStore((state) => state.setProgress);
  const setLastUploadTimestamp = useUploadProcessStore(
    (state) => state.setLastUploadTimestamp,
  );

  const startUpload = async () => {
    const formState = useUploadFormStore.getState().formState;
    const resetForm = useUploadFormStore.getState().resetForm;

    if (!formState.files || !formState.channel) return;

    const uploadSessionId = crypto.randomUUID();

    useUploadFormStore.getState().updateForm({ uploadSessionId });

    setUploading(true);
    setProgress(0);

    try {
      // First upload to blob storage
      const blobResponses = await client.upload.uploadToBlob(
        formState.files,
        formState.channel,
        uploadSessionId,
        (progress: number) => setProgress(progress),
      );

      // Then upload to provider
      await client.upload.uploadToSlack(
        blobResponses,
        formState.channel,
        formState.comment,
        formState.messageBatchSize,
      );

      refreshFilesAfterUpload();

      setLastUploadTimestamp(Date.now());
      setUploading(false);
      setProgress(0);

      resetForm();
    } catch (error) {
      console.error("Upload process failed", error);
      setUploading(false);
      setLastUploadTimestamp(Date.now());
      throw error;
    }
  };

  return { startUpload };
}

// TODO - implement cancel feature via abort controller
