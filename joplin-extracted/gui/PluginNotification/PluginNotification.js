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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const types_1 = require("@joplin/lib/services/plugins/api/types");
const PopupNotificationProvider_1 = require("../PopupNotification/PopupNotificationProvider");
const emptyToast = () => {
    return {
        duration: 0,
        message: '',
        type: types_1.ToastType.Info,
        timestamp: 0,
    };
};
exports.default = (props) => {
    const popupManager = (0, react_1.useContext)(PopupNotificationProvider_1.PopupNotificationContext);
    const toast = (0, react_1.useMemo)(() => {
        const toast = props.toast ? props.toast : emptyToast();
        return toast;
    }, [props.toast]);
    (0, react_1.useEffect)(() => {
        if (!toast.message)
            return;
        popupManager.createPopup(() => toast.message, {
            type: toast.type,
        }).scheduleDismiss(toast.duration);
        // toast.timestamp needs to be included in the dependency list to allow
        // showing multiple toasts with the same message, one after another.
        // See https://github.com/laurent22/joplin/issues/11783
    }, [toast.message, toast.duration, toast.type, toast.timestamp, popupManager]);
    return React.createElement("div", { style: { display: 'none' } });
};
//# sourceMappingURL=PluginNotification.js.map