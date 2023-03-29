import {mapObjectValues, omitObjectKeys} from '@augment-vir/common';
import {runPackageCli} from 'test-as-package';
import {expectationCases} from 'test-established-expectations';
import {testRepos} from '../test-helpers/file-paths.test-helper';
import {sanitizeTestOutput} from '../test-helpers/sanitize-output.test-helper';
import {noHelpFlag} from './parse-cli-args';

describe('cli', () => {
    expectationCases(
        async (cwd: string, command: string) => {
            const output = await runPackageCli({
                cwd: cwd,
                commandArgs: [
                    ...command.split(' '),
                    noHelpFlag,
                ],
            });
            return mapObjectValues(
                omitObjectKeys(output, [
                    'error',
                    'exitSignal',
                ]),
                (key, value) => sanitizeTestOutput(String(value)),
            );
        },
        {
            testKey: 'cli',
        },
        [
            {
                it: 'successfully runs for-each',
                inputs: [
                    testRepos['augment-vir'],
                    'packages for-each npm run --silent tsc-mono-test:success',
                ],
            },
            {
                it: 'errors if one of the scripts fails',
                inputs: [
                    testRepos['augment-vir'],
                    'packages for-each npm run --silent tsc-mono-test:one-failure',
                ],
            },
            {
                it: 'errors if the projects dir is invalid',
                inputs: [
                    testRepos['augment-vir'],
                    'not-a-real-dir for-each npm run --silent tsc-mono-test:success',
                ],
            },
            {
                it: 'errors if the given command is invalid',
                inputs: [
                    testRepos['augment-vir'],
                    'packages fake-command npm run --silent tsc-mono-test:success',
                ],
            },
            {
                it: 'errors if no inputs are given to for-each',
                inputs: [
                    testRepos['augment-vir'],
                    'packages for-each',
                ],
            },
        ],
    );
});
