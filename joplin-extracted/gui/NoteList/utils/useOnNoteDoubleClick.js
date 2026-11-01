"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
exports.default = () => {
    return (0, react_1.useCallback)((event) => {
        const noteId = event.currentTarget.getAttribute('data-id');
        void CommandService_1.default.instance().execute('openNoteInNewWindow', noteId);
    }, []);
};
//# sourceMappingURL=useOnNoteDoubleClick.js.map