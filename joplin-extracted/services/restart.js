"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const bridge_1 = __importDefault(require("./bridge"));
exports.default = async () => {
    Setting_1.default.setValue('wasClosedSuccessfully', true);
    await Setting_1.default.saveAll();
    await (0, bridge_1.default)().restart();
};
//# sourceMappingURL=restart.js.map