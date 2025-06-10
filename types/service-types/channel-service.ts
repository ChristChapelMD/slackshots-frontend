export interface Channel {
  id: string;
  name: string;
  isMember: boolean;
}

export interface ChannelOption {
  value: string;
  label: string;
  isMember: boolean;
}

export interface ChannelServiceInterface {
  fetchChannels(): Promise<ChannelOption[]>;
}
