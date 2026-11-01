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
const react_1 = require("react");
const styles_1 = require("../styles");
const types_1 = require("../types");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const MenuUtils_1 = __importDefault(require("@joplin/lib/services/commands/MenuUtils"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const ListItemWrapper_1 = __importDefault(require("./ListItemWrapper"));
const Menu = (0, bridge_1.default)().Menu;
const MenuItem = (0, bridge_1.default)().MenuItem;
const menuUtils = new MenuUtils_1.default(CommandService_1.default.instance());
const HeaderItem = props => {
    const item = props.item;
    const onItemClick = item.onClick;
    const itemId = item.id;
    const onClick = (0, react_1.useCallback)(event => {
        if (onItemClick) {
            onItemClick(itemId, event);
        }
    }, [onItemClick, itemId]);
    const onContextMenu = (0, react_1.useCallback)(async () => {
        if (itemId === types_1.HeaderId.FolderHeader) {
            const menu = new Menu();
            menu.append(new MenuItem(menuUtils.commandToStatefulMenuItem('newFolder')));
            menu.popup({ window: (0, bridge_1.default)().activeWindow() });
        }
    }, [itemId]);
    return (React.createElement(ListItemWrapper_1.default, Object.assign({ containerRef: props.anchorRef, selectionState: props.selectionState, itemIndex: props.index, itemCount: props.itemCount, expanded: props.item.expanded, onContextMenu: onContextMenu, depth: item.depth, highlightOnHover: false, className: 'sidebar-header-container' }, item.extraProps, { onDrop: props.onDrop }),
        React.createElement(styles_1.StyledHeader, { onClick: onClick },
            React.createElement(styles_1.StyledHeaderIcon, { "aria-hidden": 'true', role: 'img', className: item.iconName }),
            React.createElement(styles_1.StyledHeaderLabel, null, item.label))));
};
exports.default = HeaderItem;
//# sourceMappingURL=HeaderItem.js.map