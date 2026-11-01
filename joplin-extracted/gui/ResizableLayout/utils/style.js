"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveModeRootMessage = exports.StyledMoveOverlay = exports.StyledWrapperRoot = void 0;
const type_1 = require("@joplin/lib/themes/type");
const styled_components_1 = __importDefault(require("styled-components"));
// Need to use `attrs` otherwise styled-components creates many instances of the
// style when the component is resized.
// https://github.com/styled-components/styled-components/issues/1212
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- styled-components.attrs typing collides with the dynamic style attrs we set here
exports.StyledWrapperRoot = styled_components_1.default.div.attrs((props) => ({
    style: {
        width: props.size.width,
        height: props.size.height,
    },
})) `
	position: relative;
	display: flex;
`;
exports.StyledMoveOverlay = styled_components_1.default.div `
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
	background-color: ${props => props.theme.appearance === type_1.ThemeAppearance.Light ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'};
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;
exports.MoveModeRootMessage = styled_components_1.default.h1 `
	position: absolute;
	bottom: 10px;
	font-size: 1em;

	z-index:200;
	background-color: ${props => props.theme.backgroundColor};
	padding: 10px;
`;
//# sourceMappingURL=style.js.map