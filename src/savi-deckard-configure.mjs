#!/usr/bin/env zx
import { EOL } from 'os';
import { chalk, fs, path } from 'zx';

import { SAVI_HOME_ROOT } from './util/env.mjs';
import { readFileLineByLine } from './util/fs.mjs';

const deckardConfig = (
  await readFileLineByLine(
    path.resolve(__dirname, 'resources', 'localhost.ini'),
  )
).map((line) => {
  if (line.startsWith('#proxy_eubackbonecapi='))
    return line.replace(
      /#proxy_eubackbonecapi=/g,
      `proxy_eubackbonecapi=file://${path.resolve(
        SAVI_HOME_ROOT,
        'backbonecapi',
      )}`,
    );
  if (line.startsWith('#proxy_eudashboards='))
    return line.replace(
      /#proxy_eudashboards=/g,
      `proxy_eudashboards=file://${path.resolve(SAVI_HOME_ROOT, 'dashboards')}`,
    );
  if (line.startsWith('#proxy_euomf_web='))
    return line.replace(
      /#proxy_euomf_web=/g,
      `proxy_euomf_web=file://${path.resolve(SAVI_HOME_ROOT, 'offermanager')}`,
    );
  if (line.startsWith('#proxy_euthemes='))
    return line.replace(
      /#proxy_euthemes=/g,
      `proxy_euthemes=file://${path.resolve(SAVI_HOME_ROOT, 'themes')}`,
    );
  if (line.startsWith('#proxy_webapps='))
    return line.replace(
      /#proxy_webapps=/g,
      `proxy_webapps=file://${path.resolve(SAVI_HOME_ROOT, 'webapps')}`,
    );
  return line;
});

const configFilePath = path.resolve(
  SAVI_HOME_ROOT,
  'dc-deckard',
  'localhost.ini',
);
await fs.writeFileSync(configFilePath, deckardConfig.join(EOL));

console.log(chalk.whiteBright.bold('dc-deckard config file written'));
console.log(chalk.whiteBright.dim(configFilePath));
console.log(
  chalk.white.dim(`
remember to manually configure the secrets in the localhost.ini file (the
sections with a <REPLACEME> tag)`),
);
