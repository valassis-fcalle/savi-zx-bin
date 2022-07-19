#!/usr/bin/env zx

import { $, chalk, which } from 'zx';
import { SAVI_HOME_ROOT } from './util/env.mjs';

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
        SAVI_HOME_ROOT,
      )}`;
      break;
    case 'deckard':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'dc-deckard',
        SAVI_HOME_ROOT,
      )}`;
      break;
    case 'offermanager':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'offermanager',
        SAVI_HOME_ROOT,
      )}`;
      break;
    case 'themes':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'themes',
        SAVI_HOME_ROOT,
      )}`;
      break;
    case 'webapps':
      await $`cp ${buildSourcePath(name)} ${buildTargetPath(
        'webapps',
        SAVI_HOME_ROOT,
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
    chalk.white(`Install it by running: ${chalk.italic('npm i -g nodemon')}`),
  );
}

await Promise.all([
  copyNodemonFile('backbonecapi'),
  copyNodemonFile('deckard'),
  copyNodemonFile('offermanager'),
  copyNodemonFile('themes'),
  copyNodemonFile('webapps'),
]);
