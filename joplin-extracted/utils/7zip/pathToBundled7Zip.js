"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const bridge_1 = __importDefault(require("../../services/bridge"));
const pathToBundled7Zip = () => {
    // 7zip-bin is very large -- return the path to a version of 7zip
    // copied from 7zip-bin.
    const executableName = process.platform === 'win32' ? '7za.exe' : '7za';
    const baseDir = (0, path_1.join)((0, bridge_1.default)().buildDir(), '7zip');
    return { baseDir, executableName, fullPath: (0, path_1.resolve)((0, path_1.join)(baseDir, executableName)) };
};
exports.default = pathToBundled7Zip;
//# sourceMappingURL=pathToBundled7Zip.js.map