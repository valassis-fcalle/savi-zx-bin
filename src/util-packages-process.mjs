#!/usr/bin/env zx

import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';

if (!process.env.ALL_CAPI_HOME || process.env.ALL_CAPI_HOME.length === 0) {
  console.error('🔥 ALL_CAPI_HOME env variable not found or empty');
  process.exit(1);
}
const { ALL_CAPI_HOME } = process.env;

const packagesMap = {};
let allPackagesNames = [];
let allDependenciesNames = [];

function processPackages(force = false) {
  // skip if already processed
  if (
    !force &&
    Object.keys(packagesMap).length > 0 &&
    allPackagesNames !== null
  ) {
    return;
  }

  // list all folders in all-capi
  const dirNames = readdirSync(ALL_CAPI_HOME)
    .filter((entry) => !entry.startsWith('.'))
    .filter((entry) => lstatSync(`${ALL_CAPI_HOME}/${entry}`).isDirectory())
    .filter((entry) => existsSync(`${ALL_CAPI_HOME}/${entry}/package.json`));

  // build packages map
  dirNames.forEach((dirName) => {
    const path = `${ALL_CAPI_HOME}/${dirName}`;
    const json = JSON.parse(readFileSync(`${path}/package.json`));

    let currentDependencies = [];

    if (json.dependencies) {
      currentDependencies = currentDependencies.concat(
        currentDependencies,
        Object.keys(json.dependencies).filter((dependency) =>
          dependency.startsWith('@digital-')
        )
      );
    }
    if (json.devDependencies) {
      currentDependencies = currentDependencies.concat(
        currentDependencies,
        Object.keys(json.devDependencies).filter((dependency) =>
          dependency.startsWith('@digital-')
        )
      );
    }

    if (json.peerDependencies) {
      currentDependencies = currentDependencies.concat(
        currentDependencies,
        Object.keys(json.peerDependencies).filter((dependency) =>
          dependency.startsWith('@digital-')
        )
      );
    }

    packagesMap[json.name] = {
      dependencies: [...new Set(currentDependencies)],
      json,
      name: {
        folder: dirName,
        package: json.name,
      },
      path,
    };
  });

  if (Object.keys(packagesMap).length === 0) {
    console.error('CAPI package map empty');
    process.exit(1);
  }

  allPackagesNames = Object.keys(packagesMap);
  allDependenciesNames = Object.values(packagesMap).reduce(
    (previous, current) => {
      const allDeps = previous.concat(current.dependencies);
      return [...new Set(allDeps)];
    },
    []
  );

  if (!allPackagesNames || allPackagesNames.length === 0) {
    console.error('CAPI dependencies not found or empty');
    process.exit(1);
  }
}

export { allPackagesNames, allDependenciesNames, packagesMap, processPackages };
