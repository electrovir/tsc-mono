import {itCases} from '@augment-vir/chai';
import {join} from 'path';
import {testRepos} from '../../test-helpers/file-paths.test-helper';
import {getProjectDependencyOrder} from './get-project-dependency-order';

describe(getProjectDependencyOrder.name, () => {
    itCases(getProjectDependencyOrder, [
        {
            it: 'gets only typescript project directories',
            input: join(testRepos['augment-vir'], 'packages'),
            expect: [
                'common',
                'testing',
                'browser-testing',
                'chai',
                'browser',
                'element-vir',
                'node-js',
                'common-tests',
                'docker',
                'prisma-node-js',
                'scripts',
            ],
        },
    ]);
});
