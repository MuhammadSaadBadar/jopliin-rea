"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DialogTitle;
const styled_components_1 = __importDefault(require("styled-components"));
const Root = styled_components_1.default.h1 `
	display: flex;
	justify-content: ${props => props.justifyContent ? props.justifyContent : 'center'};
	font-family: ${props => props.theme.fontFamily};
	font-size: ${props => props.theme.fontSize * 1.5}px;
	line-height: 1.6em;
	color: ${props => props.theme.color};
	font-weight: bold;
	margin-bottom: 1em;
`;
const Title = styled_components_1.default.span `
	text-align: ${props => props.justifyContent === 'center' ? 'center' : 'start'};
`;
function DialogTitle(props) {
    return (React.createElement(Root, { justifyContent: props.justifyContent },
        React.createElement(Title, { justifyContent: props.justifyContent }, props.title)));
}
//# sourceMappingURL=DialogTitle.js.map