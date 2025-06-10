import { APIService } from "../api-service";

import {
  Channel,
  ChannelOption,
  ChannelServiceInterface,
} from "@/types/service-types/channel-service";

export class ChannelService
  extends APIService
  implements ChannelServiceInterface
{
  async fetchChannels(): Promise<ChannelOption[]> {
    try {
      const response = await this.fetchWithAuth("getChannels");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.message || "Failed to fetch channels");
      }

      const data: Channel[] = await response.json();

      return data.map((channel) => ({
        value: channel.id,
        label: channel.name,
        isMember: channel.isMember,
      }));
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An error occurred while fetching channels");
    }
  }
}
