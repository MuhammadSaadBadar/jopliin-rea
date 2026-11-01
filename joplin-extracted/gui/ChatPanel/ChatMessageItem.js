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
const locale_1 = require("@joplin/lib/locale");
const InlineMarkdownDisplay_1 = __importDefault(require("../InlineMarkdownDisplay"));
const types_1 = require("@joplin/lib/services/ai/types");
const toolResultSummary = (actions) => {
    const toolResults = actions.filter(action => action.role === types_1.ChatRole.Tool);
    const editSummary = () => {
        let applied = 0;
        let missed = 0;
        let lastEdit = null;
        for (const result of toolResults) {
            if (!result.isEdit)
                continue;
            if (result.isError) {
                missed++;
            }
            else {
                applied++;
                lastEdit = result;
            }
        }
        if (applied + missed === 0)
            return '';
        if (missed === 0 && applied > 1)
            return (0, locale_1._)('%d edit(s) applied.', applied);
        if (missed === 0 && lastEdit)
            return lastEdit.userDescription;
        return (0, locale_1._)('%d edit(s) applied, %d could not be placed automatically.', applied, missed);
    };
    return [
        ...toolResults
            .filter(result => !result.isEdit)
            .map(result => result.userDescription),
        editSummary(),
    ]
        .filter(item => !!item)
        .join('\n');
};
const hasToolError = (actions) => {
    return actions.some(action => action.role === types_1.ChatRole.Tool && action.isError);
};
const ChatMessageItem = ({ message }) => {
    if (message.role === 'separator') {
        return React.createElement("div", { className: 'separator' }, message.text);
    }
    if (message.role === 'error') {
        return React.createElement("div", { className: 'error' }, message.text);
    }
    const summary = message.role === 'assistant' ? toolResultSummary(message.raw) : '';
    // Always show something in the message box:
    const textContent = !message.text && !summary ? (0, locale_1._)('(no message)') : message.text;
    const renderMarkdown = message.role === 'assistant';
    const content = renderMarkdown
        ? React.createElement(InlineMarkdownDisplay_1.default, { className: 'content', markdown: textContent, allowLinks: false })
        : React.createElement("div", { className: 'content' }, textContent);
    return (React.createElement("div", { className: `chat-message turn -${message.role}` },
        content,
        summary && (React.createElement("div", { className: 'meta' }, hasToolError(message.raw)
            ? React.createElement("span", { className: 'warning' }, summary)
            : React.createElement("span", null, summary)))));
};
exports.default = ChatMessageItem;
//# sourceMappingURL=ChatMessageItem.js.map