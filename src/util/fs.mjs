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

export { getDirectories };
