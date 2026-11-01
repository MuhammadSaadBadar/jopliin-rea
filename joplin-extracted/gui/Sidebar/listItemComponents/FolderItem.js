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
const types_1 = require("@joplin/lib/services/database/types");
const ExpandLink_1 = __importDefault(require("./ExpandLink"));
const styles_1 = require("../styles");
const FolderIconBox_1 = __importDefault(require("../../FolderIconBox"));
const trash_1 = require("@joplin/lib/services/trash");
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
const locale_1 = require("@joplin/lib/locale");
const NoteCount_1 = __importDefault(require("./NoteCount"));
const ListItemWrapper_1 = __importDefault(require("./ListItemWrapper"));
const react_1 = require("react");
const renderFolderIcon = (folderIcon) => {
    if (!folderIcon) {
        const defaultFolderIcon = {
            dataUrl: '',
            emoji: '',
            name: 'far fa-folder',
            type: types_1.FolderIconType.FontAwesome,
        };
        return React.createElement("div", { style: { marginRight: 7, display: 'flex' } },
            React.createElement(FolderIconBox_1.default, { opacity: 0.7, folderIcon: defaultFolderIcon }));
    }
    return React.createElement("div", { style: { marginRight: 7, display: 'flex' } },
        React.createElement(FolderIconBox_1.default, { folderIcon: folderIcon }));
};
function FolderItem(props) {
    const { hasChildren, showFolderIcon, isExpanded, parentId, depth, selectionState, folderId, folderTitle, folderIcon, noteCount, onFolderDragStart_, onFolderDragOver_, onFolderDrop_, itemContextMenu, folderItem_click, onFolderToggleClick_, shareId, isPublished } = props;
    const shareTitle = (0, locale_1._)('Shared');
    const shareIcon = shareId && !parentId ? React.createElement(styles_1.StyledShareIcon, { "aria-label": shareTitle, title: shareTitle, className: "fas fa-share-alt" }) : null;
    const publishedTitle = (0, locale_1._)('Published');
    const publishedIcon = isPublished ? React.createElement(styles_1.StyledShareIcon, { "aria-label": publishedTitle, title: publishedTitle, className: "fas fa-globe" }) : null;
    const draggable = ![(0, trash_1.getTrashFolderId)(), Folder_1.default.conflictFolderId()].includes(folderId);
    const doRenderFolderIcon = () => {
        if (folderId === (0, trash_1.getTrashFolderId)()) {
            return renderFolderIcon((0, trash_1.getTrashFolderIcon)(types_1.FolderIconType.FontAwesome));
        }
        if (!showFolderIcon)
            return null;
        return renderFolderIcon(folderIcon);
    };
    const titleId = (0, react_1.useId)();
    return (React.createElement(ListItemWrapper_1.default, { containerRef: props.anchorRef, 
        // Folders are contained within the "Notebooks" section (which has depth 0):
        depth: depth + 1, selectionState: selectionState, itemIndex: props.index, itemCount: props.itemCount, expanded: hasChildren ? props.isExpanded : undefined, className: `list-item-container list-item-depth-${depth} ${selectionState.selected ? 'selected' : ''}`, highlightOnHover: true, onDragStart: onFolderDragStart_, onDragOver: onFolderDragOver_, onDrop: onFolderDrop_, onContextMenu: itemContextMenu, draggable: draggable, "data-folder-id": folderId, "data-id": folderId, "data-type": BaseModel_1.ModelType.Folder, "aria-labelledby": titleId },
        React.createElement(styles_1.StyledListItemAnchor, { className: "list-item", id: titleId, isConflictFolder: folderId === Folder_1.default.conflictFolderId(), selected: selectionState.selected, shareId: shareId, isPublished: isPublished, "data-folder-id": folderId, onDoubleClick: onFolderToggleClick_, onClick: (event) => {
                folderItem_click({
                    id: folderId, type: BaseModel_1.ModelType.Folder, event,
                });
            } },
            doRenderFolderIcon(),
            React.createElement(styles_1.StyledSpanFix, { className: "title" }, folderTitle),
            publishedIcon,
            shareIcon,
            " ",
            React.createElement(NoteCount_1.default, { count: noteCount })),
        React.createElement(ExpandLink_1.default
        // The ExpandLink is included after the title so that the screen reader reads the
        // title first.
        , { 
            // The ExpandLink is included after the title so that the screen reader reads the
            // title first.
            className: 'toggle', hasChildren: hasChildren, folderId: folderId, onClick: onFolderToggleClick_, isExpanded: isExpanded })));
}
exports.default = FolderItem;
//# sourceMappingURL=FolderItem.js.map