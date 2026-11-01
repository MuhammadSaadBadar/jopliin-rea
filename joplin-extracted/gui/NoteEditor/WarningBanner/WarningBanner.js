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
const react_redux_1 = require("react-redux");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const BannerContent_1 = __importDefault(require("./BannerContent"));
const locale_1 = require("@joplin/lib/locale");
const onRichTextReadMoreLinkClick_1 = __importDefault(require("@joplin/lib/components/shared/NoteEditor/WarningBanner/onRichTextReadMoreLinkClick"));
const onRichTextDismissLinkClick_1 = __importDefault(require("@joplin/lib/components/shared/NoteEditor/WarningBanner/onRichTextDismissLinkClick"));
const useEditorTypeMigrationBanner_1 = __importDefault(require("@joplin/lib/components/shared/NoteEditor/WarningBanner/useEditorTypeMigrationBanner"));
const react_1 = require("react");
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const onSwitchToLegacyEditor = () => {
    Setting_1.default.setValue('editor.legacyMarkdown', true);
};
const onDismissLegacyEditorPrompt = () => {
    Setting_1.default.setValue('editor.pluginCompatibilityBannerDismissedFor', [...PluginService_1.default.instance().pluginIds]);
};
const incompatiblePluginIds = [
    // cSpell:disable
    'com.septemberhx.Joplin.Enhancement',
    'ylc395.noteLinkSystem',
    'joplin.plugin.cmoptions',
    'com.asdibiase.joplin-languagetool',
    // cSpell:enable
];
const WarningBanner = props => {
    const editorMigrationMessage = (0, useEditorTypeMigrationBanner_1.default)({
        markdownEditorEnabled: props.bodyEditor === 'CodeMirror6',
        editorMigrationVersion: props.editorMigrationVersion,
        inEditorRenderingEnabled: props.inEditorRenderingEnabled,
    });
    const editorMigrationBanner = (React.createElement(BannerContent_1.default, { visible: editorMigrationMessage.enabled, acceptMessage: editorMigrationMessage.keepEnabled.label, onAccept: editorMigrationMessage.keepEnabled.onPress, onDismiss: editorMigrationMessage.disable.onPress, dismissMessage: editorMigrationMessage.disable.label }, editorMigrationMessage.label));
    const wysiwygBanner = (React.createElement(BannerContent_1.default, { acceptMessage: (0, locale_1._)('Read more about it'), onAccept: onRichTextReadMoreLinkClick_1.default, onDismiss: onRichTextDismissLinkClick_1.default, visible: props.bodyEditor === 'TinyMCE' && !props.richTextBannerDismissed }, (0, locale_1._)('This Rich Text editor has a number of limitations and it is recommended to be aware of them before using it.')));
    const incompatiblePluginNames = (0, react_1.useMemo)(() => {
        if (props.bodyEditor !== 'CodeMirror6') {
            return [];
        }
        const runningPluginIds = Object.keys(props.plugins);
        return runningPluginIds.map((id) => {
            var _a;
            if ((_a = props.pluginCompatibilityBannerDismissedFor) === null || _a === void 0 ? void 0 : _a.includes(id)) {
                return [];
            }
            if (incompatiblePluginIds.includes(id)) {
                return PluginService_1.default.instance().pluginById(id).manifest.name;
            }
            else {
                return [];
            }
        }).flat();
    }, [props.bodyEditor, props.plugins, props.pluginCompatibilityBannerDismissedFor]);
    const markdownPluginBanner = (React.createElement(BannerContent_1.default, { acceptMessage: (0, locale_1._)('Switch to the legacy editor'), onAccept: onSwitchToLegacyEditor, onDismiss: onDismissLegacyEditorPrompt, visible: incompatiblePluginNames.length > 0 },
        (0, locale_1._)('The following plugins may not support the current markdown editor:'),
        React.createElement("ul", null, incompatiblePluginNames.map((name, index) => React.createElement("li", { key: index }, name)))));
    return React.createElement(React.Fragment, null,
        wysiwygBanner,
        markdownPluginBanner,
        editorMigrationBanner);
};
exports.default = (0, react_redux_1.connect)((state) => {
    return {
        richTextBannerDismissed: state.settings.richTextBannerDismissed,
        pluginCompatibilityBannerDismissedFor: state.settings['editor.pluginCompatibilityBannerDismissedFor'],
        plugins: state.pluginService.plugins,
        editorMigrationVersion: state.settings['editor.migration'],
        inEditorRenderingEnabled: state.settings['editor.inlineRendering'],
    };
})(WarningBanner);
//# sourceMappingURL=WarningBanner.js.map