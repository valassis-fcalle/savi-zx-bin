#!/usr/bin/env zx

import { $, cd } from 'zx';
import './util/env.mjs';
import { getDirectories } from './util/fs.mjs';

const cwdOutput = await $`pwd`;
const cwd = `${cwdOutput}`.trim();
const excludedDirectories = ['node_modules'];

const dirs = getDirectories(cwd, true).filter(
  (dir) => !excludedDirectories.includes(dir),
);
for (let index = 0; index < dirs.length; index += 1) {
  const dir = dirs[index];
  cd(dir);
  const branchName = `${await $`git rev-parse --abbrev-ref HEAD`}`.trim();
  console.log(dir.padEnd(25), branchName);
  const status = await $`git-branch-status -d -b master`.nothrow();
  const statusString = `${status}`;
  if (statusString.indexOf('All tracking branches are synchronized') === -1) {
    console.log(statusString);
  }
  cd(cwd);
}
