import { chalk, fs, path } from 'zx';
import readline from 'readline';
import { once } from 'events';

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

export { getDirectories, isSymbolicLink, readFileLineByLine };
