import {cruise} from 'dependency-cruiser';
import {join, relative, resolve, sep} from 'path/posix';
import {getProjectNames} from './get-project-names';
import {createFlattenedTree} from './string-tree/string-tree';

export async function getProjectDependencyOrder(startDirPath: string): Promise<string[]> {
    const projects = await getProjectNames(startDirPath);
    const projectDirNames = projects.map((project) => project.dirName);
    const projectsByDirName = Object.fromEntries(
        projects.map((project) => [
            project.dirName,
            project,
        ]),
    );
    const projectsByNpmName = Object.fromEntries(
        projects.map((project) => [
            project.npmName,
            project,
        ]),
    );

    const projectNpmNames = projects.map((project) => project.npmName);
    const projectNpmNameSet = new Set(projectNpmNames);

    const projectPaths = projectDirNames.map((projectDirName) =>
        join(startDirPath, projectDirName),
    );

    const projectDependencies = cruise(projectPaths, {
        doNotFollow: {
            // don't follow anything
            dependencyTypes: [
                'aliased',
                'core',
                'deprecated',
                'local',
                'localmodule',
                'npm',
                'npm-bundled',
                'npm-dev',
                'npm-no-pkg',
                'npm-optional',
                'npm-peer',
                'npm-unknown',
                'undetermined',
                'unknown',
                'type-only',
            ],
        },
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            extensions: [
                '.ts',
                '.tsx',
            ],
        },
        moduleSystems: ['es6'],
    });

    if (typeof projectDependencies.output === 'string') {
        throw new Error(`Internal error: failed to get dependencies`);
    }

    const relevantDeps: {[npmName: string]: Set<string>} = Object.fromEntries(
        projectNpmNames.map((projectNpmName) => [
            projectNpmName,
            new Set<string>(),
        ]),
    );
    projectDependencies.output.modules.forEach((moduleEntry) => {
        const fullSourcePath = resolve(moduleEntry.source);
        const relativePath = relative(startDirPath, fullSourcePath);
        const moduleProjectDirName = relativePath.split(sep)[0] ?? '';

        if (!moduleProjectDirName.startsWith('.')) {
            const moduleProjectNpmName = projectsByDirName[moduleProjectDirName]!.npmName;
            moduleEntry.dependencies.forEach((dep) => {
                if (projectNpmNameSet.has(dep.module)) {
                    relevantDeps[moduleProjectNpmName]!.add(dep.module);
                }
            });
        }

        return relativePath;
    });

    const treeMatrix = createFlattenedTree(relevantDeps);
    const flattenedDeps = treeMatrix.flat();

    const depsByDirName = flattenedDeps.map((npmName) => projectsByNpmName[npmName]!.dirName);
    return depsByDirName;
}
