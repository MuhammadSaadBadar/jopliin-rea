"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let currentProfileDirectory;
jest.doMock('../bridge', () => () => ({
    // Mock the bridge functions used by restartInSafeModeFromMain
    // to remove the dependency on Electron.
    restart: jest.fn(),
    processArgv: () => [
        // The argument parser expects the first two arguments to
        // be the path to NodeJS and the second to be the main filename.
        process.argv[0], __filename,
        // Only the following arguments are used.
        '--profile', currentProfileDirectory,
    ],
    env: () => 'dev',
    appName: () => 'joplin-desktop',
}));
const fs_extra_1 = require("fs-extra");
const restartInSafeModeFromMain_1 = __importDefault(require("./restartInSafeModeFromMain"));
const os_1 = require("os");
const path_1 = require("path");
const BaseApplication_1 = require("@joplin/lib/BaseApplication");
describe('restartInSafeModeFromMain', () => {
    beforeEach(async () => {
        currentProfileDirectory = await (0, fs_extra_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), 'safemode-restart-test'));
    });
    afterEach(async () => {
        await (0, fs_extra_1.remove)(currentProfileDirectory);
    });
    test('should create a safe mode flag file', async () => {
        await (0, restartInSafeModeFromMain_1.default)();
        const safeModeFlagFilepath = (0, path_1.join)(currentProfileDirectory, BaseApplication_1.safeModeFlagFilename);
        expect(await (0, fs_extra_1.readFile)(safeModeFlagFilepath, 'utf8')).toBe('true');
    });
});
//# sourceMappingURL=restartInSafeModeFromMain.test.js.map