/**
 * 键盘事件处理工具
 */

import { KeyCode } from '../types/events'

/**
 * 检查是否为特定按键
 */
export function isKey(event: KeyboardEvent, key: KeyCode | string): boolean {
  return event.key === key
}

/**
 * 检查是否为方向键
 */
export function isArrowKey(event: KeyboardEvent): boolean {
  return [
    KeyCode.ARROW_UP,
    KeyCode.ARROW_DOWN,
    KeyCode.ARROW_LEFT,
    KeyCode.ARROW_RIGHT,
  ].includes(event.key as KeyCode)
}

/**
 * 检查是否为导航键
 */
export function isNavigationKey(event: KeyboardEvent): boolean {
  return [
    KeyCode.ARROW_UP,
    KeyCode.ARROW_DOWN,
    KeyCode.ARROW_LEFT,
    KeyCode.ARROW_RIGHT,
    KeyCode.HOME,
    KeyCode.END,
    KeyCode.TAB,
  ].includes(event.key as KeyCode)
}

/**
 * 检查是否为激活键（Enter/Space）
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === KeyCode.ENTER || event.key === KeyCode.SPACE
}

/**
 * 检查是否按下了修饰键
 */
export function hasModifierKey(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
}

/**
 * 阻止默认行为
 */
export function preventDefault(event: Event): void {
  event.preventDefault()
}

/**
 * 阻止事件冒泡
 */
export function stopPropagation(event: Event): void {
  event.stopPropagation()
}

/**
 * 阻止默认行为和事件冒泡
 */
export function stopEvent(event: Event): void {
  preventDefault(event)
  stopPropagation(event)
}

/**
 * 创建键盘事件处理器
 */
export function createKeyboardHandler(
  handlers: Partial<Record<KeyCode | string, (event: KeyboardEvent) => void>>,
): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    const handler = handlers[event.key as KeyCode]
    if (handler) {
      handler(event)
    }
  }
}

/**
 * 获取可聚焦的元素列表
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  return Array.from(container.querySelectorAll<HTMLElement>(selector))
}

/**
 * 聚焦到第一个可聚焦元素
 */
export function focusFirst(container: HTMLElement): boolean {
  const elements = getFocusableElements(container)
  if (elements.length > 0) {
    elements[0].focus()
    return true
  }
  return false
}

/**
 * 聚焦到最后一个可聚焦元素
 */
export function focusLast(container: HTMLElement): boolean {
  const elements = getFocusableElements(container)
  if (elements.length > 0) {
    elements[elements.length - 1].focus()
    return true
  }
  return false
}

/**
 * 聚焦到下一个元素
 */
export function focusNext(container: HTMLElement, currentElement: HTMLElement): boolean {
  const elements = getFocusableElements(container)
  const currentIndex = elements.indexOf(currentElement)

  if (currentIndex !== -1 && currentIndex < elements.length - 1) {
    elements[currentIndex + 1].focus()
    return true
  }

  return false
}

/**
 * 聚焦到上一个元素
 */
export function focusPrevious(container: HTMLElement, currentElement: HTMLElement): boolean {
  const elements = getFocusableElements(container)
  const currentIndex = elements.indexOf(currentElement)

  if (currentIndex > 0) {
    elements[currentIndex - 1].focus()
    return true
  }

  return false
}


