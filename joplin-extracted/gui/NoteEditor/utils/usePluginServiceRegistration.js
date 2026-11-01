"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePluginServiceRegistration;
const react_1 = require("react");
const PlatformImplementation_1 = __importDefault(require("../../../services/plugins/PlatformImplementation"));
function usePluginServiceRegistration(ref) {
    (0, react_1.useEffect)(() => {
        PlatformImplementation_1.default.instance().registerComponent('textEditor', ref);
        return () => {
            PlatformImplementation_1.default.instance().unregisterComponent('textEditor');
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
}
//# sourceMappingURL=usePluginServiceRegistration.js.map