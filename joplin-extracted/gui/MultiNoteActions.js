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
exports.default = MultiNoteActions;
const React = __importStar(require("react"));
const NoteListUtils_1 = __importDefault(require("./utils/NoteListUtils"));
const theme_1 = require("@joplin/lib/theme");
const bridge_1 = __importDefault(require("../services/bridge"));
function styles_(props) {
    return (0, theme_1.buildStyle)('MultiNoteActions', props.themeId, (theme) => {
        return {
            itemList: {
                display: 'flex',
                flexDirection: 'column',
            },
            divider: {
                borderTopWidth: 1,
                borderTopStyle: 'solid',
                borderTopColor: theme.dividerColor,
                width: '100%',
                height: 1,
                marginBottom: 10,
            },
            button: Object.assign(Object.assign({}, theme.buttonStyle), { marginBottom: 10 }),
        };
    });
}
function MultiNoteActions(props) {
    const styles = styles_(props);
    const multiNotesButton_click = (item) => {
        if (item.submenu) {
            item.submenu.popup({ window: (0, bridge_1.default)().activeWindow() });
        }
        else {
            item.click();
        }
    };
    const menu = NoteListUtils_1.default.makeContextMenu(props.selectedNoteIds, {
        notes: props.notes,
        dispatch: props.dispatch,
        watchedNoteFiles: props.watchedNoteFiles,
        plugins: props.plugins,
        inConflictFolder: props.inConflictFolder,
        customCss: props.customCss,
    });
    const itemComps = [];
    const menuItems = menu.items;
    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        if (!item.enabled)
            continue;
        if (item.type === 'separator') {
            itemComps.push(React.createElement("div", { key: `divider${i}`, style: styles.divider }));
        }
        else {
            itemComps.push(React.createElement("button", { key: item.label, style: styles.button, onClick: () => multiNotesButton_click(item) }, item.label));
        }
    }
    return (React.createElement("div", { style: styles.root, className: 'multi-note-actions' },
        React.createElement("div", { style: styles.itemList }, itemComps)));
}
//# sourceMappingURL=MultiNoteActions.js.map