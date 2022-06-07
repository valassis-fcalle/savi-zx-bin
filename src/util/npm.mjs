import { $, cd } from 'zx';

async function installDependencies(directory) {
  cd(directory);
  await $`npm i`;
}

export { installDependencies };
