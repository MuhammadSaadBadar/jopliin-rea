"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = styles;
const ToggleEditorsButton_1 = require("../ToggleEditorsButton");
const theme_1 = require("@joplin/lib/theme");
function styles(props) {
    return (0, theme_1.buildStyle)(['ToggleEditorsButton', props.value], props.themeId, theme => {
        const iconSize = 15;
        const mdIconWidth = iconSize * 1.25;
        const buttonHeight = theme.toolbarHeight - 7;
        const mdIconPadding = Math.round((buttonHeight - iconSize) / 2) + 3;
        const innerButton = {
            borderStyle: 'solid',
            borderColor: theme.color3,
            borderWidth: 1,
            borderRadius: 0,
            width: mdIconWidth + mdIconPadding * 2,
            height: buttonHeight,
            display: 'flex',
            justifyContent: 'center',
        };
        const output = {
            button: {
                border: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                background: 'none',
            },
            leftInnerButton: Object.assign(Object.assign({}, innerButton), { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }),
            rightInnerButton: Object.assign(Object.assign({}, innerButton), { borderTopRightRadius: 4, borderBottomRightRadius: 4 }),
            leftIcon: {
                fontSize: iconSize,
                position: 'relative',
                top: 1,
                color: theme.color3,
            },
            rightIcon: {
                fontSize: iconSize - 1,
                borderLeft: 'none',
                position: 'relative',
                top: 1,
                color: theme.color3,
            },
        };
        if (props.value === ToggleEditorsButton_1.Value.Markdown) {
            output.leftInnerButton.backgroundColor = theme.color3;
            output.leftIcon.color = theme.backgroundColor3;
            output.rightInnerButton.opacity = 0.5;
        }
        else if (props.value === ToggleEditorsButton_1.Value.RichText) {
            output.rightInnerButton.backgroundColor = theme.color3;
            output.rightIcon.color = theme.backgroundColor3;
            output.leftInnerButton.opacity = 0.5;
        }
        return output;
    });
}
//# sourceMappingURL=index.js.map