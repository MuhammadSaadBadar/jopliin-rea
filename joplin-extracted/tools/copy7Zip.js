"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const copy7Zip = async () => {
    // We allow building for a different architecture/platform with
    // the npm_config_target_arch and npm_config_target_platform environment variables.
    //
    // These are the same environment variables used by yarn when downloading dependencies.
    //
    const targetArch = process.env['npm_config_target_arch'] || process.arch;
    const targetPlatform = process.env['npm_config_target_platform'] || process.platform;
    console.info('Copying 7zip for platform', targetPlatform, 'and architecture', targetArch);
    // To use the custom architecture/platform, we copy the relevant files from 7zip-bin
    // directly:
    const sevenZipBinDirectory = (0, path_1.dirname)(require.resolve('7zip-bin'));
    const platformToSubdirectory = {
        'win32': 'win',
        'darwin': 'mac',
        'linux': 'linux',
    };
    if (!(targetPlatform in platformToSubdirectory)) {
        throw new Error(`Invalid target platform ${targetPlatform}. Must be in ${Object.keys(platformToSubdirectory)}`);
    }
    const fileName = targetPlatform === 'win32' ? '7za.exe' : '7za';
    const pathTo7za = (0, path_1.join)(sevenZipBinDirectory, platformToSubdirectory[targetPlatform], targetArch, fileName);
    const rootDir = (0, path_1.dirname)(__dirname);
    const outputPath = (0, path_1.join)(rootDir, 'build', '7zip', fileName);
    await (0, fs_extra_1.copy)(pathTo7za, outputPath);
};
exports.default = copy7Zip;
//# sourceMappingURL=copy7Zip.js.map