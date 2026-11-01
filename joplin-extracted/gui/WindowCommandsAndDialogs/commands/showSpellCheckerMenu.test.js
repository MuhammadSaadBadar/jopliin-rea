"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const showSpellCheckerMenu_1 = require("./showSpellCheckerMenu");
jest.mock('../../../services/bridge', () => ({
    __esModule: true,
    default: () => ({
        Menu: {
            buildFromTemplate: jest.fn().mockReturnValue({
                popup: jest.fn(),
            }),
        },
    }),
}));
describe('showSpellCheckerMenu', () => {
    test('should return null if spellchecker.enabled is false', () => {
        const mockState = {
            settings: {
                'spellChecker.enabled': false,
                'spellChecker.languages': ['en-GB'],
            },
        };
        const result = (0, showSpellCheckerMenu_1.runtime)().mapStateToTitle(mockState);
        expect(result).toBeNull();
    });
    test('should return null if spellChecker.languages is empty', () => {
        const mockState = {
            settings: {
                'spellChecker.enabled': true,
                'spellChecker.languages': [],
            },
        };
        const result = (0, showSpellCheckerMenu_1.runtime)().mapStateToTitle(mockState);
        expect(result).toBeNull();
    });
    test('should return list of countryDisplayName with correct format', () => {
        const mockState = {
            settings: {
                'spellChecker.enabled': true,
                'spellChecker.languages': ['en-GB', 'en-US', 'en-CA', 'es-ES', 'es-MX'],
            },
        };
        const result = (0, showSpellCheckerMenu_1.runtime)().mapStateToTitle(mockState);
        expect(result).toBe('en, es');
    });
});
//# sourceMappingURL=showSpellCheckerMenu.test.js.map