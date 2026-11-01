"use strict";
// Provides spell checking feature via the native Electron built-in spell checker
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpellCheckerServiceDriverBase_1 = __importDefault(require("@joplin/lib/services/spellChecker/SpellCheckerServiceDriverBase"));
const bridge_1 = __importDefault(require("../bridge"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const locale_1 = require("@joplin/lib/locale");
const logger = Logger_1.default.create('SpellCheckerServiceDriverNative');
class SpellCheckerServiceDriverNative extends SpellCheckerServiceDriverBase_1.default {
    session() {
        return (0, bridge_1.default)().mainWindow().webContents.session;
    }
    initialize() {
        // Workaround: With Electron 42 on Linux, it's necessary to initialize the spellchecker with an empty set of
        // languages. Without this, the spellchecker ignores the default provided languages.
        this.setLanguages([]);
    }
    get availableLanguages() {
        return this.session().availableSpellCheckerLanguages;
    }
    // Language can be set to [] to disable spell-checking
    setLanguages(v) {
        // Note that in order to validate the language we need ot set it on the
        // session and check if Electron has thrown an exception or not. This is
        // fine because the actual languages will be set below after the calls
        // to this functions.
        const validateLanguage = (v) => {
            const languagesToTry = [
                v,
                (0, locale_1.languageCodeOnly)(v),
            ].concat((0, locale_1.localesFromLanguageCode)((0, locale_1.languageCodeOnly)(v), this.availableLanguages));
            for (const toTry of languagesToTry) {
                try {
                    this.session().setSpellCheckerLanguages([toTry]);
                    return toTry;
                }
                catch (error) {
                    logger.warn(`Failed to set language to "${toTry}". Will try the next one in this list: ${JSON.stringify(languagesToTry)}`);
                    logger.warn('Error was:', error);
                }
            }
            return null;
        };
        const effectiveLanguages = [];
        for (const language of v) {
            const effectiveLanguage = validateLanguage(language);
            if (effectiveLanguage)
                effectiveLanguages.push(effectiveLanguage);
        }
        // If we pass an empty array, it disables spell checking
        // https://github.com/electron/electron/issues/25228
        this.session().setSpellCheckerLanguages(effectiveLanguages);
        this.session().setSpellCheckerEnabled(effectiveLanguages.length > 0);
        logger.info(`Set effective languages to "${effectiveLanguages}"`);
    }
    get language() {
        const languages = this.session().getSpellCheckerLanguages();
        return languages.length ? languages[0] : '';
    }
    addWordToSpellCheckerDictionary(_language, word) {
        // Actually on Electron all languages share the same dictionary, or
        // perhaps it's added to the currently active language.
        this.session().addWordToSpellCheckerDictionary(word);
    }
}
exports.default = SpellCheckerServiceDriverNative;
//# sourceMappingURL=SpellCheckerServiceDriverNative.js.map