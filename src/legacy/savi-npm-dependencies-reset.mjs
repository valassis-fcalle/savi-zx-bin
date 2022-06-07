#!/usr/bin/env zx

import { processPackages } from '../util/packages-process.mjs';
import { resetDependencies } from '../util/packages-dependencies-reset.mjs';

await processPackages();
await resetDependencies();
