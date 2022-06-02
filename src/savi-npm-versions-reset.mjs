#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util/packages-process.mjs';
import { resetVersions } from './util/packages-versions-reset.mjs';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await resetVersions();
