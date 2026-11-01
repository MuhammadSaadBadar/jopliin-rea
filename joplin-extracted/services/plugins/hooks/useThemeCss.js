"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useThemeCss;
const react_1 = require("react");
const theme_1 = require("@joplin/lib/theme");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const string_utils_1 = require("@joplin/lib/string-utils");
function themeToCssVariables(theme) {
    const lines = [];
    lines.push(':root {');
    for (const name in theme) {
        const value = theme[name];
        if (typeof value === 'object')
            continue;
        if (['appearance', 'codeThemeCss', 'codeMirrorTheme'].indexOf(name) >= 0)
            continue;
        const newName = `--joplin-${(0, string_utils_1.camelCaseToDash)(name)}`;
        const formattedValue = typeof value === 'number' && newName.indexOf('opacity') < 0 ? (0, string_utils_1.formatCssSize)(value) : value;
        lines.push(`\t${newName}: ${formattedValue};`);
    }
    lines.push('}');
    return lines.join('\n');
}
function useThemeCss(dep) {
    const { pluginId, themeId } = dep;
    const [cssFilePath, setCssFilePath] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        async function createThemeStyleSheet() {
            const theme = (0, theme_1.themeStyle)(themeId);
            const css = themeToCssVariables(theme);
            const filePath = `${Setting_1.default.value('tempDir')}/plugin_${pluginId}_theme_${themeId}.css`;
            if (!(await shim_1.default.fsDriver().exists(filePath))) {
                await shim_1.default.fsDriver().writeFile(filePath, css, 'utf8');
                if (cancelled)
                    return;
            }
            setCssFilePath(filePath);
        }
        void createThemeStyleSheet();
        return () => {
            cancelled = true;
        };
    }, [pluginId, themeId]);
    return cssFilePath;
}
//# sourceMappingURL=useThemeCss.js.map