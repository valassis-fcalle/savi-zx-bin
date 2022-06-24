#!/usr/bin/env zx

import { $, argv, chalk, fs } from 'zx';
import {
  getDigitalCouponsDependencyPath,
  linkDependenciesModeAuto,
  linkDependenciesModeInteractive,
} from './util/project.mjs';

if (argv.about) {
  console.log(
    chalk.bold.italic.whiteBright(
      `links current ./node_modules/@digital-coupons`
    )
  );
  console.log(
    chalk.gray(`
  List the contents inside ./node_modules/@digital-coupons to its corresponding
  folder inside SAVI_ALL_CAPI_HOME. If it's not present, it will download it.`)
  );
  process.exit(0);
}

const pwd = await $`pwd`;
const projectDirectory = `${pwd}`.replace(/\n/gi, '');

const digitalCouponsDependenciesPath = await getDigitalCouponsDependencyPath(
  projectDirectory
);
if (!fs.pathExistsSync(digitalCouponsDependenciesPath)) {
  console.log(chalk.red(`🔥 Cannot find ${digitalCouponsDependenciesPath}`));
  process.exit(1);
}

if (argv.interactive || argv.i) {
  linkDependenciesModeInteractive(projectDirectory);
} else {
  linkDependenciesModeAuto(projectDirectory);
}
