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
const renderer_1 = require("@joplin/renderer");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const locale_1 = require("@joplin/lib/locale");
const presetColors_1 = require("@joplin/lib/services/whiteboard/presetColors");
const WhiteboardContext_1 = require("../WhiteboardContext");
const useCheckboxToggle_1 = __importDefault(require("../useCheckboxToggle"));
const handlePositions_1 = __importDefault(require("./handlePositions"));
const useCardWheel_1 = __importDefault(require("./useCardWheel"));
const stripUnsafeStyles_1 = __importDefault(require("./stripUnsafeStyles"));
const useRenderedMarkdown = (md, ctx) => {
    const [html, setHtml] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        if (!md) {
            setHtml('');
            return undefined;
        }
        void (async () => {
            var _a;
            try {
                const result = await ctx.markupToHtml(renderer_1.MarkupLanguage.Markdown, md, {
                    resourceInfos: ctx.resourceInfos,
                });
                if (!cancelled)
                    setHtml((0, stripUnsafeStyles_1.default)((_a = result === null || result === void 0 ? void 0 : result.html) !== null && _a !== void 0 ? _a : ''));
            }
            catch (_b) {
                if (!cancelled)
                    setHtml('');
            }
        })();
        return () => { cancelled = true; };
    }, [md, ctx]);
    return html;
};
const TextNode = ({ data, selected, id }) => {
    var _a;
    const ctx = (0, WhiteboardContext_1.useWhiteboardContext)();
    const node = data.canvasNode;
    const onWheel = (0, useCardWheel_1.default)();
    const [editing, setEditing] = (0, react_1.useState)(false);
    const [draft, setDraft] = (0, react_1.useState)(node.text);
    const textareaRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!editing)
            setDraft(node.text);
    }, [editing, node.text]);
    (0, react_1.useEffect)(() => {
        if (editing && textareaRef.current) {
            (0, focusHandler_1.focus)('WhiteboardTextNode::beginEdit', textareaRef.current);
            textareaRef.current.select();
        }
    }, [editing]);
    const html = useRenderedMarkdown(node.text, ctx);
    const beginEdit = (0, react_1.useCallback)(() => {
        setDraft(node.text);
        setEditing(true);
    }, [node.text]);
    const commit = (0, react_1.useCallback)(() => {
        if (!editing)
            return;
        if (draft !== node.text)
            ctx.onUpdateNode(id, { text: draft });
        setEditing(false);
    }, [editing, draft, node.text, ctx, id]);
    const cancel = (0, react_1.useCallback)(() => setEditing(false), []);
    const onKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
        }
        else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            commit();
        }
    }, [commit, cancel]);
    const onDoubleClick = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        beginEdit();
    }, [beginEdit]);
    const onCardKeyDown = (0, react_1.useCallback)((e) => {
        if (editing)
            return;
        if (e.key === 'Enter' || e.key === 'F2') {
            e.preventDefault();
            e.stopPropagation();
            beginEdit();
        }
    }, [editing, beginEdit]);
    const onPromote = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        ctx.onPromoteTextNode(id);
    }, [ctx, id]);
    const onCheckboxToggleBody = (0, react_1.useCallback)((newBody) => {
        ctx.onUpdateNode(id, { text: newBody });
    }, [ctx, id]);
    const checkboxRef = (0, useCheckboxToggle_1.default)({
        body: node.text,
        onChange: onCheckboxToggleBody,
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(react_2.NodeResizer, { minWidth: 80, minHeight: 40, isVisible: selected && !editing }),
        handlePositions_1.default.map(({ id: hid, position }) => (React.createElement(react_2.Handle, { key: hid, type: "source", position: position, id: hid }))),
        React.createElement("div", { className: `whiteboard-node -text ${selected ? '-selected' : ''}`, onDoubleClick: onDoubleClick, onKeyDown: onCardKeyDown, onWheelCapture: onWheel, style: {
                borderColor: (_a = (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'stroke')) !== null && _a !== void 0 ? _a : (selected ? '#4a90e2' : undefined),
                backgroundColor: (0, presetColors_1.resolveCanvasColor)(node.color, ctx.themeAppearance, 'fill'),
            } }, editing ? (React.createElement("textarea", { ref: textareaRef, className: "editor nodrag", value: draft, onChange: e => setDraft(e.target.value), onBlur: commit, onKeyDown: onKeyDown })) : (node.text
            ? React.createElement("div", { ref: checkboxRef, className: "wb-card-md", dangerouslySetInnerHTML: { __html: html } })
            : React.createElement("div", { className: "empty" }, (0, locale_1._)('(empty — double-click to edit)')))),
        selected && !editing && node.text ? (React.createElement("button", { type: "button", onClick: onPromote, className: "whiteboard-node-promote nodrag", title: (0, locale_1._)('Convert this card into a Joplin note') }, (0, locale_1._)('Promote to note'))) : null));
};
exports.default = TextNode;
//# sourceMappingURL=TextNode.js.map