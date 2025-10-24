/**
 * 动画控制器
 */

import type { AnimationType } from '../types'
import { animate, easings, fadeIn, fadeOut, slideInBottom, slideInLeft, slideInRight, slideInTop, zoomIn, zoomOut } from '../utils/animation-utils'

/**
 * 动画配置
 */
export interface AnimationConfig {
  type: AnimationType
  duration: number
  easing: string
}

/**
 * 动画控制器类
 */
export class AnimationController {
  private config: AnimationConfig
  private activeAnimations: Map<HTMLElement, Animation> = new Map()

  constructor(config: Partial<AnimationConfig> = {}) {
    this.config = {
      type: config.type || 'slide',
      duration: config.duration || 300,
      easing: config.easing || easings.easeOut,
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<AnimationConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  /**
   * 播放进入动画
   */
  animateIn(element: HTMLElement, type?: AnimationType): Promise<void> {
    return this.playAnimation(element, type || this.config.type, 'in')
  }

  /**
   * 播放退出动画
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
   * 展开动画（高度）
   */
  async expand(element: HTMLElement): Promise<void> {
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
      // 清除内联样式，让 CSS 接管
      element.style.height = ''
      element.style.overflow = ''
    }
    finally {
      this.activeAnimations.delete(element)
    }
  }

  /**
   * 收起动画（高度）
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


