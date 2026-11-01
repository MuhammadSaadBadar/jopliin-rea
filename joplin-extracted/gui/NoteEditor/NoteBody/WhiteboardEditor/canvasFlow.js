"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowToCanvas = exports.canvasToFlow = exports.canvasNodeToFlowNode = void 0;
const react_1 = require("@xyflow/react");
const flowTypeForCanvasType = (type) => {
    switch (type) {
        case 'text': return 'wbText';
        case 'file': return 'wbFile';
        case 'link': return 'wbLink';
        case 'group': return 'wbGroup';
    }
};
const canvasNodeToFlowNode = (n) => {
    const isGroup = n.type === 'group';
    // React Flow forces `pointerEvents: 'all'` as an inline style on the node
    // wrapper, which beats any CSS class rule. For groups we override it back
    // to 'none' via the node's own `style` (which React Flow spreads after its
    // own pointerEvents). Children re-enable pointer-events selectively, so
    // only the handle / label actually catches mouse events.
    const style = { width: n.width, height: n.height };
    if (isGroup)
        style.pointerEvents = 'none';
    return Object.assign({ id: n.id, type: flowTypeForCanvasType(n.type), position: { x: n.x, y: n.y }, data: { canvasNode: n }, style, width: n.width, height: n.height, selectable: true, draggable: true }, (isGroup ? { dragHandle: '.whiteboard-group-handle' } : {}));
};
exports.canvasNodeToFlowNode = canvasNodeToFlowNode;
const sideToHandle = (side) => {
    if (!side)
        return undefined;
    return side;
};
// markerUnits userSpaceOnUse keeps arrowhead size fixed regardless of edge
// stroke width — selected edges have a thicker stroke and would otherwise
// render a proportionally bigger arrow.
const arrowMarker = () => ({ type: react_1.MarkerType.ArrowClosed, width: 27, height: 27, markerUnits: 'userSpaceOnUse' });
const canvasToFlow = (canvas) => {
    const nodes = canvas.nodes.map(exports.canvasNodeToFlowNode);
    const edges = canvas.edges.map(e => ({
        id: e.id,
        source: e.fromNode,
        target: e.toNode,
        sourceHandle: sideToHandle(e.fromSide),
        targetHandle: sideToHandle(e.toSide),
        label: e.label,
        data: { canvasEdge: e, color: e.color },
        type: 'default',
        markerStart: e.fromEnd === 'arrow' ? arrowMarker() : undefined,
        markerEnd: e.toEnd === 'none' ? undefined : arrowMarker(),
    }));
    return { nodes, edges };
};
exports.canvasToFlow = canvasToFlow;
const handleToSide = (handle) => {
    if (handle === 'top' || handle === 'right' || handle === 'bottom' || handle === 'left')
        return handle;
    return undefined;
};
const flowToCanvas = (flowNodes, flowEdges) => {
    const nodes = flowNodes.map(fn => {
        var _a, _b, _c, _d, _e;
        const orig = (_a = fn.data) === null || _a === void 0 ? void 0 : _a.canvasNode;
        const width = (_c = (typeof fn.width === 'number' ? fn.width : (typeof ((_b = fn.style) === null || _b === void 0 ? void 0 : _b.width) === 'number' ? fn.style.width : orig === null || orig === void 0 ? void 0 : orig.width))) !== null && _c !== void 0 ? _c : 200;
        const height = (_e = (typeof fn.height === 'number' ? fn.height : (typeof ((_d = fn.style) === null || _d === void 0 ? void 0 : _d.height) === 'number' ? fn.style.height : orig === null || orig === void 0 ? void 0 : orig.height))) !== null && _e !== void 0 ? _e : 100;
        const base = {
            id: fn.id,
            x: fn.position.x,
            y: fn.position.y,
            width,
            height,
        };
        if (!orig) {
            return Object.assign(Object.assign({}, base), { type: 'text', text: '' });
        }
        return Object.assign(Object.assign({}, orig), base);
    });
    // JSONCanvas z-order is array order: first = bottom, last = top. Groups
    // are visual containers and must render behind regular nodes, so we sort
    // them to the front of the array on serialize.
    nodes.sort((a, b) => {
        if (a.type === 'group' && b.type !== 'group')
            return -1;
        if (a.type !== 'group' && b.type === 'group')
            return 1;
        return 0;
    });
    const edges = flowEdges.map(fe => {
        var _a, _b;
        const orig = (_a = fe.data) === null || _a === void 0 ? void 0 : _a.canvasEdge;
        const fromEnd = fe.markerStart ? 'arrow' : 'none';
        const toEnd = fe.markerEnd ? 'arrow' : 'none';
        const color = (_b = fe.data) === null || _b === void 0 ? void 0 : _b.color;
        return Object.assign(Object.assign({ id: fe.id, fromNode: fe.source, toNode: fe.target, fromSide: handleToSide(fe.sourceHandle), toSide: handleToSide(fe.targetHandle), label: typeof fe.label === 'string' ? fe.label : (orig === null || orig === void 0 ? void 0 : orig.label) }, (color ? { color } : {})), { fromEnd,
            toEnd });
    });
    return { nodes, edges };
};
exports.flowToCanvas = flowToCanvas;
//# sourceMappingURL=canvasFlow.js.map