"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = exports.UiType = void 0;
const locale_1 = require("@joplin/lib/locale");
const GotoAnything_1 = require("../../../plugins/GotoAnything");
const PluginManager_1 = __importDefault(require("@joplin/lib/services/PluginManager"));
var UiType;
(function (UiType) {
    UiType["GotoAnything"] = "gotoAnything";
    UiType["CommandPalette"] = "commandPalette";
    UiType["ControlledApi"] = "controlledApi";
})(UiType || (exports.UiType = UiType = {}));
exports.declaration = {
    name: 'gotoAnything',
    label: () => (0, locale_1._)('Goto Anything...'),
};
function menuItemById(id) {
    return PluginManager_1.default.instance().menuItems().find((i) => i.id === id);
}
// The way this command is implemented is a bit hacky due to the PluginManager
// layer. This manager is no longer needed but hasn't been refactored yet, so in
// the meantime we access the GotoAnything actions by grabbing the menu item
// calling the click() handler.
const runtime = () => {
    return {
        execute: async (_context, uiType = UiType.GotoAnything, options = null) => {
            options = Object.assign({ mode: GotoAnything_1.Mode.Default }, options);
            if (uiType === UiType.GotoAnything) {
                menuItemById('gotoAnything').click();
            }
            else if (uiType === UiType.CommandPalette) {
                menuItemById('commandPalette').click();
            }
            else if (uiType === UiType.ControlledApi) {
                return new Promise((resolve, reject) => {
                    const menuItem = PluginManager_1.default.instance().menuItems().find((i) => i.id === 'controlledApi');
                    const userData = {
                        callback: { resolve, reject },
                        mode: options.mode,
                        alwaysShowHelp: options.alwaysShowHelp,
                    };
                    menuItem.userData = userData;
                    menuItem.click();
                });
            }
            return null;
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=gotoAnything.js.map