export interface Options {
  credentials: TwitchCredentials;
  dbName?: string;
  dbPath?: string;
  debug?: boolean;
}

export interface TwitchCredentials {
  clientID: string;
  clientSecret: string;
}

export interface GuildData {
  streamers: StreamerObject[];
  channelID: string;
}

export interface StreamerObject {
  name: string;
  latestStream: string | null;
}

export interface ManagerEvents {
  streamStarted: (data: StreamData) => void;
}

export interface StreamData {
  username: string;
  profile_pic: string;
  title: string;
  thumbnail: string;
  date: number;
}

export interface ErrorObject {
  status: boolean;
  message: string;
}


