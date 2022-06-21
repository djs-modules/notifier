import { ErrorObject, GuildData, Options, StreamerObject } from "../src/types";
import { DBManager } from "./DBManager";

export declare interface StreamersManager {
  options: Options;
  database: DBManager;
}

export declare class StreamersManager {
  constructor(options: Options);

  add(guildID: string, name: string): Promise<ErrorObject | GuildData>;
  remove(guildID: string, name: string): Promise<ErrorObject | GuildData>;
  all(guildID: string, name: string): Promise<ErrorObject | StreamerObject[]>;
}
