"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const useScrollToSelectionHandler = (itemListRef, listItems, selectedIndex) => {
    // We keep track of the key to avoid scrolling unnecessarily. For example, when the
    // selection's index changes because a notebook is expanded/collapsed, we don't necessarily
    // want to scroll the selection into view.
    const lastSelectedItemKey = (0, react_1.useRef)('');
    const selectedItemKey = (0, react_1.useMemo)(() => {
        if (selectedIndex >= 0 && selectedIndex < listItems.length) {
            return listItems[selectedIndex].key;
        }
        else {
            // When nothing is selected, re-use the key from before.
            // This prevents the view from scrolling when a dropdown containing the
            // selection is closed, then opened again.
            return lastSelectedItemKey.current;
        }
    }, [listItems, selectedIndex]);
    const selectedIndexRef = (0, react_1.useRef)(selectedIndex);
    selectedIndexRef.current = selectedIndex;
    (0, react_1.useEffect)(() => {
        // Skip scrolling if the selected item hasn't actually changed. When a folder is
        // expanded or collapsed the selected item's index may shift, but its key stays
        // the same — in that case we don't want to scroll the view.
        if (selectedItemKey === lastSelectedItemKey.current) {
            return;
        }
        lastSelectedItemKey.current = selectedItemKey;
        if (!itemListRef.current || !selectedItemKey)
            return;
        const hasFocus = !!itemListRef.current.container.contains(document.activeElement);
        if (hasFocus) {
            itemListRef.current.makeItemIndexVisible(selectedIndexRef.current);
        }
    }, [selectedItemKey, itemListRef]);
};
const useFocusHandler = (props) => {
    const { itemListRef, selectedIndex, listItems } = props;
    useScrollToSelectionHandler(itemListRef, listItems, selectedIndex);
    const focusSidebar = (0, react_1.useCallback)(() => {
        if (!itemListRef.current.isIndexVisible(selectedIndex)) {
            itemListRef.current.makeItemIndexVisible(selectedIndex);
        }
        const focusableItem = itemListRef.current.container.querySelector('[role="treeitem"][tabindex="0"]');
        const focusableContainer = itemListRef.current.container.querySelector('[role="tree"][tabindex="0"]');
        if (focusableItem) {
            (0, focusHandler_1.focus)('FolderAndTagList/focusSidebarItem', focusableItem);
        }
        else if (focusableContainer) {
            // Handles the case where no items in the tree can be focused.
            (0, focusHandler_1.focus)('FolderAndTagList/focusSidebarTree', focusableContainer);
        }
    }, [selectedIndex, itemListRef]);
    return { focusSidebar };
};
exports.default = useFocusHandler;
//# sourceMappingURL=useFocusHandler.js.map