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
const react_1 = require("react");
const useViewIsReady_1 = __importDefault(require("./hooks/useViewIsReady"));
const useThemeCss_1 = __importDefault(require("./hooks/useThemeCss"));
const useContentSize_1 = __importDefault(require("./hooks/useContentSize"));
const useHtmlLoader_1 = __importDefault(require("./hooks/useHtmlLoader"));
const useWebviewToPluginMessages_1 = __importDefault(require("./hooks/useWebviewToPluginMessages"));
const useScriptLoader_1 = __importDefault(require("./hooks/useScriptLoader"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const NewWindowOrIFrame_1 = require("../../gui/NewWindowOrIFrame");
const useSubmitHandler_1 = __importDefault(require("./hooks/useSubmitHandler"));
const useFormData_1 = __importDefault(require("./hooks/useFormData"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const getAssetPath_1 = __importDefault(require("../../utils/getAssetPath"));
const path_1 = require("@joplin/utils/path");
const logger = Logger_1.default.create('UserWebview');
function UserWebview(props, ref) {
    const minWidth = props.minWidth ? props.minWidth : 200;
    const minHeight = props.minHeight ? props.minHeight : 20;
    const viewRef = (0, react_1.useRef)(null);
    const isReady = (0, useViewIsReady_1.default)(viewRef);
    const cssFilePath = (0, useThemeCss_1.default)({ pluginId: props.pluginId, themeId: props.themeId });
    (0, react_1.useEffect)(() => {
        if (isReady && props.onReady)
            props.onReady();
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [isReady]);
    function frameWindow() {
        if (!viewRef.current)
            return null;
        return viewRef.current.contentWindow;
    }
    const postMessage = (0, react_1.useCallback)((name, args = null) => {
        const win = frameWindow();
        if (!win)
            return;
        logger.debug('Got message', name, args);
        win.postMessage({ target: 'webview', name, args }, '*');
    }, []);
    const { getFormData } = (0, useFormData_1.default)(viewRef, postMessage);
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            formData: function () {
                if (viewRef.current) {
                    return getFormData();
                }
                else {
                    return null;
                }
            },
            focus: function () {
                if (viewRef.current)
                    (0, focusHandler_1.focus)('UserWebView::focus', viewRef.current);
            },
        };
    }, [getFormData]);
    const htmlHash = (0, useHtmlLoader_1.default)(viewRef, isReady, postMessage, props.html);
    const contentSize = (0, useContentSize_1.default)(viewRef, htmlHash, minWidth, minHeight);
    (0, useSubmitHandler_1.default)(viewRef, props.onSubmit, props.onDismiss);
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    (0, useWebviewToPluginMessages_1.default)(viewRef, isReady, props.pluginId, props.viewId, windowId, postMessage);
    (0, useScriptLoader_1.default)(postMessage, isReady, props.scripts, cssFilePath);
    const style = (0, react_1.useMemo)(() => ({
        '--content-width': `${contentSize.width}px`,
        '--content-height': `${contentSize.height}px`,
    }), [contentSize.width, contentSize.height]);
    const src = (0, react_1.useMemo)(() => {
        let isolate = Setting_1.default.value('featureFlag.plugins.isolatePluginWebViews');
        isolate || (isolate = needsIsolation(props.pluginId));
        const path = (0, path_1.toForwardSlashes)((0, getAssetPath_1.default)('services/plugins/UserWebviewIndex.html'));
        if (isolate) {
            return `joplin-content://plugin-webview/${path}`;
        }
        else {
            return `file://${path}`;
        }
    }, [props.pluginId]);
    return React.createElement("iframe", { id: props.viewId, style: style, className: `plugin-user-webview ${props.fitToContent ? '-fit-to-content' : ''} ${props.borderBottom ? '-border-bottom' : ''}`, ref: viewRef, src: src });
}
exports.default = (0, react_1.forwardRef)(UserWebview);
const needsIsolation = (pluginId) => {
    // Some plugins are broken unless isolated from the main application.
    // Always enable isolation for these plugins, even if disabled in settings:
    return ['joplin.plugin.note.tabs', 'joplin.plugin.benji.favorites', 'outline'].includes(pluginId);
};
//# sourceMappingURL=UserWebview.js.map