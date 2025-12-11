/**
 * 水平菜单溢出管理器
 * 处理菜单项超出容器宽度时的折叠逻辑
 * @module managers/overflow-manager
 */

import { EventEmitter } from '../utils'

/**
 * 溢出管理器事件
 */
export interface OverflowEventMap {
  /** 溢出状态变化 */
  overflowChange: {
    visibleCount: number
    overflowCount: number
    overflowItemsHtml: string
  }
}

/**
 * 溢出管理器配置
 */
export interface OverflowManagerConfig {
  /**
   * 菜单容器元素
   */
  container: HTMLElement

  /**
   * 菜单列表元素
   */
  listElement: HTMLElement

  /**
   * "更多"按钮的预估宽度
   * @default 80
   */
  moreButtonWidth?: number

  /**
   * 宽度变化阈值（小于此值不触发重新计算）
   * @default 5
   */
  widthThreshold?: number

  /**
   * 防抖延迟（毫秒）
   * @default 50
   */
  debounceDelay?: number
}

/**
 * 水平菜单溢出管理器
 * 自动检测菜单项是否超出容器宽度，并生成溢出菜单的HTML
 */
export class OverflowManager {
  private config: Required<OverflowManagerConfig>
  private emitter = new EventEmitter<OverflowEventMap>()
  private resizeObserver: ResizeObserver | null = null
  private lastContainerWidth = 0
  private isCalculating = false
  private calcDebounceTimer: ReturnType<typeof setTimeout> | null = null
  private isPaused = false

  // 当前状态
  private _visibleCount = -1
  private _overflowItemsHtml = ''

  constructor(config: OverflowManagerConfig) {
    this.config = {
      container: config.container,
      listElement: config.listElement,
      moreButtonWidth: config.moreButtonWidth ?? 80,
      widthThreshold: config.widthThreshold ?? 5,
      debounceDelay: config.debounceDelay ?? 50,
    }

    this.init()
  }

  /**
   * 获取可见菜单项数量（-1 表示全部可见）
   */
  get visibleCount(): number {
    return this._visibleCount
  }

  /**
   * 获取溢出菜单项的HTML
   */
  get overflowItemsHtml(): string {
    return this._overflowItemsHtml
  }

  /**
   * 是否需要显示"更多"按钮
   */
  get showMoreButton(): boolean {
    return this._visibleCount >= 0
  }

  /**
   * 初始化
   */
  private init(): void {
    this.setupResizeObserver()
    // 延迟初始计算，等待DOM渲染完成
    requestAnimationFrame(() => {
      this.lastContainerWidth = this.config.container.offsetWidth
      this.calculate()
    })
  }

  /**
   * 设置 ResizeObserver
   */
  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const newWidth = entry.contentRect.width
        // 只有宽度真正变化时才重新计算
        if (Math.abs(newWidth - this.lastContainerWidth) > this.config.widthThreshold) {
          this.lastContainerWidth = newWidth
          this.calculate()
        }
      }
    })
    this.resizeObserver.observe(this.config.container)
  }

  /**
   * 暂停计算（在弹出层打开时使用）
   */
  pause(): void {
    this.isPaused = true
  }

  /**
   * 恢复计算
   */
  resume(): void {
    this.isPaused = false
  }

  /**
   * 触发计算（带防抖）
   */
  calculate(): void {
    if (this.isPaused) return

    if (this.calcDebounceTimer) {
      clearTimeout(this.calcDebounceTimer)
    }

    this.calcDebounceTimer = setTimeout(() => {
      this.doCalculate()
    }, this.config.debounceDelay)
  }

  /**
   * 执行计算
   */
  private doCalculate(): void {
    if (this.isCalculating || this.isPaused) return
    this.isCalculating = true

    const { listElement, container, moreButtonWidth } = this.config

    const items = Array.from(listElement.children).filter(
      (el) => !el.classList.contains('l-menu__more')
    ) as HTMLElement[]

    if (items.length === 0) {
      this._visibleCount = -1
      this._overflowItemsHtml = ''
      this.isCalculating = false
      this.emitChange()
      return
    }

    // 暂时移除隐藏标记来测量真实宽度
    items.forEach(item => {
      item.classList.remove('l-menu-item--hidden')
    })

    // 获取父容器的宽度作为可用空间
    const parentElement = container.parentElement
    const availableWidth = parentElement ? parentElement.clientWidth : container.clientWidth

    let totalWidth = 0
    let count = 0

    for (const item of items) {
      const itemWidth = item.offsetWidth
      totalWidth += itemWidth
      // 预留"更多"按钮的空间
      if (totalWidth + moreButtonWidth > availableWidth && count < items.length - 1) {
        break
      }
      count++
    }

    // 如果所有项目都能显示，则不需要"更多"按钮
    if (count >= items.length) {
      this._visibleCount = -1
      this._overflowItemsHtml = ''
      items.forEach(item => item.classList.remove('l-menu-item--hidden'))
    } else {
      const visibleNum = Math.max(1, count)
      this._visibleCount = visibleNum

      // 标记溢出的菜单项并保存HTML
      const htmlParts: string[] = []
      items.forEach((item, index) => {
        if (index >= visibleNum) {
          item.classList.add('l-menu-item--hidden')
          // 克隆并清理HTML
          const clone = item.cloneNode(true) as HTMLElement
          clone.classList.remove('l-menu-item--hidden')
          clone.classList.remove('l-submenu--open')
          htmlParts.push(clone.outerHTML)
        } else {
          item.classList.remove('l-menu-item--hidden')
        }
      })
      this._overflowItemsHtml = htmlParts.join('')
    }

    this.isCalculating = false
    this.emitChange()
  }

  /**
   * 发送变化事件
   */
  private emitChange(): void {
    const overflowCount = this._visibleCount >= 0
      ? Math.max(0, this.getItemCount() - this._visibleCount)
      : 0

    this.emitter.emit('overflowChange', {
      visibleCount: this._visibleCount,
      overflowCount,
      overflowItemsHtml: this._overflowItemsHtml,
    })
  }

  /**
   * 获取菜单项总数
   */
  private getItemCount(): number {
    return Array.from(this.config.listElement.children).filter(
      (el) => !el.classList.contains('l-menu__more')
    ).length
  }

  /**
   * 监听事件
   */
  on<K extends keyof OverflowEventMap>(
    event: K,
    handler: (data: OverflowEventMap[K]) => void
  ): () => void {
    return this.emitter.on(event, handler)
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    if (this.calcDebounceTimer) {
      clearTimeout(this.calcDebounceTimer)
    }
    this.emitter.off('overflowChange')
  }
}

/**
 * 计算弹出层方向
 */
export function calculatePopupDirection(
  triggerElement: HTMLElement,
  minSpaceBelow = 300
): 'top' | 'bottom' {
  const rect = triggerElement.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top

  if (spaceBelow < minSpaceBelow && spaceAbove > spaceBelow) {
    return 'top'
  }
  return 'bottom'
}

/**
 * 处理溢出弹出层中的点击事件（事件委托）
 */
export function handleOverflowPopupClick(
  event: MouseEvent,
  options: {
    onMenuItemClick?: (itemKey: string) => void
    onSubMenuToggle?: (submenu: Element) => void
  }
): void {
  const target = event.target as HTMLElement

  const menuItem = target.closest('.l-menu-item')
  const submenuTitle = target.closest('.l-submenu__title')
  const submenu = target.closest('.l-submenu')

  if (menuItem && !submenu) {
    const itemKey = menuItem.getAttribute('data-key')
    if (itemKey && options.onMenuItemClick) {
      options.onMenuItemClick(itemKey)
    }
  } else if (submenuTitle && submenu) {
    event.stopPropagation()
    if (options.onSubMenuToggle) {
      options.onSubMenuToggle(submenu)
    } else {
      submenu.classList.toggle('l-submenu--open')
    }
  }
}

/**
 * 处理溢出弹出层中的hover事件
 */
export function handleOverflowPopupHover(
  event: MouseEvent,
  container: HTMLElement,
  trigger: 'hover' | 'click' = 'hover'
): void {
  if (trigger !== 'hover') return

  const target = event.target as HTMLElement
  const submenu = target.closest('.l-submenu')

  if (submenu) {
    // 关闭其他同级子菜单
    const siblings = container.querySelectorAll('.l-menu__more-list > .l-submenu')
    siblings.forEach(s => {
      if (s !== submenu) s.classList.remove('l-submenu--open')
    })
    submenu.classList.add('l-submenu--open')
  }
}
