"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const useLinkTooltips = (editor) => {
    const resetModifiedTitles = (0, react_1.useCallback)(() => {
        var _a;
        if (!editor)
            return;
        const doc = editor.getDoc();
        if (!doc)
            return;
        for (const element of doc.querySelectorAll('a[data-joplin-original-title]')) {
            element.setAttribute('title', (_a = element.getAttribute('data-joplin-original-title')) !== null && _a !== void 0 ? _a : '');
            element.removeAttribute('data-joplin-original-title');
        }
    }, [editor]);
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        const onMouseOver = (event) => {
            let element = event.target;
            // mouseover events seem to only target the lowest applicable node in the DOM.
            // If the user's mouse enters <a><strong></strong></a>, the mouseover event will
            // target the <strong></strong>. As such, the parent nodes need to be checked:
            let counter = 0;
            while (element.tagName !== 'A' || !('href' in element)) {
                element = element.parentElement;
                counter++;
                if (!element || counter > 4) {
                    return;
                }
            }
            if (!element.hasAttribute('data-joplin-original-title')) {
                element.setAttribute('data-joplin-original-title', element.title);
            }
            // Avoid showing internal HREFs for note links.
            if (element.hasAttribute('data-resource-id') && !element.title) {
                if (shim_1.default.isMac()) {
                    element.title = (0, locale_1._)('Cmd-click to open');
                }
                else {
                    element.title = (0, locale_1._)('Ctrl-click to open');
                }
            }
            else {
                if (shim_1.default.isMac()) {
                    element.title = (0, locale_1._)('Cmd-click to open: %s', element.title || element.href);
                }
                else {
                    element.title = (0, locale_1._)('Ctrl-click to open: %s', element.title || element.href);
                }
            }
            const onMouseLeave = () => {
                resetModifiedTitles();
                element.removeEventListener('mouseleave', onMouseLeave);
            };
            element.addEventListener('mouseleave', onMouseLeave);
        };
        const clearRootEventListeners = () => {
            editor.getDoc().removeEventListener('mouseover', onMouseOver);
        };
        const setUpRootEventListeners = () => {
            clearRootEventListeners();
            editor.getDoc().addEventListener('mouseover', onMouseOver);
        };
        setUpRootEventListeners();
        editor.on('SetContent', setUpRootEventListeners);
        editor.on('keyup', resetModifiedTitles);
        editor.on('click', resetModifiedTitles);
        return () => {
            resetModifiedTitles();
            editor.off('SetContent', setUpRootEventListeners);
            editor.off('keyup', resetModifiedTitles);
            editor.off('click', resetModifiedTitles);
            clearRootEventListeners();
        };
    }, [editor, resetModifiedTitles]);
    return { resetModifiedTitles };
};
exports.default = useLinkTooltips;
//# sourceMappingURL=useLinkTooltips.js.map