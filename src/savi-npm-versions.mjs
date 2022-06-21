#!/usr/bin/env zx

import { $, argv, cd, chalk, glob } from 'zx';
import { SAVI_HOME_ALL_CAPI, SAVI_HOME_ALL_WEB } from './util/env.mjs';
import { getDirectories } from './util/fs.mjs';
import {
  getPackageNameByRepoName,
  refreshRepositoriesMapping,
} from './util/repositories.mjs';
import {
  spinnerCreate,
  spinnerSetText,
  spinnerStart,
  spinnerStop,
} from './util/spinner.mjs';

if (argv.about) {
  console.log(
    chalk.bold.italic.whiteBright(
      `shows current versions of all the node based projects`
    )
  );
  console.log(
    chalk.gray(`
      Output can be restricted to ALL_CAPI, ALL_WEB or filtered
      by name using glob.
      --capi: filters all repo under ALL_CAPI
      --web: filters all repo under ALL_WEB
      --name "mem-*": filters all repos with a name starting with mem-
    `)
  );
  process.exit(0);
}

await refreshRepositoriesMapping();

let dirs = [];
const globbyFilters = ['!bin', '!node_modules'];
const globbyOptions = {
  onlyDirectories: true,
  expandDirectories: false,
};

if (argv.capi) {
  cd(SAVI_HOME_ALL_CAPI);
  dirs.concat(await getDirectories('.', true));
}
if (argv.web) {
  cd(SAVI_HOME_ALL_WEB);
  dirs.concat(await getDirectories('.', true));
}
if (argv.name) {
  const filter = [argv.name, ...globbyFilters];
  dirs = dirs.concat(
    await glob(filter, {
      ...globbyOptions,
      cwd: SAVI_HOME_ALL_CAPI,
    })
  );
  dirs = dirs.concat(
    await glob([argv.name, ...globbyFilters], {
      ...globbyOptions,
      cwd: SAVI_HOME_ALL_WEB,
    })
  );
}

const uniqueDirsSet = [...new Set(dirs)];
if (!uniqueDirsSet || !uniqueDirsSet.length) {
  console.log(chalk.red('Cannot find packages with the provided name'));
  process.exit(1);
}

spinnerCreate({ text: 'Requesting npm versions ...' });
spinnerStart();
const versionMappings = {};
for (let index = 0; index < uniqueDirsSet.length; index += 1) {
  spinnerSetText(`Processing ${index + 1}/${uniqueDirsSet.length}`);
  const packageName = getPackageNameByRepoName(uniqueDirsSet[index]);
  if (packageName) {
    const result = await $`npm view ${packageName}  version`;
    const version = `${result.stdout}`.trim();
    versionMappings[packageName] = version;
  }
}
spinnerStop();

Object.keys(versionMappings)
  .sort()
  .forEach((key) => console.log(`- ${key}: ${versionMappings[key]}`));

process.exit(0);
