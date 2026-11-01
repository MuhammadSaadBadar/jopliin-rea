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
const PromptDialog_1 = __importDefault(require("../PromptDialog"));
const ShareFolderDialog_1 = __importDefault(require("../ShareFolderDialog/ShareFolderDialog"));
const NotePropertiesDialog_1 = __importDefault(require("../NotePropertiesDialog"));
const NoteContentPropertiesDialog_1 = __importDefault(require("../NoteContentPropertiesDialog"));
const ShareNoteDialog_1 = __importDefault(require("../ShareNoteDialog"));
const PublishFolderDialog_1 = __importDefault(require("../PublishFolderDialog"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const ModalMessageOverlay_1 = __importDefault(require("./ModalMessageOverlay"));
const reducer_1 = require("@joplin/lib/reducer");
const dialogs_1 = __importDefault(require("../dialogs"));
const useDocument_1 = __importDefault(require("@joplin/lib/hooks/dom/useDocument"));
const useWindowCommands_1 = __importDefault(require("./utils/useWindowCommands"));
const PluginDialogs_1 = __importDefault(require("./PluginDialogs"));
const useSyncDialogState_1 = __importDefault(require("./utils/useSyncDialogState"));
const AppDialogs_1 = __importDefault(require("./AppDialogs"));
const PopupNotificationList_1 = __importDefault(require("../PopupNotification/PopupNotificationList"));
const PluginManager_1 = __importDefault(require("@joplin/lib/services/PluginManager"));
const defaultDialogState = {
    noteContentPropertiesDialogOptions: {
        visible: false,
    },
    shareNoteDialogOptions: {
        visible: false,
    },
    notePropertiesDialogOptions: {
        visible: false,
    },
    shareFolderDialogOptions: {
        visible: false,
    },
    publishFolderDialogOptions: {
        visible: false,
    },
    promptOptions: null,
};
// Certain dialog libraries need a reference to the active window:
const useSyncActiveWindow = (containerWindow) => {
    (0, react_1.useEffect)(() => {
        if (!containerWindow)
            return () => { };
        const onFocusCallback = () => {
            dialogs_1.default.setActiveWindow(containerWindow);
        };
        if (containerWindow.document.hasFocus()) {
            onFocusCallback();
        }
        containerWindow.addEventListener('focus', onFocusCallback);
        return () => {
            containerWindow.removeEventListener('focus', onFocusCallback);
        };
    }, [containerWindow]);
};
const WindowCommandsAndDialogs = props => {
    const [referenceElement, setReferenceElement] = (0, react_1.useState)(null);
    const containerDocument = (0, useDocument_1.default)(referenceElement);
    const documentRef = (0, react_1.useRef)(null);
    documentRef.current = containerDocument;
    const [dialogState, setDialogState] = (0, react_1.useState)(defaultDialogState);
    (0, useSyncDialogState_1.default)(dialogState, props.dispatch);
    (0, useWindowCommands_1.default)({
        documentRef,
        customCss: props.customCss,
        plugins: props.plugins,
        editorNoteStatuses: props.editorNoteStatuses,
        setDialogState,
    });
    useSyncActiveWindow(containerDocument === null || containerDocument === void 0 ? void 0 : containerDocument.defaultView);
    const onDialogHideCallbacks = (0, react_1.useMemo)(() => {
        const result = {};
        for (const key of Object.keys(defaultDialogState)) {
            result[key] = () => {
                setDialogState(dialogState => {
                    return Object.assign(Object.assign({}, dialogState), { [key]: { visible: false } });
                });
            };
        }
        return result;
    }, []);
    const promptOnClose = (0, react_1.useCallback)((answer, buttonType) => {
        dialogState.promptOptions.onClose(answer, buttonType);
    }, [dialogState.promptOptions]);
    const dialogInfo = PluginManager_1.default.instance().pluginDialogToShow(props.pluginsLegacy);
    const Dialog = dialogInfo === null || dialogInfo === void 0 ? void 0 : dialogInfo.Dialog;
    const pluginDialog = !dialogInfo || !Dialog ? null : React.createElement(Dialog, Object.assign({}, dialogInfo.props));
    const { noteContentPropertiesDialogOptions, notePropertiesDialogOptions, shareNoteDialogOptions, shareFolderDialogOptions, publishFolderDialogOptions, promptOptions, } = dialogState;
    return React.createElement(React.Fragment, null,
        React.createElement("div", { ref: setReferenceElement }),
        pluginDialog,
        props.modalMessage !== null ? React.createElement(ModalMessageOverlay_1.default, { message: props.modalMessage }) : null,
        React.createElement(PluginDialogs_1.default, { themeId: props.themeId, visibleDialogs: props.visibleDialogs, pluginHtmlContents: props.pluginHtmlContents, plugins: props.plugins }),
        React.createElement(AppDialogs_1.default, { appDialogStates: props.appDialogStates, themeId: props.themeId, dispatch: props.dispatch }),
        noteContentPropertiesDialogOptions.visible && (React.createElement(NoteContentPropertiesDialog_1.default, { markupLanguage: noteContentPropertiesDialogOptions.markupLanguage, themeId: props.themeId, onClose: onDialogHideCallbacks.noteContentPropertiesDialogOptions, text: noteContentPropertiesDialogOptions.text })),
        notePropertiesDialogOptions.visible && (React.createElement(NotePropertiesDialog_1.default, { themeId: props.themeId, noteId: notePropertiesDialogOptions.noteId, onClose: onDialogHideCallbacks.notePropertiesDialogOptions, onRevisionLinkClick: notePropertiesDialogOptions.onRevisionLinkClick })),
        shareNoteDialogOptions.visible && (React.createElement(ShareNoteDialog_1.default, { themeId: props.themeId, noteIds: shareNoteDialogOptions.noteIds, onClose: onDialogHideCallbacks.shareNoteDialogOptions })),
        shareFolderDialogOptions.visible && (React.createElement(ShareFolderDialog_1.default, { themeId: props.themeId, folderId: shareFolderDialogOptions.folderId, onClose: onDialogHideCallbacks.shareFolderDialogOptions })),
        publishFolderDialogOptions.visible && (React.createElement(PublishFolderDialog_1.default, { themeId: props.themeId, folderId: publishFolderDialogOptions.folderId, onClose: onDialogHideCallbacks.publishFolderDialogOptions })),
        React.createElement(PromptDialog_1.default, { autocomplete: promptOptions && 'autocomplete' in promptOptions ? promptOptions.autocomplete : null, defaultValue: promptOptions && promptOptions.value ? promptOptions.value : '', themeId: props.themeId, onClose: promptOnClose, label: promptOptions ? promptOptions.label : '', description: promptOptions ? promptOptions.description : null, visible: !!promptOptions, buttons: promptOptions && 'buttons' in promptOptions ? promptOptions.buttons : null, inputType: promptOptions && 'inputType' in promptOptions ? promptOptions.inputType : null }),
        React.createElement(PopupNotificationList_1.default, null));
};
exports.default = (0, react_redux_1.connect)((state, ownProps) => {
    const windowState = reducer_1.stateUtils.windowStateById(state, ownProps.windowId);
    return {
        themeId: state.settings.theme,
        plugins: state.pluginService.plugins,
        visibleDialogs: windowState.visibleDialogs,
        appDialogStates: windowState.dialogs,
        pluginHtmlContents: state.pluginService.pluginHtmlContents,
        customCss: state.customViewerCss,
        editorNoteStatuses: state.editorNoteStatuses,
        pluginsLegacy: state.pluginsLegacy,
        modalMessage: state.modalOverlayMessage,
    };
})(WindowCommandsAndDialogs);
//# sourceMappingURL=WindowCommandsAndDialogs.js.map