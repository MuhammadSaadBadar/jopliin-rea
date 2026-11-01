"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const note_screen_shared_1 = __importDefault(require("@joplin/lib/components/shared/note-screen-shared"));
const react_1 = require("react");
const useWebviewIpcMessage = (props) => {
    const editorRef = props.editorRef;
    return (0, react_1.useCallback)((event) => {
        const msg = event.channel ? event.channel : '';
        const args = event.args;
        const arg0 = args && args.length >= 1 ? args[0] : null;
        if (msg.indexOf('checkboxclick:') === 0) {
            const result = note_screen_shared_1.default.toggleCheckboxRange(msg, props.content);
            if (typeof result === 'string')
                return;
            const { line, from, to } = result;
            if (editorRef.current) {
                // To cancel CodeMirror's layout drift, the scroll position
                // is recorded before updated, and then it is restored.
                // Ref. https://github.com/laurent22/joplin/issues/5890
                const percent = props.getLineScrollPercent();
                editorRef.current.replaceRange(line, from, to);
                props.setEditorPercentScroll(percent);
            }
        }
        else if (msg === 'percentScroll') {
            props.setEditorPercentScroll(arg0);
        }
        else {
            props.onMessage(event);
        }
    }, [
        props.onMessage,
        props.content,
        editorRef,
        props.getLineScrollPercent,
        props.setEditorPercentScroll,
    ]);
};
exports.default = useWebviewIpcMessage;
//# sourceMappingURL=useWebviewIpcMessage.js.map