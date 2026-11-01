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
const time_1 = __importDefault(require("@joplin/lib/time"));
const theme_1 = require("@joplin/lib/theme");
const react_redux_1 = require("react-redux");
class NoteStatusBarComponent extends React.Component {
    style() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const style = {
            root: Object.assign(Object.assign({}, theme.textStyle), { backgroundColor: theme.backgroundColor, color: theme.colorFaded }),
        };
        return style;
    }
    render() {
        const note = this.props.note;
        return React.createElement("div", { style: this.style().root }, time_1.default.formatMsToLocal(note.user_updated_time));
    }
}
const mapStateToProps = (state) => {
    return {
        // notes: state.notes,
        // folders: state.folders,
        // selectedNoteIds: state.selectedNoteIds,
        themeId: state.settings.theme,
    };
};
const NoteStatusBar = (0, react_redux_1.connect)(mapStateToProps)(NoteStatusBarComponent);
exports.default = NoteStatusBar;
//# sourceMappingURL=NoteStatusBar.js.map