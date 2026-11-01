"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theme_1 = require("@joplin/lib/theme");
const react_1 = require("react");
const useStyles = (props) => {
    return (0, react_1.useMemo)(() => {
        return (0, theme_1.buildStyle)([
            'CodeMirror', props.fontSize, props.contentMaxWidth,
        ], props.themeId, (theme) => {
            return {
                root: Object.assign({ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0 }, props.style),
                rowToolbar: {
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                },
                viewer: {
                    display: 'flex',
                    overflow: 'hidden',
                    verticalAlign: 'top',
                    boxSizing: 'border-box',
                    width: '100%',
                },
                editor: {
                    display: 'flex',
                    width: 'auto',
                    height: 'auto',
                    flex: 1,
                    overflowY: 'hidden',
                    paddingTop: 0,
                    lineHeight: `${Math.round(17 * props.fontSize / 12)}px`,
                    fontSize: `${props.fontSize}px`,
                    color: theme.color,
                    backgroundColor: theme.backgroundColor,
                    // CM5 only
                    codeMirrorTheme: theme.codeMirrorTheme, // Defined in theme.js
                },
                // CM6 only
                globalTheme: Object.assign(Object.assign({}, theme), { contentMaxWidth: props.contentMaxWidth ? `${props.contentMaxWidth}px` : undefined, fontFamily: 'inherit', fontSize: props.fontSize, fontSizeUnits: 'px', isDesktop: true }),
            };
        });
    }, [props.style, props.themeId, props.fontSize, props.contentMaxWidth]);
};
exports.default = useStyles;
//# sourceMappingURL=useStyles.js.map