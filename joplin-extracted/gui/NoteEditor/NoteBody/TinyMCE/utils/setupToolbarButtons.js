"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const locale_1 = require("@joplin/lib/locale");
function buttonDefinitions() {
    return [
        {
            name: 'joplinHighlight',
            tooltip: (0, locale_1._)('Highlight'),
            icon: 'highlight-bg-color',
        },
        {
            name: 'joplinStrikethrough',
            tooltip: (0, locale_1._)('Strikethrough'),
            icon: 'strike-through',
        },
        {
            name: 'joplinInsert',
            tooltip: (0, locale_1._)('Insert'),
            icon: 'underline',
            grouped: true,
        },
        {
            name: 'joplinSup',
            tooltip: (0, locale_1._)('Superscript'),
            icon: 'superscript',
            grouped: true,
        },
        {
            name: 'joplinSub',
            tooltip: (0, locale_1._)('Subscript'),
            icon: 'subscript',
            grouped: true,
        },
    ];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TinyMCE editor is dynamically loaded; published types don't cover the editor.ui.registry / formatter shape we use
function default_1(editor) {
    const definitions = buttonDefinitions();
    for (const def of definitions) {
        editor.ui.registry.addToggleButton(def.name, {
            tooltip: def.tooltip,
            icon: def.icon,
            onAction: async function () {
                editor.execCommand('mceToggleFormat', false, def.name);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TinyMCE ToggleButton onSetup api type not in published types
            onSetup: function (api) {
                editor.formatter.formatChanged(def.name, (state) => {
                    api.setActive(state);
                });
            },
        });
    }
    // Old code to format a group of buttons into a dropdown
    // const items: string[] = definitions.filter(d => !!d.grouped).map(d => d.name);
    // items.push('forecolor');
    // editor.ui.registry.addGroupToolbarButton('formattingExtras', {
    // 	icon: 'image-options',
    // 	tooltip: _('Formatting'),
    // 	items: items.join(' '),
    // });
}
//# sourceMappingURL=setupToolbarButtons.js.map