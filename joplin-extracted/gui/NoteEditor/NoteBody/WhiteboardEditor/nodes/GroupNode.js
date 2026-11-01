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
const react_2 = require("@xyflow/react");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const locale_1 = require("@joplin/lib/locale");
const presetColors_1 = require("@joplin/lib/services/whiteboard/presetColors");
const WhiteboardContext_1 = require("../WhiteboardContext");
const GroupNode = ({ data, selected, id }) => {
    var _a;
    const ctx = (0, WhiteboardContext_1.useWhiteboardContext)();
    const node = data.canvasNode;
    const label = (_a = node.label) !== null && _a !== void 0 ? _a : '';
    const [editing, setEditing] = (0, react_1.useState)(false);
    const [draft, setDraft] = (0, react_1.useState)(label);
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!editing)
            setDraft(label);
    }, [editing, label]);
    (0, react_1.useEffect)(() => {
        if (editing && inputRef.current) {
            (0, focusHandler_1.focus)('WhiteboardGroupNode::beginEdit', inputRef.current);
            inputRef.current.select();
        }
    }, [editing]);
    const beginEdit = (0, react_1.useCallback)(() => {
        setDraft(label);
        setEditing(true);
    }, [label]);
    const commit = (0, react_1.useCallback)(() => {
        if (!editing)
            return;
        if (draft !== label)
            ctx.onUpdateNode(id, { label: draft });
        setEditing(false);
    }, [editing, draft, label, ctx, id]);
    const cancel = (0, react_1.useCallback)(() => setEditing(false), []);
    const onKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            commit();
        }
    }, [commit, cancel]);
    const onDoubleClick = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        beginEdit();
    }, [beginEdit]);
    const colorStroke = (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'stroke');
    const colorFill = (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'fill');
    const edgeStyle = colorStroke ? { borderColor: colorStroke } : undefined;
    return (React.createElement(React.Fragment, null,
        React.createElement(react_2.NodeResizer, { minWidth: 80, minHeight: 60, isVisible: selected && !editing }),
        React.createElement("div", { className: `whiteboard-group ${selected ? '-selected' : ''}` },
            React.createElement("div", { className: "background", style: colorFill ? { background: colorFill } : undefined }),
            React.createElement("div", { className: "edge -top whiteboard-group-handle", style: edgeStyle }),
            React.createElement("div", { className: "edge -right whiteboard-group-handle", style: edgeStyle }),
            React.createElement("div", { className: "edge -bottom whiteboard-group-handle", style: edgeStyle }),
            React.createElement("div", { className: "edge -left whiteboard-group-handle", style: edgeStyle }),
            React.createElement("div", { className: "anchor whiteboard-group-handle", title: (0, locale_1._)('Drag to move group'), "aria-label": (0, locale_1._)('Drag to move group') },
                React.createElement("i", { className: "fas fa-arrows-alt", "aria-hidden": "true" })),
            editing ? (React.createElement("input", { ref: inputRef, className: "label nodrag", type: "text", value: draft, onChange: e => setDraft(e.target.value), onBlur: commit, onKeyDown: onKeyDown })) : (React.createElement("div", { className: "label whiteboard-group-handle", title: label || (0, locale_1._)('Group'), onDoubleClick: onDoubleClick }, label || React.createElement("span", { className: "placeholder" }, (0, locale_1._)('Group')))))));
};
exports.default = GroupNode;
//# sourceMappingURL=GroupNode.js.map