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
const react_1 = require("react");
const NoteListHeaderItem_1 = __importDefault(require("./NoteListHeaderItem"));
const useDragAndDrop_1 = __importStar(require("./useDragAndDrop"));
const useContextMenu_1 = __importDefault(require("./utils/useContextMenu"));
const depNameToNoteProp_1 = __importDefault(require("@joplin/lib/services/noteList/depNameToNoteProp"));
const defaultHeight = 26;
exports.default = (props) => {
    const { onItemDragStart, onItemDragOver, onItemDrop, onResizerDragStart, onResizerDragEnd, dropAt, draggedItem } = (0, useDragAndDrop_1.default)(props.columns);
    const onContextMenu = (0, useContextMenu_1.default)(props.columns);
    const items = [];
    let isFirst = true;
    for (const column of props.columns) {
        let dragCursorLocation = null;
        if (draggedItem && draggedItem.type === useDragAndDrop_1.DataType.HeaderItem) {
            dragCursorLocation = dropAt && dropAt.columnName === column.name ? dropAt.location : null;
        }
        items.push(React.createElement(NoteListHeaderItem_1.default, { isFirst: isFirst, key: column.name, column: column, isCurrent: `note.${props.notesSortOrderField}` === (0, depNameToNoteProp_1.default)(column.name), isReverse: props.notesSortOrderReverse, onClick: props.onItemClick, onDragStart: onItemDragStart, onDragOver: onItemDragOver, onDrop: onItemDrop, onResizerDragStart: onResizerDragStart, onResizerDragEnd: onResizerDragEnd, dragCursorLocation: dragCursorLocation }));
        isFirst = false;
    }
    const itemHeight = props.height ? props.height : defaultHeight;
    const style = (0, react_1.useMemo)(() => {
        return { height: itemHeight };
    }, [itemHeight]);
    return (React.createElement("div", { className: "note-list-header", style: style, onContextMenu: onContextMenu }, items));
};
//# sourceMappingURL=NoteListHeader.js.map