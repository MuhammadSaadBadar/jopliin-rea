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
const react_redux_1 = require("react-redux");
const locale_1 = require("@joplin/lib/locale");
const electron_1 = require("electron");
const Button_1 = __importDefault(require("./Button/Button"));
const types_1 = require("@joplin/lib/utils/joplinCloud/types");
const bridge_1 = __importDefault(require("../services/bridge"));
const JoplinCloudConfigScreen = (props) => {
    const copyToClipboard = () => {
        electron_1.clipboard.writeText(props.inboxEmail);
    };
    const isEmailToNoteAvailableInAccount = props.joplinCloudAccountType !== 1;
    const goToJoplinCloudProfile = async () => {
        await (0, bridge_1.default)().openExternal(`${props.joplinCloudWebsite}/users/me`);
    };
    return (React.createElement("div", null,
        React.createElement("div", { className: "joplin-cloud-account-information" },
            React.createElement("h2", null, (0, locale_1._)('Account information')),
            React.createElement("table", null,
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("strong", null, (0, locale_1._)('Account type'))),
                        React.createElement("td", null, (0, types_1.accountTypeToString)(props.joplinCloudAccountType))),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("strong", null, (0, locale_1._)('Email'))),
                        React.createElement("td", null, props.userEmail)))),
            React.createElement(Button_1.default, { onClick: goToJoplinCloudProfile, title: (0, locale_1._)('Go to Joplin Cloud profile') })),
        React.createElement("h2", null, (0, locale_1._)('Email to note')),
        React.createElement("p", null, (0, locale_1._)('Any email sent to this address will be converted into a note and added to your collection. The note will be saved into the Inbox notebook')),
        isEmailToNoteAvailableInAccount ? React.createElement(React.Fragment, null,
            React.createElement("p", { className: 'inbox-email-value' }, props.inboxEmail),
            React.createElement(Button_1.default, { onClick: copyToClipboard, title: (0, locale_1._)('Copy to clipboard') }))
            : React.createElement("div", { className: 'alert-warn' },
                React.createElement("p", null, (0, locale_1._)('Your account doesn\'t have access to this feature')))));
};
const mapStateToProps = (state) => {
    return {
        inboxEmail: state.settings['sync.10.inboxEmail'],
        joplinCloudAccountType: state.settings['sync.10.accountType'],
        userEmail: state.settings['sync.10.userEmail'],
        joplinCloudWebsite: state.settings['sync.10.website'],
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(JoplinCloudConfigScreen);
//# sourceMappingURL=JoplinCloudConfigScreen.js.map