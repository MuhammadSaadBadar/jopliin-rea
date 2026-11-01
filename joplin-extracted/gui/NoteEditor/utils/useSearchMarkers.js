"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSearchMarkers;
const useQueuedAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useQueuedAsyncEffect"));
const SearchService_1 = __importDefault(require("@joplin/lib/services/ai/SearchService"));
const SearchEngine_1 = require("@joplin/lib/services/search/SearchEngine");
const time_1 = require("@joplin/utils/time");
const react_1 = require("react");
function defaultSearchMarkers() {
    return {
        keywords: [],
        options: {
            searchTimestamp: 0,
            selectedIndex: 0,
            separateWordSearch: false,
        },
    };
}
// The indexer can prepend the note title to the first chunk:
// Remove it so that the results are exact substrings of the note body
const removeNoteTitle = (result, noteTitle) => {
    if (result.chunkIndex !== 0)
        return result;
    let chunkText = result.chunkText.trim();
    while (chunkText.startsWith(`${noteTitle}\n`)) {
        chunkText = chunkText.substring(noteTitle.length).trim();
    }
    return Object.assign(Object.assign({}, result), { chunkText });
};
// Returns matching substrings of the note for the given search query
const useSemanticSearchMatches = ({ query, noteId, noteTitle }) => {
    const [matchingChunks, setMatchingChunks] = (0, react_1.useState)([]);
    const matchingChunksRef = (0, react_1.useRef)(matchingChunks);
    matchingChunksRef.current = matchingChunks;
    (0, react_1.useEffect)(() => {
        if (!query && matchingChunksRef.current.length !== 0) {
            setMatchingChunks([]);
        }
    }, [query]);
    const noteTitleRef = (0, react_1.useRef)(noteTitle);
    noteTitleRef.current = noteTitle;
    (0, useQueuedAsyncEffect_1.default)(async (event) => {
        if (!query) {
            return;
        }
        const results = await SearchService_1.default.instance().search({
            query: { text: query }, scope: { type: 'note', noteId }, relevance: 'strict',
        });
        if (event.cancelled)
            return;
        const matches = [];
        for (const result of results) {
            const bestMatch = await SearchService_1.default.instance().bestMatchInResult(query, removeNoteTitle(result, noteTitleRef.current));
            if (event.cancelled)
                return;
            matches.push(bestMatch);
        }
        setMatchingChunks(matches);
    }, [query, noteId], { interval: time_1.Second });
    return matchingChunks;
};
function useSearchMarkers({ showLocalSearch, localSearchMarkerOptions, noteId, searchResults, searchId, searches, highlightedWords, noteTitle, }) {
    const currentNoteSearchResult = (0, react_1.useMemo)(() => {
        return searchResults.find(result => result.id === noteId);
    }, [searchResults, noteId]);
    const semanticSearchQuery = (0, react_1.useMemo)(() => {
        if (!currentNoteSearchResult)
            return null;
        if (!currentNoteSearchResult.searchType.includes(SearchEngine_1.SearchType.Semantic))
            return null;
        const search = searches.find(search => search.id === searchId);
        return search.query_pattern;
    }, [searches, searchId, currentNoteSearchResult]);
    const semanticSearchMatches = useSemanticSearchMatches({
        query: semanticSearchQuery, noteId, noteTitle,
    });
    return (0, react_1.useMemo)(() => {
        if (showLocalSearch)
            return localSearchMarkerOptions();
        const output = defaultSearchMarkers();
        output.keywords = highlightedWords !== null && highlightedWords !== void 0 ? highlightedWords : [];
        if (semanticSearchMatches.length) {
            output.keywords = output.keywords.concat(semanticSearchMatches.map(match => ({ type: 'text', accuracy: 'partial', value: match, source: 'semantic' })));
        }
        return output;
    }, [highlightedWords, showLocalSearch, localSearchMarkerOptions, semanticSearchMatches]);
}
//# sourceMappingURL=useSearchMarkers.js.map