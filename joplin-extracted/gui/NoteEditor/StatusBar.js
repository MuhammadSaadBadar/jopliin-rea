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
const ToolbarButton_1 = __importDefault(require("../ToolbarButton/ToolbarButton"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const theme_1 = require("@joplin/lib/theme");
const react_redux_1 = require("react-redux");
const TagList_1 = __importDefault(require("../TagList"));
const locale_1 = require("@joplin/lib/locale");
const react_1 = require("react");
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const StatusIndicator = props => {
    const runCommand = (0, react_1.useCallback)(() => {
        void CommandService_1.default.instance().execute(props.commandName);
    }, [props.commandName]);
    const keyshortcuts = KeymapService_1.default.instance().getAriaKeyShortcuts(props.commandName);
    return React.createElement("span", { className: `status editor-status-indicator ${props.showWhenUnfocused ? '-show' : ''}`, "aria-live": 'polite' },
        React.createElement("button", { className: 'button', "aria-keyshortcuts": keyshortcuts, onClick: runCommand }, props.label));
};
const StatusBar = props => {
    function renderTagButton() {
        return React.createElement(ToolbarButton_1.default, { themeId: props.themeId, toolbarButtonInfo: props.setTagsToolbarButtonInfo });
    }
    function renderTagBar() {
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const noteIds = [props.noteId];
        const instructions = (React.createElement("span", { "aria-disabled": !props.setTagsToolbarButtonInfo.enabled, onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!props.setTagsToolbarButtonInfo.enabled)
                    return;
                void CommandService_1.default.instance().execute('setTags', noteIds);
            }, style: Object.assign(Object.assign({}, theme.clickableTextStyle), { whiteSpace: 'nowrap', opacity: props.setTagsToolbarButtonInfo.enabled ? 1 : 0.5, cursor: props.setTagsToolbarButtonInfo.enabled ? 'pointer' : 'default' }) }, (0, locale_1._)('Click to add tags...')));
        const tagList = props.selectedNoteTags.length ? React.createElement(TagList_1.default, { items: props.selectedNoteTags }) : null;
        return React.createElement("div", { className: 'tag-bar' },
            renderTagButton(),
            React.createElement("div", { className: 'content' },
                tagList,
                instructions));
    }
    const keyboardStatus = React.createElement(StatusIndicator, { commandName: 'toggleTabMovesFocus', label: props.tabMovesFocus ? (0, locale_1._)('Tab moves focus') : (0, locale_1._)('Tab indents'), showWhenUnfocused: props.tabMovesFocus });
    return React.createElement("div", { className: 'editor-status-bar' },
        renderTagBar(),
        React.createElement("div", { className: 'spacer' }),
        keyboardStatus);
};
exports.default = (0, react_redux_1.connect)((state) => {
    return {
        themeId: state.settings.theme,
        tabMovesFocus: state.settings['editor.tabMovesFocus'],
    };
})(StatusBar);
//# sourceMappingURL=StatusBar.js.map