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
exports.ShareNoteDialog = ShareNoteDialog;
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const DialogButtonRow_1 = __importDefault(require("./DialogButtonRow"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogTitle_1 = __importDefault(require("./DialogTitle"));
const ShareService_1 = __importDefault(require("@joplin/lib/services/share/ShareService"));
const Button_1 = __importDefault(require("./Button/Button"));
const react_redux_1 = require("react-redux");
const SyncTargetRegistry_1 = __importDefault(require("@joplin/lib/SyncTargetRegistry"));
const useOnShareLinkClick_1 = __importDefault(require("@joplin/lib/components/shared/ShareNoteDialog/useOnShareLinkClick"));
const onUnshareNoteClick_1 = __importDefault(require("@joplin/lib/components/shared/ShareNoteDialog/onUnshareNoteClick"));
const useShareStatusMessage_1 = __importDefault(require("@joplin/lib/components/shared/ShareNoteDialog/useShareStatusMessage"));
const useEncryptionWarningMessage_1 = __importDefault(require("@joplin/lib/components/shared/ShareNoteDialog/useEncryptionWarningMessage"));
const types_1 = require("@joplin/lib/components/shared/ShareNoteDialog/types");
const useIsPublished_1 = __importDefault(require("@joplin/lib/components/shared/ShareNoteDialog/useIsPublished"));
const electron_1 = require("electron");
function ShareNoteDialog(props) {
    const [notes, setNotes] = (0, react_1.useState)([]);
    const [recursiveShare, setRecursiveShare] = (0, react_1.useState)(false);
    const [sharesState, setSharesState] = (0, react_1.useState)(types_1.SharingStatus.Unknown);
    const syncTargetInfo = (0, react_1.useMemo)(() => SyncTargetRegistry_1.default.infoById(props.syncTargetId), [props.syncTargetId]);
    const noteCount = notes.length;
    (0, react_1.useEffect)(() => {
        void ShareService_1.default.instance().refreshShares();
    }, []);
    (0, react_1.useEffect)(() => {
        async function fetchNotes() {
            const result = [];
            for (const noteId of props.noteIds) {
                result.push(await Note_1.default.load(noteId));
            }
            setNotes(result);
        }
        void fetchNotes();
    }, [props.noteIds]);
    const buttonRow_click = () => {
        props.onClose();
    };
    const onCopyLinks = (0, react_1.useCallback)((links) => {
        electron_1.clipboard.writeText(links.join('\n'));
    }, []);
    const shareLinkButton_click = (0, useOnShareLinkClick_1.default)({
        setSharesState,
        onShareUrlsReady: onCopyLinks,
        notes,
        recursiveShare,
    });
    const renderNoteList = (notes) => {
        const noteComps = [];
        for (const note of notes) {
            noteComps.push(React.createElement(NoteItem, { key: note.id, note: note, shares: props.shares }));
        }
        return React.createElement("div", { className: "notes" }, noteComps);
    };
    const statusMessage = (0, useShareStatusMessage_1.default)({ sharesState, noteCount });
    const encryptionWarning = (0, useEncryptionWarningMessage_1.default)();
    function renderEncryptionWarningMessage() {
        if (!encryptionWarning)
            return null;
        return React.createElement("div", { className: "message" },
            encryptionWarning,
            React.createElement("hr", null));
    }
    const onRecursiveShareChange = (0, react_1.useCallback)(() => {
        setRecursiveShare(v => !v);
    }, []);
    const renderRecursiveShareCheckbox = () => {
        if (!syncTargetInfo.supportsRecursiveLinkedNotes)
            return null;
        return (React.createElement("div", { className: "form-input-group form-input-group-checkbox" },
            React.createElement("input", { id: "recursiveShare", name: "recursiveShare", type: "checkbox", checked: !!recursiveShare, onChange: onRecursiveShareChange }),
            " ",
            React.createElement("label", { htmlFor: "recursiveShare" }, (0, locale_1._)('Also publish linked notes'))));
    };
    const renderContent = () => {
        return (React.createElement("div", { className: "form share-note-dialog" },
            React.createElement(DialogTitle_1.default, { title: (0, locale_1._)('Publish Notes') }),
            renderNoteList(notes),
            renderRecursiveShareCheckbox(),
            React.createElement("button", { disabled: [types_1.SharingStatus.Creating, types_1.SharingStatus.Synchronizing].indexOf(sharesState) >= 0, className: "share", onClick: shareLinkButton_click }, (0, locale_1._n)('Copy Shareable Link', 'Copy Shareable Links', noteCount)),
            React.createElement("div", { className: "message" }, statusMessage),
            renderEncryptionWarningMessage(),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: buttonRow_click, okButtonShow: false, cancelButtonLabel: (0, locale_1._)('Close') })));
    };
    return (React.createElement(Dialog_1.default, null, renderContent()));
}
const NoteItem = ({ note, shares }) => {
    const published = (0, useIsPublished_1.default)(note, shares);
    const unshareButton = published && (React.createElement(Button_1.default, { tooltip: (0, locale_1._)('Unpublish note'), iconName: 'fas fa-share-alt', onClick: () => (0, onUnshareNoteClick_1.default)({ noteId: note.id }) }));
    return (React.createElement("div", { className: 'shared-note-list-item' },
        React.createElement("span", { className: 'title' }, note.title),
        unshareButton));
};
const mapStateToProps = (state) => {
    return {
        shares: state.shareService.shares.filter(s => !!s.note_id),
        syncTargetId: state.settings['sync.target'],
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(ShareNoteDialog);
//# sourceMappingURL=ShareNoteDialog.js.map