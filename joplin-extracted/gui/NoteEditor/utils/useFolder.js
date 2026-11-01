"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
function default_1(dependencies) {
    const { folderId } = dependencies;
    const [folder, setFolder] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        async function loadFolder() {
            const f = await Folder_1.default.load(folderId);
            if (cancelled)
                return;
            setFolder(f);
        }
        void loadFolder();
        return function () {
            cancelled = true;
        };
    }, [folderId]);
    return folder;
}
//# sourceMappingURL=useFolder.js.map