"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const keymapService = KeymapService_1.default.instance();
const useCommandStatus = () => {
    const [status, setStatus] = (0, react_1.useState)(() => keymapService.getCommandNames().reduce((accumulator, command) => {
        accumulator[command] = false;
        return accumulator;
    }, {}));
    const disableStatus = (commandName) => setStatus(prevStatus => (Object.assign(Object.assign({}, prevStatus), { [commandName]: false })));
    const enableStatus = (commandName) => setStatus(prevStatus => {
        // Falsify all the commands; Only one command should be truthy at any given time
        const newStatus = Object.keys(prevStatus).reduce((accumulator, command) => {
            accumulator[command] = false;
            return accumulator;
        }, {});
        // Make the appropriate command truthful
        newStatus[commandName] = true;
        return newStatus;
    });
    return [status, enableStatus, disableStatus];
};
exports.default = useCommandStatus;
//# sourceMappingURL=useCommandStatus.js.map