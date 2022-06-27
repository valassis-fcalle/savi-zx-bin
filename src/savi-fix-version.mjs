#!/usr/bin/env zx

import { $, chalk, fs } from 'zx';
import './util/env.mjs';

if (!fs.existsSync('./package.json')) {
  console.log(chalk.red('Cannot find package.json file'));
}
console.log('Obtaining current version ...');
const json = fs.readJSONSync('./package.json');
const result = await $`npm view ${json.name} version`;
json.version = `${result.stdout}`.replace('\n', '');
console.log('Current version is: ', json.version);
console.log('Updating package.json ...');
fs.writeJSONSync('./package.json', json, { spaces: 2 });
console.log('Done!');
