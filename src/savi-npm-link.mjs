#!/usr/bin/env zx

import { $, argv, cd, chalk, fs, path, question, quiet } from 'zx';
import { SAVI_HOME_ALL_CAPI, SAVI_HOME_ALL_WEB } from './util/env.mjs';
import {
  cloneRepository,
  getPackageName,
  getRepoNameByPackage,
} from './util/repositories.mjs';

if (argv.about) {
  console.log(
    chalk.bold.italic.whiteBright(
      `links current ./node_modules/@digital-coupons`
    )
  );
  console.log(
    chalk.gray(`
  List the contents inside ./node_modules/@digital-coupons to its corresponding
  folder inside SAVI_ALL_CAPI_HOME. If it's not present, it will download it.`)
  );
  process.exit(0);
}
const pwd = await $`pwd`;
const projectDirectory = `${pwd}`.replace(/\n/gi, '');
const digitalCouponsDependenciesPath = path.resolve(
  projectDirectory,
  'node_modules/@digital-coupons/'
);

if (!fs.pathExistsSync(digitalCouponsDependenciesPath)) {
  console.log(chalk.red(`🔥 Cannot find ${digitalCouponsDependenciesPath}`));
  process.exit(1);
}

const installedDependencies = fs.readdirSync(digitalCouponsDependenciesPath);
for (let index = 0; index < installedDependencies.length; index += 1) {
  const dependency = installedDependencies[index];
  const dependencyPackageName = getPackageName(dependency);
  const repoName = await getRepoNameByPackage(dependencyPackageName);
  // if dependency is not downloaded, ask the user to clone the repo
  if (!repoName) {
    console.log(chalk.yellow(`Dependency not download: ${dependency}`));
    const download = await question(
      chalk.white('Do you want to download it?'),
      {
        choices: ['yes', 'no'],
      }
    );
    if (download === 'yes') {
      try {
        await $`${cloneRepository({
          parentFolder: process.env.ALL_CAPI_HOME,
          repository: repoName,
        })}`;
        cd(dependency);
        console.log(chalk.green('Running npm install on dependency ...'));
        await quiet($`npm i`);
      } catch (error) {
        console.error(chalk.red(error.message));
        console.error(chalk.gray(error.stack));
      }
    }
  }

  cd(path.resolve(projectDirectory, 'node_modules', '@digital-coupons'));
  await $`rm -rf ${dependency}`;
  if (fs.pathExistsSync(`${SAVI_HOME_ALL_CAPI}/${repoName}`)) {
    await $`ln -s ${SAVI_HOME_ALL_CAPI}/${repoName} ${dependency}`;
  } else if (fs.pathExistsSync(`${SAVI_HOME_ALL_WEB}/${repoName}`)) {
    await $`ln -s ${SAVI_HOME_ALL_WEB}/${repoName} ${dependency}`;
  } else {
    console.log(
      chalk.red.bold(`Cannot link ${dependency} (repo name is: ${repoName})`)
    );
    console.log(
      chalk.red.bold(`Not found at ${SAVI_HOME_ALL_CAPI}/${repoName}}`)
    );
    console.log(
      chalk.red.bold(`Not found at ${SAVI_HOME_ALL_WEB}/${repoName}}`)
    );
  }
}
