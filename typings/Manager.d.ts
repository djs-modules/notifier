import { GuildData, ManagerEvents, Options } from "../src/types";
import { StreamersManager } from "./StreamersManager";
import { DBManager } from "./DBManager";
import { TypedEmitter } from "tiny-typed-emitter";
import { KeyManager } from "./KeyManager";

export declare interface Manager {
  options: Options;
  database: DBManager;

  streamers: StreamersManager;
  key: KeyManager;
}

export declare class Manager extends TypedEmitter<ManagerEvents> {
  constructor(options: Options);

  setChannel(guildID: string, channelID: string): Promise<GuildData>;
  resetChannel(guildID: string): Promise<boolean>;
}
