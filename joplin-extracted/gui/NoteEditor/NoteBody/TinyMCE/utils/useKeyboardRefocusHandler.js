"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const react_1 = require("react");
const useKeyboardRefocusHandler = (editor) => {
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        const isAtBeginningOf = (element, parent) => {
            var _a, _b;
            if (!parent.contains(element))
                return false;
            while (element &&
                element.parentNode !== parent &&
                ((_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.firstChild) === element) {
                element = element.parentNode;
            }
            return !!element && ((_b = element.parentNode) === null || _b === void 0 ? void 0 : _b.firstChild) === element;
        };
        const eventHandler = (event) => {
            if (!event.isDefaultPrevented() && event.key === 'ArrowUp') {
                const selection = editor.selection.getRng();
                if (selection.startOffset === 0 &&
                    selection.collapsed &&
                    isAtBeginningOf(selection.startContainer, editor.dom.getRoot())) {
                    event.preventDefault();
                    void CommandService_1.default.instance().execute('focusElement', 'noteTitle');
                }
            }
        };
        editor.on('keydown', eventHandler);
        return () => {
            editor.off('keydown', eventHandler);
        };
    }, [editor]);
};
exports.default = useKeyboardRefocusHandler;
//# sourceMappingURL=useKeyboardRefocusHandler.js.map