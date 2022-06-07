#!/usr/bin/env zx

import { processPackages } from '../util/packages-process.mjs';
import { resetGit } from '../util/packages-git-reset.mjs';

await processPackages();
await resetGit();
