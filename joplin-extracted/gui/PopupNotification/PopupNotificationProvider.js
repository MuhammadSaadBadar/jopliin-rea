"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibleNotificationsContext = exports.PopupNotificationContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const types_1 = require("./types");
const time_1 = require("@joplin/utils/time");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
exports.PopupNotificationContext = (0, react_1.createContext)(null);
exports.VisibleNotificationsContext = (0, react_1.createContext)([]);
const PopupNotificationProvider = props => {
    const [popupSpecs, setPopupSpecs] = (0, react_1.useState)([]);
    const nextPopupKey = (0, react_1.useRef)(0);
    const popupManager = (0, react_1.useMemo)(() => {
        const removeOldPopups = () => {
            // The WCAG allows dismissing notifications older than 20 hours.
            setPopupSpecs(popups => popups.filter(popup => {
                if (!popup.dismissed) {
                    return true;
                }
                const dismissedRecently = popup.dismissAt > performance.now() - time_1.Hour * 20;
                return dismissedRecently;
            }));
        };
        const removePopupWithKey = (key) => {
            setPopupSpecs(popups => popups.filter(p => p.key !== key));
        };
        const updatePopupWithKey = (key, updateCallback) => {
            setPopupSpecs(popups => popups.map(p => {
                if (p.key === key) {
                    return updateCallback(p);
                }
                else {
                    return p;
                }
            }));
        };
        const dismissAnimationDelay = 600;
        const dismissPopup = async (key) => {
            // Start the dismiss animation
            updatePopupWithKey(key, popup => (Object.assign(Object.assign({}, popup), { dismissAt: performance.now() + dismissAnimationDelay })));
            await (0, time_1.msleep)(dismissAnimationDelay);
            updatePopupWithKey(key, popup => (Object.assign(Object.assign({}, popup), { dismissed: true })));
            removeOldPopups();
        };
        const dismissAndRemovePopup = async (key) => {
            await dismissPopup(key);
            removePopupWithKey(key);
        };
        const manager = {
            createPopup: (content, { type } = {}) => {
                const key = `popup-${nextPopupKey.current++}`;
                const newPopup = {
                    key,
                    content,
                    type,
                    dismissed: false,
                };
                setPopupSpecs(popups => {
                    const newPopups = [...popups];
                    // Replace the existing popup, if it exists
                    const insertIndex = newPopups.findIndex(p => p.key === key);
                    if (insertIndex === -1) {
                        newPopups.push(newPopup);
                    }
                    else {
                        newPopups.splice(insertIndex, 1, newPopup);
                    }
                    return newPopups;
                });
                const handle = {
                    remove() {
                        void dismissAndRemovePopup(key);
                    },
                    scheduleDismiss(delay = 5500) {
                        setTimeout(() => {
                            void dismissPopup(key);
                        }, delay);
                    },
                };
                return handle;
            },
        };
        return manager;
    }, []);
    (0, react_1.useEffect)(() => {
        const defaultShowToast = shim_1.default.showToast;
        shim_1.default.showToast = async (message, options) => {
            var _a;
            const popup = popupManager.createPopup(() => message, { type: (_a = options === null || options === void 0 ? void 0 : options.type) !== null && _a !== void 0 ? _a : types_1.NotificationType.Info });
            popup.scheduleDismiss();
        };
        return () => {
            shim_1.default.showToast = defaultShowToast;
        };
    }, [popupManager]);
    return React.createElement(exports.PopupNotificationContext.Provider, { value: popupManager },
        React.createElement(exports.VisibleNotificationsContext.Provider, { value: popupSpecs }, props.children));
};
exports.default = PopupNotificationProvider;
//# sourceMappingURL=PopupNotificationProvider.js.map