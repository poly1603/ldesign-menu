/**
 * DOM 操作工具模块
 * 
 * @description
 * 提供一组常用的 DOM 操作辅助函数，简化元素创建、样式设置、事件绑定等操作。
 * 所有函数经过性能优化，适合在菜单组件的高频渲染场景中使用。
 */

/**
 * 创建 HTML 元素
 * 
 * @description
 * 创建指定标签的元素，可选地设置类名和属性。
 * 使用类型安全的方式确保返回正确的元素类型。
 * 
 * @template K - HTML 元素标签名类型
 * @param tag - HTML 标签名
 * @param className - CSS 类名（可选）
 * @param attributes - HTML 属性对象（可选）
 * @returns 创建的 HTML 元素
 * 
 * @example
 * ```ts
 * // 创建简单元素
 * const div = createElement('div')
 * 
 * // 创建带类名的元素
 * const menuItem = createElement('li', 'ldesign-menu-item')
 * 
 * // 创建带属性的元素
 * const link = createElement('a', 'menu-link', {
 *   href: '/home',
 *   'data-id': '1'
 * })
 * ```
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attributes?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)

  if (className) {
    element.className = className
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
  }

  return element
}

/**
 * 添加类名
 */
export function addClass(element: HTMLElement, ...classNames: string[]): void {
  element.classList.add(...classNames)
}

/**
 * 移除类名
 */
export function removeClass(element: HTMLElement, ...classNames: string[]): void {
  element.classList.remove(...classNames)
}

/**
 * 切换类名
 */
export function toggleClass(element: HTMLElement, className: string, force?: boolean): void {
  element.classList.toggle(className, force)
}

/**
 * 检查是否包含类名
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className)
}

/**
 * 设置样式
 */
export function setStyle(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration> | Record<string, string>,
): void {
  Object.entries(styles).forEach(([key, value]) => {
    // @ts-expect-error - 动态样式设置
    element.style[key] = value
  })
}

/**
 * 获取计算后的样式
 */
export function getComputedStyle(element: HTMLElement): CSSStyleDeclaration {
  return window.getComputedStyle(element)
}

/**
 * 查找最近的父元素
 */
export function closest(element: HTMLElement, selector: string): HTMLElement | null {
  return element.closest(selector) as HTMLElement | null
}

/**
 * 查询单个元素
 */
export function query(selector: string, parent: HTMLElement | Document = document): HTMLElement | null {
  return parent.querySelector(selector) as HTMLElement | null
}

/**
 * 查询所有元素
 */
export function queryAll(selector: string, parent: HTMLElement | Document = document): HTMLElement[] {
  return Array.from(parent.querySelectorAll(selector))
}

/**
 * 监听事件
 */
export function on<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Document | Window,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void {
  element.addEventListener(event, handler as EventListener, options)
}

/**
 * 移除事件监听
 */
export function off<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Document | Window,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | EventListenerOptions,
): void {
  element.removeEventListener(event, handler as EventListener, options)
}

/**
 * 一次性事件监听
 */
export function once<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Document | Window,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
): void {
  const wrappedHandler = (ev: Event) => {
    handler.call(element as HTMLElement, ev as HTMLElementEventMap[K])
    off(element, event, wrappedHandler as any)
  }
  on(element, event, wrappedHandler as any)
}

/**
 * 获取元素的数据属性
 */
export function getData(element: HTMLElement, key: string): string | null {
  return element.getAttribute(`data-${key}`)
}

/**
 * 设置元素的数据属性
 */
export function setData(element: HTMLElement, key: string, value: string): void {
  element.setAttribute(`data-${key}`, value)
}

/**
 * 移除元素的数据属性
 */
export function removeData(element: HTMLElement, key: string): void {
  element.removeAttribute(`data-${key}`)
}

/**
 * 检查元素是否包含另一个元素
 */
export function contains(parent: HTMLElement, child: HTMLElement): boolean {
  return parent.contains(child)
}

/**
 * 获取元素的索引
 */
export function getElementIndex(element: HTMLElement): number {
  return Array.from(element.parentElement?.children || []).indexOf(element)
}

/**
 * 插入 HTML
 */
export function insertHTML(element: HTMLElement, html: string, position: InsertPosition = 'beforeend'): void {
  element.insertAdjacentHTML(position, html)
}

/**
 * 移除元素
 */
export function remove(element: HTMLElement): void {
  element.remove()
}

/**
 * 清空元素内容
 */
export function empty(element: HTMLElement): void {
  element.innerHTML = ''
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: number | null = null
  let previous = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    }
    else if (!timeout) {
      timeout = window.setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}


