"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const noteListType_1 = require("@joplin/lib/services/plugins/api/noteListType");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const getColumnTitle_1 = __importDefault(require("./getColumnTitle"));
const Menu = (0, bridge_1.default)().Menu;
exports.default = (columns) => {
    return (0, react_1.useCallback)(() => {
        const menuItems = [];
        for (const columnName of noteListType_1.columnNames) {
            menuItems.push({
                id: columnName,
                label: (0, getColumnTitle_1.default)(columnName),
                type: 'checkbox',
                checked: !!columns.find(c => c.name === columnName),
                click: (menuItem) => {
                    const newColumns = columns.slice();
                    const { checked } = menuItem;
                    const id = menuItem.id;
                    if (!checked) {
                        if (columns.length === 1)
                            return;
                        const index = newColumns.findIndex(c => c.name === id);
                        newColumns.splice(index, 1);
                    }
                    else {
                        const newColumn = {
                            name: id,
                            width: noteListType_1.defaultWidth,
                        };
                        newColumns.push(newColumn);
                    }
                    Setting_1.default.setValue('notes.columns', newColumns);
                },
            });
        }
        menuItems.sort((a, b) => {
            return a.label < b.label ? -1 : +1;
        });
        const menu = Menu.buildFromTemplate(menuItems);
        menu.popup({ window: (0, bridge_1.default)().mainWindow() });
    }, [columns]);
};
//# sourceMappingURL=useContextMenu.js.map