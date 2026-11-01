"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const dom_1 = require("@joplin/lib/dom");
const useRootElement = (elementId) => {
    const [rootElement, setRootElement] = (0, react_1.useState)(null);
    (0, useAsyncEffect_1.default)(async (event) => {
        const element = await (0, dom_1.waitForElement)(document, elementId, event);
        if (event.cancelled)
            return;
        setRootElement(element);
    }, [document, elementId]);
    return rootElement;
};
exports.default = useRootElement;
//# sourceMappingURL=useRootElement.js.map