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
exports.default = UserWebviewDialog;
const React = __importStar(require("react"));
const react_1 = require("react");
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const UserWebview_1 = __importDefault(require("./UserWebview"));
const UserWebviewDialogButtonBar_1 = __importDefault(require("./UserWebviewDialogButtonBar"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
function defaultButtons() {
    return [
        {
            id: 'ok',
        },
        {
            id: 'cancel',
        },
    ];
}
function findSubmitButton(buttons) {
    return buttons.find((b) => {
        return ['ok', 'yes', 'confirm', 'submit'].includes(b.id);
    });
}
function findDismissButton(buttons) {
    return buttons.find((b) => {
        return ['cancel', 'no', 'reject'].includes(b.id);
    });
}
function UserWebviewDialog(props) {
    const webviewRef = (0, react_1.useRef)(null);
    function viewController() {
        return PluginService_1.default.instance().pluginById(props.pluginId).viewController(props.viewId);
    }
    const buttons = (props.buttons ? props.buttons : defaultButtons()).map((b) => {
        return Object.assign(Object.assign({}, b), { onClick: async () => {
                const response = { id: b.id };
                const formData = await webviewRef.current.formData();
                if (formData && Object.keys(formData).length)
                    response.formData = formData;
                viewController().closeWithResponse(response);
            } });
    });
    const onSubmit = (0, react_1.useCallback)(() => {
        const submitButton = findSubmitButton(buttons);
        if (submitButton) {
            submitButton.onClick();
        }
    }, [buttons]);
    const onDismiss = (0, react_1.useCallback)(() => {
        const dismissButton = findDismissButton(buttons);
        if (dismissButton) {
            dismissButton.onClick();
        }
    }, [buttons]);
    const onReady = (0, react_1.useCallback)(() => {
        // We focus the dialog once it's ready to make sure that the ESC/Enter
        // keyboard shortcuts are working.
        // https://github.com/laurent22/joplin/issues/4474
        if (webviewRef.current)
            (0, focusHandler_1.focus)('UserWebviewDialog', webviewRef.current);
    }, []);
    // When the iframe is isolated (security setting enabled), keyboard events
    // like Escape don't reach the iframe content. We let the native <dialog>
    // handle Escape by passing onCancel, but only when there's a dismiss button.
    // https://github.com/laurent22/joplin/issues/13718
    const onCancel = (0, react_1.useMemo)(() => {
        return findDismissButton(buttons) ? onDismiss : undefined;
    }, [buttons, onDismiss]);
    return (React.createElement(Dialog_1.default, { className: `user-webview-dialog ${props.fitToContent ? '-fit' : ''}`, onCancel: onCancel },
        React.createElement("div", { className: 'user-dialog-wrapper' },
            React.createElement(UserWebview_1.default, { ref: webviewRef, html: props.html, scripts: props.scripts, pluginId: props.pluginId, viewId: props.viewId, themeId: props.themeId, borderBottom: false, fitToContent: props.fitToContent, onSubmit: onSubmit, onDismiss: onDismiss, onReady: onReady })),
        React.createElement(UserWebviewDialogButtonBar_1.default, { buttons: buttons })));
}
//# sourceMappingURL=UserWebviewDialog.js.map