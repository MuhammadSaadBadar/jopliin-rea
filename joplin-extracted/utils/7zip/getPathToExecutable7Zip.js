"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const pathToBundled7Zip_1 = __importDefault(require("./pathToBundled7Zip"));
const path_1 = require("path");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const pathTo7Za_ = undefined;
const getPathToExecutable7Zip = async () => {
    if (pathTo7Za_) {
        return pathTo7Za_;
    }
    const { baseDir: bundled7ZipDir, executableName, fullPath: bundled7ZipExecutablePath } = (0, pathToBundled7Zip_1.default)();
    let pathTo7Za = bundled7ZipExecutablePath;
    // On Linux (and perhaps Free/OpenBSD?), the bundled 7zip binary can't be executed
    // in its default location and must be moved.
    if (!shim_1.default.isMac() && !shim_1.default.isWindows()) {
        const targetDir = (0, path_1.join)(Setting_1.default.value('cacheDir'), '7zip');
        const fsDriver = shim_1.default.fsDriver();
        const executablePath = (0, path_1.join)(targetDir, executableName);
        let needsUpdate;
        // The 7Zip binary may already be copied, in which case, it may not need to be updated.
        if (await shim_1.default.fsDriver().exists(targetDir)) {
            const currentChecksum = await fsDriver.md5File(executablePath);
            const bundledChecksum = await fsDriver.md5File(bundled7ZipExecutablePath);
            if (currentChecksum !== bundledChecksum) {
                needsUpdate = true;
                await shim_1.default.fsDriver().remove(targetDir);
            }
            else {
                needsUpdate = false;
            }
        }
        else {
            needsUpdate = true;
        }
        if (needsUpdate) {
            await shim_1.default.fsDriver().mkdir(targetDir);
            await shim_1.default.fsDriver().copy(bundled7ZipDir, targetDir);
            // Make executable.
            //   Self: read+write+execute
            //   Group: read+execute
            //   Other: none
            await shim_1.default.fsDriver().chmod(executablePath, 0o750);
        }
        pathTo7Za = executablePath;
    }
    return pathTo7Za;
};
exports.default = getPathToExecutable7Zip;
//# sourceMappingURL=getPathToExecutable7Zip.js.map