export async function uploadBatchToServer(
  fileBatch: File[],
  channel: string,
  comment: string,
  uploadSessionId: string,
) {
  const formData = new FormData();

  fileBatch.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("channel", channel);
  formData.append("comment", comment);
  formData.append("uploadSessionId", uploadSessionId);

  const response = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || "Failed to upload batch. Please try again.",
    );
  }

  return response.json();
}
