"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconSelector = void 0;
const react_1 = require("react");
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const loadScript_1 = require("../utils/loadScript");
const Button_1 = __importDefault(require("../Button/Button"));
const types_1 = require("@joplin/lib/services/database/types");
const bridge_1 = __importDefault(require("../../services/bridge"));
const theme_1 = require("@joplin/lib/theme");
const IconSelector = (props) => {
    const [emojiButtonClassReady, setEmojiButtonClassReady] = (0, react_1.useState)(false);
    const [picker, setPicker] = (0, react_1.useState)();
    const buttonRef = (0, react_1.useRef)(null);
    const pickerTheme = (0, react_1.useMemo)(() => {
        return (0, theme_1.themeStyle)(props.themeId).appearance;
    }, [props.themeId]);
    (0, useAsyncEffect_1.default)(async (event) => {
        const loadScripts = async () => {
            // The emoji-button lib is annoying to load as it only comes as an
            // ES module. So we first need to load the lib, then load a loader
            // script, which will copy the class to the window object.
            await (0, loadScript_1.loadScript)({
                id: 'emoji-button-lib',
                src: `${(0, bridge_1.default)().vendorDir()}/lib/@joeattardi/emoji-button/dist/index.js`,
                attrs: {
                    type: 'module',
                },
            }, document);
            if (event.cancelled)
                return;
            await (0, loadScript_1.loadScript)({
                id: 'emoji-button-lib-loader',
                src: `${(0, bridge_1.default)().vendorDir()}/loadEmojiLib.js`,
                attrs: {
                    type: 'module',
                },
            }, document);
            if (event.cancelled)
                return;
            setEmojiButtonClassReady(true);
        };
        void loadScripts();
    }, []);
    (0, react_1.useEffect)(() => {
        var _a;
        if (!emojiButtonClassReady)
            return () => { };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- emoji-button library is loaded dynamically and attaches to window without published types
        const p = new window.EmojiButton({
            zIndex: 10000,
            rootElement: (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.parentElement,
            theme: pickerTheme,
        });
        const onEmoji = (selection) => {
            props.onChange({ value: Object.assign(Object.assign({}, selection), { type: types_1.FolderIconType.Emoji }) });
        };
        p.on('emoji', onEmoji);
        setPicker(p);
        return () => {
            p.off('emoji', onEmoji);
            p.destroyPicker();
        };
    }, [emojiButtonClassReady, props.onChange, pickerTheme]);
    const onClick = (0, react_1.useCallback)(() => {
        picker.togglePicker(buttonRef.current);
    }, [picker]);
    // const buttonText = props.icon ? props.icon.emoji : '...';
    return (React.createElement(Button_1.default, { disabled: !picker, ref: buttonRef, onClick: onClick, title: props.title }));
    // return (
    // 	<Button
    // 		disabled={!picker}
    // 		ref={buttonRef}
    // 		onClick={onClick}
    // 		title={buttonText}
    // 		isSquare={true}
    // 		fontSize={20}
    // 	/>
    // );
};
exports.IconSelector = IconSelector;
//# sourceMappingURL=IconSelector.js.map