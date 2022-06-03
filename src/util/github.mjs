#!/usr/bin/env zx

import { $, cd, chalk, fs, path } from 'zx';
import { SAVI_HOME } from './env.mjs';
import {
  spinnerCreate,
  spinnerSetPrefix,
  spinnerSetText,
  spinnerStart,
  spinnerStop,
} from './spinner.mjs';

const GITHUB_HOST = 'github.com';
const GITHUB_ORGANIZATION = 'Valassis-Digital-Media';
const GITHUB_USER = 'git';

const repositoriesMap = {};

const cacheFilePath = path.resolve(SAVI_HOME, 'repositories.json');

async function refreshRepositoriesMapping() {
  if (fs.existsSync(cacheFilePath)) {
    console.log(chalk.yellowBright(`${cacheFilePath} file already exists`));
    console.log(chalk.gray('remove it to force repositories refresh'));
    return;
  }

  console.log(
    'ℹ️ ',
    chalk.bold.white(`Obtaining repositories for ${GITHUB_ORGANIZATION}...`)
  );
  const responseRepoList =
    await $`gh repo list ${GITHUB_ORGANIZATION} --no-archived --json name --limit 250`;
  const list = JSON.parse(`${responseRepoList}`).map((entry) => entry.name);
  console.log('Found', list.length, 'repositories');

  spinnerCreate();
  spinnerSetText('Processing repositories ...');
  spinnerStart();
  for (let index = 0; index < list.length; index += 1) {
    const repositoryName = list[index];
    spinnerSetPrefix(`[${index + 1}/${list.length}]`);
    try {
      const responsePackageName =
        await $`gh api /repos/Valassis-Digital-Media/${repositoryName}/contents/package.json --jq '.content'`;
      const repositoryPackageName = JSON.parse(
        Buffer.from(`${responsePackageName}`, 'base64')
          .toString('utf-8')
          .replace(/\n/, '')
      ).name;
      spinnerSetText(
        chalk.italic.gray(
          `repository: ${repositoryName}, package:  ${repositoryPackageName}`
        )
      );

      repositoriesMap[repositoryName] = {
        name: {
          directory: repositoryName,
          package: repositoryPackageName || repositoryName,
        },
      };
    } catch (error) {
      if (error.message.indexOf('404') === -1) {
        console.error(
          chalk.red(`Error processing repository ${repositoryName}`)
        );
        console.error(chalk.red(error.message));
        console.error(error.stack);
      } else {
        spinnerSetText(
          chalk.italic.yellow.dim(`  ! ${repositoryName} has no package.json`)
        );
      }
    }
  }
  spinnerStop();

  console.log('💾 ', chalk.bold.white(`Writing cache file:`));
  console.log(chalk.bold.white(cacheFilePath));
  await fs.writeJson(cacheFilePath, repositoriesMap, { spaces: 2 });
}

async function cloneRepository({ parentFolder, repository, force = false }) {
  cd(parentFolder);
  console.log('⬇️ ', chalk.bold('Cloning repository'));
  console.log('parentFolder:', parentFolder);
  console.log('repository  :', repository);

  if (force) {
    await $`rm -rf ${repository}`;
  }
  await $`gh repo clone ${GITHUB_ORGANIZATION}/${repository}`;
}

async function updateSubmodules(repositoryFolder) {
  spinnerCreate({ text: 'Updating submodules' });
  spinnerStart();
  try {
    cd(repositoryFolder);
    await $`git submodule update --init --recursive`;
  } catch (error) {
    console.error(
      chalk.red(`Error updating submodules at ${repositoryFolder}`)
    );
    console.error(chalk.red(error.message));
    console.error(error.stack);
  } finally {
    spinnerStop();
  }
}

export {
  GITHUB_HOST,
  GITHUB_ORGANIZATION,
  GITHUB_USER,
  cloneRepository,
  refreshRepositoriesMapping,
  updateSubmodules,
};
