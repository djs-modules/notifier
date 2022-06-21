import { CronCommand, CronJob } from "cron";

/**
 * Class that controls Cron Jobs
 *
 * @class
 * @classdesc Job Manager
 */
export class Job extends CronJob {
  /**
   * @constructor
   *
   * @param {string} name Job Name
   * @param {any} cronTime Time when Job will be working
   * @param {CronCommand} onTick Command that will be done
   * @param {boolean} debug Debug Mode
   * @param {CronCommand|null} onComplete Command that will be done on complete
   * @param {boolean} start Force Start
   * @param {string} timeZone Time Zone
   * @param {any} context Context
   * @param {boolean} runOnInit Run on Init
   * @param {string|number} utcOffset UTC Offset
   * @param {boolean} unrefTimeout Unref Timeout
   */
  constructor(
    name: string,
    cronTime: any,
    onTick: CronCommand,
    debug?: boolean,
    onComplete?: CronCommand | null,
    start?: boolean,
    timeZone?: string,
    context?: any,
    runOnInit?: boolean,
    utcOffset?: string | number,
    unrefTimeout?: boolean
  ) {
    super(
      cronTime,
      onTick,
      onComplete,
      start,
      timeZone,
      context,
      runOnInit,
      utcOffset,
      unrefTimeout
    );

    if (debug) console.log(`[CRON] Job with name "${name}" started!`);
  }
}
