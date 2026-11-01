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
exports.PublishFolderDialog = PublishFolderDialog;
const React = __importStar(require("react"));
const react_1 = require("react");
const JoplinServerApi_1 = __importDefault(require("@joplin/lib/JoplinServerApi"));
const locale_1 = require("@joplin/lib/locale");
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const DialogButtonRow_1 = __importDefault(require("./DialogButtonRow"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogTitle_1 = __importDefault(require("./DialogTitle"));
const ShareService_1 = __importDefault(require("@joplin/lib/services/share/ShareService"));
const reducer_1 = require("@joplin/lib/services/share/reducer");
const react_redux_1 = require("react-redux");
const useEncryptionWarningMessage_1 = __importDefault(require("@joplin/lib/components/shared/ShareNoteDialog/useEncryptionWarningMessage"));
const electron_1 = require("electron");
const useOnPublishFolderLinkClick_1 = __importDefault(require("@joplin/lib/components/shared/PublishFolderDialog/useOnPublishFolderLinkClick"));
const useShareStatusMessage_1 = __importDefault(require("@joplin/lib/components/shared/ShareNoteDialog/useShareStatusMessage"));
const types_1 = require("@joplin/lib/components/shared/ShareNoteDialog/types");
const Button_1 = __importDefault(require("./Button/Button"));
function PublishFolderDialog(props) {
    const [folder, setFolder] = (0, react_1.useState)(null);
    const [noteCount, setNoteCount] = (0, react_1.useState)(0);
    const [publishFolderStatus, setPublishFolderStatus] = (0, react_1.useState)(types_1.SharingStatus.Unknown);
    const [isUnpublishing, setIsUnpublishing] = (0, react_1.useState)(false);
    const encryptionWarning = (0, useEncryptionWarningMessage_1.default)();
    const publishedShare = (0, react_1.useMemo)(() => {
        return props.shares.find(share => share.type === reducer_1.ShareType.PublishedFolder && share.folder_id === props.folderId) || null;
    }, [props.folderId, props.shares]);
    const loadData = (0, react_1.useCallback)(async () => {
        const loadedFolder = await Folder_1.default.load(props.folderId);
        const childFolderIds = await Folder_1.default.childrenIds(props.folderId);
        const allFolderIds = [props.folderId, ...childFolderIds];
        let loadedNoteCount = 0;
        for (const folderId of allFolderIds) {
            loadedNoteCount += (await Folder_1.default.noteIds(folderId)).length;
        }
        setFolder(loadedFolder);
        setNoteCount(loadedNoteCount);
    }, [props.folderId]);
    (0, react_1.useEffect)(() => {
        void ShareService_1.default.instance().refreshShares();
        void loadData();
    }, [loadData]);
    const onShareUrlReady = (0, react_1.useCallback)((url) => {
        electron_1.clipboard.writeText(url);
    }, []);
    const publishFolderLinkButton_click = (0, useOnPublishFolderLinkClick_1.default)({
        folderId: props.folderId,
        publishedShare,
        setPublishFolderStatus,
        onShareUrlReady,
    });
    const onDialogButtonClick = (0, react_1.useCallback)((_event) => {
        props.onClose();
    }, [props]);
    const onUnpublishFolderClick = (0, react_1.useCallback)(async () => {
        setIsUnpublishing(true);
        try {
            await ShareService_1.default.instance().unpublishFolder(props.folderId);
        }
        catch (error) {
            void shim_1.default.showErrorDialog(JoplinServerApi_1.default.connectionErrorMessage(error));
        }
        finally {
            setIsUnpublishing(false);
        }
    }, [props.folderId]);
    const statusMessage = (0, useShareStatusMessage_1.default)({ sharesState: publishFolderStatus, noteCount: 1 });
    return (React.createElement(Dialog_1.default, null,
        React.createElement("div", { className: "form share-note-dialog" },
            React.createElement(DialogTitle_1.default, { title: (0, locale_1._)('Publish Notebook') }),
            React.createElement("div", { className: "shared-note-list-item" },
                React.createElement("div", { className: "title" },
                    React.createElement("div", { className: "folder-info" },
                        React.createElement("p", null, (0, locale_1._)('Notebook: %s', folder ? folder.title : '...')),
                        React.createElement("p", null, (0, locale_1._)('Status: %s', publishedShare ? (0, locale_1._)('Published') : (0, locale_1._)('Not published'))),
                        React.createElement("p", null, (0, locale_1._n)('%d note in notebook', '%d notes in notebook', noteCount, noteCount)))),
                publishedShare && (React.createElement(Button_1.default, { disabled: isUnpublishing, tooltip: (0, locale_1._)('Unpublish notebook'), iconName: "fas fa-share-alt", onClick: onUnpublishFolderClick }))),
            React.createElement("button", { disabled: isUnpublishing || !folder || [types_1.SharingStatus.Creating, types_1.SharingStatus.Synchronizing].indexOf(publishFolderStatus) >= 0, className: "share", onClick: publishFolderLinkButton_click }, publishedShare ? (0, locale_1._)('Copy Shareable Link') : (0, locale_1._)('Publish notebook')),
            React.createElement("div", { className: "message" }, statusMessage),
            encryptionWarning && React.createElement("div", { className: "message" },
                encryptionWarning,
                React.createElement("hr", null)),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: onDialogButtonClick, okButtonShow: false, cancelButtonLabel: (0, locale_1._)('Close') }))));
}
const mapStateToProps = (state) => {
    return {
        shares: state.shareService.shares,
        folders: state.folders,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(PublishFolderDialog);
//# sourceMappingURL=PublishFolderDialog.js.map