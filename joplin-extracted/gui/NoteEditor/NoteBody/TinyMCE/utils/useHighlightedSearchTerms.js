"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SearchEngine_1 = __importDefault(require("@joplin/lib/services/search/SearchEngine"));
const theme_1 = require("@joplin/lib/theme");
const react_1 = require("react");
const useSearchRegexes = (searchTerms) => {
    return (0, react_1.useMemo)(() => {
        return searchTerms.map((term) => {
            let text;
            if (typeof term === 'string') {
                text = term;
            }
            else {
                text = term.value;
            }
            // Only highlight short matches at word boundaries (roughly matching the note viewer
            // behavior)
            const regexText = SearchEngine_1.default.instance().queryTermToRegex(text, { anchorToWordBoundary: text.length <= 2 });
            return regexText ? new RegExp(regexText, 'ig') : null;
        }).filter(regex => !!regex);
    }, [searchTerms]);
};
const searchHighlightKey = 'jop-search-highlight';
const useHighlightStyleSheet = (editor, themeId) => {
    (0, react_1.useEffect)(() => {
        if (!editor) {
            return () => { };
        }
        const theme = (0, theme_1.themeStyle)(themeId);
        const style = editor.dom.create('style', {}, `
			/* Avoid showing highlights when the user has the find dialog open and
			   there are TinyMCE-provided search results */
			body:not(:has(span.mce-match-marker)) {
				::highlight(${searchHighlightKey}) {
					background-color: ${theme.searchMarkerBackgroundColor};
					color: ${theme.searchMarkerColor};
				}
			}
		`);
        editor.getDoc().head.appendChild(style);
        return () => {
            style.remove();
        };
    }, [editor, themeId]);
};
const useHighlighter = (editor, searchRegexes) => {
    return (0, react_1.useMemo)(() => {
        if (!editor) {
            return { canHighlight: false };
        }
        const editorWindow = editor.getWin();
        const ranges = new Map();
        let highlight = undefined;
        const processNode = (node) => {
            var _a, _b;
            ranges.delete(node);
            const findChildAtTextOffset = (parent, offset) => {
                if (offset > parent.textContent.length)
                    return null;
                if (parent.nodeName === '#text') {
                    return { node: parent, offset };
                }
                let start = 0;
                for (const child of parent.childNodes) {
                    if (child.nodeName === '#comment')
                        continue;
                    const found = findChildAtTextOffset(child, offset - start);
                    start += child.textContent.length;
                    if (found)
                        return found;
                }
                return null;
            };
            const buildRange = (parent, startIndex, endIndex) => {
                var _a, _b, _c, _d;
                const range = new editorWindow.Range();
                const start = findChildAtTextOffset(parent, startIndex);
                const end = findChildAtTextOffset(parent, endIndex);
                range.setStart((_a = start === null || start === void 0 ? void 0 : start.node) !== null && _a !== void 0 ? _a : parent, (_b = start === null || start === void 0 ? void 0 : start.offset) !== null && _b !== void 0 ? _b : 0);
                range.setEnd((_c = end === null || end === void 0 ? void 0 : end.node) !== null && _c !== void 0 ? _c : parent, (_d = end === null || end === void 0 ? void 0 : end.offset) !== null && _d !== void 0 ? _d : parent.textContent.length);
                return range;
            };
            // Process highlights at the paragraph level, where possible, to pick up formatting that crosses Markdown boundaries
            const isLeaf = node.nodeName === '#text' || node.nodeName === 'P';
            if (isLeaf) {
                const childRanges = [];
                for (const term of searchRegexes) {
                    const matches = node.textContent.matchAll(term);
                    for (const match of matches) {
                        const startIndex = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
                        const endIndex = ((_b = match.index) !== null && _b !== void 0 ? _b : 0) + match[0].length;
                        if (startIndex !== endIndex) {
                            childRanges.push(buildRange(node, startIndex, endIndex));
                        }
                    }
                }
                if (childRanges.length > 0) {
                    ranges.set(node, childRanges);
                }
            }
            else {
                for (const child of node.childNodes) {
                    processNode(child);
                }
            }
        };
        const closestParagraph = (node) => { var _a; return (_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.closest('p'); };
        const onNodeChanged = (node) => {
            var _a;
            highlight === null || highlight === void 0 ? void 0 : highlight.clear();
            processNode((_a = closestParagraph(node)) !== null && _a !== void 0 ? _a : node);
            highlight = new editorWindow.Highlight(...[...ranges.values()].flat());
            editorWindow.CSS.highlights.set(searchHighlightKey, highlight);
        };
        const onNodeRemoved = (node, parent) => {
            var _a;
            const removeFromRanges = (node) => {
                ranges.delete(node);
                for (const child of node.childNodes) {
                    removeFromRanges(child);
                }
            };
            removeFromRanges(node);
            // Handle the case where removing a node created a match:
            onNodeChanged((_a = closestParagraph(parent)) !== null && _a !== void 0 ? _a : parent);
        };
        const clearHighlights = () => {
            highlight === null || highlight === void 0 ? void 0 : highlight.clear();
            editorWindow.CSS.highlights.delete(searchHighlightKey);
            ranges.clear();
        };
        return { onNodeChanged, onNodeRemoved, clearHighlights, canHighlight: searchRegexes.length > 0 };
    }, [editor, searchRegexes]);
};
const useHighlightedSearchTerms = (editor, searchTerms, themeId) => {
    const searchRegexes = useSearchRegexes(searchTerms);
    useHighlightStyleSheet(editor, themeId);
    const highlighter = useHighlighter(editor, searchRegexes);
    (0, react_1.useEffect)(() => {
        if (!editor || !highlighter.canHighlight) {
            return () => { };
        }
        const editorBody = editor.getBody();
        const onNodeChange = ({ element }) => {
            highlighter.onNodeChanged(element);
        };
        const onKeyUp = (_event) => {
            // Use selectedNode and not event.target -- event.target seems to always point
            // to the body.
            const selectedNode = editor.selection.getNode();
            if (selectedNode) {
                highlighter.onNodeChanged(selectedNode);
            }
        };
        const onSetContent = () => {
            highlighter.onNodeChanged(editorBody);
        };
        editor.on('NodeChange', onNodeChange);
        editor.on('SetContent', onSetContent);
        // NodeChange doesn't fire while typing, so we also need keyup
        editor.on('keyup', onKeyUp);
        // NodeChange also doesn't fire for certain DOM changes (e.g. when TinyMCE-provided search highlights are added/removed):
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.removedNodes) {
                    highlighter.onNodeRemoved(node, mutation.target);
                }
                for (const node of mutation.addedNodes) {
                    highlighter.onNodeChanged(node);
                }
            }
        });
        observer.observe(editorBody, { subtree: true, childList: true });
        onSetContent();
        return () => {
            observer.disconnect();
            highlighter.clearHighlights();
            editor.off('NodeChange', onNodeChange);
            editor.off('keyup', onKeyUp);
            editor.off('SetContent', onSetContent);
        };
    }, [editor, highlighter]);
};
exports.default = useHighlightedSearchTerms;
//# sourceMappingURL=useHighlightedSearchTerms.js.map