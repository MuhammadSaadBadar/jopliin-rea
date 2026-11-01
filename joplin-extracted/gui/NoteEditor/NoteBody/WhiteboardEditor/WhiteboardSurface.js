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
const react_2 = require("@xyflow/react");
const generateId_1 = __importDefault(require("@joplin/lib/services/whiteboard/generateId"));
const findEmptySpot_1 = __importDefault(require("@joplin/lib/services/whiteboard/findEmptySpot"));
const locale_1 = require("@joplin/lib/locale");
const presetColors_1 = require("@joplin/lib/services/whiteboard/presetColors");
const WhiteboardContext_1 = require("./WhiteboardContext");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
const GotoAnything_1 = require("../../../../plugins/GotoAnything");
const gotoAnything_1 = require("../../../WindowCommandsAndDialogs/commands/gotoAnything");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const electron_1 = require("electron");
const canvasFlow_1 = require("./canvasFlow");
const logger = Logger_1.default.create('WhiteboardSurface');
const TextNode_1 = __importDefault(require("./nodes/TextNode"));
const FileNode_1 = __importDefault(require("./nodes/FileNode"));
const LinkNode_1 = __importDefault(require("./nodes/LinkNode"));
const GroupNode_1 = __importDefault(require("./nodes/GroupNode"));
const ActionPanel_1 = require("./ActionPanel");
const makeArrowMarker = () => ({ type: react_2.MarkerType.ArrowClosed, width: 27, height: 27, markerUnits: 'userSpaceOnUse' });
const arrowModeFor = (e) => {
    const start = !!e.markerStart;
    const end = !!e.markerEnd;
    if (start && end)
        return 'both';
    if (end)
        return 'forward';
    if (start)
        return 'backward';
    return 'none';
};
const nodeTypes = {
    wbText: TextNode_1.default,
    wbFile: FileNode_1.default,
    wbLink: LinkNode_1.default,
    wbGroup: GroupNode_1.default,
};
const InnerSurface = ({ canvas, onChange }) => {
    const ctx = (0, WhiteboardContext_1.useWhiteboardContext)();
    const initial = (0, react_1.useMemo)(() => (0, canvasFlow_1.canvasToFlow)(canvas), [canvas]);
    const [flowNodes, setFlowNodes] = (0, react_1.useState)(initial.nodes);
    const [flowEdges, setFlowEdges] = (0, react_1.useState)(initial.edges);
    const [labelFocusToken, setLabelFocusToken] = (0, react_1.useState)(0);
    const containerRef = (0, react_1.useRef)(null);
    const rf = (0, react_2.useReactFlow)();
    const lastEmittedRef = (0, react_1.useRef)(JSON.stringify((0, canvasFlow_1.flowToCanvas)(initial.nodes, initial.edges)));
    (0, react_1.useEffect)(() => {
        const incoming = JSON.stringify(canvas);
        if (incoming === lastEmittedRef.current)
            return;
        const next = (0, canvasFlow_1.canvasToFlow)(canvas);
        setFlowNodes(next.nodes);
        setFlowEdges(next.edges);
        lastEmittedRef.current = JSON.stringify((0, canvasFlow_1.flowToCanvas)(next.nodes, next.edges));
    }, [canvas]);
    (0, react_1.useEffect)(() => {
        const out = (0, canvasFlow_1.flowToCanvas)(flowNodes, flowEdges);
        const serialized = JSON.stringify(out);
        if (serialized === lastEmittedRef.current)
            return;
        lastEmittedRef.current = serialized;
        onChange(out);
    }, [flowNodes, flowEdges, onChange]);
    const onNodesChange = (0, react_1.useCallback)((changes) => {
        setFlowNodes(prev => (0, react_2.applyNodeChanges)(changes, prev));
    }, []);
    const onEdgesChange = (0, react_1.useCallback)((changes) => {
        setFlowEdges(prev => (0, react_2.applyEdgeChanges)(changes, prev));
    }, []);
    const dragRef = (0, react_1.useRef)(null);
    const onNodeDragStart = (0, react_1.useCallback)((_e, node) => {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l;
        const dragged = flowNodes.find(n => n.id === node.id);
        if (!dragged || ((_b = (_a = dragged.data) === null || _a === void 0 ? void 0 : _a.canvasNode) === null || _b === void 0 ? void 0 : _b.type) !== 'group')
            return;
        const gx = dragged.position.x;
        const gy = dragged.position.y;
        const gw = (_d = (typeof dragged.width === 'number' ? dragged.width : (typeof ((_c = dragged.style) === null || _c === void 0 ? void 0 : _c.width) === 'number' ? dragged.style.width : 0))) !== null && _d !== void 0 ? _d : 0;
        const gh = (_g = (typeof dragged.height === 'number' ? dragged.height : (typeof ((_f = dragged.style) === null || _f === void 0 ? void 0 : _f.height) === 'number' ? dragged.style.height : 0))) !== null && _g !== void 0 ? _g : 0;
        // If the group itself is part of a multi-selection, React Flow drags
        // every selected node together — in that case we must skip selected
        // captives or they'd be double-moved by our delta. If the group isn't
        // in the multi-selection, only the group moves, so all nodes inside
        // (selected or not) need to come along.
        const groupInMultiSelect = !!dragged.selected;
        const captives = [];
        for (const n of flowNodes) {
            if (n.id === dragged.id)
                continue;
            if (groupInMultiSelect && n.selected)
                continue;
            const nw = (_j = (typeof n.width === 'number' ? n.width : (typeof ((_h = n.style) === null || _h === void 0 ? void 0 : _h.width) === 'number' ? n.style.width : 0))) !== null && _j !== void 0 ? _j : 0;
            const nh = (_l = (typeof n.height === 'number' ? n.height : (typeof ((_k = n.style) === null || _k === void 0 ? void 0 : _k.height) === 'number' ? n.style.height : 0))) !== null && _l !== void 0 ? _l : 0;
            const cx = n.position.x + nw / 2;
            const cy = n.position.y + nh / 2;
            if (cx >= gx && cx <= gx + gw && cy >= gy && cy <= gy + gh) {
                captives.push({ id: n.id, originX: n.position.x, originY: n.position.y });
            }
        }
        dragRef.current = { groupId: dragged.id, originX: gx, originY: gy, captives };
    }, [flowNodes]);
    const onNodeDrag = (0, react_1.useCallback)((_e, node) => {
        const ctx = dragRef.current;
        if (!ctx || node.id !== ctx.groupId || !ctx.captives.length)
            return;
        const dx = node.position.x - ctx.originX;
        const dy = node.position.y - ctx.originY;
        const originById = new Map(ctx.captives.map(c => [c.id, c]));
        setFlowNodes(prev => prev.map(n => {
            const origin = originById.get(n.id);
            if (!origin)
                return n;
            return Object.assign(Object.assign({}, n), { position: { x: origin.originX + dx, y: origin.originY + dy } });
        }));
    }, []);
    const onNodeDragStop = (0, react_1.useCallback)(() => {
        dragRef.current = null;
    }, []);
    const onConnect = (0, react_1.useCallback)((connection) => {
        var _a, _b;
        const edge = {
            id: (0, generateId_1.default)(),
            source: connection.source,
            target: connection.target,
            sourceHandle: (_a = connection.sourceHandle) !== null && _a !== void 0 ? _a : undefined,
            targetHandle: (_b = connection.targetHandle) !== null && _b !== void 0 ? _b : undefined,
            markerEnd: makeArrowMarker(),
            data: {
                canvasEdge: {
                    id: '',
                    fromNode: connection.source,
                    toNode: connection.target,
                },
            },
        };
        setFlowEdges(prev => [...prev, edge]);
    }, []);
    const onReconnect = (0, react_1.useCallback)((oldEdge, newConnection) => {
        // `oldEdge` is the rendered edge, which carries the derived `style.stroke`
        // (blue when selected) baked in by `renderedEdges`. reconnectEdge copies
        // those fields onto the new edge, so it would persist that stroke into
        // state and leave the edge blue-but-not-bold after deselection. Reconnect
        // against the clean edge from state instead, keyed by id.
        setFlowEdges(prev => {
            const clean = prev.find(e => e.id === oldEdge.id);
            return (0, react_2.reconnectEdge)((clean !== null && clean !== void 0 ? clean : oldEdge), newConnection, prev);
        });
    }, []);
    // Double-clicking an edge selects it exclusively and focuses the label
    // input, so a user can start typing without moving the mouse to the panel.
    const onEdgeDoubleClick = (0, react_1.useCallback)((_e, edge) => {
        setFlowEdges(prev => prev.map(x => (Object.assign(Object.assign({}, x), { selected: x.id === edge.id }))));
        setFlowNodes(prev => prev.some(n => n.selected) ? prev.map(n => (Object.assign(Object.assign({}, n), { selected: false }))) : prev);
        setLabelFocusToken(t => t + 1);
    }, []);
    const defaultEdgeOptions = (0, react_1.useMemo)(() => ({
        markerEnd: makeArrowMarker(),
    }), []);
    const addCanvasNode = (0, react_1.useCallback)((n) => {
        const flow = (0, canvasFlow_1.canvasNodeToFlowNode)(n);
        setFlowNodes(prev => n.type === 'group' ? [flow, ...prev] : [...prev, flow]);
    }, []);
    const viewportCentre = (0, react_1.useCallback)(() => {
        var _a;
        const view = rf.getViewport();
        const rect = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        const cx = rect ? (rect.width / 2 - view.x) / view.zoom : 0;
        const cy = rect ? (rect.height / 2 - view.y) / view.zoom : 0;
        return { x: cx, y: cy };
    }, [rf]);
    // Viewport bounds in canvas coordinates.
    const viewportBounds = (0, react_1.useCallback)(() => {
        var _a;
        const view = rf.getViewport();
        const rect = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (!rect)
            return null;
        return {
            x: -view.x / view.zoom,
            y: -view.y / view.zoom,
            width: rect.width / view.zoom,
            height: rect.height / view.zoom,
        };
    }, [rf]);
    const existingRects = (0, react_1.useCallback)(() => {
        return flowNodes.map(n => {
            var _a, _b, _c, _d;
            return ({
                x: n.position.x,
                y: n.position.y,
                width: (_b = (typeof n.width === 'number' ? n.width : (typeof ((_a = n.style) === null || _a === void 0 ? void 0 : _a.width) === 'number' ? n.style.width : 0))) !== null && _b !== void 0 ? _b : 0,
                height: (_d = (typeof n.height === 'number' ? n.height : (typeof ((_c = n.style) === null || _c === void 0 ? void 0 : _c.height) === 'number' ? n.style.height : 0))) !== null && _d !== void 0 ? _d : 0,
            });
        });
    }, [flowNodes]);
    const addFileCard = (0, react_1.useCallback)((itemId, at, index = 0) => {
        const offset = index * 24;
        addCanvasNode({
            id: (0, generateId_1.default)(),
            type: 'file',
            x: at.x - 120 + offset,
            y: at.y - 60 + offset,
            width: 240,
            height: 160,
            file: `:/${itemId}`,
        });
    }, [addCanvasNode]);
    const onPaneDoubleClick = (0, react_1.useCallback)(async (event) => {
        // The <Background> svg covers the pane, so it's the event target on an
        // empty-space click.
        const target = event.target;
        if (!(target === null || target === void 0 ? void 0 : target.closest))
            return;
        const onEmptySpace = target.classList.contains('react-flow__pane')
            || !!target.closest('.react-flow__background');
        if (!onEmptySpace)
            return;
        const at = rf.screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const options = { mode: GotoAnything_1.Mode.TitleOnly };
        const result = await CommandService_1.default.instance().execute('gotoAnything', gotoAnything_1.UiType.ControlledApi, options);
        if (!result)
            return;
        if (result.type !== BaseModel_1.ModelType.Note) {
            logger.warn('Selected item is not a note:', result);
            return;
        }
        addFileCard(result.item.id, at);
    }, [rf, addFileCard]);
    const onAddText = (0, react_1.useCallback)(() => {
        const { x: cx, y: cy } = viewportCentre();
        addCanvasNode({
            id: (0, generateId_1.default)(),
            type: 'text',
            x: cx - 120,
            y: cy - 70,
            width: 240,
            height: 140,
            text: (0, locale_1._)('New text card'),
        });
    }, [viewportCentre, addCanvasNode]);
    const onAddGroup = (0, react_1.useCallback)(() => {
        const { x, y, width, height } = (0, findEmptySpot_1.default)({
            existing: existingRects(),
            viewport: viewportBounds(),
            centre: viewportCentre(),
            preferred: { width: 320, height: 240 },
            min: { width: 100, height: 100 },
        });
        addCanvasNode({
            id: (0, generateId_1.default)(),
            type: 'group',
            x,
            y,
            width,
            height,
            label: (0, locale_1._)('New group'),
        });
    }, [existingRects, viewportBounds, viewportCentre, addCanvasNode]);
    const selectedEdges = (0, react_1.useMemo)(() => flowEdges.filter(e => e.selected), [flowEdges]);
    const selectedNodes = (0, react_1.useMemo)(() => flowNodes.filter(n => n.selected), [flowNodes]);
    const DEFAULT_SELECTION_COLOR = '#4a90e2';
    const renderedEdges = (0, react_1.useMemo)(() => {
        return flowEdges.map(e => {
            var _a, _b;
            // If the edge has a colour, use it for both the stroke and (when
            // selected) the selection affordance — otherwise fall back to the
            // default blue for selected edges, and to nothing (React Flow's
            // theme default) for unselected ones.
            const own = (0, presetColors_1.resolveCanvasColor)((_a = e.data) === null || _a === void 0 ? void 0 : _a.color, ctx.themeAppearance, 'stroke');
            const stroke = own !== null && own !== void 0 ? own : (e.selected ? DEFAULT_SELECTION_COLOR : undefined);
            if (!stroke)
                return e;
            const tint = (m) => (m && typeof m === 'object') ? Object.assign(Object.assign({}, m), { color: stroke }) : m;
            return Object.assign(Object.assign({}, e), { style: Object.assign(Object.assign({}, ((_b = e.style) !== null && _b !== void 0 ? _b : {})), { stroke }), markerEnd: tint(e.markerEnd), markerStart: tint(e.markerStart) });
        });
    }, [flowEdges, ctx.themeAppearance]);
    const updateSelectedEdges = (0, react_1.useCallback)((patch) => {
        setFlowEdges(prev => prev.map(e => e.selected ? patch(e) : e));
    }, []);
    const currentArrowMode = (0, react_1.useMemo)(() => {
        if (!selectedEdges.length)
            return 'none';
        const first = arrowModeFor(selectedEdges[0]);
        for (const e of selectedEdges)
            if (arrowModeFor(e) !== first)
                return 'mixed';
        return first;
    }, [selectedEdges]);
    const setArrowMode = (0, react_1.useCallback)((mode) => {
        updateSelectedEdges(e => (Object.assign(Object.assign({}, e), { markerStart: (mode === 'backward' || mode === 'both') ? makeArrowMarker() : undefined, markerEnd: (mode === 'forward' || mode === 'both') ? makeArrowMarker() : undefined })));
    }, [updateSelectedEdges]);
    const flipDirection = (0, react_1.useCallback)(() => {
        updateSelectedEdges(e => (Object.assign(Object.assign({}, e), { source: e.target, target: e.source, sourceHandle: e.targetHandle, targetHandle: e.sourceHandle, markerStart: e.markerEnd, markerEnd: e.markerStart })));
    }, [updateSelectedEdges]);
    const setEdgeLabel = (0, react_1.useCallback)((label) => {
        updateSelectedEdges(e => (Object.assign(Object.assign({}, e), { label })));
    }, [updateSelectedEdges]);
    const setSelectedColor = (0, react_1.useCallback)((color) => {
        setFlowEdges(prev => prev.map(e => e.selected
            ? Object.assign(Object.assign({}, e), { data: Object.assign(Object.assign({}, e.data), { color }) }) : e));
        setFlowNodes(prev => prev.map(n => {
            var _a;
            if (!n.selected)
                return n;
            const cn = (_a = n.data) === null || _a === void 0 ? void 0 : _a.canvasNode;
            if (!cn)
                return n;
            const nextCanvasNode = Object.assign(Object.assign({}, cn), (color ? { color } : {}));
            if (!color)
                delete nextCanvasNode.color;
            return Object.assign(Object.assign({}, n), { data: Object.assign(Object.assign({}, n.data), { canvasNode: nextCanvasNode }) });
        }));
    }, []);
    // A single preset "wins" as the current colour only when every selected
    // item shares it. Mixed selections show no active swatch — clicking one
    // still applies it to everything, which matches the arrow-mode behaviour.
    const currentColor = (0, react_1.useMemo)(() => {
        const colors = [
            ...selectedEdges.map(e => { var _a; return (_a = e.data) === null || _a === void 0 ? void 0 : _a.color; }),
            ...selectedNodes.map(n => { var _a, _b; return (_b = (_a = n.data) === null || _a === void 0 ? void 0 : _a.canvasNode) === null || _b === void 0 ? void 0 : _b.color; }),
        ];
        if (!colors.length)
            return undefined;
        const first = colors[0];
        return colors.every(c => c === first) ? first : undefined;
    }, [selectedEdges, selectedNodes]);
    const colorSwatches = (React.createElement(React.Fragment, null,
        React.createElement(ActionPanel_1.ActionSwatch, { color: null, active: currentColor === undefined, title: (0, locale_1._)('No colour'), onClick: () => setSelectedColor(undefined) }),
        presetColors_1.presetColors.map(p => {
            var _a;
            return (React.createElement(ActionPanel_1.ActionSwatch, { key: p.id, color: (_a = (0, presetColors_1.resolveCanvasColor)(p.id, ctx.themeAppearance, 'stroke')) !== null && _a !== void 0 ? _a : '#888', active: currentColor === p.id, title: p.label, onClick: () => setSelectedColor(p.id) }));
        })));
    const onDragOver = (0, react_1.useCallback)((e) => {
        const effectAllowed = e.dataTransfer.effectAllowed;
        const canLink = effectAllowed.toLowerCase().includes('link') || ['all', 'uninitialized'].includes(effectAllowed);
        const types = Array.from(e.dataTransfer.types);
        if (types.includes('text/x-jop-note-ids') || types.includes('text/x-jop-resource-ids')) {
            e.preventDefault();
            // Workaround: On Linux, the 'link' drag effect prevents dropping items into the editor.
            // See https://github.com/laurent22/joplin/issues/16457.
            e.dataTransfer.dropEffect = canLink ? 'link' : 'copy';
        }
        else if (types.includes('Files')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }
    }, []);
    const onDrop = (0, react_1.useCallback)(async (e) => {
        const noteIdsRaw = e.dataTransfer.getData('text/x-jop-note-ids');
        const resourceIdsRaw = e.dataTransfer.getData('text/x-jop-resource-ids');
        // Electron's recommended way to get the on-disk path of a dropped File
        // (the deprecated `File.path` was removed in recent Electron versions).
        const droppedFiles = Array.from(e.dataTransfer.files);
        const filePaths = droppedFiles.map(f => electron_1.webUtils.getPathForFile(f)).filter((p) => !!p);
        if (!noteIdsRaw && !resourceIdsRaw && !filePaths.length)
            return;
        e.preventDefault();
        e.stopPropagation();
        const drop = rf.screenToFlowPosition({ x: e.clientX, y: e.clientY });
        const tryParse = (raw) => {
            if (!raw)
                return [];
            try {
                const v = JSON.parse(raw);
                return Array.isArray(v) ? v : [];
            }
            catch (_a) {
                return [];
            }
        };
        const placeCardForResource = (resourceId, index) => {
            addFileCard(resourceId, drop, index);
        };
        const internalIds = [
            ...tryParse(noteIdsRaw),
            ...tryParse(resourceIdsRaw),
        ];
        for (let i = 0; i < internalIds.length; i++)
            placeCardForResource(internalIds[i], i);
        if (filePaths.length) {
            // Import each file into the resource store, then add a card. Done
            // in parallel for throughput; the card index (and thus the offset)
            // follows the original drop order so cards stagger predictably
            // even if larger files finish importing later.
            await Promise.all(filePaths.map(async (filePath, i) => {
                try {
                    const resource = await shim_1.default.createResourceFromPath(filePath);
                    placeCardForResource(resource.id, internalIds.length + i);
                }
                catch (error) {
                    logger.warn(`Could not import dropped file ${filePath}:`, error);
                }
            }));
        }
    }, [rf, addFileCard]);
    return (React.createElement("div", { ref: containerRef, className: "whiteboard-surface", onDragOver: onDragOver, onDrop: onDrop, onDoubleClick: onPaneDoubleClick },
        React.createElement(react_2.ReactFlow, { nodes: flowNodes, edges: renderedEdges, nodeTypes: nodeTypes, defaultEdgeOptions: defaultEdgeOptions, connectionMode: react_2.ConnectionMode.Loose, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onConnect: onConnect, onReconnect: onReconnect, onEdgeDoubleClick: onEdgeDoubleClick, edgesReconnectable: true, onNodeDragStart: onNodeDragStart, onNodeDrag: onNodeDrag, onNodeDragStop: onNodeDragStop, elevateEdgesOnSelect: true, deleteKeyCode: ['Backspace', 'Delete'], multiSelectionKeyCode: ['Shift', 'Meta', 'Control'], selectionKeyCode: ['Shift'], panOnScroll: true, panOnDrag: true, zoomOnPinch: true, zoomOnScroll: false, zoomOnDoubleClick: false, fitView: flowNodes.length > 0, elevateNodesOnSelect: false, proOptions: { hideAttribution: true } },
            React.createElement(react_2.Background, { gap: 16, size: 1 }),
            React.createElement(react_2.Controls, { showInteractive: false }),
            React.createElement(react_2.MiniMap, { pannable: true, zoomable: true }),
            React.createElement(ActionPanel_1.ActionPanel, { position: "top-right" },
                React.createElement(ActionPanel_1.ActionButton, { onClick: onAddText, title: (0, locale_1._)('Add a text card') }, (0, locale_1._)('+ Text')),
                React.createElement(ActionPanel_1.ActionButton, { onClick: onAddGroup, title: (0, locale_1._)('Add a group') }, (0, locale_1._)('+ Group'))),
            selectedEdges.length > 0 ? (React.createElement(ActionPanel_1.ActionPanel, { position: "bottom-center", caption: (0, locale_1._n)('%d connection', '%d connections', selectedEdges.length, selectedEdges.length) },
                React.createElement(ActionPanel_1.ActionButton, { onClick: () => setArrowMode('none'), active: currentArrowMode === 'none', title: (0, locale_1._)('No arrow') }, "\u2014"),
                React.createElement(ActionPanel_1.ActionButton, { onClick: () => setArrowMode('forward'), active: currentArrowMode === 'forward', title: (0, locale_1._)('Arrow at target') }, "\u2192"),
                React.createElement(ActionPanel_1.ActionButton, { onClick: () => setArrowMode('backward'), active: currentArrowMode === 'backward', title: (0, locale_1._)('Arrow at source') }, "\u2190"),
                React.createElement(ActionPanel_1.ActionButton, { onClick: () => setArrowMode('both'), active: currentArrowMode === 'both', title: (0, locale_1._)('Bidirectional') }, "\u2194"),
                React.createElement(ActionPanel_1.ActionDivider, null),
                React.createElement(ActionPanel_1.ActionButton, { onClick: flipDirection, title: (0, locale_1._)('Swap source and target') }, (0, locale_1._)('Flip')),
                React.createElement(ActionPanel_1.ActionDivider, null),
                colorSwatches,
                selectedEdges.length === 1 ? (React.createElement(React.Fragment, null,
                    React.createElement(ActionPanel_1.ActionDivider, null),
                    React.createElement(ActionPanel_1.ActionInput, { value: typeof selectedEdges[0].label === 'string' ? selectedEdges[0].label : '', placeholder: (0, locale_1._)('Label'), focusToken: labelFocusToken, onChange: setEdgeLabel }))) : null)) : null,
            selectedNodes.length > 0 && selectedEdges.length === 0 ? (React.createElement(ActionPanel_1.ActionPanel, { position: "bottom-center", caption: (0, locale_1._n)('%d card', '%d cards', selectedNodes.length, selectedNodes.length) }, colorSwatches)) : null)));
};
const WhiteboardSurface = (props) => (React.createElement(react_2.ReactFlowProvider, null,
    React.createElement(InnerSurface, Object.assign({}, props))));
exports.default = WhiteboardSurface;
//# sourceMappingURL=WhiteboardSurface.js.map