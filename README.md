# savi-zx-bin

Set of command line tools to help developers interact with local environment.

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
