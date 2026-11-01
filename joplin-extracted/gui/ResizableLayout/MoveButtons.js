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
exports.default = MoveButtons;
const React = __importStar(require("react"));
const react_1 = require("react");
const Button_1 = __importStar(require("../Button/Button"));
const movements_1 = require("./utils/movements");
const styled_components_1 = __importDefault(require("styled-components"));
const locale_1 = require("@joplin/lib/locale");
const StyledRoot = styled_components_1.default.div `
	display: flex;
	flex-direction: column;
	padding: 5px;
	background-color: ${props => props.theme.backgroundColor};
	border-radius: 5px;

	> .label {
		// Used only for accessibility tools
		display: none;
	}
`;
const ButtonRow = styled_components_1.default.div `
	display: flex;
	flex-direction: row;
	justify-content: center;
`;
const EmptyButton = (0, styled_components_1.default)(Button_1.default) `
	visibility: hidden;
`;
const ArrowButton = (0, styled_components_1.default)(Button_1.default) `
	opacity: ${props => props.disabled ? 0.2 : 1};
`;
function MoveButtons(props) {
    const onButtonClick = (0, react_1.useCallback)((direction) => {
        props.onClick({ direction, itemKey: props.itemKey, buttonKey: `${props.itemKey}-${direction}` });
    }, [props.onClick, props.itemKey]);
    function canMove(dir) {
        if (dir === movements_1.MoveDirection.Up)
            return props.canMoveUp;
        if (dir === movements_1.MoveDirection.Down)
            return props.canMoveDown;
        if (dir === movements_1.MoveDirection.Left)
            return props.canMoveLeft;
        if (dir === movements_1.MoveDirection.Right)
            return props.canMoveRight;
        throw new Error('Unreachable');
    }
    const iconLabel = (dir) => {
        if (dir === movements_1.MoveDirection.Up)
            return (0, locale_1._)('Move up');
        if (dir === movements_1.MoveDirection.Down)
            return (0, locale_1._)('Move down');
        if (dir === movements_1.MoveDirection.Left)
            return (0, locale_1._)('Move left');
        if (dir === movements_1.MoveDirection.Right)
            return (0, locale_1._)('Move right');
        const unreachable = dir;
        throw new Error(`Invalid direction: ${unreachable}`);
    };
    const descriptionId = (0, react_1.useId)();
    const buttonKey = (dir) => `${props.itemKey}-${dir}`;
    const autoFocusDirection = (() => {
        if (!props.autoFocusKey)
            return undefined;
        const buttonDirections = [movements_1.MoveDirection.Up, movements_1.MoveDirection.Down, movements_1.MoveDirection.Left, movements_1.MoveDirection.Right];
        const autoFocusDirection = buttonDirections.find(direction => buttonKey(direction) === props.autoFocusKey);
        if (!autoFocusDirection) {
            return null;
        }
        const autoFocusDirectionEnabled = autoFocusDirection && canMove(autoFocusDirection);
        if (autoFocusDirectionEnabled) {
            return autoFocusDirection;
        }
        else {
            // Select an enabled direction instead
            return buttonDirections.find(dir => canMove(dir));
        }
    })();
    function renderButton(dir) {
        return React.createElement(ArrowButton, { disabled: !canMove(dir), level: Button_1.ButtonLevel.Primary, iconName: `fas fa-arrow-${dir}`, iconLabel: iconLabel(dir), autoFocus: autoFocusDirection === dir, onClick: () => onButtonClick(dir) });
    }
    return (React.createElement(StyledRoot, { role: 'group', "aria-labelledby": descriptionId },
        React.createElement(ButtonRow, null, renderButton(movements_1.MoveDirection.Up)),
        React.createElement(ButtonRow, null,
            renderButton(movements_1.MoveDirection.Left),
            React.createElement(EmptyButton, { iconName: "fas fa-arrow-down", "aria-hidden": true, disabled: true }),
            renderButton(movements_1.MoveDirection.Right)),
        React.createElement(ButtonRow, null, renderButton(movements_1.MoveDirection.Down)),
        React.createElement("div", { className: 'label', id: descriptionId }, props.itemLabel)));
}
//# sourceMappingURL=MoveButtons.js.map