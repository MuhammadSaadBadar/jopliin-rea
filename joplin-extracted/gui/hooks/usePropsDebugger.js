"use strict";
// Use this to show which props have been changed within a component.
//
// Usage: usePropsDebugger(props);
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePropsDebugger;
const useEffectDebugger_1 = __importDefault(require("./useEffectDebugger"));
function usePropsDebugger(props) {
    const dependencies = [];
    const dependencyNames = [];
    for (const k in props) {
        dependencies.push(props[k]);
        dependencyNames.push(k);
    }
    (0, useEffectDebugger_1.default)(() => { }, dependencies, dependencyNames);
}
//# sourceMappingURL=usePropsDebugger.js.map