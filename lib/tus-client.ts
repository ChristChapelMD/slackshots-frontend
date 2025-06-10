import * as tus from "tus-js-client";

export interface TusUploadOptions {
  file: File;
  metadata: {
    filename: string;
    filetype: string;
    sessionID: string;
    channel: string;
    comment: string | null;
    messageBatchSize: number;
  };
  onProgress?: (progress: number) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

class TusClientClass {
  private static getEndpoint(): string {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return "/api/demo/api/files";
    }

    return `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}/files`;
  }

  private static retryDelays = [0, 3000, 5000, 10000, 20000];

  static async uploadFile(options: TusUploadOptions): Promise<string> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return this.simulateUpload(options);
    }

    return new Promise((resolve, reject) => {
      const metadata: Record<string, string> = {
        filename: options.metadata.filename,
        filetype: options.metadata.filetype,
        sessionID: options.metadata.sessionID,
        channel: options.metadata.channel,
        messageBatchSize: options.metadata.messageBatchSize.toString(),
      };

      if (options.metadata.comment) {
        metadata.comment = options.metadata.comment;
      }

      const upload = new tus.Upload(options.file, {
        endpoint: this.getEndpoint(),
        retryDelays: this.retryDelays,
        metadata,
        onError: (error) => {
          if (options.onError) options.onError(error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const progress = Math.round((bytesUploaded / bytesTotal) * 100);

          if (options.onProgress) options.onProgress(progress);
        },
        onSuccess: () => {
          if (options.onSuccess) options.onSuccess();
          const uploadUrl = upload.url;

          resolve(uploadUrl || "");
        },
      });

      upload.start();
    });
  }

  // Simulate file upload for demo mode
  private static async simulateUpload(
    options: TusUploadOptions,
  ): Promise<string> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5; // Increase by 5-15% each time

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          if (options.onProgress) options.onProgress(progress);
          if (options.onSuccess) options.onSuccess();

          resolve(`/demo-upload-${Date.now()}`);
        } else if (options.onProgress) {
          options.onProgress(progress);
        }
      }, 300);
    });
  }

  static async finalizeUpload(sessionID: string): Promise<any> {
    const endpoint =
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
        ? "/api/demo/api/finalizeUpload"
        : `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}/api/finalizeUpload`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(errorData.message || "Failed to finalize upload");
    }

    return response.json();
  }
}

export const TusClient = TusClientClass;
export default TusClientClass;
