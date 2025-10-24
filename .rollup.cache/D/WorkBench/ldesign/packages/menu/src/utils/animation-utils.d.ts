/**
 * 动画工具函数
 */
/**
 * 动画缓动函数
 */
export declare const easings: {
    readonly linear: "linear";
    readonly ease: "ease";
    readonly easeIn: "cubic-bezier(0.4, 0, 1, 1)";
    readonly easeOut: "cubic-bezier(0, 0, 0.2, 1)";
    readonly easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
    readonly easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    readonly easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)";
    readonly easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)";
    readonly easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)";
    readonly easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)";
};
/**
 * 使用 Web Animations API 创建动画
 */
export declare function animate(element: HTMLElement, keyframes: Keyframe[] | PropertyIndexedKeyframes, options?: number | KeyframeAnimationOptions): Animation;
/**
 * 淡入动画
 */
export declare function fadeIn(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0, 0, 0.2, 1)"): Animation;
/**
 * 淡出动画
 */
export declare function fadeOut(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0.4, 0, 1, 1)"): Animation;
/**
 * 滑入动画（从上）
 */
export declare function slideInTop(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0, 0, 0.2, 1)"): Animation;
/**
 * 滑出动画（向上）
 */
export declare function slideOutTop(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0.4, 0, 1, 1)"): Animation;
/**
 * 滑入动画（从下）
 */
export declare function slideInBottom(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0, 0, 0.2, 1)"): Animation;
/**
 * 滑出动画（向下）
 */
export declare function slideOutBottom(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0.4, 0, 1, 1)"): Animation;
/**
 * 滑入动画（从左）
 */
export declare function slideInLeft(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0, 0, 0.2, 1)"): Animation;
/**
 * 滑入动画（从右）
 */
export declare function slideInRight(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0, 0, 0.2, 1)"): Animation;
/**
 * 缩放动画（放大）
 */
export declare function zoomIn(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0, 0, 0.2, 1)"): Animation;
/**
 * 缩放动画（缩小）
 */
export declare function zoomOut(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0.4, 0, 1, 1)"): Animation;
/**
 * 展开动画（高度）
 */
export declare function expandHeight(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0, 0, 0.2, 1)"): Animation;
/**
 * 收起动画（高度）
 */
export declare function collapseHeight(element: HTMLElement, duration?: number, easing?: "cubic-bezier(0.4, 0, 1, 1)"): Animation;
/**
 * 执行动画序列
 */
export declare function animateSequence(animations: Array<() => Animation | Promise<Animation>>): Promise<void>;
/**
 * 并行执行动画
 */
export declare function animateParallel(animations: Array<() => Animation | Promise<Animation>>): Promise<void>;
/**
 * requestAnimationFrame 封装
 */
export declare function raf(callback: FrameRequestCallback): number;
/**
 * cancelAnimationFrame 封装
 */
export declare function caf(id: number): void;
