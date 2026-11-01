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
const versionInfo_1 = __importDefault(require("@joplin/lib/versionInfo"));
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const restart_1 = __importDefault(require("../services/restart"));
const BannerContent_1 = __importDefault(require("./NoteEditor/WarningBanner/BannerContent"));
const locale_1 = require("@joplin/lib/locale");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const packageInfo = require('../packageInfo.js');
const electron_1 = require("electron");
const logger = Logger_1.default.create('ErrorBoundary');
const SwitchToNewEditorBanner = (props) => {
    const handleSwitchToNewEditor = () => {
        Setting_1.default.setValue('editor.legacyMarkdown', false);
        const message = (0, locale_1._)('You are now using the latest version of the Markdown editor.');
        // eslint-disable-next-line no-restricted-globals
        alert(message);
    };
    return React.createElement(BannerContent_1.default, { acceptMessage: (0, locale_1._)('Switch to the new editor'), onAccept: handleSwitchToNewEditor, visible: props.isVisible }, (0, locale_1._)('The legacy Markdown editor appears to have crashed due to an incompatibility with a plugin. We recommend using the new editor.'));
};
class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { error: null, errorInfo: null, pluginInfos: [], plugins: {} };
    }
    componentDidCatch(error, errorInfo) {
        if (typeof error === 'string')
            error = { message: error };
        const pluginInfos = [];
        let plugins = {};
        try {
            const service = PluginService_1.default.instance();
            plugins = service.plugins;
            const pluginSettings = service.unserializePluginSettings(Setting_1.default.value('plugins.states'));
            for (const pluginId in pluginSettings) {
                const plugin = PluginService_1.default.instance().pluginById(pluginId);
                pluginInfos.push({
                    id: pluginId,
                    name: plugin.manifest.name,
                    enabled: pluginSettings[pluginId].enabled,
                    version: plugin.manifest.version,
                });
            }
        }
        catch (error) {
            console.error('Could not get plugin info:', error);
        }
        this.setState({ error, errorInfo, pluginInfos, plugins });
        logger.error('The application encountered an error:', error);
        logger.error('Component stack', errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.componentStack);
    }
    componentDidMount() {
        const onAppClose = () => {
            electron_1.ipcRenderer.send('asynchronous-message', 'appCloseReply', {
                canClose: true,
            });
        };
        electron_1.ipcRenderer.on('appClose', onAppClose);
    }
    renderMessage() {
        const message = this.props.message || 'Joplin encountered a fatal error and could not continue.';
        return React.createElement("p", null, message);
    }
    render() {
        if (this.state.error) {
            const safeMode_click = async () => {
                Setting_1.default.setValue('isSafeMode', true);
                await Setting_1.default.saveAll();
                await (0, restart_1.default)();
            };
            try {
                const output = [];
                output.push(React.createElement("section", { key: "message" },
                    React.createElement("h2", null, "Message"),
                    React.createElement("p", null, this.state.error.message)));
                output.push(React.createElement("section", { key: "versionInfo" },
                    React.createElement("h2", null, "Version info"),
                    React.createElement("pre", null, (0, versionInfo_1.default)(packageInfo, this.state.plugins).message)));
                if (this.state.pluginInfos.length) {
                    output.push(React.createElement("section", { key: "pluginSettings" },
                        React.createElement("h2", null, "Plugins"),
                        React.createElement("pre", null, JSON.stringify(this.state.pluginInfos, null, 4))));
                }
                if (this.state.error.stack) {
                    output.push(React.createElement("section", { key: "stacktrace" },
                        React.createElement("h2", null, "Stack trace"),
                        React.createElement("pre", null, this.state.error.stack)));
                }
                if (this.state.errorInfo) {
                    if (this.state.errorInfo.componentStack) {
                        output.push(React.createElement("section", { key: "componentStack" },
                            React.createElement("h2", null, "Component stack"),
                            React.createElement("pre", null, this.state.errorInfo.componentStack)));
                    }
                }
                const isLegacyEditorError = !!this.state.error.stack.includes('CodeMirror/v5');
                return (React.createElement("div", { style: { overflow: 'auto', fontFamily: 'sans-serif', padding: '5px 20px' } },
                    React.createElement(SwitchToNewEditorBanner, { isVisible: isLegacyEditorError }),
                    React.createElement("h1", null, "Error"),
                    this.renderMessage(),
                    React.createElement("p", null, "To report the error, please copy the *entire content* of this page and post it on Joplin forum or GitHub."),
                    React.createElement("p", null,
                        "If the error persists you may try to ",
                        React.createElement("a", { href: "#", onClick: safeMode_click }, "restart in safe mode"),
                        ", which will temporarily disable all plugins."),
                    output));
            }
            catch (error) {
                return (React.createElement("div", null, JSON.stringify(this.state)));
            }
        }
        return this.props.children;
    }
}
exports.default = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map