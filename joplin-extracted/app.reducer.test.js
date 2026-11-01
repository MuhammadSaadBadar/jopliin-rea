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
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@joplin/lib/services/ai/types");
const app_reducer_1 = require("./app.reducer");
const app_reducer_2 = __importStar(require("./app.reducer"));
describe('app.reducer', () => {
    it('should clear a deleted conversation from matching windows and keep other conversations', () => {
        const messages = [{ id: 'question', createdTime: 1, role: 'user', text: 'Question', raw: [], noteId: '', noteTitle: '' }];
        const state = (0, app_reducer_2.createAppDefaultState)({});
        state.aiChatConversationId = 'deleted';
        state.aiChatMessages = messages;
        state.backgroundWindows = {
            second: Object.assign(Object.assign({}, (0, app_reducer_1.createAppDefaultWindowState)()), { windowId: 'second', aiChatConversationId: 'deleted', aiChatMessages: messages }),
            third: Object.assign(Object.assign({}, (0, app_reducer_1.createAppDefaultWindowState)()), { windowId: 'third', aiChatConversationId: 'other', aiChatMessages: messages }),
        };
        const result = (0, app_reducer_2.default)(state, { type: 'AI_CHAT_DELETE', conversationId: 'deleted' });
        expect(result.aiChatConversationId).toBeNull();
        expect(result.aiChatMessages).toEqual([]);
        expect(result.backgroundWindows.second.aiChatConversationId).toBeNull();
        expect(result.backgroundWindows.second.aiChatMessages).toEqual([]);
        expect(result.backgroundWindows.third.aiChatConversationId).toBe('other');
        expect(result.backgroundWindows.third.aiChatMessages).toEqual(messages);
    });
    it('should handle DIALOG_OPEN', async () => {
        const state = (0, app_reducer_2.createAppDefaultState)({});
        let newState = (0, app_reducer_2.default)(state, {
            type: 'DIALOG_OPEN',
            name: 'syncWizard',
        });
        expect(newState.dialogs.length).toBe(1);
        expect(newState.dialogs[0].name).toBe('syncWizard');
        expect(() => (0, app_reducer_2.default)(newState, {
            type: 'DIALOG_OPEN',
            name: 'syncWizard',
        })).toThrow();
        newState = (0, app_reducer_2.default)(newState, {
            type: 'DIALOG_CLOSE',
            name: 'syncWizard',
        });
        expect(newState.dialogs.length).toBe(0);
        expect(() => (0, app_reducer_2.default)(newState, {
            type: 'DIALOG_CLOSE',
            name: 'syncWizard',
        })).toThrow();
        newState = (0, app_reducer_2.default)(newState, {
            type: 'DIALOG_OPEN',
            name: 'syncWizard',
        });
        newState = (0, app_reducer_2.default)(newState, {
            type: 'DIALOG_OPEN',
            name: 'setPassword',
        });
        expect(newState.dialogs).toEqual([
            { name: 'syncWizard', props: {} },
            { name: 'setPassword', props: {} },
        ]);
    });
    it('aI_STATUS_UPDATE merges a partial payload without clobbering unrelated fields', () => {
        const state = Object.assign(Object.assign({}, (0, app_reducer_2.createAppDefaultState)({})), { aiStatus: { degraded: true, tokensUsed: 500, tokensBudget: 1000, lastToastShownAt: 12345 } });
        const afterUsage = (0, app_reducer_2.default)(state, {
            type: 'AI_STATUS_UPDATE',
            payload: { tokensUsed: 600 },
        });
        expect(afterUsage.aiStatus).toEqual({
            degraded: true,
            tokensUsed: 600,
            tokensBudget: 1000,
            lastToastShownAt: 12345,
        });
        const afterToast = (0, app_reducer_2.default)(afterUsage, {
            type: 'AI_STATUS_UPDATE',
            payload: { lastToastShownAt: 67890 },
        });
        expect(afterToast.aiStatus).toEqual({
            degraded: true,
            tokensUsed: 600,
            tokensBudget: 1000,
            lastToastShownAt: 67890,
        });
    });
    it('showing a dialog in one window should hide dialogs with the same ID in background windows', () => {
        const state = Object.assign(Object.assign({}, (0, app_reducer_2.createAppDefaultState)({})), { backgroundWindows: {
                testWindow: Object.assign(Object.assign({}, (0, app_reducer_1.createAppDefaultWindowState)()), { windowId: 'testWindow', visibleDialogs: {
                        testDialog: true,
                    } }),
            } });
        const newState = (0, app_reducer_2.default)(state, {
            type: 'VISIBLE_DIALOGS_ADD',
            name: 'testDialog',
        });
        expect(newState.backgroundWindows.testWindow.visibleDialogs).toEqual({});
        expect(newState.visibleDialogs).toEqual({ testDialog: true });
    });
    it('should build AI chat history', () => {
        let state = Object.assign(Object.assign({}, (0, app_reducer_2.createAppDefaultState)({})), { aiChatConversationId: 'chat-1' });
        let idCounter = 0;
        const buildMessage = (role, content, toolCalls) => ({
            id: `id-${idCounter++}`,
            createdTime: 1,
            noteId: 'note-a',
            noteTitle: 'A',
            role,
            text: content,
            raw: [
                Object.assign({ role, content: content }, (toolCalls.length ? { toolCalls } : {})),
            ],
        });
        state = (0, app_reducer_2.default)(state, {
            type: 'AI_CHAT_APPEND',
            conversationId: 'chat-1',
            message: buildMessage(types_1.ChatRole.User, 'Test', []),
        });
        state = (0, app_reducer_2.default)(state, {
            type: 'AI_CHAT_APPEND',
            conversationId: 'chat-1',
            message: buildMessage(types_1.ChatRole.Assistant, 'Testing', [{ toolName: 'testTool', callId: 'call-1', arguments: { arg: 1 }, parseError: null }]),
        });
        state = (0, app_reducer_2.default)(state, {
            type: 'AI_CHAT_ADD_TOOL_RESULT',
            conversationId: 'chat-1',
            toolCall: {
                role: types_1.ChatRole.Tool,
                toolName: 'testTool',
                toolCallId: 'call-1',
                userDescription: '',
                isError: false,
                isEdit: true,
                content: 'Result',
            },
        });
        expect(state.aiChatMessages).toMatchObject([
            { id: 'id-0', role: 'user', text: 'Test', raw: [{ role: 'user' }] },
            { id: 'id-1', role: 'assistant', text: 'Testing' },
        ]);
    });
});
//# sourceMappingURL=app.reducer.test.js.map