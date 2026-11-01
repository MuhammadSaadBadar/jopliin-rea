"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const NewWindowOrIFrame_1 = require("../../NewWindowOrIFrame");
const NotePositionService_1 = __importDefault(require("@joplin/lib/services/NotePositionService"));
const useInitialCursorLocation = ({ noteId }) => {
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    return (0, react_1.useMemo)(() => {
        return NotePositionService_1.default.instance().getCursorPosition(noteId, windowId);
    }, [noteId, windowId]);
};
exports.default = useInitialCursorLocation;
//# sourceMappingURL=useInitialCursorLocation.js.map