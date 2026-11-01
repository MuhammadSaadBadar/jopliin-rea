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
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const parse_1 = require("@joplin/lib/services/whiteboard/parse");
const serialize_1 = require("@joplin/lib/services/whiteboard/serialize");
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
const WhiteboardContext_1 = require("./WhiteboardContext");
const WhiteboardSurface_1 = __importDefault(require("./WhiteboardSurface"));
const SAVE_DEBOUNCE_MS = 400;
const WhiteboardEditor = (props, ref) => {
    const bodyRef = (0, react_1.useRef)(props.content);
    bodyRef.current = props.content;
    const initialParse = (0, react_1.useMemo)(() => (0, parse_1.parseWhiteboard)(props.content), [props.content]);
    const initialCanvas = initialParse.canvas;
    const parseError = initialParse.parseError;
    const [canvas, setCanvas] = (0, react_1.useState)(initialCanvas);
    // Mirror the canvas state in a ref so async handlers can read the latest
    // version without going through a setCanvas updater (which must stay pure).
    const canvasRef = (0, react_1.useRef)(initialCanvas);
    canvasRef.current = canvas;
    // Debounced save. We split "schedule" from "unmount" cleanup because the
    // effect's normal cleanup runs whenever `canvas` changes — that's a
    // re-schedule, not a reason to drop the pending save. Only an actual
    // unmount (or an explicit caller via `content()`) should flush.
    const lastSerializedRef = (0, react_1.useRef)(JSON.stringify(canvas));
    const pendingSerializedRef = (0, react_1.useRef)(null);
    const pendingTimeoutRef = (0, react_1.useRef)(null);
    const onChangeRef = (0, react_1.useRef)(props.onChange);
    onChangeRef.current = props.onChange;
    // Reload when the body switches to a different note, or when the body has
    // changed underneath us (external write — e.g. the "add note to whiteboard"
    // command — which produces a body we didn't emit).
    const lastEmittedBodyRef = (0, react_1.useRef)(props.content);
    (0, react_1.useEffect)(() => {
        if (props.content === lastEmittedBodyRef.current)
            return;
        lastEmittedBodyRef.current = props.content;
        const parsed = (0, parse_1.parseWhiteboard)(props.content);
        setCanvas(parsed.canvas);
        // Mark the freshly-loaded canvas as already-synced so the debounced
        // save effect doesn't echo it straight back as a write.
        lastSerializedRef.current = JSON.stringify(parsed.canvas);
    }, [props.content, props.contentKey]);
    const flushPendingSave = (0, react_1.useCallback)(() => {
        if (pendingTimeoutRef.current !== null) {
            clearTimeout(pendingTimeoutRef.current);
            pendingTimeoutRef.current = null;
        }
        const serialized = pendingSerializedRef.current;
        if (serialized === null)
            return bodyRef.current;
        pendingSerializedRef.current = null;
        lastSerializedRef.current = serialized;
        const newBody = (0, serialize_1.serializeWhiteboard)(bodyRef.current, JSON.parse(serialized));
        bodyRef.current = newBody;
        lastEmittedBodyRef.current = newBody;
        onChangeRef.current({ changeId: null, content: newBody });
        return newBody;
    }, []);
    (0, react_1.useEffect)(() => {
        // Never write back when the source body had an unparseable fence —
        // otherwise opening a corrupt note would silently overwrite the
        // user's recoverable JSON with an empty canvas.
        if (parseError)
            return undefined;
        const serialized = JSON.stringify(canvas);
        if (serialized === lastSerializedRef.current)
            return undefined;
        pendingSerializedRef.current = serialized;
        // Replace any prior pending timeout — we'll re-schedule from the new
        // canvas. Crucially we do NOT clear the pending serialised payload
        // here, so the unmount-flush effect can still see it.
        if (pendingTimeoutRef.current !== null)
            clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = setTimeout(() => {
            pendingTimeoutRef.current = null;
            flushPendingSave();
        }, SAVE_DEBOUNCE_MS);
        return undefined;
    }, [canvas, flushPendingSave, parseError]);
    // Flush on unmount. The empty-deps effect's cleanup only fires once.
    (0, react_1.useEffect)(() => {
        return () => { flushPendingSave(); };
    }, [flushPendingSave]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        // Callers that read `content()` (e.g. the form-note save flow) get
        // the latest body even if a debounced save is still pending.
        content: () => flushPendingSave(),
        resetScroll: () => { },
        scrollTo: () => { },
        supportsCommand: () => false,
        execCommand: async () => { },
    }), [flushPendingSave]);
    const onUpdateNode = (0, react_1.useCallback)((nodeId, patch) => {
        setCanvas(prev => (Object.assign(Object.assign({}, prev), { nodes: prev.nodes.map(n => n.id === nodeId ? Object.assign(Object.assign({}, n), patch) : n) })));
    }, []);
    const onOpenRef = (0, react_1.useCallback)((value) => {
        if (!value)
            return;
        // `openItem` already handles every supported link form: `:/id`,
        // `joplin://`, `file://`, any other URL scheme (http/https/mailto/
        // ftp/...), and shows a user-facing error for unsupported strings.
        void CommandService_1.default.instance().execute('openItem', value);
    }, []);
    // Promote a text card to a real Joplin note: create a note in the same
    // folder as the whiteboard, with the card's text as body and its first
    // non-empty line as title; replace the text node with a file-ref node
    // pointing at the new note.
    const onPromoteTextNode = (0, react_1.useCallback)(async (canvasNodeId) => {
        const noteId = props.noteId;
        if (!noteId)
            return;
        // Read the latest canvas state directly — never inside a setCanvas
        // updater, since updaters must stay pure (React 18 strict mode runs
        // them twice in dev, which would create the note twice).
        const node = canvasRef.current.nodes.find(n => n.id === canvasNodeId);
        if (!node || node.type !== 'text')
            return;
        const parentNote = await Note_1.default.load(noteId);
        if (!parentNote)
            return;
        const title = (node.text.split('\n').find(l => l.trim().length) || '').replace(/^#+\s*/, '').trim() || 'Untitled';
        const created = await Note_1.default.save({
            parent_id: parentNote.parent_id,
            title,
            body: node.text,
        });
        // Re-locate the node from the latest state in case it moved/resized
        // between the promote click and the save returning. If it was deleted
        // in the meantime, drop the operation silently.
        const latest = canvasRef.current.nodes.find(n => n.id === canvasNodeId);
        if (!latest || latest.type !== 'text')
            return;
        const replacement = {
            id: latest.id,
            type: 'file',
            x: latest.x,
            y: latest.y,
            width: latest.width,
            height: latest.height,
            file: `:/${created.id}`,
        };
        setCanvas(curr => (Object.assign(Object.assign({}, curr), { nodes: curr.nodes.map(n => n.id === latest.id ? replacement : n) })));
    }, [props.noteId]);
    const themeAppearance = (0, react_1.useMemo)(() => (0, theme_1.themeStyle)(props.themeId).appearance, [props.themeId]);
    const contextValue = (0, react_1.useMemo)(() => ({
        markupToHtml: props.markupToHtml,
        resourceInfos: props.resourceInfos,
        resourceDirectory: props.resourceDirectory,
        themeId: props.themeId,
        themeAppearance,
        onOpenRef,
        onUpdateNode,
        onPromoteTextNode,
    }), [props.markupToHtml, props.resourceInfos, props.resourceDirectory, props.themeId, themeAppearance, onOpenRef, onUpdateNode, onPromoteTextNode]);
    if (parseError) {
        return (React.createElement("div", { className: "whiteboard-editor", style: props.style },
            React.createElement("div", { className: "error" },
                React.createElement("div", { className: "panel" },
                    React.createElement("div", { className: "title" }, (0, locale_1._)('This whiteboard could not be loaded')),
                    React.createElement("div", { className: "detail" }, parseError),
                    React.createElement("div", null, (0, locale_1._)('Click the eye icon in the toolbar to switch to the Markdown editor and fix the JSON manually.'))))));
    }
    return (React.createElement("div", { className: "whiteboard-editor", style: props.style },
        React.createElement(WhiteboardContext_1.WhiteboardContext.Provider, { value: contextValue },
            React.createElement(WhiteboardSurface_1.default, { canvas: canvas, onChange: setCanvas }))));
};
exports.default = (0, react_1.forwardRef)(WhiteboardEditor);
//# sourceMappingURL=WhiteboardEditor.js.map