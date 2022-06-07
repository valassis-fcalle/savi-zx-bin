#!/usr/bin/env zx

import { $, chalk, which } from 'zx';
import { SAVI_HOME_ALL_CAPI, SAVI_HOME_ALL_WEB } from './util/env.mjs';

function buildSourcePath(name) {
  return `${__dirname}/resources/${name}.nodemon.json`;
}
function buildTargetPath(name, root) {
  return `${root}/${name}/nodemon.json`;
}

async function copyNodemonFile(name) {
  switch (name) {
    case 'backbonecapi':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'backbonecapi',
        SAVI_HOME_ALL_CAPI
      )}`;
      break;
    case 'deckard':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'dc-deckard',
        SAVI_HOME_ALL_CAPI
      )}`;
      break;
    case 'offermanager':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'OfferManager',
        SAVI_HOME_ALL_WEB
      )}`;
      break;
    case 'themes':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'Themes',
        SAVI_HOME_ALL_WEB
      )}`;
      break;
    case 'webapps':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'WebApps',
        SAVI_HOME_ALL_WEB
      )}`;
      break;

    default:
      console.warn('Nodemon configuration not found for', name);
      break;
  }
}

try {
  await which('nodemon');
} catch (error) {
  console.error(chalk.red('Error: nodemon not found in your system'));
  console.error(
    chalk.white(`Install it by running: ${chalk.italic('npm i -g nodemon')}`)
  );
}

await Promise.all([
  copyNodemonFile('backbonecapi'),
  copyNodemonFile('deckard'),
  copyNodemonFile('offermanager'),
  copyNodemonFile('themes'),
  copyNodemonFile('webapps'),
]);
