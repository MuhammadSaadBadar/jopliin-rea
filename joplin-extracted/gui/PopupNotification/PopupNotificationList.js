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
const PopupNotificationProvider_1 = require("./PopupNotificationProvider");
const NotificationItem_1 = __importDefault(require("./NotificationItem"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
// This component displays the popups managed by PopupNotificationContext.
// This allows popups to be shown in multiple windows at the same time.
const PopupNotificationList = () => {
    const popupSpecs = (0, react_1.useContext)(PopupNotificationProvider_1.VisibleNotificationsContext);
    const popups = [];
    for (const spec of popupSpecs) {
        if (spec.dismissed)
            continue;
        popups.push(React.createElement(NotificationItem_1.default, { key: spec.key, type: spec.type, dismissing: !!spec.dismissAt, popup: true }, spec.content()));
    }
    popups.reverse();
    if (popups.length) {
        return React.createElement("ul", { className: 'popup-notification-list -overlay', role: 'group', "aria-label": (0, locale_1._)('Notifications') }, popups);
    }
    else {
        return null;
    }
};
exports.default = PopupNotificationList;
//# sourceMappingURL=PopupNotificationList.js.map