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
exports.default = default_1;
const React = __importStar(require("react"));
const react_1 = require("react");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const StyledInput_1 = __importDefault(require("../../style/StyledInput"));
function default_1(props) {
    const iconName = !props.searchStarted ? CommandService_1.default.instance().iconName('search') : 'fa fa-times';
    const iconLabel = !props.searchStarted ? (0, locale_1._)('Search') : (0, locale_1._)('Clear search');
    const onChange = (0, react_1.useCallback)((event) => {
        props.onChange({ value: event.currentTarget.value });
    }, [props.onChange]);
    const fieldClassName = ['field'];
    if (props.inputClassName)
        fieldClassName.push(props.inputClassName);
    return (React.createElement("div", { className: 'search-input' },
        React.createElement(StyledInput_1.default, { ref: props.inputRef, className: fieldClassName.join(' '), value: props.value, type: "search", placeholder: props.placeholder || (0, locale_1._)('Search...'), onChange: onChange, onFocus: props.onFocus, onBlur: props.onBlur, onKeyDown: props.onKeyDown, spellCheck: false, disabled: props.disabled, "aria-label": props.placeholder || (0, locale_1._)('Search...'), "aria-controls": props['aria-controls'] }),
        React.createElement("button", { type: 'button', className: 'button', "aria-label": iconLabel, disabled: props.disabled, tabIndex: props.iconButtonTabIndex, onClick: props.onSearchButtonClick },
            React.createElement("span", { className: `icon ${iconName}` }))));
}
//# sourceMappingURL=SearchInput.js.map