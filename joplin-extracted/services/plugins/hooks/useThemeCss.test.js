"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const useThemeCss_1 = __importDefault(require("./useThemeCss"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
describe('useThemeCss', () => {
    it('should return a different path when the theme changes', async () => {
        const hookResult = (0, react_1.renderHook)(useThemeCss_1.default, {
            initialProps: { pluginId: 'testid', themeId: Setting_1.default.THEME_DARK },
        });
        await (0, react_1.waitFor)(() => {
            expect(hookResult.result.current).toContain(`plugin_testid_theme_${Setting_1.default.THEME_DARK}.css`);
        });
        hookResult.rerender({ pluginId: 'testid', themeId: Setting_1.default.THEME_LIGHT });
        await (0, react_1.waitFor)(() => {
            expect(hookResult.result.current).toContain(`plugin_testid_theme_${Setting_1.default.THEME_LIGHT}.css`);
        });
    });
});
//# sourceMappingURL=useThemeCss.test.js.map