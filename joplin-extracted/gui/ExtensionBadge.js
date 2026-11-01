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
const React = __importStar(require("react"));
const bridge_1 = __importDefault(require("../services/bridge"));
const locale_1 = require("@joplin/lib/locale");
const theme_1 = require("@joplin/lib/theme");
const reselect_1 = require("reselect");
const themeSelector = (_state, props) => (0, theme_1.themeStyle)(props.themeId);
const styleSelector = (0, reselect_1.createSelector)(themeSelector, (theme) => {
    const root = {
        width: 220,
        height: 60,
        borderRadius: 4,
        border: '1px solid',
        borderColor: theme.dividerColor,
        backgroundColor: theme.backgroundColor,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 8,
        paddingBottom: 8,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0px 1px 1px rgba(0,0,0,0.3)',
    };
    const logo = {
        width: 42,
        height: 42,
    };
    const labelGroup = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 14,
        fontFamily: theme.fontFamily,
        color: theme.color,
        fontSize: theme.fontSize,
    };
    const locationLabel = {
        fontSize: theme.fontSize * 1.2,
        fontWeight: 'bold',
    };
    return { root, logo, labelGroup, locationLabel };
});
function platformAssets(type) {
    if (type === 'firefox') {
        return {
            logoImage: `${(0, bridge_1.default)().buildDir()}/images/firefox-logo.svg`,
            locationLabel: (0, locale_1._)('Firefox Extension'),
        };
    }
    if (type === 'chrome') {
        return {
            logoImage: `${(0, bridge_1.default)().buildDir()}/images/chrome-logo.svg`,
            locationLabel: (0, locale_1._)('Chrome Web Store'),
        };
    }
    throw new Error(`Invalid type:${type}`);
}
function ExtensionBadge(props) {
    const style = styleSelector(null, props);
    const assets = platformAssets(props.type);
    const onClick = () => {
        void (0, bridge_1.default)().openExternal(props.url);
    };
    const rootStyle = props.style ? Object.assign(Object.assign({}, style.root), props.style) : style.root;
    return (React.createElement("a", { style: rootStyle, onClick: onClick, href: "#" },
        React.createElement("img", { style: style.logo, src: assets.logoImage }),
        React.createElement("div", { style: style.labelGroup },
            React.createElement("div", null, (0, locale_1._)('Get it now:')),
            React.createElement("div", { style: style.locationLabel }, assets.locationLabel))));
}
exports.default = ExtensionBadge;
//# sourceMappingURL=ExtensionBadge.js.map