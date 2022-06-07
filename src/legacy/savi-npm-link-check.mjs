#!/usr/bin/env zx

import { processPackages } from './util/packages-process.mjs';
import { checkLinks } from './util/links.mjs';

await processPackages();
await checkLinks();
