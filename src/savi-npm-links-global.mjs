#!/usr/bin/env zx

import { $, argv, cd, chalk } from 'zx';
import { SAVI_HOME_ALL_CAPI, SAVI_HOME_ALL_WEB } from './util/env.mjs';

if (argv.about) {
  console.log(chalk.bold.italic.whiteBright(`creates required global links`));
  console.log(
    chalk.gray(`Creates the required links for testing, running mygulp, etc`)
  );
  process.exit(0);
}

const response = await $`npm root --global`;
cd(`${response.stdout.replace(/\n/gi, '')}/@digital-coupons`);
await Promise.all([
  $`ln -s ${SAVI_HOME_ALL_WEB}/Automation automation`,
  $`ln -s ${SAVI_HOME_ALL_WEB}/BannerTest banner-test`,
  $`ln -s ${SAVI_HOME_ALL_WEB}/BrandedLandingPageTest brandedlandingpage-test`,
  $`ln -s ${SAVI_HOME_ALL_WEB}/IframeEuTest iframe-eu-test`,
  $`ln -s ${SAVI_HOME_ALL_WEB}/OffermanagerTest offermanager-test`,
  $`ln -s ${SAVI_HOME_ALL_CAPI}/buildNpm`,
]);
