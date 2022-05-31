#!/usr/bin/env zx

import { allPackagesNames, packagesMap } from './util-packages-process.mjs';
import { writeFile } from 'fs';
import { promisify } from 'util';

const write = promisify(writeFile);

async function resetVersions() {
  for (let index = 0; index < allPackagesNames.length; index++) {
    const packageName = allPackagesNames[index];
    const { json, path } = packagesMap[packageName];
    console.log('Version reset', packageName, 'at', path);
    const result = await $`npm view ${packageName} version`;
    const version = `${result.stdout}`.trim();
    console.log(chalk.gray(`\t> new version is: ${version}`));
    json.version = version;
    await write(`${path}/package.json`, JSON.stringify(json, null, 2));
  }
}

export { resetVersions };
