"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const types_1 = require("../types");
const side_menu_shared_1 = require("@joplin/lib/components/shared/side-menu-shared");
const locale_1 = require("@joplin/lib/locale");
const toggleHeader_1 = __importDefault(require("./utils/toggleHeader"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const Tag_1 = __importDefault(require("@joplin/lib/models/Tag"));
const useSidebarListData = (props) => {
    const tagItems = (0, react_1.useMemo)(() => {
        return (0, side_menu_shared_1.renderTags)(props.tags, (tag) => {
            return {
                kind: types_1.ListItemType.Tag,
                label: Tag_1.default.displayTitle(tag),
                tag,
                key: tag.id,
                depth: 1,
                hasChildren: false,
            };
        });
    }, [props.tags]);
    const folderTree = (0, react_1.useMemo)(() => {
        return (0, side_menu_shared_1.buildFolderTree)(props.folders);
    }, [props.folders]);
    const folderItems = (0, react_1.useMemo)(() => {
        const renderProps = {
            folderTree,
            collapsedFolderIds: props.collapsedFolderIds,
        };
        return (0, side_menu_shared_1.renderFolders)(renderProps, (folder, hasChildren, depth) => {
            return {
                kind: types_1.ListItemType.Folder,
                label: Folder_1.default.displayTitle(folder),
                folder,
                hasChildren,
                // The toplevel headers have depth 1, so the toplevel notebook needs
                // depth 2.
                depth: depth + 1,
                key: folder.id,
            };
        });
    }, [folderTree, props.collapsedFolderIds]);
    return (0, react_1.useMemo)(() => {
        const foldersHeader = {
            kind: types_1.ListItemType.Header,
            label: (0, locale_1._)('Notebooks'),
            iconName: 'icon-notebooks',
            expanded: props.folderHeaderIsExpanded,
            id: types_1.HeaderId.FolderHeader,
            key: types_1.HeaderId.FolderHeader,
            onClick: toggleHeader_1.default,
            extraProps: {
                ['data-folder-id']: '',
            },
            supportsFolderDrop: true,
            depth: 1,
            hasChildren: folderItems.items.length > 0,
        };
        const foldersSectionContent = props.folderHeaderIsExpanded ? [
            { kind: types_1.ListItemType.AllNotes, label: (0, locale_1._)('All notes'), key: 'all-notes', depth: 2, hasChildren: false },
            ...folderItems.items,
            { kind: types_1.ListItemType.Spacer, label: '', key: 'after-folders-spacer', depth: 1, hasChildren: false },
        ] : [];
        const tagsHeader = {
            kind: types_1.ListItemType.Header,
            label: (0, locale_1._)('Tags'),
            iconName: 'icon-tags',
            expanded: props.tagHeaderIsExpanded,
            id: types_1.HeaderId.TagHeader,
            key: types_1.HeaderId.TagHeader,
            onClick: toggleHeader_1.default,
            extraProps: {},
            supportsFolderDrop: false,
            depth: 1,
            hasChildren: tagItems.items.length > 0,
        };
        const tagsSectionContent = props.tagHeaderIsExpanded ? tagItems.items : [];
        const items = [
            foldersHeader,
            ...foldersSectionContent,
            tagsHeader,
            ...tagsSectionContent,
        ];
        return items;
    }, [tagItems, folderItems, props.folderHeaderIsExpanded, props.tagHeaderIsExpanded]);
};
exports.default = useSidebarListData;
//# sourceMappingURL=useSidebarListData.js.map