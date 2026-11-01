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
const types_1 = require("./types");
const locale_1 = require("@joplin/lib/locale");
const NotificationItem = props => {
    const [iconClassName, iconLabel] = (() => {
        if (props.type === types_1.NotificationType.Success) {
            return ['fas fa-check', (0, locale_1._)('Success')];
        }
        if (props.type === types_1.NotificationType.Error) {
            return ['fas fa-times', (0, locale_1._)('Error')];
        }
        if (props.type === types_1.NotificationType.Info) {
            return ['fas fa-info', (0, locale_1._)('Info')];
        }
        return ['', ''];
    })();
    const containerModifier = (() => {
        if (props.type === types_1.NotificationType.Success)
            return '-success';
        if (props.type === types_1.NotificationType.Error)
            return '-error';
        if (props.type === types_1.NotificationType.Info)
            return '-info';
        return '';
    })();
    const icon = React.createElement("i", { role: 'img', "aria-label": iconLabel, className: `icon ${iconClassName}` });
    return React.createElement("li", { role: props.popup ? 'alert' : undefined, className: `popup-notification-item ${containerModifier} ${props.dismissing ? '-dismissing' : ''}` },
        iconClassName ? icon : null,
        React.createElement("div", { className: 'ripple' }),
        React.createElement("div", { className: 'content' }, props.children));
};
exports.default = NotificationItem;
//# sourceMappingURL=NotificationItem.js.map