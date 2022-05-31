#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util-packages-process.mjs';
import { resetGit } from './util-packages-git-reset.mjs';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await resetGit();
