#!/usr/bin/env node
// The okdata command. Exit codes: see src/exit.ts or `okdata --help`.
import { processIo } from './io.js';
import { main } from './main.js';

process.exitCode = await main(process.argv.slice(2), processIo());
