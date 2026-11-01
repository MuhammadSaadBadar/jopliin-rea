"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const ChatConversation_1 = __importDefault(require("@joplin/lib/models/ChatConversation"));
exports.declaration = {
    name: 'openAiChatConversation',
};
const runtime = () => ({
    execute: async (context, conversationId) => {
        const messages = await ChatConversation_1.default.messages(conversationId);
        context.dispatch({ type: 'AI_CHAT_OPEN', windowId: context.state.windowId, conversationId, messages });
        context.dispatch({
            type: 'WINDOW_LAYOUT_SET_ITEM_PROP', windowId: context.state.windowId,
            itemKey: 'chatPanel', propName: 'visible', propValue: true,
        });
    },
});
exports.runtime = runtime;
//# sourceMappingURL=openAiChatConversation.js.map