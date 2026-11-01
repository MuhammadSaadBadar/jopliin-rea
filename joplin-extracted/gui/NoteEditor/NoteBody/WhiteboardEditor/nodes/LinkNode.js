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
const react_2 = require("@xyflow/react");
const locale_1 = require("@joplin/lib/locale");
const presetColors_1 = require("@joplin/lib/services/whiteboard/presetColors");
const WhiteboardContext_1 = require("../WhiteboardContext");
const handlePositions_1 = __importDefault(require("./handlePositions"));
const useCardWheel_1 = __importDefault(require("./useCardWheel"));
const LinkNode = ({ data, selected }) => {
    var _a;
    const ctx = (0, WhiteboardContext_1.useWhiteboardContext)();
    const node = data.canvasNode;
    const onWheel = (0, useCardWheel_1.default)();
    const onDoubleClick = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        ctx.onOpenRef(node.url);
    }, [ctx, node.url]);
    return (React.createElement(React.Fragment, null,
        React.createElement(react_2.NodeResizer, { minWidth: 80, minHeight: 40, isVisible: !!selected }),
        handlePositions_1.default.map(({ id: hid, position }) => (React.createElement(react_2.Handle, { key: hid, type: "source", position: position, id: hid }))),
        React.createElement("div", { className: `whiteboard-node ${selected ? '-selected' : ''}`, onDoubleClick: onDoubleClick, onWheelCapture: onWheel, style: {
                borderColor: (_a = (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'stroke')) !== null && _a !== void 0 ? _a : (selected ? '#4a90e2' : undefined),
                backgroundColor: (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'fill'),
            } },
            React.createElement("div", { className: "header" }, (0, locale_1._)('Link')),
            React.createElement("div", { className: "body -url" }, node.url))));
};
exports.default = LinkNode;
//# sourceMappingURL=LinkNode.js.map