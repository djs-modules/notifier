import { ErrorObject, GuildData, Options, StreamerObject } from "../types";
import { DBManager } from "./DBManager";

export interface StreamersManager {
  options: Options;
  database: DBManager;
}

/**
 * Class that controls Streamers Base
 *
 * @class
 * @classdesc Streamers Manager
 */
export class StreamersManager {
  /**
   * @constructor
   *
   * @param {Options} Options Module Options
   */
  constructor(options: Options) {
    /**
     * Module Options
     *
     * @type {Options}
     */
    this.options = options;
    if (!this.options.dbName) this.options.dbName = "twitch";

    /**
     * Module Database
     *
     * @type {DBManager}
     */
    this.database = new DBManager(this.options);
  }

  /**
   * Method that pushes Streamer into Streamers Base
   *
   * @param {string} guildID Guild ID
   * @param {string} name Streamer Username
   *
   * @returns {Promise<ErrorObject|GuildData>}
   */
  add(guildID: string, name: string): Promise<ErrorObject | GuildData> {
    return new Promise(async (res, rej) => {
      const data = await this.database.get(guildID);
      const streamer = data.streamers.find((x) => x.name === name);
      if (streamer) {
        return res({
          status: false,
          message: "Streamer with than username already placed in DB!",
        });
      }

      data.streamers.push({
        name: name,
        latestStream: null,
      });

      this.database.set(guildID, data);

      return res(data);
    });
  }

  /**
   * Method that removes Streamer from Streamers Base
   *
   * @param {string} guildID Guild ID
   * @param {string} name Streamer Username
   *
   * @returns {Promise<ErrorObject|GuildData>}
   */
  remove(guildID: string, name: string): Promise<ErrorObject | GuildData> {
    return new Promise(async (res, rej) => {
      const data = await this.database.get(guildID);
      const streamer = data.streamers.find((x) => x.name === name);
      if (!streamer) {
        return res({
          status: false,
          message: "Streamer with than username isn't placed in DB!",
        });
      }

      data.streamers.filter((x) => x.name !== name);
      this.database.set(guildID, data);

      return res(data);
    });
  }

  /**
   * Method that returns all the Streamers from Streamers Base
   *
   * @param {string} guildID Guild ID
   *
   * @returns {Promise<ErrorObject|StreamerObject[]>}
   */
  all(guildID: string, name: string): Promise<ErrorObject | StreamerObject[]> {
    return new Promise(async (res, rej) => {
      const data = await this.database.get(guildID);
      if (!data.streamers.length) {
        return res({
          status: false,
          message: "There's no streamers in the base!",
        });
      }

      return res(data.streamers);
    });
  }
}
