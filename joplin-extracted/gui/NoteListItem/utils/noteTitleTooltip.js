"use strict";
// Singleton custom tooltip for note list items. Shown when the rendered title
// is truncated by overflow:hidden / text-overflow:ellipsis. A single tooltip
// element is shared by all rows.
Object.defineProperty(exports, "__esModule", { value: true });
let tooltipElement = null;
let showTimer = null;
let activeRow = null;
const showDelayMs = 500;
const viewportMargin = 4;
const getTooltipElement = () => {
    if (tooltipElement)
        return tooltipElement;
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'note-title-tooltip';
    tooltipElement.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltipElement);
    return tooltipElement;
};
// Looks for the element that actually holds the title text. Covers both
// built-in renderers (compact and detailed); returns null for plugin
// renderers that don't use those class hooks.
const findTitleElement = (rowElement) => {
    const detailed = rowElement.querySelector('[data-name="note.title"] > .content');
    if (detailed)
        return detailed;
    const compact = rowElement.querySelector('.title');
    if (compact)
        return compact;
    return null;
};
const isTruncated = (element) => {
    // Check descendants too, since the title text may live in a child span
    // (e.g. mark.js wraps highlighted matches).
    if (element.scrollWidth > element.clientWidth)
        return true;
    for (const child of Array.from(element.children)) {
        if (child.scrollWidth > child.clientWidth)
            return true;
    }
    return false;
};
const positionTooltip = (tooltip, anchor) => {
    const anchorRect = anchor.getBoundingClientRect();
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';
    const tooltipRect = tooltip.getBoundingClientRect();
    let top = anchorRect.bottom + viewportMargin;
    if (top + tooltipRect.height > window.innerHeight - viewportMargin) {
        top = Math.max(viewportMargin, anchorRect.top - tooltipRect.height - viewportMargin);
    }
    let left = anchorRect.left;
    if (left + tooltipRect.width > window.innerWidth - viewportMargin) {
        left = Math.max(viewportMargin, window.innerWidth - tooltipRect.width - viewportMargin);
    }
    tooltip.style.top = `${Math.round(top)}px`;
    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.visibility = 'visible';
};
const hideTooltip = () => {
    if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
    }
    activeRow = null;
    if (!tooltipElement)
        return;
    tooltipElement.style.display = 'none';
    tooltipElement.textContent = '';
};
const scheduleShow = (anchor, text) => {
    if (showTimer)
        clearTimeout(showTimer);
    showTimer = setTimeout(() => {
        const tooltip = getTooltipElement();
        tooltip.textContent = text;
        positionTooltip(tooltip, anchor);
        showTimer = null;
    }, showDelayMs);
};
const attachNoteTitleTooltip = (rowElement, displayTitle) => {
    const onPointerEnter = () => {
        const titleElement = findTitleElement(rowElement);
        if (!titleElement || !isTruncated(titleElement)) {
            if (activeRow === rowElement)
                hideTooltip();
            return;
        }
        activeRow = rowElement;
        scheduleShow(titleElement, displayTitle);
    };
    const onPointerLeave = () => {
        if (activeRow === rowElement)
            hideTooltip();
    };
    rowElement.addEventListener('mouseenter', onPointerEnter);
    rowElement.addEventListener('mouseleave', onPointerLeave);
    return () => {
        rowElement.removeEventListener('mouseenter', onPointerEnter);
        rowElement.removeEventListener('mouseleave', onPointerLeave);
        if (activeRow === rowElement)
            hideTooltip();
    };
};
exports.default = attachNoteTitleTooltip;
//# sourceMappingURL=noteTitleTooltip.js.map