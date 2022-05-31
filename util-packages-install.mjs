#!/usr/bin/env zx

import { allPackagesNames, packagesMap } from './util-packages-process.mjs';

function pick(hasCapiDependencies) {
  const packagesNames = allPackagesNames.filter((packageName) => {
    const { json } = packagesMap[packageName];

    const foundInDependencies = Object.keys(json.dependencies || {}).find(
      (dependencyName) => dependencyName.startsWith('@digital-coupons')
    );
    const foundInDevDependencies = Object.keys(json.devDependencies || {}).find(
      (dependencyName) => dependencyName.startsWith('@digital-coupons')
    );
    const foundInPeerDependencies = Object.keys(
      json.peerDependencies || {}
    ).find((dependencyName) => dependencyName.startsWith('@digital-coupons'));

    if (
      hasCapiDependencies &&
      (foundInDependencies || foundInDevDependencies || foundInPeerDependencies)
    ) {
      return packageName;
    }

    if (
      !hasCapiDependencies &&
      !foundInDependencies &&
      !foundInDevDependencies &&
      !foundInPeerDependencies
    ) {
      return packageName;
    }
  });

  return packagesNames;
}

async function installPackages(packagesNames) {
  for (let index = 0; index < packagesNames.length; index++) {
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
