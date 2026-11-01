"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const layoutItemProp_1 = __importDefault(require("../../ResizableLayout/utils/layoutItemProp"));
const reducer_1 = require("@joplin/lib/reducer");
exports.declaration = {
    name: 'toggleAiChat',
    label: () => (0, locale_1._)('Toggle AI Chat'),
    iconName: 'fas fa-comment-dots',
};
const runtime = (control) => {
    return {
        execute: async (context) => {
            const state = context.state;
            const layout = state.windowId === reducer_1.defaultWindowId ? state.mainLayout : state.secondaryWindowLayout;
            if (!layout)
                return;
            const visible = !(0, layoutItemProp_1.default)(layout, 'chatPanel', 'visible');
            control.announcePanelVisibility((0, locale_1._)('AI Chat'), visible);
            window.dispatchEvent(new Event('resize'));
            context.dispatch({
                type: 'WINDOW_LAYOUT_SET_ITEM_PROP',
                windowId: context.state.windowId,
                itemKey: 'chatPanel',
                propName: 'visible',
                propValue: visible,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleAiChat.js.map