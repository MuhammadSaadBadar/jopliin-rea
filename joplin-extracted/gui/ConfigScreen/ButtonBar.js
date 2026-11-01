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
exports.default = ButtonBar;
const React = __importStar(require("react"));
const Button_1 = __importStar(require("../Button/Button"));
const locale_1 = require("@joplin/lib/locale");
const styled_components_1 = __importDefault(require("styled-components"));
const StyledRoot = styled_components_1.default.nav `
	display: flex;
	align-items: center;
	padding: 10px;
	background-color: ${(props) => props.theme.backgroundColor3};
	padding-left: ${(props) => props.theme.configScreenPadding}px;
	border-top-width: 1px;
	border-top-style: solid;
	border-top-color: ${(props) => props.theme.dividerColor};
`;
function ButtonBar(props) {
    function renderOkButton() {
        if (!props.onSaveClick)
            return null;
        return React.createElement(Button_1.default, { style: { marginRight: 10 }, level: Button_1.ButtonLevel.Primary, disabled: !props.hasChanges, onClick: props.onSaveClick, title: (0, locale_1._)('OK') });
    }
    function renderApplyButton() {
        if (!props.onApplyClick)
            return null;
        return React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Primary, disabled: !props.hasChanges, onClick: props.onApplyClick, title: (0, locale_1._)('Apply') });
    }
    return (React.createElement(StyledRoot, { className: 'button-bar' },
        React.createElement(Button_1.default, { onClick: props.onCancelClick, level: Button_1.ButtonLevel.Secondary, iconName: "fa fa-chevron-left", title: props.backButtonTitle ? props.backButtonTitle : (0, locale_1._)('Back') }),
        (props.onApplyClick || props.onSaveClick) && (React.createElement("div", { style: { display: 'flex', flexDirection: 'row', marginLeft: 30 } },
            renderOkButton(),
            renderApplyButton()))));
}
//# sourceMappingURL=ButtonBar.js.map