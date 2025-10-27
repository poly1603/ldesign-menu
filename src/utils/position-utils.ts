/**
 * Popup 定位计算工具模块
 * 
 * @description
 * 提供弹出式子菜单的精确定位计算功能。
 * 支持12个方位定位、自动边界检测、智能位置翻转等功能。
 * 确保 popup 始终在视口内可见，提供最佳的用户体验。
 */

import type { PopupPlacement } from '../types/config'
import type { PopupPosition, Position, Rect } from '../types/layout'

/**
 * 获取元素的边界矩形
 * 
 * @description
 * 获取元素相对于视口的位置和尺寸信息。
 * 使用原生 getBoundingClientRect() API，性能优异。
 * 
 * @param element - 目标元素
 * @returns 包含位置和尺寸的矩形对象
 * 
 * @example
 * ```ts
 * const menuItem = document.querySelector('.menu-item')
 * const rect = getElementRect(menuItem)
 * console.log(`位置: (${rect.left}, ${rect.top})`)
 * console.log(`尺寸: ${rect.width} x ${rect.height}`)
 * ```
 */
export function getElementRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  }
}

/**
 * 获取视口尺寸
 * 
 * @description
 * 获取浏览器视口（可见区域）的宽度和高度。
 * 兼容不同浏览器的实现方式。
 * 
 * @returns 包含宽度和高度的对象
 * 
 * @example
 * ```ts
 * const viewport = getViewportSize()
 * console.log(`视口尺寸: ${viewport.width} x ${viewport.height}`)
 * 
 * // 判断是否移动端
 * if (viewport.width < 768) {
 *   console.log('移动端设备')
 * }
 * ```
 */
export function getViewportSize(): { width: number, height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  }
}

/**
 * 获取滚动偏移
 * 
 * @description
 * 获取页面的滚动偏移量（水平和垂直）。
 * 兼容不同浏览器的实现方式。
 * 
 * @returns 包含 x 和 y 坐标的位置对象
 * 
 * @example
 * ```ts
 * const scroll = getScrollOffset()
 * console.log(`页面滚动位置: (${scroll.x}, ${scroll.y})`)
 * ```
 */
export function getScrollOffset(): Position {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  }
}

/**
 * 计算 Popup 位置
 * 
 * @description
 * 计算弹出式子菜单的精确位置，支持12个方位定位。
 * 自动进行边界检测，当空间不足时智能翻转位置。
 * 确保 popup 始终在视口内完全可见。
 * 
 * @param triggerElement - 触发元素（如菜单项）
 * @param popupElement - 弹出元素（子菜单）
 * @param placement - 期望的定位方式，默认 'bottom-start'
 * @param offset - 与触发元素的间距（像素），默认 4px
 * @returns 包含位置、是否翻转等信息的对象
 * 
 * @example
 * ```ts
 * const trigger = document.querySelector('.menu-item')
 * const popup = document.querySelector('.submenu-popup')
 * 
 * const position = calculatePopupPosition(
 *   trigger,
 *   popup,
 *   'bottom-start',
 *   8
 * )
 * 
 * popup.style.left = `${position.position.x}px`
 * popup.style.top = `${position.position.y}px`
 * 
 * if (position.flipped) {
 *   console.log(`位置已翻转至: ${position.actualPlacement}`)
 * }
 * ```
 */
export function calculatePopupPosition(
  triggerElement: HTMLElement,
  popupElement: HTMLElement,
  placement: PopupPlacement = 'bottom-start',
  offset = 4,
): PopupPosition {
  const triggerRect = getElementRect(triggerElement)
  const popupRect = getElementRect(popupElement)
  const viewport = getViewportSize()
  const scroll = getScrollOffset()

  // 基础位置计算
  const positions: Record<PopupPlacement, Position> = {
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
  }

  let position = positions[placement]
  let actualPlacement = placement
  let flipped = false

  // 边界检测与自适应
  const overflow = {
    left: position.x < 0,
    right: position.x + popupRect.width > viewport.width,
    top: position.y < 0,
    bottom: position.y + popupRect.height > viewport.height,
  }

  // 如果溢出，尝试翻转
  if (overflow.bottom && !overflow.top && placement.startsWith('bottom')) {
    const flippedPlacement = placement.replace('bottom', 'top') as PopupPlacement
    position = positions[flippedPlacement]
    actualPlacement = flippedPlacement
    flipped = true
  }
  else if (overflow.top && !overflow.bottom && placement.startsWith('top')) {
    const flippedPlacement = placement.replace('top', 'bottom') as PopupPlacement
    position = positions[flippedPlacement]
    actualPlacement = flippedPlacement
    flipped = true
  }
  else if (overflow.right && !overflow.left && placement.startsWith('right')) {
    const flippedPlacement = placement.replace('right', 'left') as PopupPlacement
    position = positions[flippedPlacement]
    actualPlacement = flippedPlacement
    flipped = true
  }
  else if (overflow.left && !overflow.right && placement.startsWith('left')) {
    const flippedPlacement = placement.replace('left', 'right') as PopupPlacement
    position = positions[flippedPlacement]
    actualPlacement = flippedPlacement
    flipped = true
  }

  // 确保不超出视口边界
  position.x = Math.max(4, Math.min(position.x, viewport.width - popupRect.width - 4))
  position.y = Math.max(4, Math.min(position.y, viewport.height - popupRect.height - 4))

  return {
    placement,
    position,
    flipped,
    actualPlacement,
  }
}

/**
 * 检测元素是否在视口内
 * 
 * @description
 * 判断元素是否完全在浏览器视口可见区域内。
 * 用于判断菜单项或 popup 是否需要滚动到视口内。
 * 
 * @param element - 要检测的元素
 * @returns 是否完全在视口内
 * 
 * @example
 * ```ts
 * const menuItem = document.querySelector('.menu-item')
 * 
 * if (!isInViewport(menuItem)) {
 *   // 滚动到视口内
 *   menuItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
 * }
 * ```
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = getElementRect(element)
  const viewport = getViewportSize()

  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= viewport.height
    && rect.right <= viewport.width
  )
}

/**
 * 获取元素相对于另一个元素的位置
 * 
 * @description
 * 计算一个元素相对于另一个元素的相对位置。
 * 用于计算子菜单相对于父菜单的偏移量等场景。
 * 
 * @param element - 目标元素
 * @param relativeElement - 参照元素
 * @returns 相对位置坐标
 * 
 * @example
 * ```ts
 * const child = document.querySelector('.submenu')
 * const parent = document.querySelector('.menu')
 * 
 * const relativePos = getRelativePosition(child, parent)
 * console.log(`子菜单相对父菜单的位置: (${relativePos.x}, ${relativePos.y})`)
 * ```
 */
export function getRelativePosition(
  element: HTMLElement,
  relativeElement: HTMLElement,
): Position {
  const elementRect = getElementRect(element)
  const relativeRect = getElementRect(relativeElement)

  return {
    x: elementRect.left - relativeRect.left,
    y: elementRect.top - relativeRect.top,
  }
}


