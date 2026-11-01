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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dropdown = exports.DropdownVariant = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
var DropdownVariant;
(function (DropdownVariant) {
    DropdownVariant[DropdownVariant["Default"] = 1] = "Default";
    DropdownVariant[DropdownVariant["NoBorder"] = 2] = "NoBorder";
})(DropdownVariant || (exports.DropdownVariant = DropdownVariant = {}));
const Dropdown = (props) => {
    const renderOptions = () => {
        const optionComps = [];
        for (const [value, label] of Object.entries(props.options)) {
            optionComps.push(React.createElement("option", { key: value, value: value }, label));
        }
        return optionComps;
    };
    const onChange = (0, react_1.useCallback)((event) => {
        props.onChange({ value: event.target.value });
    }, [props.onChange]);
    const classNames = (0, react_1.useMemo)(() => {
        const variant = props.variant || DropdownVariant.Default;
        const output = [
            'dropdown-control',
            `-variant${variant}`,
        ];
        if (props.className)
            output.push(props.className);
        return output.join(' ');
    }, [props.variant, props.className]);
    return (React.createElement("select", { disabled: props.disabled, className: classNames, onChange: onChange, value: props.value }, renderOptions()));
};
exports.Dropdown = Dropdown;
//# sourceMappingURL=Dropdown.js.map