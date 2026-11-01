"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const usePrevious_1 = __importDefault(require("@joplin/lib/hooks/usePrevious"));
const useActiveDescendantId = (selectedFolderId, selectedNoteIds) => {
    var _a, _b;
    const selectedNoteIdsRef = (0, react_1.useRef)(selectedNoteIds);
    selectedNoteIdsRef.current = selectedNoteIds;
    const [focusedNoteId, setFocusedNoteId] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        var _a, _b;
        setFocusedNoteId((_b = (_a = selectedNoteIdsRef.current) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '');
    }, [selectedFolderId]);
    const previousSelectedNoteIds = (0, usePrevious_1.default)(selectedNoteIds, []);
    let activeNoteId = focusedNoteId;
    if (!selectedNoteIds.includes(activeNoteId)) {
        // Prefer added items
        activeNoteId = (_b = (_a = selectedNoteIds.find(id => !previousSelectedNoteIds.includes(id))) !== null && _a !== void 0 ? _a : selectedNoteIds[0]) !== null && _b !== void 0 ? _b : '';
    }
    (0, react_1.useEffect)(() => {
        if (focusedNoteId !== activeNoteId) {
            setFocusedNoteId(activeNoteId);
        }
    }, [focusedNoteId, activeNoteId]);
    return { activeNoteId, setActiveNoteId: setFocusedNoteId };
};
exports.default = useActiveDescendantId;
//# sourceMappingURL=useActiveDescendantId.js.map