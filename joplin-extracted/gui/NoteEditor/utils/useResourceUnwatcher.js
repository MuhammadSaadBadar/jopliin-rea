"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceEditWatcher_1 = __importDefault(require("@joplin/lib/services/ResourceEditWatcher"));
const react_1 = require("react");
const useResourceUnwatcher = ({ noteId, windowId }) => {
    (0, react_1.useEffect)(() => {
        // All resources associated with the current window should no longer be watched after:
        // 1. The editor unloads, or
        // 2. The note shown in the editor changes.
        // Unwatching in a cleanup callback handles both cases.
        return () => {
            void ResourceEditWatcher_1.default.instance().stopWatchingAll(windowId);
        };
    }, [noteId, windowId]);
};
exports.default = useResourceUnwatcher;
//# sourceMappingURL=useResourceUnwatcher.js.map