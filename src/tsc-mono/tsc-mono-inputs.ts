import {TscMonoCommandEnum} from './tsc-mono-commands';

export type TscMonoInputs = {
    projectsParentPath: string;
    command: TscMonoCommandEnum;
    commandInputs: ReadonlyArray<string>;
};
