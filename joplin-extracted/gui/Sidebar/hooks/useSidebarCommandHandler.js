"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const react_1 = require("react");
const commands_1 = __importDefault(require("../commands"));
const useSidebarCommandHandler = ({ focusSidebar }) => {
    (0, react_1.useEffect)(() => {
        const runtimeProps = {
            focusSidebar,
        };
        CommandService_1.default.instance().componentRegisterCommands(runtimeProps, commands_1.default);
        return () => {
            CommandService_1.default.instance().componentUnregisterCommands(commands_1.default);
        };
    }, [focusSidebar]);
};
exports.default = useSidebarCommandHandler;
//# sourceMappingURL=useSidebarCommandHandler.js.map