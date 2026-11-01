"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const usePrevious_1 = __importDefault(require("../../../../hooks/usePrevious"));
const useEditorSearchExtension_1 = __importDefault(require("./useEditorSearchExtension"));
const debounce = require('debounce');
const useEditorSearchHandler = (props) => {
    const { webviewRef, editorRef, renderedBody, noteContent, searchMarkers, showEditorMarkers, } = props;
    const { onSetMarkersRef } = (0, useEditorSearchExtension_1.default)();
    const previousContent = (0, usePrevious_1.default)(noteContent);
    const previousRenderedBody = (0, usePrevious_1.default)(renderedBody);
    const previousSearchMarkers = (0, usePrevious_1.default)(searchMarkers);
    const showEditorMarkersRef = (0, react_1.useRef)(showEditorMarkers);
    showEditorMarkersRef.current = showEditorMarkers;
    // Fixes https://github.com/laurent22/joplin/issues/7565
    const debouncedMarkers = (0, react_1.useMemo)(() => debounce((searchMarkers) => {
        if (!onSetMarkersRef.current)
            return;
        if (showEditorMarkersRef.current) {
            const matches = onSetMarkersRef.current(editorRef.current, searchMarkers.keywords, searchMarkers.options);
            props.setLocalSearchResultCount(matches);
        }
        else {
            onSetMarkersRef.current(editorRef.current, searchMarkers.keywords, Object.assign(Object.assign({}, searchMarkers.options), { showEditorMarkers: false }));
        }
    }, 50), [editorRef, onSetMarkersRef, props.setLocalSearchResultCount]);
    (0, react_1.useEffect)(() => {
        if (!searchMarkers)
            return () => { };
        // If there is a currently active search, it's important to re-search the text as the user
        // types. However this is slow for performance so we ONLY want it to happen when there is
        // a search
        // Note that since the CodeMirror component also needs to handle the viewer pane, we need
        // to check if the rendered body has changed too (it will be changed with a delay after
        // props.content has been updated).
        const textChanged = searchMarkers.keywords.length > 0 && (noteContent !== previousContent || renderedBody !== previousRenderedBody);
        if (webviewRef.current && (searchMarkers !== previousSearchMarkers || textChanged)) {
            webviewRef.current.send('setMarkers', searchMarkers.keywords, searchMarkers.options);
            debouncedMarkers(searchMarkers);
        }
        return () => { };
    }, [
        onSetMarkersRef,
        webviewRef,
        searchMarkers,
        previousSearchMarkers,
        props.setLocalSearchResultCount,
        noteContent,
        previousContent,
        previousRenderedBody,
        renderedBody,
        debouncedMarkers,
    ]);
    return {
        // Returned to allow quickly setting the initial search markers just after the editor loads.
        onSetInitialMarkersRef: onSetMarkersRef,
    };
};
exports.default = useEditorSearchHandler;
//# sourceMappingURL=useEditorSearchHandler.js.map