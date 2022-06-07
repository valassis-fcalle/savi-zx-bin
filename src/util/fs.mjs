import { fs, path } from 'zx';

function getDirectories(folder, hasPackageJson = false) {
  const directories = fs
    .readdirSync(folder)
    .filter((entry) => !entry.startsWith('.'))
    .filter((entry) => fs.lstatSync(`${folder}/${entry}`).isDirectory());

  if (hasPackageJson) {
    return directories.filter(
      fs.pathExists(path.resolve(folder, 'package.json'))
    );
  }

  return directories;
}

function isSymbolicLink(linkPath) {
  if (!fs.existsSync(linkPath)) {
    return false;
  }
  const statsObj = fs.lstatSync(linkPath);
  return statsObj.isSymbolicLink();
}

export { getDirectories, isSymbolicLink };
