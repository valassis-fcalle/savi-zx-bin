#!/usr/bin/env zx

import inquirer from 'inquirer';
import ica from 'inquirer-checkbox-autocomplete-prompt';
import { $, argv, chalk, fs, path } from 'zx';
import {
  CODE_COMMAND,
  CODE_COMMAND_ARGS,
  SAVI_HOME_ALL_CAPI,
  SAVI_HOME_ALL_WEB,
  VSCODE_FOLDER,
} from './util/env.mjs';
import { getDirectories, getFiles } from './util/fs.mjs';
import {
  getPackageName,
  refreshRepositoriesMapping,
} from './util/repositories.mjs';

// SETUP
// -----------------------------------------------------------------------------
inquirer.registerPrompt('checkbox-autocomplete', ica);

let existingWorkspaces;
let workspacesJson;

// FUNCTIONS
// -----------------------------------------------------------------------------
function showHelp() {
  if (argv.about) {
    console.log(
      chalk.bold.italic.whiteBright(`Opens VSCode with a custom workspace`)
    );
    console.log(
      chalk.gray(`
  Offers you to re-open a previously created workspace or to create a new one
  with a ${chalk.italic('wizard')} to create it allowing you to select which
  projects to add (opening everything is too expensive)`)
    );
    process.exit(0);
  }
}

async function vscodeWorkspaceOpen(workspace) {
  const workspaceFile = path.resolve(
    VSCODE_FOLDER,
    `${workspace}.code-workspace`
  );
  if (CODE_COMMAND_ARGS) {
    const args = CODE_COMMAND_ARGS.split(' ');
    args.push(workspaceFile);
    await $`${CODE_COMMAND} ${args}`;
  } else {
    await $`${CODE_COMMAND}${workspaceFile}`;
  }
  process.exit(0);
}

async function workspacesLoad() {
  existingWorkspaces = await getFiles(VSCODE_FOLDER).filter((fileName) =>
    fileName.endsWith('code-workspace')
  );

  const workspacesPath = path.resolve(VSCODE_FOLDER, 'workspaces.json');
  if (fs.existsSync(workspacesPath)) {
    workspacesJson = fs.readJSONSync(workspacesPath);
  }
}

async function workspaceOpen() {
  if (existingWorkspaces.length > 0) {
    const { openExistingOne } = await inquirer.prompt([
      {
        name: 'openExistingOne',
        message: 'Open an existing workspace?',
        type: 'confirm',
      },
    ]);
    if (openExistingOne) {
      const choices = Object.values(workspacesJson).map((value) => ({
        name: `${value.name}: ${value.description}`,
        value: value.name,
      }));
      const { workspace } = await inquirer.prompt([
        {
          choices,
          loop: false,
          name: 'workspace',
          message: 'Please, select one',
          type: 'list',
        },
      ]);
      await vscodeWorkspaceOpen(workspace);
    }
    const { createNewWorkspace } = await inquirer.prompt([
      {
        name: 'createNewWorkspace',
        message: 'Do you want to create a new workspace?',
        type: 'confirm',
      },
    ]);
    if (!createNewWorkspace) {
      console.log(chalk.yellow('Then, why did you summoned me 🤬 ?!'));
      process.exit(0);
    }
  }
}

async function workspaceCreate() {
  const allCapiProjectsChoices = getDirectories(SAVI_HOME_ALL_CAPI, true).sort(
    (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  const { allCapiProjects } = await inquirer.prompt([
    {
      choices: allCapiProjectsChoices,
      loop: false,
      message: 'Select projects from SAVI_HOME_ALL_CAPI folder',
      name: 'allCapiProjects',
      pageSize: 5,
      type: 'checkbox-autocomplete',
    },
  ]);
  const allWebProjectsChoices = getDirectories(SAVI_HOME_ALL_WEB, true).sort(
    (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
  const { allWebProjects } = await inquirer.prompt([
    {
      choices: allWebProjectsChoices,
      loop: false,
      message: 'Select projects from SAVI_HOME_ALL_WEB folder',
      name: 'allWebProjects',
      pageSize: 5,
      type: 'checkbox-autocomplete',
    },
  ]);
  let emptyCount = 0;
  if (allCapiProjects.length === 0) {
    console.log(
      chalk.white.dim(`No project from ALL_CAPI will be added to the workspace`)
    );
    emptyCount += 1;
  }
  if (allWebProjects.length === 0) {
    console.log(
      chalk.white.dim(`No project from ALL_WEB will be added to the workspace`)
    );
    emptyCount += 1;
  }

  if (emptyCount === 2) {
    console.log(
      chalk.yellow('Workspace creation aborted. No project has been selected')
    );
    process.exit(0);
  }

  const { workspaceName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'workspaceName',
      message: 'Type a name for the workspace:',
      validate: (answer) => answer.trim().length > 0,
    },
  ]);
  const { workspaceDescription } = await inquirer.prompt([
    {
      type: 'input',
      name: 'workspaceDescription',
      message: 'Type a description:',
      validate: (answer) => answer.trim().length > 0,
    },
  ]);

  await fs.writeJSON(
    path.resolve(VSCODE_FOLDER, 'workspaces.json'),
    {
      ...workspacesJson,
      [workspaceName]: {
        description: workspaceDescription,
        name: workspaceName,
        capi: allCapiProjects,
        web: allWebProjects,
      },
    },
    { spaces: 2 }
  );

  const allCapiEntries = (allCapiProjects || []).map((entry) => ({
    name: getPackageName(getPackageName(entry)),
    path: path.resolve(SAVI_HOME_ALL_CAPI, entry),
  }));
  const allWebEntries = (allWebProjects || []).map((entry) => ({
    name: getPackageName(getPackageName(entry)),
    path: path.resolve(SAVI_HOME_ALL_WEB, entry),
  }));

  await fs.writeJSON(
    path.resolve(VSCODE_FOLDER, `${workspaceName}.code-workspace`),
    {
      folders: [].concat(allCapiEntries).concat(allWebEntries),
      settings: {},
    },
    {
      spaces: 2,
    }
  );

  await vscodeWorkspaceOpen(workspaceName);
}

async function workspaceRemove() {
  if (argv.remove) {
    const choices = Object.values(workspacesJson).map((value) => ({
      name: `${value.name}: ${value.description}`,
      value: value.name,
    }));
    const { workspacesToRemove } = await inquirer.prompt([
      {
        choices,
        loop: false,
        message: 'Select the workspaces to remove',
        name: 'workspacesToRemove',
        pageSize: 5,
        type: 'checkbox-autocomplete',
      },
    ]);
    const { confirmRemove } = await inquirer.prompt([
      {
        default: false,
        name: 'confirmRemove',
        message: chalk.red(
          'Are you sure you want to remove the selected workspaces?'
        ),
        type: 'confirm',
      },
    ]);

    if (!confirmRemove) {
      console.log(chalk.gray('Process aborted. Nothing has been modified'));
      process.exit(0);
    }

    workspacesToRemove.forEach((key) => {
      const filePath = path.resolve(VSCODE_FOLDER, `${key}.code-workspace`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      delete workspacesJson[key];
    });
    await fs.writeJSON(
      path.resolve(VSCODE_FOLDER, 'workspaces.json'),
      workspacesJson,
      { spaces: 2 }
    );
    process.exit(0);
  }
}

// MAIN
// -----------------------------------------------------------------------------
showHelp();

await refreshRepositoriesMapping();
await workspacesLoad();

await workspaceRemove();
await workspaceOpen();
await workspaceCreate();
