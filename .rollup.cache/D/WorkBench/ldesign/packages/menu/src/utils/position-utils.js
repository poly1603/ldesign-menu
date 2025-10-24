/**
 * Popup 定位计算工具
 */
/**
 * 获取元素的边界矩形
 */
export function getElementRect(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
    };
}
/**
 * 获取视口尺寸
 */
export function getViewportSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight,
    };
}
/**
 * 获取滚动偏移
 */
export function getScrollOffset() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop,
    };
}
/**
 * 计算 Popup 位置
 */
export function calculatePopupPosition(triggerElement, popupElement, placement = 'bottom-start', offset = 4) {
    const triggerRect = getElementRect(triggerElement);
    const popupRect = getElementRect(popupElement);
    const viewport = getViewportSize();
    const scroll = getScrollOffset();
    // 基础位置计算
    const positions = {
        'bottom': {
            x: triggerRect.left + (triggerRect.width - popupRect.width) / 2,
            y: triggerRect.bottom + offset,
        },
        'bottom-start': {
            x: triggerRect.left,
            y: triggerRect.bottom + offset,
        },
        'bottom-end': {
            x: triggerRect.right - popupRect.width,
            y: triggerRect.bottom + offset,
        },
        'top': {
            x: triggerRect.left + (triggerRect.width - popupRect.width) / 2,
            y: triggerRect.top - popupRect.height - offset,
        },
        'top-start': {
            x: triggerRect.left,
            y: triggerRect.top - popupRect.height - offset,
        },
        'top-end': {
            x: triggerRect.right - popupRect.width,
            y: triggerRect.top - popupRect.height - offset,
        },
        'right': {
            x: triggerRect.right + offset,
            y: triggerRect.top + (triggerRect.height - popupRect.height) / 2,
        },
        'right-start': {
            x: triggerRect.right + offset,
            y: triggerRect.top,
        },
        'right-end': {
            x: triggerRect.right + offset,
            y: triggerRect.bottom - popupRect.height,
        },
        'left': {
            x: triggerRect.left - popupRect.width - offset,
            y: triggerRect.top + (triggerRect.height - popupRect.height) / 2,
        },
        'left-start': {
            x: triggerRect.left - popupRect.width - offset,
            y: triggerRect.top,
        },
        'left-end': {
            x: triggerRect.left - popupRect.width - offset,
            y: triggerRect.bottom - popupRect.height,
        },
    };
    let position = positions[placement];
    let actualPlacement = placement;
    let flipped = false;
    // 边界检测与自适应
    const overflow = {
        left: position.x < 0,
        right: position.x + popupRect.width > viewport.width,
        top: position.y < 0,
        bottom: position.y + popupRect.height > viewport.height,
    };
    // 如果溢出，尝试翻转
    if (overflow.bottom && !overflow.top && placement.startsWith('bottom')) {
        const flippedPlacement = placement.replace('bottom', 'top');
        position = positions[flippedPlacement];
        actualPlacement = flippedPlacement;
        flipped = true;
    }
    else if (overflow.top && !overflow.bottom && placement.startsWith('top')) {
        const flippedPlacement = placement.replace('top', 'bottom');
        position = positions[flippedPlacement];
        actualPlacement = flippedPlacement;
        flipped = true;
    }
    else if (overflow.right && !overflow.left && placement.startsWith('right')) {
        const flippedPlacement = placement.replace('right', 'left');
        position = positions[flippedPlacement];
        actualPlacement = flippedPlacement;
        flipped = true;
    }
    else if (overflow.left && !overflow.right && placement.startsWith('left')) {
        const flippedPlacement = placement.replace('left', 'right');
        position = positions[flippedPlacement];
        actualPlacement = flippedPlacement;
        flipped = true;
    }
    // 确保不超出视口边界
    position.x = Math.max(4, Math.min(position.x, viewport.width - popupRect.width - 4));
    position.y = Math.max(4, Math.min(position.y, viewport.height - popupRect.height - 4));
    return {
        placement,
        position,
        flipped,
        actualPlacement,
    };
}
/**
 * 检测元素是否在视口内
 */
export function isInViewport(element) {
    const rect = getElementRect(element);
    const viewport = getViewportSize();
    return (rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= viewport.height
        && rect.right <= viewport.width);
}
/**
 * 获取元素相对于另一个元素的位置
 */
export function getRelativePosition(element, relativeElement) {
    const elementRect = getElementRect(element);
    const relativeRect = getElementRect(relativeElement);
    return {
        x: elementRect.left - relativeRect.left,
        y: elementRect.top - relativeRect.top,
    };
}
//# sourceMappingURL=position-utils.js.map