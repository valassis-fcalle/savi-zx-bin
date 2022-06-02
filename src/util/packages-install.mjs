#!/usr/bin/env zx

import { $, cd, chalk, fs } from 'zx';
import { packagesMap } from './packages-process.mjs';
import { pick } from './pick.mjs';

async function installPackages(packagesNames) {
  for (let index = 0; index < packagesNames.length; index += 1) {
    const packageName = packagesNames[index];
    console.log('NPM install at', packageName);

    const { path } = packagesMap[packagesNames[index]];
    cd(path);
    try {
      const hasNodeModules = await fs.pathExists(`${path}/node_modules`);
      if (!hasNodeModules) {
        await $`npm i`;
      } else {
        console.log(chalk.gray('\tInstallation skipped ...'));
      }
    } catch (error) {
      console.error(`Error installing dependencies at ${packageName}`);
      console.error(error.message);
      console.error(error.stack);
      await $`rm -rf node_modules`;
    }
  }
}

async function install() {
  const notDependant = pick(false);
  const dependant = pick(true);

  await installPackages(notDependant);
  await installPackages(dependant);
}

export { install };
