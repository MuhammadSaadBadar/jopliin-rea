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
exports.Root = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const SearchInput_1 = __importDefault(require("../lib/SearchInput/SearchInput"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const reducer_1 = require("@joplin/lib/reducer");
const BaseModel_1 = __importDefault(require("@joplin/lib/BaseModel"));
const uuid_1 = __importDefault(require("@joplin/lib/uuid"));
const react_redux_1 = require("react-redux");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const debounce = require('debounce');
const styled_components_1 = __importDefault(require("styled-components"));
exports.Root = styled_components_1.default.div `
	position: relative;
	display: flex;
	width: 100%;
	min-width: 30px;
`;
function SearchBar(props) {
    const [query, setQuery] = (0, react_1.useState)('');
    const [searchStarted, setSearchStarted] = (0, react_1.useState)(false);
    const searchId = (0, react_1.useRef)(uuid_1.default.create());
    (0, react_1.useEffect)(() => {
        function search(searchId, query, dispatch) {
            dispatch({
                type: 'SEARCH_UPDATE',
                search: {
                    id: searchId,
                    title: query,
                    query_pattern: query,
                    query_folder_id: null,
                    type_: BaseModel_1.default.TYPE_SEARCH,
                },
            });
            dispatch({
                type: 'SEARCH_SELECT',
                id: searchId,
            });
        }
        const debouncedSearch = debounce(search, 500);
        if (searchStarted)
            debouncedSearch(searchId.current, query, props.dispatch);
        return () => {
            debouncedSearch.clear();
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [query, searchStarted]);
    const onExitSearch = (0, react_1.useCallback)(async (navigateAway = true) => {
        setQuery('');
        setSearchStarted(false);
        if (navigateAway) {
            const note = props.selectedNoteId ? await Note_1.default.load(props.selectedNoteId) : null;
            if (note) {
                props.dispatch({
                    type: 'FOLDER_AND_NOTE_SELECT',
                    folderId: note.parent_id,
                    noteId: note.id,
                });
            }
            else {
                const folderId = Setting_1.default.value('activeFolderId');
                if (folderId) {
                    props.dispatch({
                        type: 'FOLDER_SELECT',
                        id: folderId,
                    });
                }
            }
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.selectedNoteId]);
    function onChange(event) {
        if (event.value.length === 0) {
            // Revert to previous state if query string becomes empty
            void onExitSearch();
            return;
        }
        setSearchStarted(true);
        setQuery(event.value);
    }
    function onFocus() {
        props.dispatch({
            type: 'FOCUS_SET',
            field: 'globalSearch',
        });
    }
    function onBlur() {
        // Do it after a delay so that the "Clear" button
        // can be clicked on (otherwise the field loses focus
        // and is resized before the click event has been processed)
        setTimeout(() => {
            props.dispatch({
                type: 'FOCUS_CLEAR',
                field: 'globalSearch',
            });
        }, 300);
    }
    const onKeyDown = (0, react_1.useCallback)((event) => {
        if (event.key === 'Escape') {
            if (document.activeElement)
                (0, focusHandler_1.blur)('SearchBar::onKeyDown', document.activeElement);
            void onExitSearch();
        }
    }, [onExitSearch]);
    const onSearchButtonClick = (0, react_1.useCallback)(() => {
        if (props.isFocused || searchStarted) {
            void onExitSearch();
        }
        else {
            setSearchStarted(true);
            (0, focusHandler_1.focus)('SearchBar::onSearchButtonClick', props.inputRef.current);
            props.dispatch({
                type: 'FOCUS_SET',
                field: 'globalSearch',
            });
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [onExitSearch, props.isFocused, searchStarted]);
    (0, react_1.useEffect)(() => {
        if (props.notesParentType !== 'Search') {
            void onExitSearch(false);
        }
    }, [props.notesParentType, onExitSearch]);
    // When the searchbar is remounted, exit the search if it was previously open
    // or else other buttons stay hidden (e.g. when opening Layout Editor and closing it)
    // https://github.com/laurent22/joplin/issues/5953
    (0, react_1.useEffect)(() => {
        if (props.notesParentType === 'Search' || props.isFocused) {
            if (props.isFocused) {
                props.dispatch({
                    type: 'FOCUS_CLEAR',
                    field: 'globalSearch',
                });
            }
            void onExitSearch(true);
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
    // if the globalQuery is not undefined and is not equal to the current value of query changes the query to global query. Else the current query remains the same.
    // used  setQuery((previousQuery)=>{}) to prevent linter error asking to have [query] in the dependency array, since this useEffect would then run every time the query is changed
    (0, react_1.useEffect)(() => {
        if (props.globalQuery !== undefined) {
            setQuery((previousQuery) => {
                if (props.globalQuery !== previousQuery) {
                    if (props.globalQuery.length > 0) {
                        setSearchStarted(true);
                    }
                    return props.globalQuery;
                }
                return previousQuery;
            });
        }
    }, [props.globalQuery]);
    return (React.createElement(exports.Root, { className: "search-bar" },
        React.createElement(SearchInput_1.default, { inputRef: props.inputRef, value: query, onChange: onChange, onFocus: onFocus, onBlur: onBlur, onKeyDown: onKeyDown, onSearchButtonClick: onSearchButtonClick, searchStarted: searchStarted, "aria-controls": 'notes-list' })));
}
const mapStateToProps = (state, ownProps) => {
    const windowState = reducer_1.stateUtils.windowStateById(state, ownProps.windowId);
    let globalQuery = '';
    if (windowState.notesParentType === 'Search' && windowState.selectedSearchId) {
        const activeSearch = state.searches.find((s) => s.id === windowState.selectedSearchId);
        if (activeSearch && activeSearch.query_pattern) {
            globalQuery = activeSearch.query_pattern;
        }
    }
    return {
        notesParentType: windowState.notesParentType,
        selectedNoteId: reducer_1.stateUtils.selectedNoteId(windowState),
        isFocused: state.focusedField === 'globalSearch',
        globalQuery: globalQuery,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(SearchBar);
//# sourceMappingURL=SearchBar.js.map