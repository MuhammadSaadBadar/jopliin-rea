"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const getAssetPath = (path) => {
    // __dirname sometimes points to app-desktop/
    const baseDir = __dirname.match(/utils[/\\]?$/) ? (0, path_1.dirname)(__dirname) : __dirname;
    return (0, path_1.join)(baseDir, path);
};
exports.default = getAssetPath;
//# sourceMappingURL=getAssetPath.js.map