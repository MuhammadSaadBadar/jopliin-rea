"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const retryOnFailure_1 = __importDefault(require("./retryOnFailure"));
const evaluateWithRetry = async (app, pageFunction, arg) => {
    await (0, retryOnFailure_1.default)(async () => {
        return await app.evaluate(pageFunction, arg);
    }, { maxRetries: 3 });
};
exports.default = evaluateWithRetry;
//# sourceMappingURL=evaluateWithRetry.js.map