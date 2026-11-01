"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptDialog_1 = __importDefault(require("./PromptDialog"));
describe('PromptDialog', () => {
    const setupKeyHandler = (inputType, menuIsOpened) => {
        const onCloseMock = jest.fn();
        const instance = new PromptDialog_1.default({
            themeId: 1,
            defaultValue: '',
            visible: true,
            buttons: ['ok', 'cancel'],
            onClose: onCloseMock,
            inputType,
            description: '',
            autocomplete: [],
            label: 'Test',
            answer: null,
        });
        instance.state = { visible: true, answer: 'some-answer' };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Accessing private property for test setup
        instance.menuIsOpened_ = menuIsOpened;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Navigating React element tree for handler extraction
        const rendered = instance.render();
        const dialogChildren = rendered.props.children;
        const inputWrapper = dialogChildren[1];
        const wrapperChildren = inputWrapper.props.children;
        const inputComp = Array.isArray(wrapperChildren)
            ? wrapperChildren[0]
            : wrapperChildren;
        return { onKeyDown: inputComp.props.onKeyDown, onCloseMock };
    };
    test('closes dialog for text input', () => {
        const { onKeyDown, onCloseMock } = setupKeyHandler('text', false);
        onKeyDown({ key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalledWith(null, 'cancel');
    });
    test('closes dialog for dropdown when menu is closed', () => {
        const { onKeyDown, onCloseMock } = setupKeyHandler('dropdown', false);
        onKeyDown({ key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalledWith(null, 'cancel');
    });
    test('does not close dialog when react-select menu is open', () => {
        const { onKeyDown, onCloseMock } = setupKeyHandler('dropdown', true);
        onKeyDown({ key: 'Escape' });
        expect(onCloseMock).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=PromptDialog.test.js.map