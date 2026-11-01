"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const useMessageHandler_1 = __importDefault(require("./useMessageHandler"));
function default_1(viewRef, onSubmit, onDismiss) {
    (0, useMessageHandler_1.default)(viewRef, event => {
        var _a;
        const message = (_a = event.data) === null || _a === void 0 ? void 0 : _a.message;
        if (message === 'form-submit' && onSubmit) {
            onSubmit();
        }
        else if (message === 'dismiss' && onDismiss) {
            onDismiss();
        }
    });
}
//# sourceMappingURL=useSubmitHandler.js.map