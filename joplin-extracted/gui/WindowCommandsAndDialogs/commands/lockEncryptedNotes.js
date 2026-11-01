"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
exports.declaration = {
    name: 'lockEncryptedNotes',
    label: () => (0, locale_1._)('Lock encrypted notes'),
};
const runtime = () => {
    return {
        execute: async () => {
            if (!(0, isNoteLockEnabled_1.default)())
                return;
            NoteLockSession_1.default.instance().lock();
        },
        enabledCondition: 'noteLockSessionUnlocked',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=lockEncryptedNotes.js.map