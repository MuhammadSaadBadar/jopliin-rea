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
exports.default = default_1;
const PostMessageService_1 = __importStar(require("@joplin/lib/services/PostMessageService"));
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../bridge"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
function default_1(webviewRef, isReady, pluginId, viewId, windowId, postMessage) {
    (0, react_1.useEffect)(() => {
        PostMessageService_1.default.instance().registerResponder(PostMessageService_1.ResponderComponentType.UserWebview, viewId, windowId, (message) => {
            postMessage('postMessageService.response', { message });
        });
        return () => {
            PostMessageService_1.default.instance().unregisterResponder(PostMessageService_1.ResponderComponentType.UserWebview, viewId, windowId);
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [viewId]);
    (0, react_1.useEffect)(() => {
        function onMessage_(event) {
            if (!event.data || event.source !== webviewRef.current.contentWindow) {
                return;
            }
            if (event.data.target === 'postMessageService.registerViewMessageHandler') {
                PostMessageService_1.default.instance().registerViewMessageHandler(PostMessageService_1.ResponderComponentType.UserWebview, viewId, (message) => {
                    postMessage('postMessageService.plugin_message', { message });
                });
            }
            else if (event.data.target === 'postMessageService.message') {
                void PostMessageService_1.default.instance().postMessage(Object.assign({ pluginId,
                    viewId,
                    windowId }, event.data.message));
            }
            else if (event.data.target === 'webviewApi.menuPopupFromTemplate') {
                const template = event.data.args;
                const finalTemplate = template.map((menuItem) => {
                    var _a;
                    const output = {
                        label: (_a = menuItem.label) !== null && _a !== void 0 ? _a : '',
                        click: () => {
                            var _a;
                            const args = (_a = menuItem.commandArgs) !== null && _a !== void 0 ? _a : [];
                            void CommandService_1.default.instance().execute(menuItem.command, ...args);
                        },
                    };
                    return output;
                });
                (0, bridge_1.default)().menuPopupFromTemplate(finalTemplate);
            }
        }
        const containerWindow = webviewRef.current.getRootNode().defaultView;
        containerWindow.addEventListener('message', onMessage_);
        return () => {
            containerWindow.removeEventListener('message', onMessage_);
        };
    }, [webviewRef, isReady, pluginId, windowId, viewId, postMessage]);
}
//# sourceMappingURL=useWebviewToPluginMessages.js.map