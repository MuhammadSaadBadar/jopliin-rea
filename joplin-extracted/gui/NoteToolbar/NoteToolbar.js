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
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const ToolbarBase_1 = __importDefault(require("../ToolbarBase"));
const reducer_1 = require("@joplin/lib/services/plugins/reducer");
const ToolbarButtonUtils_1 = __importDefault(require("@joplin/lib/services/commands/ToolbarButtonUtils"));
const stateToWhenClauseContext_1 = __importDefault(require("../../services/commands/stateToWhenClauseContext"));
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
const getActivePluginEditorView_1 = __importDefault(require("@joplin/lib/services/plugins/utils/getActivePluginEditorView"));
const reducer_2 = require("@joplin/lib/reducer");
const availability_1 = require("@joplin/lib/services/ai/availability");
function styles_(props) {
    return (0, theme_1.buildStyle)('NoteToolbar', props.themeId, theme => {
        return {
            root: Object.assign(Object.assign({}, props.style), { borderBottom: 'none', backgroundColor: theme.backgroundColor }),
        };
    });
}
function NoteToolbar(props) {
    const styles = styles_(props);
    return (React.createElement(ToolbarBase_1.default, { style: styles.root, scrollable: false, items: props.toolbarButtonInfos, disabled: props.disabled, "aria-label": (0, locale_1._)('Note') }));
}
const toolbarButtonUtils = new ToolbarButtonUtils_1.default(CommandService_1.default.instance());
const mapStateToProps = (state, ownProps) => {
    const whenClauseContext = (0, stateToWhenClauseContext_1.default)(state, { windowId: ownProps.windowId });
    const { editorPlugin } = (0, getActivePluginEditorView_1.default)(state.pluginService.plugins, ownProps.windowId);
    const windowState = reducer_2.stateUtils.windowStateById(state, ownProps.windowId);
    const commands = [
        'showSpellCheckerMenu',
        'editAlarm',
        'toggleVisiblePanes',
        'showNoteProperties',
    ];
    // The hide setting only applies while chat is unavailable.
    if ((0, availability_1.chatAvailability)().available || state.settings['ai.chat.showToolbarButton']) {
        commands.push('toggleAiChat');
    }
    // `toggleEditorPlugin` shows for plugin editors; we extend it to also
    // toggle the core whiteboard editor on whiteboard notes (see the command's
    // runtime). The button is the same eye icon either way.
    if (editorPlugin || windowState.activeNoteIsWhiteboard)
        commands.push('toggleEditorPlugin');
    return {
        toolbarButtonInfos: toolbarButtonUtils.commandsToToolbarButtons(commands
            .concat(reducer_1.utils.commandNamesFromViews(state.pluginService.plugins, 'noteToolbar')), whenClauseContext),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(NoteToolbar);
//# sourceMappingURL=NoteToolbar.js.map