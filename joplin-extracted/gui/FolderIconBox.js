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
const types_1 = require("@joplin/lib/services/database/types");
const EmojiBox_1 = __importDefault(require("./EmojiBox"));
function default_1(props) {
    const folderIcon = props.folderIcon;
    const opacity = 'opacity' in props ? props.opacity : 1;
    const width = 20;
    const height = 20;
    if (folderIcon.type === types_1.FolderIconType.Emoji) {
        return React.createElement(EmojiBox_1.default, { width: width, height: height, emoji: folderIcon.emoji });
    }
    else if (folderIcon.type === types_1.FolderIconType.DataUrl) {
        return React.createElement("img", { style: { width, height, opacity }, src: folderIcon.dataUrl });
    }
    else if (folderIcon.type === types_1.FolderIconType.FontAwesome) {
        return React.createElement("i", { style: { fontSize: 18, width, opacity }, className: folderIcon.name, role: 'img', "aria-hidden": true });
    }
    else {
        throw new Error(`Unsupported folder icon type: ${folderIcon.type}`);
    }
}
//# sourceMappingURL=FolderIconBox.js.map