"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = styles;
const theme_1 = require("@joplin/lib/theme");
function styles(themeId) {
    return (0, theme_1.buildStyle)('KeymapConfigScreen', themeId, (theme) => {
        return {
            container: Object.assign(Object.assign({}, theme.containerStyle), { 
                // padding: theme.configScreenPadding,
                backgroundColor: theme.backgroundColor3 }),
            actionsContainer: {
                display: 'flex',
                flexDirection: 'row',
            },
            filterInput: Object.assign(Object.assign({}, theme.inputStyle), { flexGrow: 1, minHeight: 29, alignSelf: 'center' }),
            label: Object.assign(Object.assign({}, theme.textStyle), { alignSelf: 'center', marginRight: 10 }),
            table: Object.assign(Object.assign({}, theme.containerStyle), { marginTop: 16, overflow: 'auto', width: '100%' }),
            tableShortcutColumn: Object.assign(Object.assign({}, theme.textStyle), { width: '60%' }),
            tableCommandColumn: Object.assign(Object.assign({}, theme.textStyle), { width: 'auto' }),
            tableCellContent: {
                flexGrow: 1,
                alignSelf: 'center',
            },
            tableCellStatus: {
                height: '100%',
                alignSelf: 'center',
                border: 'none',
                background: 'transparent',
            },
            kbd: {
                fontFamily: 'sans-serif',
                border: '1px solid',
                borderRadius: 4,
                backgroundColor: theme.raisedBackgroundColor,
                padding: 2,
                paddingLeft: 6,
                paddingRight: 6,
            },
            disabled: {
                color: theme.colorFaded,
                fontStyle: 'italic',
            },
            inlineButton: Object.assign(Object.assign({}, theme.buttonStyle), { marginLeft: 12 }),
            warning: Object.assign(Object.assign({}, theme.textStyle), { backgroundColor: theme.warningBackgroundColor, paddingLeft: 16, paddingRight: 16, paddingTop: 2, paddingBottom: 2 }),
        };
    });
}
//# sourceMappingURL=index.js.map