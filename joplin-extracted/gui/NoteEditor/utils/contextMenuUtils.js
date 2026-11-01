"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMenuItems = exports.handleEditorContextMenuFilter = exports.svgUriToPng = exports.svgDimensions = exports.resolveContextMenuItemType = exports.ContextMenuItemType = void 0;
exports.resourceInfo = resourceInfo;
exports.textToDataUri = textToDataUri;
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
const types_1 = require("@joplin/lib/services/plugins/api/types");
Object.defineProperty(exports, "ContextMenuItemType", { enumerable: true, get: function () { return types_1.ContextMenuItemType; } });
const eventManager_1 = __importDefault(require("@joplin/lib/eventManager"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const BaseItem_1 = __importDefault(require("@joplin/lib/models/BaseItem"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
const MenuItem = (0, bridge_1.default)().MenuItem;
const logger = Logger_1.default.create('contextMenuUtils');
// Resolves whether a resource-type item is actually a note link.
// Falls back to Resource on error or if the item is not found.
const resolveContextMenuItemType = async (itemType, resourceId) => {
    if (itemType !== types_1.ContextMenuItemType.Resource || !resourceId)
        return itemType;
    try {
        const item = await BaseItem_1.default.loadItemById(resourceId);
        if ((item === null || item === void 0 ? void 0 : item.type_) === BaseModel_1.ModelType.Note)
            return types_1.ContextMenuItemType.NoteLink;
    }
    catch (error) {
        logger.warn('resolveContextMenuItemType: failed to load item, defaulting to Resource', error);
    }
    return types_1.ContextMenuItemType.Resource;
};
exports.resolveContextMenuItemType = resolveContextMenuItemType;
async function resourceInfo(options) {
    const resource = options.resourceId ? await Resource_1.default.load(options.resourceId) : null;
    const resourcePath = resource ? Resource_1.default.fullPath(resource) : null;
    const filename = resource ? (resource.filename ? resource.filename : resource.title) : options.filename ? options.filename : '';
    return { resource, resourcePath, filename };
}
function textToDataUri(text, mime) {
    return `data:${mime};base64,${Buffer.from(text).toString('base64')}`;
}
const svgDimensions = (document, svg) => {
    let width;
    let height;
    try {
        const parser = new DOMParser();
        const id = parser.parseFromString(svg, 'text/html').querySelector('svg').id;
        ({ width, height } = document.querySelector('.noteTextViewer').contentWindow.document.querySelector(`#${id}`).getBoundingClientRect());
    }
    catch (error) {
        logger.warn('Could not get SVG dimensions.');
        logger.warn('Error was: ', error);
    }
    if (!width || !height) {
        return [undefined, undefined];
    }
    return [width, height];
};
exports.svgDimensions = svgDimensions;
const svgUriToPng = (document, svg, width, height) => {
    return new Promise((resolve, reject) => {
        let canvas;
        let img;
        const cleanUpAndReject = (e) => {
            if (canvas)
                canvas.remove();
            if (img)
                img.remove();
            return reject(e);
        };
        try {
            img = document.createElement('img');
            if (!img)
                throw new Error('Failed to create img element');
        }
        catch (e) {
            return cleanUpAndReject(e);
        }
        img.onload = function () {
            try {
                canvas = document.createElement('canvas');
                if (!canvas)
                    throw new Error('Failed to create canvas element');
                if (!width || !height) {
                    const maxDimension = 1024;
                    if (img.width > img.height) {
                        width = maxDimension;
                        height = width * (img.height / img.width);
                    }
                    else {
                        height = maxDimension;
                        width = height * (img.width / img.height);
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx)
                    throw new Error('Failed to get context');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                const pngUri = canvas.toDataURL('image/png');
                if (!pngUri)
                    throw new Error('Failed to generate png uri');
                const pngBase64 = pngUri.split(',')[1];
                const byteString = atob(pngBase64);
                // write the bytes of the string to a typed array
                const buff = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    buff[i] = byteString.charCodeAt(i);
                }
                canvas.remove();
                img.remove();
                resolve(buff);
            }
            catch (error) {
                cleanUpAndReject(error);
            }
        };
        img.onerror = function (e) {
            cleanUpAndReject(new Error(e.toString()));
        };
        img.src = svg;
    });
};
exports.svgUriToPng = svgUriToPng;
// Filter out leading, trailing, and consecutive separators from a list
const filterSeparators = (items, isSeparator) => {
    const filtered = [];
    let lastWasSeparator = true;
    for (const item of items) {
        if (isSeparator(item)) {
            if (lastWasSeparator)
                continue;
            lastWasSeparator = true;
        }
        else {
            lastWasSeparator = false;
        }
        filtered.push(item);
    }
    while (filtered.length > 0 && isSeparator(filtered[filtered.length - 1])) {
        filtered.pop();
    }
    return filtered;
};
const handleEditorContextMenuFilter = async (context) => {
    let filterObject = {
        items: [],
        context,
    };
    filterObject = await eventManager_1.default.filterEmit('editorContextMenu', filterObject);
    const filteredItems = filterSeparators(filterObject.items, item => item.type === 'separator');
    const output = [];
    for (const item of filteredItems) {
        output.push(new MenuItem({
            label: item.label,
            click: async () => {
                const args = item.commandArgs || [];
                void CommandService_1.default.instance().execute(item.commandName, ...args);
            },
            type: item.type,
        }));
    }
    return output;
};
exports.handleEditorContextMenuFilter = handleEditorContextMenuFilter;
const buildMenuItems = async (items, options, buildOptions) => {
    const editItemKeys = ['cut', 'copy', 'paste', 'pasteAsText', 'separator4'];
    const activeItems = [];
    for (const itemKey in items) {
        if ((buildOptions === null || buildOptions === void 0 ? void 0 : buildOptions.excludeEditItems) && editItemKeys.includes(itemKey))
            continue;
        const item = items[itemKey];
        if (item.isActive(options.itemType, options)) {
            activeItems.push(item);
        }
    }
    if (!(buildOptions === null || buildOptions === void 0 ? void 0 : buildOptions.excludePluginItems)) {
        const extraItems = await (0, exports.handleEditorContextMenuFilter)({
            resourceId: options.resourceId,
            itemType: options.itemType,
            textToCopy: options.textToCopy,
        });
        if (extraItems.length) {
            activeItems.push({
                isActive: () => true,
                label: '',
                onAction: () => { },
                isSeparator: true,
            });
        }
        for (const [, extraItem] of extraItems.entries()) {
            activeItems.push({
                isActive: () => true,
                label: extraItem.label,
                onAction: () => {
                    extraItem.click();
                },
                isSeparator: extraItem.type === 'separator',
            });
        }
    }
    const filteredItems = filterSeparators(activeItems, item => item.isSeparator);
    return filteredItems.map(item => new MenuItem({
        label: item.label,
        click: () => {
            item.onAction(options);
        },
        type: item.isSeparator ? 'separator' : 'normal',
    }));
};
exports.buildMenuItems = buildMenuItems;
//# sourceMappingURL=contextMenuUtils.js.map