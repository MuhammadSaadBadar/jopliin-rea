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
exports.default = UserWebviewDialogButtonBar;
const React = __importStar(require("react"));
const Button_1 = __importDefault(require("../../gui/Button/Button"));
const locale_1 = require("@joplin/lib/locale");
const styled_components_1 = __importDefault(require("styled-components"));
const { space } = require('styled-system');
const StyledButton = (0, styled_components_1.default)(Button_1.default) `${space}`;
function buttonTitle(b) {
    if (b.title)
        return b.title;
    const defaultTitles = {
        'ok': (0, locale_1._)('OK'),
        'cancel': (0, locale_1._)('Cancel'),
        'yes': (0, locale_1._)('Yes'),
        'no': (0, locale_1._)('No'),
        'close': (0, locale_1._)('Close'),
    };
    return defaultTitles[b.id] ? defaultTitles[b.id] : b.id;
}
function UserWebviewDialogButtonBar(props) {
    function renderButtons() {
        const output = [];
        for (let i = 0; i < props.buttons.length; i++) {
            const b = props.buttons[i];
            const marginRight = i !== props.buttons.length - 1 ? '6px' : '0px';
            output.push(React.createElement(StyledButton, { key: b.id, onClick: b.onClick, title: buttonTitle(b), mr: marginRight }));
        }
        return output;
    }
    return (React.createElement("div", { className: 'user-dialog-button-bar' }, renderButtons()));
}
//# sourceMappingURL=UserWebviewDialogButtonBar.js.map