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
const NoteListWrapper_1 = __importDefault(require("./NoteListWrapper/NoteListWrapper"));
const Sidebar_1 = __importDefault(require("./Sidebar/Sidebar"));
const NewWindowOrIFrame_1 = require("./NewWindowOrIFrame");
const NoteEditor_1 = __importDefault(require("./NoteEditor/NoteEditor"));
const ChatPanel_1 = __importDefault(require("./ChatPanel/ChatPanel"));
const reducer_1 = require("@joplin/lib/services/plugins/reducer");
const locale_1 = require("@joplin/lib/locale");
const UserWebview_1 = __importDefault(require("../services/plugins/UserWebview"));
const removeItem_1 = __importDefault(require("./ResizableLayout/utils/removeItem"));
const react_redux_1 = require("react-redux");
const reducer_2 = require("@joplin/lib/reducer");
const validateColumns_1 = __importDefault(require("./NoteListHeader/utils/validateColumns"));
const MainLayoutPane = (props) => {
    var _a, _b;
    const { contentKey, event } = props;
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    const cancelLayoutRemoveRef = (0, react_1.useRef)(0);
    // Key should never be undefined but somehow it can happen, also not
    // clear how. For now in this case render nothing so that the app
    // doesn't crash.
    // https://discourse.joplinapp.org/t/rearranging-the-pannels-crushed-the-app-and-generated-fatal-error/14373?u=laurent
    if (!contentKey) {
        console.error('resizableLayout_renderItem: Trying to render an item using an empty key. Full layout is:', props.layout);
        return null;
    }
    const eventEmitter = event.eventEmitter;
    // const viewsToRemove:string[] = [];
    const components = {
        sideBar: () => {
            return React.createElement(Sidebar_1.default, null);
        },
        noteList: () => {
            return React.createElement(NoteListWrapper_1.default, { resizableLayoutEventEmitter: eventEmitter, visible: event.visible, size: event.size, themeId: props.themeId, listRendererId: props.listRendererId, startupPluginsLoaded: props.startupPluginsLoaded, notesSortOrderField: props.notesSortOrderField, notesSortOrderReverse: props.notesSortOrderReverse, columns: props.notesColumns, selectedFolderId: props.selectedFolderId });
        },
        editor: () => {
            return React.createElement("div", { className: 'note-editor-wrapper', role: 'main', "aria-label": (0, locale_1._)('Note') },
                React.createElement(NoteEditor_1.default, { windowId: windowId, onTitleChange: props.onNoteTitleChange, startupPluginsLoaded: props.startupPluginsLoaded }));
        },
        chatPanel: () => {
            return React.createElement(ChatPanel_1.default, { windowId: windowId });
        },
    };
    if (components[contentKey])
        return components[contentKey]();
    const viewsToRemove = [];
    if (contentKey.indexOf('plugin-view') === 0) {
        const viewInfo = reducer_1.utils.viewInfoByViewId(props.plugins, event.item.key);
        if (!viewInfo) {
            // Once all startup plugins have loaded, we know that all the
            // views are ready so we can remove the orphans ones.
            //
            // Before they are loaded, there might be views that don't match
            // any plugins, but that's only because it hasn't loaded yet.
            if (props.startupPluginsLoaded) {
                console.warn(`Could not find plugin associated with view: ${event.item.key}`);
                viewsToRemove.push(event.item.key);
            }
        }
        else {
            const { view, plugin } = viewInfo;
            const html = (_b = (_a = props.pluginHtmlContents[plugin.id]) === null || _a === void 0 ? void 0 : _a[view.id]) !== null && _b !== void 0 ? _b : '';
            return React.createElement(UserWebview_1.default, { key: view.id, viewId: view.id, themeId: props.themeId, html: html, scripts: view.scripts, pluginId: plugin.id, borderBottom: true, fitToContent: false });
        }
    }
    else {
        // The layout may reference a component that no longer exists -
        // for example a panel from a previous version of the app, or a
        // feature that has been removed. Rather than crash, log the issue
        // and queue the item for removal from the layout.
        console.warn(`Invalid layout component: ${contentKey} - it will be removed from the layout`);
        viewsToRemove.push(contentKey);
    }
    if (viewsToRemove.length) {
        const cancelCounter = cancelLayoutRemoveRef.current + 1;
        cancelLayoutRemoveRef.current = cancelCounter;
        window.requestAnimationFrame(() => {
            if (cancelCounter !== cancelLayoutRemoveRef.current)
                return;
            let newLayout = props.layout;
            for (const itemKey of viewsToRemove) {
                newLayout = (0, removeItem_1.default)(newLayout, itemKey);
            }
            if (newLayout !== props.layout) {
                console.warn('Removed invalid views:', viewsToRemove);
                props.onUpdateLayout(newLayout);
            }
        });
    }
    return null;
};
exports.default = (0, react_redux_1.connect)((state, ownProps) => {
    const windowState = reducer_2.stateUtils.windowStateById(state, ownProps.windowId);
    return {
        themeId: state.settings.theme,
        plugins: state.pluginService.plugins,
        pluginHtmlContents: state.pluginService.pluginHtmlContents,
        startupPluginsLoaded: state.startupPluginsLoaded,
        listRendererId: state.settings['notes.listRendererId'],
        selectedFolderId: windowState.selectedFolderId,
        notesSortOrderField: state.settings['notes.sortOrder.field'],
        notesSortOrderReverse: state.settings['notes.sortOrder.reverse'],
        notesColumns: (0, validateColumns_1.default)(state.settings['notes.columns']),
    };
})(MainLayoutPane);
//# sourceMappingURL=MainLayoutPane.js.map