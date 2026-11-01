"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const locale_1 = require("@joplin/lib/locale");
const commandService = CommandService_1.default.instance();
const getLabel = (commandName) => {
    if (commandService.exists(commandName))
        return commandService.label(commandName, true);
    // Some commands are not registered in CommandService at the moment
    // Following hard-coded labels are used as a workaround
    switch (commandName) {
        case 'quit':
            return (0, locale_1._)('Quit');
        case 'zoomActualSize':
            return (0, locale_1._)('Actual Size');
        case 'help':
            return (0, locale_1._)('Website and documentation');
        case 'hideApp':
            return (0, locale_1._)('Hide Joplin');
        case 'minimizeWindow':
            return (0, locale_1._)('Minimise');
        case 'closeWindow':
            return (0, locale_1._)('Close Window');
        case 'config':
            return shim_1.default.isMac() ? (0, locale_1._)('Preferences') : (0, locale_1._)('Options');
    }
    // We don't throw an error if a command is not found because if for
    // example a command is removed from one version to the next, or a
    // command is renamed, we still want the keymap editor to work. So in
    // that case, we simply display the command name and it is up to the
    // user to fix the shortcut if needed.
    return `${commandName} (${(0, locale_1._)('Invalid')})`;
};
exports.default = getLabel;
//# sourceMappingURL=getLabel.js.map