/**
 * 动画控制器模块
 * 
 * @description
 * 统一管理菜单组件的所有动画效果，基于 Web Animations API (WAAPI) 实现。
 * 支持淡入淡出、滑动、缩放等多种动画类型，提供流畅的用户体验。
 */

import type { AnimationType } from '../types'
import { animate, easings, fadeIn, fadeOut, slideInBottom, slideInLeft, slideInRight, slideInTop, slideOutTop, zoomIn, zoomOut } from '../utils/animation-utils'

/**
 * 动画配置接口
 * 
 * @description
 * 定义动画的类型、持续时间和缓动函数。
 */
export interface AnimationConfig {
  /** 动画类型（fade、slide、zoom 等） */
  type: AnimationType
  /** 动画持续时间（毫秒） */
  duration: number
  /** 缓动函数（如 'ease-out'、'cubic-bezier(...)' 等） */
  easing: string
}

/**
 * 动画控制器类
 * 
 * @description
 * 管理菜单组件的所有动画效果，包括菜单项展开/收起、popup 显示/隐藏等。
 * 使用 Web Animations API 确保高性能和流畅的动画效果。
 * 自动管理动画生命周期，避免动画冲突和内存泄漏。
 * 
 * @example
 * ```ts
 * const controller = new AnimationController({
 *   type: 'slide',
 *   duration: 300,
 *   easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
 * })
 * 
 * // 播放进入动画
 * await controller.animateIn(element)
 * 
 * // 播放退出动画
 * await controller.animateOut(element)
 * 
 * // 展开动画（高度变化）
 * await controller.expand(submenuElement)
 * ```
 */
export class AnimationController {
  private config: AnimationConfig
  /** 活动动画映射表，用于跟踪和取消进行中的动画 */
  private activeAnimations: Map<HTMLElement, Animation> = new Map()

  constructor(config: Partial<AnimationConfig> = {}) {
    // 合并默认配置
    this.config = {
      type: config.type || 'slide',
      duration: config.duration || 300,
      easing: config.easing || easings.easeOut,
    }
  }

  /**
   * 更新动画配置
   * 
   * @description
   * 动态更新动画配置，新配置将应用于后续播放的动画。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * controller.updateConfig({
   *   duration: 200,  // 加快动画速度
   *   type: 'fade'    // 改用淡入淡出动画
   * })
   * ```
   */
  updateConfig(config: Partial<AnimationConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  /**
   * 播放进入动画
   * 
   * @description
   * 播放元素的进入动画（如淡入、滑入、缩放放大等）。
   * 会自动取消该元素上进行中的动画，避免冲突。
   * 
   * @param element - 要应用动画的元素
   * @param type - 动画类型（可选，默认使用配置的类型）
   * @returns Promise，动画完成时 resolve
   * 
   * @example
   * ```ts
   * await controller.animateIn(menuElement)
   * console.log('菜单已显示')
   * ```
   */
  animateIn(element: HTMLElement, type?: AnimationType): Promise<void> {
    return this.playAnimation(element, type || this.config.type, 'in')
  }

  /**
   * 播放退出动画
   * 
   * @description
   * 播放元素的退出动画（如淡出、滑出、缩放缩小等）。
   * 会自动取消该元素上进行中的动画，避免冲突。
   * 
   * @param element - 要应用动画的元素
   * @param type - 动画类型（可选，默认使用配置的类型）
   * @returns Promise，动画完成时 resolve
   * 
   * @example
   * ```ts
   * await controller.animateOut(menuElement)
   * console.log('菜单已隐藏')
   * ```
   */
  animateOut(element: HTMLElement, type?: AnimationType): Promise<void> {
    return this.playAnimation(element, type || this.config.type, 'out')
  }

  /**
   * 播放动画
   */
  private async playAnimation(
    element: HTMLElement,
    type: AnimationType,
    direction: 'in' | 'out',
  ): Promise<void> {
    // 取消之前的动画
    this.cancel(element)

    let animation: Animation

    switch (type) {
      case 'fade':
        animation = direction === 'in'
          ? fadeIn(element, this.config.duration, this.config.easing)
          : fadeOut(element, this.config.duration, this.config.easing)
        break

      case 'slide':
        // 根据方向选择滑动动画
        animation = direction === 'in'
          ? slideInBottom(element, this.config.duration, this.config.easing)
          : slideOutTop(element, this.config.duration, this.config.easing)
        break

      case 'zoom':
        animation = direction === 'in'
          ? zoomIn(element, this.config.duration, this.config.easing)
          : zoomOut(element, this.config.duration, this.config.easing)
        break

      case 'none':
        // 无动画，直接设置
        if (direction === 'in') {
          element.style.opacity = '1'
          element.style.transform = 'none'
        }
        else {
          element.style.opacity = '0'
        }
        return Promise.resolve()

      default:
        // 自定义动画或未知类型，使用淡入淡出
        animation = direction === 'in'
          ? fadeIn(element, this.config.duration, this.config.easing)
          : fadeOut(element, this.config.duration, this.config.easing)
    }

    this.activeAnimations.set(element, animation)

    try {
      await animation.finished
    }
    finally {
      this.activeAnimations.delete(element)
    }
  }

  /**
   * 展开动画（高度变化）
   * 
   * @description
   * 播放元素的展开动画，通过改变高度从 0 到实际高度实现展开效果。
   * 适用于内联式子菜单的展开动画。
   * 动画完成后会清除内联样式，让 CSS 接管，避免样式冲突。
   * 
   * @param element - 要展开的元素
   * @returns Promise，动画完成时 resolve
   * 
   * @example
   * ```ts
   * const submenu = document.querySelector('.submenu')
   * await controller.expand(submenu)
   * console.log('子菜单已展开')
   * ```
   */
  async expand(element: HTMLElement): Promise<void> {
    // 取消该元素上进行中的动画
    this.cancel(element)

    const startHeight = 0
    const endHeight = element.scrollHeight

    const animation = animate(
      element,
      [
        { height: `${startHeight}px`, opacity: 0, overflow: 'hidden' },
        { height: `${endHeight}px`, opacity: 1, overflow: 'hidden' },
      ],
      {
        duration: this.config.duration,
        easing: this.config.easing,
        fill: 'forwards',
      },
    )

    this.activeAnimations.set(element, animation)

    try {
      await animation.finished
      // 清除内联样式，让 CSS 接管，避免样式冲突
      element.style.height = ''
      element.style.overflow = ''
    }
    finally {
      this.activeAnimations.delete(element)
    }
  }

  /**
   * 收起动画（高度变化）
   * 
   * @description
   * 播放元素的收起动画，通过改变高度从实际高度到 0 实现收起效果。
   * 适用于内联式子菜单的收起动画。
   * 
   * @param element - 要收起的元素
   * @returns Promise，动画完成时 resolve
   * 
   * @example
   * ```ts
   * const submenu = document.querySelector('.submenu')
   * await controller.collapse(submenu)
   * console.log('子菜单已收起')
   * ```
   */
  async collapse(element: HTMLElement): Promise<void> {
    this.cancel(element)

    const startHeight = element.scrollHeight
    const endHeight = 0

    // 先设置确定的高度
    element.style.height = `${startHeight}px`

    const animation = animate(
      element,
      [
        { height: `${startHeight}px`, opacity: 1, overflow: 'hidden' },
        { height: `${endHeight}px`, opacity: 0, overflow: 'hidden' },
      ],
      {
        duration: this.config.duration,
        easing: this.config.easing,
        fill: 'forwards',
      },
    )

    this.activeAnimations.set(element, animation)

    try {
      await animation.finished
    }
    finally {
      this.activeAnimations.delete(element)
    }
  }

  /**
   * Popup 进入动画
   */
  async popupIn(element: HTMLElement, placement: string): Promise<void> {
    this.cancel(element)

    let animation: Animation

    // 根据定位选择动画方向
    if (placement.includes('top')) {
      animation = slideInTop(element, this.config.duration, this.config.easing)
    }
    else if (placement.includes('bottom')) {
      animation = slideInBottom(element, this.config.duration, this.config.easing)
    }
    else if (placement.includes('left')) {
      animation = slideInLeft(element, this.config.duration, this.config.easing)
    }
    else if (placement.includes('right')) {
      animation = slideInRight(element, this.config.duration, this.config.easing)
    }
    else {
      animation = fadeIn(element, this.config.duration, this.config.easing)
    }

    this.activeAnimations.set(element, animation)

    try {
      await animation.finished
    }
    finally {
      this.activeAnimations.delete(element)
    }
  }

  /**
   * Popup 退出动画
   */
  async popupOut(element: HTMLElement): Promise<void> {
    this.cancel(element)

    const animation = fadeOut(element, this.config.duration * 0.8, this.config.easing)
    this.activeAnimations.set(element, animation)

    try {
      await animation.finished
    }
    finally {
      this.activeAnimations.delete(element)
    }
  }

  /**
   * 取消元素的动画
   */
  cancel(element: HTMLElement): void {
    const animation = this.activeAnimations.get(element)
    if (animation) {
      animation.cancel()
      this.activeAnimations.delete(element)
    }
  }

  /**
   * 取消所有动画
   */
  cancelAll(): void {
    this.activeAnimations.forEach(animation => animation.cancel())
    this.activeAnimations.clear()
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.cancelAll()
  }
}


