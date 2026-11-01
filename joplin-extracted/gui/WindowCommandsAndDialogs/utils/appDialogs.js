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
const Dialog_1 = __importDefault(require("../../SyncWizard/Dialog"));
const Dialog_2 = __importDefault(require("../../MasterPasswordDialog/Dialog"));
const Dialog_3 = __importDefault(require("../../NoteLockUnlockDialog/Dialog"));
const Dialog_4 = __importDefault(require("../../EditFolderDialog/Dialog"));
const PdfViewer_1 = __importDefault(require("../../PdfViewer"));
const appDialogs = {
    syncWizard: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- See RegisteredDialog.render
        render: (props, customProps) => {
            return React.createElement(Dialog_1.default, Object.assign({ key: props.key, dispatch: props.dispatch, themeId: props.themeId }, customProps));
        },
    },
    masterPassword: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- See RegisteredDialog.render
        render: (props, customProps) => {
            return React.createElement(Dialog_2.default, Object.assign({ key: props.key, dispatch: props.dispatch, themeId: props.themeId }, customProps));
        },
    },
    noteLockUnlock: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- See RegisteredDialog.render
        render: (props, customProps) => {
            return React.createElement(Dialog_3.default, Object.assign({ key: props.key, dispatch: props.dispatch, themeId: props.themeId }, customProps));
        },
    },
    editFolder: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- See RegisteredDialog.render
        render: (props, customProps) => {
            return React.createElement(Dialog_4.default, Object.assign({ key: props.key, dispatch: props.dispatch, themeId: props.themeId }, customProps));
        },
    },
    pdfViewer: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- See RegisteredDialog.render
        render: (props, customProps) => {
            return React.createElement(PdfViewer_1.default, Object.assign({ key: props.key, dispatch: props.dispatch, themeId: props.themeId }, customProps));
        },
    },
};
exports.default = appDialogs;
//# sourceMappingURL=appDialogs.js.map