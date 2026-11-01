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
const React = __importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@xyflow/react");
const url_1 = require("url");
const renderer_1 = require("@joplin/renderer");
const BaseItem_1 = __importDefault(require("@joplin/lib/models/BaseItem"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const ItemChange_1 = __importDefault(require("@joplin/lib/models/ItemChange"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
const attachedResources_1 = __importDefault(require("@joplin/lib/utils/attachedResources"));
const locale_1 = require("@joplin/lib/locale");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const resourceUtils_1 = require("@joplin/lib/models/utils/resourceUtils");
const presetColors_1 = require("@joplin/lib/services/whiteboard/presetColors");
const resolveRef_1 = require("@joplin/lib/services/whiteboard/resolveRef");
const WhiteboardContext_1 = require("../WhiteboardContext");
const useCheckboxToggle_1 = __importDefault(require("../useCheckboxToggle"));
const handlePositions_1 = __importDefault(require("./handlePositions"));
const useCardWheel_1 = __importDefault(require("./useCardWheel"));
const stripUnsafeStyles_1 = __importDefault(require("./stripUnsafeStyles"));
const logger = Logger_1.default.create('WhiteboardFileNode');
const resourceUrlFor = (resource, resourceDirectory) => {
    if (!resource || !resourceDirectory)
        return null;
    return (0, url_1.pathToFileURL)((0, resourceUtils_1.resourceFullPath)(resource, resourceDirectory)).href;
};
const useResolvedRef = (file) => {
    const [resolved, setResolved] = (0, react_1.useState)(null);
    const [refetchCount, setRefetchCount] = (0, react_1.useState)(0);
    const lastLoadedFileRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        const ref = (0, resolveRef_1.resolveFileRef)(file);
        if (ref.kind === resolveRef_1.RefKind.External) {
            setResolved(null);
            lastLoadedFileRef.current = null;
            return undefined;
        }
        if (lastLoadedFileRef.current !== file) {
            setResolved(null);
            lastLoadedFileRef.current = file;
        }
        void (async () => {
            try {
                const item = await BaseItem_1.default.loadItemById(ref.id);
                if (cancelled)
                    return;
                if (!item) {
                    setResolved({ kind: 'unknown', title: file });
                    return;
                }
                if (item.type_ === BaseModel_1.ModelType.Note) {
                    setResolved({
                        kind: 'note',
                        title: item.title || 'Untitled',
                        body: item.body || '',
                        userUpdatedTime: item.user_updated_time,
                        deletedTime: item.deleted_time,
                    });
                }
                else if (item.type_ === BaseModel_1.ModelType.Resource) {
                    setResolved({
                        kind: 'resource',
                        title: item.title || file,
                        resource: item,
                        deletedTime: item.deleted_time,
                    });
                }
                else {
                    setResolved({ kind: 'unknown', title: file });
                }
            }
            catch (_a) {
                if (!cancelled)
                    setResolved({ kind: 'unknown', title: file });
            }
        })();
        return () => { cancelled = true; };
    }, [file, refetchCount]);
    return { resolved, refetch: () => setRefetchCount(c => c + 1) };
};
const FileNode = ({ data, selected }) => {
    var _a, _b, _c, _d;
    const ctx = (0, WhiteboardContext_1.useWhiteboardContext)();
    const node = data.canvasNode;
    const onWheel = (0, useCardWheel_1.default)();
    const onDoubleClick = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        ctx.onOpenRef(node.file);
    }, [ctx, node.file]);
    const { resolved, refetch } = useResolvedRef(node.file);
    const isInternal = (0, resolveRef_1.isInternalRef)(node.file);
    const url = isInternal
        ? resourceUrlFor((_a = resolved === null || resolved === void 0 ? void 0 : resolved.resource) !== null && _a !== void 0 ? _a : null, ctx.resourceDirectory)
        : (/^(https?:|file:)\/\//i.test(node.file) ? node.file : null);
    const mime = (_b = resolved === null || resolved === void 0 ? void 0 : resolved.resource) === null || _b === void 0 ? void 0 : _b.mime;
    const isImage = isInternal
        ? !!(mime === null || mime === void 0 ? void 0 : mime.startsWith('image/'))
        : /\.(png|jpe?g|gif|webp|svg|bmp)(\?|$|#)/i.test(node.file);
    const [noteHtml, setNoteHtml] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        if ((resolved === null || resolved === void 0 ? void 0 : resolved.kind) !== 'note' || !resolved.body) {
            setNoteHtml('');
            return undefined;
        }
        void (async () => {
            var _a;
            try {
                const linkedResources = await (0, attachedResources_1.default)(resolved.body);
                if (cancelled)
                    return;
                const result = await ctx.markupToHtml(renderer_1.MarkupLanguage.Markdown, resolved.body, {
                    resourceInfos: linkedResources,
                });
                if (!cancelled)
                    setNoteHtml((0, stripUnsafeStyles_1.default)((_a = result === null || result === void 0 ? void 0 : result.html) !== null && _a !== void 0 ? _a : ''));
            }
            catch (_b) {
                if (!cancelled)
                    setNoteHtml('');
            }
        })();
        return () => { cancelled = true; };
    }, [resolved, ctx]);
    const linkedNoteId = (resolved === null || resolved === void 0 ? void 0 : resolved.kind) === 'note' ? (0, resolveRef_1.resolveFileRef)(node.file).id : null;
    const linkedNoteUserUpdatedTime = (resolved === null || resolved === void 0 ? void 0 : resolved.kind) === 'note' ? resolved.userUpdatedTime : undefined;
    const linkedNoteDeletedTime = (resolved === null || resolved === void 0 ? void 0 : resolved.kind) === 'note' ? resolved.deletedTime : undefined;
    const savingRef = (0, react_1.useRef)(false);
    const onLinkedNoteBodyChange = (0, react_1.useCallback)(async (newBody) => {
        if (!linkedNoteId)
            return;
        if (linkedNoteDeletedTime) {
            logger.info(`Ignoring checkbox toggle on deleted note: ${linkedNoteId}`);
            return;
        }
        if (savingRef.current) {
            logger.info(`Dropped concurrent toggle on ${linkedNoteId} — a save is in flight`);
            return;
        }
        savingRef.current = true;
        try {
            await Note_1.default.save(Object.assign({ id: linkedNoteId, body: newBody }, (linkedNoteUserUpdatedTime ? { user_updated_time: linkedNoteUserUpdatedTime } : {})), { changeSource: ItemChange_1.default.SOURCE_UNSPECIFIED });
            refetch();
        }
        catch (error) {
            logger.warn(`Could not save linked note ${linkedNoteId}:`, error);
            refetch();
        }
        finally {
            savingRef.current = false;
        }
    }, [linkedNoteId, linkedNoteUserUpdatedTime, linkedNoteDeletedTime, refetch]);
    const checkboxRef = (0, useCheckboxToggle_1.default)({
        body: (resolved === null || resolved === void 0 ? void 0 : resolved.kind) === 'note' ? ((_c = resolved.body) !== null && _c !== void 0 ? _c : '') : '',
        onChange: onLinkedNoteBodyChange,
    });
    const isInTrash = !!(resolved === null || resolved === void 0 ? void 0 : resolved.deletedTime);
    const renderContent = () => {
        var _a;
        if (url && isImage && !isInTrash) {
            return React.createElement("img", { className: "image", src: url, alt: (_a = resolved === null || resolved === void 0 ? void 0 : resolved.title) !== null && _a !== void 0 ? _a : '' });
        }
        if ((resolved === null || resolved === void 0 ? void 0 : resolved.kind) === 'note' && !isInTrash) {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "header -note-title", title: resolved.title }, resolved.title),
                React.createElement("div", { ref: checkboxRef, className: "wb-card-md body", dangerouslySetInnerHTML: { __html: noteHtml } })));
        }
        if ((resolved === null || resolved === void 0 ? void 0 : resolved.kind) === 'resource' && !isInTrash) {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "header" }, (0, locale_1._)('File')),
                React.createElement("div", { className: "body" }, resolved.title)));
        }
        if (isInternal && ((resolved === null || resolved === void 0 ? void 0 : resolved.kind) === 'unknown' || isInTrash)) {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "header" }, (0, locale_1._)('Linked item')),
                React.createElement("div", { className: "body -deleted" }, (0, locale_1._)('This linked item has been deleted.'))));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "header" }, isInternal ? (0, locale_1._)('Linked item') : (0, locale_1._)('File')),
            React.createElement("div", { className: "body" }, resolved === null && isInternal ? (0, locale_1._)('Loading…') : node.file)));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(react_2.NodeResizer, { minWidth: 80, minHeight: 40, isVisible: !!selected }),
        handlePositions_1.default.map(({ id: hid, position }) => (React.createElement(react_2.Handle, { key: hid, type: "source", position: position, id: hid }))),
        React.createElement("div", { className: `whiteboard-node ${selected ? '-selected' : ''}`, onDoubleClick: onDoubleClick, onWheelCapture: onWheel, style: {
                borderColor: (_d = (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'stroke')) !== null && _d !== void 0 ? _d : (selected ? '#4a90e2' : undefined),
                backgroundColor: (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'fill'),
            } }, renderContent())));
};
exports.default = FileNode;
//# sourceMappingURL=FileNode.js.map