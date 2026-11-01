"use strict";
// Used in safe mode
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const PlainEditor = (props, ref) => {
    const editorRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            content: () => { var _a, _b; return (_b = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ''; },
            resetScroll: () => {
                editorRef.current.scrollTop = 0;
            },
            scrollTo: () => {
                // Not supported
            },
            supportsCommand: _name => {
                return false;
            },
            execCommand: async (_command) => {
                // Not supported
            },
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!editorRef.current)
            return;
        if (editorRef.current.value !== props.content) {
            editorRef.current.value = props.content;
        }
    }, [props.content]);
    const onChange = (0, react_1.useCallback)((event) => {
        props.onChange({ changeId: null, content: event.target.value });
    }, [props.onChange]);
    return (React.createElement("div", { style: props.style },
        React.createElement("textarea", { ref: editorRef, style: { width: '100%', height: '100%' }, defaultValue: props.content, onChange: onChange })));
};
exports.default = (0, react_1.forwardRef)(PlainEditor);
//# sourceMappingURL=PlainEditor.js.map