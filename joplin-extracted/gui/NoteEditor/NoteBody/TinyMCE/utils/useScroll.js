"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useScroll;
const react_1 = require("react");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
function useScroll(dependencies) {
    const { editor, onScroll } = dependencies;
    const scrollTimeoutId_ = (0, react_1.useRef)(null);
    const maxScrollTop = (0, react_1.useCallback)(() => {
        if (!editor)
            return 0;
        const doc = editor.getDoc();
        const win = editor.getWin();
        if (!doc || !win)
            return 0;
        const firstChild = doc.firstElementChild;
        if (!firstChild)
            return 0;
        const winHeight = win.innerHeight;
        const contentHeight = firstChild.scrollHeight;
        return contentHeight < winHeight ? 0 : contentHeight - winHeight;
    }, [editor]);
    const scrollTop = (0, react_1.useCallback)(() => {
        if (!editor)
            return 0;
        const win = editor.getWin();
        if (!win)
            return 0;
        return win.scrollY;
    }, [editor]);
    const scrollPercent = (0, react_1.useCallback)(() => {
        const m = maxScrollTop();
        const t = scrollTop();
        return m <= 0 ? 0 : t / m;
    }, [maxScrollTop, scrollTop]);
    const scrollToPercent = (0, react_1.useCallback)((percent) => {
        if (!editor)
            return;
        editor.getWin().scrollTo(0, maxScrollTop() * percent);
    }, [editor, maxScrollTop]);
    const scheduleOnScroll = (0, react_1.useCallback)((event) => {
        if (scrollTimeoutId_.current) {
            shim_1.default.clearTimeout(scrollTimeoutId_.current);
            scrollTimeoutId_.current = null;
        }
        scrollTimeoutId_.current = shim_1.default.setTimeout(() => {
            scrollTimeoutId_.current = null;
            onScroll(event);
        }, 10);
    }, [onScroll]);
    const onEditorScroll = (0, react_1.useCallback)(() => {
        scheduleOnScroll({ percent: scrollPercent() });
    }, [scheduleOnScroll, scrollPercent]);
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        editor.getDoc().addEventListener('scroll', onEditorScroll);
        return () => {
            editor.getDoc().removeEventListener('scroll', onEditorScroll);
        };
    }, [editor, onEditorScroll]);
    return { scrollToPercent };
}
//# sourceMappingURL=useScroll.js.map