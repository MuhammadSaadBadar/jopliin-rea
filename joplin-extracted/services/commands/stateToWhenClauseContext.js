"use strict";
// This extends the generic stateToWhenClauseContext (potentially shared by
// all apps) with additional properties specific to the desktop app. So in
// general, any desktop component should import this file, and not the lib
// one.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stateToWhenClauseContext;
const stateToWhenClauseContext_1 = __importDefault(require("@joplin/lib/services/commands/stateToWhenClauseContext"));
const layoutItemProp_1 = __importDefault(require("../../gui/ResizableLayout/utils/layoutItemProp"));
const reducer_1 = require("@joplin/lib/reducer");
function stateToWhenClauseContext(state, options = null) {
    var _a;
    const windowId = (_a = options === null || options === void 0 ? void 0 : options.windowId) !== null && _a !== void 0 ? _a : reducer_1.defaultWindowId;
    const isMainWindow = windowId === reducer_1.defaultWindowId;
    const windowState = reducer_1.stateUtils.windowStateById(state, windowId);
    const isAltInstance = !!state.settings.altInstanceId;
    return Object.assign(Object.assign({}, (0, stateToWhenClauseContext_1.default)(state, options)), { 
        // UI elements
        markdownEditorVisible: !!windowState.editorCodeView && !state.settings['isSafeMode'], richTextEditorVisible: !windowState.editorCodeView && !state.settings['isSafeMode'], markdownEditorPaneVisible: windowState.editorCodeView && windowState.noteVisiblePanes.includes('editor'), markdownViewerPaneVisible: windowState.editorCodeView && windowState.noteVisiblePanes.includes('viewer'), modalDialogVisible: !!Object.keys(state.visibleDialogs).length, gotoAnythingVisible: !!state.visibleDialogs['gotoAnything'], sidebarVisible: isMainWindow && !!state.mainLayout && (0, layoutItemProp_1.default)(state.mainLayout, 'sideBar', 'visible'), noteListHasNotes: !!windowState.notes.length, isAltInstance, activeNoteIsWhiteboard: !!windowState.activeNoteIsWhiteboard, 
        // Deprecated
        sideBarVisible: !!state.mainLayout && (0, layoutItemProp_1.default)(state.mainLayout, 'sideBar', 'visible') });
}
//# sourceMappingURL=stateToWhenClauseContext.js.map