/**
 * Popup 定位计算工具
 */
import type { PopupPlacement } from '../types/config';
import type { PopupPosition, Position, Rect } from '../types/layout';
/**
 * 获取元素的边界矩形
 */
export declare function getElementRect(element: HTMLElement): Rect;
/**
 * 获取视口尺寸
 */
export declare function getViewportSize(): {
    width: number;
    height: number;
};
/**
 * 获取滚动偏移
 */
export declare function getScrollOffset(): Position;
/**
 * 计算 Popup 位置
 */
export declare function calculatePopupPosition(triggerElement: HTMLElement, popupElement: HTMLElement, placement?: PopupPlacement, offset?: number): PopupPosition;
/**
 * 检测元素是否在视口内
 */
export declare function isInViewport(element: HTMLElement): boolean;
/**
 * 获取元素相对于另一个元素的位置
 */
export declare function getRelativePosition(element: HTMLElement, relativeElement: HTMLElement): Position;
