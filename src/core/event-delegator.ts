/**
 * 事件委托器
 */

import { KeyCode } from '../types/events'
import { closest, getData, off, on } from '../utils/dom-utils'
import {
  createKeyboardHandler,
  focusFirst,
  focusLast,
  focusNext,
  focusPrevious,
  isActivationKey,
  isArrowKey,
} from '../utils/keyboard-utils'

/**
 * 事件委托器配置
 */
export interface EventDelegatorConfig {
  onItemClick?: (itemId: string | number, event: MouseEvent) => void
  onItemHover?: (itemId: string | number, event: MouseEvent) => void
  onItemFocus?: (itemId: string | number, event: FocusEvent) => void
  onItemBlur?: (itemId: string | number, event: FocusEvent) => void
  onKeyboardNav?: (key: string, itemId: string | number, event: KeyboardEvent) => void
}

/**
 * 事件委托器类
 * 
 * @description
 * 使用事件委托模式管理菜单的所有用户交互事件，包括点击、悬停和键盘导航。
 * 通过在容器元素上绑定事件监听器，减少内存占用并提升性能。
 */
export class EventDelegator {
  private container: HTMLElement | null = null
  private config: EventDelegatorConfig
  private keyboardEnabled = true

  // 保存绑定后的事件处理函数引用，用于正确解绑
  private boundHandleClick: ((event: MouseEvent) => void) | null = null
  private boundHandleMouseEnter: ((event: MouseEvent) => void) | null = null
  private boundHandleMouseLeave: ((event: MouseEvent) => void) | null = null
  private boundHandleKeydown: ((event: KeyboardEvent) => void) | null = null
  private boundHandleFocus: ((event: FocusEvent) => void) | null = null
  private boundHandleBlur: ((event: FocusEvent) => void) | null = null

  constructor(config: EventDelegatorConfig = {}) {
    this.config = config

    // 在构造函数中绑定所有事件处理方法，避免内存泄漏
    this.boundHandleClick = this.handleClick.bind(this)
    this.boundHandleMouseEnter = this.handleMouseEnter.bind(this)
    this.boundHandleMouseLeave = this.handleMouseLeave.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    this.boundHandleFocus = this.handleFocus.bind(this)
    this.boundHandleBlur = this.handleBlur.bind(this)
  }

  /**
   * 绑定容器
   * 
   * @description
   * 将事件监听器绑定到容器元素上，使用事件委托模式处理所有子元素的事件。
   * 
   * @param container - 要绑定事件的容器元素
   */
  attach(container: HTMLElement): void {
    if (this.container) {
      this.detach()
    }

    this.container = container

    // 点击事件
    if (this.boundHandleClick) {
      on(container, 'click', this.boundHandleClick)
    }

    // 鼠标悬停事件（使用捕获阶段以便更早响应）
    if (this.boundHandleMouseEnter) {
      on(container, 'mouseenter', this.boundHandleMouseEnter, true)
    }
    if (this.boundHandleMouseLeave) {
      on(container, 'mouseleave', this.boundHandleMouseLeave, true)
    }

    // 键盘导航
    if (this.keyboardEnabled) {
      if (this.boundHandleKeydown) {
        on(container, 'keydown', this.boundHandleKeydown)
      }
      if (this.boundHandleFocus) {
        on(container, 'focus', this.boundHandleFocus, true)
      }
      if (this.boundHandleBlur) {
        on(container, 'blur', this.boundHandleBlur, true)
      }
    }
  }

  /**
   * 解绑容器
   * 
   * @description
   * 移除所有事件监听器，释放资源，防止内存泄漏。
   * 使用保存的函数引用确保能够正确移除监听器。
   */
  detach(): void {
    if (!this.container) {
      return
    }

    // 使用保存的函数引用来移除事件监听器
    if (this.boundHandleClick) {
      off(this.container, 'click', this.boundHandleClick)
    }
    if (this.boundHandleMouseEnter) {
      off(this.container, 'mouseenter', this.boundHandleMouseEnter, true)
    }
    if (this.boundHandleMouseLeave) {
      off(this.container, 'mouseleave', this.boundHandleMouseLeave, true)
    }

    if (this.keyboardEnabled) {
      if (this.boundHandleKeydown) {
        off(this.container, 'keydown', this.boundHandleKeydown)
      }
      if (this.boundHandleFocus) {
        off(this.container, 'focus', this.boundHandleFocus, true)
      }
      if (this.boundHandleBlur) {
        off(this.container, 'blur', this.boundHandleBlur, true)
      }
    }

    this.container = null
  }

  /**
   * 处理点击事件
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const menuItem = closest(target, '[data-menu-item-id]')

    if (menuItem) {
      const itemId = getData(menuItem, 'menu-item-id')
      if (itemId && this.config.onItemClick) {
        this.config.onItemClick(itemId, event)
      }
    }
  }

  /**
   * 处理鼠标进入事件
   */
  private handleMouseEnter(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const menuItem = closest(target, '[data-menu-item-id]')

    if (menuItem) {
      const itemId = getData(menuItem, 'menu-item-id')
      if (itemId && this.config.onItemHover) {
        this.config.onItemHover(itemId, event)
      }
    }
  }

  /**
   * 处理鼠标离开事件
   */
  private handleMouseLeave(event: MouseEvent): void {
    // 可以在这里处理鼠标离开逻辑
  }

  /**
   * 处理聚焦事件
   */
  private handleFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement
    const menuItem = closest(target, '[data-menu-item-id]')

    if (menuItem) {
      const itemId = getData(menuItem, 'menu-item-id')
      if (itemId && this.config.onItemFocus) {
        this.config.onItemFocus(itemId, event)
      }
    }
  }

  /**
   * 处理失焦事件
   */
  private handleBlur(event: FocusEvent): void {
    const target = event.target as HTMLElement
    const menuItem = closest(target, '[data-menu-item-id]')

    if (menuItem) {
      const itemId = getData(menuItem, 'menu-item-id')
      if (itemId && this.config.onItemBlur) {
        this.config.onItemBlur(itemId, event)
      }
    }
  }

  /**
   * 处理键盘事件
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (!this.container) {
      return
    }

    const target = event.target as HTMLElement
    const menuItem = closest(target, '[data-menu-item-id]')

    if (!menuItem) {
      return
    }

    const itemId = getData(menuItem, 'menu-item-id')
    if (!itemId) {
      return
    }

    const handler = createKeyboardHandler({
      [KeyCode.ARROW_UP]: (e) => {
        e.preventDefault()
        focusPrevious(this.container!, menuItem)
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.ARROW_UP, itemId, e)
        }
      },
      [KeyCode.ARROW_DOWN]: (e) => {
        e.preventDefault()
        focusNext(this.container!, menuItem)
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.ARROW_DOWN, itemId, e)
        }
      },
      [KeyCode.ARROW_LEFT]: (e) => {
        e.preventDefault()
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.ARROW_LEFT, itemId, e)
        }
      },
      [KeyCode.ARROW_RIGHT]: (e) => {
        e.preventDefault()
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.ARROW_RIGHT, itemId, e)
        }
      },
      [KeyCode.ENTER]: (e) => {
        e.preventDefault()
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.ENTER, itemId, e)
        }
      },
      [KeyCode.SPACE]: (e) => {
        e.preventDefault()
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.SPACE, itemId, e)
        }
      },
      [KeyCode.ESC]: (e) => {
        e.preventDefault()
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.ESC, itemId, e)
        }
      },
      [KeyCode.HOME]: (e) => {
        e.preventDefault()
        focusFirst(this.container!)
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.HOME, itemId, e)
        }
      },
      [KeyCode.END]: (e) => {
        e.preventDefault()
        focusLast(this.container!)
        if (this.config.onKeyboardNav) {
          this.config.onKeyboardNav(KeyCode.END, itemId, e)
        }
      },
    })

    handler(event)
  }

  /**
   * 启用键盘导航
   * 
   * @description
   * 动态启用键盘导航功能，支持方向键、Enter、Space等快捷键操作。
   */
  enableKeyboard(): void {
    this.keyboardEnabled = true
    if (this.container && this.boundHandleKeydown) {
      on(this.container, 'keydown', this.boundHandleKeydown)
    }
  }

  /**
   * 禁用键盘导航
   * 
   * @description
   * 动态禁用键盘导航功能，移除键盘事件监听器。
   */
  disableKeyboard(): void {
    this.keyboardEnabled = false
    if (this.container && this.boundHandleKeydown) {
      off(this.container, 'keydown', this.boundHandleKeydown)
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<EventDelegatorConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.detach()
  }
}


