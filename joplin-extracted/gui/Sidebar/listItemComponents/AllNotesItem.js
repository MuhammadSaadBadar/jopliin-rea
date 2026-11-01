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
const styles_1 = require("../styles");
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const MenuUtils_1 = __importDefault(require("@joplin/lib/services/commands/MenuUtils"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const PerFolderSortOrderService_1 = __importDefault(require("@joplin/lib/services/sortOrder/PerFolderSortOrderService"));
const react_redux_1 = require("react-redux");
const EmptyExpandLink_1 = __importDefault(require("./EmptyExpandLink"));
const ListItemWrapper_1 = __importDefault(require("./ListItemWrapper"));
const reserved_ids_1 = require("@joplin/lib/reserved-ids");
const Menu = (0, bridge_1.default)().Menu;
const MenuItem = (0, bridge_1.default)().MenuItem;
const menuUtils = new MenuUtils_1.default(CommandService_1.default.instance());
const AllNotesItem = props => {
    const onAllNotesClick_ = (0, react_1.useCallback)(() => {
        props.dispatch({
            type: 'SMART_FILTER_SELECT',
            id: reserved_ids_1.ALL_NOTES_FILTER_ID,
        });
    }, [props.dispatch]);
    const toggleAllNotesContextMenu = (0, react_1.useCallback)(() => {
        const menu = new Menu();
        if (Setting_1.default.value('notes.perFolderSortOrderEnabled')) {
            menu.append(new MenuItem(Object.assign(Object.assign({}, menuUtils.commandToStatefulMenuItem('togglePerFolderSortOrder', reserved_ids_1.ALL_NOTES_FILTER_ID)), { type: 'checkbox', checked: PerFolderSortOrderService_1.default.isSet(reserved_ids_1.ALL_NOTES_FILTER_ID) })));
        }
        menu.popup({ window: (0, bridge_1.default)().activeWindow() });
    }, []);
    return (React.createElement(ListItemWrapper_1.default, { containerRef: props.anchorRef, key: "allNotesHeader", selectionState: props.selectionState, depth: props.item.depth, className: 'list-item-container list-item-depth-0 all-notes', highlightOnHover: true, itemIndex: props.index, itemCount: props.itemCount },
        React.createElement(EmptyExpandLink_1.default, null),
        React.createElement(styles_1.StyledAllNotesIcon, { "aria-hidden": 'true', role: 'img', className: 'icon-notes' }),
        React.createElement(styles_1.StyledListItemAnchor, { className: "list-item", isSpecialItem: true, selected: props.selectionState.selected, onClick: onAllNotesClick_, onContextMenu: toggleAllNotesContextMenu }, props.item.label)));
};
exports.default = (0, react_redux_1.connect)()(AllNotesItem);
//# sourceMappingURL=AllNotesItem.js.map