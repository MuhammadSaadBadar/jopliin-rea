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
exports.uploadReleaseAsset = exports.updateReleaseAsset = exports.downloadFileFromGitHub = exports.getTargetRelease = void 0;
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const promises_1 = require("stream/promises");
const axios_1 = __importDefault(require("axios"));
const apiBaseUrl = 'https://api.github.com/repos/';
const defaultApiHeaders = (context) => ({
    'User-Agent': 'Joplin',
    'Authorization': `token ${context.githubToken}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Accept': 'application/vnd.github+json',
});
const getTargetRelease = async (context, targetTag) => {
    console.log('Fetching releases...');
    // Note: We need to fetch all releases, not just /releases/tag/tag-name-here.
    // The latter doesn't include draft releases.
    const result = await fetch(`${apiBaseUrl}${context.repo}/releases`, {
        method: 'GET',
        headers: defaultApiHeaders(context),
    });
    const releases = await result.json();
    if (!result.ok) {
        throw new Error(`Error fetching release: ${JSON.stringify(releases)}`);
    }
    for (const release of releases) {
        if (release.tag_name === targetTag) {
            return release;
        }
    }
    throw new Error(`No release with tag ${targetTag} found!`);
};
exports.getTargetRelease = getTargetRelease;
// Download a file from Joplin Desktop releases
const downloadFileFromGitHub = async (context, asset, destinationDir) => {
    const downloadPath = path.join(destinationDir, asset.name);
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir);
    }
    /* eslint-disable no-console */
    console.log(`Downloading ${asset.name} from ${asset.url} to ${downloadPath}`);
    try {
        const response = await (0, axios_1.default)({
            method: 'get',
            url: asset.url,
            responseType: 'stream',
            headers: Object.assign(Object.assign({}, defaultApiHeaders(context)), { 'Accept': 'application/octet-stream' }),
        });
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Failed to download file: Status Code ${response.status}`);
        }
        await (0, promises_1.pipeline)(response.data, (0, fs_1.createWriteStream)(downloadPath));
        console.log('Download successful!');
        /* eslint-enable no-console */
        return downloadPath;
    }
    catch (error) {
        throw new Error('Download not successful.');
    }
};
exports.downloadFileFromGitHub = downloadFileFromGitHub;
const updateReleaseAsset = async (context, assetUrl, newName) => {
    console.log('Updating asset with URL', assetUrl, 'to have name, ', newName);
    // See https://docs.github.com/en/rest/releases/assets?apiVersion=2022-11-28#update-a-release-asset
    const result = await fetch(assetUrl, {
        method: 'PATCH',
        headers: defaultApiHeaders(context),
        body: JSON.stringify({
            name: newName,
        }),
    });
    if (!result.ok) {
        throw new Error(`Unable to update release asset: ${await result.text()}`);
    }
};
exports.updateReleaseAsset = updateReleaseAsset;
const uploadReleaseAsset = async (context, release, filePath) => {
    console.log(`Uploading file from ${filePath} to release ${release.tag_name}`);
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const uploadUrl = `https://uploads.github.com/repos/${context.repo}/releases/${release.id}/assets?name=${encodeURIComponent(fileName)}`;
    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: Object.assign(Object.assign({}, defaultApiHeaders(context)), { 'Content-Type': 'application/octet-stream' }),
        body: fileContent,
    });
    if (!response.ok) {
        throw new Error(`Failed to upload asset: ${await response.text()}`);
    }
    else {
        console.log(`${fileName} uploaded successfully.`);
    }
};
exports.uploadReleaseAsset = uploadReleaseAsset;
//# sourceMappingURL=githubReleasesUtils.js.map