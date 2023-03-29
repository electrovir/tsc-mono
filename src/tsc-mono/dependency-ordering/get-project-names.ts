import {readPackageJson} from '@augment-vir/node-js';
import {existsSync} from 'fs';
import {readdir} from 'fs/promises';
import {join} from 'path';

export type TypeScriptNpmProject = {
    dirName: string;
    npmName: string;
};

export async function getProjectNames(startDirPath: string): Promise<TypeScriptNpmProject[]> {
    const childFullNames = await readdir(startDirPath);

    const tsProjectChildNames = childFullNames
        .filter((childName) => {
            return existsSync(join(startDirPath, childName, 'tsconfig.json'));
        })
        .sort();

    const projects: TypeScriptNpmProject[] = await Promise.all(
        tsProjectChildNames.map(async (childName): Promise<TypeScriptNpmProject> => {
            const projectPath = join(startDirPath, childName);
            const packageJson = await readPackageJson(projectPath);
            const packageName = packageJson.name;

            if (!packageName) {
                throw new Error(`Failed to find package.json name for '${projectPath}'`);
            }

            return {
                npmName: packageName,
                dirName: childName,
            };
        }),
    );

    return projects;
}
