"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useMessageHandler_1 = __importDefault(require("./useMessageHandler"));
const useFormData = (viewRef, postMessage) => {
    const formDataListenersRef = (0, react_1.useRef)([]);
    (0, useMessageHandler_1.default)(viewRef, (event) => {
        if (event.data.message === 'serializedForms') {
            const formData = event.data.formData;
            if (typeof formData !== 'object') {
                throw new Error('Invalid formData result.');
            }
            const listeners = [...formDataListenersRef.current];
            formDataListenersRef.current = [];
            for (const listener of listeners) {
                listener(formData);
            }
        }
    });
    return (0, react_1.useMemo)(() => {
        return {
            getFormData: () => {
                return new Promise(resolve => {
                    postMessage('serializeForms', null);
                    formDataListenersRef.current.push((data) => {
                        resolve(data);
                    });
                });
            },
        };
    }, [postMessage]);
};
exports.default = useFormData;
//# sourceMappingURL=useFormData.js.map