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
const codemirror_1 = __importDefault(require("codemirror"));
require("codemirror/addon/comment/comment");
require("codemirror/addon/dialog/dialog");
require("codemirror/addon/edit/closebrackets");
require("codemirror/addon/edit/continuelist");
require("codemirror/addon/scroll/annotatescrollbar");
require("codemirror/addon/search/matchesonscrollbar");
require("codemirror/addon/search/searchcursor");
const useListIdent_1 = __importDefault(require("./utils/useListIdent"));
const useScrollUtils_1 = __importDefault(require("./utils/useScrollUtils"));
const useCursorUtils_1 = __importDefault(require("./utils/useCursorUtils"));
const useLineSorting_1 = __importDefault(require("./utils/useLineSorting"));
const useJoplinMode_1 = __importDefault(require("./utils/useJoplinMode"));
const useKeymap_1 = __importDefault(require("./utils/useKeymap"));
const useExternalPlugins_1 = __importDefault(require("./utils/useExternalPlugins"));
const useJoplinCommands_1 = __importDefault(require("./utils/useJoplinCommands"));
require("codemirror/keymap/emacs");
require("codemirror/keymap/vim");
require("codemirror/keymap/sublime"); // Used for swapLineUp and swapLineDown
require("codemirror/mode/meta");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
// import eventManager from '@joplin/lib/eventManager';
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
// Based on http://pypl.github.io/PYPL.html
require("codemirror/mode/python/python");
require("codemirror/mode/clike/clike");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/jsx/jsx");
require("codemirror/mode/php/php");
require("codemirror/mode/r/r");
require("codemirror/mode/swift/swift");
require("codemirror/mode/go/go");
require("codemirror/mode/vb/vb");
require("codemirror/mode/vbscript/vbscript");
require("codemirror/mode/ruby/ruby");
require("codemirror/mode/rust/rust");
require("codemirror/mode/dart/dart");
require("codemirror/mode/lua/lua");
require("codemirror/mode/groovy/groovy");
require("codemirror/mode/perl/perl");
require("codemirror/mode/cobol/cobol");
require("codemirror/mode/julia/julia");
require("codemirror/mode/haskell/haskell");
require("codemirror/mode/pascal/pascal");
require("codemirror/mode/css/css");
// Additional languages, not in the PYPL lis;
require("codemirror/mode/xml/xml"); // For HTML too
require("codemirror/mode/markdown/markdown");
require("codemirror/mode/yaml/yaml");
require("codemirror/mode/shell/shell");
require("codemirror/mode/dockerfile/dockerfile");
require("codemirror/mode/diff/diff");
require("codemirror/mode/erlang/erlang");
require("codemirror/mode/sql/sql");
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
function Editor(props, ref) {
    const [editor, setEditor] = (0, react_1.useState)(null);
    const editorParent = (0, react_1.useRef)(null);
    const lastEditTime = (0, react_1.useRef)(NaN);
    (0, react_1.useEffect)(() => {
        window.CodeMirror = codemirror_1.default;
        return () => {
            window.CodeMirror = undefined;
        };
    }, []);
    // Codemirror plugins add new commands to codemirror (or change it's behavior)
    // This command adds the smartListIndent function which will be bound to tab
    (0, useListIdent_1.default)(codemirror_1.default);
    (0, useScrollUtils_1.default)(codemirror_1.default);
    (0, useCursorUtils_1.default)(codemirror_1.default);
    (0, useLineSorting_1.default)(codemirror_1.default);
    (0, useJoplinMode_1.default)(codemirror_1.default);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const pluginOptions = (0, useExternalPlugins_1.default)(codemirror_1.default, props.plugins);
    (0, useKeymap_1.default)(codemirror_1.default);
    (0, useJoplinCommands_1.default)(codemirror_1.default);
    (0, react_1.useImperativeHandle)(ref, () => {
        return editor;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const editor_change = (0, react_1.useCallback)((cm, change) => {
        if (props.onChange && change.origin !== 'setValue') {
            props.onChange(cm.getValue());
            lastEditTime.current = Date.now();
        }
    }, [props.onChange]);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const editor_scroll = (0, react_1.useCallback)((_cm) => {
        props.onScroll();
    }, [props.onScroll]);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const editor_paste = (0, react_1.useCallback)((_cm, _event) => {
        props.onEditorPaste();
    }, [props.onEditorPaste]);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const editor_drop = (0, react_1.useCallback)((cm, _event) => {
        (0, focusHandler_1.focus)('v5/Editor::editor_drop', cm);
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const editor_drag = (0, react_1.useCallback)((cm, event) => {
        // This is the type for all drag and drops that are external to codemirror
        // setting the cursor allows us to drop them in the right place
        if (event.dataTransfer.effectAllowed === 'all') {
            const coords = cm.coordsChar({ left: event.x, top: event.y });
            cm.setCursor(coords);
        }
        event.dataTransfer.dropEffect = 'copy';
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const editor_resize = (0, react_1.useCallback)((cm) => {
        props.onResize(cm);
    }, [props.onResize]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
    const editor_update = (0, react_1.useCallback)((cm) => {
        const edited = Date.now() - lastEditTime.current <= 100;
        props.onUpdate(cm, edited);
    }, [props.onUpdate]);
    (0, react_1.useEffect)(() => {
        if (!editorParent.current)
            return () => { };
        const userOptions = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
        const safeOptions = {
            value: props.value,
            readOnly: props.readOnly,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
        const unsafeOptions = {
            screenReaderLabel: props.value,
            theme: props.codeMirrorTheme,
            mode: props.mode,
            readOnly: props.readOnly,
            autoCloseBrackets: props.autoMatchBraces,
            inputStyle: Setting_1.default.value('editor.spellcheckBeta') ? 'contenteditable' : 'textarea',
            lineWrapping: true,
            lineNumbers: false,
            indentWithTabs: true,
            indentUnit: 4,
            spellcheck: true,
            allowDropFileTypes: [''], // disable codemirror drop handling
            keyMap: props.keyMap ? props.keyMap : 'default',
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 dynamic editor / event / options shapes; no @types/codemirror in this repo
        let cmOptions = Object.assign({}, safeOptions);
        if (!props.isSafeMode) {
            cmOptions = Object.assign(Object.assign(Object.assign({}, cmOptions), unsafeOptions), userOptions);
        }
        const cm = (0, codemirror_1.default)(editorParent.current, cmOptions);
        setEditor(cm);
        cm.on('change', editor_change);
        cm.on('scroll', editor_scroll);
        cm.on('paste', editor_paste);
        cm.on('drop', editor_drop);
        cm.on('dragover', editor_drag);
        cm.on('refresh', editor_resize);
        cm.on('update', editor_update);
        // It's possible for searchMarkers to be available before the editor
        // In these cases we set the markers asap so the user can see them as
        // soon as the editor is ready
        if (props.searchMarkers) {
            props.onSetMarkersRef.current(cm, props.searchMarkers.keywords, props.searchMarkers.options);
        }
        return () => {
            // Clean up codemirror
            cm.off('change', editor_change);
            cm.off('scroll', editor_scroll);
            cm.off('paste', editor_paste);
            cm.off('drop', editor_drop);
            cm.off('dragover', editor_drag);
            cm.off('refresh', editor_resize);
            cm.off('update', editor_update);
            // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
            if (editorParent.current)
                editorParent.current.removeChild(cm.getWrapperElement());
            setEditor(null);
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
    (0, react_1.useEffect)(() => {
        if (editor) {
            //  Value can also be changed by the editor itself so we need this guard
            //  to prevent loops
            if (props.value !== editor.getValue()) {
                editor.setValue(props.value);
                editor.clearHistory();
            }
            editor.setOption('screenReaderLabel', props.value);
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.value]);
    (0, react_1.useEffect)(() => {
        if (editor) {
            editor.setOption('theme', props.codeMirrorTheme);
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.codeMirrorTheme]);
    (0, react_1.useEffect)(() => {
        if (editor) {
            editor.setOption('mode', props.mode);
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.mode]);
    (0, react_1.useEffect)(() => {
        if (editor) {
            editor.setOption('readOnly', props.readOnly);
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.readOnly]);
    (0, react_1.useEffect)(() => {
        if (editor) {
            editor.setOption('autoCloseBrackets', props.autoMatchBraces);
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.autoMatchBraces]);
    (0, react_1.useEffect)(() => {
        if (editor) {
            editor.setOption('keyMap', props.keyMap ? props.keyMap : 'default');
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.keyMap]);
    (0, react_1.useEffect)(() => {
        if (editor) {
            for (const option in pluginOptions) {
                editor.setOption(option, pluginOptions[option]);
            }
        }
    }, [pluginOptions, editor]);
    return React.createElement("div", { className: 'codeMirrorEditor CodeMirror5', style: props.style, ref: editorParent });
}
exports.default = (0, react_1.forwardRef)(Editor);
//# sourceMappingURL=Editor.js.map