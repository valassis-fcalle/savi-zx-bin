# savi-zx-bin

Set of command line tools to help developers interact with local environment.

Built using google's [zx](https://github.com/google/zx)

## Requirements

1. Create a SAVI home directory, i.e. `~/Dev/savi`
2. Clone this repo into that directory (`~/Dev/savi/savi-zx-bin`)
3. You need to install [direnv](https://direnv.net/)

After the installation, create an `.envrc` file at SAVI home directory with the
following content

```bash
export SAVI_HOME=/Users/<your user>/Dev/savi
export SAVI_HOME_ALL_CAPI=/Users/<your user>/Dev/savi/all-capi
export SAVI_HOME_ALL_WEB=/Users/<your user>/Dev/savi/all-web

export CODE_COMMAND_ARGS="--user-data-dir /Users/<your user>/Dev/vscode/savi/data --extensions-dir /Users/<your user>/Dev/vscode/valassis/extensions"

PATH_add ./savi-zx-bin/src
PATH_add ./savi-zx-bin/src/custom
PATH_add ./all-capi/.node_modules/bin/
```

This configuration assumes you are going to be developing under SAVI_HOME and
there you would have an ALL_CAPI and ALL_WEB folder (they will be generated if
you use savi-init.mjs)

Finally, allow direnv configuration file by running `direnv allow`. Now you have
access to all the savi commands (they are only accessible once you cd into your
SAVI home directory)

## Create custom commands

If you want to have your own commands, but do not wish to share with the rest of
us (because you're ... you 🤣), you can create them within the `custom` folder
under the `src` folder. Just remember to make them executable by running
`chmod +x <path to your script>`so it can be executed from the command line.

## Commands

### savi-vscode

Allow you to create/open/remove VSCode workspaces. This will open vscode with
multiple folder but not all what there is inside ALL_CAPI and ALL_WEB since that
drains your computer resources.

Running `savi-vscode.mjs` will prompt you to open an existing workspace (if any)
allowing you to select one showing the name and description you have provide
during the creation.
If you skip that, you can create a new one, selecting projects from the ALL_CAPI
and ALL_WEB. The process will ask you for a name and a description for the
workspace.
Running the command with `--remove` will allow you to remove multiple created
workspaces.


### savi-deckard-configure

### savi-init

### savi-nodemon

### savi-npm-link

### savi-npm-links-global

### savi-npm-versions.mjs

Retrieves from npm registry the real versions of the packages.
Accepted arguments are:

* --capi: shows the versions of all packages under the `all-capi` project
* --web: shows the versions of all packages under the `all-web` project
* --name "glob exp": shows the versions for the matching project names
