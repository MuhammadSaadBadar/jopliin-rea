"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const process_1 = require("process");
const findBaseOnnxRuntimePath = () => {
    const fullPath = require.resolve('onnxruntime-node').split(path_1.sep);
    // require.resolve returns the path to a file within the onnxruntime-node package.
    // Strip the other path/file components from the path.
    for (let i = fullPath.length; i >= 0; i--) {
        if (fullPath[i] === 'onnxruntime-node') {
            return fullPath.slice(0, i + 1).join(path_1.sep);
        }
    }
    throw new Error('Failed to resolve path to onnxruntime-node');
};
// As of onnxruntime-node 1.24.3, only MacOS+ARM64 and Windows/Linux x64/ARM64 are supported
const isUnsupportedPlatform = (platform, arch) => {
    return !['x64', 'arm64'].includes(arch) || (platform === 'darwin' && arch === 'x64');
};
// onnxruntime-node includes large binary artifacts for all platforms. Remove these during build to
// avoid significantly increasing the built app size.
// See #15880
const cleanOnnxRuntime = async () => {
    const onnxRuntimePath = findBaseOnnxRuntimePath();
    // Note: This path may need to be updated when updating onnxruntime-node:
    const baseDir = (0, path_1.join)(onnxRuntimePath, 'bin', 'napi-v6');
    if (!await (0, fs_extra_1.pathExists)(baseDir)) {
        throw new Error(`onnxruntime-node NAPI not found. (Searching in ${baseDir})`);
    }
    const removeDir = async (fullPath) => {
        if (!await (0, fs_extra_1.pathExists)(fullPath))
            return;
        console.log('Clearing unused onnxruntime files: rm -r', fullPath);
        await (0, fs_extra_1.remove)(fullPath);
    };
    const targetArch = process_1.env['npm_config_target_arch'] || process.arch;
    for (const subDir of (0, fs_extra_1.readdirSync)(baseDir)) {
        const fullPath = (0, path_1.join)(baseDir, subDir);
        if (subDir !== process.platform) {
            await removeDir(fullPath);
        }
        else if (targetArch === 'x64') {
            await removeDir((0, path_1.join)(fullPath, 'arm64'));
        }
        else if (targetArch === 'arm64') {
            await removeDir((0, path_1.join)(fullPath, 'x64'));
        }
    }
    if (!await (0, fs_extra_1.pathExists)((0, path_1.join)(baseDir, process.platform, targetArch)) && !isUnsupportedPlatform(process.platform, targetArch)) {
        throw new Error([
            'Missing onnxruntime-node for the current platform. It may have been deleted as part of a previous cross-platform build.',
            'To resolve, either:',
            `1. Delete ${JSON.stringify(onnxRuntimePath)} and re-run "yarn install".`,
            `2. Update the list of platforms unsupported by onnxruntime-node in ${JSON.stringify(__filename)}.`,
        ].join('\n'));
    }
};
exports.default = cleanOnnxRuntime;
//# sourceMappingURL=cleanOnnxRuntime.js.map