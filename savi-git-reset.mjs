#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util-packages-process';
import { resetGit } from './util-packages-git-reset';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await resetGit();
