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
const react_redux_1 = require("react-redux");
const locale_1 = require("@joplin/lib/locale");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const reducer_1 = require("@joplin/lib/reducer");
const noteChat_1 = require("@joplin/lib/services/ai/noteChat");
const availability_1 = require("@joplin/lib/services/ai/availability");
const NewWindowOrIFrame_1 = require("../NewWindowOrIFrame");
const AiDegradedNotice_1 = __importDefault(require("../AiDegradedNotice"));
const types_1 = require("@joplin/lib/services/ai/types");
const JoplinError_1 = __importDefault(require("@joplin/lib/JoplinError"));
const eventManager_1 = __importStar(require("@joplin/lib/eventManager"));
const time_1 = require("@joplin/utils/time");
const ChatMessageItem_1 = __importDefault(require("./ChatMessageItem"));
const NavService_1 = __importDefault(require("@joplin/lib/services/NavService"));
const ChatConversation_1 = __importDefault(require("@joplin/lib/models/ChatConversation"));
const uuid_1 = __importDefault(require("@joplin/lib/uuid"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const dialogs_1 = __importDefault(require("../dialogs"));
const ChatHistory_1 = __importDefault(require("./ChatHistory"));
const Button_1 = __importStar(require("../Button/Button"));
const logger = Logger_1.default.create('ChatPanel');
const disclosureSetting = 'ai.chat.disclosureAcknowledged';
const makeId = () => uuid_1.default.create();
const waitForNextNoteChangeOrTimeout = (noteId, timeout) => {
    return new Promise((resolve) => {
        const listener = (event) => {
            if (event.itemId === noteId) {
                onComplete();
            }
        };
        const onComplete = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            eventManager_1.default.off(eventManager_1.EventName.ItemChange, listener);
            resolve();
        };
        eventManager_1.default.on(eventManager_1.EventName.ItemChange, listener);
        let timeoutId = setTimeout(() => {
            onComplete();
        }, timeout);
    });
};
const useCancelCallback = () => {
    const abortControllerRef = (0, react_1.useRef)(new AbortController());
    const cancelRequest = (0, react_1.useCallback)(() => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
    }, []);
    // Cancel on Reset / unmount so an in-flight reply can detect it should
    // abort instead of landing in a cleared or destroyed conversation.
    const cancelRequestRef = (0, react_1.useRef)(cancelRequest);
    cancelRequestRef.current = cancelRequest;
    (0, react_1.useEffect)(() => () => {
        cancelRequestRef.current();
    }, []);
    return { abortControllerRef, cancelRequest };
};
const useHasFocus = () => {
    const [hasFocus, setHasFocus] = (0, react_1.useState)(false);
    const onFocus = (0, react_1.useCallback)(() => setHasFocus(true), []);
    const onBlur = (0, react_1.useCallback)((event) => {
        const chatPanelContainer = event.currentTarget;
        const newElementWithFocus = event.relatedTarget;
        const movingFocusOut = !chatPanelContainer.contains(newElementWithFocus);
        // Avoid quickly toggling hasFocus: onBlur/onFocus are emitted when moving focus between
        // elements within the container.
        if (movingFocusOut) {
            setHasFocus(false);
        }
    }, []);
    return { hasFocus, onFocus, onBlur };
};
// Single-window for v1: mapStateToProps hard-codes defaultWindowId and the
// toggle writes to the app-wide layout. A second window would mirror the main.
const ChatPanel = (props) => {
    const { dispatch, messages } = props;
    const [input, setInput] = (0, react_1.useState)('');
    const [historyOpen, setHistoryOpen] = (0, react_1.useState)(false);
    const historyId = (0, react_1.useId)();
    const [conversations, setConversations] = (0, react_1.useState)([]);
    const loadConversationHistory = (0, react_1.useCallback)(async (search = '') => {
        try {
            setConversations(await ChatConversation_1.default.history(search));
        }
        catch (error) {
            logger.error('Could not load chat conversations', error);
        }
    }, []);
    const handleHistoryToggle = (0, react_1.useCallback)(async () => {
        setHistoryOpen(!historyOpen);
        if (historyOpen)
            return;
        await loadConversationHistory();
    }, [historyOpen, loadConversationHistory]);
    const historyPopupRef = (0, react_1.useRef)(null);
    const historyButtonRef = (0, react_1.useRef)(null);
    const closeHistory = (0, react_1.useCallback)(() => {
        setHistoryOpen(false);
        (0, focusHandler_1.focus)('ChatPanel::closeHistory', historyButtonRef.current);
    }, []);
    (0, react_1.useEffect)(() => {
        if (!historyOpen)
            return () => { };
        const onMouseDown = (event) => {
            var _a, _b;
            const target = event.target;
            if (((_a = historyPopupRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)) || ((_b = historyButtonRef.current) === null || _b === void 0 ? void 0 : _b.contains(target)))
                return;
            setHistoryOpen(false);
        };
        const doc = historyButtonRef.current.ownerDocument;
        doc.addEventListener('mousedown', onMouseDown);
        return () => doc.removeEventListener('mousedown', onMouseDown);
    }, [historyOpen]);
    const [sending, setSending] = (0, react_1.useState)(false);
    const archivingRef = (0, react_1.useRef)(false);
    const [disclosureShown, setDisclosureShown] = (0, react_1.useState)(() => {
        try {
            return !!Setting_1.default.value(disclosureSetting);
        }
        catch (_a) {
            return false;
        }
    });
    const lastNoteIdRef = (0, react_1.useRef)(props.noteId);
    const messagesLengthRef = (0, react_1.useRef)(messages.length);
    messagesLengthRef.current = messages.length;
    // Lets async work detect note switches without re-running its closure.
    const noteIdRef = (0, react_1.useRef)(props.noteId);
    noteIdRef.current = props.noteId;
    const messagesEndRef = (0, react_1.useRef)(null);
    const { hasFocus, onFocus, onBlur } = useHasFocus();
    const { abortControllerRef, cancelRequest } = useCancelCallback();
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    const appendMessage = (0, react_1.useCallback)(async (message) => {
        var _a;
        const fullMessage = Object.assign(Object.assign({}, message), { createdTime: Date.now(), noteId: (_a = props.noteId) !== null && _a !== void 0 ? _a : '', noteTitle: props.noteId ? props.noteTitle : '' });
        try {
            await ChatConversation_1.default.addMessage(props.conversationId, fullMessage);
        }
        catch (error) {
            logger.error('Could not save chat message:', error);
        }
    }, [props.noteId, props.noteTitle, props.conversationId]);
    const removeMessage = (0, react_1.useCallback)(async (id) => {
        try {
            await ChatConversation_1.default.removeMessage(props.conversationId, id);
        }
        catch (error) {
            logger.error('Could not remove chat message:', error);
        }
    }, [props.conversationId]);
    const addToolResult = (0, react_1.useCallback)(async (result) => {
        try {
            await ChatConversation_1.default.addToolResult(props.conversationId, result);
        }
        catch (error) {
            logger.error('Could not save chat tool result:', error);
        }
    }, [props.conversationId]);
    (0, react_1.useEffect)(() => {
        if (props.conversationId)
            return;
        dispatch({ type: 'AI_CHAT_OPEN', windowId, conversationId: uuid_1.default.create(), messages });
    }, [props.conversationId, dispatch, windowId, messages]);
    // Drop a separator when the active note changes mid-conversation. Skip
    // the first ever opened note (no prior context to separate from).
    (0, react_1.useEffect)(() => {
        const prev = lastNoteIdRef.current;
        lastNoteIdRef.current = props.noteId;
        if (prev === null || prev === props.noteId || !props.noteId)
            return;
        if (messagesLengthRef.current === 0)
            return;
        const text = (0, locale_1._)('— now viewing: %s —', props.noteTitle || (0, locale_1._)('(untitled)'));
        void appendMessage({
            id: makeId(),
            role: 'separator',
            text,
            raw: [{ role: types_1.ChatRole.User, content: (0, locale_1._)('Switched notes: %s', text) }],
        });
    }, [props.noteId, props.noteTitle, appendMessage]);
    (0, react_1.useEffect)(() => {
        var _a;
        if (messages.length === 0)
            return;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const conversationTurns = (0, react_1.useMemo)(() => {
        return messages
            .map(m => m.raw)
            .flat();
    }, [messages]);
    // Joplin Cloud is remote but the user already consented via sync setup.
    const requiresDisclosure = props.providerType !== 'joplin-cloud';
    const showDisclosure = requiresDisclosure && !disclosureShown && messages.length === 0;
    const handleCancel = (0, react_1.useCallback)(() => {
        cancelRequest();
        void appendMessage({ id: makeId(), role: 'assistant', text: (0, locale_1._)('(Cancelled)'), raw: [] });
    }, [cancelRequest, appendMessage]);
    const handleSend = (0, react_1.useCallback)(async () => {
        const text = input.trim();
        if (!text || sending)
            return;
        if (!props.noteId) {
            void appendMessage({
                id: makeId(), role: 'error', text: (0, locale_1._)('Open a note to start chatting.'), raw: [],
            });
            return;
        }
        const abortController = abortControllerRef.current;
        const noteIdAtStart = props.noteId;
        setSending(true);
        setInput('');
        // Captured so we can roll it back on failure — otherwise a retry would
        // send the prior user turn as history alongside the new prompt.
        const userTurnId = makeId();
        let hadVisibleResponse = false;
        void appendMessage({
            id: userTurnId,
            role: 'user',
            text,
            raw: [{ role: types_1.ChatRole.User, content: text }],
        });
        try {
            const note = await Note_1.default.load(props.noteId);
            if (abortController.signal.aborted)
                return;
            if (!note)
                throw new Error(`Note not found: ${props.noteId}`);
            const getContext = async () => {
                let selection = '';
                try {
                    selection = await CommandService_1.default.instance().executeInWindow('selectedText', { windowId, args: [] }) || '';
                }
                catch (_a) {
                    // Editor may not be ready; treat as no selection.
                }
                const note = await Note_1.default.load(props.noteId);
                if (!note)
                    throw new Error(`Note not found: ${props.noteId}`);
                return {
                    body: note.body,
                    title: note.title,
                    selection,
                    noteId: note.id,
                    folderId: note.parent_id,
                };
            };
            let lastHistory = [
                { role: types_1.ChatRole.System, content: 'placeholder' },
                ...conversationTurns,
            ];
            const onHistoryChanged = (history) => {
                if (abortController.signal.aborted)
                    return;
                for (let i = lastHistory.length; i < history.length; i++) {
                    const entry = history[i];
                    // User messages are added elsewhere, when the user submits the chat
                    if (entry.role === types_1.ChatRole.User)
                        continue;
                    // System messages are not shown in the UI
                    if (entry.role === types_1.ChatRole.System)
                        continue;
                    if (entry.role === types_1.ChatRole.Tool) {
                        void addToolResult(entry);
                    }
                    else {
                        hadVisibleResponse || (hadVisibleResponse = !entry.hide);
                        void appendMessage({
                            id: makeId(),
                            role: entry.role,
                            text: entry.content,
                            hide: entry.hide,
                            raw: [entry],
                        });
                    }
                }
                lastHistory = history;
            };
            const assertSameNote = () => {
                if (noteIdAtStart !== noteIdRef.current) {
                    cancelRequest();
                    throw new JoplinError_1.default((0, locale_1._)('You switched notes while the request was running; edits were not applied. Try again.'), 'aiNoteChanged');
                }
            };
            await (0, noteChat_1.runNoteChat)(getContext, conversationTurns, text, {
                replaceSelection: async (text, oldText) => {
                    if (text === oldText)
                        return;
                    assertSameNote();
                    const changeListener = waitForNextNoteChangeOrTimeout(props.noteId, time_1.Second);
                    await CommandService_1.default.instance().executeInWindow('replaceSelection', {
                        windowId,
                        args: [text],
                    });
                    await changeListener;
                },
                updateNoteBody: async (newBody, oldBody) => {
                    if (newBody === oldBody)
                        return;
                    assertSameNote();
                    const changeListener = waitForNextNoteChangeOrTimeout(props.noteId, time_1.Second);
                    await CommandService_1.default.instance().executeInWindow('editor.setText', {
                        windowId,
                        args: [newBody],
                    });
                    await changeListener;
                },
                displayError: (message) => {
                    void appendMessage({ id: makeId(), role: 'error', text: message, raw: [] });
                },
            }, onHistoryChanged, abortController.signal);
        }
        catch (error) {
            logger.warn('Chat failed:', error);
            if (abortController.signal.aborted)
                return;
            if (!hadVisibleResponse) {
                void removeMessage(userTurnId);
                setInput(text);
            }
            void appendMessage({ id: makeId(), role: 'error', text: error.message || (0, locale_1._)('Something went wrong.'), raw: [] });
        }
        finally {
            setSending(false);
        }
    }, [input, sending, props.noteId, conversationTurns, windowId, addToolResult, appendMessage, removeMessage, cancelRequest, abortControllerRef]);
    const handleAcknowledgeDisclosure = (0, react_1.useCallback)(() => {
        Setting_1.default.setValue(disclosureSetting, true);
        setDisclosureShown(true);
    }, []);
    const handleNewChat = (0, react_1.useCallback)(() => {
        if (archivingRef.current)
            return;
        cancelRequest();
        // Only saved once a message is sent so empty chats don't show up in history
        dispatch({ type: 'AI_CHAT_OPEN', windowId, conversationId: uuid_1.default.create(), messages: [] });
    }, [dispatch, windowId, cancelRequest]);
    const handleOpenConversation = (0, react_1.useCallback)(async (conversationId) => {
        if (conversationId === props.conversationId || archivingRef.current)
            return;
        archivingRef.current = true;
        cancelRequest();
        try {
            await CommandService_1.default.instance().executeInWindow('openAiChatConversation', { windowId, args: [conversationId] });
        }
        catch (error) {
            logger.error('Could not open chat conversation:', error);
        }
        finally {
            archivingRef.current = false;
        }
    }, [windowId, cancelRequest, props.conversationId]);
    const handleClose = (0, react_1.useCallback)(() => {
        void CommandService_1.default.instance().executeInWindow('toggleAiChat', { windowId: windowId, args: [] });
    }, [windowId]);
    const handleDeleteConversation = (0, react_1.useCallback)(async (conversationId) => {
        if (archivingRef.current)
            return;
        archivingRef.current = true;
        if (conversationId === props.conversationId)
            cancelRequest();
        try {
            await ChatConversation_1.default.deleteConversation(conversationId);
            setConversations(current => current.filter(item => item.id !== conversationId));
            dispatch({ type: 'AI_CHAT_DELETE', conversationId });
        }
        catch (error) {
            logger.error('Could not delete chat conversation:', error);
            await dialogs_1.default.alert((0, locale_1._)('Could not delete conversation.'));
        }
        finally {
            archivingRef.current = false;
        }
    }, [dispatch, cancelRequest, props.conversationId]);
    const handleRenameConversation = (0, react_1.useCallback)(async (conversation, newTitle) => {
        const title = newTitle.trim();
        if (!title || title === conversation.title)
            return;
        try {
            await ChatConversation_1.default.renameConversation(conversation.id, title);
            setConversations(current => current.map(item => item.id === conversation.id ? Object.assign(Object.assign({}, item), { title }) : item));
        }
        catch (error) {
            logger.error('Could not rename chat conversation:', error);
            await dialogs_1.default.alert((0, locale_1._)('Could not rename conversation.'));
        }
    }, []);
    const handleHideToolbarButton = (0, react_1.useCallback)(() => {
        Setting_1.default.setValue('ai.chat.showToolbarButton', false);
        handleClose();
    }, [handleClose]);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        // Don't send while an IME composition is in flight — Enter commits
        // the composition for CJK / accented input.
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            if (!sending)
                void handleSend();
        }
    }, [handleSend, sending]);
    const renderContent = () => {
        if (!props.available) {
            const content = (React.createElement("div", { className: 'disabled-message' },
                React.createElement("div", { className: 'hint' }, props.unavailableHint),
                props.showToolbarButton && React.createElement(React.Fragment, null,
                    React.createElement("div", { className: 'hint' }, (0, locale_1._)('If you do not want to use the AI features, you may hide the toolbar button:')),
                    React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Secondary, title: (0, locale_1._)('Hide the AI Chat button'), onClick: handleHideToolbarButton }),
                    React.createElement("div", { className: 'hint' }, (0, locale_1._)('(You can show it again from Settings → AI)')))));
            return { content, showingMessages: false };
        }
        if (props.noteIsEncrypted) {
            const content = (React.createElement("div", { className: 'disabled-message' }, (0, locale_1._)('This note is encrypted and cannot be used with AI Chat.')));
            return { content, showingMessages: false };
        }
        const visibleMessages = messages.filter(m => !m.hide);
        const content = React.createElement(React.Fragment, null,
            props.aiDegraded && React.createElement(AiDegradedNotice_1.default, { className: 'degraded-status' }),
            React.createElement("div", { className: 'messages', "aria-live": hasFocus ? 'polite' : undefined },
                visibleMessages.length === 0 && (React.createElement("div", { className: 'empty' },
                    (0, locale_1._)('Ask about this note, or request changes. Select text in the editor first to scope the request to that selection.'),
                    React.createElement("br", null),
                    React.createElement("br", null),
                    React.createElement("button", { type: 'button', className: 'link-button', onClick: () => NavService_1.default.go('Config', { props: { defaultSection: 'ai.tools' } }) }, (0, locale_1._)('Manage capabilities')))),
                visibleMessages.map(m => React.createElement(ChatMessageItem_1.default, { key: m.id, message: m })),
                React.createElement("div", { ref: messagesEndRef })),
            React.createElement("div", { className: 'composer' },
                showDisclosure && (React.createElement("div", { className: 'disclosure' },
                    (0, locale_1._)('Your note will be sent to the configured AI provider (%s).', props.providerType),
                    ' ',
                    React.createElement("a", { href: '#', onClick: (e) => { e.preventDefault(); handleAcknowledgeDisclosure(); } }, (0, locale_1._)('Don\'t show again')))),
                React.createElement("div", { className: 'input-wrapper' },
                    React.createElement("textarea", { className: 'input', value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: (0, locale_1._)('Ask about this note, or request a change…'), "aria-label": (0, locale_1._)('Chat message') }),
                    React.createElement("button", { type: 'button', className: 'send', onClick: sending ? handleCancel : handleSend, disabled: !sending && !input.trim(), "aria-label": sendButtonLabel, title: sendButtonLabel },
                        React.createElement("i", { className: sending ? 'fas fa-stop' : 'fas fa-paper-plane', "aria-hidden": 'true' })))));
        return { content, showingMessages: visibleMessages.length > 0 };
    };
    const sendButtonLabel = sending ? (0, locale_1._)('Stop generating') : (0, locale_1._)('Send');
    const closeLabel = (0, locale_1._)('Close');
    const newChatLabel = (0, locale_1._)('New chat');
    const headerId = (0, react_1.useId)();
    const { content, showingMessages } = renderContent();
    return (React.createElement("div", { className: 'chat-panel', role: 'region', "aria-labelledby": headerId, onFocus: onFocus, onBlur: onBlur },
        React.createElement("div", { className: 'header chat-panel-header' },
            React.createElement("h1", { className: 'title', id: headerId }, (0, locale_1._)('AI Chat')),
            props.availabilityReason !== availability_1.AvailabilityReason.Disabled && (React.createElement("button", { type: 'button', className: 'history toolbar-button', ref: historyButtonRef, onClick: handleHistoryToggle, title: (0, locale_1._)('Chat history'), "aria-label": (0, locale_1._)('Chat history'), "aria-expanded": historyOpen, "aria-controls": historyId },
                React.createElement("i", { className: 'toolbar-icon far fa-clock', "aria-hidden": 'true' }))),
            historyOpen && (
            // Placed right after its button so that Tab moves from the button into the popup
            React.createElement(ChatHistory_1.default, { conversations: conversations, currentConversationId: props.conversationId, id: historyId, popupRef: historyPopupRef, onSearchChange: loadConversationHistory, onOpen: handleOpenConversation, onRename: handleRenameConversation, onDelete: handleDeleteConversation, onClose: closeHistory })),
            React.createElement("button", { type: 'button', className: 'reset toolbar-button', onClick: handleNewChat, disabled: !showingMessages, title: newChatLabel, "aria-label": newChatLabel },
                React.createElement("i", { className: 'toolbar-icon fas fa-comment-medical', "aria-hidden": 'true' })),
            React.createElement("button", { type: 'button', className: 'close toolbar-button', onClick: handleClose, title: closeLabel, "aria-label": closeLabel },
                React.createElement("i", { className: 'toolbar-icon fas fa-times', role: 'img', "aria-hidden": true }))),
        content));
};
const mapStateToProps = (state, ownProps) => {
    var _a, _b;
    const windowState = reducer_1.stateUtils.windowStateById(state, ownProps.windowId);
    const noteId = reducer_1.stateUtils.selectedNoteId(windowState);
    const note = noteId ? windowState.notes.find(n => n.id === noteId) : null;
    const availability = (0, availability_1.chatAvailability)();
    return {
        themeId: state.settings.theme,
        available: availability.available,
        availabilityReason: availability.reason,
        unavailableHint: (_a = availability.hint) !== null && _a !== void 0 ? _a : '',
        providerType: state.settings['ai.chat.providerType'] || 'openai-compatible',
        noteId,
        noteTitle: (note === null || note === void 0 ? void 0 : note.title) || '',
        noteIsEncrypted: !!(note === null || note === void 0 ? void 0 : note.encryption_applied),
        messages: windowState.aiChatMessages || [],
        conversationId: windowState.aiChatConversationId,
        aiDegraded: !!((_b = state.aiStatus) === null || _b === void 0 ? void 0 : _b.degraded),
        showToolbarButton: !!state.settings['ai.chat.showToolbarButton'],
    };
};
const ConversationPanel = props => React.createElement(ChatPanel, Object.assign({ key: props.conversationId }, props));
exports.default = (0, react_redux_1.connect)(mapStateToProps)(ConversationPanel);
//# sourceMappingURL=ChatPanel.js.map