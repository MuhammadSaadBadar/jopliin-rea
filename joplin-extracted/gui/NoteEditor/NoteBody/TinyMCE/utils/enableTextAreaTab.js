"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const taboverride = require('taboverride');
const createTextAreaKeyListeners = () => {
    let hasListeners = true;
    // Selectively enable/disable taboverride based on settings -- remove taboverride
    // when pressing tab if tab is expected to move focus.
    const onKeyDown = (event) => {
        if (event.key === 'Tab') {
            if (Setting_1.default.value('editor.tabMovesFocus')) {
                taboverride.utils.removeListeners(event.currentTarget);
                hasListeners = false;
            }
            else {
                // Prevent the default focus-changing behavior
                event.preventDefault();
                requestAnimationFrame(() => {
                    (0, focusHandler_1.focus)('openEditDialog::dialogTextArea_keyDown', event.target);
                });
            }
        }
    };
    const onKeyUp = (event) => {
        if (event.key === 'Tab' && !hasListeners) {
            taboverride.utils.addListeners(event.currentTarget);
            hasListeners = true;
        }
    };
    return { onKeyDown, onKeyUp };
};
// Allows pressing tab in a textarea to input an actual tab (instead of changing focus)
// taboverride will take care of actually inserting the tab character, while the keydown
// event listener will override the default behaviour, which is to focus the next field.
const enableTextAreaTab = (textAreas) => {
    const removeCallbacks = [];
    for (const textArea of textAreas) {
        const { onKeyDown, onKeyUp } = createTextAreaKeyListeners();
        textArea.addEventListener('keydown', onKeyDown);
        textArea.addEventListener('keyup', onKeyUp);
        // Enable/disable taboverride **after** the listeners above.
        // The custom keyup/keydown need to have higher precedence.
        taboverride.set(textArea, true);
        removeCallbacks.push(() => {
            taboverride.set(textArea, false);
            textArea.removeEventListener('keyup', onKeyUp);
            textArea.removeEventListener('keydown', onKeyDown);
        });
    }
    return {
        remove: () => {
            for (const callback of removeCallbacks) {
                callback();
            }
        },
    };
};
exports.default = enableTextAreaTab;
//# sourceMappingURL=enableTextAreaTab.js.map