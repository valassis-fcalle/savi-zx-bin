#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util/packages-process.mjs';
import { install } from './util/packages-install.mjs';

await processPackages();
await install();
