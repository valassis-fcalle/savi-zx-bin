import { $, chalk, path, which } from 'zx';

$.verbose = process.env.DEBUG === 'true' || false;

const { CODE_COMMAND_ARGS, SAVI_HOME, SAVI_HOME_ROOT } = process.env;

let missingEnvVariables = false;
if (!SAVI_HOME) {
  console.log(chalk.red('> SAVI_HOME env variable not defined'));
  missingEnvVariables = true;
}
if (!SAVI_HOME_ROOT) {
  console.log(chalk.red('> SAVI_HOME_ROOT env variable not defined'));
  missingEnvVariables = true;
}

if (missingEnvVariables) {
  process.exit(1);
}

// check for minimum requirements to work
const CODE_COMMAND = await which('code');
if (!CODE_COMMAND) {
  console.log(chalk.red('vscode command line command not found'));
  process.exit(1);
}
const VSCODE_FOLDER = path.resolve(SAVI_HOME, 'vscode');

const gh = await which('gh');
if (!gh) {
  console.log(chalk.red('> GitHub client not found. Please install it'));
  console.log('  Read more at https://github.com/cli/cli');
  process.exit(1);
}

export {
  CODE_COMMAND,
  CODE_COMMAND_ARGS,
  SAVI_HOME,
  SAVI_HOME_ROOT,
  VSCODE_FOLDER,
};
