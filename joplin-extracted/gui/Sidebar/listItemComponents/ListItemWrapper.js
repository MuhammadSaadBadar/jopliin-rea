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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const ListItemWrapper = props => {
    var _a;
    const style = (0, react_1.useMemo)(() => {
        return {
            '--depth': props.depth,
        };
    }, [props.depth]);
    const { selected, primarySelected, multipleItemsSelected } = props.selectionState;
    return (React.createElement("div", { ref: props.containerRef, "aria-posinset": props.itemIndex + 1, "aria-setsize": props.itemCount, "aria-selected": selected, "aria-expanded": props.expanded, "aria-level": props.depth, tabIndex: primarySelected ? 0 : -1, onContextMenu: props.onContextMenu, onDrag: props.onDrag, onDragStart: props.onDragStart, onDragOver: props.onDragOver, onDrop: props.onDrop, draggable: props.draggable, role: 'treeitem', className: [
            'list-item-wrapper',
            props.highlightOnHover ? '-highlight-on-hover' : '',
            selected ? '-selected' : '',
            primarySelected && multipleItemsSelected ? '-selected-primary' : '',
            (_a = props.className) !== null && _a !== void 0 ? _a : '',
        ].join(' '), style: style, "data-folder-id": props['data-folder-id'], "data-id": props['data-id'], "data-index": props.itemIndex, "data-tag-id": props['data-tag-id'], "data-type": props['data-type'], "aria-labelledby": props['aria-labelledby'] }, props.children));
};
exports.default = ListItemWrapper;
//# sourceMappingURL=ListItemWrapper.js.map