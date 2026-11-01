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
    name: 'toggleSideBar',
    label: () => (0, locale_1._)('Toggle sidebar'),
    iconName: 'fas fa-bars',
};
const runtime = (control) => {
    return {
        execute: async (context) => {
            const layout = context.state.mainLayout;
            const visible = !(0, layoutItemProp_1.default)(layout, 'sideBar', 'visible');
            const newLayout = (0, setLayoutItemProps_1.default)(layout, 'sideBar', {
                visible,
            });
            control.announcePanelVisibility((0, locale_1._)('Sidebar'), visible);
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
//# sourceMappingURL=toggleSideBar.js.map