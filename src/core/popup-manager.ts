/**
 * Popup 管理器
 */

import type { PopupPlacement } from '../types'
import { calculatePopupPosition, getElementRect } from '../utils/position-utils'
import { addClass, createElement, off, on, remove, removeClass, setStyle } from '../utils/dom-utils'

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
 */
export class PopupManager {
  private popups: Map<string, PopupInfo> = new Map()
  private offset = 4
  private zIndexBase = 1000

  constructor(offset = 4) {
    this.offset = offset
    this.setupGlobalListeners()
  }

  /**
   * 设置全局监听器
   */
  private setupGlobalListeners(): void {
    // 点击外部关闭
    on(document, 'click', this.handleDocumentClick.bind(this), true)
    // ESC 关闭
    on(document, 'keydown', this.handleDocumentKeydown.bind(this))
    // 滚动时更新位置
    on(window, 'scroll', this.handleScroll.bind(this), true)
    // 窗口大小变化时更新位置
    on(window, 'resize', this.handleResize.bind(this))
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
   */
  destroy(): void {
    // 关闭所有 popup
    this.closeAll()

    // 移除全局监听器
    off(document, 'click', this.handleDocumentClick.bind(this), true)
    off(document, 'keydown', this.handleDocumentKeydown.bind(this))
    off(window, 'scroll', this.handleScroll.bind(this), true)
    off(window, 'resize', this.handleResize.bind(this))
  }
}


