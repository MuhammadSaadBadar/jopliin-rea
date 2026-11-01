"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDirection = void 0;
exports.canMove = canMove;
exports.moveHorizontal = moveHorizontal;
exports.moveVertical = moveVertical;
exports.move = move;
const iterateItems_1 = __importDefault(require("./iterateItems"));
const types_1 = require("./types");
const immer_1 = require("immer");
const uuid_1 = __importDefault(require("@joplin/lib/uuid"));
const validateLayout_1 = __importDefault(require("./validateLayout"));
var MoveDirection;
(function (MoveDirection) {
    MoveDirection["Up"] = "up";
    MoveDirection["Down"] = "down";
    MoveDirection["Left"] = "left";
    MoveDirection["Right"] = "right";
})(MoveDirection || (exports.MoveDirection = MoveDirection = {}));
var MovementDirection;
(function (MovementDirection) {
    MovementDirection[MovementDirection["Horizontal"] = 1] = "Horizontal";
    MovementDirection[MovementDirection["Vertical"] = 2] = "Vertical";
})(MovementDirection || (MovementDirection = {}));
function array_move(arr, old_index, new_index) {
    arr = arr.slice();
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}
function findItemIndex(siblings, key) {
    return siblings.findIndex((value) => {
        return value.key === key;
    });
}
function isHorizontalMove(direction) {
    return direction === MoveDirection.Left || direction === MoveDirection.Right;
}
function resetItemSizes(items) {
    return items.map((item) => {
        const newItem = Object.assign({}, item);
        delete newItem.width;
        delete newItem.height;
        return newItem;
    });
}
function canMove(direction, item, parent) {
    if (!parent)
        return false;
    if (isHorizontalMove(direction)) {
        if (parent.isRoot) {
            const idx = direction === MoveDirection.Left ? 0 : parent.children.length - 1;
            return parent.children[idx] !== item;
        }
        else if (parent.direction === types_1.LayoutItemDirection.Column) {
            return true;
        }
    }
    else {
        if (parent.isRoot) {
            return false;
        }
        else if (parent.direction === types_1.LayoutItemDirection.Column) {
            const idx = direction === MoveDirection.Up ? 0 : parent.children.length - 1;
            return parent.children[idx] !== item;
        }
    }
    throw new Error('Unhandled case');
}
// For all movements we make the assumption that there's a root container,
// which is a row of multiple columns. Within each of these columns there
// can be multiple rows (one item per row). Items cannot be more deeply
// nested.
function moveItem(direction, layout, key, inc) {
    const itemParents = {};
    const itemIsRoot = (item) => {
        return !itemParents[item.key];
    };
    const updatedLayout = (0, immer_1.produce)(layout, (draft) => {
        (0, iterateItems_1.default)(draft, (itemIndex, item, parent) => {
            itemParents[item.key] = parent;
            if (item.key !== key || !parent)
                return true;
            // - "flow" means we are moving an item horizontally within a
            //   row
            // - "contrary" means we are moving an item horizontally within
            //   a column. Sicen it can't move horizontally, it is moved
            //   out of its container. And vice-versa for vertical
            //   movements.
            let moveType = null;
            if (direction === MovementDirection.Horizontal && parent.direction === types_1.LayoutItemDirection.Row)
                moveType = 'flow';
            if (direction === MovementDirection.Horizontal && parent.direction === types_1.LayoutItemDirection.Column)
                moveType = 'contrary';
            if (direction === MovementDirection.Vertical && parent.direction === types_1.LayoutItemDirection.Column)
                moveType = 'flow';
            if (direction === MovementDirection.Vertical && parent.direction === types_1.LayoutItemDirection.Row)
                moveType = 'contrary';
            if (moveType === 'flow') {
                const newIndex = itemIndex + inc;
                if (newIndex >= parent.children.length || newIndex < 0)
                    throw new Error(`Cannot move item "${key}" from position ${itemIndex} to ${newIndex}`);
                // If the item next to it is a container (has children),
                // move the item inside the container
                if (parent.children[newIndex].children) {
                    const newParent = parent.children[newIndex];
                    parent.children.splice(itemIndex, 1);
                    newParent.children.push(item);
                    newParent.children = resetItemSizes(newParent.children);
                }
                else {
                    // If the item is a child of the root container, create
                    // a new column at `newIndex` and move the item that
                    // was there, as well as the current item, in this
                    // container.
                    if (itemIsRoot(parent)) {
                        const targetChild = parent.children[newIndex];
                        // The new container takes the size of the item it
                        // replaces.
                        const newSize = {};
                        if (direction === MovementDirection.Horizontal) {
                            if ('width' in targetChild)
                                newSize.width = targetChild.width;
                        }
                        else {
                            if ('height' in targetChild)
                                newSize.height = targetChild.height;
                        }
                        const newParent = Object.assign({ key: `${types_1.tempContainerPrefix}${uuid_1.default.createNano()}`, direction: types_1.LayoutItemDirection.Column, children: [
                                targetChild,
                                item,
                            ] }, newSize);
                        parent.children[newIndex] = newParent;
                        parent.children.splice(itemIndex, 1);
                        newParent.children = resetItemSizes(newParent.children);
                    }
                    else {
                        // Otherwise the default case is simply to move the
                        // item left/right
                        parent.children = array_move(parent.children, itemIndex, newIndex);
                    }
                }
            }
            else {
                const parentParent = itemParents[parent.key];
                const parentIndex = findItemIndex(parentParent.children, parent.key);
                parent.children.splice(itemIndex, 1);
                let newInc = inc;
                if (parent.children.length <= 1) {
                    parentParent.children[parentIndex] = parent.children[0];
                    newInc = inc < 0 ? inc + 1 : inc;
                }
                const newItemIndex = parentIndex + newInc;
                parentParent.children.splice(newItemIndex, 0, item);
                parentParent.children = resetItemSizes(parentParent.children);
            }
            return false;
        });
    });
    return (0, validateLayout_1.default)(updatedLayout);
}
function moveHorizontal(layout, key, inc) {
    return moveItem(MovementDirection.Horizontal, layout, key, inc);
}
function moveVertical(layout, key, inc) {
    return moveItem(MovementDirection.Vertical, layout, key, inc);
}
function move(layout, key, direction) {
    if (direction === MoveDirection.Up)
        return moveVertical(layout, key, -1);
    if (direction === MoveDirection.Down)
        return moveVertical(layout, key, +1);
    if (direction === MoveDirection.Left)
        return moveHorizontal(layout, key, -1);
    if (direction === MoveDirection.Right)
        return moveHorizontal(layout, key, +1);
    throw new Error('Unreachable');
}
//# sourceMappingURL=movements.js.map