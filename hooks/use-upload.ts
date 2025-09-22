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

    const sessionId = crypto.randomUUID();

    useUploadFormStore.getState().updateForm({ sessionId });

    setUploading(true);
    setProgress(0);

    try {
      const blobResponses = await client.upload.uploadToBlob({
        files: formState.files,
        sessionId,
        onProgress: (progress: number) => setProgress(progress),
      });

      const slackResponses = await client.upload.uploadToSlack({
        files: blobResponses,
        channel: formState.channel,
        comment: formState.comment,
        onProgress: (progress: number) => setProgress(progress),
      });

      refreshFilesAfterUpload();

      setLastUploadTimestamp(Date.now());
      setUploading(false);
      setProgress(0);

      resetForm();

      return slackResponses;
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
