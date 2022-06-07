#!/usr/bin/env zx

import { processPackages } from './util/packages-process.mjs';
import { resetVersions } from './util/packages-versions-reset.mjs';

await processPackages();
await resetVersions();
