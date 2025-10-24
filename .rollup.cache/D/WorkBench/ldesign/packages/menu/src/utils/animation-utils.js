/**
 * 动画工具函数
 */
/**
 * 动画缓动函数
 */
export const easings = {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
};
/**
 * 使用 Web Animations API 创建动画
 */
export function animate(element, keyframes, options) {
    return element.animate(keyframes, options);
}
/**
 * 淡入动画
 */
export function fadeIn(element, duration = 300, easing = easings.easeOut) {
    return animate(element, [
        { opacity: 0 },
        { opacity: 1 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 淡出动画
 */
export function fadeOut(element, duration = 300, easing = easings.easeIn) {
    return animate(element, [
        { opacity: 1 },
        { opacity: 0 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 滑入动画（从上）
 */
export function slideInTop(element, duration = 300, easing = easings.easeOut) {
    return animate(element, [
        { transform: 'translateY(-20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 滑出动画（向上）
 */
export function slideOutTop(element, duration = 300, easing = easings.easeIn) {
    return animate(element, [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-20px)', opacity: 0 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 滑入动画（从下）
 */
export function slideInBottom(element, duration = 300, easing = easings.easeOut) {
    return animate(element, [
        { transform: 'translateY(20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 滑出动画（向下）
 */
export function slideOutBottom(element, duration = 300, easing = easings.easeIn) {
    return animate(element, [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(20px)', opacity: 0 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 滑入动画（从左）
 */
export function slideInLeft(element, duration = 300, easing = easings.easeOut) {
    return animate(element, [
        { transform: 'translateX(-20px)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 滑入动画（从右）
 */
export function slideInRight(element, duration = 300, easing = easings.easeOut) {
    return animate(element, [
        { transform: 'translateX(20px)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 缩放动画（放大）
 */
export function zoomIn(element, duration = 300, easing = easings.easeOut) {
    return animate(element, [
        { transform: 'scale(0.9)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 缩放动画（缩小）
 */
export function zoomOut(element, duration = 300, easing = easings.easeIn) {
    return animate(element, [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.9)', opacity: 0 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 展开动画（高度）
 */
export function expandHeight(element, duration = 300, easing = easings.easeOut) {
    const startHeight = element.scrollHeight;
    return animate(element, [
        { height: '0px', opacity: 0 },
        { height: `${startHeight}px`, opacity: 1 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 收起动画（高度）
 */
export function collapseHeight(element, duration = 300, easing = easings.easeIn) {
    const currentHeight = element.scrollHeight;
    return animate(element, [
        { height: `${currentHeight}px`, opacity: 1 },
        { height: '0px', opacity: 0 },
    ], {
        duration,
        easing,
        fill: 'forwards',
    });
}
/**
 * 执行动画序列
 */
export async function animateSequence(animations) {
    for (const animationFn of animations) {
        const animation = await animationFn();
        await animation.finished;
    }
}
/**
 * 并行执行动画
 */
export async function animateParallel(animations) {
    const animationPromises = animations.map(async (animationFn) => {
        const animation = await animationFn();
        return animation.finished;
    });
    await Promise.all(animationPromises);
}
/**
 * requestAnimationFrame 封装
 */
export function raf(callback) {
    return window.requestAnimationFrame(callback);
}
/**
 * cancelAnimationFrame 封装
 */
export function caf(id) {
    window.cancelAnimationFrame(id);
}
//# sourceMappingURL=animation-utils.js.map