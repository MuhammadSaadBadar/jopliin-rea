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
exports.processImagesInPastedHtml = exports.getResourceFromClipboardImage = exports.plainTextLooksLikeAffinityImageData = void 0;
exports.handleResourceDownloadMode = handleResourceDownloadMode;
exports.commandAttachFileToBody = commandAttachFileToBody;
exports.resourcesStatus = resourcesStatus;
exports.getResourcesFromPasteEvent = getResourcesFromPasteEvent;
exports.processPastedHtml = processPastedHtml;
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const ResourceFetcher_1 = __importDefault(require("@joplin/lib/services/ResourceFetcher"));
const htmlUtils_1 = __importDefault(require("@joplin/lib/htmlUtils"));
const htmlUtils_2 = __importStar(require("@joplin/renderer/htmlUtils"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const url_1 = require("@joplin/utils/url");
const renderer_1 = require("@joplin/renderer");
const markupRenderOptions_1 = __importDefault(require("./markupRenderOptions"));
const path_1 = require("@joplin/utils/path");
const joplinRendererUtils = require('@joplin/renderer').utils;
const electron_1 = require("electron");
const mimeUtils = __importStar(require("@joplin/lib/mime-utils"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
const getCollator_1 = require("@joplin/lib/models/utils/getCollator");
const md5 = require('md5');
const path = __importStar(require("path"));
const logger = Logger_1.default.create('resourceHandling');
const textForPasteInspection = (text) => {
    try {
        return decodeURIComponent(text);
    }
    catch (_a) {
        return text;
    }
};
const plainTextLooksLikeAffinityImageData = (text) => {
    if (!text)
        return false;
    const decodedText = textForPasteInspection(text);
    return /<svg(?:\s|>)/i.test(decodedText) && /data:image\/[^;]+;base64,/i.test(decodedText);
};
exports.plainTextLooksLikeAffinityImageData = plainTextLooksLikeAffinityImageData;
async function handleResourceDownloadMode(noteBody) {
    if (noteBody && Setting_1.default.value('sync.resourceDownloadMode') === 'auto') {
        const resourceIds = await Note_1.default.linkedResourceIds(noteBody);
        await ResourceFetcher_1.default.instance().markForDownload(resourceIds);
    }
}
async function commandAttachFileToBody(body, filePaths = null, options = null) {
    var _a;
    options = Object.assign({ createFileURL: false, position: 0, markupLanguage: renderer_1.MarkupLanguage.Markdown }, options);
    if (!filePaths) {
        filePaths = await (0, bridge_1.default)().showOpenDialog({
            properties: ['openFile', 'createDirectory', 'multiSelections'],
        });
        if (!filePaths || !filePaths.length)
            return null;
    }
    const collatorLocale = (0, getCollator_1.getCollatorLocale)();
    const collator = (0, getCollator_1.getCollator)(collatorLocale);
    filePaths = filePaths.sort((a, b) => {
        return collator.compare(a, b);
    });
    let pos = (_a = options.position) !== null && _a !== void 0 ? _a : 0;
    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        const beforeLen = body.length;
        try {
            logger.info(`Attaching ${filePath}`);
            const newBody = await shim_1.default.attachFileToNoteBody(body, filePath, pos, {
                createFileURL: options.createFileURL,
                resizeLargeImages: Setting_1.default.value('imageResizing'),
                markupLanguage: options.markupLanguage,
                resourcePrefix: i > 0 ? ' ' : '',
            });
            if (!newBody) {
                logger.info('File attachment was cancelled');
                return null;
            }
            pos += newBody.length - beforeLen;
            body = newBody;
            logger.info('File was attached.');
        }
        catch (error) {
            logger.error(error);
            (0, bridge_1.default)().showErrorMessageBox(error.message);
        }
    }
    return body;
}
function resourcesStatus(resourceInfos) {
    let lowestIndex = joplinRendererUtils.resourceStatusIndex('ready');
    for (const id in resourceInfos) {
        const s = joplinRendererUtils.resourceStatus(Resource_1.default, resourceInfos[id]);
        const idx = joplinRendererUtils.resourceStatusIndex(s);
        if (idx < lowestIndex)
            lowestIndex = idx;
    }
    return joplinRendererUtils.resourceStatusName(lowestIndex);
}
const clipboardImageToResource = async (image, mime) => {
    const fileExt = mimeUtils.toFileExtension(mime);
    const filePath = `${Setting_1.default.value('tempDir')}/${md5(Date.now())}.${fileExt}`;
    await shim_1.default.writeImageToFile(image, mime, filePath);
    try {
        const md = await commandAttachFileToBody('', [filePath]);
        return md;
    }
    finally {
        await shim_1.default.fsDriver().remove(filePath);
    }
};
const getResourceFromClipboardImage = async () => {
    const image = electron_1.clipboard.readImage();
    if (image.isEmpty())
        return null;
    const supportedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
    const format = electron_1.clipboard.availableFormats()
        .map((format) => format.toLowerCase())
        .find((format) => supportedFormats.includes(format)) || 'image/png';
    return clipboardImageToResource(image, format);
};
exports.getResourceFromClipboardImage = getResourceFromClipboardImage;
async function getResourcesFromPasteEvent(event) {
    const output = [];
    const formats = electron_1.clipboard.availableFormats();
    for (let i = 0; i < formats.length; i++) {
        const format = formats[i].toLowerCase();
        const formatType = format.split('/')[0];
        if (formatType === 'image') {
            // writeImageToFile can process only image/jpeg, image/jpg or image/png mime types
            if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(format) < 0) {
                continue;
            }
            if (event)
                event.preventDefault();
            const md = await clipboardImageToResource(electron_1.clipboard.readImage(), format);
            if (md)
                output.push(md);
        }
    }
    // Some applications (e.g. macshot) copy images to the clipboard without
    // an image/* format, but clipboard.readImage() can still read them.
    if (!output.length) {
        const image = electron_1.clipboard.readImage();
        if (!image.isEmpty()) {
            if (event)
                event.preventDefault();
            const md = await clipboardImageToResource(image, 'image/png');
            if (md)
                output.push(md);
        }
    }
    return output;
}
const processImagesInPastedHtml = async (html, options = {}) => {
    const allImageUrls = [];
    const mappedResources = {};
    const resourceUrl = (resource) => {
        return options.useInternalUrls
            ? Resource_1.default.internalUrl(resource)
            : `file://${encodeURI(Resource_1.default.fullPath(resource))}`;
    };
    htmlUtils_1.default.replaceImageUrls(html, (src) => {
        allImageUrls.push(src);
    });
    const downloadImage = async (imageSrc) => {
        try {
            const fileExt = (0, path_1.safeFileExtension)((0, path_1.fileExtension)(imageSrc));
            const name = (0, path_1.safeFilename)((0, path_1.filename)(imageSrc));
            const pieces = [name ? name : md5(Date.now() + Math.random())];
            if (fileExt)
                pieces.push(fileExt);
            const filePath = `${Setting_1.default.value('tempDir')}/${pieces.join('.')}`;
            await shim_1.default.fetchBlob(imageSrc, { path: filePath });
            const createdResource = await shim_1.default.createResourceFromPath(filePath);
            await shim_1.default.fsDriver().remove(filePath);
            mappedResources[imageSrc] = resourceUrl(createdResource);
        }
        catch (error) {
            logger.warn(`Error creating a resource for ${imageSrc}.`, error);
            mappedResources[imageSrc] = imageSrc;
        }
    };
    const downloadImages = [];
    for (const imageSrc of allImageUrls) {
        if (!mappedResources[imageSrc]) {
            logger.info(`processPastedHtml: Processing image ${imageSrc}`);
            try {
                if (imageSrc.startsWith('file')) {
                    const imageFilePath = path.normalize((0, url_1.fileUriToPath)(imageSrc));
                    const resourceDirPath = path.normalize(Setting_1.default.value('resourceDir'));
                    // Use path.relative for robust containment check - startsWith can falsely match sibling paths
                    const rel = path.relative(resourceDirPath, imageFilePath);
                    const isInsideResourceDir = rel && !rel.startsWith('..') && !path.isAbsolute(rel);
                    if (isInsideResourceDir) {
                        if (options.useInternalUrls) {
                            const resourceId = Resource_1.default.pathToId(imageFilePath);
                            mappedResources[imageSrc] = `:/${resourceId}`;
                        }
                        else {
                            mappedResources[imageSrc] = imageSrc;
                        }
                    }
                    else {
                        const createdResource = await shim_1.default.createResourceFromPath(imageFilePath);
                        mappedResources[imageSrc] = resourceUrl(createdResource);
                    }
                }
                else if (imageSrc.startsWith('data:')) {
                    // Word encodes base64 with MIME line breaks every ~76 chars.
                    // Strip whitespace before decoding, then save as a Joplin resource
                    // so Turndown's outerHTML (used for images with width/height) gets
                    // a short URL instead of 200KB of base64.
                    const cleanSrc = imageSrc.replace(/\s/g, '');
                    const dataUrlMatch = cleanSrc.match(/^data:((?!image\/svg\+xml)[^;]+);base64,(.+)$/);
                    if (dataUrlMatch) {
                        const mimeType = dataUrlMatch[1];
                        const base64Data = dataUrlMatch[2];
                        const fileExt = mimeUtils.toFileExtension(mimeType) || 'bin';
                        const filePath = `${Setting_1.default.value('tempDir')}/${md5(Date.now() + Math.random())}.${fileExt}`;
                        try {
                            await shim_1.default.fsDriver().writeFile(filePath, base64Data, 'base64');
                            const createdResource = await shim_1.default.createResourceFromPath(filePath);
                            mappedResources[imageSrc] = resourceUrl(createdResource);
                        }
                        catch (writeError) {
                            writeError.message = `processPastedHtml: Failed to write or create resource from pasted image: ${writeError.message}`;
                            throw writeError;
                        }
                        finally {
                            try {
                                await shim_1.default.fsDriver().remove(filePath);
                            }
                            catch (cleanupError) {
                                logger.warn('processPastedHtml: Error removing temporary file.', cleanupError);
                            }
                        }
                    }
                    else {
                        mappedResources[imageSrc] = imageSrc;
                    }
                }
                else {
                    downloadImages.push(downloadImage(imageSrc));
                }
            }
            catch (error) {
                logger.warn(`processPastedHtml: Error creating a resource for ${imageSrc}.`, error);
                mappedResources[imageSrc] = imageSrc;
            }
        }
    }
    await Promise.all(downloadImages);
    return htmlUtils_1.default.replaceImageUrls(html, (src) => mappedResources[src]);
};
exports.processImagesInPastedHtml = processImagesInPastedHtml;
async function processPastedHtml(html, htmlToMd, mdToHtml) {
    // When copying text from eg. GitHub, the HTML might contain non-breaking
    // spaces instead of regular spaces. If these non-breaking spaces are
    // inserted into the TinyMCE editor (using insertContent), they will be
    // dropped. So here we convert them to regular spaces.
    // https://stackoverflow.com/a/31790544/561309
    html = html.replace(/[\u202F\u00A0]/g, ' ');
    html = await (0, exports.processImagesInPastedHtml)(html);
    // Word encodes newlines in alt attributes as HTML entities (&#10; &#13; &#xA; etc.).
    // These get decoded to literal newline characters by JSDOM when Turndown processes
    // the HTML. With preserveImageTagsWithSize=true, Turndown returns node.outerHTML
    // verbatim — embedding literal newlines inside an HTML attribute value, which
    // breaks the Markdown raw HTML block (a blank line ends the block, making the
    // parser treat the <img> as plain text). Normalize them to spaces here.
    html = html.replace(/(\balt\s*=\s*)(["'])([\s\S]*?)\2/gi, (_m, prefix, quote, altText) => {
        // Replace HTML-encoded newlines/control chars and literal ones with a space
        const normalized = altText
            .replace(/&#(?:10|13);|&#x(?:0*[aAdD]);/gi, ' ')
            // biome-ignore lint/suspicious/noControlCharactersInRegex: intentional sanitisation of control chars
            // eslint-disable-next-line no-control-regex
            .replace(/[\r\n\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
            .replace(/ {2,}/g, ' ')
            .trim();
        return `${prefix}${quote}${normalized}${quote}`;
    });
    // TinyMCE can accept any type of HTML, including HTML that may not be preserved once saved as
    // Markdown. For example the content may have a dark background which would be supported by
    // TinyMCE, but lost once the note is saved. So here we convert the HTML to Markdown then back
    // to HTML to ensure that the content we paste will be handled correctly by the app.
    if (htmlToMd && mdToHtml) {
        const md = await htmlToMd(renderer_1.MarkupLanguage.Markdown, html, '', { preserveColorStyles: Setting_1.default.value('editor.pastePreserveColors') });
        html = (await mdToHtml(renderer_1.MarkupLanguage.Markdown, md, (0, markupRenderOptions_1.default)({ bodyOnly: true }))).html;
        // When plugins that add to the end of rendered content are installed, bodyOnly can
        // fail to remove the wrapping paragraph. This works around that issue by removing
        // the wrapping paragraph in more cases. See issue #10061.
        if (!md.trim().includes('\n')) {
            html = (0, htmlUtils_2.removeWrappingParagraphAndTrailingEmptyElements)(html);
        }
    }
    return (0, htmlUtils_2.extractHtmlBody)(htmlUtils_2.default.sanitizeHtml(html, {
        allowedFilePrefixes: [Setting_1.default.value('resourceDir')],
    }));
}
//# sourceMappingURL=resourceHandling.js.map