import { GuildData, StreamerObject, Options } from "../src/types";
import Enmap from "enmap";

export declare interface DBManager {
  options: Options;
  database: Enmap<string, GuildData>;
}

export declare class DBManager {
  constructor(options: Options);

  get(id: string): Promise<GuildData>;
  set(id: string, value: any): Promise<boolean>;

  setProp(
    guildID: string,
    name: string,
    key: string,
    value: string
  ): Promise<boolean>;

  createStreamer(guildID: string, name: string): Promise<StreamerObject>;
  createGuild(guildID: string): Promise<GuildData>;
}
