"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shim_1 = __importDefault(require("@joplin/lib/shim"));
// .setReact needs to be called very early in the application startup process.
// This file can be imported to ensure that .setReact and .setReactDom have been called.
shim_1.default.setReact(require('react'));
shim_1.default.setReactDom(require('react-dom'));
//# sourceMappingURL=initReact.js.map