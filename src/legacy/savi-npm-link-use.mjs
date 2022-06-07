#!/usr/bin/env zx

import { processPackages } from './util/packages-process.mjs';
import { useLinks } from './util/links.mjs';

await processPackages();
await useLinks();
