"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useMarkupToHtml;
const react_1 = require("react");
const markupLanguageUtils_1 = __importDefault(require("@joplin/lib/utils/markupLanguageUtils"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const theme_1 = require("@joplin/lib/theme");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const resourceUtils_1 = require("@joplin/lib/models/utils/resourceUtils");
const getPluginSettingValue_1 = __importDefault(require("@joplin/lib/services/plugins/utils/getPluginSettingValue"));
function useMarkupToHtml(deps) {
    const { themeId, customCss, plugins, whiteBackgroundNoteRendering, scrollbarSize, baseFontFamily } = deps;
    const resourceBaseUrl = (0, react_1.useMemo)(() => {
        return `joplin-content://note-viewer/${Setting_1.default.value('resourceDir')}/`;
    }, []);
    const markupToHtml = (0, react_1.useMemo)(() => {
        return markupLanguageUtils_1.default.newMarkupToHtml(plugins, {
            resourceBaseUrl,
            customCss: customCss || '',
        });
    }, [plugins, customCss, resourceBaseUrl]);
    return (0, react_1.useCallback)(async (markupLanguage, md, options = null) => {
        options = Object.assign({ replaceResourceInternalToExternalLinks: false, resourceInfos: {}, platformName: shim_1.default.platformName() }, options);
        md = md || '';
        const theme = (0, theme_1.themeStyle)(themeId);
        let resources = {};
        if (options.replaceResourceInternalToExternalLinks) {
            md = await Note_1.default.replaceResourceInternalToExternalLinks(md, { useAbsolutePaths: true });
        }
        else {
            resources = options.resourceInfos;
        }
        delete options.replaceResourceInternalToExternalLinks;
        const result = await markupToHtml.render(markupLanguage, md, theme, Object.assign({ codeTheme: theme.codeThemeCss, resources: resources, postMessageSyntax: 'ipcProxySendToHost', splitted: true, externalAssetsOnly: true, codeHighlightCacheKey: 'useMarkupToHtml', settingValue: getPluginSettingValue_1.default, whiteBackgroundNoteRendering, scrollbarSize: scrollbarSize, baseFontFamily, itemIdToUrl: (id, urlParameters = '') => {
                if (!(id in resources) || !resources[id]) {
                    return null;
                }
                return (0, resourceUtils_1.resourceFullPath)(resources[id].item, resourceBaseUrl) + urlParameters;
            }, globalSettings: {
                'markdown.plugin.abc.options': Setting_1.default.value('markdown.plugin.abc.options'),
            } }, options));
        return result;
    }, [themeId, markupToHtml, baseFontFamily, whiteBackgroundNoteRendering, scrollbarSize, resourceBaseUrl]);
}
//# sourceMappingURL=useMarkupToHtml.js.map