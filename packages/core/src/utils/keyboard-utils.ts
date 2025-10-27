/**
 * 键盘事件处理工具模块
 * 
 * @description
 * 提供键盘事件的检测、处理和导航功能。
 * 支持完整的键盘导航，包括方向键、激活键、修饰键等。
 * 遵循 WAI-ARIA 规范，提供无障碍的键盘操作体验。
 */

import { KeyCode } from '../types/events'

/**
 * 检查是否为特定按键
 * 
 * @description
 * 检测键盘事件是否对应指定的按键。
 * 
 * @param event - 键盘事件对象
 * @param key - 要检测的按键（KeyCode 枚举或字符串）
 * @returns 是否匹配指定按键
 * 
 * @example
 * ```ts
 * document.addEventListener('keydown', (e) => {
 *   if (isKey(e, KeyCode.ENTER)) {
 *     console.log('按下了 Enter 键')
 *   }
 * })
 * ```
 */
export function isKey(event: KeyboardEvent, key: KeyCode | string): boolean {
  return event.key === key
}

/**
 * 检查是否为方向键
 * 
 * @description
 * 检测键盘事件是否为四个方向键之一（上、下、左、右）。
 * 用于菜单项的键盘导航。
 * 
 * @param event - 键盘事件对象
 * @returns 是否为方向键
 * 
 * @example
 * ```ts
 * if (isArrowKey(event)) {
 *   event.preventDefault() // 阻止默认滚动行为
 *   handleArrowNavigation(event.key)
 * }
 * ```
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
 * 
 * @description
 * 检测键盘事件是否为任何导航相关的按键，包括方向键、Home、End、Tab。
 * 用于判断是否需要处理键盘导航逻辑。
 * 
 * @param event - 键盘事件对象
 * @returns 是否为导航键
 * 
 * @example
 * ```ts
 * if (isNavigationKey(event)) {
 *   // 处理键盘导航
 *   handleNavigation(event)
 * }
 * ```
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
 * 
 * @description
 * 检测是否按下了激活键（Enter 或 Space），这些键通常用于触发菜单项的点击操作。
 * 遵循 WAI-ARIA 规范，Space 和 Enter 都应该触发元素的激活操作。
 * 
 * @param event - 键盘事件对象
 * @returns 是否为激活键
 * 
 * @example
 * ```ts
 * if (isActivationKey(event)) {
 *   event.preventDefault()
 *   handleMenuItemClick(currentItem)
 * }
 * ```
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === KeyCode.ENTER || event.key === KeyCode.SPACE
}

/**
 * 检查是否按下了修饰键
 * 
 * @description
 * 检测是否同时按下了修饰键（Ctrl、Meta、Alt、Shift）。
 * 用于实现组合快捷键功能，如 Ctrl+K 打开搜索。
 * 
 * @param event - 键盘事件对象
 * @returns 是否按下了任何修饰键
 * 
 * @example
 * ```ts
 * if (event.key === 'k' && event.ctrlKey && !hasModifierKey(event)) {
 *   // 只有 Ctrl 被按下，没有其他修饰键
 *   openSearch()
 * }
 * ```
 */
export function hasModifierKey(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
}

/**
 * 阻止默认行为
 * 
 * @description
 * 阻止事件的默认行为，如按 Space 滚动页面、Enter 提交表单等。
 * 
 * @param event - 事件对象
 * 
 * @example
 * ```ts
 * // 阻止 Space 键滚动页面
 * if (event.key === ' ') {
 *   preventDefault(event)
 * }
 * ```
 */
export function preventDefault(event: Event): void {
  event.preventDefault()
}

/**
 * 阻止事件冒泡
 * 
 * @description
 * 阻止事件向父元素传播，防止触发父元素的事件监听器。
 * 
 * @param event - 事件对象
 * 
 * @example
 * ```ts
 * // 阻止键盘事件冒泡到父菜单
 * stopPropagation(event)
 * ```
 */
export function stopPropagation(event: Event): void {
  event.stopPropagation()
}

/**
 * 阻止默认行为和事件冒泡
 * 
 * @description
 * 同时阻止事件的默认行为和冒泡，完全停止事件的传播。
 * 适用于需要完全控制事件的场景。
 * 
 * @param event - 事件对象
 * 
 * @example
 * ```ts
 * // 完全控制 Enter 键事件
 * if (event.key === 'Enter') {
 *   stopEvent(event)
 *   handleEnter()
 * }
 * ```
 */
export function stopEvent(event: Event): void {
  preventDefault(event)
  stopPropagation(event)
}

/**
 * 创建键盘事件处理器
 * 
 * @description
 * 创建一个基于按键映射的事件处理函数，简化键盘事件的处理逻辑。
 * 只需要提供按键到处理函数的映射对象，即可自动分发事件。
 * 
 * @param handlers - 按键到处理函数的映射对象
 * @returns 键盘事件处理函数
 * 
 * @example
 * ```ts
 * const handler = createKeyboardHandler({
 *   [KeyCode.ARROW_UP]: (e) => focusPrevious(),
 *   [KeyCode.ARROW_DOWN]: (e) => focusNext(),
 *   [KeyCode.ENTER]: (e) => selectCurrent(),
 *   [KeyCode.ESC]: (e) => closeMenu()
 * })
 * 
 * element.addEventListener('keydown', handler)
 * ```
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
 * 
 * @description
 * 获取容器内所有可以通过键盘聚焦的元素。
 * 包括链接、按钮、输入框等交互元素，排除禁用和不可聚焦的元素。
 * 遵循无障碍规范，支持 tabindex 属性。
 * 
 * @param container - 容器元素
 * @returns 可聚焦元素数组
 * 
 * @example
 * ```ts
 * const menuContainer = document.querySelector('.menu')
 * const focusableItems = getFocusableElements(menuContainer)
 * console.log(`找到 ${focusableItems.length} 个可聚焦元素`)
 * ```
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
 * 
 * @description
 * 将焦点移动到容器内的第一个可聚焦元素。
 * 适用于 Home 键导航或菜单打开时的初始聚焦。
 * 
 * @param container - 容器元素
 * @returns 是否成功聚焦（false 表示没有可聚焦元素）
 * 
 * @example
 * ```ts
 * if (event.key === KeyCode.HOME) {
 *   event.preventDefault()
 *   focusFirst(menuContainer)
 * }
 * ```
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
 * 
 * @description
 * 将焦点移动到容器内的最后一个可聚焦元素。
 * 适用于 End 键导航。
 * 
 * @param container - 容器元素
 * @returns 是否成功聚焦（false 表示没有可聚焦元素）
 * 
 * @example
 * ```ts
 * if (event.key === KeyCode.END) {
 *   event.preventDefault()
 *   focusLast(menuContainer)
 * }
 * ```
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
 * 
 * @description
 * 将焦点从当前元素移动到下一个可聚焦元素。
 * 适用于向下箭头键或 Tab 键导航。
 * 如果当前元素是最后一个，则不移动焦点。
 * 
 * @param container - 容器元素
 * @param currentElement - 当前聚焦的元素
 * @returns 是否成功移动焦点
 * 
 * @example
 * ```ts
 * if (event.key === KeyCode.ARROW_DOWN) {
 *   event.preventDefault()
 *   focusNext(menuContainer, event.target as HTMLElement)
 * }
 * ```
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
 * 
 * @description
 * 将焦点从当前元素移动到上一个可聚焦元素。
 * 适用于向上箭头键或 Shift+Tab 键导航。
 * 如果当前元素是第一个，则不移动焦点。
 * 
 * @param container - 容器元素
 * @param currentElement - 当前聚焦的元素
 * @returns 是否成功移动焦点
 * 
 * @example
 * ```ts
 * if (event.key === KeyCode.ARROW_UP) {
 *   event.preventDefault()
 *   focusPrevious(menuContainer, event.target as HTMLElement)
 * }
 * ```
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


