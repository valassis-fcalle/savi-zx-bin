#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util-packages-process.mjs';
import { install } from './util-packages-install.mjs';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await install();
