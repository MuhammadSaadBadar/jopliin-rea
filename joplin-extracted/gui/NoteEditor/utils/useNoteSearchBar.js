"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useNoteSearchBar;
const react_1 = require("react");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const logger = Logger_1.default.create('useNoteSearchBar');
const queryMaxLength = 1000;
function defaultLocalSearch() {
    return {
        query: '',
        selectedIndex: 0,
        resultCount: 0,
        searching: false,
        timestamp: 0,
    };
}
function useNoteSearchBar({ noteSearchBarRef }) {
    const [showLocalSearch, setShowLocalSearch] = (0, react_1.useState)(false);
    const [localSearch, setLocalSearch] = (0, react_1.useState)(defaultLocalSearch());
    (0, react_1.useEffect)(() => {
        if (showLocalSearch && noteSearchBarRef.current) {
            (0, focusHandler_1.focus)('useNoteSearchBar', noteSearchBarRef.current);
        }
    }, [showLocalSearch, noteSearchBarRef]);
    const onChange = (0, react_1.useCallback)((query) => {
        // A query that's too long would make CodeMirror throw an exception
        // which would crash the app.
        // https://github.com/laurent22/joplin/issues/5380
        if (query.length > queryMaxLength) {
            logger.warn(`Query is longer than ${queryMaxLength} characters - it is going to be trimmed`);
            query = query.substr(0, queryMaxLength);
        }
        setLocalSearch((prev) => {
            return {
                query: query,
                selectedIndex: 0,
                timestamp: Date.now(),
                resultCount: prev.resultCount,
                searching: true,
            };
        });
    }, []);
    const noteSearchBarNextPrevious = (0, react_1.useCallback)((inc) => {
        setLocalSearch((prev) => {
            const ls = Object.assign({}, prev);
            ls.selectedIndex += inc;
            ls.timestamp = Date.now();
            if (ls.selectedIndex < 0)
                ls.selectedIndex = ls.resultCount - 1;
            if (ls.selectedIndex >= ls.resultCount)
                ls.selectedIndex = 0;
            return ls;
        });
    }, []);
    const onNext = (0, react_1.useCallback)(() => {
        noteSearchBarNextPrevious(+1);
    }, [noteSearchBarNextPrevious]);
    const onPrevious = (0, react_1.useCallback)(() => {
        noteSearchBarNextPrevious(-1);
    }, [noteSearchBarNextPrevious]);
    const onClose = (0, react_1.useCallback)(() => {
        setShowLocalSearch(false);
        setLocalSearch(defaultLocalSearch());
        void CommandService_1.default.instance().execute('focusElementNoteBody');
    }, []);
    const setResultCount = (0, react_1.useCallback)((count) => {
        setLocalSearch((prev) => {
            if (prev.resultCount === count && !prev.searching)
                return prev;
            return Object.assign(Object.assign({}, prev), { resultCount: count, searching: false });
        });
    }, []);
    const searchMarkers = (0, react_1.useCallback)(() => {
        return {
            options: {
                selectedIndex: localSearch.selectedIndex,
                separateWordSearch: false,
                searchTimestamp: localSearch.timestamp,
                withSelection: true,
            },
            keywords: [
                {
                    type: 'text',
                    value: localSearch.query,
                    accuracy: 'partially',
                },
            ],
        };
    }, [localSearch]);
    return { localSearch, onChange, onNext, onPrevious, onClose, setResultCount, showLocalSearch, setShowLocalSearch, searchMarkers };
}
//# sourceMappingURL=useNoteSearchBar.js.map