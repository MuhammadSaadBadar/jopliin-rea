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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonSizePx = exports.ButtonSize = exports.ButtonLevel = void 0;
const React = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const { space } = require('styled-system');
var ButtonLevel;
(function (ButtonLevel) {
    ButtonLevel["Primary"] = "primary";
    ButtonLevel["Secondary"] = "secondary";
    ButtonLevel["Tertiary"] = "tertiary";
    ButtonLevel["SidebarSecondary"] = "sidebarSecondary";
    ButtonLevel["Recommended"] = "recommended";
})(ButtonLevel || (exports.ButtonLevel = ButtonLevel = {}));
var ButtonSize;
(function (ButtonSize) {
    ButtonSize[ButtonSize["Small"] = 1] = "Small";
    ButtonSize[ButtonSize["Normal"] = 2] = "Normal";
})(ButtonSize || (exports.ButtonSize = ButtonSize = {}));
const StyledTitle = styled_components_1.default.span `

`;
const buttonSizePx = (props) => {
    const buttonSize = typeof props === 'number' ? props : props.size;
    if (!buttonSize || buttonSize === ButtonSize.Normal)
        return 32;
    if (buttonSize === ButtonSize.Small)
        return 26;
    throw new Error(`Unknown size: ${buttonSize}`);
};
exports.buttonSizePx = buttonSizePx;
const isSquare = (props) => {
    return props.iconOnly || props.isSquare;
};
const StyledButtonBase = styled_components_1.default.button `
	display: flex;
	align-items: center;
	flex-direction: row;
	height: ${(props) => (0, exports.buttonSizePx)(props)}px;
	min-height: ${(props) => (0, exports.buttonSizePx)(props)}px;
	max-height: ${(props) => (0, exports.buttonSizePx)(props)}px;
	width: ${(props) => isSquare(props) ? `${(0, exports.buttonSizePx)(props)}px` : 'auto'};
	${(props) => isSquare(props) ? `min-width: ${(0, exports.buttonSizePx)(props)}px;` : ''}
	${(props) => !isSquare(props) ? 'min-width: 100px;' : ''}
	${(props) => isSquare(props) ? `max-width: ${(0, exports.buttonSizePx)(props)}px;` : ''}
	box-sizing: border-box;
	border-radius: 3px;
	border-style: solid;
	border-width: 1px;
	padding: 0 ${(props) => isSquare(props) ? 4 : 14}px;
	justify-content: center;
	opacity: ${(props) => props.disabled ? 0.5 : 1};
	user-select: none;
	${(props) => props.fontSize ? `font-size: ${props.fontSize}px;` : ''}
`;
const StyledIcon = styled_components_1.default.span `
	${space}
	font-size: ${(props) => props.theme.toolbarIconSize}px;
	${(props) => props.animation ? `animation: ${props.animation}` : ''};
`;
const StyledButtonPrimary = (0, styled_components_1.default)(StyledButtonBase) `
	border: none;
	background-color: ${(props) => props.theme.backgroundColor5};

	&:not(:disabled) {
		&:hover {
			background-color: ${(props) => props.theme.backgroundColorHover5};
		}

		&:active {
			background-color: ${(props) => props.theme.backgroundColorActive5};
		}
	}

	${StyledIcon} {
		color: ${(props) => props.theme.color5};
	}

	${StyledTitle} {
		color: ${(props) => props.theme.color5};
	}
`;
const StyledButtonSecondary = (0, styled_components_1.default)(StyledButtonBase) `
	border: 1px solid ${(props) => props.theme.borderColor4};
	background-color: ${(props) => props.theme.backgroundColor4};

	&:not(:disabled) {
		&:hover {
			background-color: ${(props) => props.theme.backgroundColorHover4};
		}

		&:active {
			background-color: ${(props) => props.theme.backgroundColorActive4};
		}
	}

	${StyledIcon} {
		color: ${(props) => props.theme.color4};
	}

	${StyledTitle} {
		color: ${(props) => props.theme.color4};
	}
`;
const StyledButtonTertiary = (0, styled_components_1.default)(StyledButtonBase) `
	border: 1px solid ${(props) => props.theme.color3};
	background-color: ${(props) => props.theme.backgroundColor3};

	&:hover {
		background-color: ${(props) => props.theme.backgroundColorHoverDim3};
	}

	&:active {
		background-color: ${(props) => props.theme.backgroundColorActive3};
	}

	${StyledIcon} {
		color: ${(props) => props.theme.color};
	}

	${StyledTitle} {
		color: ${(props) => props.theme.color};
		opacity: 0.9;
	}
`;
const StyledButtonRecommended = (0, styled_components_1.default)(StyledButtonBase) `
	border: 1px solid ${(props) => props.theme.borderColor4};
	background-color: ${(props) => props.theme.warningBackgroundColor};

	${StyledIcon} {
		color: ${(props) => props.theme.color};
	}

	${StyledTitle} {
		color: ${(props) => props.theme.color};
		opacity: 0.9;
	}
`;
const StyledButtonSidebarSecondary = (0, styled_components_1.default)(StyledButtonBase) `
	background: none;
	border-color: ${(props) => props.theme.color2};
	color: ${(props) => props.theme.color2};

	&:hover {
		color: ${(props) => props.theme.colorHover2};
		border-color: ${(props) => props.theme.colorHover2};
		background: none;

		${StyledTitle} {
			color: ${(props) => props.theme.colorHover2};
		}

		${StyledIcon} {
			color: ${(props) => props.theme.colorHover2};
		}
	}

	&:active {
		color: ${(props) => props.theme.colorActive2};
		border-color: ${(props) => props.theme.colorActive2};
		background: none;

		${StyledTitle} {
			color: ${(props) => props.theme.colorActive2};
		}

		${StyledIcon} {
			color: ${(props) => props.theme.colorActive2};
		}
	}

	${StyledTitle} {
		color: ${(props) => props.theme.color2};
	}

	${StyledIcon} {
		color: ${(props) => props.theme.color2};
	}
`;
function buttonClass(level) {
    if (level === ButtonLevel.Primary)
        return StyledButtonPrimary;
    if (level === ButtonLevel.Tertiary)
        return StyledButtonTertiary;
    if (level === ButtonLevel.SidebarSecondary)
        return StyledButtonSidebarSecondary;
    if (level === ButtonLevel.Recommended)
        return StyledButtonRecommended;
    return StyledButtonSecondary;
}
const Button = React.forwardRef((_a, ref) => {
    var { iconName, iconLabel, iconAnimation, color, title, level, fontSize, isSquare, tooltip, disabled, onClick: propsOnClick } = _a, unusedProps = __rest(_a, ["iconName", "iconLabel", "iconAnimation", "color", "title", "level", "fontSize", "isSquare", "tooltip", "disabled", "onClick"]);
    const iconOnly = iconName && !title;
    const StyledButton = buttonClass(level);
    function renderIcon() {
        if (!iconName)
            return null;
        return React.createElement(StyledIcon, { "aria-label": iconLabel !== null && iconLabel !== void 0 ? iconLabel : undefined, "aria-hidden": !iconLabel, animation: iconAnimation, mr: iconOnly ? '0' : '6px', color: color, className: `${iconName} icon`, role: 'img' });
    }
    function renderTitle() {
        if (!title)
            return null;
        return React.createElement(StyledTitle, { color: color }, title);
    }
    function onClick() {
        if (disabled)
            return;
        propsOnClick();
    }
    return (React.createElement(StyledButton, Object.assign({ ref: ref, fontSize: fontSize, isSquare: isSquare, disabled: disabled, title: tooltip, iconOnly: iconOnly, onClick: onClick, "aria-label": title ? undefined : tooltip, "aria-disabled": disabled }, unusedProps),
        renderIcon(),
        renderTitle()));
});
exports.default = (0, styled_components_1.default)(Button) `${space}`;
//# sourceMappingURL=Button.js.map