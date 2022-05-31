#!/usr/bin/env zx

import { $ } from 'zx';
import { processPackages } from './util-packages-process';
import { resetVersions } from './util-packages-versions-reset';

$.verbose = process.env.DEBUG === 'true' || false;

await processPackages();
await resetVersions();
