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
const SearchBar_1 = __importDefault(require("../SearchBar/SearchBar"));
const Button_1 = __importStar(require("../Button/Button"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const focusSearch_1 = require("./commands/focusSearch");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const notesSortOrderUtils_1 = require("@joplin/lib/services/sortOrder/notesSortOrderUtils");
const locale_1 = require("@joplin/lib/locale");
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const stateToWhenClauseContext_1 = __importDefault(require("../../services/commands/stateToWhenClauseContext"));
const trash_1 = require("@joplin/lib/services/trash");
const reducer_1 = require("@joplin/lib/reducer");
const NewWindowOrIFrame_1 = require("../NewWindowOrIFrame");
const StyledRoot = styled_components_1.default.div `
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	padding: ${(props) => props.padding}px;
	background-color: ${(props) => props.theme.backgroundColor3};
	gap: ${(props) => props.buttonVerticalGap}px;
`;
const StyledButton = (0, styled_components_1.default)(Button_1.default) `
	width: auto;
	height: 26px;
	min-height: 26px;
	min-width: 37px;
	max-width: none;
	white-space: nowrap;

  .fa, .fas {
    font-size: 11px;
  }
`;
const StyledPairButtonL = (0, styled_components_1.default)(Button_1.default) `
	border-radius: 3px 0 0 3px;
	min-width: ${(props) => (0, Button_1.buttonSizePx)(props)}px;
	max-width: ${(props) => (0, Button_1.buttonSizePx)(props)}px;
`;
const StyledPairButtonR = (0, styled_components_1.default)(Button_1.default) `
	min-width: 8px;
	border-radius: 0 3px 3px 0;
	border-width: 1px 1px 1px 0;
	width: auto;
`;
const TopRow = styled_components_1.default.div `
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
`;
const BottomRow = styled_components_1.default.div `
	display: flex;
	flex-direction: row;
	flex: 1 1 auto;
	gap: 8px;
`;
const SortOrderButtonsContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
`;
function NoteListControls(props) {
    const searchBarRef = (0, react_1.useRef)(null);
    const newTodoButtonRef = (0, react_1.useRef)(null);
    const noteControlsRef = (0, react_1.useRef)(null);
    const searchAndSortRef = (0, react_1.useRef)(null);
    const breakpoint = props.breakpoint;
    const dynamicBreakpoints = props.dynamicBreakpoints;
    const lineCount = props.lineCount;
    const noteButtonText = (0, react_1.useMemo)(() => {
        if (breakpoint === dynamicBreakpoints.Sm) {
            return '';
        }
        else if (breakpoint === dynamicBreakpoints.Md) {
            return (0, locale_1._)('note');
        }
        else {
            return (0, locale_1._)('New note');
        }
    }, [breakpoint, dynamicBreakpoints]);
    const todoButtonText = (0, react_1.useMemo)(() => {
        if (breakpoint === dynamicBreakpoints.Sm) {
            return '';
        }
        else if (breakpoint === dynamicBreakpoints.Md) {
            return (0, locale_1._)('to-do');
        }
        else {
            return (0, locale_1._)('New to-do');
        }
    }, [breakpoint, dynamicBreakpoints]);
    const noteIcon = (0, react_1.useMemo)(() => {
        if (breakpoint === dynamicBreakpoints.Sm) {
            return 'icon-note';
        }
        else {
            return 'fas fa-plus';
        }
    }, [breakpoint, dynamicBreakpoints]);
    const todoIcon = (0, react_1.useMemo)(() => {
        if (breakpoint === dynamicBreakpoints.Sm) {
            return 'far fa-check-square';
        }
        else {
            return 'fas fa-plus';
        }
    }, [breakpoint, dynamicBreakpoints]);
    const showTooltip = (0, react_1.useMemo)(() => {
        if (breakpoint === dynamicBreakpoints.Sm) {
            return true;
        }
        else {
            return false;
        }
    }, [breakpoint, dynamicBreakpoints.Sm]);
    (0, react_1.useEffect)(() => {
        if (lineCount === 1) {
            noteControlsRef.current.style.flexDirection = 'row';
            searchAndSortRef.current.style.flex = '2 1 50%';
        }
        else {
            noteControlsRef.current.style.flexDirection = 'column';
        }
    }, [lineCount]);
    (0, react_1.useEffect)(() => {
        CommandService_1.default.instance().registerRuntime('focusSearch', (0, focusSearch_1.runtime)(searchBarRef));
        return function () {
            CommandService_1.default.instance().unregisterRuntime('focusSearch');
        };
    }, []);
    function onNewTodoButtonClick() {
        void CommandService_1.default.instance().execute('newTodo');
    }
    function onNewNoteButtonClick() {
        void CommandService_1.default.instance().execute('newNote');
    }
    function onSortOrderFieldButtonClick() {
        void CommandService_1.default.instance().execute('toggleNotesSortOrderField');
    }
    function onSortOrderReverseButtonClick() {
        void CommandService_1.default.instance().execute('toggleNotesSortOrderReverse');
    }
    function sortOrderFieldTooltip() {
        const term1 = CommandService_1.default.instance().label('toggleNotesSortOrderField');
        const field = props.sortOrderField;
        const term2 = Note_1.default.fieldToLabel(field);
        const term3 = Note_1.default.fieldToLabel((0, notesSortOrderUtils_1.notesSortOrderNextField)(field));
        return `${term1}:\n ${term2} -> ${term3}`;
    }
    function sortOrderFieldIcon() {
        const defaultIcon = 'fas fa-cog';
        const field = props.sortOrderField;
        const iconMap = {
            user_updated_time: 'far fa-calendar-alt',
            user_created_time: 'far fa-calendar-plus',
            title: 'fas fa-font',
            order: 'fas fa-wrench',
            todo_due: 'fas fa-calendar-check',
            todo_completed: 'fas fa-check',
        };
        return `${iconMap[field] || defaultIcon} ${field}`;
    }
    function sortOrderReverseIcon() {
        return props.sortOrderReverse ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down';
    }
    function showsSortOrderButtons() {
        let visible = props.sortOrderButtonsVisible;
        if (props.notesParentType === 'Search')
            visible = false;
        return visible;
    }
    function renderNewNoteButtons() {
        if (!props.showNewNoteButtons)
            return null;
        return (React.createElement(TopRow, { className: "new-note-todo-buttons" },
            React.createElement(StyledButton, { ref: (el) => {
                    props.setNewNoteButtonElement(el);
                }, className: "new-note-button", tooltip: showTooltip ? CommandService_1.default.instance().label('newNote') : '', iconName: noteIcon, title: (0, locale_1._)('%s', noteButtonText), level: Button_1.ButtonLevel.Primary, size: props.buttonSize, onClick: onNewNoteButtonClick, disabled: !props.newNoteButtonEnabled }),
            React.createElement(StyledButton, { ref: newTodoButtonRef, className: "new-todo-button", tooltip: showTooltip ? CommandService_1.default.instance().label('newTodo') : '', iconName: todoIcon, title: (0, locale_1._)('%s', todoButtonText), level: Button_1.ButtonLevel.Secondary, size: props.buttonSize, onClick: onNewTodoButtonClick, disabled: !props.newTodoButtonEnabled })));
    }
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    return (React.createElement(StyledRoot, { ref: noteControlsRef, padding: props.padding, buttonVerticalGap: props.buttonVerticalGap },
        renderNewNoteButtons(),
        React.createElement(BottomRow, { ref: searchAndSortRef, className: "search-and-sort" },
            React.createElement(SearchBar_1.default, { inputRef: searchBarRef, windowId: windowId }),
            showsSortOrderButtons() &&
                React.createElement(SortOrderButtonsContainer, null,
                    React.createElement(StyledPairButtonL, { className: "sort-order-field-button", tooltip: sortOrderFieldTooltip(), iconName: sortOrderFieldIcon(), level: Button_1.ButtonLevel.Secondary, size: props.buttonSize, onClick: onSortOrderFieldButtonClick }),
                    React.createElement(StyledPairButtonR, { className: "sort-order-reverse-button", tooltip: CommandService_1.default.instance().label('toggleNotesSortOrderReverse'), iconName: sortOrderReverseIcon(), level: Button_1.ButtonLevel.Secondary, size: props.buttonSize, onClick: onSortOrderReverseButtonClick })))));
}
const mapStateToProps = (state, ownProps) => {
    const whenClauseContext = (0, stateToWhenClauseContext_1.default)(state, { windowId: ownProps.windowId });
    const windowState = reducer_1.stateUtils.windowStateById(state, ownProps.windowId);
    const hasFolderForNewNotes = whenClauseContext.selectedFolderIsValid
        && windowState.selectedFolderId !== (0, trash_1.getTrashFolderId)();
    return {
        showNewNoteButtons: hasFolderForNewNotes,
        newNoteButtonEnabled: CommandService_1.default.instance().isEnabled('newNote', whenClauseContext),
        newTodoButtonEnabled: CommandService_1.default.instance().isEnabled('newTodo', whenClauseContext),
        sortOrderButtonsVisible: state.settings['notes.sortOrder.buttonsVisible'],
        sortOrderField: state.settings['notes.sortOrder.field'],
        sortOrderReverse: state.settings['notes.sortOrder.reverse'],
        notesParentType: windowState.notesParentType,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(NoteListControls);
//# sourceMappingURL=NoteListControls.js.map