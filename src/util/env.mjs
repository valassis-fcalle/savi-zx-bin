#!/usr/bin/env zx

import { $, chalk, which } from 'zx';

$.verbose = process.env.DEBUG === 'true' || false;

const { SAVI_HOME, SAVI_HOME_ALL_CAPI, SAVI_HOME_ALL_WEB } = process.env;

let missingEnvVariables = false;
if (!SAVI_HOME) {
  console.log(chalk.red('> SAVI_HOME env variable not defined'));
  missingEnvVariables = true;
}
if (!SAVI_HOME_ALL_CAPI) {
  console.log(chalk.red('> SAVI_HOME_ALL_CAPI env variable not defined'));
  missingEnvVariables = true;
}
if (!SAVI_HOME_ALL_WEB) {
  console.log(chalk.red('> SAVI_HOME_ALL_WEB env variable not defined'));
  missingEnvVariables = true;
}

if (missingEnvVariables) {
  process.exit(1);
}

// check for minimum requirements to work
const gh = await which('gh');
if (!gh) {
  console.log(chalk.red('> GitHub client not found. Please install it'));
  console.log('  Read more at https://github.com/cli/cli');
  process.exit(1);
}

export { SAVI_HOME, SAVI_HOME_ALL_CAPI, SAVI_HOME_ALL_WEB };
