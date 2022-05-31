#!/usr/bin/env zx

import { $, cd } from 'zx';
import {
  allPackagesNames,
  packagesMap,
  processPackages,
} from './util-packages-process.mjs';

async function resetGit() {
  for (let index = 0; index < allPackagesNames.length; index + 1) {
    const packageName = allPackagesNames[index];
    const { path } = packagesMap[packageName];
    console.log('Git reset', packageName, 'at', path);

    cd(path);
    await $`git clean -fdx`;
    await $`git reset --hard HEAD`;
  }
  await processPackages(true);
}

export { resetGit };
