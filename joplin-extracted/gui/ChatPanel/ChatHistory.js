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
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const time_1 = require("@joplin/utils/time");
const ChatHistory = props => {
    const [search, setSearch] = (0, react_1.useState)('');
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [draftTitle, setDraftTitle] = (0, react_1.useState)('');
    const startEditing = (conversation) => {
        setEditingId(conversation.id);
        setDraftTitle(conversation.title);
    };
    const stopEditing = () => setEditingId(null);
    const onTitleKeyDown = (event, conversation) => {
        if (event.nativeEvent.isComposing)
            return;
        if (event.key === 'Escape') {
            event.stopPropagation();
            stopEditing();
            return;
        }
        if (event.key !== 'Enter')
            return;
        event.preventDefault();
        props.onRename(conversation, draftTitle);
        stopEditing();
    };
    const onPopupKeyDown = (event) => {
        if (event.nativeEvent.isComposing || event.key !== 'Escape')
            return;
        event.stopPropagation();
        props.onClose();
    };
    return React.createElement("div", { className: 'chat-history', id: props.id, ref: props.popupRef, onKeyDown: onPopupKeyDown },
        React.createElement("div", { className: 'conversation-search search' },
            React.createElement("i", { className: 'icon icon-search', "aria-hidden": 'true' }),
            React.createElement("input", { className: 'field', type: 'search', autoFocus: true, "aria-label": (0, locale_1._)('Search conversations'), placeholder: (0, locale_1._)('Search conversations'), value: search, onChange: event => {
                    setSearch(event.target.value);
                    props.onSearchChange(event.target.value);
                } })),
        React.createElement("ul", { className: 'conversation-list', "aria-label": (0, locale_1._)('Conversations') }, props.conversations.map(conversation => {
            const current = conversation.id === props.currentConversationId;
            const title = conversation.title || (0, locale_1._)('(untitled)');
            const editing = conversation.id === editingId;
            return React.createElement("li", { key: conversation.id, className: `conversation-row${current ? ' -current' : ''}`, "aria-current": current ? 'true' : undefined, onClick: event => {
                    if (event.target === event.currentTarget)
                        props.onOpen(conversation.id);
                } },
                editing ? (React.createElement("input", { className: 'title-input', type: 'text', autoFocus: true, "aria-label": (0, locale_1._)('Conversation title'), value: draftTitle, onChange: event => setDraftTitle(event.target.value), onKeyDown: event => onTitleKeyDown(event, conversation), onBlur: stopEditing })) : (React.createElement("button", { className: 'conversation-link open', type: 'button', onClick: () => props.onOpen(conversation.id) },
                    React.createElement("span", { className: 'title' }, title),
                    React.createElement("span", { className: 'timestamp' }, (0, time_1.formatMsToRelativeTime)(conversation.updated_time)))),
                React.createElement("div", { className: 'conversation-actions actions' },
                    React.createElement("button", { className: 'flat-button', type: 'button', title: (0, locale_1._)('Rename'), "aria-label": (0, locale_1._)('Rename'), onClick: () => startEditing(conversation) },
                        React.createElement("i", { className: 'fa fa-pen', "aria-hidden": 'true' })),
                    React.createElement("button", { className: 'flat-button', type: 'button', title: (0, locale_1._)('Delete'), "aria-label": (0, locale_1._)('Delete'), onClick: () => props.onDelete(conversation.id) },
                        React.createElement("i", { className: 'fas fa-trash', "aria-hidden": 'true' }))));
        })));
};
exports.default = ChatHistory;
//# sourceMappingURL=ChatHistory.js.map