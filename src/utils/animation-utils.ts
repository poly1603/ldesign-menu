/**
 * 动画工具函数模块
 * 
 * @description
 * 基于 Web Animations API (WAAPI) 封装的动画工具函数集合。
 * 提供常用的动画效果（淡入淡出、滑动、缩放等）和缓动函数。
 * 所有动画都是高性能的，使用浏览器原生 API 实现。
 */

/**
 * 动画缓动函数常量
 * 
 * @description
 * 预定义的缓动函数集合，使用 cubic-bezier 曲线定义动画速度曲线。
 * 基于 Material Design 和常见动画库的标准缓动函数。
 * 
 * @example
 * ```ts
 * import { easings } from '@ldesign/menu/utils'
 * 
 * element.animate(keyframes, {
 *   duration: 300,
 *   easing: easings.easeOut  // 使用预定义缓动
 * })
 * ```
 */
export const easings = {
  /** 线性缓动，速度恒定 */
  linear: 'linear',
  /** 标准缓动 */
  ease: 'ease',
  /** 缓入，动画开始时慢后加速 */
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  /** 缓出，动画结束时减速（推荐用于进入动画） */
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  /** 缓入缓出，开始和结束时都减速 */
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** 二次缓入 */
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  /** 二次缓出 */
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  /** 二次缓入缓出 */
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  /** 三次缓入 */
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  /** 三次缓出 */
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  /** 三次缓入缓出 */
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
} as const

/**
 * 使用 Web Animations API 创建动画
 * 
 * @description
 * 对原生 element.animate() 方法的封装，提供类型安全和更好的语义。
 * 
 * @param element - 要应用动画的元素
 * @param keyframes - 关键帧数组或关键帧对象
 * @param options - 动画选项（持续时间或配置对象）
 * @returns Animation 对象，可用于控制动画
 * 
 * @example
 * ```ts
 * const animation = animate(element, [
 *   { opacity: 0, transform: 'scale(0.9)' },
 *   { opacity: 1, transform: 'scale(1)' }
 * ], {
 *   duration: 300,
 *   easing: easings.easeOut,
 *   fill: 'forwards'
 * })
 * 
 * await animation.finished
 * ```
 */
export function animate(
  element: HTMLElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options?: number | KeyframeAnimationOptions,
): Animation {
  return element.animate(keyframes, options)
}

/**
 * 淡入动画
 * 
 * @description
 * 元素从透明渐变到不透明的动画效果。
 * 适用于元素出现、显示等场景。
 * 
 * @param element - 要应用动画的元素
 * @param duration - 动画持续时间（毫秒），默认 300ms
 * @param easing - 缓动函数，默认使用 easeOut
 * @returns Animation 对象
 * 
 * @example
 * ```ts
 * await fadeIn(popupElement, 200)
 * console.log('淡入动画完成')
 * ```
 */
export function fadeIn(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeOut,
): Animation {
  return animate(
    element,
    [
      { opacity: 0 },
      { opacity: 1 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 淡出动画
 * 
 * @description
 * 元素从不透明渐变到透明的动画效果。
 * 适用于元素隐藏、消失等场景。
 * 
 * @param element - 要应用动画的元素
 * @param duration - 动画持续时间（毫秒），默认 300ms
 * @param easing - 缓动函数，默认使用 easeIn
 * @returns Animation 对象
 * 
 * @example
 * ```ts
 * await fadeOut(modalElement, 200)
 * modalElement.remove() // 动画完成后移除元素
 * ```
 */
export function fadeOut(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeIn,
): Animation {
  return animate(
    element,
    [
      { opacity: 1 },
      { opacity: 0 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 滑入动画（从上）
 * 
 * @description
 * 元素从上方滑入的动画效果。
 * 使用 translate3d 启用 GPU 加速，确保动画流畅。
 * 
 * @param element - 要应用动画的元素
 * @param duration - 动画持续时间（毫秒），默认 300ms
 * @param easing - 缓动函数，默认使用 easeOut
 * @returns Animation 对象
 */
export function slideInTop(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeOut,
): Animation {
  return animate(
    element,
    [
      { transform: 'translate3d(0, -20px, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 滑出动画（向上）
 * 
 * @description
 * 元素向上滑出的动画效果。
 * 使用 translate3d 启用 GPU 加速。
 * 
 * @param element - 要应用动画的元素
 * @param duration - 动画持续时间（毫秒），默认 300ms
 * @param easing - 缓动函数，默认使用 easeIn
 * @returns Animation 对象
 */
export function slideOutTop(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeIn,
): Animation {
  return animate(
    element,
    [
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      { transform: 'translate3d(0, -20px, 0)', opacity: 0 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 滑入动画（从下）
 * 
 * @description
 * 元素从下方滑入的动画效果。使用 translate3d 启用 GPU 加速。
 */
export function slideInBottom(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeOut,
): Animation {
  return animate(
    element,
    [
      { transform: 'translate3d(0, 20px, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 滑出动画（向下）
 * 
 * @description
 * 元素向下滑出的动画效果。使用 translate3d 启用 GPU 加速。
 */
export function slideOutBottom(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeIn,
): Animation {
  return animate(
    element,
    [
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      { transform: 'translate3d(0, 20px, 0)', opacity: 0 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 滑入动画（从左）
 * 
 * @description
 * 元素从左侧滑入的动画效果。使用 translate3d 启用 GPU 加速。
 */
export function slideInLeft(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeOut,
): Animation {
  return animate(
    element,
    [
      { transform: 'translate3d(-20px, 0, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 滑入动画（从右）
 * 
 * @description
 * 元素从右侧滑入的动画效果。使用 translate3d 启用 GPU 加速。
 */
export function slideInRight(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeOut,
): Animation {
  return animate(
    element,
    [
      { transform: 'translate3d(20px, 0, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 缩放动画（放大）
 * 
 * @description
 * 元素从小到大的缩放动画效果。
 * 使用 scale3d 启用 GPU 加速，确保动画流畅。
 * 
 * @param element - 要应用动画的元素
 * @param duration - 动画持续时间（毫秒），默认 300ms
 * @param easing - 缓动函数，默认使用 easeOut
 * @returns Animation 对象
 */
export function zoomIn(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeOut,
): Animation {
  return animate(
    element,
    [
      { transform: 'scale3d(0.9, 0.9, 1)', opacity: 0 },
      { transform: 'scale3d(1, 1, 1)', opacity: 1 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 缩放动画（缩小）
 * 
 * @description
 * 元素从大到小的缩放动画效果。
 * 使用 scale3d 启用 GPU 加速。
 * 
 * @param element - 要应用动画的元素
 * @param duration - 动画持续时间（毫秒），默认 300ms
 * @param easing - 缓动函数，默认使用 easeIn
 * @returns Animation 对象
 */
export function zoomOut(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeIn,
): Animation {
  return animate(
    element,
    [
      { transform: 'scale3d(1, 1, 1)', opacity: 1 },
      { transform: 'scale3d(0.9, 0.9, 1)', opacity: 0 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 展开动画（高度）
 */
export function expandHeight(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeOut,
): Animation {
  const startHeight = element.scrollHeight
  return animate(
    element,
    [
      { height: '0px', opacity: 0 },
      { height: `${startHeight}px`, opacity: 1 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 收起动画（高度）
 */
export function collapseHeight(
  element: HTMLElement,
  duration = 300,
  easing = easings.easeIn,
): Animation {
  const currentHeight = element.scrollHeight
  return animate(
    element,
    [
      { height: `${currentHeight}px`, opacity: 1 },
      { height: '0px', opacity: 0 },
    ],
    {
      duration,
      easing,
      fill: 'forwards',
    },
  )
}

/**
 * 执行动画序列
 */
export async function animateSequence(
  animations: Array<() => Animation | Promise<Animation>>,
): Promise<void> {
  for (const animationFn of animations) {
    const animation = await animationFn()
    await animation.finished
  }
}

/**
 * 并行执行动画
 */
export async function animateParallel(
  animations: Array<() => Animation | Promise<Animation>>,
): Promise<void> {
  const animationPromises = animations.map(async animationFn => {
    const animation = await animationFn()
    return animation.finished
  })
  await Promise.all(animationPromises)
}

/**
 * requestAnimationFrame 封装
 */
export function raf(callback: FrameRequestCallback): number {
  return window.requestAnimationFrame(callback)
}

/**
 * cancelAnimationFrame 封装
 */
export function caf(id: number): void {
  window.cancelAnimationFrame(id)
}


