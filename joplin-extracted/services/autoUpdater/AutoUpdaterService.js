"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialUpdateStartup = exports.defaultUpdateInterval = exports.AutoUpdaterEvents = void 0;
const electron_updater_1 = require("electron-updater");
const path = require("path");
const shim = require('@joplin/lib/shim').default;
const checkForUpdatesUtils_1 = require("../../utils/checkForUpdatesUtils");
const semver = __importStar(require("semver"));
var AutoUpdaterEvents;
(function (AutoUpdaterEvents) {
    AutoUpdaterEvents["CheckingForUpdate"] = "checking-for-update";
    AutoUpdaterEvents["UpdateAvailable"] = "update-available";
    AutoUpdaterEvents["UpdateNotAvailable"] = "update-not-available";
    AutoUpdaterEvents["Error"] = "error";
    AutoUpdaterEvents["DownloadProgress"] = "download-progress";
    AutoUpdaterEvents["UpdateDownloaded"] = "update-downloaded";
})(AutoUpdaterEvents || (exports.AutoUpdaterEvents = AutoUpdaterEvents = {}));
exports.defaultUpdateInterval = 12 * 60 * 60 * 1000;
exports.initialUpdateStartup = 5 * 1000;
const releasesLink = 'https://objects.joplinusercontent.com/r/releases';
const supportedPlatformAssets = {
    'darwin': {
        'x64': 'latest-mac.yml',
        'arm64': 'latest-mac-arm64.yml',
    },
    'win32': {
        'x64': 'latest.yml',
        'ia32': 'latest.yml',
    },
};
class AutoUpdaterService {
    constructor(mainWindow, logger, devMode, includePreReleases) {
        this.enableDevMode = true; // force the updater to work in "dev" mode
        this.enableAutoDownload = true; // automatically download an update when it is found
        this.autoInstallOnAppQuit = false; // automatically install the downloaded update once the user closes the application
        this.includePreReleases_ = false;
        this.allowDowngrade = false;
        this.isManualCheckInProgress = false;
        this.isUpdateInProgress = false;
        this.checkForUpdates = async (isManualCheck = false) => {
            try {
                this.isManualCheckInProgress = isManualCheck;
                await this.checkForLatestRelease();
            }
            catch (error) {
                this.logger_.error('Failed to check for updates:', error);
                if (error.message.includes('ERR_CONNECTION_REFUSED')) {
                    this.logger_.info('Server is not reachable. Will try again later.');
                }
            }
        };
        this.updateApp = () => {
            electron_updater_1.autoUpdater.quitAndInstall(false, true);
        };
        this.fetchLatestRelease = async (includePreReleases) => {
            const releases = await this.fetchReleases(includePreReleases);
            const release = releases[0];
            if (!release) {
                throw new Error('No suitable release found');
            }
            return release;
        };
        this.fetchReleases = async (includePreReleases) => {
            const response = await fetch(releasesLink);
            if (!response.ok) {
                const responseText = await response.text();
                this.logger_.error(`Cannot get latest release info (${response.status}): ${responseText.substr(0, 500)}`);
                (0, checkForUpdatesUtils_1.handleReleaseResponseError)(response.status, responseText);
            }
            const releases = await response.json();
            const sortedReleasesByVersion = releases.sort((a, b) => semver.rcompare(a.tag_name, b.tag_name));
            const filteredReleases = sortedReleasesByVersion.filter(release => includePreReleases || !release.prerelease);
            return filteredReleases;
        };
        this.checkForLatestRelease = async () => {
            if (this.isUpdateInProgress) {
                this.logger_.info('An update check is already in progress');
                return;
            }
            this.isUpdateInProgress = true;
            try {
                const release = await this.fetchLatestRelease(this.includePreReleases_);
                try {
                    let assetUrl = this.getDownloadUrlForPlatform(release, shim.platformName(), process.arch);
                    // electron's autoUpdater appends automatically the platform's yml file to the link so we should remove it
                    assetUrl = assetUrl.substring(0, assetUrl.lastIndexOf('/'));
                    electron_updater_1.autoUpdater.setFeedURL({ provider: 'generic', url: assetUrl });
                    const result = await electron_updater_1.autoUpdater.checkForUpdates();
                    // Wait for the installation to finish. By default, .checkForUpdates runs in the background
                    await result.downloadPromise;
                }
                catch (error) {
                    this.logger_.error(`Update download url failed: ${error.message}`);
                    this.isUpdateInProgress = false;
                }
            }
            catch (error) {
                this.logger_.error(`Fetching releases failed:  ${error.message}`);
                this.isUpdateInProgress = false;
            }
            finally {
                this.isManualCheckInProgress = false;
            }
        };
        this.configureAutoUpdater = () => {
            electron_updater_1.autoUpdater.logger = (this.logger_);
            if (this.devMode_) {
                this.logger_.info('Development mode: using dev-app-update.yml');
                electron_updater_1.autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
                electron_updater_1.autoUpdater.forceDevUpdateConfig = this.enableDevMode;
            }
            electron_updater_1.autoUpdater.autoDownload = this.enableAutoDownload;
            electron_updater_1.autoUpdater.autoInstallOnAppQuit = this.autoInstallOnAppQuit;
            electron_updater_1.autoUpdater.allowPrerelease = this.includePreReleases_;
            electron_updater_1.autoUpdater.allowDowngrade = this.allowDowngrade;
            electron_updater_1.autoUpdater.on(AutoUpdaterEvents.CheckingForUpdate, this.onCheckingForUpdate);
            electron_updater_1.autoUpdater.on(AutoUpdaterEvents.UpdateNotAvailable, this.onUpdateNotAvailable);
            electron_updater_1.autoUpdater.on(AutoUpdaterEvents.UpdateAvailable, this.onUpdateAvailable);
            electron_updater_1.autoUpdater.on(AutoUpdaterEvents.DownloadProgress, this.onDownloadProgress);
            electron_updater_1.autoUpdater.on(AutoUpdaterEvents.UpdateDownloaded, this.onUpdateDownloaded);
            electron_updater_1.autoUpdater.on(AutoUpdaterEvents.Error, this.onError);
        };
        this.onCheckingForUpdate = () => {
            this.logger_.info('Checking for update...');
        };
        this.onUpdateNotAvailable = (_info) => {
            if (this.isManualCheckInProgress) {
                this.window_.webContents.send(AutoUpdaterEvents.UpdateNotAvailable);
            }
            this.isUpdateInProgress = false;
            this.logger_.info('Update not available.');
        };
        this.onUpdateAvailable = (info) => {
            this.logger_.info(`Update available: ${info.version}.`);
        };
        this.onDownloadProgress = (progressObj) => {
            this.logger_.info(`Download progress... ${progressObj.percent}% completed`);
        };
        this.onUpdateDownloaded = (info) => {
            this.logger_.info('Update downloaded.');
            this.isUpdateInProgress = false;
            void this.promptUserToUpdate(info);
        };
        this.onError = (error) => {
            this.logger_.error('Error in auto-updater.', error);
            this.isUpdateInProgress = false;
        };
        this.promptUserToUpdate = async (info) => {
            this.window_.webContents.send(AutoUpdaterEvents.UpdateDownloaded, info);
        };
        this.window_ = mainWindow;
        this.logger_ = logger;
        this.devMode_ = devMode;
        this.includePreReleases_ = includePreReleases;
        this.configureAutoUpdater();
    }
    getDownloadUrlForPlatform(release, platform, arch) {
        if (!supportedPlatformAssets[platform]) {
            throw new Error(`The AutoUpdaterService does not support the following platform: ${platform}`);
        }
        const platformAssets = supportedPlatformAssets[platform];
        const assetName = platformAssets ? platformAssets[arch] : undefined;
        if (!assetName) {
            throw new Error(`The AutoUpdaterService does not support the architecture: ${arch} for platform: ${platform}`);
        }
        const asset = release.assets.find(a => a.name === assetName);
        if (!asset) {
            throw new Error(`Yml file: ${assetName} not found for version: ${release.tag_name} platform: ${platform} and architecture: ${arch}`);
        }
        return asset.browser_download_url;
    }
}
exports.default = AutoUpdaterService;
//# sourceMappingURL=AutoUpdaterService.js.map