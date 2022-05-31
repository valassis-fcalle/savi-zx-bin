#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util-packages-process';
import { install } from './util-packages-install';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await install();
