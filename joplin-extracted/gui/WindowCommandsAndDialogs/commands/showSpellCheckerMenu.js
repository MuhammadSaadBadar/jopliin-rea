"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const SpellCheckerService_1 = __importDefault(require("@joplin/lib/services/spellChecker/SpellCheckerService"));
const Menu = (0, bridge_1.default)().Menu;
exports.declaration = {
    name: 'showSpellCheckerMenu',
    label: () => (0, locale_1._)('Spell checker'),
    iconName: 'fas fa-globe',
};
const runtime = () => {
    return {
        execute: async (context, selectedLanguages = null, useSpellChecker = null) => {
            selectedLanguages = selectedLanguages === null ? context.state.settings['spellChecker.languages'] : selectedLanguages;
            useSpellChecker = useSpellChecker === null ? context.state.settings['spellChecker.enabled'] : useSpellChecker;
            const menuItems = SpellCheckerService_1.default.instance().spellCheckerConfigMenuItems(selectedLanguages, useSpellChecker);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- spellCheckerConfigMenuItems returns a heterogeneous menu shape (lib package) that doesn't satisfy Electron's MenuItemConstructorOptions structurally
            const menu = Menu.buildFromTemplate(menuItems);
            menu.popup({ window: (0, bridge_1.default)().activeWindow() });
        },
        mapStateToTitle(state) {
            if (!state.settings['spellChecker.enabled'])
                return null;
            const languages = state.settings['spellChecker.languages'];
            if (languages.length === 0)
                return null;
            const s = [];
            // eslint-disable-next-line github/array-foreach -- Old code before rule was applied
            languages.forEach((language) => {
                const onlyLanguage = language.split('-')[0];
                if (!s.includes(onlyLanguage)) {
                    s.push(onlyLanguage);
                }
            });
            return s.join(', ');
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showSpellCheckerMenu.js.map