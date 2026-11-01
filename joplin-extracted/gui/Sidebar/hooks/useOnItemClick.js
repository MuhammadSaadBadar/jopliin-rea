"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("@joplin/lib/BaseModel");
const react_1 = require("react");
const types_1 = require("../types");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const listItemToId = (item) => {
    if (item.kind === types_1.ListItemType.Tag)
        return item.tag.id;
    if (item.kind === types_1.ListItemType.Folder)
        return item.folder.id;
    return null;
};
const useOnItemClick = ({ dispatch, selectedIndexesRef, itemsRef }) => {
    return (0, react_1.useCallback)(({ id, type, event }) => {
        const action = type === BaseModel_1.ModelType.Folder ? 'FOLDER_SELECT' : 'TAG_SELECT';
        const selectedIndexes = selectedIndexesRef.current;
        const findItemIndex = () => itemsRef.current.findIndex(item => listItemToId(item) === id);
        if (event.shiftKey && selectedIndexes.length > 0) {
            const index = findItemIndex();
            if (index === -1)
                throw new Error(`No item found with ID: ${id}`);
            const lastAddedIndex = selectedIndexes[selectedIndexes.length - 1];
            const indexStart = Math.min(index, lastAddedIndex);
            const indexStop = Math.max(index, lastAddedIndex);
            const itemIds = itemsRef.current.slice(indexStart, indexStop + 1)
                .map(listItemToId)
                .filter(id => !!id);
            dispatch({
                type: `${action}_ADD`,
                ids: itemIds,
            });
        }
        else if (shim_1.default.isMac() ? event.metaKey : event.ctrlKey) {
            const index = findItemIndex();
            // Don't allow unselecting all items: Keep at least one item selected
            const canDeselect = selectedIndexes.length > 1;
            const actionType = canDeselect && selectedIndexes.includes(index) ? 'REMOVE' : 'ADD';
            dispatch({
                type: `${action}_${actionType}`,
                id: id,
            });
        }
        else {
            dispatch({
                type: action,
                id: id,
            });
        }
    }, [dispatch, selectedIndexesRef, itemsRef]);
};
exports.default = useOnItemClick;
//# sourceMappingURL=useOnItemClick.js.map