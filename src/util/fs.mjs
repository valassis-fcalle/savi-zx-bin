import { once } from 'events';
import readline from 'readline';
import { chalk, fs, path } from 'zx';

function getDirectories(folder, hasPackageJson = false) {
  const directories = fs
    .readdirSync(folder)
    .filter((entry) => !entry.startsWith('.'))
    .filter((entry) => fs.lstatSync(`${folder}/${entry}`).isDirectory());

  if (hasPackageJson) {
    return directories.filter((directory) =>
      fs.pathExists(path.resolve(folder, directory, 'package.json'))
    );
  }

  return directories;
}

function getFiles(folder) {
  if (!fs.existsSync(folder)) {
    return [];
  }

  const files = fs
    .readdirSync(folder)
    .filter((entry) => !entry.startsWith('.'))
    .filter((entry) => fs.lstatSync(`${folder}/${entry}`).isFile());

  return files || [];
}

function isSymbolicLink(linkPath) {
  if (!fs.existsSync(linkPath)) {
    return false;
  }
  const statsObj = fs.lstatSync(linkPath);
  return statsObj.isSymbolicLink();
}

async function readFileLineByLine(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot read file ${filePath}`);
  }

  const lines = [];
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      lines.push(line);
    });

    await once(rl, 'close');
  } catch (error) {
    console.error(chalk.red(`Error reading file ${path}`));
    console.error(error);
  }
  return lines;
}

export { getDirectories, getFiles, isSymbolicLink, readFileLineByLine };
