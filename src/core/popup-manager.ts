/**
 * Popup 管理器
 */

import type { PopupPlacement } from '../types'
import { calculatePopupPosition, getElementRect } from '../utils/position-utils'
import { addClass, createElement, debounce, off, on, remove, removeClass, setStyle, throttle } from '../utils/dom-utils'

/**
 * Popup 信息
 */
interface PopupInfo {
  id: string
  element: HTMLElement
  triggerElement: HTMLElement
  placement: PopupPlacement
  onClose?: () => void
}

/**
 * Popup 管理器类
 * 
 * @description
 * 管理所有弹出式子菜单的生命周期，包括创建、定位、更新和销毁。
 * 支持自动边界检测、位置翻转、点击外部关闭等功能。
 */
export class PopupManager {
  private popups: Map<string, PopupInfo> = new Map()
  private offset = 4
  private zIndexBase = 1000

  // 保存绑定后的事件处理函数引用，用于正确解绑
  private boundHandleDocumentClick: ((event: MouseEvent) => void) | null = null
  private boundHandleDocumentKeydown: ((event: KeyboardEvent) => void) | null = null
  private boundHandleScroll: (() => void) | null = null
  private boundHandleResize: (() => void) | null = null

  constructor(offset = 4) {
    this.offset = offset

    // 在构造函数中绑定所有事件处理方法
    this.boundHandleDocumentClick = this.handleDocumentClick.bind(this)
    this.boundHandleDocumentKeydown = this.handleDocumentKeydown.bind(this)

    // 滚动和resize事件使用节流优化，减少高频调用
    // 16ms约等于60fps，确保流畅的视觉反馈
    this.boundHandleScroll = throttle(this.handleScroll.bind(this), 16)
    this.boundHandleResize = throttle(this.handleResize.bind(this), 16)

    this.setupGlobalListeners()
  }

  /**
   * 设置全局监听器
   * 
   * @description
   * 在文档和窗口上设置全局事件监听器，用于处理点击外部关闭、ESC键关闭、
   * 滚动时更新位置等功能。使用绑定的函数引用确保能够正确清理。
   * 
   * 性能优化：
   * - scroll 和 resize 事件已使用节流处理（16ms，约60fps）
   * - scroll 事件使用 passive 监听器，提升滚动性能
   */
  private setupGlobalListeners(): void {
    // 点击外部关闭（使用捕获阶段）
    if (this.boundHandleDocumentClick) {
      on(document, 'click', this.boundHandleDocumentClick, true)
    }
    // ESC 关闭
    if (this.boundHandleDocumentKeydown) {
      on(document, 'keydown', this.boundHandleDocumentKeydown)
    }
    // 滚动时更新位置（使用 passive 监听器提升性能）
    if (this.boundHandleScroll) {
      on(window, 'scroll', this.boundHandleScroll, { capture: true, passive: true })
    }
    // 窗口大小变化时更新位置
    if (this.boundHandleResize) {
      on(window, 'resize', this.boundHandleResize)
    }
  }

  /**
   * 处理文档点击
   */
  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement

    this.popups.forEach((popup) => {
      // 如果点击在 popup 或触发元素外部，关闭 popup
      if (
        !popup.element.contains(target)
        && !popup.triggerElement.contains(target)
      ) {
        this.close(popup.id)
      }
    })
  }

  /**
   * 处理文档键盘事件
   */
  private handleDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // 关闭最顶层的 popup
      const lastPopup = Array.from(this.popups.values()).pop()
      if (lastPopup) {
        this.close(lastPopup.id)
      }
    }
  }

  /**
   * 处理滚动
   */
  private handleScroll(): void {
    this.popups.forEach((popup) => {
      this.updatePosition(popup.id)
    })
  }

  /**
   * 处理窗口大小变化
   */
  private handleResize(): void {
    this.popups.forEach((popup) => {
      this.updatePosition(popup.id)
    })
  }

  /**
   * 打开 Popup
   */
  open(
    id: string,
    triggerElement: HTMLElement,
    content: HTMLElement | string,
    placement: PopupPlacement = 'bottom-start',
    onClose?: () => void,
  ): HTMLElement {
    // 如果已存在，先关闭
    if (this.popups.has(id)) {
      this.close(id)
    }

    // 创建 popup 元素
    const popupElement = createElement('div', 'ldesign-menu-popup', {
      'data-popup-id': id,
      'role': 'menu',
    })

    // 设置内容
    if (typeof content === 'string') {
      popupElement.innerHTML = content
    }
    else {
      popupElement.appendChild(content)
    }

    // 设置初始样式
    setStyle(popupElement, {
      position: 'fixed',
      visibility: 'hidden',
      zIndex: String(this.zIndexBase + this.popups.size),
    })

    // 添加到 body
    document.body.appendChild(popupElement)

    // 计算位置
    const popupInfo: PopupInfo = {
      id,
      element: popupElement,
      triggerElement,
      placement,
      onClose,
    }

    this.popups.set(id, popupInfo)

    // 等待下一帧再计算位置（确保元素已渲染）
    requestAnimationFrame(() => {
      this.updatePosition(id)
      setStyle(popupElement, {
        visibility: 'visible',
      })
      addClass(popupElement, 'ldesign-menu-popup--visible')
    })

    return popupElement
  }

  /**
   * 更新 Popup 位置
   */
  updatePosition(id: string): void {
    const popup = this.popups.get(id)
    if (!popup) {
      return
    }

    const { element, triggerElement, placement } = popup
    const position = calculatePopupPosition(triggerElement, element, placement, this.offset)

    setStyle(element, {
      left: `${position.position.x}px`,
      top: `${position.position.y}px`,
    })

    // 更新定位类名
    removeClass(
      element,
      'ldesign-menu-popup--top',
      'ldesign-menu-popup--bottom',
      'ldesign-menu-popup--left',
      'ldesign-menu-popup--right',
    )

    if (position.actualPlacement.includes('top')) {
      addClass(element, 'ldesign-menu-popup--top')
    }
    else if (position.actualPlacement.includes('bottom')) {
      addClass(element, 'ldesign-menu-popup--bottom')
    }
    else if (position.actualPlacement.includes('left')) {
      addClass(element, 'ldesign-menu-popup--left')
    }
    else if (position.actualPlacement.includes('right')) {
      addClass(element, 'ldesign-menu-popup--right')
    }
  }

  /**
   * 关闭 Popup
   */
  close(id: string): void {
    const popup = this.popups.get(id)
    if (!popup) {
      return
    }

    const { element, onClose } = popup

    // 移除 DOM
    remove(element)

    // 从映射中删除
    this.popups.delete(id)

    // 触发关闭回调
    if (onClose) {
      onClose()
    }
  }

  /**
   * 关闭所有 Popup
   */
  closeAll(): void {
    const ids = Array.from(this.popups.keys())
    ids.forEach(id => this.close(id))
  }

  /**
   * 检查 Popup 是否打开
   */
  isOpen(id: string): boolean {
    return this.popups.has(id)
  }

  /**
   * 获取 Popup 元素
   */
  getPopup(id: string): HTMLElement | undefined {
    return this.popups.get(id)?.element
  }

  /**
   * 设置偏移量
   */
  setOffset(offset: number): void {
    this.offset = offset
    // 更新所有 popup 的位置
    this.popups.forEach((_, id) => {
      this.updatePosition(id)
    })
  }

  /**
   * 销毁
   * 
   * @description
   * 清理所有popup和事件监听器，释放资源，防止内存泄漏。
   * 应在组件卸载时调用此方法。
   */
  destroy(): void {
    // 关闭所有 popup
    this.closeAll()

    // 使用保存的函数引用移除全局监听器
    if (this.boundHandleDocumentClick) {
      off(document, 'click', this.boundHandleDocumentClick, true)
    }
    if (this.boundHandleDocumentKeydown) {
      off(document, 'keydown', this.boundHandleDocumentKeydown)
    }
    if (this.boundHandleScroll) {
      off(window, 'scroll', this.boundHandleScroll, { capture: true, passive: true } as any)
    }
    if (this.boundHandleResize) {
      off(window, 'resize', this.boundHandleResize)
    }

    // 清空函数引用
    this.boundHandleDocumentClick = null
    this.boundHandleDocumentKeydown = null
    this.boundHandleScroll = null
    this.boundHandleResize = null
  }
}


