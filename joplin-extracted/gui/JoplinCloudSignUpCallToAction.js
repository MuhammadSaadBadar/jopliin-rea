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
const locale_1 = require("@joplin/lib/locale");
const React = __importStar(require("react"));
const bridge_1 = __importDefault(require("../services/bridge"));
const Button_1 = __importStar(require("./Button/Button"));
const JoplinCloudSignUpCallToAction = (props) => {
    var _a;
    const source = (_a = props.source) !== null && _a !== void 0 ? _a : 'desktop-app';
    const onJoplinCloudSignUpClick = async () => {
        await (0, bridge_1.default)().openExternal(`https://joplinapp.org/plans/?source=${encodeURIComponent(source)}`);
    };
    if (props.primary) {
        return React.createElement("div", { className: "joplin-cloud-sign-up -primary" },
            React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Primary, title: (0, locale_1._)('Sign up to Joplin Cloud'), onClick: onJoplinCloudSignUpClick }));
    }
    return React.createElement("div", { className: "joplin-cloud-sign-up" },
        props.withLeadIn ? `${(0, locale_1._)('Don\'t have an account yet?')} ` : null,
        React.createElement("a", { href: "#", onClick: onJoplinCloudSignUpClick }, (0, locale_1._)('Sign up to Joplin Cloud')));
};
exports.default = JoplinCloudSignUpCallToAction;
//# sourceMappingURL=JoplinCloudSignUpCallToAction.js.map