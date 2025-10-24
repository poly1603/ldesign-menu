/**
 * 键盘事件处理工具
 */
import { KeyCode } from '../types/events';
/**
 * 检查是否为特定按键
 */
export function isKey(event, key) {
    return event.key === key;
}
/**
 * 检查是否为方向键
 */
export function isArrowKey(event) {
    return [
        KeyCode.ARROW_UP,
        KeyCode.ARROW_DOWN,
        KeyCode.ARROW_LEFT,
        KeyCode.ARROW_RIGHT,
    ].includes(event.key);
}
/**
 * 检查是否为导航键
 */
export function isNavigationKey(event) {
    return [
        KeyCode.ARROW_UP,
        KeyCode.ARROW_DOWN,
        KeyCode.ARROW_LEFT,
        KeyCode.ARROW_RIGHT,
        KeyCode.HOME,
        KeyCode.END,
        KeyCode.TAB,
    ].includes(event.key);
}
/**
 * 检查是否为激活键（Enter/Space）
 */
export function isActivationKey(event) {
    return event.key === KeyCode.ENTER || event.key === KeyCode.SPACE;
}
/**
 * 检查是否按下了修饰键
 */
export function hasModifierKey(event) {
    return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
}
/**
 * 阻止默认行为
 */
export function preventDefault(event) {
    event.preventDefault();
}
/**
 * 阻止事件冒泡
 */
export function stopPropagation(event) {
    event.stopPropagation();
}
/**
 * 阻止默认行为和事件冒泡
 */
export function stopEvent(event) {
    preventDefault(event);
    stopPropagation(event);
}
/**
 * 创建键盘事件处理器
 */
export function createKeyboardHandler(handlers) {
    return (event) => {
        const handler = handlers[event.key];
        if (handler) {
            handler(event);
        }
    };
}
/**
 * 获取可聚焦的元素列表
 */
export function getFocusableElements(container) {
    const selector = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    return Array.from(container.querySelectorAll(selector));
}
/**
 * 聚焦到第一个可聚焦元素
 */
export function focusFirst(container) {
    const elements = getFocusableElements(container);
    if (elements.length > 0) {
        elements[0].focus();
        return true;
    }
    return false;
}
/**
 * 聚焦到最后一个可聚焦元素
 */
export function focusLast(container) {
    const elements = getFocusableElements(container);
    if (elements.length > 0) {
        elements[elements.length - 1].focus();
        return true;
    }
    return false;
}
/**
 * 聚焦到下一个元素
 */
export function focusNext(container, currentElement) {
    const elements = getFocusableElements(container);
    const currentIndex = elements.indexOf(currentElement);
    if (currentIndex !== -1 && currentIndex < elements.length - 1) {
        elements[currentIndex + 1].focus();
        return true;
    }
    return false;
}
/**
 * 聚焦到上一个元素
 */
export function focusPrevious(container, currentElement) {
    const elements = getFocusableElements(container);
    const currentIndex = elements.indexOf(currentElement);
    if (currentIndex > 0) {
        elements[currentIndex - 1].focus();
        return true;
    }
    return false;
}
//# sourceMappingURL=keyboard-utils.js.map