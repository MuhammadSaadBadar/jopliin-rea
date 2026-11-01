"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkForUpdatesUtilsTestData_1 = require("../../utils/checkForUpdatesUtilsTestData");
const AutoUpdaterService_1 = __importDefault(require("./AutoUpdaterService"));
const electron_1 = require("electron");
jest.mock('electron', () => ({
    BrowserWindow: jest.fn(),
}));
jest.mock('electron-updater', () => {
    const mockAutoUpdater = {
        setFeedURL: jest.fn(),
        checkForUpdates: jest.fn(),
        on: jest.fn(),
        quitAndInstall: jest.fn(),
    };
    return { autoUpdater: mockAutoUpdater };
});
describe('AutoUpdaterService', () => {
    let service;
    let mockLogger;
    beforeEach(() => {
        const mockWindow = new electron_1.BrowserWindow();
        mockLogger = { info: jest.fn(), error: jest.fn(), debug: jest.fn(), warn: jest.fn() };
        service = new AutoUpdaterService_1.default(mockWindow, mockLogger, false, true);
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(checkForUpdatesUtilsTestData_1.releases3),
        }));
    });
    it('should correctly fetch and process the latest prerelease', async () => {
        const release = await service.fetchLatestRelease(true);
        expect(release).toBeDefined();
        expect(release.tag_name).toBe('v3.1.3');
    });
    it('should correctly fetch and process the latest release', async () => {
        const release = await service.fetchLatestRelease(false);
        expect(release).toBeDefined();
        expect(release.tag_name).toBe('v3.1.2');
    });
    it('should return the correct download URL for Windows x32', async () => {
        const release = await service.fetchLatestRelease(true);
        expect(release).toBeDefined();
        const url = service.getDownloadUrlForPlatform(release, 'win32', 'ia32');
        expect(url).toBe('https://github.com/laurent22/joplin/releases/download/v3.1.3/latest.yml');
    });
    it('should return the correct download URL for Windows x64', async () => {
        const release = await service.fetchLatestRelease(true);
        expect(release).toBeDefined();
        const url = service.getDownloadUrlForPlatform(release, 'win32', 'x64');
        expect(url).toBe('https://github.com/laurent22/joplin/releases/download/v3.1.3/latest.yml');
    });
    it('should return the correct download URL for Mac x64', async () => {
        const release = await service.fetchLatestRelease(true);
        expect(release).toBeDefined();
        const url = service.getDownloadUrlForPlatform(release, 'darwin', 'x64');
        expect(url).toBe('https://github.com/laurent22/joplin/releases/download/v3.1.3/latest-mac.yml');
    });
    it('should return the correct download URL for Mac arm64', async () => {
        const release = await service.fetchLatestRelease(true);
        expect(release).toBeDefined();
        const url = service.getDownloadUrlForPlatform(release, 'darwin', 'arm64');
        expect(url).toBe('https://github.com/laurent22/joplin/releases/download/v3.1.3/latest-mac-arm64.yml');
    });
    it('should throw an error for Linux', async () => {
        const release = await service.fetchLatestRelease(true);
        expect(release).toBeDefined();
        expect(() => service.getDownloadUrlForPlatform(release, 'linux', 'amd64')).toThrow('The AutoUpdaterService does not support the following platform: linux');
    });
});
//# sourceMappingURL=AutoUpdaterService.test.js.map