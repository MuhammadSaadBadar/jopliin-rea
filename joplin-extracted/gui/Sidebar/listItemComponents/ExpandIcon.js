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
const React = __importStar(require("react"));
const locale_1 = require("@joplin/lib/locale");
const ExpandIcon = props => {
    const classNames = ['sidebar-expand-icon'];
    if (props.isVisible)
        classNames.push('-visible');
    classNames.push(props.isExpanded ? 'fas fa-caret-down' : 'fas fa-caret-right');
    // Referencing the name of the item we expand/collapse is both good for accessibility
    // and makes writing tests easier.
    const getLabel = () => {
        if (!props.isVisible) {
            return undefined;
        }
        if (props.isExpanded) {
            return (0, locale_1._)('Expanded');
        }
        return (0, locale_1._)('Collapsed');
    };
    const label = getLabel();
    return React.createElement("i", { className: classNames.join(' '), "aria-hidden": !props.isVisible, "aria-label": label, role: 'img' });
};
exports.default = ExpandIcon;
//# sourceMappingURL=ExpandIcon.js.map