"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateLayout;
const immer_1 = require("immer");
const iterateItems_1 = __importDefault(require("./iterateItems"));
const types_1 = require("./types");
// Fallback size assigned to a non-absorber sibling that has none, so the
// absorber stays the only width/height-less child of its container.
const itemMinWidthFallback = 250;
const itemMinHeightFallback = 250;
function isLastVisible(itemIndex, item, parent) {
    if (item.visible === false)
        return false;
    for (let i = parent.children.length - 1; i >= 0; i--) {
        const child = parent.children[i];
        if (child && child.visible !== false)
            return i === itemIndex;
    }
    return false;
}
// A subtree counts as flexible if it carries the flag at any nested level, so
// the absorber role propagates up to the root container.
function containsFlexible(item) {
    if (item.visible === false)
        return false;
    if (item.flexible)
        return true;
    if (!item.children)
        return false;
    for (const child of item.children) {
        if (containsFlexible(child))
            return true;
    }
    return false;
}
function explicitAbsorberIndex(parent) {
    if (!parent.children)
        return -1;
    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (child.visible === false)
            continue;
        if (containsFlexible(child))
            return i;
    }
    return -1;
}
function updateItemSize(itemIndex, itemDraft, parent) {
    if (!parent)
        return;
    // If a container has only one child, this child should not
    // have a width and height, and simply fill up the container
    if (parent.children.length === 1) {
        delete itemDraft.width;
        delete itemDraft.height;
    }
    const explicitIdx = explicitAbsorberIndex(parent);
    if (explicitIdx !== -1) {
        // Strip the absorber's size and assign fallback sizes to any sibling
        // that lacks one, so the absorber alone fills remaining space.
        if (explicitIdx !== itemIndex || itemDraft.visible === false)
            return;
        if (parent.direction === types_1.LayoutItemDirection.Row) {
            delete itemDraft.width;
            for (let i = 0; i < parent.children.length; i++) {
                if (i === itemIndex)
                    continue;
                const child = parent.children[i];
                if (child.visible === false)
                    continue;
                if (!('width' in child)) {
                    child.width = child.minWidth || itemMinWidthFallback;
                }
            }
        }
        else {
            delete itemDraft.height;
            for (let i = 0; i < parent.children.length; i++) {
                if (i === itemIndex)
                    continue;
                const child = parent.children[i];
                if (child.visible === false)
                    continue;
                if (!('height' in child)) {
                    child.height = child.minHeight || itemMinHeightFallback;
                }
            }
        }
        return;
    }
    // No explicit absorber: legacy fallback makes the last visible child
    // flexible when every other sibling is already sized.
    if (isLastVisible(itemIndex, itemDraft, parent)) {
        let allChildrenAreSized = true;
        for (const child of parent.children) {
            if (child.visible === false)
                continue;
            if (parent.direction === types_1.LayoutItemDirection.Row) {
                if (!child.width) {
                    allChildrenAreSized = false;
                    break;
                }
            }
            else {
                if (!child.height) {
                    allChildrenAreSized = false;
                    break;
                }
            }
        }
        if (allChildrenAreSized) {
            if (parent.direction === types_1.LayoutItemDirection.Row) {
                delete itemDraft.width;
            }
            else {
                delete itemDraft.height;
            }
        }
    }
}
// All items get a draggable trailing edge except the last visible child,
// whose trailing edge is the container's edge.
function updateResizeRules(itemIndex, itemDraft, parent) {
    if (!parent)
        return;
    const isLastVisibleChild = isLastVisible(itemIndex, itemDraft, parent);
    itemDraft.resizableRight = parent.direction === types_1.LayoutItemDirection.Row && !isLastVisibleChild;
    itemDraft.resizableBottom = parent.direction === types_1.LayoutItemDirection.Column && !isLastVisibleChild;
}
// Container direction should alternate between row (for the root) and
// columns, then rows again.
function updateDirection(_itemIndex, itemDraft, parent) {
    if (!parent) {
        itemDraft.direction = types_1.LayoutItemDirection.Row;
    }
    else {
        itemDraft.direction = parent.direction === types_1.LayoutItemDirection.Row ? types_1.LayoutItemDirection.Column : types_1.LayoutItemDirection.Row;
    }
}
function itemShouldBeVisible(item) {
    if (!item.children)
        return item.visible !== false;
    let oneIsVisible = false;
    for (const child of item.children) {
        if (itemShouldBeVisible(child)) {
            oneIsVisible = true;
            break;
        }
    }
    return oneIsVisible;
}
// If all children of a container are hidden, the container should be
// hidden too. A container visibility cannot be changed by the user.
function updateContainerVisibility(_itemIndex, itemDraft, _parent) {
    if (itemDraft.children) {
        itemDraft.visible = itemShouldBeVisible(itemDraft);
    }
    else {
        itemDraft.visible = itemDraft.visible !== false;
    }
}
function validateLayout(layout) {
    if (!layout)
        throw new Error('Layout is null');
    if (!layout.children || !layout.children.length)
        throw new Error('Root does not have children');
    return (0, immer_1.produce)(layout, (draft) => {
        draft.isRoot = true;
        (0, iterateItems_1.default)(draft, (itemIndex, itemDraft, parent) => {
            updateItemSize(itemIndex, itemDraft, parent);
            updateResizeRules(itemIndex, itemDraft, parent);
            updateDirection(itemIndex, itemDraft, parent);
            updateContainerVisibility(itemIndex, itemDraft, parent);
            return true;
        });
    });
}
//# sourceMappingURL=validateLayout.js.map