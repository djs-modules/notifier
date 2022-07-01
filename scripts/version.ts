import { inc } from "semver";
import pkg from "../package.json";
import fs from "node:fs";

export function getMajorVersion() {
  const newVersion = inc(pkg.version, "major");
  return newVersion;
}

export function getMinorVersion() {
  const newVersion = inc(pkg.version, "minor");
  return newVersion;
}

export function getPatchVersion() {
  const newVersion = inc(pkg.version, "patch");
  return newVersion;
}

switch (process.argv[2].slice(1)) {
  case "major": {
    const version = getMajorVersion()!;

    console.log(`[Version Patch] New version: ${version}`);
    console.log(`[Version Patch] Settings new version...`);

    pkg.version = version;
    fs.writeFileSync("../package.json", JSON.stringify(pkg, null, 2));

    console.log(`[Version Patch] Done!`);
    break;
  }

  case "minor": {
    const version = getMinorVersion()!;

    console.log(`[Version Patch] New version: ${version}`);
    console.log(`[Version Patch] Settings new version...`);

    pkg.version = version;
    fs.writeFileSync("../package.json", JSON.stringify(pkg, null, 2));

    console.log(`[Version Patch] Done!`);
    break;
  }

  case "patch": {
    const version = getPatchVersion()!;

    console.log(`[Version Patch] New version: ${version}`);
    console.log(`[Version Patch] Settings new version...`);

    pkg.version = version;
    fs.writeFileSync("../package.json", JSON.stringify(pkg, null, 2));

    console.log(`[Version Patch] Done!`);
    break;
  }
}
