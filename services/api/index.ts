import { APIService } from "./api-service";
import { ChannelService } from "./channel-service";
import { FileService } from "./file-service";
import { UploadService } from "./upload-service";

export const services = {
  channel: new ChannelService(),
  file: new FileService(),
  upload: new UploadService(),
};

export function setGlobalAccessToken(token: string | null) {
  APIService.setAccessToken(token);
}
