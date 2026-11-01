"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const StyledFormLabel = styled_components_1.default.div `
	font-size: ${props => props.theme.fontSize * 1.083333}px;
	color: ${props => props.theme.color};
	font-family: ${props => props.theme.fontFamily};
	font-weight: 500;
	margin-bottom: ${props => props.theme.mainPadding / 2}px;
`;
exports.default = StyledFormLabel;
//# sourceMappingURL=StyledFormLabel.js.map