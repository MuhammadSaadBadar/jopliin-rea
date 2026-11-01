"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppDefaultWindowState = exports.AppStateDialogName = exports.defaultAiStatus = void 0;
exports.createAppDefaultState = createAppDefaultState;
exports.default = default_1;
const immer_1 = require("immer");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const reducer_1 = require("@joplin/lib/reducer");
const iterateItems_1 = __importDefault(require("./gui/ResizableLayout/utils/iterateItems"));
const validateLayout_1 = __importDefault(require("./gui/ResizableLayout/utils/validateLayout"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const types_1 = require("@joplin/lib/services/ai/types");
const logger = Logger_1.default.create('app.reducer');
const defaultAiStatus = () => ({
    degraded: false,
    tokensUsed: 0,
    tokensBudget: 0,
    lastToastShownAt: null,
});
exports.defaultAiStatus = defaultAiStatus;
var AppStateDialogName;
(function (AppStateDialogName) {
    AppStateDialogName["SyncWizard"] = "syncWizard";
    AppStateDialogName["MasterPassword"] = "masterPassword";
})(AppStateDialogName || (exports.AppStateDialogName = AppStateDialogName = {}));
const createAppDefaultWindowState = () => {
    return Object.assign(Object.assign({}, reducer_1.defaultWindowState), { visibleDialogs: {}, dialogs: [], noteVisiblePanes: ['editor', 'viewer'], editorCodeView: true, devToolsVisible: false, watchedResources: {}, whiteboardForceMarkdown: {}, activeNoteIsWhiteboard: false, aiChatMessages: [], aiChatConversationId: null, secondaryWindowLayout: null });
};
exports.createAppDefaultWindowState = createAppDefaultWindowState;
function createAppDefaultState(resourceEditWatcherDefaultState) {
    return Object.assign(Object.assign(Object.assign(Object.assign({}, reducer_1.defaultState), (0, exports.createAppDefaultWindowState)()), { backgroundWindows: {}, route: {
            type: 'NAV_GO',
            routeName: 'Main',
            props: {},
        }, navHistory: [], watchedNoteFiles: [], visibleDialogs: {}, focusedField: null, layoutMoveMode: false, mainLayout: null, startupPluginsLoaded: false, isResettingLayout: false, modalOverlayMessage: null, aiStatus: (0, exports.defaultAiStatus)() }), resourceEditWatcherDefaultState);
}
const hideBackgroundDialogsWithId = (0, immer_1.produce)((state, id) => {
    for (const windowId of Object.keys(state.backgroundWindows)) {
        const win = state.backgroundWindows[windowId];
        if (id in win.visibleDialogs) {
            delete win.visibleDialogs[id];
        }
    }
});
const withWindowStateUpdated = (state, windowId, stateKey, value) => {
    return (0, immer_1.produce)((state) => {
        const windowState = reducer_1.stateUtils.windowStateById(state, windowId);
        windowState[stateKey] = value(windowState[stateKey]);
    })(state);
};
const setLayoutProp = (layout, { key, prop, value }) => {
    let newLayout = (0, immer_1.produce)(layout, (draftLayout) => {
        (0, iterateItems_1.default)(draftLayout, (_itemIndex, item, _parent) => {
            if (!item) {
                logger.warn('MAIN_LAYOUT_SET_ITEM_PROP: Found an empty item in layout: ', JSON.stringify(layout));
            }
            else {
                if (item.key === key) {
                    item[prop] = value;
                    return false;
                }
            }
            return true;
        });
    });
    if (newLayout !== layout)
        newLayout = (0, validateLayout_1.default)(newLayout);
    return newLayout;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Redux actions are heterogeneous; typing this would require an action-type union and many narrowing casts inside the switch
function default_1(state, action) {
    var _a, _b, _c, _d;
    let newState = state;
    try {
        switch (action.type) {
            case 'NAV_BACK':
            case 'NAV_GO':
                {
                    const goingBack = action.type === 'NAV_BACK';
                    if (goingBack && !state.navHistory.length)
                        break;
                    const currentRoute = state.route;
                    newState = Object.assign({}, state);
                    const newNavHistory = state.navHistory.slice();
                    if (goingBack) {
                        let newAction = null;
                        while (newNavHistory.length) {
                            newAction = newNavHistory.pop();
                            if (newAction.routeName !== state.route.routeName)
                                break;
                        }
                        if (!newAction)
                            break;
                        action = newAction;
                    }
                    if (!goingBack)
                        newNavHistory.push(currentRoute);
                    newState.navHistory = newNavHistory;
                    newState.route = action;
                }
                break;
            case 'STARTUP_PLUGINS_LOADED':
                // When all startup plugins have loaded, we also recreate the
                // main layout to ensure that it is updated in the UI. There's
                // probably a cleaner way to do this, but for now that will do.
                if (state.startupPluginsLoaded !== action.value) {
                    newState = Object.assign(Object.assign({}, newState), { startupPluginsLoaded: action.value, mainLayout: JSON.parse(JSON.stringify(newState.mainLayout)) });
                }
                break;
            case 'NOTE_VISIBLE_PANES_TOGGLE':
                {
                    const getNextLayout = (currentLayout) => {
                        currentLayout = panes.length === 2 ? 'both' : currentLayout[0];
                        let paneOptions;
                        if (state.settings.layoutButtonSequence === Setting_1.default.LAYOUT_EDITOR_VIEWER) {
                            paneOptions = ['editor', 'viewer'];
                        }
                        else if (state.settings.layoutButtonSequence === Setting_1.default.LAYOUT_EDITOR_SPLIT) {
                            paneOptions = ['editor', 'both'];
                        }
                        else if (state.settings.layoutButtonSequence === Setting_1.default.LAYOUT_VIEWER_SPLIT) {
                            paneOptions = ['viewer', 'both'];
                        }
                        else {
                            paneOptions = ['editor', 'viewer', 'both'];
                        }
                        const currentLayoutIndex = paneOptions.indexOf(currentLayout);
                        const nextLayoutIndex = currentLayoutIndex === paneOptions.length - 1 ? 0 : currentLayoutIndex + 1;
                        const nextLayout = paneOptions[nextLayoutIndex];
                        return nextLayout === 'both' ? ['editor', 'viewer'] : [nextLayout];
                    };
                    newState = Object.assign({}, state);
                    const panes = state.noteVisiblePanes.slice();
                    newState.noteVisiblePanes = getNextLayout(panes);
                }
                break;
            case 'NOTE_VISIBLE_PANES_SET':
                newState = Object.assign(Object.assign({}, state), { noteVisiblePanes: action.panes });
                break;
            case 'EDITOR_CODE_VIEW_CHANGE':
                newState = Object.assign(Object.assign({}, state), { editorCodeView: action.value });
                break;
            case 'WHITEBOARD_FORCE_MARKDOWN_TOGGLE': {
                const id = action.noteId;
                // Guard against dispatchers forgetting to pass a noteId — writing
                // an `undefined` key into the map would persist a junk entry.
                if (typeof id !== 'string' || !id)
                    break;
                const current = !!((_a = state.whiteboardForceMarkdown) === null || _a === void 0 ? void 0 : _a[id]);
                newState = Object.assign(Object.assign({}, state), { whiteboardForceMarkdown: Object.assign(Object.assign({}, (state.whiteboardForceMarkdown || {})), { [id]: !current }) });
                break;
            }
            case 'WHITEBOARD_ACTIVE_NOTE_SET':
                newState = withWindowStateUpdated(state, action.windowId, 'activeNoteIsWhiteboard', () => !!action.value);
                break;
            case 'AI_CHAT_DELETE':
                newState = (0, immer_1.produce)(state, draft => {
                    for (const windowState of reducer_1.stateUtils.allWindowStates(draft)) {
                        if (windowState.aiChatConversationId !== action.conversationId)
                            continue;
                        windowState.aiChatConversationId = null;
                        windowState.aiChatMessages = [];
                    }
                });
                break;
            case 'AI_CHAT_OPEN':
                newState = (0, immer_1.produce)(state, draft => {
                    const openConversation = action.conversationId && reducer_1.stateUtils.allWindowStates(state)
                        .find(windowState => windowState.aiChatConversationId === action.conversationId);
                    const windowState = reducer_1.stateUtils.windowStateById(draft, action.windowId);
                    windowState.aiChatConversationId = action.conversationId;
                    windowState.aiChatMessages = openConversation ? openConversation.aiChatMessages : action.messages;
                });
                break;
            case 'AI_CHAT_APPEND':
            case 'AI_CHAT_ADD_TOOL_RESULT':
            case 'AI_CHAT_REMOVE':
                newState = (0, immer_1.produce)(state, draft => {
                    for (const windowState of reducer_1.stateUtils.allWindowStates(draft)) {
                        if (windowState.aiChatConversationId !== action.conversationId)
                            continue;
                        if (action.type === 'AI_CHAT_APPEND') {
                            windowState.aiChatMessages.push(action.message);
                        }
                        else if (action.type === 'AI_CHAT_REMOVE') {
                            windowState.aiChatMessages = windowState.aiChatMessages.filter(message => message.id !== action.id);
                        }
                        else {
                            const message = windowState.aiChatMessages.find(message => message.raw.some(entry => { var _a; return entry.role === types_1.ChatRole.Assistant && ((_a = entry.toolCalls) === null || _a === void 0 ? void 0 : _a.some(call => call.callId === action.toolCall.toolCallId)); }));
                            message === null || message === void 0 ? void 0 : message.raw.push(action.toolCall);
                        }
                    }
                });
                break;
            case 'AI_STATUS_UPDATE':
                // Partial merge — callers can bump `lastToastShownAt` alone after
                // firing the toast without clobbering the degraded/usage numbers.
                newState = Object.assign(Object.assign({}, state), { aiStatus: Object.assign(Object.assign({}, ((_b = state.aiStatus) !== null && _b !== void 0 ? _b : (0, exports.defaultAiStatus)())), action.payload) });
                break;
            case 'WINDOW_LAYOUT_SET':
            case 'MAIN_LAYOUT_SET':
                if (((_c = action.windowId) !== null && _c !== void 0 ? _c : reducer_1.defaultWindowId) === reducer_1.defaultWindowId) {
                    newState = Object.assign(Object.assign({}, state), { mainLayout: action.value });
                }
                else {
                    newState = withWindowStateUpdated(state, action.windowId, 'secondaryWindowLayout', () => action.value);
                }
                break;
            case 'WINDOW_LAYOUT_SET_ITEM_PROP':
            case 'MAIN_LAYOUT_SET_ITEM_PROP': {
                const updateOption = { key: action.itemKey, prop: action.propName, value: action.propValue };
                if (((_d = action.windowId) !== null && _d !== void 0 ? _d : reducer_1.defaultWindowId) !== reducer_1.defaultWindowId) {
                    newState = withWindowStateUpdated(state, action.windowId, 'secondaryWindowLayout', oldLayout => (setLayoutProp(oldLayout, updateOption)));
                }
                else {
                    newState = Object.assign(Object.assign({}, state), { mainLayout: setLayoutProp(state.mainLayout, updateOption) });
                }
                break;
            }
            case 'SHOW_MODAL_MESSAGE':
                newState = Object.assign(Object.assign({}, newState), { modalOverlayMessage: action.message });
                break;
            case 'HIDE_MODAL_MESSAGE':
                newState = Object.assign(Object.assign({}, newState), { modalOverlayMessage: null });
                break;
            case 'NOTE_FILE_WATCHER_ADD':
                if (newState.watchedNoteFiles.indexOf(action.id) < 0) {
                    newState = Object.assign({}, state);
                    const watchedNoteFiles = newState.watchedNoteFiles.slice();
                    watchedNoteFiles.push(action.id);
                    newState.watchedNoteFiles = watchedNoteFiles;
                }
                break;
            case 'NOTE_FILE_WATCHER_REMOVE':
                {
                    newState = Object.assign({}, state);
                    const idx = newState.watchedNoteFiles.indexOf(action.id);
                    if (idx >= 0) {
                        const watchedNoteFiles = newState.watchedNoteFiles.slice();
                        watchedNoteFiles.splice(idx, 1);
                        newState.watchedNoteFiles = watchedNoteFiles;
                    }
                }
                break;
            case 'NOTE_FILE_WATCHER_CLEAR':
                if (state.watchedNoteFiles.length) {
                    newState = Object.assign({}, state);
                    newState.watchedNoteFiles = [];
                }
                break;
            case 'NOTE_DEVTOOLS_TOGGLE':
                newState = Object.assign({}, state);
                newState.devToolsVisible = !newState.devToolsVisible;
                break;
            case 'NOTE_DEVTOOLS_SET':
                newState = Object.assign({}, state);
                newState.devToolsVisible = action.value;
                break;
            case 'VISIBLE_DIALOGS_ADD':
                newState = Object.assign({}, state);
                newState.visibleDialogs = Object.assign({}, newState.visibleDialogs);
                newState.visibleDialogs[action.name] = true;
                newState = hideBackgroundDialogsWithId(newState, action.name);
                break;
            case 'VISIBLE_DIALOGS_REMOVE':
                newState = Object.assign({}, state);
                newState.visibleDialogs = Object.assign({}, newState.visibleDialogs);
                delete newState.visibleDialogs[action.name];
                newState = hideBackgroundDialogsWithId(newState, action.name);
                break;
            case 'FOCUS_SET':
                newState = Object.assign({}, state);
                newState.focusedField = action.field;
                break;
            case 'FOCUS_CLEAR':
                // A field can only clear its own state
                if (action.field === state.focusedField) {
                    newState = Object.assign({}, state);
                    newState.focusedField = null;
                }
                break;
            case 'DIALOG_OPEN':
            case 'DIALOG_CLOSE':
                {
                    let isOpen = true;
                    if (action.type === 'DIALOG_CLOSE') {
                        isOpen = false;
                    }
                    else { // DIALOG_OPEN
                        isOpen = action.isOpen !== false;
                    }
                    newState = Object.assign({}, state);
                    if (isOpen) {
                        const newDialogs = newState.dialogs.slice();
                        if (newDialogs.find(d => d.name === action.name))
                            throw new Error(`Trying to open a dialog is already open: ${action.name}`);
                        newDialogs.push({
                            name: action.name,
                            props: action.props || {},
                        });
                        newState.dialogs = newDialogs;
                    }
                    else {
                        if (!newState.dialogs.find(d => d.name === action.name))
                            throw new Error(`Trying to close a dialog that is not open: ${action.name}`);
                        const newDialogs = newState.dialogs.slice().filter(d => d.name !== action.name);
                        newState.dialogs = newDialogs;
                    }
                }
                break;
            case 'LAYOUT_MOVE_MODE_SET':
                newState = Object.assign(Object.assign({}, state), { layoutMoveMode: action.value });
                break;
            case 'RESET_LAYOUT':
                newState = Object.assign(Object.assign({}, state), { isResettingLayout: action.value });
                break;
        }
    }
    catch (error) {
        error.message = `In reducer: ${error.message} Action: ${JSON.stringify(action)}`;
        throw error;
    }
    return newState;
}
//# sourceMappingURL=app.reducer.js.map