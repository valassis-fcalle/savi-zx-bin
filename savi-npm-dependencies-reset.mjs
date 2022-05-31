#!/usr/bin/env zx

import { processPackages } from './util-packages-process.mjs';
import { resetDependencies } from './util-packages-dependencies-reset.mjs';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await resetDependencies();
