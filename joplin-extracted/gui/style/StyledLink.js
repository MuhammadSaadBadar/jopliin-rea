"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const StyledLink = styled_components_1.default.a `
	font-size: ${props => props.theme.fontSize}px;
	color: ${props => props.theme.urlColor};
	font-family: ${props => props.theme.fontFamily};
`;
exports.default = StyledLink;
//# sourceMappingURL=StyledLink.js.map