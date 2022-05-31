#!/usr/bin/env zx

import { allPackagesNames, packagesMap } from "./util-packages-process.mjs";

async function resetDependencies() {
  for (let index = 0; index < allPackagesNames.length; index++) {
    const packageName = allPackagesNames[index];
    const { json, path } = packagesMap[packageName];
    console.log("Dependencies reset", packageName, "at", path);

    let modified = false;
    if (json.dependencies) {
      Object.keys(json.dependencies).forEach((dependency) => {
        if (dependency.startsWith("@digital-coupons")) {
          modified = true;
          json.dependencies[dependency] = packagesMap[dependency].json.version;
          console.log(
            chalk.gray(
              `  -(dep ) ${dependency}@${packagesMap[dependency].json.version}`
            )
          );
        }
      });
    }

    if (json.devDependencies) {
      Object.keys(json.devDependencies).forEach((dependency) => {
        if (dependency.startsWith("@digital-coupons")) {
          modified = true;
          json.devDependencies[dependency] =
            packagesMap[dependency].json.version;
          console.log(
            chalk.gray(
              `  -(dev ) ${dependency}@${packagesMap[dependency].json.version}`
            )
          );
        }
      });
    }

    if (json.peerDependencies) {
      Object.keys(json.peerDependencies).forEach((dependency) => {
        if (dependency.startsWith("@digital-coupons")) {
          modified = true;
          json.peerDependencies[dependency] =
            packagesMap[dependency].json.version;
          console.log(
            chalk.gray(
              `  -(peer) ${dependency}@${packagesMap[dependency].json.version}`
            )
          );
        }
      });
    }

    if (modified) {
      await fs.outputJSON(`${path}/package.json`, json, { spaces: 2 });
      console.log(chalk.yellow(`  ${path}/package.json updated`));
    }
  }
}

export { resetDependencies };
