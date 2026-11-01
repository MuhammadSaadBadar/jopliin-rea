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
const re_resizable_1 = require("re-resizable");
const types_1 = require("./utils/types");
const useLayoutItemSizes_1 = require("./utils/useLayoutItemSizes");
const LayoutItemContainer = ({ item, visible, parent, sizes, resizedItemMaxSize, onResize, onResizeStart, onResizeStop, children, isLastChild, edges, }) => {
    const style = {
        display: visible ? 'flex' : 'none',
        flexDirection: item.direction,
    };
    const size = (0, useLayoutItemSizes_1.itemSize)(item, parent, sizes, true, edges);
    // Drag rules follow the runtime "last visible in render" flag so hidden
    // panels shown by moveMode still get proper dividers.
    const parentDir = parent === null || parent === void 0 ? void 0 : parent.direction;
    const canResizeRight = parentDir === types_1.LayoutItemDirection.Row && !isLastChild;
    const canResizeBottom = parentDir === types_1.LayoutItemDirection.Column && !isLastChild;
    const className = `resizableLayoutItem rli-${item.key}`;
    const enable = {
        top: false,
        right: canResizeRight,
        bottom: canResizeBottom,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
    };
    return (React.createElement(re_resizable_1.Resizable, { key: item.key, className: className, style: style, size: size, onResizeStart: onResizeStart, onResize: onResize, onResizeStop: onResizeStop, enable: enable, minWidth: 'minWidth' in item ? item.minWidth : useLayoutItemSizes_1.itemMinWidth, minHeight: 'minHeight' in item ? item.minHeight : useLayoutItemSizes_1.itemMinHeight, maxWidth: resizedItemMaxSize === null || resizedItemMaxSize === void 0 ? void 0 : resizedItemMaxSize.width, maxHeight: resizedItemMaxSize === null || resizedItemMaxSize === void 0 ? void 0 : resizedItemMaxSize.height }, children));
};
exports.default = LayoutItemContainer;
//# sourceMappingURL=LayoutItemContainer.js.map