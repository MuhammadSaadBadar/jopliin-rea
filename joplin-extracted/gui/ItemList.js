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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class ItemList extends React.Component {
    constructor(props) {
        super(props);
        this.onScroll = event => {
            this.lastScrollTop_ = event.target.scrollTop;
            this.updateStateItemIndexes();
        };
        this.onKeyDown = event => {
            if (this.props.onKeyDown)
                this.props.onKeyDown(event);
        };
        this.onDrop = event => {
            if (this.props.onItemDrop)
                this.props.onItemDrop(event);
        };
        this.lastScrollTop_ = 0;
        this.listRef = React.createRef();
        this.onScroll = this.onScroll.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    visibleItemCount(props = undefined) {
        if (typeof props === 'undefined')
            props = this.props;
        return Math.ceil(props.style.height / props.itemHeight);
    }
    updateStateItemIndexes(props = undefined) {
        if (typeof props === 'undefined')
            props = this.props;
        const topItemIndex = Math.floor(this.offsetScroll() / props.itemHeight);
        const visibleItemCount = this.visibleItemCount(props);
        let bottomItemIndex = topItemIndex + visibleItemCount;
        if (bottomItemIndex >= props.items.length)
            bottomItemIndex = props.items.length - 1;
        this.setState({
            topItemIndex: topItemIndex,
            bottomItemIndex: bottomItemIndex,
        });
    }
    offsetTop() {
        return this.listRef.current ? this.listRef.current.offsetTop : 0;
    }
    offsetScroll() {
        var _a, _b;
        return (_b = (_a = this.container) === null || _a === void 0 ? void 0 : _a.scrollTop) !== null && _b !== void 0 ? _b : this.lastScrollTop_;
    }
    get container() {
        return this.listRef.current;
    }
    UNSAFE_componentWillMount() {
        this.updateStateItemIndexes();
    }
    UNSAFE_componentWillReceiveProps(newProps) {
        this.updateStateItemIndexes(newProps);
    }
    get firstVisibleIndex() {
        return Math.min(this.props.items.length - 1, this.state.topItemIndex);
    }
    get lastVisibleIndex() {
        return Math.max(0, this.state.bottomItemIndex);
    }
    isIndexVisible(itemIndex) {
        return itemIndex >= this.firstVisibleIndex && itemIndex <= this.lastVisibleIndex;
    }
    makeItemIndexVisible(itemIndex) {
        // The first and last visible indices are often partially out of view and can thus be made more visible
        if (this.isIndexVisible(itemIndex) && itemIndex !== this.lastVisibleIndex && itemIndex !== this.firstVisibleIndex) {
            return;
        }
        const currentScroll = this.offsetScroll();
        let scrollTop = currentScroll;
        if (itemIndex <= this.firstVisibleIndex) {
            scrollTop = this.props.itemHeight * itemIndex;
        }
        else if (itemIndex >= this.lastVisibleIndex - 1) {
            const scrollBottom = this.props.itemHeight * (itemIndex + 1);
            scrollTop = scrollBottom - this.props.style.height;
        }
        if (scrollTop < 0)
            scrollTop = 0;
        if (currentScroll !== scrollTop) {
            this.lastScrollTop_ = scrollTop;
            this.listRef.current.scrollTop = scrollTop;
            this.updateStateItemIndexes();
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    // 	for (const n in this.props) {
    // 		if (this.props[n] !== nextProps[n]) {
    // 			console.info('Props', n, nextProps[n]);
    // 		}
    // 	}
    // 	for (const n in this.state) {
    // 		if (this.state[n] !== nextState[n]) {
    // 			console.info('State', n, nextState[n]);
    // 		}
    // 	}
    // 	return true;
    // }
    render() {
        var _a;
        const items = this.props.items;
        const style = Object.assign(Object.assign({}, this.props.style), { overflowX: 'hidden', overflowY: 'auto' });
        // if (this.props.disabled) style.opacity = 0.5;
        if (!this.props.itemHeight)
            throw new Error('itemHeight is required');
        const blankItem = function (key, height) {
            return React.createElement("div", { key: key, style: { height: height } });
        };
        const renderableBlocks = [];
        if (this.props.alwaysRenderSelection && isFinite(this.props.selectedIndex)) {
            const selectionVisible = this.props.selectedIndex >= this.state.topItemIndex && this.props.selectedIndex <= this.state.bottomItemIndex;
            const isValidSelection = this.props.selectedIndex >= 0 && this.props.selectedIndex < items.length;
            if (!selectionVisible && isValidSelection) {
                renderableBlocks.push({ from: this.props.selectedIndex, to: this.props.selectedIndex });
            }
        }
        renderableBlocks.push({ from: this.state.topItemIndex, to: this.state.bottomItemIndex });
        // Ascending order
        renderableBlocks.sort(({ from: fromA }, { from: fromB }) => fromA - fromB);
        const itemComps = [];
        for (let i = 0; i < renderableBlocks.length; i++) {
            const currentBlock = renderableBlocks[i];
            if (i === 0) {
                itemComps.push(blankItem('top', currentBlock.from * this.props.itemHeight));
            }
            for (let j = currentBlock.from; j <= currentBlock.to; j++) {
                const itemComp = this.props.itemRenderer(items[j], j);
                itemComps.push(itemComp);
            }
            const nextBlockFrom = i + 1 < renderableBlocks.length ? renderableBlocks[i + 1].from : items.length;
            itemComps.push(blankItem(`after-${i}`, (nextBlockFrom - currentBlock.to - 1) * this.props.itemHeight));
        }
        const classes = ['item-list'];
        if (this.props.className)
            classes.push(this.props.className);
        const wrapContent = (_a = this.props.renderContentWrapper) !== null && _a !== void 0 ? _a : ((children) => React.createElement(React.Fragment, null, children));
        return (React.createElement("div", { ref: this.listRef, className: classes.join(' '), style: style, id: this.props.id, role: this.props.role, "aria-label": this.props['aria-label'], onScroll: this.onScroll, onKeyDown: this.onKeyDown, onDrop: this.onDrop }, wrapContent(itemComps)));
    }
}
exports.default = ItemList;
//# sourceMappingURL=ItemList.js.map