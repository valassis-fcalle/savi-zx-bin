#!/usr/bin/env zx

import { $, cd, chalk, fs } from 'zx';
import ora from 'ora';
import { packagesMap } from './packages-process.mjs';
import { pick } from './pick.mjs';

const whichResult = await $`npm root --global`;
const ROOT_NODE_MODULES = `${whichResult.stdout}`;
const { ALL_CAPI_HOME } = process.env;

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

async function usesSymLinks(packagesNames) {
  const spinner = ora('Checking links ...');

  for (let index = 0; index < packagesNames.length; index += 1) {
    const packageName = packagesNames[index];
    console.log(
      `[${index + 1}/${packagesNames.length}]`,
      'Checking link for',
      packageName,
      '...'
    );
    const { dependencies, path } = packagesMap[packageName];
    spinner.start();
    dependencies.forEach((dependency) => {
      spinner.text = `Checking dependency ${dependency}`;
      if (!isSymbolicLink(path, dependency)) {
        console.log(chalk.red(`  Dependency ${dependency} is not a symlink`));
      }
    });
    spinner.stop();
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
    const spinner = ora('Using links ...').start();
    for (let depsIndex = 0; depsIndex < dependencies.length; depsIndex += 1) {
      const dependency = dependencies[depsIndex];
      const prefix = `  [${depsIndex + 1}/${dependencies.length}]`;
      try {
        spinner.prefixText = prefix;

        if (isSymbolicLink(path, dependency)) {
          spinner.text = `${dependency} symlink already exists. Skipping...`;
          // console.log(
          //   chalk.gray(
          //     `  ${prefix} ${dependency} symlink already exists. Skipping...`
          //   )
          // );
        } else {
          spinner.text = `Linking ${dependency}`;
          // console.log(`  ${prefix} Linking ${dependency}`);
          // await $`npm link ${dependency}`;
          const symlinkSource = `${ALL_CAPI_HOME}/${packagesMap[dependency].name.folder}`;
          await $`rm -rf ./node_modules/${dependency}`;
          await $`ln -s ${symlinkSource} ./node_modules/${dependency}`;
        }
      } catch (errorLinking) {
        spinner.fail(`Error linking at ${packageName} package ${dependency}`);
        console.log(`Error linking at ${packageName} package ${dependency}`);
        console.error(errorLinking);
      }
    }
    spinner.stop();
  }
}

export { checkLinks, createLinks, createLinksForSet, useLinks, usesSymLinks };
