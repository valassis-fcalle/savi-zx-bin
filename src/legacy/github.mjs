#!/usr/bin/env zx

import { $, cd, chalk, fs, path } from 'zx';
import { SAVI_HOME } from '../util/env.mjs';
import {
  spinnerCreate,
  spinnerSetPrefix,
  spinnerSetText,
  spinnerStart,
  spinnerStop,
} from '../util/spinner.mjs';

const GITHUB_HOST = 'github.com';
const GITHUB_ORGANIZATION = 'Valassis-Digital-Media';
const GITHUB_USER = 'git';

const repositoriesMap = {};

async function getRepositoryName(packageName) {
  const entry = Object.values(repositoriesMap).find(
    ({ name }) => name.package.indexOf(packageName) !== -1
  );
  if (!entry) {
    throw new Error(
      `Cannot find repository mapping for ${packageName} package`
    );
  }
}

export {
  GITHUB_HOST,
  GITHUB_ORGANIZATION,
  GITHUB_USER,
  cloneRepository,
  getRepositoryName,
  refreshRepositoriesMapping,
  updateSubmodules,
};
