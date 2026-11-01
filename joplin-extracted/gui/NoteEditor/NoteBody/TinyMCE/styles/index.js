"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = styles;
const type_1 = require("@joplin/lib/themes/type");
const theme_1 = require("@joplin/lib/theme");
function styles(props) {
    const leftExtraToolbarContainerWidth = props.watchedNoteFiles.length > 0 ? 120 : 80;
    return (0, theme_1.buildStyle)(['TinyMCE', props.style.width, props.style.height, leftExtraToolbarContainerWidth], props.themeId, theme => {
        const extraToolbarContainer = {
            boxSizing: 'content-box',
            backgroundColor: theme.backgroundColor3,
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            height: theme.toolbarHeight,
            zIndex: 2,
            top: 0,
            padding: theme.toolbarPadding,
        };
        return {
            disabledOverlay: {
                zIndex: 10,
                position: 'absolute',
                backgroundColor: theme.backgroundColor,
                opacity: theme.appearance === type_1.ThemeAppearance.Light ? 0.7 : 0.9,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20,
                paddingTop: 50,
                textAlign: 'center',
                width: '100%',
            },
            rootStyle: {
                position: 'relative',
                width: props.style.width,
                height: props.style.height,
            },
            leftExtraToolbarContainer: Object.assign(Object.assign({}, extraToolbarContainer), { width: leftExtraToolbarContainerWidth, left: 0 }),
            rightExtraToolbarContainer: Object.assign(Object.assign({}, extraToolbarContainer), { alignItems: 'center', justifyContent: 'flex-end', width: 70, right: 0, paddingRight: theme.mainPadding }),
            extraToolbarButton: {
                display: 'flex',
                border: 'none',
                background: 'none',
            },
            extraToolbarButtonIcon: {
                fontSize: theme.toolbarIconSize,
                color: theme.color3,
            },
        };
    });
}
//# sourceMappingURL=index.js.map