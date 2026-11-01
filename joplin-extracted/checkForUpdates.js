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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReleaseVersion = isReleaseVersion;
exports.default = checkForUpdates;
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("./services/bridge"));
const KvStore_1 = __importDefault(require("@joplin/lib/services/KvStore"));
const ArrayUtils = __importStar(require("@joplin/lib/ArrayUtils"));
const checkForUpdatesUtils_1 = require("./utils/checkForUpdatesUtils");
const compare_versions_1 = require("compare-versions");
const packageInfo = require('./packageInfo.js');
const logger = Logger_1.default.create('checkForUpdates');
let checkInBackground_ = false;
let isCheckingForUpdate_ = false;
function onCheckStarted() {
    logger.info('Starting...');
    isCheckingForUpdate_ = true;
}
function onCheckEnded() {
    logger.info('Done.');
    isCheckingForUpdate_ = false;
}
async function fetchLatestReleases() {
    const response = await shim_1.default.fetch('https://objects.joplinusercontent.com/r/releases');
    if (!response.ok) {
        const responseText = await response.text();
        logger.error(`Cannot get latest release info (${response.status}): ${responseText.substr(0, 500)}`);
        (0, checkForUpdatesUtils_1.handleReleaseResponseError)(response.status, responseText);
    }
    return (await response.json());
}
async function isReleaseVersion(version) {
    const releases = await fetchLatestReleases();
    const release = releases.find(release => release.tag_name === `v${version}`);
    return release ? !release.prerelease : null;
}
function truncateText(text, length) {
    let truncated = text.substring(0, length);
    const lastNewLine = truncated.lastIndexOf('\n');
    // Cut off at a line break unless we'd be cutting off half the text
    if (lastNewLine > length / 2) {
        truncated = `${truncated.substring(0, lastNewLine)}\n...`;
    }
    else {
        truncated = `${truncated.trim()}...`;
    }
    return truncated;
}
async function getSkippedVersions() {
    const r = await KvStore_1.default.instance().value('updateCheck::skippedVersions');
    return r && typeof r === 'string' ? JSON.parse(r) : [];
}
async function isSkippedVersion(v) {
    const versions = await getSkippedVersions();
    return versions.includes(v);
}
async function addSkippedVersion(s) {
    let versions = await getSkippedVersions();
    versions.push(s);
    versions = ArrayUtils.unique(versions);
    await KvStore_1.default.instance().setValue('updateCheck::skippedVersions', JSON.stringify(versions));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- parentWindow is passed to bridge().showMessageBox but the bridge signature no longer accepts a window arg; tightening would expose a pre-existing call-site mismatch (logic change)
async function checkForUpdates(inBackground, parentWindow, options) {
    if (isCheckingForUpdate_) {
        logger.info('Skipping check because it is already running');
        return;
    }
    onCheckStarted();
    checkInBackground_ = inBackground;
    logger.info(`Checking with options ${JSON.stringify(options)}`);
    try {
        const releases = await fetchLatestReleases();
        const release = (0, checkForUpdatesUtils_1.extractVersionInfo)(releases, process.platform, process.arch, shim_1.default.isPortable(), options);
        logger.info(`Current version: ${packageInfo.version}`);
        logger.info(`Latest version: ${release.version}`);
        logger.info('Is Pre-release:', release.prerelease);
        if ((0, compare_versions_1.compareVersions)(release.version, packageInfo.version) <= 0) {
            if (!checkInBackground_) {
                await (0, bridge_1.default)().showMessageBox((0, locale_1._)('Current version is up-to-date.'));
            }
        }
        else {
            const shouldSkip = checkInBackground_ && await isSkippedVersion(release.version);
            if (shouldSkip) {
                logger.info('Not displaying notification because version has been skipped');
            }
            else {
                const fullReleaseNotes = release.notes.trim() ? `\n\n${release.notes.trim()}` : '';
                const MAX_RELEASE_NOTES_LENGTH = 1000;
                const truncateReleaseNotes = fullReleaseNotes.length > MAX_RELEASE_NOTES_LENGTH;
                const releaseNotes = truncateReleaseNotes ? truncateText(fullReleaseNotes, MAX_RELEASE_NOTES_LENGTH) : fullReleaseNotes;
                const newVersionString = release.prerelease ? (0, locale_1._)('%s (pre-release)', release.version) : release.version;
                const buttonIndex = await (0, bridge_1.default)().showMessageBox(parentWindow, {
                    type: 'info',
                    message: `${(0, locale_1._)('An update is available, do you want to download it now?')}`,
                    detail: `${(0, locale_1._)('Your version: %s', packageInfo.version)}\n${(0, locale_1._)('New version: %s', newVersionString)}${releaseNotes}`,
                    buttons: [(0, locale_1._)('Download'), (0, locale_1._)('Skip this version'), (0, locale_1._)('Full changelog'), (0, locale_1._)('Cancel')],
                    cancelId: 3,
                });
                if (buttonIndex === 0) {
                    void (0, bridge_1.default)().openExternal(release.downloadUrl ? release.downloadUrl : release.pageUrl);
                }
                else if (buttonIndex === 1) {
                    await addSkippedVersion(release.version);
                }
                else if (buttonIndex === 2) {
                    void (0, bridge_1.default)().openExternal('https://joplinapp.org/help/about/changelog/desktop');
                }
            }
        }
    }
    catch (error) {
        logger.error(error);
        if (!checkInBackground_)
            await (0, bridge_1.default)().showErrorMessageBox(error.message);
    }
    finally {
        onCheckEnded();
    }
}
//# sourceMappingURL=checkForUpdates.js.map