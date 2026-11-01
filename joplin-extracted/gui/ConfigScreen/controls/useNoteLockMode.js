"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionMode = void 0;
const react_1 = require("react");
var ActionMode;
(function (ActionMode) {
    ActionMode["Collapsed"] = "collapsed";
    ActionMode["Create"] = "create";
    ActionMode["Change"] = "change";
    ActionMode["Reset"] = "reset";
})(ActionMode || (exports.ActionMode = ActionMode = {}));
const useNoteLockMode = (hasKey) => {
    const [mode, setMode] = (0, react_1.useState)(hasKey ? ActionMode.Collapsed : ActionMode.Create);
    const [currentPassword, setCurrentPassword] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [passwordRepeat, setPasswordRepeat] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const clearForm = (0, react_1.useCallback)(() => {
        setCurrentPassword('');
        setPassword('');
        setPasswordRepeat('');
        setError('');
    }, []);
    const onModeChange = (0, react_1.useCallback)((newMode) => {
        setMode(newMode);
        clearForm();
    }, [clearForm]);
    // The key can also appear or disappear through sync while this screen is open;
    // clear any drafted input along with the mode switch.
    (0, react_1.useEffect)(() => {
        if (hasKey && mode === ActionMode.Create)
            onModeChange(ActionMode.Collapsed);
        if (!hasKey && mode !== ActionMode.Create)
            onModeChange(ActionMode.Create);
    }, [hasKey, mode, onModeChange]);
    return {
        mode,
        onModeChange,
        currentPassword,
        setCurrentPassword,
        password,
        setPassword,
        passwordRepeat,
        setPasswordRepeat,
        error,
        setError,
    };
};
exports.default = useNoteLockMode;
//# sourceMappingURL=useNoteLockMode.js.map