#!/usr/bin/env zx

import { processPackages } from "./util-packages-process.mjs";
import { checkLinks } from "./util-packages-links.mjs";

$.verbose = process.env.DEBUG === "true" || false;

await processPackages();
await checkLinks();
