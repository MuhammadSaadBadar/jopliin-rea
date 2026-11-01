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
const react_1 = require("react");
const StyleSheetContainer_1 = __importDefault(require("../StyleSheets/StyleSheetContainer"));
const react_redux_1 = require("react-redux");
const NewWindowOrIFrame_1 = __importStar(require("../NewWindowOrIFrame"));
const WindowCommandsAndDialogs_1 = __importDefault(require("../WindowCommandsAndDialogs/WindowCommandsAndDialogs"));
const styled_components_1 = require("styled-components");
// Note: Transitive dependencies used only by react-select. Remove if react-select is removed.
const cache_1 = __importDefault(require("@emotion/cache"));
const react_2 = require("@emotion/react");
const reducer_1 = require("@joplin/lib/reducer");
const ResizableLayout_1 = __importDefault(require("../ResizableLayout/ResizableLayout"));
const layoutKeyToLabel_1 = __importDefault(require("../../utils/layout/layoutKeyToLabel"));
const MainLayoutPane_1 = __importDefault(require("../MainLayoutPane"));
const emptyCallback = () => { };
const useWindowTitle = (isNewWindow) => {
    const [title, setTitle] = (0, react_1.useState)('Untitled');
    if (!isNewWindow) {
        return {
            windowTitle: 'Editor',
            onNoteTitleChange: emptyCallback,
        };
    }
    return { windowTitle: `Joplin - ${title}`, onNoteTitleChange: setTitle };
};
const defaultLayout = {
    key: 'root',
    isRoot: true,
    width: 500,
    height: 500,
    children: [
        { key: 'editor' },
        { key: 'chatPanel', width: 340, visible: false },
    ],
};
const useLayout = ({ windowId, layout, plugins, dispatch }) => {
    const [window, setWindow] = (0, react_1.useState)(null);
    layout !== null && layout !== void 0 ? layout : (layout = defaultLayout);
    const onUpdateLayout = (0, react_1.useCallback)((newLayout) => {
        dispatch({
            type: 'WINDOW_LAYOUT_SET',
            windowId,
            value: newLayout,
        });
    }, [dispatch, windowId]);
    const onResize = (0, react_1.useCallback)((event) => {
        onUpdateLayout(event.layout);
    }, [onUpdateLayout]);
    const onKeyToLabel = (0, react_1.useCallback)((key) => {
        return (0, layoutKeyToLabel_1.default)(key, plugins);
    }, [plugins]);
    const currentLayoutRef = (0, react_1.useRef)(layout);
    currentLayoutRef.current = layout;
    const onRefreshLayoutSize = (0, react_1.useCallback)((window) => {
        const layout = currentLayoutRef.current;
        if (layout.width !== window.innerWidth || layout.height !== window.innerHeight) {
            const newLayout = Object.assign(Object.assign({}, currentLayoutRef.current), { width: window.innerWidth, height: window.innerHeight });
            onUpdateLayout(newLayout);
        }
    }, [onUpdateLayout]);
    (0, react_1.useEffect)(() => {
        if (!window)
            return () => { };
        const onWindowResize = () => onRefreshLayoutSize(window);
        window.addEventListener('resize', onWindowResize);
        onWindowResize();
        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, [window, onRefreshLayoutSize]);
    return {
        layout,
        onWindow: setWindow,
        onResize,
        onUpdate: onUpdateLayout,
        onKeyToLabel,
    };
};
const SecondaryWindow = props => {
    const { windowTitle, onNoteTitleChange } = useWindowTitle(props.newWindow);
    const newWindow = props.newWindow;
    const onWindowClose = (0, react_1.useCallback)(() => {
        if (newWindow) {
            props.dispatch({ type: 'WINDOW_CLOSE', windowId: props.windowId });
        }
    }, [props.dispatch, props.windowId, newWindow]);
    const layout = useLayout(props);
    const onRenderItem = (0, react_1.useCallback)((key, event) => {
        return React.createElement(MainLayoutPane_1.default, { key: key, contentKey: key, windowId: props.windowId, onNoteTitleChange: onNoteTitleChange, event: event, onUpdateLayout: layout.onUpdate, layout: layout.layout });
    }, [props.windowId, onNoteTitleChange, layout.layout, layout.onUpdate]);
    return React.createElement(NewWindowOrIFrame_1.default, { onWindow: layout.onWindow, mode: newWindow ? NewWindowOrIFrame_1.WindowMode.NewWindow : NewWindowOrIFrame_1.WindowMode.Iframe, windowId: props.windowId, onClose: onWindowClose, title: windowTitle },
        React.createElement("div", { id: 'react-root', className: 'secondary-window-root' },
            React.createElement(LibraryStyleRoot, null,
                React.createElement(WindowCommandsAndDialogs_1.default, { windowId: props.windowId }),
                React.createElement(ResizableLayout_1.default, { layout: layout.layout, onResize: layout.onResize, onMoveButtonClick: () => { }, renderItem: onRenderItem, layoutKeyToLabel: layout.onKeyToLabel, moveMode: false, moveModeMessage: '' })),
            React.createElement(StyleSheetContainer_1.default, null)));
};
// Sets the root style container for libraries. At present, this is needed by react-select (which uses @emotion/...)
// and styled-components.
// See: https://github.com/JedWatson/react-select/issues/3680 and https://github.com/styled-components/styled-components/issues/659
const LibraryStyleRoot = props => {
    const [dependencyStyleContainer, setDependencyStyleContainer] = (0, react_1.useState)(null);
    const cache = (0, react_1.useMemo)(() => {
        return (0, cache_1.default)({
            key: 'new-window-cache',
            container: dependencyStyleContainer,
        });
    }, [dependencyStyleContainer]);
    return React.createElement(React.Fragment, null,
        React.createElement("div", { ref: setDependencyStyleContainer }),
        React.createElement(styled_components_1.StyleSheetManager, { target: dependencyStyleContainer },
            React.createElement(react_2.CacheProvider, { value: cache }, props.children)));
};
exports.default = (0, react_redux_1.connect)((state, ownProps) => {
    var _a;
    // May be undefined if the window hasn't opened
    const windowState = reducer_1.stateUtils.windowStateById(state, ownProps.windowId);
    return {
        themeId: state.settings.theme,
        isSafeMode: state.settings.isSafeMode,
        layout: windowState.secondaryWindowLayout,
        codeView: (_a = windowState === null || windowState === void 0 ? void 0 : windowState.editorCodeView) !== null && _a !== void 0 ? _a : state.settings['editor.codeView'],
        legacyMarkdown: state.settings['editor.legacyMarkdown'],
        plugins: state.pluginService.plugins,
    };
})(SecondaryWindow);
//# sourceMappingURL=EditorWindow.js.map