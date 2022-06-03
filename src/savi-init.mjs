#!/usr/bin/env zx

import {
  SAVI_HOME,
  SAVI_HOME_ALL_CAPI,
  SAVI_HOME_ALL_WEB,
} from './util/env.mjs';
import {
  cloneRepository,
  refreshRepositoriesMapping,
  updateSubmodules,
} from './util/github.mjs';

await refreshRepositoriesMapping();
await cloneRepository({
  parentFolder: SAVI_HOME,
  repository: 'all-capi',
  force: true,
});
await updateSubmodules(SAVI_HOME_ALL_CAPI);
await cloneRepository({
  parentFolder: SAVI_HOME,
  repository: 'all-web',
  force: true,
});
await updateSubmodules(SAVI_HOME_ALL_WEB);
