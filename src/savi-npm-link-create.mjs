#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util-packages-process';
import { createLinks } from './util-packages-links';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await createLinks();
