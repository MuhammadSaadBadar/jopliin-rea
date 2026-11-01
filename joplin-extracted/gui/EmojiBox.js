"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const fontSizeCache_ = {};
exports.default = (props) => {
    const containerRef = (0, react_1.useRef)(null);
    const [containerReady, setContainerReady] = (0, react_1.useState)(false);
    const refCallback = (0, react_1.useCallback)((el) => {
        if (el && !containerRef.current) {
            containerRef.current = el;
            requestAnimationFrame(() => {
                setContainerReady(true);
            });
        }
    }, []);
    const fontSize = (0, react_1.useMemo)(() => {
        if (!containerReady || !containerRef.current) {
            return Math.min(props.height * 0.7, 14);
        }
        const cacheKey = [props.width, props.height, props.emoji].join('-');
        if (fontSizeCache_[cacheKey]) {
            return fontSizeCache_[cacheKey];
        }
        let spanFontSize = props.height;
        const span = document.createElement('span');
        span.innerText = props.emoji;
        span.style.fontSize = `${spanFontSize}px`;
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'nowrap';
        containerRef.current.appendChild(span);
        let rect = span.getBoundingClientRect();
        while ((rect.height > props.height || rect.width > props.width) && spanFontSize > 1) {
            spanFontSize -= 0.5;
            span.style.fontSize = `${spanFontSize}px`;
            rect = span.getBoundingClientRect();
        }
        span.remove();
        fontSizeCache_[cacheKey] = spanFontSize;
        return spanFontSize;
    }, [props.width, props.height, props.emoji, containerReady]);
    return React.createElement("div", { ref: refCallback, style: {
            width: props.width,
            height: props.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontSize,
        } }, props.emoji);
};
//# sourceMappingURL=EmojiBox.js.map