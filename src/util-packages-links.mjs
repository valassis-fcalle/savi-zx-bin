#!/usr/bin/env zx

import { $, cd, chalk, fs } from 'zx';
import { allPackagesNames, packagesMap } from './util-packages-process.mjs';

$.verbose = process.env.DEBUG === 'true' || false;

const whichResult = await $`npm root --global`;
const ROOT_NODE_MODULES = `${whichResult.stdout}`;

function pick(hasCapiDependencies) {
  const packagesNames = allPackagesNames
    .filter((packageName) => {
      const { json } = packagesMap[packageName];

      const foundInDependencies = Object.keys(json.dependencies || {}).find(
        (dependencyName) => dependencyName.startsWith('@digital-coupons')
      );
      const foundInDevDependencies = Object.keys(
        json.devDependencies || {}
      ).find((dependencyName) => dependencyName.startsWith('@digital-coupons'));
      const foundInPeerDependencies = Object.keys(
        json.peerDependencies || {}
      ).find((dependencyName) => dependencyName.startsWith('@digital-coupons'));

      if (
        hasCapiDependencies &&
        (foundInDependencies ||
          foundInDevDependencies ||
          foundInPeerDependencies)
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

      return undefined;
    })
    .filter((packageName) => packageName !== undefined);

  return packagesNames;
}

async function createLinksForSet(packagesNames) {
  for (let index = 0; index < packagesNames.length; index += 1) {
    const packageName = packagesNames[index];
    console.log(
      `[${index + 1}/${packagesNames.length}]`,
      'Creating link for',
      packageName
    );

    if (!fs.pathExists(`${ROOT_NODE_MODULES}/${packageName}`)) {
      const { path } = packagesMap[packagesNames[index]];
      cd(path);
      await $`npm link`;
    } else {
      console.log(chalk.gray('  Link already created. Skipping ...'));
    }
  }
}

function isSymbolicLink(path, packageName) {
  const statsObj = fs.lstatSync(`${path}/node_modules/${packageName}`);
  return statsObj.isSymbolicLink();
}

async function usesSymLinks(packagesNames) {
  for (let index = 0; index < packagesNames.length; index += 1) {
    const packageName = packagesNames[index];
    console.log(
      `[${index + 1}/${packagesNames.length}]`,
      'Checking link for',
      packageName,
      '...'
    );
    const { dependencies, path } = packagesMap[packageName];
    dependencies.forEach((dependency) => {
      if (!isSymbolicLink(path, dependency)) {
        console.log(chalk.red(`  Dependency ${dependency} is not a symlink`));
      }
    });
  }
}

async function createLinks() {
  const notDependant = pick(false);
  const dependant = pick(true);

  await createLinksForSet(notDependant);
  await createLinksForSet(dependant);
}

async function checkLinks() {
  const dependant = pick(true);
  await usesSymLinks(dependant);
}

async function useLinks() {
  const dependant = pick(true);
  for (let index = 0; index < dependant.length; index += 1) {
    const packageName = dependant[index];
    console.log(
      `[${index + 1}/${dependant.length}]`,
      'Using links for',
      packageName
    );

    const { dependencies, path } = packagesMap[packageName];
    cd(path);
    for (let depsIndex = 0; depsIndex < dependencies.length; depsIndex += 1) {
      const dependency = dependencies[depsIndex];
      const prefix = `[${depsIndex + 1}/${dependencies.length}]`;
      try {
        if (isSymbolicLink(path, dependency)) {
          console.log(
            chalk.gray(
              `  ${prefix} ${dependency} symlink already exists. Skipping...`
            )
          );
        } else {
          console.log(`  ${prefix} Linking ${dependency}`);
          await $`npm link ${dependency}`;
        }
      } catch (errorLinking) {
        console.log(`Error linking at ${packageName} package ${dependency}`);
        console.error(errorLinking);
      }
    }
  }
}

export { createLinks, checkLinks, useLinks };
