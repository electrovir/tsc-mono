import {itCases} from '@augment-vir/chai';
import {join} from 'path';
import {testRepos} from '../../test-helpers/file-paths.test-helper';
import {getProjectNames} from './get-project-names';

describe(getProjectNames.name, () => {
    itCases(getProjectNames, [
        {
            it: 'gets only typescript project directories',
            input: join(testRepos['augment-vir'], 'packages'),
            expect: [
                {
                    dirName: 'browser',
                    npmName: '@augment-vir/browser',
                },
                {
                    dirName: 'browser-testing',
                    npmName: '@augment-vir/browser-testing',
                },
                {
                    dirName: 'chai',
                    npmName: '@augment-vir/chai',
                },
                {
                    dirName: 'common',
                    npmName: '@augment-vir/common',
                },
                {
                    dirName: 'common-tests',
                    npmName: '@augment-vir/common-tests',
                },
                {
                    dirName: 'docker',
                    npmName: '@augment-vir/docker',
                },
                {
                    dirName: 'element-vir',
                    npmName: '@augment-vir/element-vir',
                },
                {
                    dirName: 'node-js',
                    npmName: '@augment-vir/node-js',
                },
                {
                    dirName: 'prisma-node-js',
                    npmName: '@augment-vir/prisma-node-js',
                },
                {
                    dirName: 'scripts',
                    npmName: '@augment-vir/scripts',
                },
                {
                    dirName: 'testing',
                    npmName: '@augment-vir/testing',
                },
            ],
        },
    ]);
});
