"use strict";
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
const string_utils_1 = require("@joplin/lib/string-utils");
// Returns a React node where every case-insensitive match of `query` in `text`
// is wrapped in a `mark` element.
const highlightSearchText = (text, query) => {
    if (!text)
        return text;
    const trimmedQuery = query.trim();
    if (!trimmedQuery)
        return text;
    const matcher = new RegExp(`(${(0, string_utils_1.escapeRegExp)(trimmedQuery)})`, 'ig');
    const parts = text.split(matcher);
    if (parts.length === 1)
        return text;
    return parts.map((part, index) => {
        if (index % 2 === 1) {
            return React.createElement("mark", { key: `highlight-${index}` }, part);
        }
        return React.createElement(React.Fragment, { key: `text-${index}` }, part);
    });
};
exports.default = highlightSearchText;
//# sourceMappingURL=searchHighlight.js.map