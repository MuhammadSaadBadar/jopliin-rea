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
exports.default = default_1;
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const DialogButtonRow_1 = __importDefault(require("../DialogButtonRow"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogTitle_1 = __importDefault(require("../DialogTitle"));
const StyledInput_1 = __importDefault(require("../style/StyledInput"));
const IconSelector_1 = require("./IconSelector");
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const types_1 = require("@joplin/lib/services/database/types");
const Button_1 = __importDefault(require("../Button/Button"));
const bridge_1 = __importDefault(require("../../services/bridge"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const FolderIconBox_1 = __importDefault(require("../FolderIconBox"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
function default_1(props) {
    const [folderTitle, setFolderTitle] = (0, react_1.useState)('');
    const [folderIcon, setFolderIcon] = (0, react_1.useState)();
    const titleInputRef = (0, react_1.useRef)(null);
    const isNew = !props.folderId;
    (0, useAsyncEffect_1.default)(async (event) => {
        if (isNew)
            return;
        const folder = await Folder_1.default.load(props.folderId);
        if (event.cancelled)
            return;
        setFolderTitle(folder.title);
        setFolderIcon(Folder_1.default.unserializeIcon(folder.icon));
    }, [props.folderId, isNew]);
    const onClose = (0, react_1.useCallback)(() => {
        props.dispatch({
            type: 'DIALOG_CLOSE',
            name: 'editFolder',
        });
    }, [props.dispatch]);
    (0, react_1.useEffect)(() => {
        if (!titleInputRef.current)
            return;
        (0, focusHandler_1.focus)('Dialog::titleInputRef', titleInputRef.current);
        setTimeout(() => {
            if (titleInputRef.current) {
                titleInputRef.current.select();
            }
        }, 100);
    }, []);
    const onButtonRowClick = (0, react_1.useCallback)(async (event) => {
        if (event.buttonName === 'cancel') {
            onClose();
            return;
        }
        if (event.buttonName === 'ok') {
            const folder = {
                title: folderTitle,
                icon: Folder_1.default.serializeIcon(folderIcon),
            };
            if (!isNew)
                folder.id = props.folderId;
            if (props.parentId)
                folder.parent_id = props.parentId;
            try {
                const savedFolder = await Folder_1.default.save(folder, { userSideValidation: true });
                onClose();
                props.dispatch({
                    type: 'FOLDER_SELECT',
                    id: savedFolder.id,
                });
            }
            catch (error) {
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
            return;
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [onClose, folderTitle, folderIcon, props.folderId, props.parentId]);
    const onFolderTitleChange = (0, react_1.useCallback)((event) => {
        setFolderTitle(event.target.value);
    }, []);
    const onFolderIconChange = (0, react_1.useCallback)((event) => {
        setFolderIcon(event.value);
    }, []);
    const onClearClick = (0, react_1.useCallback)(() => {
        setFolderIcon(null);
    }, []);
    const onBrowseClick = (0, react_1.useCallback)(async () => {
        const filePaths = await (0, bridge_1.default)().showOpenDialog({
            filters: [
                {
                    name: (0, locale_1._)('Images'),
                    extensions: ['jpg', 'jpeg', 'png'],
                },
            ],
        });
        if (filePaths.length !== 1)
            return;
        const filePath = filePaths[0];
        try {
            const dataUrl = await shim_1.default.imageToDataUrl(filePath, 256);
            setFolderIcon(icon => {
                return Object.assign(Object.assign({}, icon), { emoji: '', name: '', type: types_1.FolderIconType.DataUrl, dataUrl });
            });
        }
        catch (error) {
            await (0, bridge_1.default)().showErrorMessageBox(error.message);
        }
    }, []);
    const formTitleInputId = (0, react_1.useId)();
    function renderForm() {
        return (React.createElement("div", null,
            React.createElement("div", { className: "form" },
                React.createElement("div", { className: "form-input-group" },
                    React.createElement("label", { htmlFor: formTitleInputId }, (0, locale_1._)('Title')),
                    React.createElement(StyledInput_1.default, { id: formTitleInputId, type: "text", ref: titleInputRef, value: folderTitle, onChange: onFolderTitleChange })),
                React.createElement("div", { className: "form-input-group" },
                    React.createElement("label", null, (0, locale_1._)('Icon')),
                    React.createElement("div", { className: "icon-selector-row" },
                        folderIcon && React.createElement("div", { className: "foldericon" },
                            React.createElement(FolderIconBox_1.default, { folderIcon: folderIcon })),
                        React.createElement(IconSelector_1.IconSelector, { title: (0, locale_1._)('Select emoji...'), icon: folderIcon, onChange: onFolderIconChange, themeId: props.themeId }),
                        React.createElement(Button_1.default, { ml: 1, title: (0, locale_1._)('Select file...'), onClick: onBrowseClick }),
                        folderIcon && React.createElement(Button_1.default, { ml: 1, title: (0, locale_1._)('Clear'), onClick: onClearClick }))))));
    }
    function renderContent() {
        return (React.createElement("div", { className: "dialog-content" }, renderForm()));
    }
    const dialogTitle = isNew ? (0, locale_1._)('Create notebook') : (0, locale_1._)('Edit notebook');
    function renderDialogWrapper() {
        return (React.createElement("div", { className: "dialog-root" },
            React.createElement(DialogTitle_1.default, { title: dialogTitle }),
            renderContent(),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: onButtonRowClick })));
    }
    return (React.createElement(Dialog_1.default, { onCancel: onClose, className: "master-password-dialog" }, renderDialogWrapper()));
}
//# sourceMappingURL=Dialog.js.map