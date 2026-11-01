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
exports.openItemById = openItemById;
exports.menuItems = menuItems;
exports.default = contextMenu;
const index_1 = __importDefault(require("@joplin/lib/services/ResourceEditWatcher/index"));
const locale_1 = require("@joplin/lib/locale");
const clipboardUtils_1 = require("./clipboardUtils");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const contextMenuUtils_1 = require("./contextMenuUtils");
const Menu = (0, bridge_1.default)().Menu;
const Resource_1 = __importStar(require("@joplin/lib/models/Resource"));
const BaseItem_1 = __importDefault(require("@joplin/lib/models/BaseItem"));
const BaseModel_1 = __importStar(require("@joplin/lib/BaseModel"));
const types_1 = require("@joplin/lib/services/database/types");
const types_2 = require("../NoteBody/TinyMCE/utils/types");
const readOnly_1 = require("@joplin/lib/models/utils/readOnly");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const ItemChange_1 = __importDefault(require("@joplin/lib/models/ItemChange"));
const shim_1 = __importStar(require("@joplin/lib/shim"));
const utils_1 = require("@joplin/lib/services/ExternalEditWatcher/utils");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const SyncTargetRegistry_1 = __importDefault(require("@joplin/lib/SyncTargetRegistry"));
const fs = __importStar(require("fs-extra"));
const electron_1 = require("electron");
const path_utils_1 = require("@joplin/lib/path-utils");
function handleCopyToClipboard(options) {
    if (options.textToCopy) {
        electron_1.clipboard.writeText(options.textToCopy);
    }
    else if (options.htmlToCopy) {
        (0, clipboardUtils_1.copyHtmlToClipboard)(options.htmlToCopy);
    }
}
async function saveFileData(data, filename) {
    const newFilePath = await (0, bridge_1.default)().showSaveDialog({ defaultPath: filename });
    if (!newFilePath)
        return;
    await fs.writeFile(newFilePath, data);
}
async function openItemById(itemId, dispatch, hash = '') {
    const item = await BaseItem_1.default.loadItemById(itemId);
    if (!item)
        throw new Error(`No item with ID ${itemId}`);
    if (item.type_ === BaseModel_1.default.TYPE_RESOURCE) {
        const resource = item;
        const localState = await Resource_1.default.localState(resource);
        if (localState.fetch_status !== Resource_1.default.FETCH_STATUS_DONE || !!resource.encryption_blob_encrypted) {
            if (localState.fetch_status === Resource_1.default.FETCH_STATUS_ERROR) {
                (0, bridge_1.default)().showErrorMessageBox(`${(0, locale_1._)('There was an error downloading this attachment:')}\n\n${localState.fetch_error}`);
            }
            else {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('This attachment is not downloaded or not decrypted yet'));
            }
            return;
        }
        try {
            if ((0, readOnly_1.itemIsReadOnlySync)(BaseModel_1.ModelType.Resource, ItemChange_1.default.SOURCE_UNSPECIFIED, resource, Setting_1.default.value('sync.userId'), BaseItem_1.default.syncShareCache)) {
                await index_1.default.instance().openAsReadOnly(resource.id);
            }
            else {
                await index_1.default.instance().openAndWatch(resource.id);
            }
        }
        catch (error) {
            console.error(error);
            (0, bridge_1.default)().showErrorMessageBox(error.message);
        }
    }
    else if (item.type_ === BaseModel_1.default.TYPE_NOTE) {
        const note = item;
        dispatch({
            type: 'FOLDER_AND_NOTE_SELECT',
            folderId: note.parent_id,
            noteId: note.id,
            hash,
        });
    }
    else {
        throw new Error(`Unsupported item type: ${item.type_}`);
    }
}
function menuItems(dispatch) {
    const makeSeparator = () => {
        return {
            isActive: () => { return true; },
            label: '',
            onAction: () => { },
            isSeparator: true,
        };
    };
    return {
        open: {
            label: (0, locale_1._)('Open...'),
            onAction: async (options) => {
                if (options.resourceId) {
                    await openItemById(options.resourceId, dispatch);
                }
                else if (options.linkToOpen) {
                    await CommandService_1.default.instance().execute('openItem', options.linkToOpen);
                }
                else {
                    await shim_1.default.showErrorDialog('No link found');
                }
            },
            isActive: (itemType, options) => ((!options.textToCopy && (itemType === contextMenuUtils_1.ContextMenuItemType.Image || itemType === contextMenuUtils_1.ContextMenuItemType.Resource || itemType === contextMenuUtils_1.ContextMenuItemType.NoteLink))
                || (!!options.linkToOpen && itemType === contextMenuUtils_1.ContextMenuItemType.Link)),
        },
        openNoteInNewWindow: {
            label: (0, locale_1._)('Open in new window'),
            onAction: async (options) => {
                await CommandService_1.default.instance().execute('openNoteInNewWindow', options.resourceId);
            },
            isActive: (itemType) => itemType === contextMenuUtils_1.ContextMenuItemType.NoteLink,
        },
        saveAs: {
            label: (0, locale_1._)('Save as...'),
            onAction: async (options) => {
                const { resourcePath, resource } = await (0, contextMenuUtils_1.resourceInfo)(options);
                const filePath = await (0, bridge_1.default)().showSaveDialog({
                    defaultPath: resource.filename ? resource.filename : resource.title,
                });
                if (!filePath)
                    return;
                await fs.copy(resourcePath, filePath);
            },
            // We handle images received as text separately as it can be saved in multiple formats
            isActive: (itemType, options) => !options.textToCopy && (itemType === contextMenuUtils_1.ContextMenuItemType.Image || itemType === contextMenuUtils_1.ContextMenuItemType.Resource),
        },
        saveAsSvg: {
            label: (0, locale_1._)('Save as %s', 'SVG'),
            onAction: async (options) => {
                await saveFileData(options.textToCopy, options.filename);
            },
            isActive: (itemType, options) => { var _a; return !!options.textToCopy && itemType === contextMenuUtils_1.ContextMenuItemType.Image && ((_a = options.mime) === null || _a === void 0 ? void 0 : _a.startsWith('image/svg')); },
        },
        saveAsPng: {
            label: (0, locale_1._)('Save as %s', 'PNG'),
            onAction: async (options) => {
                // First convert it to png then save
                if (options.mime !== 'image/svg+xml') {
                    throw new Error(`Unsupported image type: ${options.mime}`);
                }
                if (!options.filename) {
                    throw new Error('Filename is needed to save as png');
                }
                // double dimensions to make sure it's always big enough even on hdpi screens
                const [width, height] = (0, contextMenuUtils_1.svgDimensions)(document, options.textToCopy).map((x) => x * 2 || undefined);
                const dataUri = (0, contextMenuUtils_1.textToDataUri)(options.textToCopy, options.mime);
                const png = await (0, contextMenuUtils_1.svgUriToPng)(document, dataUri, width, height);
                const filename = options.filename.replace('.svg', '.png');
                await saveFileData(png, filename);
            },
            isActive: (itemType, options) => { var _a; return !!options.textToCopy && itemType === contextMenuUtils_1.ContextMenuItemType.Image && ((_a = options.mime) === null || _a === void 0 ? void 0 : _a.startsWith('image/svg')); },
        },
        separator1: makeSeparator(),
        revealInFolder: {
            label: (0, locale_1._)('Reveal file in folder'),
            onAction: async (options) => {
                const { resourcePath } = await (0, contextMenuUtils_1.resourceInfo)(options);
                (0, bridge_1.default)().showItemInFolder(resourcePath);
            },
            isActive: (itemType, options) => !options.textToCopy && (itemType === contextMenuUtils_1.ContextMenuItemType.Image || itemType === contextMenuUtils_1.ContextMenuItemType.Resource),
        },
        separator2: makeSeparator(),
        recognizeHandwrittenImage: {
            label: (0, locale_1._)('Recognize handwritten image'),
            onAction: async (options) => {
                const syncTargetId = Setting_1.default.value('sync.target');
                if (!SyncTargetRegistry_1.default.isJoplinServerOrCloud(syncTargetId)) {
                    await shim_1.default.showMessageBox((0, locale_1._)('This feature is only available on Joplin Cloud and Joplin Server.'), { type: shim_1.MessageBoxType.Error });
                    return;
                }
                if (!Setting_1.default.value('ocr.handwrittenTextDriverEnabled')) {
                    await shim_1.default.showMessageBox((0, locale_1._)('This feature is disabled by default, you need to manually enable it by turning on the option to \'Enable handwritten transcription\'.'), { type: shim_1.MessageBoxType.Error });
                    return;
                }
                const { resource } = await (0, contextMenuUtils_1.resourceInfo)(options);
                if (!['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'].includes(resource.mime)) {
                    await shim_1.default.showMessageBox((0, locale_1._)('This image type is not supported by the recognition system.'), { type: shim_1.MessageBoxType.Error });
                    return;
                }
                await Resource_1.default.save({
                    id: resource.id,
                    ocr_status: types_1.ResourceOcrStatus.Todo,
                    ocr_driver_id: types_1.ResourceOcrDriverId.HandwrittenText,
                    ocr_details: '',
                    ocr_error: '',
                    ocr_text: '',
                });
            },
            isActive: (itemType, options) => {
                return itemType === contextMenuUtils_1.ContextMenuItemType.Resource || (itemType === contextMenuUtils_1.ContextMenuItemType.Image && !!options.resourceId);
            },
        },
        copyOcrText: {
            label: (0, locale_1._)('View OCR text'),
            onAction: async (options) => {
                const { resource } = await (0, contextMenuUtils_1.resourceInfo)(options);
                if (resource.ocr_status === types_1.ResourceOcrStatus.Done) {
                    const tempFilePath = `${Setting_1.default.value('tempDir')}/${resource.id}_ocr.txt`;
                    await shim_1.default.fsDriver().writeFile(tempFilePath, resource.ocr_text, 'utf8');
                    await (0, utils_1.openFileWithExternalEditor)(tempFilePath, (0, bridge_1.default)());
                }
                else {
                    (0, bridge_1.default)().showInfoMessageBox((0, locale_1._)('This attachment does not have OCR data (Status: %s)', (0, Resource_1.resourceOcrStatusToString)(resource.ocr_status)));
                }
            },
            isActive: (itemType, options) => {
                return itemType === contextMenuUtils_1.ContextMenuItemType.Resource || (itemType === contextMenuUtils_1.ContextMenuItemType.Image && !!options.resourceId);
            },
        },
        createAccessibleDocument: {
            label: (0, locale_1._)('Create accessible document'),
            onAction: async (options) => {
                const { resource } = await (0, contextMenuUtils_1.resourceInfo)(options);
                await CommandService_1.default.instance().execute('createAccessibleDocument', resource.id);
            },
            isActive: (itemType, options) => {
                return itemType === contextMenuUtils_1.ContextMenuItemType.Resource || (itemType === contextMenuUtils_1.ContextMenuItemType.Image && !!options.resourceId);
            },
        },
        separator3: makeSeparator(),
        copyPathToClipboard: {
            label: (0, locale_1._)('Copy path to clipboard'),
            onAction: async (options) => {
                let path = '';
                if (options.textToCopy && options.mime) {
                    path = (0, contextMenuUtils_1.textToDataUri)(options.textToCopy, options.mime);
                }
                else {
                    const { resourcePath } = await (0, contextMenuUtils_1.resourceInfo)(options);
                    if (resourcePath)
                        path = (0, path_utils_1.toSystemSlashes)(resourcePath);
                }
                if (!path)
                    return;
                electron_1.clipboard.writeText(path);
            },
            isActive: (itemType) => itemType === contextMenuUtils_1.ContextMenuItemType.Image || itemType === contextMenuUtils_1.ContextMenuItemType.Resource,
        },
        copyImage: {
            label: (0, locale_1._)('Copy image'),
            onAction: async (options) => {
                const { resourcePath } = await (0, contextMenuUtils_1.resourceInfo)(options);
                const image = (0, bridge_1.default)().createImageFromPath(resourcePath);
                electron_1.clipboard.writeImage(image);
            },
            isActive: (itemType, options) => !options.textToCopy && itemType === contextMenuUtils_1.ContextMenuItemType.Image,
        },
        copyLinkUrl: {
            label: (0, locale_1._)('Copy Link Address'),
            onAction: async (options) => {
                electron_1.clipboard.writeText(options.linkToCopy !== null ? options.linkToCopy : options.textToCopy);
            },
            isActive: (itemType, options) => itemType === contextMenuUtils_1.ContextMenuItemType.Link || !!options.linkToCopy,
        },
        separator4: makeSeparator(),
        cut: {
            label: (0, locale_1._)('Cut'),
            onAction: async (options) => {
                handleCopyToClipboard(options);
                options.insertContent('');
            },
            isActive: (itemType, options) => itemType !== contextMenuUtils_1.ContextMenuItemType.Image && (!options.isReadOnly && (!!options.textToCopy || !!options.htmlToCopy)),
        },
        copy: {
            label: (0, locale_1._)('Copy'),
            onAction: async (options) => {
                handleCopyToClipboard(options);
            },
            isActive: (itemType, options) => itemType !== contextMenuUtils_1.ContextMenuItemType.Image && (!!options.textToCopy || !!options.htmlToCopy),
        },
        paste: {
            label: (0, locale_1._)('Paste'),
            onAction: async (_options) => {
                (0, bridge_1.default)().activeWindow().webContents.paste();
            },
            isActive: (_itemType, options) => !options.isReadOnly && electron_1.clipboard.availableFormats().length > 0,
        },
        pasteAsText: {
            label: (0, locale_1._)('Paste as text'),
            onAction: async (options) => {
                options.fireEditorEvent(types_2.TinyMceEditorEvents.PasteAsText);
            },
            isActive: (_itemType, options) => !options.isReadOnly && (!!electron_1.clipboard.readText() || !!electron_1.clipboard.readHTML()),
        },
    };
}
async function contextMenu(options, dispatch) {
    const menu = new Menu();
    if (!('readyOnly' in options))
        options.isReadOnly = true;
    const items = await (0, contextMenuUtils_1.buildMenuItems)(menuItems(dispatch), options);
    for (const item of items) {
        menu.append(item);
    }
    return menu;
}
//# sourceMappingURL=contextMenu.js.map