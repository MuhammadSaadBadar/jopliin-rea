"use strict";
// This component is perhaps a bit of a hack but the approach should be
// reliable. It converts the current (JS) theme to CSS, and add it to the HEAD
// tag. The component itself doesn't render anything where it's located (just an
// empty invisible DIV), so it means it could be put anywhere and would have the
// same effect.
//
// It's still reliable because the lifecyle of adding the CSS and removing on
// unmount is handled properly. There should only be one such component on the
// page.
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
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const themeToCss_1 = __importDefault(require("@joplin/lib/services/style/themeToCss"));
const theme_1 = require("@joplin/lib/theme");
const useDocument_1 = __importDefault(require("@joplin/lib/hooks/dom/useDocument"));
const react_redux_1 = require("react-redux");
const editorFontFromSettings = (settingValue) => {
    const fontFamilies = [];
    if (settingValue)
        fontFamilies.push(`"${settingValue}"`);
    fontFamilies.push('\'Avenir Next\', Avenir, Arial, sans-serif');
    return fontFamilies;
};
const useThemeCss = (themeId) => {
    const [themeCss, setThemeCss] = (0, react_1.useState)('');
    (0, useAsyncEffect_1.default)(async (event) => {
        const theme = (0, theme_1.themeStyle)(themeId);
        const themeCss = (0, themeToCss_1.default)(theme);
        if (event.cancelled)
            return;
        setThemeCss(themeCss);
    }, [themeId]);
    return themeCss;
};
const useEditorCss = (editorFontSetting) => {
    return (0, react_1.useMemo)(() => {
        const fontFamilies = editorFontFromSettings(editorFontSetting);
        return `
			/* The '*' and '!important' parts are necessary to make sure Russian text is displayed properly
			   https://github.com/laurent22/joplin/issues/155
			
			   Note: Be careful about the specificity here. Incorrect specificity can break monospaced fonts in tables. */
			.CodeMirror5 *, .cm-editor .cm-content { font-family: ${fontFamilies.join(', ')} !important; }
		`;
    }, [editorFontSetting]);
};
const useLinkedCss = (doc, cssPaths) => {
    (0, react_1.useEffect)(() => {
        if (!doc)
            return () => { };
        const elements = [];
        for (const path of cssPaths) {
            const element = doc.createElement('link');
            element.rel = 'stylesheet';
            element.href = path;
            element.classList.add('dynamic-linked-stylesheet');
            doc.head.appendChild(element);
            elements.push(element);
        }
        return () => {
            for (const element of elements) {
                element.remove();
            }
        };
    }, [doc, cssPaths]);
};
const useAppliedCss = (doc, css) => {
    (0, react_1.useEffect)(() => {
        if (!doc)
            return () => { };
        const element = doc.createElement('style');
        element.setAttribute('id', 'main-theme-stylesheet-container');
        doc.head.appendChild(element);
        element.appendChild(document.createTextNode(css));
        return () => {
            doc.head.removeChild(element);
        };
    }, [css, doc]);
};
const StyleSheetContainer = props => {
    const [elementRef, setElementRef] = (0, react_1.useState)(null);
    const doc = (0, useDocument_1.default)(elementRef);
    const themeCss = useThemeCss(props.themeId);
    const editorCss = useEditorCss(props.editorFontSetting);
    useAppliedCss(doc, `
		/* Theme CSS */
		${themeCss}

		/* Base scrollbar size */
		:root {
			--scrollbar-size: ${Number(props.scrollbarSize)}px;
		}

		/* Editor font CSS */
		${editorCss}
	`);
    useLinkedCss(doc, props.customChromeCssPaths);
    return React.createElement("div", { ref: setElementRef, style: { display: 'none' } });
};
exports.default = (0, react_redux_1.connect)((state) => {
    return {
        themeId: state.settings.theme,
        editorFontSetting: state.settings['style.editor.fontFamily'],
        scrollbarSize: state.settings['style.scrollbarSize'],
        customChromeCssPaths: state.customChromeCssPaths,
    };
})(StyleSheetContainer);
//# sourceMappingURL=StyleSheetContainer.js.map