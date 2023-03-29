import {isEnumValue} from '@augment-vir/common';
import {resolve} from 'path';
import {tscMonoBinName} from '../package-names';
import {TscMonoCommandEnum} from '../tsc-mono/tsc-mono-commands';
import {TscMonoInputs} from '../tsc-mono/tsc-mono-inputs';

export const noHelpFlag = '--no-help';

export function parseArgs(args: ReadonlyArray<string>, cliFileName: string): TscMonoInputs {
    const commandStartIndex = args.findIndex((arg) => {
        return (
            arg.endsWith(`/${tscMonoBinName}`) ||
            arg === tscMonoBinName ||
            resolve(arg) === cliFileName
        );
    });

    if (commandStartIndex === -1) {
        throw new Error(
            `Failed to find '${tscMonoBinName}' in '${args.join(
                ' ',
            )}'. Make sure you're using the '${tscMonoBinName}' command.`,
        );
    }

    const commandInputs: ReadonlyArray<string> = args
        .slice(commandStartIndex + 1)
        .filter((arg) => arg !== noHelpFlag);

    if (!commandInputs[0]) {
        throw new Error(`Found no <projects-parent-path> input.`);
    }

    const projectsParentPath = resolve(commandInputs[0]);

    if (!isEnumValue(commandInputs[1], TscMonoCommandEnum)) {
        throw new Error(`Unknown '${tscMonoBinName}' command given: '${commandInputs[1]}'`);
    }

    const currentCliCommand: TscMonoCommandEnum = commandInputs[1];
    const cliCommandInputs: ReadonlyArray<string> = commandInputs.slice(2);

    return {
        projectsParentPath: projectsParentPath,
        command: currentCliCommand,
        commandInputs: cliCommandInputs,
    };
}
