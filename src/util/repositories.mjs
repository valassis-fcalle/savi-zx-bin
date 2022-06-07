import { $, cd, chalk, fs, path } from 'zx';
import { SAVI_HOME } from './env.mjs';
import {
  spinnerCreate,
  spinnerSetPrefix,
  spinnerSetText,
  spinnerStart,
  spinnerStop,
} from './spinner.mjs';

const CACHE_FILE_PATH = path.resolve(SAVI_HOME, 'repositories.json');
const GITHUB_HOST = 'github.com';
const GITHUB_ORGANIZATION = 'Valassis-Digital-Media';
const GITHUB_USER = 'git';
const PACKAGES_PREFIX = '@digital-coupons/';

let initialized = false;
const mapping = {
  package: {},
  repository: {},
};

async function refreshRepositoriesMapping() {
  if (initialized && fs.existsSync(CACHE_FILE_PATH)) {
    console.log(chalk.yellowBright(`${CACHE_FILE_PATH} file already exists`));
    console.log(chalk.gray('  - remove it to force repositories refresh'));
    return;
  }
  if (!initialized && fs.existsSync(CACHE_FILE_PATH)) {
    console.log(chalk.gray('Loading mapping from cache...'));
    const json = await fs.readJSON(CACHE_FILE_PATH);
    mapping.package = json.mapping.package;
    mapping.repository = json.mapping.repository;
    initialized = true;
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
      const repositoryPackageName = getPackageName(
        JSON.parse(
          Buffer.from(`${responsePackageName}`, 'base64')
            .toString('utf-8')
            .replace(/\n/, '')
        ).name || repositoryName
      );
      spinnerSetText(
        chalk.italic.gray(
          `repository: ${repositoryName}, package:  ${repositoryPackageName}`
        )
      );

      mapping.repository[repositoryName] = repositoryPackageName;
      mapping.package[repositoryPackageName] = repositoryName;
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
  console.log(CACHE_FILE_PATH);
  await fs.writeJson(CACHE_FILE_PATH, { mapping }, { spaces: 2 });
  initialized();
}

async function cloneRepository({ parentFolder, repository, force = false }) {
  cd(parentFolder);
  console.log('⬇️ ', chalk.bold('Cloning repository'));
  console.log('parentFolder:', parentFolder);
  console.log('repository  :', repository);

  if (force) {
    await $`rm -rf ${repository}`;
  }
  if (fs.existsSync(repository)) {
    console.log(chalk.yellow('Repository already exists'));
    return;
  }
  await $`gh repo clone ${GITHUB_ORGANIZATION}/${repository}`;
}

function getPackageName(name = '') {
  if (name.startsWith(PACKAGES_PREFIX)) {
    return name;
  }
  return `${PACKAGES_PREFIX}${name}`;
}

function getPackageNameByRepoName(name) {
  return mapping.repository[name];
}

async function getRepoNameByPackage(name) {
  if (!initialized) {
    await refreshRepositoriesMapping();
  }
  return mapping.package[getPackageName(name)];
}

async function resetToMaster(repositoryFolder, hardClean = false) {
  cd(repositoryFolder);
  if (hardClean) {
    await $`git clean -fdx`;
  }
  await $`git checkout master`;
  await $`git reset --hard HEAD`;
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
  cloneRepository,
  getPackageName,
  getPackageNameByRepoName,
  getRepoNameByPackage,
  refreshRepositoriesMapping,
  resetToMaster,
  updateSubmodules,
};
