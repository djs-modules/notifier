import { GuildData, StreamerObject, Options } from "../types";
import Enmap from "enmap";

export interface DBManager {
  options: Options;
  database: Enmap<string, GuildData>;
}

/**
 * Class that controls Database
 *
 * @class
 * @classdesc Database Manager
 */
export class DBManager {
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
     * @type {Enmap<string, GuildData>}
     */
    this.database = new Enmap({
      name: this.options.dbName,
      dataDir: this.options.dbPath ?? "./",
      wal: false,
    });
  }

  /**
   * Method that Returns Guild Data from Database
   *
   * @param {string} id Discord Guild ID
   * @returns {Promise<GuildData>}
   */
  get(id: string): Promise<GuildData> {
    return new Promise(async (res, rej) => {
      var data = this.database.fetch(`twitch-${id}`);
      if (!data) data = await this.createGuild(id);

      return res(data);
    });
  }

  /**
   * Method that Changes Something from Database
   *
   * @param {string} id Discord Guild ID
   * @param {any} value Value to Set
   *
   * @returns {Promise<boolean>}
   */
  set(id: string, value: any): Promise<boolean> {
    return new Promise((res, rej) => {
      this.database.set(`twitch-${id}`, value);

      return res(true);
    });
  }

  /**
   * Method that Sets Value to Key from Database
   *
   * @param {string} guildID Discord Guild ID
   * @param {string} name Streamer Username
   * @param {string} key Property Name
   * @param {string} value Value to Set
   *
   * @returns {Promise<boolean>}
   */
  setProp(
    guildID: string,
    name: string,
    key: string,
    value: string
  ): Promise<boolean> {
    return new Promise(async (res, rej) => {
      var data = this.database.fetch(`twitch-${guildID}`);
      if (!data) data = await this.createGuild(guildID);

      var streamer = data.streamers.find((x) => x.name === name);
      if (!streamer) streamer = await this.createStreamer(guildID, name);

      streamer[key] = value;
      this.set(guildID, data);

      return res(true);
    });
  }

  /**
   * Method that Creates Streamer Object
   *
   * @param {string} guildID Discord Guild ID
   * @param {string} name Streamer Username
   *
   * @returns {Promise<StreamerObject>}
   */
  createStreamer(guildID: string, name: string): Promise<StreamerObject> {
    return new Promise(async (res, rej) => {
      var data = this.database.fetch(`twitch-${guildID}`);
      if (!data) data = await this.createGuild(guildID);

      var streamer = data.streamers.find((x) => x.name === name);
      if (streamer) return res(streamer);

      data.streamers.push({
        name: name,
        latestStream: null,
      });

      this.set(guildID, data);

      const newGuildData = this.database.fetch(`twitch-${guildID}`);
      const newUserData = newGuildData.streamers.find((x) => x.name === name)!;

      return res(newUserData);
    });
  }

  /**
   * Method that Creates Guild Data
   *
   * @param {string} guildID Discord Guild ID
   *
   * @returns {Promise<GuildData>}
   */
  createGuild(guildID: string): Promise<GuildData> {
    return new Promise(async (res, rej) => {
      var data = this.database.has(`twitch-${guildID}`);

      if (data) return res(this.database.fetch(`twitch-${guildID}`));
      else {
        this.database.set(`twitch-${guildID}`, {
          streamers: [],
          channelID: null,
        });

        const newGuildData = this.database.fetch(`twitch-${guildID}`);
        return res(newGuildData);
      }
    });
  }
}
