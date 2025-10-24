/**
 * 键盘事件处理工具
 */
import { KeyCode } from '../types/events';
/**
 * 检查是否为特定按键
 */
export declare function isKey(event: KeyboardEvent, key: KeyCode | string): boolean;
/**
 * 检查是否为方向键
 */
export declare function isArrowKey(event: KeyboardEvent): boolean;
/**
 * 检查是否为导航键
 */
export declare function isNavigationKey(event: KeyboardEvent): boolean;
/**
 * 检查是否为激活键（Enter/Space）
 */
export declare function isActivationKey(event: KeyboardEvent): boolean;
/**
 * 检查是否按下了修饰键
 */
export declare function hasModifierKey(event: KeyboardEvent): boolean;
/**
 * 阻止默认行为
 */
export declare function preventDefault(event: Event): void;
/**
 * 阻止事件冒泡
 */
export declare function stopPropagation(event: Event): void;
/**
 * 阻止默认行为和事件冒泡
 */
export declare function stopEvent(event: Event): void;
/**
 * 创建键盘事件处理器
 */
export declare function createKeyboardHandler(handlers: Partial<Record<KeyCode | string, (event: KeyboardEvent) => void>>): (event: KeyboardEvent) => void;
/**
 * 获取可聚焦的元素列表
 */
export declare function getFocusableElements(container: HTMLElement): HTMLElement[];
/**
 * 聚焦到第一个可聚焦元素
 */
export declare function focusFirst(container: HTMLElement): boolean;
/**
 * 聚焦到最后一个可聚焦元素
 */
export declare function focusLast(container: HTMLElement): boolean;
/**
 * 聚焦到下一个元素
 */
export declare function focusNext(container: HTMLElement, currentElement: HTMLElement): boolean;
/**
 * 聚焦到上一个元素
 */
export declare function focusPrevious(container: HTMLElement, currentElement: HTMLElement): boolean;
