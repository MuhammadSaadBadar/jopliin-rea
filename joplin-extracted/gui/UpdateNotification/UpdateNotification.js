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
exports.UpdateNotificationEvents = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const electron_1 = require("electron");
const AutoUpdaterService_1 = require("../../services/autoUpdater/AutoUpdaterService");
const locale_1 = require("@joplin/lib/locale");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const PopupNotificationProvider_1 = require("../PopupNotification/PopupNotificationProvider");
const Button_1 = __importStar(require("../Button/Button"));
const types_1 = require("../PopupNotification/types");
var UpdateNotificationEvents;
(function (UpdateNotificationEvents) {
    UpdateNotificationEvents["ApplyUpdate"] = "apply-update";
    UpdateNotificationEvents["UpdateNotAvailable"] = "update-not-available";
    UpdateNotificationEvents["Dismiss"] = "dismiss-update-notification";
})(UpdateNotificationEvents || (exports.UpdateNotificationEvents = UpdateNotificationEvents = {}));
const changelogLink = 'https://github.com/laurent22/joplin/releases';
const openChangelogLink = () => {
    shim_1.default.openUrl(changelogLink);
};
const handleApplyUpdate = () => {
    electron_1.ipcRenderer.send('apply-update-now');
};
const UpdateNotification = () => {
    const popupManager = (0, react_1.useContext)(PopupNotificationProvider_1.PopupNotificationContext);
    const handleUpdateDownloaded = (0, react_1.useCallback)((_event, info) => {
        const notification = popupManager.createPopup(() => (React.createElement("div", { className: 'update-notification' },
            (0, locale_1._)('A new update (%s) is available', info.version),
            React.createElement("button", { className: 'link-button', onClick: openChangelogLink }, (0, locale_1._)('See changelog')),
            React.createElement("div", { className: 'buttons' },
                React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Tertiary, onClick: () => {
                        notification.remove();
                        handleApplyUpdate();
                    }, title: (0, locale_1._)('Restart now') }),
                React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Tertiary, onClick: () => notification.remove(), title: (0, locale_1._)('Update later') })))));
    }, [popupManager]);
    const handleUpdateNotAvailable = (0, react_1.useCallback)(() => {
        const notification = popupManager.createPopup(() => (React.createElement("div", { className: 'update-notification' }, (0, locale_1._)('No updates available'))), { type: types_1.NotificationType.Info });
        notification.scheduleDismiss();
    }, [popupManager]);
    (0, react_1.useEffect)(() => {
        electron_1.ipcRenderer.on(AutoUpdaterService_1.AutoUpdaterEvents.UpdateDownloaded, handleUpdateDownloaded);
        electron_1.ipcRenderer.on(AutoUpdaterService_1.AutoUpdaterEvents.UpdateNotAvailable, handleUpdateNotAvailable);
        return () => {
            electron_1.ipcRenderer.removeListener(AutoUpdaterService_1.AutoUpdaterEvents.UpdateDownloaded, handleUpdateDownloaded);
            electron_1.ipcRenderer.removeListener(AutoUpdaterService_1.AutoUpdaterEvents.UpdateNotAvailable, handleUpdateNotAvailable);
        };
    }, [handleUpdateDownloaded, handleUpdateNotAvailable]);
    return (React.createElement("div", { style: { display: 'none' } }));
};
exports.default = UpdateNotification;
//# sourceMappingURL=UpdateNotification.js.map