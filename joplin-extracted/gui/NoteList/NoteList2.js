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
const React = __importStar(require("react"));
const react_1 = require("react");
const BaseModel_1 = __importStar(require("@joplin/lib/BaseModel"));
const noteListType_1 = require("@joplin/lib/services/plugins/api/noteListType");
const readOnly_1 = require("@joplin/lib/models/utils/readOnly");
const ItemChange_1 = __importDefault(require("@joplin/lib/models/ItemChange"));
const NoteListItem_1 = __importDefault(require("../NoteListItem/NoteListItem"));
const useItemCss_1 = __importDefault(require("./utils/useItemCss"));
const useOnContextMenu_1 = __importDefault(require("../NoteListItem/utils/useOnContextMenu"));
const useVisibleRange_1 = __importDefault(require("./utils/useVisibleRange"));
const useScroll_1 = __importDefault(require("./utils/useScroll"));
const useFocusNote_1 = __importDefault(require("./utils/useFocusNote"));
const useOnNoteClick_1 = __importDefault(require("./utils/useOnNoteClick"));
const useMoveNote_1 = __importDefault(require("./utils/useMoveNote"));
const useOnKeyDown_1 = __importDefault(require("./utils/useOnKeyDown"));
const focusElementNoteList = __importStar(require("./commands/focusElementNoteList"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const useDragAndDrop_1 = __importDefault(require("./utils/useDragAndDrop"));
const trash_1 = require("@joplin/lib/services/trash");
const getEmptyFolderMessage_1 = __importDefault(require("@joplin/lib/components/shared/NoteList/getEmptyFolderMessage"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const locale_1 = require("@joplin/lib/locale");
const useActiveDescendantId_1 = __importDefault(require("./utils/useActiveDescendantId"));
const getNoteElementIdFromJoplinId_1 = __importDefault(require("../NoteListItem/utils/getNoteElementIdFromJoplinId"));
const useFocusVisible_1 = __importDefault(require("./utils/useFocusVisible"));
const reducer_1 = require("@joplin/lib/reducer");
const react_redux_1 = require("react-redux");
const useOnNoteDoubleClick_1 = __importDefault(require("./utils/useOnNoteDoubleClick"));
const reselect_1 = require("reselect");
const reducer_2 = require("@joplin/lib/services/share/reducer");
const useAutoScroll_1 = __importDefault(require("./utils/useAutoScroll"));
const selectPublishedNoteIds = (0, reselect_1.createSelector)((state) => state.shareService.shares, shares => shares.filter(s => s.type === reducer_2.ShareType.Note && !!s.note_id).map(s => s.note_id));
const commands = {
    focusElementNoteList,
};
const NoteList = (props) => {
    const listRef = (0, react_1.useRef)(null);
    const itemRefs = (0, react_1.useRef)({});
    const listRenderer = props.listRenderer;
    const itemSize = (0, react_1.useMemo)(() => {
        return {
            width: listRenderer.itemSize.width ? listRenderer.itemSize.width : props.size.width,
            height: listRenderer.itemSize.height,
        };
    }, [listRenderer.itemSize, props.size.width]);
    const itemsPerLine = (0, react_1.useMemo)(() => {
        if (listRenderer.flow === noteListType_1.ItemFlow.TopToBottom) {
            return 1;
        }
        else {
            return Math.max(1, Math.floor(props.size.width / itemSize.width));
        }
    }, [listRenderer.flow, props.size.width, itemSize.width]);
    const { scrollTop, onScroll, makeItemIndexVisible } = (0, useScroll_1.default)(itemsPerLine, props.notes.length, itemSize, props.size, listRef);
    const [startNoteIndex, endNoteIndex, startLineIndex, endLineIndex, totalLineCount, visibleItemCount] = (0, useVisibleRange_1.default)(itemsPerLine, scrollTop, props.size, itemSize, props.notes.length);
    const { activeNoteId, setActiveNoteId } = (0, useActiveDescendantId_1.default)(props.selectedFolderId, props.selectedNoteIds);
    const focusNote = (0, useFocusNote_1.default)(listRef, props.notes, makeItemIndexVisible, setActiveNoteId);
    const moveNote = (0, useMoveNote_1.default)(props.notesParentType, props.noteSortOrder, props.selectedNoteIds, props.selectedFolderId, props.uncompletedTodosOnTop, props.showCompletedTodos, props.notes, props.selectedFolderInTrash, makeItemIndexVisible, focusNote, props.dispatch);
    const noteItemStyle = (0, react_1.useMemo)(() => {
        return {
            width: 'auto',
            height: itemSize.height,
        };
    }, [itemSize.height]);
    const noteListStyle = (0, react_1.useMemo)(() => {
        return {
            width: props.size.width,
            height: props.size.height,
        };
    }, [props.size]);
    const onNoteClick = (0, useOnNoteClick_1.default)(props.dispatch, focusNote);
    const onNoteDoubleClick = (0, useOnNoteDoubleClick_1.default)();
    const onKeyDown = (0, useOnKeyDown_1.default)(activeNoteId, props.selectedNoteIds, moveNote, makeItemIndexVisible, focusNote, props.notes, props.dispatch, visibleItemCount, props.notes.length, listRenderer.flow, itemsPerLine, props.showCompletedTodos, props.uncompletedTodosOnTop);
    (0, useItemCss_1.default)(listRenderer.itemCss);
    (0, react_1.useEffect)(() => {
        CommandService_1.default.instance().registerRuntime(commands.focusElementNoteList.declaration.name, commands.focusElementNoteList.runtime(focusNote));
        return () => {
            CommandService_1.default.instance().unregisterRuntime(commands.focusElementNoteList.declaration.name);
        };
    }, [focusNote]);
    const selectedNoteId = props.selectedNoteIds.length === 1 ? props.selectedNoteIds[0] : '';
    const targetIndex = props.notes.findIndex(note => note.id === selectedNoteId);
    (0, useAutoScroll_1.default)(selectedNoteId, props.selectedFolderId, targetIndex, makeItemIndexVisible);
    const onItemContextMenu = (0, useOnContextMenu_1.default)(props.selectedNoteIds, props.selectedFolderId, props.notes, props.dispatch, props.watchedNoteFiles, props.plugins, props.customCss);
    const { onDragStart, onDragOver, onDrop, dragOverTargetNoteIndex } = (0, useDragAndDrop_1.default)(props.parentFolderIsReadOnly, props.selectedNoteIds, props.selectedFolderId, listRef, scrollTop, itemSize, props.notesParentType, props.noteSortOrder, props.uncompletedTodosOnTop, props.showCompletedTodos, listRenderer.flow, itemsPerLine, props.selectedFolderInTrash);
    // 2024-04-01: Whatever the below effect is supposed to be doing has been lost in time and even
    // if it's doing something useful it should be refactored. In my tests, removing it doesn't
    // affect anything - including scrolling with the keyboard and switching notes so there's a
    // chance that whatever it's doing is being done more cleanly somewhere else. If a focus
    // related-bug is found, it should be fixed from scratch, without touching this event, although
    // it could possibly be used as a reference.
    //
    // * * *
    // const previousSelectedNoteIds = usePrevious(props.selectedNoteIds, []);
    // const previousNoteCount = usePrevious(props.notes.length, 0);
    // const previousVisible = usePrevious(props.visible, false);
    // useEffect(() => {
    // 	if (previousSelectedNoteIds !== props.selectedNoteIds && props.selectedNoteIds.length === 1) {
    // 		const id = props.selectedNoteIds[0];
    // 		const doRefocus = props.notes.length < previousNoteCount && !props.focusedField;
    // 		for (let i = 0; i < props.notes.length; i++) {
    // 			if (props.notes[i].id === id) {
    // 				makeItemIndexVisible(i);
    // 				if (doRefocus) {
    // 					const ref = itemRefs.current[id];
    // 					if (ref) {
    // 						focus('NoteList::doRefocus', ref);
    // 					}
    // 				}
    // 				break;
    // 			}
    // 		}
    // 	}
    // }, [makeItemIndexVisible, previousSelectedNoteIds, previousNoteCount, previousVisible, props.selectedNoteIds, props.notes, props.focusedField, props.visible]);
    const { focusVisible, onFocus, onBlur, onKeyUp } = (0, useFocusVisible_1.default)(listRef, () => {
        focusNote(activeNoteId);
    });
    const highlightedWords = (0, react_1.useMemo)(() => {
        if (props.notesParentType === 'Search') {
            const query = BaseModel_1.default.byId(props.searches, props.selectedSearchId);
            if (query)
                return props.highlightedWords;
        }
        return [];
    }, [props.notesParentType, props.searches, props.selectedSearchId, props.highlightedWords]);
    const renderEmptyList = () => {
        if (props.notes.length)
            return null;
        // Role status is necessary for the screenreader to announce that the list is empty, since when there are
        // zero items there is not list to render
        return React.createElement("div", { className: "emptylist", role: "status" }, (0, getEmptyFolderMessage_1.default)(props.folders, props.selectedFolderId));
    };
    const renderFiller = (key, style) => {
        if (!props.notes.length)
            return null;
        if (style.height <= 0)
            return null;
        return React.createElement("div", { key: key, style: style });
    };
    const renderNotes = () => {
        if (!props.notes.length)
            return [];
        const output = [];
        for (let i = startNoteIndex; i <= endNoteIndex; i++) {
            const note = props.notes[i];
            const isSelected = props.selectedNoteIds.includes(note.id);
            output.push(React.createElement(NoteListItem_1.default, { key: note.id, ref: el => { itemRefs.current[note.id] = el; }, index: i, dragIndex: dragOverTargetNoteIndex, noteCount: props.notes.length, itemSize: itemSize, onChange: listRenderer.onChange, onClick: onNoteClick, onDoubleClick: onNoteDoubleClick, onContextMenu: onItemContextMenu, onDragStart: onDragStart, onDragOver: onDragOver, style: noteItemStyle, highlightedWords: highlightedWords, isProvisional: props.provisionalNoteIds.includes(note.id), flow: listRenderer.flow, note: note, tabIndex: -1, focusVisible: focusVisible && activeNoteId === note.id, isSelected: isSelected, isWatched: props.watchedNoteFiles.includes(note.id), isPublished: props.publishedNoteIds.includes(note.id) || (!!note.is_shared && !note.share_id) || props.isFolderPublished, listRenderer: listRenderer, dispatch: props.dispatch, columns: props.columns }));
        }
        return output;
    };
    const topFillerHeight = startLineIndex * itemSize.height;
    const bottomFillerHeight = (totalLineCount - endLineIndex - 1) * itemSize.height;
    const fillerBaseStyle = (0, react_1.useMemo)(() => {
        // return { width: 'auto', border: '1px solid red', backgroundColor: 'green' };
        return { width: 'auto' };
    }, []);
    const topFillerStyle = (0, react_1.useMemo)(() => {
        return Object.assign(Object.assign({}, fillerBaseStyle), { height: topFillerHeight });
    }, [fillerBaseStyle, topFillerHeight]);
    const bottomFillerStyle = (0, react_1.useMemo)(() => {
        return Object.assign(Object.assign({}, fillerBaseStyle), { height: bottomFillerHeight });
    }, [fillerBaseStyle, bottomFillerHeight]);
    const notesStyle = (0, react_1.useMemo)(() => {
        const output = {};
        if (listRenderer.flow === noteListType_1.ItemFlow.LeftToRight) {
            output.flexFlow = 'row wrap';
        }
        else {
            output.flexDirection = 'column';
        }
        return output;
    }, [listRenderer.flow]);
    const onContainerContextMenu = (0, react_1.useCallback)((event) => {
        const isFromKeyboard = event.button === -1;
        if (event.isDefaultPrevented() || !isFromKeyboard)
            return;
        onItemContextMenu({ itemId: activeNoteId });
    }, [onItemContextMenu, activeNoteId]);
    const hasNotes = !!props.notes.length;
    return (React.createElement("div", { role: hasNotes ? 'listbox' : 'group', "aria-label": hasNotes ? (0, locale_1._)('Notes') : null, "aria-activedescendant": activeNoteId ? (0, getNoteElementIdFromJoplinId_1.default)(activeNoteId) : undefined, "aria-multiselectable": hasNotes ? true : undefined, tabIndex: 0, onFocus: onFocus, onBlur: onBlur, className: "note-list", style: noteListStyle, ref: listRef, onScroll: onScroll, onKeyDown: onKeyDown, onKeyUp: onKeyUp, onDrop: onDrop, onContextMenu: onContainerContextMenu, id: 'notes-list' },
        renderEmptyList(),
        renderFiller('top', topFillerStyle),
        React.createElement("div", { className: 'notes', role: 'presentation', style: notesStyle }, renderNotes()),
        renderFiller('bottom', bottomFillerStyle)));
};
const mapStateToProps = (state, ownProps) => {
    const selectedFolder = state.notesParentType === 'Folder' ? Folder_1.default.byId(state.folders, state.selectedFolderId) : null;
    const userId = state.settings['sync.userId'];
    const windowState = reducer_1.stateUtils.windowStateById(state, ownProps.windowId);
    return {
        notes: windowState.notes,
        folders: state.folders,
        selectedNoteIds: windowState.selectedNoteIds,
        selectedFolderId: windowState.selectedFolderId,
        themeId: state.settings.theme,
        notesParentType: state.notesParentType,
        searches: state.searches,
        selectedSearchId: windowState.selectedSearchId,
        watchedNoteFiles: state.watchedNoteFiles,
        publishedNoteIds: selectPublishedNoteIds(state),
        isFolderPublished: state.notesParentType === 'Folder' ? (0, reducer_2.isFolderPublished)(state, windowState.selectedFolderId) : false,
        provisionalNoteIds: state.provisionalNoteIds,
        isInsertingNotes: state.isInsertingNotes,
        noteSortOrder: state.settings['notes.sortOrder.field'],
        uncompletedTodosOnTop: state.settings.uncompletedTodosOnTop,
        showCompletedTodos: state.settings.showCompletedTodos,
        highlightedWords: state.highlightedWords,
        plugins: state.pluginService.plugins,
        customCss: state.customViewerCss,
        focusedField: state.focusedField,
        parentFolderIsReadOnly: state.notesParentType === 'Folder' && selectedFolder ? (0, readOnly_1.itemIsReadOnlySync)(BaseModel_1.ModelType.Folder, ItemChange_1.default.SOURCE_UNSPECIFIED, selectedFolder, userId, state.shareService) : false,
        selectedFolderInTrash: (0, trash_1.itemIsInTrash)(selectedFolder),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(NoteList);
//# sourceMappingURL=NoteList2.js.map