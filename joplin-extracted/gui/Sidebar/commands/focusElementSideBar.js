"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const layoutItemProp_1 = __importDefault(require("../../ResizableLayout/utils/layoutItemProp"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'focusElementSideBar',
    label: () => (0, locale_1._)('Sidebar'),
    parentLabel: () => (0, locale_1._)('Focus'),
};
const runtime = (props) => {
    return {
        execute: async (context) => {
            const sidebarVisible = (0, layoutItemProp_1.default)(context.state.mainLayout, 'sideBar', 'visible');
            if (sidebarVisible) {
                props.focusSidebar();
                // The sidebar is only present in the main window:
                (0, bridge_1.default)().switchToMainWindow();
            }
        },
        enabledCondition: 'sideBarVisible',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusElementSideBar.js.map