"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styled = require('styled-components').default;
const Color = require('color');
const StyledInput = styled.input `
	border: 1px solid ${(props) => Color(props.theme.color3).alpha(0.6)};
	border-radius: 3px;
	font-size: ${(props) => props.theme.fontSize}px;
	color: ${(props) => props.theme.color};
	padding: 0 8px;
	height: ${(props) => `${props.theme.toolbarHeight}px`};
	max-height: ${(props) => `${props.theme.toolbarHeight}px`};
	box-sizing: border-box;
	background-color: ${(props) => Color(props.theme.backgroundColor4).alpha(0.5)};

	&::placeholder {
		color: ${(props) => props.theme.colorFaded};
	}

	&:focus {
		background-color: ${(props) => props.theme.backgroundColor4};
		border: 1px solid ${(props) => props.theme.color3};
	}
`;
exports.default = StyledInput;
//# sourceMappingURL=StyledInput.js.map