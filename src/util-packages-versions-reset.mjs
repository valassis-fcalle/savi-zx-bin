#!/usr/bin/env zx

import { $, chalk, fs } from 'zx';
import { allPackagesNames, packagesMap } from './util-packages-process';

async function resetVersions() {
  for (let index = 0; index < allPackagesNames.length; index += 1) {
    const packageName = allPackagesNames[index];
    const { json, path } = packagesMap[packageName];
    console.log('Version reset', packageName, 'at', path);
    const result = await $`npm view ${packageName} version`;
    const version = `${result.stdout}`.trim();
    console.log(chalk.gray(`\t> new version is: ${version}`));
    json.version = version;
    await fs.writeJson(`${path}/package.json`, json, { spaces: 2 });
  }
}

export { resetVersions };
