import { Options } from "../types";
import { request } from "undici";
import { Job } from "./Job";

export interface KeyManager {
  options: Options;
  key?: string;
}

/**
 * Class that controls Authorization Key for Requests
 *
 * @class
 * @classdesc Key Manager
 */
export class KeyManager {
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
     * Authorization Key
     *
     * @type {string}
     */
    this.key = null;

    this.update();

    new Job(
      "Key Updater",
      "0 10 0 * * *", // 10 minutes
      async () => {
        await this.update();
      },
      this.options.debug
    ).start();
  }

  /**
   * Method that returns Twitch Authorization Key
   *
   * @returns {Promise<string>}
   */
  get(): Promise<string> {
    return new Promise(async (res, rej) => {
      if (!this.key) this.key = await this.update();
      return res(this.key);
    });
  }

  /**
   * Method that updates Twitch Authorization Key
   *
   * @returns {Promise<string>}
   */
  update(): Promise<string> {
    return new Promise(async (res, rej) => {
      const [clientID, clientSecret] = [
        this.options.credentials.clientID,
        this.options.credentials.clientSecret,
      ];

      const body = `?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;
      const data = await (
        await request("https://id.twitch.tv/oauth2/token" + body, {
          method: "POST",
        })
      ).body.json();

      this.key = data.access_token;
      return res(this.key);
    });
  }
}
