"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const evaluateWithRetry_1 = __importDefault(require("./evaluateWithRetry"));
const setDarkMode = (app, darkMode) => {
    return (0, evaluateWithRetry_1.default)(app, ({ nativeTheme }, darkMode) => {
        nativeTheme.themeSource = darkMode ? 'dark' : 'light';
    }, darkMode);
};
exports.default = setDarkMode;
//# sourceMappingURL=setDarkMode.js.map