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
exports.default = NoteTitleBar;
const React = __importStar(require("react"));
const locale_1 = require("@joplin/lib/locale");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const react_1 = require("react");
const NoteToolbar_1 = __importDefault(require("../../NoteToolbar/NoteToolbar"));
const theme_1 = require("@joplin/lib/theme");
const time_1 = __importDefault(require("@joplin/lib/time"));
const NewWindowOrIFrame_1 = require("../../NewWindowOrIFrame");
function styles_(props) {
    return (0, theme_1.buildStyle)(['NoteEditorTitleBar'], props.themeId, theme => {
        return {
            titleInput: {
                flex: 1,
                display: 'inline-block',
                paddingTop: 5,
                minHeight: 38,
                boxSizing: 'border-box',
                fontWeight: 'bold',
                paddingBottom: 5,
                paddingLeft: 0,
                paddingRight: 8,
                color: theme.textStyle.color,
                fontSize: Math.round(theme.textStyle.fontSize * 1.5),
                backgroundColor: theme.backgroundColor,
                border: 'none',
                width: '100%',
            },
            titleDate: Object.assign(Object.assign({}, theme.textStyle), { color: theme.colorFaded, paddingLeft: 8, whiteSpace: 'nowrap' }),
            toolbarStyle: {
                marginBottom: 0,
                minWidth: 0,
            },
        };
    });
}
const useReselectHandlers = () => {
    const lastTitleFocus = (0, react_1.useRef)([0, 0]);
    const lastTitleValue = (0, react_1.useRef)('');
    const onTitleBlur = (0, react_1.useCallback)((event) => {
        const titleElement = event.currentTarget;
        lastTitleFocus.current = [titleElement.selectionStart, titleElement.selectionEnd];
        lastTitleValue.current = titleElement.value;
    }, []);
    const onTitleFocus = (0, react_1.useCallback)((event) => {
        const titleElement = event.currentTarget;
        // By default, focusing the note title bar can cause its content to become selected. We override
        // this with a more reasonable default:
        if (titleElement.selectionStart === 0 && titleElement.selectionEnd === titleElement.value.length) {
            if (lastTitleValue.current !== titleElement.value) {
                titleElement.selectionStart = titleElement.value.length;
            }
            else {
                titleElement.selectionStart = lastTitleFocus.current[0];
                titleElement.selectionEnd = lastTitleFocus.current[1];
            }
        }
    }, []);
    return { onTitleBlur, onTitleFocus };
};
function NoteTitleBar(props) {
    const styles = styles_(props);
    const onTitleKeydown = (0, react_1.useCallback)((event) => {
        const titleElement = event.currentTarget;
        const selectionAtEnd = titleElement.selectionEnd === titleElement.value.length;
        const isNavigationShortcut = (event.key === 'ArrowDown' && selectionAtEnd) || (event.key === 'Enter' && !event.shiftKey);
        const composing = event.nativeEvent.isComposing;
        // Don't change focus if the navigation shortcut is fired during composition. See
        // https://github.com/laurent22/joplin/issues/11485.
        if (!composing && isNavigationShortcut) {
            event.preventDefault();
            const moveCursorToStart = event.key === 'ArrowDown';
            void CommandService_1.default.instance().execute('focusElement', 'noteBody', { moveCursorToStart });
        }
    }, []);
    const { onTitleFocus, onTitleBlur } = useReselectHandlers();
    function renderTitleBarDate() {
        return React.createElement("span", { className: "updated-time-label", style: styles.titleDate }, time_1.default.formatMsToLocal(props.noteUserUpdatedTime));
    }
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    function renderNoteToolbar() {
        return React.createElement(NoteToolbar_1.default, { themeId: props.themeId, style: styles.toolbarStyle, disabled: props.disabled, windowId: windowId });
    }
    return (React.createElement("div", { className: 'note-title-wrapper' },
        React.createElement("input", { className: "title-input", type: "text", ref: props.titleInputRef, placeholder: props.isProvisional ? (props.noteIsTodo ? (0, locale_1._)('Creating new to-do...') : (0, locale_1._)('Creating new note...')) : '', "aria-label": props.isProvisional ? undefined : (0, locale_1._)('Note title'), style: styles.titleInput, readOnly: props.disabled, onChange: props.onTitleChange, onKeyDown: onTitleKeydown, onFocus: onTitleFocus, onBlur: onTitleBlur, value: props.noteTitle }),
        React.createElement("div", { className: 'note-title-info-group' },
            renderTitleBarDate(),
            renderNoteToolbar())));
}
//# sourceMappingURL=NoteTitleBar.js.map