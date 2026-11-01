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
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
class HelpButtonComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        if (this.props.onClick)
            this.props.onClick();
    }
    render() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const style = Object.assign(Object.assign({}, this.props.style), { color: theme.color, textDecoration: 'none' });
        const helpIconStyle = { flex: 0, width: 16, height: 16, marginLeft: 10 };
        const extraProps = {};
        if (this.props.tip) {
            extraProps['data-tip'] = this.props.tip;
            extraProps['aria-description'] = this.props.tip;
        }
        return (React.createElement("button", Object.assign({ style: style, onClick: this.onClick, className: 'flat-button', "aria-controls": this.props['aria-controls'], "aria-expanded": this.props['aria-expanded'] }, extraProps),
            React.createElement("i", { style: helpIconStyle, className: 'fa fa-question-circle', role: 'img', "aria-label": (0, locale_1._)('Help') })));
    }
}
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
    };
};
const HelpButton = (0, react_redux_1.connect)(mapStateToProps)(HelpButtonComponent);
exports.default = HelpButton;
//# sourceMappingURL=HelpButton.js.map