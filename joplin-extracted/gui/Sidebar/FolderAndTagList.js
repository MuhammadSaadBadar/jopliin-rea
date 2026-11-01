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
const areAllFoldersCollapsed_1 = __importDefault(require("@joplin/lib/models/utils/areAllFoldersCollapsed"));
const getCanBeCollapsedFolderIds_1 = __importDefault(require("@joplin/lib/models/utils/getCanBeCollapsedFolderIds"));
const react_redux_1 = require("react-redux");
const react_1 = require("react");
const ItemList_1 = __importDefault(require("../ItemList"));
const useElementHeight_1 = __importDefault(require("../hooks/useElementHeight"));
const useSidebarListData_1 = __importDefault(require("./hooks/useSidebarListData"));
const useSelectedSidebarIndexes_1 = __importDefault(require("./hooks/useSelectedSidebarIndexes"));
const useOnSidebarKeyDownHandler_1 = __importDefault(require("./hooks/useOnSidebarKeyDownHandler"));
const useFocusHandler_1 = __importDefault(require("./hooks/useFocusHandler"));
const useOnRenderItem_1 = __importDefault(require("./hooks/useOnRenderItem"));
const useSidebarCommandHandler_1 = __importDefault(require("./hooks/useSidebarCommandHandler"));
const reducer_1 = require("@joplin/lib/reducer");
const useOnRenderListWrapper_1 = __importDefault(require("./hooks/useOnRenderListWrapper"));
const FolderAndTagList = props => {
    const listItems = (0, useSidebarListData_1.default)(props);
    const { selectedIndex, selectedIndexes, updateSelectedIndex } = (0, useSelectedSidebarIndexes_1.default)(Object.assign(Object.assign({}, props), { listItems: listItems }));
    const allFoldersCollapsed = (0, react_1.useMemo)(() => {
        return (0, areAllFoldersCollapsed_1.default)(props.folders, props.collapsedFolderIds);
    }, [props.collapsedFolderIds, props.folders]);
    const hasSubFolders = (0, react_1.useMemo)(() => {
        return (0, getCanBeCollapsedFolderIds_1.default)(props.folders).length > 0;
    }, [props.folders]);
    const listContainerRef = (0, react_1.useRef)(null);
    const onRenderItem = (0, useOnRenderItem_1.default)(Object.assign(Object.assign({}, props), { selectedIndex,
        selectedIndexes,
        listItems, containerRef: listContainerRef }));
    const onKeyEventHandler = (0, useOnSidebarKeyDownHandler_1.default)({
        dispatch: props.dispatch,
        listItems: listItems,
        selectedIndex,
        selectedIndexes,
        updateSelectedIndex,
        collapsedFolderIds: props.collapsedFolderIds,
    });
    const itemListRef = (0, react_1.useRef)(null);
    const { focusSidebar } = (0, useFocusHandler_1.default)({ itemListRef, selectedIndex, listItems });
    (0, useSidebarCommandHandler_1.default)({ focusSidebar });
    const [itemListContainer, setItemListContainer] = (0, react_1.useState)(null);
    listContainerRef.current = itemListContainer;
    const listHeight = (0, useElementHeight_1.default)(itemListContainer);
    const listStyle = (0, react_1.useMemo)(() => ({ height: listHeight }), [listHeight]);
    const onRenderContentWrapper = (0, useOnRenderListWrapper_1.default)({ allFoldersCollapsed, selectedIndex, onKeyDown: onKeyEventHandler, hasSubFolders });
    return (React.createElement("div", { className: 'folder-and-tag-list', ref: setItemListContainer },
        React.createElement(ItemList_1.default, { className: 'items', ref: itemListRef, style: listStyle, items: listItems, itemRenderer: onRenderItem, renderContentWrapper: onRenderContentWrapper, 
            // The selected item is the only item with tabindex=0. Always render it
            // to allow the item list to be focused.
            alwaysRenderSelection: true, selectedIndex: selectedIndex, itemHeight: 30 })));
};
const mapStateToProps = (state) => {
    const mainWindowState = reducer_1.stateUtils.mainWindowState(state);
    return {
        themeId: state.settings.theme,
        tags: state.tags,
        folders: state.folders,
        notesParentType: mainWindowState.notesParentType,
        selectedFolderIds: mainWindowState.selectedFolderIds,
        selectedTagIds: mainWindowState.selectedTagIds,
        selectedFolderId: mainWindowState.selectedFolderId,
        selectedTagId: mainWindowState.selectedTagId,
        collapsedFolderIds: state.collapsedFolderIds,
        selectedSmartFilterId: mainWindowState.selectedSmartFilterId,
        plugins: state.pluginService.plugins,
        shares: state.shareService.shares,
        tagHeaderIsExpanded: state.settings.tagHeaderIsExpanded,
        folderHeaderIsExpanded: state.settings.folderHeaderIsExpanded,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(FolderAndTagList);
//# sourceMappingURL=FolderAndTagList.js.map