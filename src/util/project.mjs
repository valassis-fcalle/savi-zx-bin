import inquirer from 'inquirer';
import ica from 'inquirer-checkbox-autocomplete-prompt';
import { $, cd, chalk, fs, glob, path, question, quiet } from 'zx';
import { SAVI_HOME_ALL_CAPI, SAVI_HOME_ALL_WEB } from './env.mjs';
import { isSymbolicLink } from './fs.mjs';
import {
  cloneRepository,
  getPackageName,
  getRepoNameByPackage,
} from './repositories.mjs';

inquirer.registerPrompt('checkbox-autocomplete', ica);

async function getDigitalCouponsDependencyPath(projectDirectory) {
  return path.resolve(projectDirectory, 'node_modules/@digital-coupons/');
}

async function getInstalledDependencies(projectDirectory) {
  const digitalCouponsDependenciesFolder =
    await getDigitalCouponsDependencyPath(projectDirectory);
  cd(digitalCouponsDependenciesFolder);
  return glob(['*'], {
    onlyDirectories: true,
    expandDirectories: false,
  });
}

async function linkDependencies(digitalCouponsDependenciesPath, dependencies) {
  for (let index = 0; index < dependencies.length; index += 1) {
    const dependency = dependencies[index];
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

    if (
      !isSymbolicLink(path.resolve(digitalCouponsDependenciesPath, dependency))
    ) {
      cd(digitalCouponsDependenciesPath);
      await $`rm -rf ${dependency}`;
      if (fs.pathExistsSync(`${SAVI_HOME_ALL_CAPI}/${repoName}`)) {
        await $`ln -s ${SAVI_HOME_ALL_CAPI}/${repoName} ${dependency}`;
      } else if (fs.pathExistsSync(`${SAVI_HOME_ALL_WEB}/${repoName}`)) {
        await $`ln -s ${SAVI_HOME_ALL_WEB}/${repoName} ${dependency}`;
      } else {
        console.log(
          chalk.red.bold(
            `Cannot link ${dependency} (repo name is: ${repoName})`
          )
        );
        console.log(
          chalk.red.bold(`Not found at ${SAVI_HOME_ALL_CAPI}/${repoName}`)
        );
        console.log(
          chalk.red.bold(`Not found at ${SAVI_HOME_ALL_WEB}/${repoName}`)
        );
      }
    } else {
      console.log(chalk.gray(`skipped ${dependency} link (already a symlink)`));
    }
  }
}

async function linkDependenciesModeInteractive(projectDirectory) {
  const digitalCouponsDependenciesPath = await getDigitalCouponsDependencyPath(
    projectDirectory
  );
  const choices = await getInstalledDependencies(projectDirectory);

  const { dependencies } = await inquirer.prompt([
    {
      choices,
      loop: false,
      message: 'Select dependencies to link',
      name: 'dependencies',
      pageSize: 5,
      type: 'checkbox-autocomplete',
    },
  ]);

  await linkDependencies(digitalCouponsDependenciesPath, dependencies);
}

async function linkDependenciesModeAuto(projectDirectory) {
  const digitalCouponsDependenciesPath = await getDigitalCouponsDependencyPath(
    projectDirectory
  );
  const installedDependencies = await getInstalledDependencies(
    projectDirectory
  );

  await linkDependencies(digitalCouponsDependenciesPath, installedDependencies);
}

export {
  getDigitalCouponsDependencyPath,
  getInstalledDependencies,
  linkDependenciesModeAuto,
  linkDependenciesModeInteractive,
};
