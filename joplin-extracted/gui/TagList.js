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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const TagItem_1 = __importDefault(require("./TagItem"));
const getCollator_1 = require("@joplin/lib/models/utils/getCollator");
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
function TagList(props) {
    const collatorLocale = (0, getCollator_1.getCollatorLocale)();
    const style = (0, react_1.useMemo)(() => {
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const output = Object.assign({}, props.style);
        output.display = 'flex';
        output.flexDirection = 'row';
        output.boxSizing = 'border-box';
        output.fontSize = theme.fontSize;
        output.whiteSpace = 'nowrap';
        output.paddingTop = 8;
        output.paddingBottom = 8;
        return output;
    }, [props.style, props.themeId]);
    const tags = (0, react_1.useMemo)(() => {
        const output = props.items.slice();
        const collator = (0, getCollator_1.getCollator)(collatorLocale);
        output.sort((a, b) => {
            return collator.compare(a.title, b.title);
        });
        return output;
    }, [props.items, collatorLocale]);
    const tagItems = (0, react_1.useMemo)(() => {
        const output = [];
        for (let i = 0; i < tags.length; i++) {
            const props = {
                title: tags[i].title,
                id: tags[i].id,
                key: tags[i].id,
            };
            output.push(React.createElement(TagItem_1.default, Object.assign({}, props)));
        }
        return output;
    }, [tags]);
    return (React.createElement("div", { className: "tag-list", style: style }, tagItems));
}
const mapStateToProps = (state) => {
    return { themeId: state.settings.theme };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(TagList);
//# sourceMappingURL=TagList.js.map