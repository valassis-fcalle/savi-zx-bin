#!/usr/bin/env zx

import { path } from 'zx';
import { confirm } from './util/confirm.mjs';
import {
  SAVI_HOME,
  SAVI_HOME_ALL_CAPI,
  SAVI_HOME_ALL_WEB,
} from './util/env.mjs';
import { getDirectories } from './util/fs.mjs';
import { installDependencies } from './util/npm.mjs';
import {
  spinnerCreate,
  spinnerSetPrefix,
  spinnerSetText,
  spinnerStart,
  spinnerStop,
} from './util/spinner.mjs';
import {
  cloneRepository,
  refreshRepositoriesMapping,
  resetToMaster,
  updateSubmodules,
} from './util/repositories.mjs';

async function initRepo(parentFolder, repository, home) {
  await cloneRepository({
    parentFolder,
    repository,
    force: true,
  });
  await updateSubmodules(home);
  const directories = getDirectories(home);
  spinnerCreate({ text: 'Reset submodules' });
  spinnerStart();
  for (let index = 0; index < directories.length; index += 1) {
    const directory = directories[index];
    try {
      const directoryPath = path.resolve(home, directory);
      spinnerSetPrefix(directory);
      spinnerSetText(`Reset to master`);
      await resetToMaster(directoryPath, true);
      spinnerSetText(`Installing dependencies`);
      await installDependencies(directoryPath);
    } catch (error) {
      console.error('Error initializing repository', directory);
      console.error(error);
    }
  }
  spinnerStop();
}

await refreshRepositoriesMapping();
const confirmed = await confirm(
  'This action will remove any existing files. Are you sure?'
);
if (confirmed) {
  await initRepo(SAVI_HOME, 'all-capi', SAVI_HOME_ALL_CAPI);
  await initRepo(SAVI_HOME, 'all-web', SAVI_HOME_ALL_WEB);
}
