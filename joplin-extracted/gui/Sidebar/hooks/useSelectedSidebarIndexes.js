"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const types_1 = require("../types");
const side_menu_shared_1 = require("@joplin/lib/components/shared/side-menu-shared");
const reserved_ids_1 = require("@joplin/lib/reserved-ids");
const useSelectedSidebarIndexes = (props) => {
    var _a;
    const isIndexInSelection = (0, react_1.useCallback)((index) => {
        const listItem = props.listItems[index];
        let selected = false;
        if (listItem.kind === types_1.ListItemType.AllNotes) {
            selected = props.selectedSmartFilterId === reserved_ids_1.ALL_NOTES_FILTER_ID && props.notesParentType === 'SmartFilter';
        }
        else if (listItem.kind === types_1.ListItemType.Header || listItem.kind === types_1.ListItemType.Spacer) {
            selected = false;
        }
        else if (listItem.kind === types_1.ListItemType.Folder) {
            selected = (0, side_menu_shared_1.isFolderSelected)(listItem.folder, {
                selectedFolderIds: props.selectedFolderIds,
                notesParentType: props.notesParentType,
            });
        }
        else if (listItem.kind === types_1.ListItemType.Tag) {
            selected = (0, side_menu_shared_1.isTagSelected)(listItem.tag, { selectedTagIds: props.selectedTagIds, notesParentType: props.notesParentType });
        }
        else {
            const exhaustivenessCheck = listItem;
            return exhaustivenessCheck;
        }
        return selected;
    }, [props.listItems, props.selectedFolderIds, props.selectedTagIds, props.selectedSmartFilterId, props.notesParentType]);
    const isIndexPrimarySelected = (0, react_1.useCallback)((index) => {
        const listItem = props.listItems[index];
        if (listItem.kind === types_1.ListItemType.Folder) {
            return (0, side_menu_shared_1.isFolderSelected)(listItem.folder, {
                selectedFolderIds: [props.selectedFolderId],
                notesParentType: props.notesParentType,
            });
        }
        else if (listItem.kind === types_1.ListItemType.Tag) {
            return (0, side_menu_shared_1.isTagSelected)(listItem.tag, { selectedTagIds: [props.selectedTagId], notesParentType: props.notesParentType });
        }
        else {
            return isIndexInSelection(index);
        }
    }, [props.listItems, isIndexInSelection, props.selectedFolderId, props.selectedTagId, props.notesParentType]);
    const appStateSelectedIndexes = (0, react_1.useMemo)(() => {
        const selectedIndexes = [];
        for (let i = 0; i < props.listItems.length; i++) {
            if (isIndexInSelection(i)) {
                selectedIndexes.push(i);
            }
        }
        return selectedIndexes;
    }, [props.listItems, isIndexInSelection]);
    const appStateSelectedIndex = (0, react_1.useMemo)(() => {
        return props.listItems.findIndex((_item, index) => isIndexPrimarySelected(index));
    }, [props.listItems, isIndexPrimarySelected]);
    // The main index of all selected indexes. This is where the focus will go.
    // Ignored if not included in appStateSelectedIndexes.
    const [primarySelectedIndex, setPrimarySelectedIndex] = (0, react_1.useState)(0);
    // Not all list items correspond with selectable Joplin folders/tags, but we want to
    // be able to select them anyway. This is handled with selectedIndexOverride.
    //
    // When selectedIndexOverride >= 0, it corresponds to the index of a selected item with no
    // specific note parent item (e.g. a header).
    const [selectedIndexOverride, setSelectedIndexOverride] = (0, react_1.useState)(-1);
    (0, react_1.useEffect)(() => {
        setSelectedIndexOverride(-1);
        setPrimarySelectedIndex(appStateSelectedIndex);
    }, [appStateSelectedIndex]);
    const updateSelectedIndex = (0, react_1.useCallback)((newIndex, options) => {
        if (newIndex < 0) {
            newIndex = 0;
        }
        else if (newIndex >= props.listItems.length) {
            newIndex = props.listItems.length - 1;
        }
        const newItem = props.listItems[newIndex];
        let newOverrideIndex = -1;
        if (newItem.kind === types_1.ListItemType.AllNotes) {
            props.dispatch({
                type: 'SMART_FILTER_SELECT',
                id: reserved_ids_1.ALL_NOTES_FILTER_ID,
            });
        }
        else if (newItem.kind === types_1.ListItemType.Folder) {
            props.dispatch({
                type: options.extend ? 'FOLDER_SELECT_ADD' : 'FOLDER_SELECT',
                id: newItem.folder.id,
            });
        }
        else if (newItem.kind === types_1.ListItemType.Tag) {
            props.dispatch({
                type: options.extend ? 'TAG_SELECT_ADD' : 'TAG_SELECT',
                id: newItem.tag.id,
            });
        }
        else {
            newOverrideIndex = newIndex;
        }
        setSelectedIndexOverride(newOverrideIndex);
        setPrimarySelectedIndex(newIndex);
    }, [props.listItems, props.dispatch]);
    const selectedIndexes = (0, react_1.useMemo)(() => {
        return selectedIndexOverride === -1 ? appStateSelectedIndexes : [selectedIndexOverride];
    }, [appStateSelectedIndexes, selectedIndexOverride]);
    const selectedIndex = selectedIndexes.includes(primarySelectedIndex) ? primarySelectedIndex : ((_a = selectedIndexes[0]) !== null && _a !== void 0 ? _a : -1);
    return {
        selectedIndex,
        selectedIndexes,
        updateSelectedIndex,
    };
};
exports.default = useSelectedSidebarIndexes;
//# sourceMappingURL=useSelectedSidebarIndexes.js.map