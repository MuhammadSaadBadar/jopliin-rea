"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.test = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const test_1 = require("@playwright/test");
const uuid_1 = __importDefault(require("@joplin/lib/uuid"));
const createStartupArgs_1 = __importDefault(require("./createStartupArgs"));
const getMainWindow_1 = __importDefault(require("./getMainWindow"));
const setDarkMode_1 = __importDefault(require("./setDarkMode"));
const evaluateWithRetry_1 = __importDefault(require("./evaluateWithRetry"));
// A custom fixture that loads an electron app. See
// https://playwright.dev/docs/test-fixtures
const initializeMainWindow = async (electronApp) => {
    const mainWindow = await (0, getMainWindow_1.default)(electronApp);
    // Setting the viewport size helps keep test environments consistent.
    await mainWindow.setViewportSize({
        width: 1300,
        height: 800,
    });
    return mainWindow;
};
const waitForMainMessage = async (electronApp, messageId) => {
    return (0, evaluateWithRetry_1.default)(electronApp, ({ ipcMain }, messageId) => {
        return new Promise(resolve => {
            ipcMain.once(messageId, () => resolve());
        });
    }, messageId);
};
const waitForAppLoaded = async (electronApp) => {
    await waitForMainMessage(electronApp, 'startup-finished');
};
const waitForStartupPlugins = async (electronApp) => {
    await waitForMainMessage(electronApp, 'startup-plugins-loaded');
};
const attachJoplinLog = async (profileDirectory, testInfo) => {
    const logFile = (0, path_1.join)(profileDirectory, 'log.txt');
    if (await (0, fs_extra_1.pathExists)(logFile)) {
        await testInfo.attach('log.txt', {
            body: await (0, fs_extra_1.readFile)(logFile, 'utf8'),
            contentType: 'text/plain',
        });
    }
    else {
        console.warn('Missing log file');
    }
};
const testDir = (0, path_1.dirname)(__dirname);
exports.test = test_1.test.extend({
    // Playwright fails if we don't use the object destructuring
    // pattern in the first argument.
    //
    // See https://github.com/microsoft/playwright/issues/8798
    //
    // eslint-disable-next-line no-empty-pattern
    profileDirectory: async ({}, use, testInfo) => {
        const profilePath = (0, path_1.resolve)((0, path_1.join)(testDir, 'test-profile'));
        const profileSubdir = (0, path_1.join)(profilePath, uuid_1.default.createNano());
        await (0, fs_extra_1.mkdirp)(profileSubdir);
        await use(profileSubdir);
        // For debugging purposes, attach the Joplin log file to the test:
        await attachJoplinLog(profileSubdir, testInfo);
        await (0, fs_extra_1.remove)(profileSubdir);
    },
    electronApp: async ({ profileDirectory }, use) => {
        const startupArgs = (0, createStartupArgs_1.default)(profileDirectory);
        const electronApp = await test_1._electron.launch({ args: startupArgs });
        const startupPromise = waitForAppLoaded(electronApp);
        await (0, setDarkMode_1.default)(electronApp, false);
        await startupPromise;
        await use(electronApp);
        await electronApp.firstWindow();
        await electronApp.close();
    },
    startAppWithPlugins: async ({ profileDirectory }, use) => {
        const startupArgs = (0, createStartupArgs_1.default)(profileDirectory);
        let electronApp;
        await use(async (pluginPaths) => {
            if (electronApp) {
                throw new Error('Electron app already created');
            }
            electronApp = await test_1._electron.launch({
                args: [
                    ...startupArgs,
                    '--dev-plugins',
                    pluginPaths.map(path => (0, path_1.resolve)(testDir, path)).join(','),
                ],
            });
            const startupPromise = waitForAppLoaded(electronApp);
            const mainWindowPromise = initializeMainWindow(electronApp);
            await waitForStartupPlugins(electronApp);
            await startupPromise;
            return {
                app: electronApp,
                mainWindow: await mainWindowPromise,
            };
        });
        if (electronApp) {
            await electronApp.firstWindow();
            await electronApp.close();
        }
    },
    startupPluginsLoaded: async ({ electronApp }, use) => {
        await use(waitForStartupPlugins(electronApp));
    },
    mainWindow: async ({ electronApp }, use) => {
        await use(await initializeMainWindow(electronApp));
    },
});
var extendedExpect_1 = require("./extendedExpect");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return __importDefault(extendedExpect_1).default; } });
//# sourceMappingURL=test.js.map