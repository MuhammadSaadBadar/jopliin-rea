"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const announceForAccessibility_1 = __importDefault(require("../../utils/announceForAccessibility"));
const useWindowControl = (setDialogState, onPrint, windowDomRef) => {
    // Use refs to avoid reloading the output where possible -- reloading the window control
    // may mean reloading all main window commands.
    const onPrintRef = (0, react_1.useRef)(onPrint);
    onPrintRef.current = onPrint;
    return (0, react_1.useMemo)(() => {
        const control = {
            setState: (newPartialState) => {
                setDialogState(oldState => (Object.assign(Object.assign({}, oldState), newPartialState)));
            },
            printTo: (target, options) => onPrintRef.current(target, options),
            announcePanelVisibility: (panelName, visible) => {
                (0, announceForAccessibility_1.default)(visible ? (0, locale_1._)('Panel "%s" is visible', panelName) : (0, locale_1._)('Panel %s is hidden', panelName));
            },
            showPrompt: (options) => {
                return new Promise((resolve) => {
                    control.setState({
                        promptOptions: {
                            label: options.label,
                            inputType: 'dropdown',
                            value: options.value,
                            autocomplete: options.suggestions,
                            onClose: async (answer) => {
                                if (answer) {
                                    resolve(answer.value);
                                }
                                else {
                                    resolve(null);
                                }
                                control.setState({ promptOptions: null });
                            },
                        },
                    });
                });
            },
            getFocusedDocument: () => {
                return windowDomRef.current;
            },
        };
        return control;
    }, [setDialogState, windowDomRef]);
};
exports.default = useWindowControl;
//# sourceMappingURL=useWindowControl.js.map