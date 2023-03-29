import {tscMonoBinName, tscMonoPackageName} from './package-names';
const helpMessage = `
${tscMonoPackageName} usage:

${tscMonoBinName} <projects-parent-path> <command> <command-inputs>

    - <projects-parent-path>: path from the cwd to the immediate parent of all the mono-repo's TS projects. Example: "packages"
    - <command>: command that you want tsc-mono to run with this TS projects. Example: "for-each"
    - <command-inputs>: inputs for the given command. The options here will vary by command. Example: "npm run build"

Commands:

for-each
    - runs the given <command-inputs> as a bash script for each of the TS projects
    - projects are executed in dependency order
    
    Examples:
        - ${tscMonoBinName} packages for-each npm run build
        - ${tscMonoBinName} packages for-each "npm run build && echo success"
`;

export function printHelpMessage() {
    console.info('\n');
    console.info(helpMessage);
}
