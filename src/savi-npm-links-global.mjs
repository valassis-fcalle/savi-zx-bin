#!/usr/bin/env zx

import { $, argv, cd, chalk } from 'zx';
import { SAVI_HOME_OTHERS, SAVI_HOME_ROOT } from './util/env.mjs';

if (argv.about) {
  console.log(chalk.bold.italic.whiteBright(`creates required global links`));
  console.log(
    chalk.gray(`Creates the required links for testing, running mygulp, etc`),
  );
  process.exit(0);
}

const response = await $`npm root --global`;
cd(`${response.stdout.replace(/\n/gi, '')}/@digital-coupons`);
await Promise.all([
  $`ln -s ${SAVI_HOME_ROOT}/automation automation`,
  $`ln -s ${SAVI_HOME_ROOT}/bannertest banner-test`,
  $`ln -s ${SAVI_HOME_ROOT}/brandedlandingpagetest brandedlandingpage-test`,
  $`ln -s ${SAVI_HOME_ROOT}/iframeeutest iframe-eu-test`,
  $`ln -s ${SAVI_HOME_ROOT}/offermanagertest offermanager-test`,
  $`ln -s ${SAVI_HOME_OTHERS}/buildNpm`,
]);
