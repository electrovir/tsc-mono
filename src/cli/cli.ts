#!/usr/bin/env node

import {extractErrorMessage} from '@augment-vir/common';
import {printHelpMessage} from '../help-message';
import {runTscMono} from '../tsc-mono/run-tsc-mono';
import {noHelpFlag, parseArgs} from './parse-cli-args';

async function cliMain() {
    const inputs = parseArgs(process.argv, __filename);
    await runTscMono(inputs);
}

cliMain().catch((error) => {
    console.error(extractErrorMessage(error));
    if (!process.argv.includes(noHelpFlag)) {
        printHelpMessage();
    }
    process.exit(1);
});
