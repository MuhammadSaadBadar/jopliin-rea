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
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const bridge_1 = __importDefault(require("../services/bridge"));
const react_1 = require("react");
const NewWindowOrIFrame_1 = require("./NewWindowOrIFrame");
const useWindowTitleManager = (screenInfo) => {
    const windowTitle = (0, react_1.useMemo)(() => {
        const devMarker = Setting_1.default.value('env') === 'dev' ? ` (DEV - ${Setting_1.default.value('profileDir')})` : '';
        const windowTitle = [`Joplin${devMarker}`];
        if (screenInfo === null || screenInfo === void 0 ? void 0 : screenInfo.title) {
            windowTitle.push(screenInfo.title());
        }
        return windowTitle.join(' - ');
    }, [screenInfo]);
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    (0, react_1.useEffect)(() => {
        var _a;
        (_a = (0, bridge_1.default)().windowById(windowId)) === null || _a === void 0 ? void 0 : _a.setTitle(windowTitle);
    }, [windowTitle, windowId]);
};
const useWindowRefocusManager = (route) => {
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    const prevRouteName = (0, react_1.useRef)(null);
    const routeName = route === null || route === void 0 ? void 0 : route.routeName;
    (0, react_1.useEffect)(() => {
        // When a navigation happens in an unfocused window, show the window to the user.
        // This might happen if, for example, a secondary window triggers a navigation in
        // the main window.
        if (routeName && routeName !== prevRouteName.current) {
            (0, bridge_1.default)().switchToWindow(windowId);
        }
        prevRouteName.current = routeName;
    }, [routeName, windowId]);
};
const useContainerSize = (container) => {
    var _a, _b;
    const [size, setSize] = (0, react_1.useState)({
        // Show the container as soon as possible: Default to the window size,
        // which is usually correct:
        width: (_a = container === null || container === void 0 ? void 0 : container.clientWidth) !== null && _a !== void 0 ? _a : window.innerWidth,
        height: (_b = container === null || container === void 0 ? void 0 : container.clientHeight) !== null && _b !== void 0 ? _b : window.innerHeight,
    });
    const currentSizeRef = (0, react_1.useRef)(size);
    currentSizeRef.current = size;
    (0, react_1.useEffect)(() => {
        if (!container)
            return () => { };
        const updateSizeIfDifferent = () => {
            const { width: lastWidth, height: lastHeight } = currentSizeRef.current;
            if (lastWidth !== container.clientWidth || lastHeight !== container.clientHeight) {
                setSize({
                    width: container.clientWidth,
                    height: container.clientHeight,
                });
            }
        };
        // Ensure that the initial size is set, even if the ResizeObserver doesn't run the callback initially
        updateSizeIfDifferent();
        const observer = new ResizeObserver(updateSizeIfDifferent);
        observer.observe(container);
        return () => {
            observer.disconnect();
        };
    }, [container]);
    return size;
};
const NavigatorComponent = props => {
    const route = props.route;
    const screenInfo = props.screens[route === null || route === void 0 ? void 0 : route.routeName];
    const [container, setContainer] = (0, react_1.useState)(null);
    useWindowTitleManager(screenInfo);
    useWindowRefocusManager(route);
    const size = useContainerSize(container);
    if (!route)
        throw new Error('Route must not be null');
    const screenProps = route.props ? route.props : {};
    const Screen = screenInfo.screen;
    return (React.createElement("div", { ref: setContainer, style: props.style, className: props.className },
        React.createElement(Screen, Object.assign({ style: size }, screenProps))));
};
const Navigator = (0, react_redux_1.connect)((state) => {
    return {
        route: state.route,
    };
})(NavigatorComponent);
exports.default = Navigator;
//# sourceMappingURL=Navigator.js.map