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
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
const StyledLink_1 = __importDefault(require("../../style/StyledLink"));
const openMissingPasswordFAQ = () => (0, bridge_1.default)().openExternal('https://joplinapp.org/help/faq#why-did-my-sync-and-encryption-passwords-disappear-after-updating-joplin');
// A link to a specific part of the FAQ related to passwords being cleared when upgrading
// to a MacOS/ARM release.
const MacOSMissingPasswordHelpLink = props => {
    const macInfoLink = (React.createElement(StyledLink_1.default, { href: "#", onClick: openMissingPasswordFAQ, style: props.theme.urlStyle }, props.text));
    // The FAQ section related to missing passwords is specific to MacOS/ARM -- only show it
    // in that case.
    const newArchitectureReleasedRecently = Date.now() <= Date.UTC(2023, 11); // 11 = December
    const showMacInfoLink = shim_1.default.isMac() && process.arch === 'arm64' && newArchitectureReleasedRecently;
    return showMacInfoLink ? macInfoLink : null;
};
exports.default = MacOSMissingPasswordHelpLink;
//# sourceMappingURL=MissingPasswordHelpLink.js.map