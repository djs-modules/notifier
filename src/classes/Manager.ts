import {
  GuildData,
  ManagerEvents,
  Options,
  StreamData,
  StreamerObject,
} from "../types";
import { StreamersManager } from "./StreamersManager";
import { DBManager } from "./DBManager";
import { TypedEmitter } from "tiny-typed-emitter";
import { Job } from "./Job";
import { KeyManager } from "./KeyManager";
import { request } from "undici";

export interface Manager {
  options: Options;
  database: DBManager;

  streamers: StreamersManager;
  key: KeyManager;
}

/**
 * Class that controls All the Module
 *
 * @class
 * @classdesc Main Manager
 * @extends TypedEmitter<ManagerEvents>
 */
export class Manager extends TypedEmitter<ManagerEvents> {
  /**
   * @constructor
   *
   * @param {Options} Options Module Options
   */
  constructor(options: Options) {
    super();

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

    /**
     * Streamers Manager
     *
     * @type {StreamersManager}
     */
    this.streamers = new StreamersManager(this.options);

    /**
     * Key Manager
     *
     * @type {KeyManager}
     */
    this.key = new KeyManager(this.options);

    const job = new Job(
      "Streamers Check",
      "*/10 * * * *", // every 10 minutes
      async () => {
        const clientID = this.options.credentials.clientID;
        const key = await this.key.get();
        console.log(key);

        var twitchOBJ = this.database.database.keys();
        var guildIDS: string[] = [];
        var streamersArray: {
          id: string;
          channelID: string;
          streamers: StreamerObject[];
        }[] = [];

        for (var name of twitchOBJ) {
          var guildID = name.toString().slice("twitch-".length);
          guildIDS.push(guildID);
        }

        for (var guildID of guildIDS) {
          var data = await this.database.get(guildID);

          if (!data) continue;
          if (!data.streamers) continue;
          if (!data.channelID) continue;

          streamersArray.push({
            id: guildID,
            channelID: data.channelID,
            streamers: data.streamers,
          });
        }

        for (let i = 0; i < streamersArray.length; i++) {
          for (let y = 0; y < streamersArray[i].streamers.length; y++) {
            var { name, latestStream } = streamersArray[i].streamers[y];
            var { id } = streamersArray[i];

            var URL = `https://api.twitch.tv/helix/streams?first=1&user_login=${name}`;
            var streamerURL = `https://api.twitch.tv/helix/users?login=${name}`;

            const twitchData = await (
              await request(URL, {
                headers: {
                  Authorization: `Bearer ${key}`,
                  "Client-ID": clientID,
                },
                method: "GET",
              })
            ).body.json();

            const streamerData = await (
              await request(streamerURL, {
                headers: {
                  Authorization: `Bearer ${key}`,
                  "Client-ID": clientID,
                },
                method: "GET",
              })
            ).body.json();

            if (!twitchData || !streamerData) continue;
            if (!twitchData.data) continue;

            const TwitchAPI = twitchData.data[0];
            const StreamerData = streamerData.data[0];

            if (latestStream === TwitchAPI.id) continue;

            const data: StreamData = {
              username: TwitchAPI.user_name,
              title: TwitchAPI.title,
              profile_pic: StreamerData.profile_image_url,
              thumbnail: TwitchAPI.thumbnail_url
                .replace("{width}", "1280")
                .replace("{height}", "720"),
              date: TwitchAPI.started_at,
            };

            latestStream = TwitchAPI.id;
            this.database.setProp(
              id,
              data.username,
              "latestStream",
              latestStream
            );

            this.emit("streamStarted", data);
          }
        }
      },
      this.options.debug
    );

    job.start();

    console.log(job.nextDates());
  }

  /**
   * Method that sets Notifications Channel
   *
   * @param {string} guildID Guild ID
   * @param {string} channelID Channel ID
   *
   * @returns {Promise<GuildData>}
   */
  setChannel(guildID: string, channelID: string): Promise<GuildData> {
    return new Promise(async (res, rej) => {
      var data = await this.database.get(guildID);

      data.channelID = channelID;
      this.database.set(guildID, data);

      return res(data);
    });
  }

  /**
   * Method that removes Notifications Channel from DB
   *
   * @param {string} guildID Guild ID
   *
   * @returns {Promise<boolean>}
   */
  resetChannel(guildID: string): Promise<boolean> {
    return new Promise(async (res, rej) => {
      var data = await this.database.get(guildID);

      data.channelID = null;
      this.database.set(guildID, data);

      return res(true);
    });
  }
}

/**
 * Module Options
 * @typedef {Object} Options
 * @prop {TwitchCredentials} credentials {@link https://dev.twitch.tv/console/apps|Twitch Credentials}
 * @prop {string} [DBName] Database Name
 * @prop {string} [DBPath] Database Path
 * @prop {boolean} [debug] Debug Mode
 */

/**
 * Twitch Credentials
 * @typedef {Object} TwitchCredentials
 * @prop {string} clientID Twitch Client ID
 * @prop {string} clientSecret Twitch Client Secret
 */

/**
 * Guild Data
 * @typedef {Object} GuildData
 * @prop {StreamerObject[]} streamers Twitch Streamers Array
 * @prop {string} channelID Channel ID where notifications will be posted
 */

/**
 * Streamer Object
 * @typedef {Object} StreamerObject
 * @prop {string} name Streamer Username
 * @prop {string|null} latestStream Latest Stream
 */

/**
 * Stream Data Object
 *
 * @typedef {Object} StreamerData
 * @prop {string} username Streamer Username
 * @prop {string} profile_pic Profile Avatar
 * @prop {string} title Stream Name
 * @prop {string} thumbnail Stream Thumbnail
 * @prop {number} date When stream started
 */

/**
 * Error Object
 * @typedef {Object} ErrorObject
 * @prop {boolean} status Status
 * @prop {string} message Returned Message
 */

/**
 * Emiited when Someone started a Stream
 *
 * @event Manager#streamStarted
 * @param {StreamData} data Stream Object
 */
