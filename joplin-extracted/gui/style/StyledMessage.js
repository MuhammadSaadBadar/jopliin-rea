"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const StyledMessage = styled_components_1.default.div `
	border-radius: 3px;
	background-color: ${props => props.type === 'error' ? props.theme.warningBackgroundColor : 'transparent'};
	font-size: ${props => props.theme.fontSize}px;
	color: ${props => props.theme.color};
	font-family: ${props => props.theme.fontFamily};
	padding: ${props => props.type === 'error' ? props.theme.mainPadding : '0'}px;
	word-break: break-all;
`;
exports.default = StyledMessage;
//# sourceMappingURL=StyledMessage.js.map