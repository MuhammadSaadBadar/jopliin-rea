"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEffectDebugger;
const usePrevious_1 = __importDefault(require("./usePrevious"));
const react_1 = require("react");
function useEffectDebugger(effectHook, dependencies, dependencyNames = []) {
    const previousDeps = (0, usePrevious_1.default)(dependencies, []);
    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return Object.assign(Object.assign({}, accum), { [keyName]: {
                    before: previousDeps[index],
                    after: dependency,
                } });
        }
        return accum;
    }, {});
    if (Object.keys(changedDeps).length) {
        // eslint-disable-next-line no-console
        console.log('[use-effet-debugger] ', changedDeps);
    }
    // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    (0, react_1.useEffect)(effectHook, dependencies);
}
//# sourceMappingURL=useEffectDebugger.js.map