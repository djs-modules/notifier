import { CronCommand, CronJob } from "cron";

export declare class Job extends CronJob {
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
  );
}
