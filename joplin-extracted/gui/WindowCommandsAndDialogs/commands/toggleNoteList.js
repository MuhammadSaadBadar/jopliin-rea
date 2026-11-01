"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const setLayoutItemProps_1 = __importDefault(require("../../ResizableLayout/utils/setLayoutItemProps"));
const layoutItemProp_1 = __importDefault(require("../../ResizableLayout/utils/layoutItemProp"));
exports.declaration = {
    name: 'toggleNoteList',
    label: () => (0, locale_1._)('Toggle note list'),
    iconName: 'fas fa-align-justify',
};
const runtime = (control) => {
    return {
        execute: async (context) => {
            const layout = context.state.mainLayout;
            const visible = !(0, layoutItemProp_1.default)(layout, 'noteList', 'visible');
            const newLayout = (0, setLayoutItemProps_1.default)(layout, 'noteList', {
                visible,
            });
            control.announcePanelVisibility((0, locale_1._)('Note list'), visible);
            // Toggling the sidebar will affect the size of most other on-screen components.
            // Dispatching a window resize event is a bit of a hack, but it ensures that any
            // component that watches for resizes will be accurately notified
            window.dispatchEvent(new Event('resize'));
            context.dispatch({
                type: 'MAIN_LAYOUT_SET',
                value: newLayout,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleNoteList.js.map