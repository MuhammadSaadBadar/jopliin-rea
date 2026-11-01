"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'revealResourceFile',
    label: () => (0, locale_1._)('Reveal file in folder'),
};
const runtime = () => {
    return {
        execute: async (_context, itemId) => {
            const resource = await Resource_1.default.load(itemId);
            if (!resource)
                throw new Error(`No such resource: ${itemId}`);
            const fullPath = Resource_1.default.fullPath(resource);
            (0, bridge_1.default)().showItemInFolder(fullPath);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=revealResourceFile.js.map