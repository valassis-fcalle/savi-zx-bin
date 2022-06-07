#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util/packages-process.mjs';
import { createLinks } from './util/links.mjs';

await processPackages();
await createLinks();
