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
const useWindowResizeEvent_1 = __importDefault(require("./utils/useWindowResizeEvent"));
const setLayoutItemProps_1 = __importDefault(require("./utils/setLayoutItemProps"));
const useLayoutItemSizes_1 = __importStar(require("./utils/useLayoutItemSizes"));
const validateLayout_1 = __importDefault(require("./utils/validateLayout"));
const movements_1 = require("./utils/movements");
const resizeLogic_1 = require("./utils/resizeLogic");
const MoveButtons_1 = __importDefault(require("./MoveButtons"));
const style_1 = require("./utils/style");
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const EventEmitter = require("events");
const LayoutItemContainer_1 = __importDefault(require("./LayoutItemContainer"));
const itemVisible = resizeLogic_1.isItemVisibleInRender;
function ResizableLayout(props) {
    const eventEmitter = (0, react_1.useRef)(new EventEmitter());
    const [resizedItem, setResizedItem] = (0, react_1.useState)(null);
    const lastUsedMoveButtonKey = (0, react_1.useRef)(null);
    const onMoveButtonClick = (0, react_1.useCallback)((event) => {
        lastUsedMoveButtonKey.current = event.buttonKey;
        props.onMoveButtonClick(event);
    }, [props.onMoveButtonClick]);
    const renderMoveControls = (item, parent, size) => {
        return (React.createElement(style_1.StyledWrapperRoot, { key: item.key, size: size },
            React.createElement(style_1.StyledMoveOverlay, null,
                React.createElement(MoveButtons_1.default, { autoFocusKey: lastUsedMoveButtonKey.current, itemKey: item.key, itemLabel: props.layoutKeyToLabel(item.key), onClick: onMoveButtonClick, canMoveLeft: (0, movements_1.canMove)(movements_1.MoveDirection.Left, item, parent), canMoveRight: (0, movements_1.canMove)(movements_1.MoveDirection.Right, item, parent), canMoveUp: (0, movements_1.canMove)(movements_1.MoveDirection.Up, item, parent), canMoveDown: (0, movements_1.canMove)(movements_1.MoveDirection.Down, item, parent) }))));
    };
    function renderItemWrapper(comp, item, size) {
        return (React.createElement(style_1.StyledWrapperRoot, { key: item.key, size: size }, comp));
    }
    function renderLayoutItem(item, parent, sizes, isVisible, isLastChild, onlyMoveControls, parentEdges = { ownRight: false, ownBottom: false, parentRight: false, parentBottom: false }) {
        const edges = (0, resizeLogic_1.computeEdges)(parent, isLastChild, parentEdges);
        const onResizeStart = () => {
            setResizedItem(Object.assign(Object.assign({}, (0, resizeLogic_1.buildResizeSnapshot)(item, parent, props.moveMode, sizes)), { maxSize: (0, useLayoutItemSizes_1.calculateMaxSizeAvailableForItem)(item, parent, sizes) }));
        };
        const onResize = (_event, direction, _refToElement, delta) => {
            let newLayout = props.layout;
            for (const update of (0, resizeLogic_1.planResize)(resizedItem, direction, delta)) {
                newLayout = (0, setLayoutItemProps_1.default)(newLayout, update.key, update.props);
            }
            props.onResize({ layout: newLayout });
            eventEmitter.current.emit('resize');
        };
        const onResizeStop = (_event, _direction, _refToElement, delta) => {
            onResize(_event, _direction, _refToElement, delta);
            setResizedItem(null);
        };
        const resizedItemMaxSize = resizedItem && item.key === resizedItem.key ? resizedItem.maxSize : null;
        const visible = itemVisible(item, props.moveMode);
        const itemContainerProps = {
            key: item.key, item, parent, sizes, resizedItemMaxSize, onResizeStart, onResizeStop, onResize, isLastChild, visible, edges,
        };
        if (!item.children) {
            const size = (0, useLayoutItemSizes_1.itemSize)(item, parent, sizes, false, edges);
            const comp = props.renderItem(item.key, {
                item: item,
                eventEmitter: eventEmitter.current,
                size: size,
                visible: isVisible,
            });
            const wrapper = onlyMoveControls ? renderMoveControls(item, parent, size) : renderItemWrapper(comp, item, size);
            return React.createElement(LayoutItemContainer_1.default, Object.assign({}, itemContainerProps), wrapper);
        }
        else {
            const lastVisibleIdx = (0, resizeLogic_1.lastVisibleChildIndex)(item, props.moveMode);
            const childrenComponents = [];
            for (let i = 0; i < item.children.length; i++) {
                const child = item.children[i];
                childrenComponents.push(renderLayoutItem(child, item, sizes, isVisible && itemVisible(child, props.moveMode), i === lastVisibleIdx, onlyMoveControls, edges));
            }
            return React.createElement(LayoutItemContainer_1.default, Object.assign({}, itemContainerProps), childrenComponents);
        }
    }
    (0, react_1.useEffect)(() => {
        (0, validateLayout_1.default)(props.layout);
    }, [props.layout]);
    (0, useWindowResizeEvent_1.default)(eventEmitter);
    const sizes = (0, useLayoutItemSizes_1.default)(props.layout, props.moveMode);
    const renderRoot = (moveControlsOnly) => {
        return renderLayoutItem(props.layout, null, sizes, itemVisible(props.layout, props.moveMode), true, moveControlsOnly);
    };
    function renderMoveModeBox() {
        return React.createElement("div", null,
            React.createElement(Dialog_1.default, { contentFillsScreen: true, className: 'change-app-layout-dialog' },
                React.createElement(style_1.MoveModeRootMessage, null, props.moveModeMessage),
                renderRoot(true)),
            renderRoot(false));
    }
    if (props.moveMode) {
        return renderMoveModeBox();
    }
    else {
        return renderRoot(false);
    }
}
exports.default = ResizableLayout;
//# sourceMappingURL=ResizableLayout.js.map