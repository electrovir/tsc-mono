import {awaitedForEach} from '@augment-vir/common';
import {runShellCommand} from '@augment-vir/node-js';
import {join} from 'path';
import {tscMonoPackageName} from '../package-names';
import {getProjectDependencyOrder} from './dependency-ordering/get-project-dependency-order';
import {TscMonoCommandEnum} from './tsc-mono-commands';
import {TscMonoInputs} from './tsc-mono-inputs';

export async function runTscMono({command, commandInputs, projectsParentPath}: TscMonoInputs) {
    if (command === TscMonoCommandEnum.ForEach) {
        const dependencyOrdering = await getProjectDependencyOrder(projectsParentPath);

        const shellCommand = commandInputs.join(' ');

        if (!shellCommand) {
            throw new Error(`No inputs were given to the for-each command.`);
        }

        await awaitedForEach(dependencyOrdering, async (projectName) => {
            const projectPath = join(projectsParentPath, projectName);
            await runShellCommand(shellCommand, {
                rejectOnError: true,
                cwd: projectPath,
                hookUpToConsole: true,
            });
        });
    } else {
        throw new Error(`Command '${command}' is not yet implemented in '${tscMonoPackageName}'.`);
    }
}
