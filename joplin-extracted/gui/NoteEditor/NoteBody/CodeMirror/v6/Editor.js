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
const createEditor_1 = __importDefault(require("@joplin/editor/CodeMirror/createEditor"));
const setupVim_1 = __importDefault(require("@joplin/editor/CodeMirror/utils/setupVim"));
const useKeymap_1 = __importDefault(require("./utils/useKeymap"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const localisation_1 = __importDefault(require("./utils/localisation"));
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const urlUtils_1 = require("@joplin/lib/urlUtils");
const resourceUtils_1 = require("@joplin/lib/models/utils/resourceUtils");
const getResourceBaseUrl_1 = __importDefault(require("../../../utils/getResourceBaseUrl"));
const useContentScriptRegistration_1 = __importDefault(require("./utils/useContentScriptRegistration"));
const Editor = (props, ref) => {
    const editorContainerRef = (0, react_1.useRef)(null);
    const [editor, setEditor] = (0, react_1.useState)(null);
    // The editor will only be created once, so callbacks that could
    // change need to be stored as references.
    const onEventRef = (0, react_1.useRef)(props.onEvent);
    const onLogMessageRef = (0, react_1.useRef)(props.onLogMessage);
    (0, react_1.useEffect)(() => {
        onEventRef.current = props.onEvent;
        onLogMessageRef.current = props.onLogMessage;
    }, [props.onEvent, props.onLogMessage]);
    (0, react_1.useEffect)(() => {
        if (!editor) {
            return () => { };
        }
        const pasteEventHandler = (_editor, ...args) => {
            const event = args[0];
            props.onEditorPaste(event);
        };
        editor.on('paste', pasteEventHandler);
        return () => {
            editor.off('paste', pasteEventHandler);
        };
    }, [editor, props.onEditorPaste]);
    (0, react_1.useImperativeHandle)(ref, () => {
        return editor;
    }, [editor]);
    (0, useContentScriptRegistration_1.default)({ editor, pluginStates: props.pluginStates });
    (0, react_1.useEffect)(() => {
        if (!editorContainerRef.current)
            return () => { };
        const editorProps = Object.assign(Object.assign({}, props), { localisations: (0, localisation_1.default)(), onEvent: event => onEventRef.current(event), onLogMessage: message => onLogMessageRef.current(message) });
        const editor = (0, createEditor_1.default)(editorContainerRef.current, Object.assign(Object.assign({}, editorProps), { resolveImageSrc: async (src, reloadCounter) => {
                const url = (0, urlUtils_1.parseResourceUrl)(src);
                if (!url.itemId)
                    return null;
                const item = await Resource_1.default.load(url.itemId);
                if (!item)
                    return null;
                return `${(0, getResourceBaseUrl_1.default)()}/${(0, resourceUtils_1.resourceFilename)(item)}${reloadCounter ? `?r=${reloadCounter}` : ''}`;
            } }));
        editor.addStyles({
            '.cm-scroller': { overflow: 'auto' },
            '&.CodeMirror': {
                height: 'unset',
                background: 'unset',
                overflow: 'unset',
                direction: 'unset',
            },
        });
        const cursor = props.initialSelectionRef.current;
        editor.select(cursor, cursor);
        setEditor(editor);
        return () => {
            editor.remove();
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Should run just once
    }, []);
    (0, react_1.useEffect)(() => {
        if (!editor) {
            return;
        }
        const searchState = editor.getSearchState();
        const externalSearchText = props.externalSearch
            .keywords
            .filter(k => typeof k === 'string' || k.source !== 'semantic')
            .map(k => typeof k === 'string' ? k : k.value)
            .join(' ') || searchState.searchText;
        if (externalSearchText === searchState.searchText && searchState.dialogVisible === props.useLocalSearch) {
            return;
        }
        editor.setSearchState(Object.assign(Object.assign({}, searchState), { dialogVisible: props.useLocalSearch, searchText: externalSearchText }));
    }, [editor, props.externalSearch, props.useLocalSearch]);
    const theme = props.settings.themeData;
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        const styles = editor.addStyles({
            '& .cm-search-marker *, & .cm-search-marker': {
                color: theme.searchMarkerColor,
                backgroundColor: theme.searchMarkerBackgroundColor,
            },
            '& .cm-search-marker-selected *, & .cm-search-marker-selected': {
                background: `${theme.selectedColor2} !important`,
                color: `${theme.color2} !important`,
            },
        });
        return () => {
            styles.remove();
        };
    }, [editor, theme]);
    (0, react_1.useEffect)(() => {
        editor === null || editor === void 0 ? void 0 : editor.updateSettings(props.settings);
    }, [props.settings, editor]);
    (0, react_1.useEffect)(() => {
        if (!editor) {
            return;
        }
        (0, setupVim_1.default)(editor, {
            sync: () => {
                void CommandService_1.default.instance().execute('synchronize');
            },
        });
    }, [editor]);
    (0, useKeymap_1.default)(editor);
    return (React.createElement("div", { style: props.style, ref: editorContainerRef }));
};
exports.default = (0, react_1.forwardRef)(Editor);
//# sourceMappingURL=Editor.js.map