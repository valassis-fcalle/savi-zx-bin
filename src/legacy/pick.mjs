import { allPackagesNames, packagesMap } from './packages-process.mjs';

function pick(hasCapiDependencies) {
  const packagesNames = allPackagesNames
    .filter((packageName) => {
      const { json } = packagesMap[packageName];

      const foundInDependencies = Object.keys(json.dependencies || {}).find(
        (dependencyName) => dependencyName.startsWith('@digital-coupons')
      );
      const foundInDevDependencies = Object.keys(
        json.devDependencies || {}
      ).find((dependencyName) => dependencyName.startsWith('@digital-coupons'));
      const foundInPeerDependencies = Object.keys(
        json.peerDependencies || {}
      ).find((dependencyName) => dependencyName.startsWith('@digital-coupons'));

      if (
        hasCapiDependencies &&
        (foundInDependencies ||
          foundInDevDependencies ||
          foundInPeerDependencies)
      ) {
        return packageName;
      }

      if (
        !hasCapiDependencies &&
        !foundInDependencies &&
        !foundInDevDependencies &&
        !foundInPeerDependencies
      ) {
        return packageName;
      }

      return undefined;
    })
    .filter((packageName) => packageName !== undefined);

  return packagesNames;
}

export { pick };
