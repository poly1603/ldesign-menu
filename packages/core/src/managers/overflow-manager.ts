/**
 * 水平菜单溢出管理器
 * 处理菜单项超出容器宽度时的折叠逻辑
 * @module managers/overflow-manager
 */

import { EventEmitter } from '../utils'

/** 检查是否为浏览器环境 */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

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

  /**
   * 是否启用
   * @default true
   */
  enabled?: boolean
}

/**
 * 水平菜单溢出管理器
 * 自动检测菜单项是否超出容器宽度，并生成溢出菜单的HTML
 *
 * @example
 * ```ts
 * const manager = new OverflowManager({
 *   container: menuElement,
 *   listElement: menuListElement,
 * })
 *
 * manager.on('overflowChange', (data) => {
 *   console.log('Overflow changed:', data)
 * })
 * ```
 */
export class OverflowManager {
  private config: Required<Omit<OverflowManagerConfig, 'container' | 'listElement'>> & {
    container: HTMLElement | null
    listElement: HTMLElement | null
  }
  private emitter = new EventEmitter<OverflowEventMap>()
  private resizeObserver: ResizeObserver | null = null
  private lastContainerWidth = 0
  private isCalculating = false
  private calcDebounceTimer: ReturnType<typeof setTimeout> | null = null
  private rafId: number | null = null
  private isPaused = false
  private isDestroyed = false

  // 当前状态
  private _visibleCount = -1
  private _overflowItemsHtml = ''

  /**
   * 创建溢出管理器
   * @param config - 配置项
   */
  constructor(config: OverflowManagerConfig) {
    // SSR 兼容性检查
    if (!isBrowser) {
      this.config = {
        container: null,
        listElement: null,
        moreButtonWidth: 80,
        widthThreshold: 5,
        debounceDelay: 50,
        enabled: false,
      }
      return
    }

    // 参数验证
    if (!config.container || !(config.container instanceof HTMLElement)) {
      console.warn('[LMenu] OverflowManager: container 必须是有效的 HTMLElement')
    }
    if (!config.listElement || !(config.listElement instanceof HTMLElement)) {
      console.warn('[LMenu] OverflowManager: listElement 必须是有效的 HTMLElement')
    }

    this.config = {
      container: config.container,
      listElement: config.listElement,
      moreButtonWidth: config.moreButtonWidth ?? 80,
      widthThreshold: config.widthThreshold ?? 5,
      debounceDelay: config.debounceDelay ?? 50,
      enabled: config.enabled ?? true,
    }

    if (this.config.enabled) {
      this.init()
    }
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
    if (!isBrowser || this.isDestroyed) return

    this.setupResizeObserver()
    // 延迟初始计算，等待DOM渲染完成
    this.rafId = requestAnimationFrame(() => {
      if (this.isDestroyed || !this.config.container) return
      this.lastContainerWidth = this.config.container.offsetWidth
      this.calculate()
    })
  }

  /**
   * 设置 ResizeObserver
   */
  private setupResizeObserver(): void {
    if (!isBrowser || !this.config.container) return

    // 检查 ResizeObserver 是否可用
    if (typeof ResizeObserver === 'undefined') {
      console.warn('[LMenu] OverflowManager: ResizeObserver 不可用，溢出检测将不工作')
      return
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      if (this.isDestroyed) return

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
    if (this.isPaused || this.isDestroyed || !this.config.enabled) return

    if (this.calcDebounceTimer) {
      clearTimeout(this.calcDebounceTimer)
    }

    this.calcDebounceTimer = setTimeout(() => {
      this.doCalculate()
    }, this.config.debounceDelay)
  }

  /**
   * 立即执行计算（跳过防抖）
   */
  calculateNow(): void {
    if (this.isPaused || this.isDestroyed || !this.config.enabled) return
    this.doCalculate()
  }

  /**
   * 执行计算
   */
  private doCalculate(): void {
    if (this.isCalculating || this.isPaused || this.isDestroyed) return
    if (!this.config.listElement || !this.config.container) return

    this.isCalculating = true

    try {
      const { listElement, container, moreButtonWidth } = this.config

      const items = Array.from(listElement.children).filter(
        (el) => !el.classList.contains('l-menu__more')
      ) as HTMLElement[]

      if (items.length === 0) {
        this._visibleCount = -1
        this._overflowItemsHtml = ''
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

      // 无效宽度时跳过计算
      if (availableWidth <= 0) {
        return
      }

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

      this.emitChange()
    } finally {
      this.isCalculating = false
    }
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
   * 重置状态
   */
  reset(): void {
    this._visibleCount = -1
    this._overflowItemsHtml = ''
    this.emitChange()
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<Pick<OverflowManagerConfig, 'moreButtonWidth' | 'widthThreshold' | 'debounceDelay'>>): void {
    if (config.moreButtonWidth !== undefined) {
      this.config.moreButtonWidth = config.moreButtonWidth
    }
    if (config.widthThreshold !== undefined) {
      this.config.widthThreshold = config.widthThreshold
    }
    if (config.debounceDelay !== undefined) {
      this.config.debounceDelay = config.debounceDelay
    }
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    if (this.isDestroyed) return
    this.isDestroyed = true

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    if (this.calcDebounceTimer) {
      clearTimeout(this.calcDebounceTimer)
      this.calcDebounceTimer = null
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.emitter.clear()
    this.config.container = null
    this.config.listElement = null
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
