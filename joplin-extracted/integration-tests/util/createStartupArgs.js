"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const createStartupArgs = (profileDirectory) => {
    // Input paths need to be absolute when running from VSCode
    const baseDirectory = (0, path_1.dirname)((0, path_1.dirname)(__dirname));
    const mainPath = (0, path_1.resolve)(baseDirectory, 'main.bundle.js');
    // We need to run with --env dev to disable the single instance check.
    return [
        mainPath, '--env', 'dev', '--lang=en-GB', '--log-level', 'debug', '--no-welcome', '--running-tests', '--profile', (0, path_1.resolve)(profileDirectory),
    ];
};
exports.default = createStartupArgs;
//# sourceMappingURL=createStartupArgs.js.map