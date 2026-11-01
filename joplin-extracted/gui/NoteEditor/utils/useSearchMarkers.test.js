"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const react_1 = require("@testing-library/react");
const useSearchMarkers_1 = __importDefault(require("./useSearchMarkers"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const SearchEngine_1 = __importDefault(require("@joplin/lib/services/search/SearchEngine"));
const time_1 = require("@joplin/utils/time");
const semanticSearch_1 = require("@joplin/lib/testing/ai/semanticSearch");
describe('useSearchMarkers', () => {
    beforeEach(async () => {
        await (0, test_utils_1.setupDatabaseAndSynchronizer)(1);
        await (0, test_utils_1.switchClient)(1);
        await (0, semanticSearch_1.setUpSemanticSearch)();
    });
    afterEach(async () => {
        await (0, semanticSearch_1.tearDownSemanticSearch)();
    });
    it.each([
        {
            label: 'should return markers for semantic search results',
            noteBody: 'example example example example',
            searchQuery: 'examples example example example',
            expected: [{ type: 'text', value: 'example example example example' }],
        },
        {
            label: 'should exclude Markdown from keywords',
            noteBody: '*test-test-test-test*! test',
            // cSpell:disable
            searchQuery: 'testt-test-test-test',
            // cSpell:enable
            expected: [{ type: 'text', value: 'test-test-test-test' }],
        },
    ])('should return keywords for semantic search matches: $label', async ({ noteBody, searchQuery, expected }) => {
        const note = await Note_1.default.save({ title: 'test', body: noteBody });
        await (0, semanticSearch_1.updateSearchIndex)();
        await (0, test_utils_1.runWithFakeTimers)(async () => {
            const searchResults = await SearchEngine_1.default.instance().search(searchQuery);
            const test = (0, react_1.renderHook)(() => (0, useSearchMarkers_1.default)({
                showLocalSearch: false,
                localSearchMarkerOptions: () => null,
                noteId: note.id,
                searchResults,
                searchId: '1',
                searches: [{ id: '1', query_pattern: searchQuery, query_type: 1, type_: -1, title: searchQuery }],
                highlightedWords: [],
                noteTitle: note.title,
            }));
            await (0, react_1.act)(() => jest.advanceTimersByTimeAsync(5 * time_1.Second));
            await (0, react_1.waitFor)(() => {
                const result = test.result.current;
                expect(result.keywords).toMatchObject(expected);
            }, { timeout: 30 * time_1.Second });
            test.unmount();
        });
    });
});
//# sourceMappingURL=useSearchMarkers.test.js.map