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
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
const NoteTextViewer_1 = __importDefault(require("./NoteTextViewer"));
const HelpButton_1 = __importDefault(require("./HelpButton"));
const BaseModel_1 = __importDefault(require("@joplin/lib/BaseModel"));
const Revision_1 = __importDefault(require("@joplin/lib/models/Revision"));
const RevisionService_1 = __importDefault(require("@joplin/lib/services/RevisionService"));
const renderer_1 = require("@joplin/renderer");
const time_1 = __importDefault(require("@joplin/lib/time"));
const bridge_1 = __importDefault(require("../services/bridge"));
const urlUtils = __importStar(require("@joplin/lib/urlUtils"));
const ReactTooltip = require('react-tooltip');
const react_redux_1 = require("react-redux");
const note_screen_shared_1 = __importDefault(require("@joplin/lib/components/shared/note-screen-shared"));
const getHelpMessage_1 = __importDefault(require("@joplin/lib/components/shared/NoteRevisionViewer/getHelpMessage"));
const shim_1 = __importStar(require("@joplin/lib/shim"));
const react_2 = require("react");
const useQueuedAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useQueuedAsyncEffect"));
const useMarkupToHtml_1 = __importDefault(require("./hooks/useMarkupToHtml"));
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const useDeleteHistoryClick_1 = __importDefault(require("@joplin/lib/components/shared/NoteRevisionViewer/useDeleteHistoryClick"));
const types_1 = require("@joplin/renderer/types");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const useNoteContent = (viewerRef, currentRevId, revisions, themeId, customCss, scrollbarSize, fontFamily, showNoteLinkIcon) => {
    const [note, setNote] = (0, react_2.useState)(null);
    const markupToHtml = (0, useMarkupToHtml_1.default)({
        themeId,
        customCss,
        plugins: {},
        whiteBackgroundNoteRendering: false,
        scrollbarSize,
        baseFontFamily: fontFamily,
    });
    (0, useAsyncEffect_1.default)(async (event) => {
        if (!revisions.length || !currentRevId) {
            setNote(null);
        }
        else {
            const revIndex = BaseModel_1.default.modelIndexById(revisions, currentRevId);
            const note = await RevisionService_1.default.instance().revisionNote(revisions, revIndex);
            if (!note || event.cancelled)
                return;
            setNote(note);
        }
    }, [revisions, currentRevId, themeId, customCss, viewerRef]);
    (0, useQueuedAsyncEffect_1.default)(async () => {
        var _a, _b;
        const noteBody = (_a = note === null || note === void 0 ? void 0 : note.body) !== null && _a !== void 0 ? _a : (0, locale_1._)('This note has no history');
        const markupLanguage = (_b = note === null || note === void 0 ? void 0 : note.markup_language) !== null && _b !== void 0 ? _b : renderer_1.MarkupLanguage.Markdown;
        const result = await markupToHtml(markupLanguage, noteBody, {
            resources: await note_screen_shared_1.default.attachedResources(noteBody),
            whiteBackgroundNoteRendering: markupLanguage === renderer_1.MarkupLanguage.Html,
            globalSettings: (0, types_1.getGlobalSettings)(Setting_1.default),
            showNoteLinkIcon,
        });
        viewerRef.current.setHtml(result.html, {
            pluginAssets: result.pluginAssets,
        });
    }, [note, viewerRef, markupToHtml, showNoteLinkIcon]);
    return note;
};
const NoteRevisionViewerComponent = ({ themeId, noteId, onBack, customCss, scrollbarSize, fontFamily, showNoteLinkIcon }) => {
    var _a;
    const helpButton_onClick = (0, react_2.useCallback)(() => { }, []);
    const viewerRef = (0, react_2.useRef)(null);
    const revisionListRef = (0, react_2.useRef)(null);
    const [revisions, setRevisions] = (0, react_2.useState)([]);
    const [currentRevId, setCurrentRevId] = (0, react_2.useState)('');
    const [restoring, setRestoring] = (0, react_2.useState)(false);
    const [deleting, setDeleting] = (0, react_2.useState)(false);
    const note = useNoteContent(viewerRef, currentRevId, revisions, themeId, customCss, scrollbarSize, fontFamily, showNoteLinkIcon);
    const viewer_domReady = (0, react_2.useCallback)(async () => {
        // this.viewerRef_.current.openDevTools();
        const revisions = await Revision_1.default.allByType(BaseModel_1.default.TYPE_NOTE, noteId);
        setRevisions(revisions);
        setCurrentRevId(revisions.length ? revisions[revisions.length - 1].id : '');
    }, [noteId]);
    const importButton_onClick = (0, react_2.useCallback)(async () => {
        if (!note)
            return;
        setRestoring(true);
        await RevisionService_1.default.instance().importRevisionNote(note);
        setRestoring(false);
        await shim_1.default.showMessageBox(RevisionService_1.default.instance().restoreSuccessMessage(note), { type: shim_1.MessageBoxType.Info });
    }, [note]);
    const resetScreenState = (0, react_2.useCallback)(() => {
        setRevisions([]);
        setCurrentRevId(null);
    }, []);
    const deleteHistoryButton_onClick = (0, useDeleteHistoryClick_1.default)({
        noteId: note === null || note === void 0 ? void 0 : note.id,
        setDeleting,
        resetScreenState,
    });
    const backButton_click = (0, react_2.useCallback)(() => {
        if (onBack)
            onBack();
    }, [onBack]);
    const revisionList_onChange = (0, react_2.useCallback)((event) => {
        const value = event.target.value;
        if (!value) {
            if (onBack)
                onBack();
        }
        else {
            setCurrentRevId(value);
        }
    }, [onBack]);
    const webview_ipcMessage = (0, react_2.useCallback)(async (event) => {
        // For the revision view, we only support a minimal subset of the IPC messages.
        // For example, we don't need interactive checkboxes or sync between viewer and editor view.
        // We try to get most links work though, except for internal (joplin://) links.
        const msg = event.channel ? event.channel : '';
        // const args = event.args;
        // if (msg !== 'percentScroll') console.info(`Got ipc-message: ${msg}`, args);
        try {
            if (msg.indexOf('checkboxclick:') === 0) {
                // Revision previews are read-only. Ignore checkbox toggle IPC messages so they
                // don't fall through to URL handling (`checkboxclick:` looks like a protocol).
            }
            else if (msg.indexOf('joplin://') === 0) {
                throw new Error((0, locale_1._)('Unsupported link or message: %s', msg));
            }
            else if (urlUtils.urlProtocol(msg)) {
                await (0, bridge_1.default)().openExternal(msg);
            }
            else if (msg.indexOf('#') === 0) {
                // This is an internal anchor, which is handled by the WebView so skip this case
            }
            else {
                console.warn(`Unsupported message in revision view: ${msg}`);
            }
        }
        catch (error) {
            console.warn(error);
            (0, bridge_1.default)().showErrorMessageBox(error.message);
        }
    }, []);
    const theme = (0, theme_1.themeStyle)(themeId);
    const revisionListItems = [];
    const revs = revisions.slice().reverse();
    for (let i = 0; i < revs.length; i++) {
        const rev = revs[i];
        const stats = Revision_1.default.revisionPatchStatsText(rev);
        revisionListItems.push(React.createElement("option", { key: rev.id, value: rev.id }, `${time_1.default.formatMsToLocal(rev.item_updated_time)} (${stats})`));
    }
    const restoreButtonTitle = (0, locale_1._)('Restore');
    const deleteHistoryButtonTitle = (0, locale_1._)('Delete history');
    const helpMessage = (0, getHelpMessage_1.default)(restoreButtonTitle);
    const titleInput = (React.createElement("div", { className: 'revision-viewer-title' },
        React.createElement("button", { onClick: backButton_click, style: Object.assign(Object.assign({}, theme.buttonStyle), { marginRight: 10, height: theme.inputStyle.height }) },
            React.createElement("i", { style: theme.buttonIconStyle, className: 'fa fa-chevron-left' }),
            (0, locale_1._)('Back')),
        React.createElement("input", { readOnly: true, type: "text", className: 'title', style: theme.inputStyle, value: (_a = note === null || note === void 0 ? void 0 : note.title) !== null && _a !== void 0 ? _a : '' }),
        React.createElement("select", { disabled: !revisions.length, value: currentRevId, className: 'revisions', style: theme.dropdownList, onChange: revisionList_onChange, ref: revisionListRef }, revisionListItems),
        React.createElement("button", { disabled: !revisions.length || restoring, onClick: importButton_onClick, className: 'restore', style: Object.assign(Object.assign({}, theme.buttonStyle), { marginLeft: 10, height: theme.inputStyle.height }) }, restoreButtonTitle),
        React.createElement("button", { disabled: !revisions.length || deleting, onClick: deleteHistoryButton_onClick, className: 'deleteHistory', style: Object.assign(Object.assign({}, theme.buttonStyle), { marginLeft: 10, height: theme.inputStyle.height }) }, deleteHistoryButtonTitle),
        React.createElement(HelpButton_1.default, { tip: helpMessage, id: "noteRevisionHelpButton", onClick: helpButton_onClick })));
    const viewer = React.createElement(NoteTextViewer_1.default, { themeId: themeId, viewerStyle: { display: 'flex', flex: 1, borderLeft: 'none' }, ref: viewerRef, onDomReady: viewer_domReady, onIpcMessage: webview_ipcMessage });
    (0, react_1.useEffect)(() => {
        // We need to force focus here because otherwise the focus is lost and goes back
        // to the start of the document. See https://github.com/laurent22/joplin/pull/11769
        (0, focusHandler_1.focus)('NoteRevisionViewer', revisionListRef.current);
    }, [revisionListRef, revisions]);
    return (React.createElement("div", { className: 'revision-viewer-root' },
        titleInput,
        viewer,
        React.createElement(ReactTooltip, { place: "bottom", delayShow: 300, className: "help-tooltip" })));
};
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
        scrollbarSize: state.settings['style.scrollbarSize'],
        fontFamily: state.settings['style.viewer.fontFamily'],
        showNoteLinkIcon: state.settings['notes.showNoteLinkIcon'],
    };
};
const NoteRevisionViewer = (0, react_redux_1.connect)(mapStateToProps)(NoteRevisionViewerComponent);
exports.default = NoteRevisionViewer;
//# sourceMappingURL=NoteRevisionViewer.js.map