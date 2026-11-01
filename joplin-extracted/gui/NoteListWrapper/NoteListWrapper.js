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
exports.default = NoteListWrapper;
const theme_1 = require("@joplin/lib/theme");
const React = __importStar(require("react"));
const react_1 = require("react");
const NoteList2_1 = __importDefault(require("../NoteList/NoteList2"));
const NoteListControls_1 = __importDefault(require("../NoteListControls/NoteListControls"));
const styled_components_1 = __importDefault(require("styled-components"));
const renderers_1 = require("@joplin/lib/services/noteList/renderers");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const NoteListHeader_1 = __importDefault(require("../NoteListHeader/NoteListHeader"));
const locale_1 = require("@joplin/lib/locale");
const types_1 = require("../NoteList/utils/types");
const Button_1 = require("../Button/Button");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const depNameToNoteProp_1 = __importDefault(require("@joplin/lib/services/noteList/depNameToNoteProp"));
const trash_1 = require("@joplin/lib/services/trash");
const usePrevious_1 = __importDefault(require("../hooks/usePrevious"));
const NewWindowOrIFrame_1 = require("../NewWindowOrIFrame");
const logger = Logger_1.default.create('NoteListWrapper');
const StyledRoot = styled_components_1.default.div `
	display: flex;
	flex-direction: column;
	overflow: hidden;
	width: 100%;
`;
const getTextWidth = (newNoteButtonElement, text) => {
    const canvas = document.createElement('canvas');
    if (!canvas)
        throw new Error('Failed to create canvas element');
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw new Error('Failed to get context');
    const fontWeight = getComputedStyle(newNoteButtonElement).getPropertyValue('font-weight');
    const fontSize = getComputedStyle(newNoteButtonElement).getPropertyValue('font-size');
    const fontFamily = getComputedStyle(newNoteButtonElement).getPropertyValue('font-family');
    ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    return ctx.measureText(text).width;
};
// Even though these calculations mostly concern the NoteListControls component, we do them here
// because we need to know the height of that control to calculate the note list height.
const useNoteListControlsBreakpoints = (width, newNoteButtonElement, selectedFolderId) => {
    const [dynamicBreakpoints, setDynamicBreakpoints] = (0, react_1.useState)({ Sm: types_1.BaseBreakpoint.Sm, Md: types_1.BaseBreakpoint.Md, Lg: types_1.BaseBreakpoint.Lg, Xl: types_1.BaseBreakpoint.Xl });
    const previousWidth = (0, usePrevious_1.default)(width);
    const widthHasChanged = width !== previousWidth;
    const showNewNoteButton = !!selectedFolderId && selectedFolderId !== (0, trash_1.getTrashFolderId)();
    // Initialize language-specific breakpoints
    (0, react_1.useEffect)(() => {
        if (!newNoteButtonElement)
            return;
        if (!showNewNoteButton)
            return;
        // Use the longest string to calculate the amount of extra width needed
        const smAdditional = getTextWidth(newNoteButtonElement, (0, locale_1._)('note')) > getTextWidth(newNoteButtonElement, (0, locale_1._)('to-do')) ? getTextWidth(newNoteButtonElement, (0, locale_1._)('note')) : getTextWidth(newNoteButtonElement, (0, locale_1._)('to-do'));
        const mdAdditional = getTextWidth(newNoteButtonElement, (0, locale_1._)('New note')) > getTextWidth(newNoteButtonElement, (0, locale_1._)('New to-do')) ? getTextWidth(newNoteButtonElement, (0, locale_1._)('New note')) : getTextWidth(newNoteButtonElement, (0, locale_1._)('New to-do'));
        const Sm = types_1.BaseBreakpoint.Sm + smAdditional * 2;
        const Md = types_1.BaseBreakpoint.Md + mdAdditional * 2;
        const Lg = types_1.BaseBreakpoint.Lg + Md;
        const Xl = types_1.BaseBreakpoint.Xl;
        setDynamicBreakpoints({ Sm, Md, Lg, Xl });
    }, [newNoteButtonElement, showNewNoteButton, widthHasChanged]);
    const breakpoint = (0, react_1.useMemo)(() => {
        // Find largest breakpoint that width is less than
        const index = Object.values(dynamicBreakpoints).findIndex(x => width < x);
        return index === -1 ? dynamicBreakpoints.Xl : Object.values(dynamicBreakpoints)[index];
    }, [width, dynamicBreakpoints]);
    const lineCount = breakpoint !== dynamicBreakpoints.Xl ? 2 : 1;
    return { breakpoint, dynamicBreakpoints, lineCount };
};
// If the renderer ID that was saved to settings is already registered, we
// return it. If not, we need to wait for all plugins to be loaded, because one
// of them will most likely register the renderer we need. If none of them do,
// we use a default renderer instead of throwing an error.
const useListRenderer = (listRendererId, startupPluginsLoaded) => {
    const listRenderer = (0, renderers_1.getListRendererById)(listRendererId);
    if (listRenderer)
        return listRenderer;
    if (startupPluginsLoaded) {
        logger.error(`Tried to load renderer "${listRendererId}" but none of the registered renderers match this ID - using default renderer instead`);
        return (0, renderers_1.getDefaultListRenderer)();
    }
    return null;
};
function NoteListWrapper(props) {
    const theme = (0, theme_1.themeStyle)(props.themeId);
    const [controlHeight] = (0, react_1.useState)(theme.topRowHeight);
    const listRenderer = useListRenderer(props.listRendererId, props.startupPluginsLoaded);
    const [newNoteButtonElement, setNewNoteButtonElement] = (0, react_1.useState)(null);
    const isMultiColumns = listRenderer ? listRenderer.multiColumns : false;
    const columns = isMultiColumns ? props.columns : null;
    const { breakpoint, dynamicBreakpoints, lineCount } = useNoteListControlsBreakpoints(props.size.width, newNoteButtonElement, props.selectedFolderId);
    const noteListControlsButtonSize = Button_1.ButtonSize.Small;
    const noteListControlsPadding = theme.mainPadding;
    const noteListControlsButtonVerticalGap = 5;
    const noteListControlsHeight = (0, react_1.useMemo)(() => {
        if (lineCount === 1) {
            return (0, Button_1.buttonSizePx)(noteListControlsButtonSize) + noteListControlsPadding * 2;
        }
        else {
            return (0, Button_1.buttonSizePx)(noteListControlsButtonSize) * 2 + noteListControlsPadding * 2 + noteListControlsButtonVerticalGap;
        }
    }, [lineCount, noteListControlsButtonSize, noteListControlsPadding, noteListControlsButtonVerticalGap]);
    const noteListSize = (0, react_1.useMemo)(() => {
        return {
            width: props.size.width,
            height: props.size.height - noteListControlsHeight - (isMultiColumns ? theme.noteListHeaderHeight : 0),
        };
    }, [props.size, noteListControlsHeight, theme.noteListHeaderHeight, isMultiColumns]);
    const onHeaderItemClick = (0, react_1.useCallback)(event => {
        const field = (0, depNameToNoteProp_1.default)(event.name).split('.')[1];
        if (!Setting_1.default.isAllowedEnumOption('notes.sortOrder.field', field)) {
            logger.warn(`Unsupported sorting option: ${field}`);
            return;
        }
        if (Setting_1.default.value('notes.sortOrder.field') === field) {
            Setting_1.default.toggle('notes.sortOrder.reverse');
        }
        else {
            Setting_1.default.setValue('notes.sortOrder.field', field);
        }
    }, []);
    const renderHeader = () => {
        if (!listRenderer || !isMultiColumns)
            return null;
        return React.createElement(NoteListHeader_1.default, { height: theme.noteListHeaderHeight, template: listRenderer.headerTemplate, onClick: listRenderer.onHeaderClick, columns: columns, notesSortOrderField: props.notesSortOrderField, notesSortOrderReverse: props.notesSortOrderReverse, onItemClick: onHeaderItemClick });
    };
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    const renderNoteList = () => {
        if (!listRenderer)
            return null;
        return React.createElement(NoteList2_1.default, { windowId: windowId, listRenderer: listRenderer, resizableLayoutEventEmitter: props.resizableLayoutEventEmitter, size: noteListSize, visible: props.visible, columns: columns });
    };
    return (React.createElement(StyledRoot, { role: 'navigation', "aria-label": (0, locale_1._)('Note list') },
        React.createElement(NoteListControls_1.default, { height: controlHeight, width: noteListSize.width, setNewNoteButtonElement: setNewNoteButtonElement, breakpoint: breakpoint, dynamicBreakpoints: dynamicBreakpoints, lineCount: lineCount, buttonSize: noteListControlsButtonSize, padding: noteListControlsPadding, buttonVerticalGap: noteListControlsButtonVerticalGap, windowId: windowId }),
        renderHeader(),
        renderNoteList()));
}
//# sourceMappingURL=NoteListWrapper.js.map