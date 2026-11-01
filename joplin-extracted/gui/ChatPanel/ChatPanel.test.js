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
const react_1 = require("@testing-library/react");
const BaseModel_1 = __importDefault(require("@joplin/lib/BaseModel"));
const ChatConversation_1 = __importDefault(require("@joplin/lib/models/ChatConversation"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const noteChat_1 = require("@joplin/lib/services/ai/noteChat");
const types_1 = require("@joplin/lib/services/ai/types");
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const app_reducer_1 = __importStar(require("../../app.reducer"));
const ChatPanel_1 = __importDefault(require("./ChatPanel"));
const NewWindowOrIFrame_1 = require("../NewWindowOrIFrame");
const uuid_1 = __importDefault(require("@joplin/lib/uuid"));
require("../../utils/window/eventHandlerOverrides");
jest.mock('@joplin/lib/services/ai/noteChat', () => ({ runNoteChat: jest.fn() }));
jest.mock('./ChatMessageItem', () => ({ message }) => React.createElement("div", null, message.text));
const Panel = ChatPanel_1.default.WrappedComponent;
const message = { id: 'question', createdTime: 1, role: 'user', text: 'Question', raw: [], noteId: 'note-a', noteTitle: 'A' };
const renderPanel = (props = {}) => (0, react_1.render)(React.createElement(NewWindowOrIFrame_1.WindowIdContext.Provider, { value: 'second' },
    React.createElement(Panel, Object.assign({ themeId: 1, available: true, unavailableHint: '', providerType: 'joplin-cloud', noteId: null, noteTitle: '', noteIsEncrypted: false, messages: [], aiDegraded: false, dispatch: jest.fn(), showToolbarButton: false }, props))));
const openHistory = async (view) => {
    await (0, react_1.act)(async () => { react_1.fireEvent.click(view.getByTitle('Chat history')); });
};
const saveConversation = async (id, title, updatedTime = 1) => {
    await ChatConversation_1.default.save({ id, title, created_time: 1, updated_time: updatedTime }, { isNew: true, autoTimestamp: false });
};
const saveMessage = async (conversationId, text) => {
    await ChatConversation_1.default.addMessage(conversationId, { id: uuid_1.default.create(), createdTime: 1, role: 'user', text, raw: [], noteId: '', noteTitle: '' });
};
describe('ChatPanel', () => {
    let modelDispatch;
    beforeEach(async () => {
        await (0, test_utils_1.setupDatabaseAndSynchronizer)(1);
        await (0, test_utils_1.switchClient)(1);
        Element.prototype.scrollIntoView = jest.fn();
        jest.mocked(noteChat_1.runNoteChat).mockReset();
        modelDispatch = jest.fn();
        BaseModel_1.default.dispatch = modelDispatch;
    });
    afterEach(() => {
        jest.restoreAllMocks();
        BaseModel_1.default.dispatch = () => { };
    });
    it('should search conversation titles and messages', async () => {
        await saveConversation('shopping', 'Shopping list');
        await saveConversation('travel', 'Travel plans');
        await saveMessage('travel', 'Visit Paris');
        const view = renderPanel();
        await openHistory(view);
        await view.findByText('Shopping list');
        const search = view.getByRole('searchbox', { name: 'Search conversations' });
        react_1.fireEvent.change(search, { target: { value: 'Shopping' } });
        await (0, react_1.waitFor)(() => expect(view.getAllByRole('listitem')).toHaveLength(1));
        expect(view.getByText('Shopping list')).toBeTruthy();
        react_1.fireEvent.change(search, { target: { value: 'Paris' } });
        expect(await view.findByText('Travel plans')).toBeTruthy();
        expect(view.getAllByRole('listitem')).toHaveLength(1);
        react_1.fireEvent.change(search, { target: { value: '' } });
        expect(await view.findByText('Shopping list')).toBeTruthy();
        expect(view.getAllByRole('listitem')).toHaveLength(2);
    });
    it('should rename a conversation inline when Enter is pressed', async () => {
        await saveConversation('chat-1', 'Old title');
        const view = renderPanel();
        await openHistory(view);
        const row = (await view.findByText('Old title')).closest('li');
        react_1.fireEvent.click((0, react_1.within)(row).getByRole('button', { name: 'Rename' }));
        const input = (0, react_1.within)(row).getByRole('textbox', { name: 'Conversation title' });
        react_1.fireEvent.change(input, { target: { value: 'New title' } });
        await (0, react_1.act)(async () => { react_1.fireEvent.keyDown(input, { key: 'Enter' }); });
        expect(await view.findByText('New title')).toBeTruthy();
        expect(view.queryByRole('textbox', { name: 'Conversation title' })).toBeNull();
        expect(await ChatConversation_1.default.load('chat-1')).toMatchObject({ title: 'New title' });
    });
    it('should close the history popup when clicking outside of it', async () => {
        await saveConversation('chat-1', 'Saved chat');
        const view = renderPanel();
        await openHistory(view);
        await view.findByText('Saved chat');
        react_1.fireEvent.mouseDown(view.getByRole('searchbox', { name: 'Search conversations' }));
        expect(view.getByText('Saved chat')).toBeTruthy();
        react_1.fireEvent.mouseDown(view.getByRole('textbox', { name: 'Chat message' }));
        await (0, react_1.waitFor)(() => expect(view.queryByText('Saved chat')).toBeNull());
    });
    it('should delete the selected conversation and its messages', async () => {
        await saveConversation('delete-chat', 'Delete this chat');
        await saveConversation('keep-chat', 'Keep this chat');
        await saveMessage('delete-chat', 'Delete this message');
        await saveMessage('keep-chat', 'Keep this message');
        const dispatch = jest.fn();
        const view = renderPanel({ conversationId: 'delete-chat', dispatch });
        await openHistory(view);
        const row = (await view.findByText('Delete this chat')).closest('li');
        await (0, react_1.act)(async () => { react_1.fireEvent.click((0, react_1.within)(row).getByRole('button', { name: 'Delete' })); });
        await (0, react_1.waitFor)(() => expect(view.queryByText('Delete this chat')).toBeNull());
        expect(view.getByText('Keep this chat')).toBeTruthy();
        expect((await ChatConversation_1.default.history()).map(conversation => conversation.id)).toEqual(['keep-chat']);
        expect(await ChatConversation_1.default.messages('keep-chat')).toMatchObject([{ text: 'Keep this message' }]);
        await saveConversation('delete-chat', 'Recreated chat');
        expect(await ChatConversation_1.default.messages('delete-chat')).toEqual([]);
        expect(dispatch).toHaveBeenCalledWith({ type: 'AI_CHAT_DELETE', conversationId: 'delete-chat' });
    });
    it('should keep history when New chat opens an empty conversation in the current window', async () => {
        await saveConversation('chat-1', 'Current chat');
        const dispatch = jest.fn();
        const view = renderPanel({ conversationId: 'chat-1', messages: [message], dispatch });
        await (0, react_1.act)(async () => { react_1.fireEvent.click(view.getByRole('button', { name: 'New chat' })); });
        await (0, react_1.waitFor)(() => expect(dispatch).toHaveBeenCalled());
        expect(await ChatConversation_1.default.load('chat-1')).toMatchObject({ title: 'Current chat' });
        const action = dispatch.mock.calls[0][0];
        expect(action).toEqual({ type: 'AI_CHAT_OPEN', windowId: 'second', conversationId: expect.any(String), messages: [] });
        expect(action.conversationId).not.toBe('chat-1');
        const state = (0, app_reducer_1.createAppDefaultState)({});
        state.aiChatConversationId = 'main-chat';
        state.aiChatMessages = [message];
        state.backgroundWindows = { second: Object.assign(Object.assign({}, (0, app_reducer_1.createAppDefaultWindowState)()), { windowId: 'second' }) };
        const opened = (0, app_reducer_1.default)(state, action);
        expect(opened.aiChatConversationId).toBe('main-chat');
        expect(opened.aiChatMessages).toEqual([message]);
        expect(opened.backgroundWindows.second.aiChatConversationId).toBe(action.conversationId);
        expect(opened.backgroundWindows.second.aiChatMessages).toEqual([]);
    });
    it('should not add an empty conversation to history', async () => {
        await saveConversation('chat-1', 'Current chat');
        const before = await ChatConversation_1.default.history();
        const dispatch = jest.fn();
        const view = renderPanel({ conversationId: 'chat-1', messages: [message], dispatch });
        await (0, react_1.act)(async () => { react_1.fireEvent.click(view.getByRole('button', { name: 'New chat' })); });
        await (0, react_1.waitFor)(() => expect(dispatch).toHaveBeenCalled());
        const after = await ChatConversation_1.default.history();
        expect(after).toHaveLength(before.length);
    });
    it('should open the selected history row in the current window', async () => {
        await saveConversation('chat-1', 'Current chat');
        await saveConversation('chat-2', 'Saved chat');
        const execute = jest.spyOn(CommandService_1.default.instance(), 'executeInWindow').mockResolvedValue(undefined);
        const view = renderPanel({ conversationId: 'chat-1', messages: [message] });
        await openHistory(view);
        react_1.fireEvent.click(await view.findByRole('button', { name: /Saved chat/ }));
        await (0, react_1.waitFor)(() => expect(execute).toHaveBeenCalledWith('openAiChatConversation', { windowId: 'second', args: ['chat-2'] }));
    });
    it('should save the question and reply with the active note ID and title as they are created', async () => {
        jest.spyOn(Note_1.default, 'load').mockResolvedValue({ id: 'note-a', title: 'A', body: '' });
        jest.mocked(noteChat_1.runNoteChat).mockImplementation(async (_context, _history, _text, _tools, onHistoryChanged) => {
            onHistoryChanged([{ role: types_1.ChatRole.System, content: '' }, { role: types_1.ChatRole.Assistant, content: 'Reply' }]);
            return [];
        });
        const view = renderPanel({ conversationId: 'chat-1', noteId: 'note-a', noteTitle: 'A' });
        react_1.fireEvent.change(view.getByRole('textbox'), { target: { value: 'Question' } });
        await (0, react_1.act)(async () => { react_1.fireEvent.click(view.getByRole('button', { name: 'Send' })); });
        const expected = [
            { role: 'user', text: 'Question', noteId: 'note-a', noteTitle: 'A' },
            { role: 'assistant', text: 'Reply', noteId: 'note-a', noteTitle: 'A' },
        ];
        await (0, react_1.waitFor)(async () => expect(await ChatConversation_1.default.messages('chat-1')).toMatchObject(expected));
        expect(await ChatConversation_1.default.load('chat-1')).toMatchObject({ title: 'Question' });
        const appended = modelDispatch.mock.calls.map(([action]) => action).filter(action => action.type === 'AI_CHAT_APPEND');
        expect(appended).toMatchObject(expected.map(message => ({ conversationId: 'chat-1', message })));
    });
    it('should remove the saved question when the request fails before any reply', async () => {
        jest.spyOn(Note_1.default, 'load').mockResolvedValue({ id: 'note-a', title: 'A', body: '' });
        jest.mocked(noteChat_1.runNoteChat).mockRejectedValue(new Error('Network down'));
        const view = renderPanel({ conversationId: 'chat-1', noteId: 'note-a', noteTitle: 'A', dispatch: jest.fn() });
        react_1.fireEvent.change(view.getByRole('textbox'), { target: { value: 'Question' } });
        await (0, react_1.act)(async () => { react_1.fireEvent.click(view.getByRole('button', { name: 'Send' })); });
        await (0, react_1.waitFor)(async () => expect(await ChatConversation_1.default.messages('chat-1')).toMatchObject([{ role: 'error', text: 'Network down' }]));
    });
    it('should assign an ID before messages are added to a new conversation', async () => {
        const dispatch = jest.fn();
        renderPanel({ dispatch });
        await (0, react_1.waitFor)(() => expect(dispatch).toHaveBeenCalledWith({
            type: 'AI_CHAT_OPEN', windowId: 'second', conversationId: expect.any(String), messages: [],
        }));
    });
});
//# sourceMappingURL=ChatPanel.test.js.map