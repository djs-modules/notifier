import { Options } from "../src/types";
import { Job } from "./Job";

export declare interface KeyManager {
  options: Options;
  key?: string;
}

export declare class KeyManager {
  constructor(options: Options);

  get(): Promise<string>;
  update(): Promise<string>;
}
