import * as filesModule from "./files";
import * as uploadModule from "./upload";
import * as channelsModule from "./channels";

export const client = {
  files: filesModule,
  upload: uploadModule,
  channels: channelsModule,
};
