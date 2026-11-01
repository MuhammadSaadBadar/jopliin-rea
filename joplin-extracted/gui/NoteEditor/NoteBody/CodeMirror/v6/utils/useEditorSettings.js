"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@joplin/editor/types");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const renderer_1 = require("@joplin/renderer");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const locale_1 = require("@joplin/lib/locale");
const node_util_1 = require("node:util");
const useEditorSettings = (props) => {
    const stateToSettings = (state) => ({
        markdownMark: state.settings['markdown.plugin.mark'],
        markdownInsert: state.settings['markdown.plugin.insert'],
        katex: state.settings['markdown.plugin.katex'],
        inlineRendering: state.settings['editor.inlineRendering'],
        tableEditing: state.settings['editor.tableEditing'],
        imageRendering: state.settings['editor.imageRendering'],
        highlightActiveLine: state.settings['editor.highlightActiveLine'],
        monospaceFont: state.settings['style.editor.monospaceFontFamily'],
        automatchBraces: state.settings['editor.autoMatchingBraces'],
        autocompleteMarkup: state.settings['editor.autocompleteMarkup'],
        spellcheckEnabled: state.settings['editor.spellcheckBeta'],
    });
    const settings = (0, react_redux_1.useSelector)(stateToSettings, node_util_1.isDeepStrictEqual);
    return (0, react_1.useMemo)(() => {
        const isHTMLNote = props.contentMarkupLanguage === renderer_1.MarkupToHtml.MARKUP_LANGUAGE_HTML;
        let keyboardMode = types_1.EditorKeymap.Default;
        if (props.keyboardMode === 'vim') {
            keyboardMode = types_1.EditorKeymap.Vim;
        }
        else if (props.keyboardMode === 'emacs') {
            keyboardMode = types_1.EditorKeymap.Emacs;
        }
        return {
            language: isHTMLNote ? types_1.EditorLanguageType.Html : types_1.EditorLanguageType.Markdown,
            readOnly: props.disabled,
            markdownMarkEnabled: settings.markdownMark,
            markdownInsertEnabled: settings.markdownInsert,
            katexEnabled: settings.katex,
            inlineRenderingEnabled: settings.inlineRendering,
            tableEditingEnabled: settings.tableEditing,
            imageRenderingEnabled: settings.imageRendering,
            highlightActiveLine: settings.highlightActiveLine,
            themeData: Object.assign(Object.assign({}, props.baseTheme), { marginLeft: 0, marginRight: 0, monospaceFont: settings.monospaceFont, paddingBottom: 400 }),
            automatchBraces: settings.automatchBraces,
            autocompleteMarkup: settings.autocompleteMarkup,
            useExternalSearch: false,
            ignoreModifiers: true,
            spellcheckEnabled: settings.spellcheckEnabled,
            keymap: keyboardMode,
            preferMacShortcuts: shim_1.default.isMac(),
            indentWithTabs: true,
            tabMovesFocus: props.tabMovesFocus,
            editorLabel: (0, locale_1._)('Markdown editor'),
        };
    }, [
        props.contentMarkupLanguage, props.disabled, props.keyboardMode, props.baseTheme,
        props.tabMovesFocus, settings,
    ]);
};
exports.default = useEditorSettings;
//# sourceMappingURL=useEditorSettings.js.map